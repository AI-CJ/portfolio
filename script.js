// Dark mode toggle (with localStorage)
const themeBtn = document.getElementById('theme-toggle');
function setTheme(t) {
  document.body.classList.toggle('dark', t==='dark');
  localStorage.setItem('theme', t);
  themeBtn.textContent = t==='dark' ? '☀️' : '☾';
}
setTheme(localStorage.getItem('theme')||'light');
themeBtn.onclick = () => setTheme(document.body.classList.contains('dark')?'light':'dark');

// Load and render projects from JSON
fetch('projects.json').then(r=>r.json()).then(projects=>{
  document.getElementById('projects-list').innerHTML = projects.map(p=>`
    <div class="project">
      ${p.img?`<img src="${p.img}" alt="${p.title} Screenshot">`:""}
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <ul>${p.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>
      <div>
        ${p.live?`<a href="${p.live}" target="_blank">Live</a>`:""}
        ${p.code?`<a href="${p.code}" target="_blank">Source</a>`:""}
      </div>
    </div>
  `).join('');
}).catch(()=>{document.getElementById('projects-list').textContent="Failed to load projects."});