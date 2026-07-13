#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.json');
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function allEntries(catalog) {
  return [
    ...(catalog.categories || []).flatMap((category) => category.entries || []),
    ...(catalog.skills || []),
    ...(catalog.claudePlugins || []),
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
const invalid = entries.filter((entry) => !isValidIsoDate(entry.addedAt));

if (invalid.length > 0) {
  console.error('Every catalog entry must have a valid addedAt date in YYYY-MM-DD format:');
  for (const entry of invalid) {
    console.error(`  - ${entry.name || entry.repo || entry.url || 'Unnamed entry'} (${entry.addedAt || 'missing'})`);
  }
  process.exit(1);
}

console.log(`Validated addedAt for ${entries.length} catalog entries.`);
