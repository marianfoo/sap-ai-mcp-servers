# Automation and Script Guide

This project generates `README.md` from structured data and live GitHub metadata.

## How It Works

1. `data/catalog.json` is the source of truth for categories and curated entries.
2. `scripts/enrich-data.mjs` fetches metadata (`stars`, `lastChange`, fork flag) for all listed repos and writes:
   - `generated/catalog.enriched.json`
3. `scripts/render-readme.mjs` renders `README.md` using:
   - `templates/README.template.md`
   - `data/catalog.json`
   - `generated/catalog.enriched.json`

## License Detection (Best Practice)

The enrich script uses a layered approach to determine repository licenses:

1. Primary source: GitHub REST API repository metadata (`/repos/{owner}/{repo}` -> `license` field).
2. Secondary source: GitHub REST API license endpoint (`/repos/{owner}/{repo}/license`) when the primary value is missing.
3. Raw file fallback: fetches `LICENSE.md`, `LICENSE.txt`, and `LICENSE` directly from `raw.githubusercontent.com` (tries both `main` and `master` branches) and infers the SPDX identifier from file content. Covers repos that use non-standard file names or where GitHub's Licensee detection fails.
4. HTML fallback: GitHub page scraping when no API token is available.

Normalization rules:
- `NOASSERTION`, `UNLICENSED`, `License`, and `Other` are treated as missing.
- Missing licenses are rendered as `NO LICENSE FOUND` in the README.

Why this is best practice:
- The GitHub API is the most reliable machine-readable source.
- The dedicated `/license` endpoint improves coverage for edge cases.
- Raw file fetching catches repos with `LICENSE.md` or non-standard placements.
- Fallback HTML parsing keeps generation resilient when API limits are hit.
- GitHub itself documents that license detection is based on Licensee and SPDX mapping.

References:
- `GET /repos/{owner}/{repo}` (repository metadata, includes `license`)
- `GET /repos/{owner}/{repo}/license` (repository license endpoint)
- GitHub REST API docs for licenses (`Licensee` + SPDX behavior)

## Manual Overrides

Some repositories declare their license only in a README or other non-standard location that automated detection cannot parse. For these cases, metadata can be manually fixed in:

- `data/overrides.json`

Format:

```json
{
  "repos": {
    "owner/repo": {
      "license": "MIT"
    }
  }
}
```

Supported fields: any key present in `repoMetadata` entries (e.g. `license`, `description`).

The overrides are applied as the **final step** of `enrich-data.mjs`, after all automated fetching. They are never overwritten by subsequent automated runs. To add a new override, edit `data/overrides.json` and commit it alongside `catalog.json`.

## Scripts

- `npm run update:data`
  - Runs metadata enrichment only.
- `npm run build:readme`
  - Renders README from template + JSON.
- `npm run build`
  - Full refresh (`update:data` + `build:readme`).

## Local Setup

1. Copy `.env.example` to `.env`.
2. Set `GH_TOKEN` in `.env`.
3. Run `npm run build`.

Notes:
- `GH_TOKEN` is preferred.
- `GITHUB_TOKEN` is accepted as fallback.
- If no token is available, the enrich script falls back to HTML parsing.

## GitHub Workflow

Workflow file:
- `.github/workflows/update-sap-mcp-list.yml`

What it does:
- Runs daily (`06:00 UTC`) and on manual dispatch.
- Uses Node.js 22.
- Runs `npm run build`.
- Commits updated files automatically:
  - `README.md`
  - `generated/catalog.enriched.json`

## Repository Secret Setup

This workflow expects the repository secret:
- `GH_TOKEN`

How to add:
1. Open repository `Settings`.
2. Go to `Secrets and variables` -> `Actions`.
3. Create `New repository secret`.
4. Name: `GH_TOKEN`
5. Value: your GitHub token.

Recommended token scope:
- Public repository read access is sufficient for this project.

## Why Forks Are Excluded

Fork filtering is applied during README rendering.
- Forked repositories are not printed in final tables.
- This keeps the list focused on primary projects.

## Sorting Behavior

Within each category table, entries are sorted by:
1. `Stars` descending
2. `Name` ascending (tie-break)
