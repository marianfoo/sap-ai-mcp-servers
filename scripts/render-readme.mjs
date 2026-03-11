#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.json');
const ENRICHED_PATH = path.join(ROOT, 'generated', 'catalog.enriched.json');
const TEMPLATE_PATH = path.join(ROOT, 'templates', 'README.template.md');
const README_PATH = path.join(ROOT, 'README.md');

function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toISOString().slice(0, 10);
}

function formatStars(stars) {
  if (typeof stars !== 'number' || !Number.isFinite(stars)) return '-';
  return new Intl.NumberFormat('en-US').format(stars);
}

function formatLicense(license) {
  if (!license || String(license).trim() === '') {
    return '**NO LICENSE FOUND**';
  }
  return String(license).trim();
}

function repositoryLink(entry, meta) {
  if (!entry.repo) {
    const url = entry.url || '#';
    const label = entry.linkLabel || entry.name || url;
    return `[${label}](${url})`;
  }
  const url = entry.displayUrl || meta?.htmlUrl || `https://github.com/${entry.repo}`;
  const label = entry.repoPath ? `${entry.repo}/${entry.repoPath}` : entry.repo;
  return `[${label}](${url})`;
}

function renderTable(entries, repoMetadata, opts = {}) {
  const lines = [];
  const rows = [];
  const excludedForks = [];

  for (const entry of entries) {
    const meta = entry.repo ? repoMetadata[entry.repo] || null : null;

    if (entry.repo && meta?.fork) {
      excludedForks.push({ entry, meta });
      continue;
    }

    rows.push({ entry, meta });
  }

  rows.sort((a, b) => {
    const starsA = typeof a.meta?.stars === 'number' ? a.meta.stars : -1;
    const starsB = typeof b.meta?.stars === 'number' ? b.meta.stars : -1;
    if (starsA !== starsB) return starsB - starsA;
    return a.entry.name.localeCompare(b.entry.name);
  });

  if (rows.length === 0) {
    lines.push('_No entries available after fork filtering._');
    if (excludedForks.length > 0) {
      lines.push('');
      lines.push(`_Excluded forks: ${excludedForks.length}_`);
    }
    return lines.join('\n');
  }

  lines.push('| Name | Repository | Purpose | License | Stars | Last Change |');
  lines.push('| --- | --- | --- | --- | ---: | --- |');

  for (const row of rows) {
    const { entry, meta } = row;
    lines.push(
      `| ${entry.name} | ${repositoryLink(entry, meta)} | ${entry.purpose} | ${formatLicense(meta?.license)} | ${formatStars(meta?.stars)} | ${formatDate(meta?.lastChange)} |`
    );
  }

  if (excludedForks.length > 0 && opts.showExcludedNote) {
    lines.push('');
    lines.push(`_Excluded forks: ${excludedForks.length}_`);
  }

  return lines.join('\n');
}

async function renderReadme() {
  console.log('Rendering README...');
  const [catalogRaw, enrichedRaw, templateRaw] = await Promise.all([
    fs.readFile(CATALOG_PATH, 'utf8'),
    fs.readFile(ENRICHED_PATH, 'utf8'),
    fs.readFile(TEMPLATE_PATH, 'utf8')
  ]);

  const catalog = JSON.parse(catalogRaw);
  const enriched = JSON.parse(enrichedRaw);
  const repoMetadata = enriched.repoMetadata || {};

  let rendered = templateRaw;

  const generatedDate = formatDate(enriched.generatedAt);
  rendered = rendered.replaceAll('{{LAST_UPDATED}}', generatedDate);

  const categoryCount = (catalog.categories || []).length;
  for (let i = 0; i < categoryCount; i++) {
    const category = catalog.categories[i];
    const placeholder = `{{CATEGORY:${category.id}}}`;
    const table = renderTable(category.entries || [], repoMetadata);
    const description = category.description && String(category.description).trim();
    const block = description ? `${description}\n\n${table}` : table;
    rendered = rendered.replaceAll(placeholder, block);
    process.stdout.write(`  Rendered category: ${category.id}\n`);
  }

  rendered = rendered.replaceAll('{{SKILLS_TABLE}}', renderTable(catalog.skills || [], repoMetadata));
  rendered = rendered.replaceAll('{{ADJACENT_TABLE}}', renderTable(catalog.adjacentTools || [], repoMetadata));

  await fs.writeFile(README_PATH, rendered.trimEnd() + '\n', 'utf8');

  console.log(`Wrote ${README_PATH}`);
}

await renderReadme();
