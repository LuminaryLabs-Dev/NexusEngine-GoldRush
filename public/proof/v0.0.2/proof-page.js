async function main() {
  const page = document.documentElement.dataset.proofGroup;
  const response = await fetch('./registry.json', { cache: 'no-store' });
  const registry = await response.json();
  const group = registry.proofGroups.find((entry) => entry.id === page);
  const kits = registry.kits.filter((kit) => kit.proofGroup === page || group.domains.includes(kit.domain));
  const nav = document.querySelector('nav');
  nav.innerHTML = registry.proofGroups.map((entry) => {
    const active = entry.id === page ? ' aria-current="page"' : '';
    return `<a href="${entry.page}"${active}>${entry.label}</a>`;
  }).join(' / ');
  document.querySelector('[data-proof-title]').textContent = group.label;
  document.querySelector('[data-proof-summary]').textContent = `${kits.length} kits across ${group.domains.join(', ')}`;
  document.querySelector('[data-proof-meta]').textContent = `version ${registry.version} / grouped proof page ${group.id}`;
  const list = document.querySelector('[data-kit-list]');
  for (const kit of kits) {
    const item = document.createElement('article');
    item.className = 'kit-card';
    item.innerHTML = `<h2>${kit.domainPath}</h2><p>${kit.purpose}</p><dl><dt>kind</dt><dd>${kit.kind}</dd><dt>subdomain</dt><dd>${kit.subdomain}</dd><dt>validator</dt><dd>${kit.validator}</dd><dt>dependencies</dt><dd>${kit.dependencies.join(', ') || 'none'}</dd></dl>`;
    list.appendChild(item);
  }
}
main().catch((error) => {
  document.body.dataset.proofError = error.message;
  document.querySelector('[data-proof-summary]').textContent = error.message;
});
