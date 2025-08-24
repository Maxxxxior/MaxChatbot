// Initialization
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');

const initialTheme = localStorage.getItem('theme') || 'dark';
setTheme(initialTheme);

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Theme
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const next = (html.dataset.theme === 'dark') ? 'light' : 'dark';
        setTheme(next);
        // updateServiceStatus();
    });
}