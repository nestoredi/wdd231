document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Copyright Year and Last Modified Date
    const copyrightYearElement = document.getElementById('copyright-year');
    if (copyrightYearElement) {
        copyrightYearElement.textContent = new Date().getFullYear();
    }
    const lastModifiedElement = document.getElementById('last-modified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }

    // 2. Hamburger Menu Functionality (con mejoras de accesibilidad)
    const menuButton = document.getElementById('menu-button');
    const navLinks = document.getElementById('nav-links');
    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            menuButton.textContent = isOpen ? '✕' : '☰';
            menuButton.setAttribute('aria-expanded', isOpen);
        });
    }

    // 3. Dark Mode Toggle
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
    
    // 4. Directory View Toggle
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    const directoryContainer = document.getElementById('directory-container');
    if (gridBtn && listBtn && directoryContainer) {
        gridBtn.addEventListener('click', () => {
            directoryContainer.className = 'directory-grid'; // Asegura que solo estas clases estén presentes
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        });
        listBtn.addEventListener('click', () => {
            directoryContainer.className = 'directory-list'; // Cambia la clase para la vista de lista
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        });
    }
    
    // --- NUEVO: Carga dinámica de miembros desde JSON ---
    const membersDataUrl = 'data/members.json'; // Ruta al archivo JSON

    // Función para mostrar los miembros en el contenedor
    const displayMembers = (members) => {
        if (!directoryContainer) return;
        directoryContainer.innerHTML = ''; // Limpia el contenido estático o anterior

        members.forEach(member => {
            let card = document.createElement('div');
            card.className = 'card member-card';

            // El contenido de la tarjeta se genera dinámicamente
            card.innerHTML = `
                <img src="${member.image}" alt="Logo de ${member.name}" loading="lazy" width="150" height="auto">
                <div>
                    <h3>${member.name}</h3>
                    <p>${member.address}</p>
                    <p>${member.phone}</p>
                    <a href="${member.website}" target="_blank">Visitar Sitio Web</a>
                    <p class="membership-level">Nivel: ${member.membership_level}</p>
                </div>
            `;
            
            directoryContainer.appendChild(card);
        });
    };

    // Función asíncrona para obtener los datos de los miembros
    const getMembersData = async () => {
        try {
            const response = await fetch(membersDataUrl);
            if (response.ok) {
                const data = await response.json();
                displayMembers(data.members); // Llama a la función para mostrar los datos
            } else {
                throw Error(await response.text());
            }
        } catch (error) {
            console.error('Error al cargar datos de miembros:', error);
            if (directoryContainer) {
                directoryContainer.innerHTML = '<p>Error al cargar el directorio. Por favor, intente más tarde.</p>';
            }
        }
    };

    // Llama a la función para obtener y mostrar los datos cuando la página carga
    // Solo se ejecuta si estamos en la página del directorio
    if (directoryContainer) {
        getMembersData();
    }

    // 5. Join Page Form - Hidden Timestamp
    const formLoadTimeInput = document.getElementById('form-load-time');
    if (formLoadTimeInput) {
        formLoadTimeInput.value = Date.now();
    }
});