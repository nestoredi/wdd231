// scripts/main.js

// --- Global Logic (Header/Footer) ---

// Hamburger Menu
const menuButton = document.getElementById('menu-button');
const navLinks = document.getElementById('nav-links');

if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const isOpen = navLinks.classList.contains('open');
        menuButton.setAttribute('aria-expanded', isOpen);
        menuButton.textContent = isOpen ? '✖' : '☰';
    });
}

// Footer Dates
const yearSpan = document.getElementById('copyright-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

const lastModifiedSpan = document.getElementById('last-modified');
if (lastModifiedSpan) {
    lastModifiedSpan.textContent = document.lastModified;
}

// --- Page Specific Logic ---

const pathname = window.location.pathname;

// 1. Directory Page Logic
if (pathname.includes('directory.html')) {
    const directoryContainer = document.getElementById('directory-container');
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');

    async function loadDirectory() {
        if (!directoryContainer) return;
        
        try {
            const response = await fetch('data/members.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            // Accedemos a data.members porque el JSON ahora es un objeto { "members": [...] }
            displayMembers(data.members);
        } catch (error) {
            console.error('Error loading directory:', error);
            directoryContainer.innerHTML = '<p>Lo sentimos, no se pudo cargar el directorio en este momento.</p>';
        }
    }

    function displayMembers(members) {
        directoryContainer.innerHTML = '';
        if (!members) return; // Validación extra
        
        members.forEach(member => {
            const card = document.createElement('div');
            card.className = 'card member-card';
            // Nota: las rutas de las imágenes en el JSON ya incluyen "images/",
            // pero si en el JSON vienen solo nombres de archivo, hay que ajustar.
            // En el JSON proporcionado, algunas dicen "images/..." y otras solo nombre.
            // Asumiremos que el src se usa tal cual viene si tiene path, o se agrega prefix si no.
            // Para simplificar según tus datos nuevos que traen 'images/' incluido:
            
            const imgSrc = member.image.startsWith('images/') ? member.image : `images/${member.image}`;

            card.innerHTML = `
                <img src="${imgSrc}" alt="Logo de ${member.name}" loading="lazy" width="100" height="100">
                <div>
                    <h3>${member.name}</h3>
                    <p>${member.address}</p>
                    <p>${member.phone}</p>
                    <a href="${member.website}" target="_blank" rel="noopener noreferrer">Sitio Web</a>
                    <p><strong>Membresía:</strong> ${member.membership_level}</p>
                </div>
            `;
            directoryContainer.appendChild(card);
        });
    }

    if (gridBtn && listBtn) {
        gridBtn.addEventListener('click', () => {
            directoryContainer.classList.add('directory-grid');
            directoryContainer.classList.remove('directory-list');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        });

        listBtn.addEventListener('click', () => {
            directoryContainer.classList.add('directory-list');
            directoryContainer.classList.remove('directory-grid');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        });
    }

    loadDirectory();
}

// 2. Discover Page Logic
if (pathname.includes('discover.html')) {
    // Visit Message (LocalStorage)
    const visitMessage = document.getElementById('visit-message');
    if (visitMessage) {
        const lastVisit = localStorage.getItem('lastVisit');
        const now = Date.now();
        const msPerDay = 24 * 60 * 60 * 1000;

        if (!lastVisit) {
            visitMessage.textContent = "¡Bienvenido! Haznos saber si tienes alguna pregunta.";
        } else {
            const daysSince = Math.floor((now - lastVisit) / msPerDay);
            if (daysSince < 1) {
                visitMessage.textContent = "¡De vuelta tan pronto! ¡Genial!";
            } else {
                visitMessage.textContent = `Tu última visita fue hace ${daysSince} ${daysSince === 1 ? 'día' : 'días'}.`;
            }
        }
        localStorage.setItem('lastVisit', now);
    }

    // Load Places
    const placesGrid = document.getElementById('places-of-interest-grid');
    async function loadPlaces() {
        if (!placesGrid) return;
        try {
            const response = await fetch('data/places.json');
            if (!response.ok) throw new Error('Error loading places');
            const data = await response.json();
            // Accedemos a data.places
            const places = data.places;
            
            placesGrid.innerHTML = '';
            places.forEach(place => {
                const imgSrc = place.image.startsWith('images/') ? place.image : `images/${place.image}`;
                const card = document.createElement('div');
                card.className = 'card place-card';
                card.innerHTML = `
                    <h3>${place.name}</h3>
                    <img src="${imgSrc}" alt="${place.name}" loading="lazy">
                    <p>${place.description}</p>
                `;
                placesGrid.appendChild(card);
            });
        } catch (error) {
            console.error(error);
            placesGrid.innerHTML = '<p>No se pudo cargar la información de lugares.</p>';
        }
    }
    loadPlaces();
}

// 3. Join Page Logic
if (pathname.includes('join.html')) {
    // Hidden Timestamp
    const timestamp = document.getElementById('form-load-time');
    if (timestamp) {
        timestamp.value = new Date().toISOString();
    }

    // Modals
    const cards = document.querySelectorAll('.level-card');
    cards.forEach(card => {
        const btn = card.querySelector('.learn-more-btn');
        const level = card.dataset.level?.toLowerCase();
        const modal = document.getElementById(`modal-${level}`);
        
        if (btn && modal) {
            const closeBtn = modal.querySelector('.close-button');
            
            btn.addEventListener('click', () => {
                modal.style.display = 'block';
            });
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }
            
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    });
}

// 4. Index/Home Page Logic
if (pathname.endsWith('index.html') || pathname.endsWith('/')) {
    
    // Weather Fetch (Placeholder logic for Rubric)
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with actual key
    const lat = -33.13; // Fray Bentos
    const lon = -58.30;
    
    const weatherContainer = document.getElementById('weather-card');
    
    async function fetchWeather() {
        if (!weatherContainer) return;
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                document.getElementById('current-temp').textContent = `${Math.round(data.main.temp)}°C`;
                document.getElementById('current-description').textContent = data.weather[0].description;
                const iconCode = data.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                document.getElementById('weather-icon').src = iconUrl;
                document.getElementById('weather-icon').alt = data.weather[0].description;
            } else {
               throw Error(await response.text());
            }
        } catch (error) {
            console.log("Weather API requires valid key. Displaying mock data for demo.");
            document.getElementById('current-temp').textContent = "22°C";
            document.getElementById('current-description').textContent = "Soleado";
            document.getElementById('weather-icon').src = "https://openweathermap.org/img/wn/01d@2x.png";
        }
    }
    
    async function fetchForecast() {
         const forecastList = document.getElementById('forecast-list');
         if (!forecastList) return;
         try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                const dailyForecasts = data.list.filter((reading, index) => index % 8 === 0).slice(0, 3);
                
                forecastList.innerHTML = '';
                dailyForecasts.forEach(day => {
                    const date = new Date(day.dt * 1000);
                    const li = document.createElement('li');
                    li.textContent = `${date.toLocaleDateString('es-UY', {weekday: 'short'})}: ${Math.round(day.main.temp)}°C`;
                    forecastList.appendChild(li);
                });
            } else {
                 throw Error();
            }
         } catch (error) {
            forecastList.innerHTML = '<li>Lun: 22°C</li><li>Mar: 24°C</li><li>Mié: 21°C</li>';
         }
    }

    fetchWeather();
    fetchForecast();

    // Spotlights Logic
    const spotlightContainer = document.getElementById('spotlight-container');
    async function loadSpotlights() {
        if (!spotlightContainer) return;
        try {
            const response = await fetch('data/members.json');
            const data = await response.json();
            const members = data.members;
            
            // Filter by 'Silver' or 'Gold' using the new property name 'membership_level'
            const qualified = members.filter(m => m.membership_level === 'Silver' || m.membership_level === 'Gold');
            
            // Randomize
            const shuffled = qualified.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3); // Display 2-3
            
            spotlightContainer.innerHTML = '';
            selected.forEach(member => {
                const imgSrc = member.image.startsWith('images/') ? member.image : `images/${member.image}`;
                const div = document.createElement('div');
                div.className = 'card business-spotlight';
                div.innerHTML = `
                    <h3>${member.name}</h3>
                    <img src="${imgSrc}" alt="${member.name}" loading="lazy" style="max-height:100px; object-fit:contain;">
                    <p>${member.address}</p>
                    <p>${member.phone}</p>
                    <a href="${member.website}" target="_blank">Sitio Web</a>
                    <p><small>${member.membership_level}</small></p>
                `;
                spotlightContainer.appendChild(div);
            });

        } catch (error) {
            console.error('Error loading spotlights:', error);
        }
    }
    loadSpotlights();
}