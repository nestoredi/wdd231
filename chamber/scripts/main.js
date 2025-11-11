document.addEventListener('DOMContentLoaded', function() {

    // --- Discover Page Functionality ---
    const placesOfInterestGrid = document.getElementById('places-of-interest-grid');
    const visitMessageElement = document.getElementById('visit-message');

    const setupVisitMessage = () => {
        if (!visitMessageElement) return;

        const lastVisit = localStorage.getItem('lastVisitTimestamp');
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        let message = "";

        if (!lastVisit) {
            message = "¡Bienvenido! Haznos saber si tienes alguna pregunta.";
        } else {
            const timeDifference = now - parseInt(lastVisit);
            if (timeDifference < oneDay) {
                message = "¡Qué bueno verte de nuevo tan pronto!";
            } else {
                const days = Math.round(timeDifference / oneDay);
                message = `Tu última visita fue hace ${days} ${days === 1 ? 'día' : 'días'}.`;
            }
        }
        visitMessageElement.textContent = message;
        localStorage.setItem('lastVisitTimestamp', now.toString());
    };

    const discoverDataUrl = 'data/discover-places.json';

    const displayDiscoverPlaces = (places) => {
        if (!placesOfInterestGrid) return;
        placesOfInterestGrid.innerHTML = '';

        places.forEach((place) => {
            let card = document.createElement('div');
            card.className = 'card place-card';

            card.innerHTML = `
                <h2>${place.name}</h2>
                <figure>
                    <img src="${place.image}" alt="${place.name}" loading="lazy" width="300" height="200">
                </figure>
                <p>${place.description}</p>
                <a href="#" class="learn-more-btn">Saber Más</a>
            `;
            placesOfInterestGrid.appendChild(card);
        });
    };

    const getDiscoverPlacesData = async () => {
        if (!placesOfInterestGrid) return;
        try {
            const response = await fetch(discoverDataUrl);
            if (response.ok) {
                const data = await response.json();
                displayDiscoverPlaces(data.places);
            } else {
                throw Error(await response.text());
            }
        } catch (error) {
            console.error('Error loading discover places data:', error);
            if (placesOfInterestGrid) {
                placesOfInterestGrid.innerHTML = '<p>Error al cargar los lugares de interés. Por favor, inténtalo de nuevo más tarde.</p>';
            }
        }
    };

    if (document.querySelector('main.discover-main')) {
        setupVisitMessage();
        getDiscoverPlacesData();
    }
    
    // --- General Functionality ---
    const copyrightYearElement = document.getElementById('copyright-year');
    if (copyrightYearElement) {
        copyrightYearElement.textContent = new Date().getFullYear();
    }
    const lastModifiedElement = document.getElementById('last-modified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }

    const menuButton = document.getElementById('menu-button');
    const navLinks = document.getElementById('nav-links');
    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            menuButton.textContent = isOpen ? '✕' : '☰';
            menuButton.setAttribute('aria-expanded', isOpen);
        });
    }

    const darkModeToggle = document.querySelector('.dark-mode-switch input[type="checkbox"]');
    if (darkModeToggle) {
        const applyTheme = (isDark) => {
            document.body.classList.toggle('dark-mode', isDark);
            darkModeToggle.checked = isDark;
        };
        const savedTheme = localStorage.getItem('theme');
        applyTheme(savedTheme === 'dark');
        
        darkModeToggle.addEventListener('change', function() {
            localStorage.setItem('theme', this.checked ? 'dark' : 'light');
            applyTheme(this.checked);
        });
    }
    
    // --- Directory Page ---
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    const directoryContainer = document.getElementById('directory-container');
    if (gridBtn && listBtn && directoryContainer) {
        gridBtn.addEventListener('click', () => {
            directoryContainer.className = 'directory-grid';
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        });
        listBtn.addEventListener('click', () => {
            directoryContainer.className = 'directory-list';
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        });
    }
    
    const membersDataUrl = 'data/members.json'; 

    const displayMembers = (members) => {
        if (!directoryContainer) return;
        directoryContainer.innerHTML = ''; 

        members.forEach(member => {
            let card = document.createElement('div');
            card.className = 'card member-card';
            card.innerHTML = `
                <img src="${member.image}" alt="Logo de ${member.name}" loading="lazy" width="150" height="auto">
                <div>
                    <h3>${member.name}</h3>
                    <p>${member.address}</p>
                    <p>${member.phone}</p>
                    <a href="${member.website}" target="_blank">Visitar Sitio Web</a>
                    <p class="membership-level">Nivel: ${member.membership_level}</p>
                </div>`;
            directoryContainer.appendChild(card);
        });
    };

    const getMembersData = async () => {
        if (!directoryContainer) return;
        try {
            const response = await fetch(membersDataUrl);
            if (response.ok) {
                const data = await response.json();
                displayMembers(data.members); 
            } else {
                throw Error(await response.text());
            }
        } catch (error) {
            console.error('Error loading member data:', error);
            directoryContainer.innerHTML = '<p>Error al cargar el directorio. Por favor, inténtalo de nuevo más tarde.</p>';
        }
    };

    if (directoryContainer) {
        getMembersData();
    }

    // --- Home Page ---
    const displayWeather = (weatherData, forecastData) => {
        const currentTempElement = document.getElementById('current-temp');
        const currentDescElement = document.getElementById('current-description');
        const forecastListElement = document.getElementById('forecast-list');

        if (currentTempElement && currentDescElement) {
            currentTempElement.textContent = `${weatherData.main.temp.toFixed(0)}°C`;
            currentDescElement.textContent = weatherData.weather[0].description.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }

        if (forecastListElement) {
            forecastListElement.innerHTML = '';
            const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            
            const upcomingForecasts = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

            upcomingForecasts.slice(0, 3).forEach(item => {
                const date = new Date(item.dt * 1000);
                const dayName = daysOfWeek[date.getDay()];
                const temp = item.main.temp.toFixed(0);
                
                const li = document.createElement('li');
                li.textContent = `${dayName}: ${temp}°C`;
                forecastListElement.appendChild(li);
            });
        }
    };
    
    const getWeatherData = async () => {
        const weatherAPIKey = 'YOUR_API_KEY'; // Reemplaza con tu clave
        const lat = -33.1333, lon = -58.3;
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherAPIKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${weatherAPIKey}`;
        
        if (!document.getElementById('weather-card')) return;

        try {
            const [weatherResponse, forecastResponse] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)]);
            if (weatherResponse.ok && forecastResponse.ok) {
                displayWeather(await weatherResponse.json(), await forecastResponse.json());
            } else {
                throw new Error("Failed to fetch weather data");
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const displaySpotlights = (members) => {
        const spotlightContainer = document.getElementById('spotlight-container');
        if (!spotlightContainer) return;
        spotlightContainer.innerHTML = '';

        const eligibleMembers = members.filter(m => m.membership_level === 'Gold' || m.membership_level === 'Silver');
        const shuffled = eligibleMembers.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 2);

        selected.forEach(member => {
            let card = document.createElement('div');
            card.className = 'card business-spotlight';
            card.innerHTML = `
                <img src="${member.image}" alt="Logo de ${member.name}" loading="lazy">
                <h3>${member.name}</h3>
                <p>${member.address}</p>
                <hr>
                <a href="${member.website}" target="_blank">${member.website.replace(/(^\w+:|^)\/\//, '')}</a>`;
            spotlightContainer.appendChild(card);
        });
    };

    const getSpotlightData = async () => {
        if (!document.getElementById('spotlight-container')) return;
        try {
            const response = await fetch(membersDataUrl);
            if (response.ok) {
                const data = await response.json();
                displaySpotlights(data.members);
            } else {
                throw Error(await response.text());
            }
        } catch (error) {
            console.error('Error loading spotlight data:', error);
        }
    };

    if (document.querySelector('main h1') && document.querySelector('main h1').textContent.includes('Cámara de Comercio')) {
        getWeatherData();
        getSpotlightData();
    }
});