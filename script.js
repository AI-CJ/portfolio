// Theme Toggle with localStorage
const themeToggle = document.getElementById('theme-toggle');
function setTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}
themeToggle.addEventListener('click', () => {
  setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
});
setTheme(localStorage.getItem('theme') || 'dark');

// Render Projects from projects.json
fetch('projects.json')
  .then(res => res.json())
  .then(projects => {
    const projectList = document.querySelector('.project-list');
    projectList.innerHTML = projects.map(proj => `
      <div class="project-card">
        <img src="${proj.img}" alt="Screenshot of ${proj.title}" />
        <h3>${proj.title}</h3>
        <p>${proj.description}</p>
        <span class="stack">${proj.stack.join(', ')}</span>
        <ul>
          ${proj.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
        <div class="links">
          ${proj.live ? `<a href="${proj.live}" target="_blank">Live Demo</a>` : ''}
          <a href="${proj.code}" target="_blank">Source</a>
        </div>
      </div>
    `).join('');
  });