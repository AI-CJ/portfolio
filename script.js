// Theme toggle with localStorage
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