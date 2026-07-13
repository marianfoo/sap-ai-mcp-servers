#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.json');
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_PACKAGES = new Set(['skill', 'claude-plugin']);

function allEntries(catalog) {
  return [
    ...(catalog.categories || []).flatMap((category) => category.entries || []),
    ...(catalog.skillsAndPlugins || []),
    ...(catalog.adjacentTools || [])
  ];
}

function isValidIsoDate(value) {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const catalog = JSON.parse(await fs.readFile(CATALOG_PATH, 'utf8'));
const entries = allEntries(catalog);
const problems = [];

for (const entry of entries) {
  const label = entry.name || entry.repo || entry.url || 'Unnamed entry';
  if (!isValidIsoDate(entry.addedAt)) {
    problems.push(`${label}: invalid or missing addedAt (${entry.addedAt || 'missing'})`);
  }
}

for (const entry of catalog.skillsAndPlugins || []) {
  const label = entry.name || entry.repo || 'Unnamed entry';
  if (!Array.isArray(entry.packages) || entry.packages.length === 0) {
    problems.push(`${label}: skillsAndPlugins entries need a non-empty packages array`);
    continue;
  }
  for (const pkg of entry.packages) {
    if (!VALID_PACKAGES.has(pkg)) {
      problems.push(`${label}: unknown package "${pkg}" (allowed: ${[...VALID_PACKAGES].join(', ')})`);
    }
  }
}

const repos = (catalog.skillsAndPlugins || []).map((entry) => entry.repo).filter(Boolean);
for (const repo of repos.filter((repo, index) => repos.indexOf(repo) !== index)) {
  problems.push(`${repo}: appears more than once in skillsAndPlugins — use one entry with multiple packages instead`);
}

if (problems.length > 0) {
  console.error('Catalog validation failed:');
  for (const problem of problems) {
    console.error(`  - ${problem}`);
  }
  process.exit(1);
}

console.log(`Validated ${entries.length} catalog entries (addedAt + packages).`);
