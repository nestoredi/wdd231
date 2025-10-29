document.addEventListener('DOMContentLoaded', function() {
    
    // =================================================
    // 1. Copyright Year and Last Modified Date
    // =================================================
    const copyrightYearElement = document.getElementById('copyright-year');
    if (copyrightYearElement) {
        copyrightYearElement.textContent = new Date().getFullYear();
    }

    const lastModifiedElement = document.getElementById('last-modified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }

    // =================================================
    // 2. Hamburger Menu Functionality
    // =================================================
    const menuButton = document.getElementById('menu-button');
    const navLinks = document.getElementById('nav-links');

    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            menuButton.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
        });
    }

    // =================================================
    // 3. Dark Mode Toggle
    // =================================================
    const darkModeToggle = document.querySelector('.dark-mode-switch input[type="checkbox"]');
    const body = document.body;

    const applyTheme = (isDark) => {
        if (isDark) {
            body.classList.add('dark-mode');
            if(darkModeToggle) darkModeToggle.checked = true;
        } else {
            body.classList.remove('dark-mode');
            if(darkModeToggle) darkModeToggle.checked = false;
        }
    };

    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'dark');

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // =================================================
    // 4. Directory View Toggle
    // =================================================
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    const directoryContainer = document.getElementById('directory-container');

    if (gridBtn && listBtn && directoryContainer) {
        gridBtn.addEventListener('click', () => {
            directoryContainer.className = 'directory-grid'; // Resetea las clases y aplica la de grid
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        });

        listBtn.addEventListener('click', () => {
            directoryContainer.className = 'directory-list'; // Resetea y aplica la de lista
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        });
    }

    // =================================================
    // 5. Join Page Form - Hidden Timestamp
    // =================================================
    const formLoadTimeInput = document.getElementById('form-load-time');
    if (formLoadTimeInput) {
        formLoadTimeInput.value = Date.now();
    }
});