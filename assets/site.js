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
  sort: 'recommended',
  advancedFiltersExpanded: null
};

const packageLabels = {
  mcp: 'MCP Server',
  skill: 'AI Skill',
  plugin: 'Claude Plugin',
  tool: 'Adjacent Tool'
};

const signalOptions = [
  { value: 'recent30', label: 'Active 30 days' },
  { value: 'recent90', label: 'Active 90 days' },
  { value: 'stars50', label: '50+ stars' },
  { value: 'stars10', label: '10+ stars' }
];

const validSignalValues = new Set(signalOptions.map((option) => option.value));
const validSortValues = new Set(['recommended', 'added-desc', 'stars-desc', 'updated-desc', 'name-asc', 'category-asc']);
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
  els.filterToggle = document.querySelector('#filterToggle');
  els.resetButton = document.querySelector('#resetButton');
  els.themeToggle = document.querySelector('[data-action="theme-toggle"]');
  els.appShell = document.querySelector('#appShell');
  els.snappedResultsCount = document.querySelector('#snappedResultsCount');
  els.resultsRegion = document.querySelector('.results');
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
    const select = event.target.closest('[data-select-filter]');
    if (!select) return;

    const group = select.dataset.selectFilter;
    state.filters[group].clear();
    if (select.value) state.filters[group].add(select.value);
    applyState();
  });

  document.addEventListener('click', (event) => {
    const navigationItem = event.target.closest('[data-href]');
    if (navigationItem) {
      window.open(navigationItem.dataset.href, '_blank', 'noopener,noreferrer');
      return;
    }

    const entryHeader = event.target.closest('[data-entry-url]');
    if (entryHeader) {
      window.open(entryHeader.dataset.entryUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const themeButton = event.target.closest('[data-action="theme-toggle"]');
    if (themeButton) {
      toggleTheme();
      return;
    }

    const filterToggle = event.target.closest('[data-action="toggle-filters"]');
    if (filterToggle) {
      state.advancedFiltersExpanded = els.advancedFilters.hidden;
      els.advancedFilters.hidden = !state.advancedFiltersExpanded;
      updateFilterToggle();
      return;
    }

    const toggle = event.target.closest('ui5-toggle-button[data-filter]');
    if (toggle) {
      const group = toggle.dataset.filter;
      if (toggle.pressed) {
        state.filters[group].add(toggle.getAttribute('value'));
      } else {
        state.filters[group].delete(toggle.getAttribute('value'));
      }
      applyState();
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
      if (input) input.pressed = false;
      const select = document.querySelector(`[data-select-filter="${group}"]`);
      if (select) select.value = '';
    }
    applyState();
  });

  els.appShell.addEventListener('logo-click', () => {
    window.location.href = './';
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
  document.dispatchEvent(new CustomEvent('catalog-theme-change', { detail: { theme: nextTheme } }));
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
  els.themeToggle.icon = theme === 'dark' ? 'lightbulb' : 'dark-mode';
  els.themeToggle.text = theme === 'dark' ? 'Morning Horizon' : 'Evening Horizon';
  els.themeToggle.setAttribute('aria-label', `Switch to ${nextTheme === 'dark' ? 'Evening' : 'Morning'} Horizon`);
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
    renderFilterControls();
    readUrlState();
    syncControls();
    setResponsiveFilterState();
    applyState({ updateUrl: false });
    els.resultsRegion.setAttribute('aria-busy', 'false');
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
    entries.push(normalizeEntry(entry, 'Adjacent SAP AI Developer Tools', 'adjacent-tools', packageLabels.tool, meta));
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
    `<ui5-option value="">${escapeHtml(allLabel)}</ui5-option>`,
    ...items.map(([value, count]) => `<ui5-option value="${escapeHtml(value)}">${escapeHtml(value)} (${formatNumber(count)})</ui5-option>`)
  ].join('');
}

function optionMarkup(group, value, label, count) {
  const id = `${group}-${slugify(value)}`;
  return `
    <ui5-toggle-button
      id="${id}"
      design="Transparent"
      data-filter="${group}"
      value="${escapeHtml(value)}"
    >${escapeHtml(label)} (${formatNumber(count)})</ui5-toggle-button>
  `;
}

function packageOptionMarkup(value, count) {
  const id = `package-${slugify(value)}`;
  return `
    <ui5-toggle-button
      id="${id}"
      class="package-option"
      design="Transparent"
      data-package="${escapeHtml(value)}"
      data-filter="package"
      value="${escapeHtml(value)}"
    >${escapeHtml(value)} (${formatNumber(count)})</ui5-toggle-button>
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
  if (els.resetButton) els.resetButton.hidden = chips.length === 0;
}

function chipMarkup(group, value, label) {
  return `
    <ui5-tag interactive design="Set2" color-scheme="7" hide-state-icon data-remove-filter="${escapeHtml(`${group}:${value}`)}">
      <ui5-icon slot="icon" name="decline"></ui5-icon>
      ${escapeHtml(label)}
    </ui5-tag>
  `;
}

function renderResults() {
  const total = state.entries.length;
  const count = state.filtered.length;
  const countLabel = `${formatNumber(count)} of ${formatNumber(total)} entries`;
  els.resultsCount.textContent = countLabel;
  els.snappedResultsCount.textContent = countLabel;
  els.emptyState.hidden = count > 0;
  els.results.innerHTML = state.filtered.map(entryCardMarkup).join('');
}

function entryCardMarkup(entry) {
  const repoHref = escapeHtml(entry.url);
  const repoLabel = escapeHtml(entry.linkLabel);
  const notes = entry.notes ? `<p class="entry-notes">${escapeHtml(entry.notes)}</p>` : '';
  const packageStyle = {
    'MCP Server': { icon: 'source-code', color: '6' },
    'AI Skill': { icon: 'lightbulb', color: '8' },
    'Claude Plugin': { icon: 'palette', color: '9' },
    'Adjacent Tool': { icon: 'world', color: '10' }
  }[entry.packageType] || { icon: 'source-code', color: '6' };
  const languageTag = entry.primaryLanguage
    ? `<ui5-tag design="Set2" color-scheme="5" hide-state-icon>${escapeHtml(entry.primaryLanguage)}</ui5-tag>`
    : '';
  const licenseDesign = entry.license === 'NO LICENSE FOUND' ? 'Negative' : 'Neutral';

  return `
    <ui5-card class="entry-card" data-package="${escapeHtml(entry.packageType)}">
      <ui5-card-header
        slot="header"
        title-text="${escapeHtml(entry.name)}"
        subtitle-text="${repoLabel}"
        additional-text="${escapeHtml(formatStars(entry.stars))}"
        interactive
        data-entry-url="${repoHref}"
      >
        <ui5-avatar slot="avatar" icon="${packageStyle.icon}" shape="Square" color-scheme="Accent${packageStyle.color}"></ui5-avatar>
      </ui5-card-header>
      <div class="entry-card__content">
        <p class="entry-purpose">${escapeHtml(entry.purpose)}</p>
        ${notes}
        <div class="entry-tags">
          <ui5-tag design="Set2" color-scheme="${packageStyle.color}" hide-state-icon>${escapeHtml(entry.packageType)}</ui5-tag>
          <ui5-tag design="Set2" color-scheme="7" hide-state-icon>${escapeHtml(entry.type)}</ui5-tag>
          ${languageTag}
          <ui5-tag design="${licenseDesign}" hide-state-icon>${escapeHtml(entry.license)}</ui5-tag>
        </div>
        <div class="entry-metrics">
          <span class="entry-metric"><ui5-icon name="calendar"></ui5-icon><span>Added ${formatDate(entry.addedAt)}</span></span>
          <span class="entry-metric"><ui5-icon name="activities"></ui5-icon><span>Updated ${formatDate(entry.lastChange)}</span></span>
        </div>
      </div>
    </ui5-card>
  `;
}

function resetFilters() {
  state.search = '';
  state.sort = 'recommended';
  state.advancedFiltersExpanded = null;
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
    input.pressed = state.filters[input.dataset.filter].has(input.getAttribute('value'));
  }
  for (const select of document.querySelectorAll('[data-select-filter]')) {
    const group = select.dataset.selectFilter;
    select.value = [...state.filters[group]][0] || '';
  }
}

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  state.search = params.get('q') || '';
  state.sort = validSortValues.has(params.get('sort')) ? params.get('sort') : 'recommended';
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

  const expanded = state.advancedFiltersExpanded ?? hasAdvancedFilters;
  els.advancedFilters.hidden = !expanded;
  updateFilterToggle();
}

function updateFilterToggle() {
  if (!els.filterToggle) return;
  const expanded = !els.advancedFilters.hidden;
  const activeAdvancedCount = ['source', 'signals', 'category', 'language', 'license']
    .reduce((count, group) => count + state.filters[group].size, 0);
  const activeSuffix = activeAdvancedCount > 0 ? ` (${activeAdvancedCount})` : '';
  els.filterToggle.textContent = expanded ? 'Hide filters' : `More filters${activeSuffix}`;
  els.filterToggle.setAttribute('aria-expanded', String(expanded));
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
