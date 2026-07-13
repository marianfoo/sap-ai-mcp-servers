const state = {
  entries: [],
  filtered: [],
  filters: {
    package: new Set(),
    source: new Set(),
    category: new Set(),
    language: new Set(),
    license: new Set(),
    signals: new Set()
  },
  search: '',
  sort: 'recommended'
};

const packageLabels = {
  mcp: 'MCP Server',
  skill: 'AI Skill',
  plugin: 'Claude Plugin',
  tool: 'Adjacent Tool'
};

const signalOptions = [
  { value: 'recent30', label: 'Updated in 30 days' },
  { value: 'recent90', label: 'Updated in 90 days' },
  { value: 'stars50', label: '50+ stars' },
  { value: 'stars10', label: '10+ stars' }
];

const validSignalValues = new Set(signalOptions.map((option) => option.value));
const SECONDARY_LANGUAGE_MIN_PERCENT = 20;
const SCRIPT_LANGUAGE_FILTER = 'JavaScript / TypeScript';

const els = {};

document.addEventListener('DOMContentLoaded', () => {
  cacheElements();
  initThemeToggle();
  bindEvents();
  loadCatalog();
});

function cacheElements() {
  els.search = document.querySelector('#search');
  els.sort = document.querySelector('#sort');
  els.results = document.querySelector('#results');
  els.resultsCount = document.querySelector('#resultsCount');
  els.activeFilters = document.querySelector('#activeFilters');
  els.emptyState = document.querySelector('#emptyState');
  els.generatedAt = document.querySelector('#generatedAt');
  els.packageFilters = document.querySelector('#packageFilters');
  els.sourceFilters = document.querySelector('#sourceFilters');
  els.signalFilters = document.querySelector('#signalFilters');
  els.categoryFilter = document.querySelector('#categoryFilter');
  els.languageFilter = document.querySelector('#languageFilter');
  els.licenseFilter = document.querySelector('#licenseFilter');
  els.advancedFilters = document.querySelector('#advancedFilters');
  els.themeToggle = document.querySelector('[data-action="theme-toggle"]');
}

function bindEvents() {
  els.search.addEventListener('input', () => {
    state.search = els.search.value.trim();
    applyState();
  });

  els.sort.addEventListener('change', () => {
    state.sort = els.sort.value;
    applyState();
  });

  document.addEventListener('change', (event) => {
    const input = event.target.closest('[data-filter]');
    if (!input) return;

    const group = input.dataset.filter;
    const value = input.value;
    if (input.checked) {
      state.filters[group].add(value);
    } else {
      state.filters[group].delete(value);
    }
    applyState();
  });

  document.addEventListener('change', (event) => {
    const select = event.target.closest('[data-select-filter]');
    if (!select) return;

    const group = select.dataset.selectFilter;
    state.filters[group].clear();
    if (select.value) state.filters[group].add(select.value);
    applyState();
  });

  document.addEventListener('click', (event) => {
    const themeButton = event.target.closest('[data-action="theme-toggle"]');
    if (themeButton) {
      toggleTheme();
      return;
    }

    const clearButton = event.target.closest('[data-action="clear"]');
    if (clearButton) {
      resetFilters();
      return;
    }

    const chip = event.target.closest('[data-remove-filter]');
    if (!chip) return;

    const { group, value } = parseFilterToken(chip.dataset.removeFilter);
    if (group === 'search') {
      state.search = '';
      els.search.value = '';
    } else {
      state.filters[group].delete(value);
      const input = document.querySelector(`[data-filter="${group}"][value="${cssEscape(value)}"]`);
      if (input) input.checked = false;
      const select = document.querySelector(`[data-select-filter="${group}"]`);
      if (select) select.value = '';
    }
    applyState();
  });

  window.addEventListener('resize', () => setResponsiveFilterState());

  window.addEventListener('popstate', () => {
    readUrlState();
    syncControls();
    setResponsiveFilterState();
    applyState({ updateUrl: false });
  });
}

function initThemeToggle() {
  updateThemeToggle();

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener?.('change', () => {
    if (!document.documentElement.dataset.theme) {
      updateThemeToggle();
    }
  });
}

function toggleTheme() {
  const nextTheme = getResolvedTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  try {
    localStorage.setItem('sap-ai-tools-theme', nextTheme);
  } catch (error) {
    // Persisting the preference is best-effort only.
  }
  updateThemeToggle();
}

function getResolvedTheme() {
  const selected = document.documentElement.dataset.theme;
  if (selected === 'dark' || selected === 'light') return selected;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function updateThemeToggle() {
  if (!els.themeToggle) return;

  const theme = getResolvedTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  els.themeToggle.dataset.themeState = theme;
  els.themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
}

async function loadCatalog() {
  try {
    const [catalogRes, enrichedRes] = await Promise.all([
      fetch('data/catalog.json', { cache: 'no-store' }),
      fetch('generated/catalog.enriched.json', { cache: 'no-store' })
    ]);

    if (!catalogRes.ok || !enrichedRes.ok) {
      throw new Error('Catalog files could not be loaded.');
    }

    const [catalog, enriched] = await Promise.all([catalogRes.json(), enrichedRes.json()]);
    state.entries = flattenCatalog(catalog, enriched);
    updateStats(enriched);
    renderFilterControls();
    readUrlState();
    syncControls();
    setResponsiveFilterState();
    applyState({ updateUrl: false });
  } catch (error) {
    els.resultsCount.textContent = 'Catalog could not be loaded.';
    els.results.innerHTML = `
      <div class="empty-state">
        <h2>Catalog data unavailable</h2>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}

function flattenCatalog(catalog, enriched) {
  const meta = enriched.repoMetadata || {};
  const entries = [];

  for (const category of catalog.categories || []) {
    const packageType = category.id === 'sap-skills' ? packageLabels.skill : packageLabels.mcp;
    for (const entry of category.entries || []) {
      entries.push(normalizeEntry(entry, category.title, category.id, packageType, meta));
    }
  }

  for (const entry of catalog.skills || []) {
    entries.push(normalizeEntry(entry, 'AI Skills', 'skills', packageLabels.skill, meta));
  }

  for (const entry of catalog.claudePlugins || []) {
    entries.push(normalizeEntry(entry, 'Claude Plugins', 'claude-plugins', packageLabels.plugin, meta));
  }

  for (const entry of catalog.adjacentTools || []) {
    entries.push(normalizeEntry(entry, 'Libraries, SDKs & Adjacent Tools', 'adjacent-tools', packageLabels.tool, meta));
  }

  const generatedAt = formatDate(enriched.generatedAt);
  if (els.generatedAt && generatedAt !== '-') {
    els.generatedAt.textContent = `Catalog metadata generated ${generatedAt}.`;
  }

  return entries
    .filter((entry) => !entry.fork)
    .map((entry) => ({
      ...entry,
      searchText: [
        entry.name,
        entry.repo,
        entry.linkLabel,
        entry.purpose,
        entry.notes,
        entry.category,
        entry.packageType,
        entry.type,
        entry.primaryLanguage,
        ...entry.languageFilters,
        entry.license
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
    }));
}

function normalizeEntry(entry, category, categoryId, packageType, metadata) {
  const repoMeta = entry.repo ? metadata[entry.repo] || {} : {};
  const url = entry.repo
    ? entry.displayUrl || repoMeta.htmlUrl || `https://github.com/${entry.repo}`
    : entry.url || '#';
  const linkLabel = entry.repoPath && entry.repo ? `${entry.repo}/${entry.repoPath}` : entry.repo || entry.linkLabel || entry.url || entry.name;
  const license = normalizeLicense(repoMeta.license ?? entry.license);
  const lastChange = repoMeta.lastChange ?? entry.lastChange ?? null;
  const addedAt = entry.addedAt ?? null;
  const stars = typeof repoMeta.stars === 'number' ? repoMeta.stars : typeof entry.stars === 'number' ? entry.stars : null;
  const primaryLanguage = normalizeLanguage(repoMeta.primaryLanguage ?? entry.primaryLanguage ?? entry.language);
  const languageFilters = resolveLanguageFilters(repoMeta, primaryLanguage);

  return {
    id: `${categoryId}:${entry.repo || entry.url || entry.name}`,
    name: entry.name,
    type: entry.type || 'Community SAP',
    packageType,
    category,
    categoryId,
    repo: entry.repo || '',
    repoPath: entry.repoPath || '',
    linkLabel,
    url,
    purpose: entry.purpose || '',
    notes: entry.notes || '',
    primaryLanguage,
    languageFilters,
    license,
    stars,
    addedAt,
    addedAtMs: addedAt ? Date.parse(addedAt) : 0,
    lastChange,
    lastChangeMs: lastChange ? Date.parse(lastChange) : 0,
    fork: Boolean(repoMeta.fork),
    exists: repoMeta.exists !== false,
    archived: Boolean(repoMeta.archived)
  };
}

function normalizeLicense(value) {
  const license = value && String(value).trim();
  return license || 'NO LICENSE FOUND';
}

function normalizeLanguage(value) {
  const language = value && String(value).trim();
  return language || '';
}

function languageFilterLabel(language) {
  if (language === 'TypeScript' || language === 'JavaScript') return SCRIPT_LANGUAGE_FILTER;
  return language;
}

function normalizeLanguageBreakdown(languages) {
  if (!languages || typeof languages !== 'object' || Array.isArray(languages)) return [];

  const total = Object.values(languages).reduce((sum, bytes) => {
    const n = Number(bytes);
    return Number.isFinite(n) && n > 0 ? sum + n : sum;
  }, 0);

  if (total <= 0) return [];

  const grouped = new Map();
  for (const [language, bytes] of Object.entries(languages)) {
    const n = Number(bytes);
    if (!Number.isFinite(n) || n <= 0) continue;
    const label = languageFilterLabel(language);
    grouped.set(label, (grouped.get(label) || 0) + (n / total) * 100);
  }

  return [...grouped.entries()]
    .map(([language, percent]) => ({ language, percent }))
    .sort((a, b) => b.percent - a.percent || a.language.localeCompare(b.language));
}

function resolveLanguageFilters(repoMeta, primaryLanguage) {
  const filters = new Set();
  if (primaryLanguage) filters.add(languageFilterLabel(primaryLanguage));

  for (const item of normalizeLanguageBreakdown(repoMeta.languages)) {
    if (item.percent >= SECONDARY_LANGUAGE_MIN_PERCENT) {
      filters.add(item.language);
    }
  }

  return [...filters];
}

function updateStats(enriched) {
  const total = state.entries.length;
  const repoCount = new Set(state.entries.map((entry) => entry.repo).filter(Boolean)).size;
  const sapCount = state.entries.filter((entry) => entry.type === 'SAP').length;
  const recentCount = state.entries.filter((entry) => isWithinDays(entry.lastChangeMs, 90)).length;

  setStat('total', total);
  setStat('repos', repoCount || enriched.repoCount || 0);
  setStat('sap', sapCount);
  setStat('recent', recentCount);
}

function setStat(name, value) {
  const el = document.querySelector(`[data-stat="${name}"]`);
  if (el) el.textContent = formatNumber(value);
}

function renderFilterControls() {
  renderPackageOptions(els.packageFilters, countValues(state.entries, 'packageType'));
  renderOptions(els.sourceFilters, 'source', countValues(state.entries, 'type'), sourceOrder);
  renderSignalOptions();
  renderSelectOptions(els.categoryFilter, countValues(state.entries, 'category'), alphaOrder, 'All categories');
  renderSelectOptions(els.languageFilter, countListValues(state.entries, 'languageFilters'), languageOrder, 'All languages');
  renderSelectOptions(els.licenseFilter, countValues(state.entries, 'license'), licenseOrder, 'All licenses');
}

function renderSignalOptions() {
  const counts = new Map([
    ['recent30', state.entries.filter((entry) => isWithinDays(entry.lastChangeMs, 30)).length],
    ['recent90', state.entries.filter((entry) => isWithinDays(entry.lastChangeMs, 90)).length],
    ['stars50', state.entries.filter((entry) => Number(entry.stars) >= 50).length],
    ['stars10', state.entries.filter((entry) => Number(entry.stars) >= 10).length]
  ]);

  els.signalFilters.innerHTML = signalOptions
    .map((option) => optionMarkup('signals', option.value, option.label, counts.get(option.value) || 0))
    .join('');
}

function renderOptions(container, group, counts, sorter) {
  const items = [...counts.entries()].sort(sorter);
  container.innerHTML = items.map(([value, count]) => optionMarkup(group, value, value, count)).join('');
}

function renderPackageOptions(container, counts) {
  const items = [...counts.entries()].sort(packageOrder);
  container.innerHTML = items.map(([value, count]) => packageOptionMarkup(value, count)).join('');
}

function renderSelectOptions(select, counts, sorter, allLabel) {
  const items = [...counts.entries()].sort(sorter);
  select.innerHTML = [
    `<option value="">${escapeHtml(allLabel)}</option>`,
    ...items.map(([value, count]) => `<option value="${escapeHtml(value)}">${escapeHtml(value)} (${formatNumber(count)})</option>`)
  ].join('');
}

function optionMarkup(group, value, label, count) {
  const id = `${group}-${slugify(value)}`;
  return `
    <label class="check-option" for="${id}">
      <input id="${id}" type="checkbox" data-filter="${group}" value="${escapeHtml(value)}">
      <span class="check-option__label">${escapeHtml(label)}</span>
      <span class="check-option__count">${formatNumber(count)}</span>
    </label>
  `;
}

function packageOptionMarkup(value, count) {
  const id = `package-${slugify(value)}`;
  return `
    <label class="package-option" for="${id}" data-package="${escapeHtml(value)}">
      <input id="${id}" type="checkbox" data-filter="package" value="${escapeHtml(value)}">
      <span class="package-option__label">${escapeHtml(value)}</span>
      <span class="package-option__count">${formatNumber(count)} entries</span>
    </label>
  `;
}

function countValues(entries, key) {
  const counts = new Map();
  for (const entry of entries) {
    const value = entry[key] || '-';
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return counts;
}

function countListValues(entries, key) {
  const counts = new Map();
  for (const entry of entries) {
    for (const value of entry[key] || []) {
      counts.set(value, (counts.get(value) || 0) + 1);
    }
  }
  return counts;
}

function packageOrder(a, b) {
  const order = [packageLabels.mcp, packageLabels.skill, packageLabels.plugin, packageLabels.tool];
  return order.indexOf(a[0]) - order.indexOf(b[0]);
}

function sourceOrder(a, b) {
  const order = ['SAP', 'Community SAP'];
  return order.indexOf(a[0]) - order.indexOf(b[0]);
}

function licenseOrder(a, b) {
  if (a[0] === 'NO LICENSE FOUND') return 1;
  if (b[0] === 'NO LICENSE FOUND') return -1;
  return b[1] - a[1] || a[0].localeCompare(b[0]);
}

function languageOrder(a, b) {
  const order = [SCRIPT_LANGUAGE_FILTER, 'Python', 'Go', 'Java', 'ABAP'];
  const indexA = order.indexOf(a[0]);
  const indexB = order.indexOf(b[0]);
  if (indexA !== -1 || indexB !== -1) {
    return (indexA === -1 ? Number.POSITIVE_INFINITY : indexA) - (indexB === -1 ? Number.POSITIVE_INFINITY : indexB);
  }
  return b[1] - a[1] || a[0].localeCompare(b[0]);
}

function alphaOrder(a, b) {
  return a[0].localeCompare(b[0]);
}

function applyState(options = {}) {
  const { updateUrl = true } = options;
  const search = state.search.toLowerCase();

  state.filtered = state.entries
    .filter((entry) => !search || entry.searchText.includes(search))
    .filter((entry) => matchesSet(entry.packageType, state.filters.package))
    .filter((entry) => matchesSet(entry.type, state.filters.source))
    .filter((entry) => matchesSet(entry.category, state.filters.category))
    .filter((entry) => matchesAny(entry.languageFilters, state.filters.language))
    .filter((entry) => matchesSet(entry.license, state.filters.license))
    .filter(matchesSignals)
    .sort(sortEntries);

  renderActiveFilters();
  renderResults();
  if (updateUrl) writeUrlState();
}

function matchesSet(value, selected) {
  return selected.size === 0 || selected.has(value);
}

function matchesAny(values, selected) {
  return selected.size === 0 || values.some((value) => selected.has(value));
}

function matchesSignals(entry) {
  const selected = state.filters.signals;
  if (selected.size === 0) return true;
  if (selected.has('recent30') && !isWithinDays(entry.lastChangeMs, 30)) return false;
  if (selected.has('recent90') && !isWithinDays(entry.lastChangeMs, 90)) return false;
  if (selected.has('stars50') && !(Number(entry.stars) >= 50)) return false;
  if (selected.has('stars10') && !(Number(entry.stars) >= 10)) return false;
  return true;
}

function sortEntries(a, b) {
  if (state.sort === 'recommended') {
    return recommendedScore(b) - recommendedScore(a) || compareStars(b, a) || a.name.localeCompare(b.name);
  }
  if (state.sort === 'updated-desc') {
    return b.lastChangeMs - a.lastChangeMs || a.name.localeCompare(b.name);
  }
  if (state.sort === 'added-desc') {
    return b.addedAtMs - a.addedAtMs || a.name.localeCompare(b.name);
  }
  if (state.sort === 'name-asc') {
    return a.name.localeCompare(b.name);
  }
  if (state.sort === 'category-asc') {
    return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
  }

  return compareStars(b, a) || a.name.localeCompare(b.name);
}

function recommendedScore(entry) {
  const packageScore = {
    'MCP Server': 50,
    'AI Skill': 22,
    'Claude Plugin': 18,
    'Adjacent Tool': 8
  }[entry.packageType] || 0;

  const age = daysSince(entry.lastChangeMs);
  const recencyScore = age <= 14 ? 24 : age <= 45 ? 16 : age <= 90 ? 9 : age <= 180 ? 3 : 0;
  const stars = typeof entry.stars === 'number' ? entry.stars : 0;
  const starScore = Math.log2(stars + 1) * 5;
  const licenseScore = entry.license === 'NO LICENSE FOUND' ? -10 : 2;
  const archiveScore = entry.archived ? -12 : 0;

  return packageScore + recencyScore + starScore + licenseScore + archiveScore;
}

function compareStars(a, b) {
  const starsA = typeof a.stars === 'number' ? a.stars : -1;
  const starsB = typeof b.stars === 'number' ? b.stars : -1;
  return starsA - starsB;
}

function renderActiveFilters() {
  const chips = [];
  if (state.search) {
    chips.push(chipMarkup('search', state.search, `Search: ${state.search}`));
  }

  for (const [group, values] of Object.entries(state.filters)) {
    for (const value of values) {
      const label = group === 'signals' ? signalOptions.find((option) => option.value === value)?.label || value : value;
      chips.push(chipMarkup(group, value, label));
    }
  }

  els.activeFilters.innerHTML = chips.join('');
}

function chipMarkup(group, value, label) {
  return `
    <button class="active-chip" type="button" data-remove-filter="${escapeHtml(`${group}:${value}`)}">
      ${escapeHtml(label)}
    </button>
  `;
}

function renderResults() {
  const total = state.entries.length;
  const count = state.filtered.length;
  els.resultsCount.textContent = `${formatNumber(count)} of ${formatNumber(total)} entries`;
  els.emptyState.hidden = count > 0;
  els.results.innerHTML = state.filtered.map(entryCardMarkup).join('');
}

function entryCardMarkup(entry) {
  const licenseClass = entry.license === 'NO LICENSE FOUND' ? ' badge--license-missing' : '';
  const typeClass = entry.type === 'SAP' ? 'badge--sap' : 'badge--community';
  const repoHref = escapeHtml(entry.url);
  const repoLabel = escapeHtml(entry.linkLabel);
  const notes = entry.notes ? `<p class="entry-notes">${escapeHtml(entry.notes)}</p>` : '';
  const languageBadge = entry.primaryLanguage ? `<span class="badge badge--language">${escapeHtml(entry.primaryLanguage)}</span>` : '';

  return `
    <a class="entry-card" href="${repoHref}" target="_blank" rel="noreferrer" data-package="${escapeHtml(entry.packageType)}">
      <div class="entry-card__body">
        <div class="entry-card__top">
          <div class="entry-title">
            <h2>${escapeHtml(entry.name)}</h2>
            <span class="entry-repo">${repoLabel}</span>
          </div>
        </div>

        <p class="entry-purpose">${escapeHtml(entry.purpose)}</p>
        ${notes}

        <div class="entry-meta">
          <span class="badge badge--package">${escapeHtml(entry.packageType)}</span>
          <span class="badge ${typeClass}">${escapeHtml(entry.type)}</span>
          ${languageBadge}
          <span class="badge">${escapeHtml(entry.category)}</span>
          <span class="badge badge--license${licenseClass}">${escapeHtml(entry.license)}</span>
          <span class="metric">${formatStars(entry.stars)}</span>
          <span class="metric">Added ${formatDate(entry.addedAt)}</span>
          <span class="metric">Updated ${formatDate(entry.lastChange)}</span>
        </div>
      </div>
    </a>
  `;
}

function resetFilters() {
  state.search = '';
  state.sort = 'recommended';
  for (const values of Object.values(state.filters)) {
    values.clear();
  }
  syncControls();
  applyState();
  setResponsiveFilterState();
}

function syncControls() {
  els.search.value = state.search;
  els.sort.value = state.sort;
  for (const input of document.querySelectorAll('[data-filter]')) {
    input.checked = state.filters[input.dataset.filter].has(input.value);
  }
  for (const select of document.querySelectorAll('[data-select-filter]')) {
    const group = select.dataset.selectFilter;
    select.value = [...state.filters[group]][0] || '';
  }
}

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  state.search = params.get('q') || '';
  state.sort = params.get('sort') || 'recommended';
  for (const values of Object.values(state.filters)) {
    values.clear();
  }

  for (const group of Object.keys(state.filters)) {
    const values = params.get(group);
    if (!values) continue;
    for (const value of values.split('|').filter(Boolean)) {
      if (group === 'signals' && !validSignalValues.has(value)) continue;
      state.filters[group].add(value);
    }
  }
}

function writeUrlState() {
  const params = new URLSearchParams();
  if (state.search) params.set('q', state.search);
  if (state.sort !== 'recommended') params.set('sort', state.sort);

  for (const [group, values] of Object.entries(state.filters)) {
    if (values.size > 0) {
      params.set(group, [...values].join('|'));
    }
  }

  const query = params.toString();
  const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState(null, '', nextUrl);
}

function parseFilterToken(token) {
  const idx = token.indexOf(':');
  if (idx === -1) return { group: token, value: '' };
  return {
    group: token.slice(0, idx),
    value: token.slice(idx + 1)
  };
}

function setResponsiveFilterState() {
  if (!els.advancedFilters) return;

  const hasAdvancedFilters =
    state.filters.source.size > 0 ||
    state.filters.signals.size > 0 ||
    state.filters.category.size > 0 ||
    state.filters.language.size > 0 ||
    state.filters.license.size > 0;

  if (window.matchMedia('(max-width: 1100px)').matches) {
    els.advancedFilters.open = hasAdvancedFilters;
  } else {
    els.advancedFilters.open = true;
  }
}

function isWithinDays(timestamp, days) {
  if (!timestamp) return false;
  const now = Date.now();
  return now - timestamp <= days * 24 * 60 * 60 * 1000;
}

function daysSince(timestamp) {
  if (!timestamp) return Number.POSITIVE_INFINITY;
  const elapsed = Date.now() - timestamp;
  return Math.max(0, elapsed / (24 * 60 * 60 * 1000));
}

function formatStars(stars) {
  if (typeof stars !== 'number' || !Number.isFinite(stars)) return 'Stars -';
  return `${formatNumber(stars)} stars`;
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value || 0);
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toISOString().slice(0, 10);
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cssEscape(value) {
  if (window.CSS && typeof window.CSS.escape === 'function') {
    return window.CSS.escape(value);
  }
  return String(value).replace(/"/g, '\\"');
}
