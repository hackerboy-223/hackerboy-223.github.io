// script.js
document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggler
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  
  themeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });

  // Dynamic Year
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Alert Close
  document.querySelector('.close-btn').addEventListener('click', () => {
    document.querySelector('.alert-card').style.display = 'none';
  });

  // Random Glitch Effect
  setInterval(() => {
    const dates = document.querySelectorAll('.date-glitch');
    dates.forEach(date => {
      date.style.textShadow = `
        ${Math.random() * 5}px ${Math.random() * 5}px ${Math.random() * 10}px rgba(255,0,255,0.5),
        ${Math.random() * -5}px ${Math.random() * -5}px ${Math.random() * 10}px rgba(0,255,255,0.5)
      `;
    });
  }, 100);
});
