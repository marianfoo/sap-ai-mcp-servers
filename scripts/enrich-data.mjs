#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.json');
const OVERRIDES_PATH = path.join(ROOT, 'data', 'overrides.json');
const OUTPUT_PATH = path.join(ROOT, 'generated', 'catalog.enriched.json');
const ENV_PATH = path.join(ROOT, '.env');

const USER_AGENT = 'sap-mcp-list-bot';
const REQUEST_DELAY_MS = 250;

// Prefer GH_TOKEN (requested), keep GITHUB_TOKEN as fallback for compatibility.
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';

function parseCompactNumber(value) {
  if (!value) return null;

  const raw = String(value).trim().toLowerCase().replace(/,/g, '');
  if (!raw) return null;

  if (raw.endsWith('k')) {
    const n = Number.parseFloat(raw.slice(0, -1));
    return Number.isFinite(n) ? Math.round(n * 1000) : null;
  }

  if (raw.endsWith('m')) {
    const n = Number.parseFloat(raw.slice(0, -1));
    return Number.isFinite(n) ? Math.round(n * 1000000) : null;
  }

  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

function normalizeLicense(value) {
  if (!value) return null;

  const raw = String(value).trim();
  if (!raw) return null;

  const upper = raw.toUpperCase();
  if (upper === 'NOASSERTION' || upper === 'UNLICENSED' || upper === 'LICENSE' || upper === 'OTHER') {
    return null;
  }

  return raw;
}

async function loadDotEnvIfPresent() {
  try {
    const raw = await fs.readFile(ENV_PATH, 'utf8');
    const lines = raw.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const idx = trimmed.indexOf('=');
      if (idx <= 0) continue;

      const key = trimmed.slice(0, idx).trim();
      let value = trimmed.slice(idx + 1).trim();

      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env is optional.
  }
}

function collectRepos(catalog) {
  const repos = new Set();

  const collect = (list) => {
    for (const entry of list || []) {
      if (entry.repo) repos.add(entry.repo);
    }
  };

  for (const category of catalog.categories || []) {
    collect(category.entries);
  }

  collect(catalog.cdata?.generic);
  collect(catalog.cdata?.sapWrappers);
  collect(catalog.skills);
  collect(catalog.adjacentTools);

  return Array.from(repos).sort((a, b) => a.localeCompare(b));
}

function emptyMeta(repo, source, htmlUrl) {
  return {
    repo,
    source,
    exists: false,
    fork: null,
    parent: null,
    stars: null,
    lastChange: null,
    archived: null,
    license: null,
    description: null,
    htmlUrl
  };
}

function parseRepoHtml(repo, html) {
  const escapedRepo = repo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const starsFromStargazerLink = html.match(
    new RegExp(`href=\"/${escapedRepo}/stargazers\"[\\s\\S]{0,800}?<strong>([0-9.,kKmM]+)</strong>`, 'i')
  )?.[1];

  const starsFromAltText = html.match(/([0-9.,kKmM]+)\s+users?\s+starred\s+this\s+repository/i)?.[1];

  const stars = parseCompactNumber(starsFromStargazerLink || starsFromAltText || null);

  const lastChange = html.match(/<relative-time[^>]*datetime=\"([^\"]+)\"/i)?.[1] || null;

  const forkParent = html.match(/forked from <a[^>]*>([^<]+)<\/a>/i)?.[1] || null;

  const license =
    normalizeLicense(html.match(/\"preferredFileType\":\"license\"[\s\S]{0,120}?\"tabName\":\"([^\"]+)\"/i)?.[1] || null);

  return {
    repo,
    source: 'html',
    exists: true,
    fork: Boolean(forkParent),
    parent: forkParent,
    stars,
    lastChange,
    archived: null,
    license,
    description: null,
    htmlUrl: `https://github.com/${repo}`
  };
}

async function fetchLicenseFromApi(repo, apiToken) {
  if (!apiToken) return null;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/license`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${apiToken}`,
        'User-Agent': USER_AGENT
      }
    });

    if (!res.ok) return null;

    const data = await res.json();
    return normalizeLicense(data?.license?.spdx_id || data?.license?.name || null);
  } catch {
    return null;
  }
}

/**
 * Infer an SPDX-style license identifier from raw license file text.
 * Covers the most common open-source licenses seen in SAP community repos.
 */
function detectLicenseFromContent(text) {
  const t = text.toLowerCase();

  if (t.includes('apache license') && (t.includes('version 2') || t.includes('v2'))) return 'Apache-2.0';
  if (t.includes('mit license') || (t.includes('permission is hereby granted') && t.includes('without restriction'))) return 'MIT';
  if (t.includes('gnu general public license') && t.includes('version 3')) return 'GPL-3.0';
  if (t.includes('gnu general public license') && t.includes('version 2')) return 'GPL-2.0';
  if (t.includes('gnu lesser general public license') && t.includes('version 3')) return 'LGPL-3.0';
  if (t.includes('gnu lesser general public license') && t.includes('version 2')) return 'LGPL-2.1';
  if (t.includes('mozilla public license') && t.includes('2.0')) return 'MPL-2.0';
  if (t.includes('eclipse public license') && t.includes('2.0')) return 'EPL-2.0';
  if (t.includes('eclipse public license') && t.includes('1.0')) return 'EPL-1.0';
  if (t.includes('bsd 3-clause') || t.includes('bsd 3 clause') || t.includes('neither the name')) return 'BSD-3-Clause';
  if (t.includes('bsd 2-clause') || t.includes('bsd 2 clause')) return 'BSD-2-Clause';
  if (t.includes('isc license') || t.includes('isc ')) return 'ISC';
  if (t.includes('creative commons')) return 'CC-BY-4.0';
  if (t.includes('mit-0') || (t.includes('permission is hereby granted') && !t.includes('without restriction'))) return 'MIT-0';

  return null;
}

/**
 * Last-resort license fallback: fetch LICENSE.md / LICENSE.txt / LICENSE directly
 * from the raw GitHub content. Tries the default branch names used in practice.
 */
async function fetchLicenseFromRawFile(repo) {
  const filenames = ['LICENSE.md', 'LICENSE.txt', 'LICENSE', 'license.md', 'license.txt'];
  const branches = ['main', 'master'];

  for (const branch of branches) {
    for (const filename of filenames) {
      try {
        const res = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/${filename}`, {
          headers: { 'User-Agent': USER_AGENT }
        });

        if (!res.ok) continue;

        const text = await res.text();
        const detected = detectLicenseFromContent(text);
        if (detected) return detected;
      } catch {
        // try next combination
      }
    }
  }

  return null;
}

async function fetchFromApi(repo, apiToken) {
  if (!apiToken) {
    return { status: 'skip' };
  }

  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${apiToken}`,
      'User-Agent': USER_AGENT
    }
  });

  if (res.status === 404) {
    return {
      status: 'ok',
      meta: emptyMeta(repo, 'api', `https://github.com/${repo}`)
    };
  }

  if (!res.ok) {
    return {
      status: 'error',
      httpStatus: res.status,
      rateRemaining: Number.parseInt(res.headers.get('x-ratelimit-remaining') || '-1', 10)
    };
  }

  const data = await res.json();

  let license = normalizeLicense(data.license?.spdx_id || data.license?.name || null);
  if (!license) {
    license = await fetchLicenseFromApi(repo, apiToken);
  }
  // Final fallback: fetch LICENSE.md / LICENSE.txt / LICENSE directly from raw content
  if (!license) {
    license = await fetchLicenseFromRawFile(repo);
  }

  return {
    status: 'ok',
    meta: {
      repo,
      source: 'api',
      exists: true,
      fork: Boolean(data.fork),
      parent: data.parent?.full_name || null,
      stars: data.stargazers_count ?? null,
      lastChange: data.pushed_at || null,
      archived: Boolean(data.archived),
      license,
      description: data.description || null,
      htmlUrl: data.html_url || `https://github.com/${repo}`
    }
  };
}

async function fetchLastChangeFromAtom(repo) {
  try {
    const res = await fetch(`https://github.com/${repo}/commits.atom`, {
      headers: {
        'User-Agent': USER_AGENT
      }
    });

    if (!res.ok) return null;

    const atom = await res.text();

    return (
      atom.match(/<entry>[\s\S]*?<updated>([^<]+)<\/updated>/i)?.[1] ||
      atom.match(/<updated>([^<]+)<\/updated>/i)?.[1] ||
      null
    );
  } catch {
    return null;
  }
}

async function fetchFromHtml(repo) {
  const url = `https://github.com/${repo}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT
    }
  });

  if (res.status === 404) {
    return emptyMeta(repo, 'html', url);
  }

  const html = await res.text();

  if (!res.ok) {
    const out = emptyMeta(repo, 'html', url);
    out.error = `http_${res.status}`;
    return out;
  }

  const parsed = parseRepoHtml(repo, html);

  if (!parsed.lastChange) {
    parsed.lastChange = await fetchLastChangeFromAtom(repo);
  }

  // Final fallback: fetch LICENSE.md / LICENSE.txt / LICENSE directly from raw content
  if (!parsed.license) {
    parsed.license = await fetchLicenseFromRawFile(repo);
  }

  return parsed;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buildEnrichedCatalog() {
  await loadDotEnvIfPresent();
  const authToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || token;

  const catalog = JSON.parse(await fs.readFile(CATALOG_PATH, 'utf8'));
  const repos = collectRepos(catalog);

  console.log(`Enriching metadata for ${repos.length} repositories (API: ${authToken ? 'yes' : 'no'})...`);
  const repoMetadata = {};
  const failedRepos = [];
  let useApi = Boolean(authToken);

  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const progress = `[${i + 1}/${repos.length}]`;
    process.stdout.write(`Fetching ${repo} ${progress}... `);

    let meta = null;

    if (useApi) {
      const api = await fetchFromApi(repo, authToken);

      if (api.status === 'ok') {
        meta = api.meta;
        process.stdout.write(`ok (API)\n`);
      } else if (api.status === 'error' && api.rateRemaining === 0) {
        useApi = false;
        process.stdout.write(`rate limited, falling back to HTML... `);
      } else if (api.status === 'error') {
        process.stdout.write(`API error HTTP ${api.httpStatus}, trying HTML... `);
      }
    }

    if (!meta) {
      try {
        meta = await fetchFromHtml(repo);
        if (meta?.error) {
          failedRepos.push({ repo, reason: meta.error });
          process.stdout.write(`FAILED (${meta.error})\n`);
        } else {
          process.stdout.write(`ok (HTML)\n`);
        }
        await sleep(REQUEST_DELAY_MS);
      } catch (err) {
        failedRepos.push({ repo, reason: err?.message || String(err) });
        process.stdout.write(`FAILED (${err?.message || err})\n`);
      }
    }

    repoMetadata[repo] = meta;
  }

  if (failedRepos.length > 0) {
    console.error(`\nError: ${failedRepos.length} repo(s) failed to fetch:`);
    for (const { repo, reason } of failedRepos) {
      console.error(`  - ${repo}: ${reason}`);
    }
    process.exit(1);
  }

  // Apply manual overrides — these are never overwritten by automated fetching.
  let overrideCount = 0;
  try {
    const overrides = JSON.parse(await fs.readFile(OVERRIDES_PATH, 'utf8'));
    for (const [repo, fields] of Object.entries(overrides.repos || {})) {
      if (!repoMetadata[repo]) continue;
      for (const [key, value] of Object.entries(fields)) {
        repoMetadata[repo][key] = value;
        overrideCount++;
      }
    }
    if (overrideCount > 0) {
      console.log(`Applied ${overrideCount} manual override(s) from data/overrides.json`);
    }
  } catch {
    // overrides.json is optional
  }

  const output = {
    generatedAt: new Date().toISOString(),
    sourceCatalog: 'data/catalog.json',
    repoCount: repos.length,
    tokenUsed: Boolean(authToken),
    repoMetadata
  };

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`\nWrote ${OUTPUT_PATH} with ${repos.length} repositories`);
}

await buildEnrichedCatalog();
