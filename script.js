// Theme toggle with localStorage + system preference + a11y
(() => {
  const themeBtn = document.getElementById('theme-toggle');
  const prefersMq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  const valid = new Set(['light', 'dark']);

  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (valid.has(stored)) return stored;
    return prefersMq && prefersMq.matches ? 'dark' : 'light';
  }

  function setTheme(t) {
    const theme = valid.has(t) ? t : 'light';
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);

    if (themeBtn) {
      // Update button content and a11y
      themeBtn.textContent = theme === 'dark' ? '☀️' : '☾';
      themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }

    // Keep the <meta name="color-scheme"> accurate (helps UA pick form/scrollbar colors)
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? 'dark light' : 'light dark');
  }

  setTheme(getPreferredTheme());

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
    });
  }

  // If user hasn't explicitly set a theme, follow OS changes
  if (prefersMq) {
    prefersMq.addEventListener('change', (e) => {
      const stored = localStorage.getItem('theme');
      if (!valid.has(stored)) setTheme(e.matches ? 'dark' : 'light');
    });
  }

  // Load and render projects from JSON (safe escaping + lazy images)
  const listEl = document.getElementById('projects-list');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));

  if (listEl) {
    listEl.setAttribute('aria-busy', 'true');

    fetch('projects.json', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('Network error');
        return r.json();
      })
      .then((projects) => {
        if (!Array.isArray(projects)) throw new Error('Invalid projects format');

        const html = projects.map((p) => {
          const title = esc(p.title);
          const desc = esc(p.description);
          const bullets = Array.isArray(p.bullets)
            ? `<ul>${p.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`
            : '';
          const img = p.img
            ? `<img src="${esc(p.img)}" alt="${title} screenshot" loading="lazy" decoding="async">`
            : '';
          const live = p.live
            ? `<a href="${esc(p.live)}" target="_blank" rel="noopener noreferrer">Live</a>`
            : '';
          const code = p.code
            ? `<a href="${esc(p.code)}" target="_blank" rel="noopener noreferrer">Source</a>`
            : '';

          return `
            <article class="project">
              ${img}
              <h3>${title}</h3>
              <p>${desc}</p>
              ${bullets}
              <div>
                ${live}
                ${code}
              </div>
            </article>
          `;
        }).join('');

        listEl.innerHTML = html;
      })
      .catch((err) => {
        console.error(err);
        listEl.textContent = 'Failed to load projects.';
      })
      .finally(() => {
        listEl.removeAttribute('aria-busy');
      });
  }
})();