document.addEventListener('DOMContentLoaded', function() {

    // --- General Functionality (Always active) ---
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

    // --- Discover Page Functionality ---
    const placesOfInterestGrid = document.getElementById('places-of-interest-grid');
    const visitMessageElement = document.getElementById('visit-message');
    const discoverDataUrl = 'data/discover-places.json';

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

    const displayDiscoverPlaces = (places) => {
        if (!placesOfInterestGrid) return; // Safeguard
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
        if (!placesOfInterestGrid) return; // Safeguard
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
            placesOfInterestGrid.innerHTML = '<p>Error al cargar los lugares de interés. Por favor, inténtalo de nuevo más tarde.</p>';
        }
    };

    if (document.querySelector('main.discover-main')) {
        setupVisitMessage();
        getDiscoverPlacesData();
    }
    
    // --- Directory Page Functionality ---
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    const directoryContainer = document.getElementById('directory-container');
    const membersDataUrl = 'data/members.json'; 

    if (gridBtn && listBtn && directoryContainer) { // Ensure elements exist before adding listeners
        gridBtn.addEventListener('click', () => {
            if (directoryContainer.classList.contains('directory-list')) {
                directoryContainer.classList.replace('directory-list', 'directory-grid');
            } else if (!directoryContainer.classList.contains('directory-grid')) {
                directoryContainer.classList.add('directory-grid'); // Add if neither
            }
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        });

        listBtn.addEventListener('click', () => {
            if (directoryContainer.classList.contains('directory-grid')) {
                directoryContainer.classList.replace('directory-grid', 'directory-list');
            } else if (!directoryContainer.classList.contains('directory-list')) {
                directoryContainer.classList.add('directory-list'); // Add if neither
            }
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        });
    }
    
    const displayMembers = (members) => {
        if (!directoryContainer) return; // Safeguard
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
        if (!directoryContainer) return; // Safeguard
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

    if (document.querySelector('main.directory-main')) { // Run only if on the directory page
        getMembersData();
    }


    // --- Home Page Functionality (Weather and Spotlights) ---
    const isHomePage = document.querySelector('main h1') && document.querySelector('main h1').textContent.includes('Cámara de Comercio');

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
        const weatherAPIKey = '67ee60c3c34a6a70fce5339a14be7ed3'; // ¡TU CLAVE API REAL AQUÍ!
        const lat = -33.1333, lon = -58.3; // Coordenadas de Fray Bentos, Río Negro
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherAPIKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${weatherAPIKey}`;
        
        const weatherCard = document.getElementById('weather-card');
        const currentTempElement = document.getElementById('current-temp');
        const currentDescElement = document.getElementById('current-description');
        const forecastListElement = document.getElementById('forecast-list');

        // Initial loading state
        if (currentTempElement) currentTempElement.textContent = 'Cargando...';
        if (currentDescElement) currentDescElement.textContent = '';
        if (forecastListElement) forecastListElement.innerHTML = '<li>Cargando...</li>';

        if (!weatherCard || !currentTempElement || !currentDescElement || !forecastListElement) {
            console.warn('Weather elements not found on the page, skipping weather data fetch.');
            return; // Exit if essential elements are missing
        }

        try {
            const [weatherResponse, forecastResponse] = await Promise.all([
                fetch(weatherUrl), 
                fetch(forecastUrl)
            ]);

            if (weatherResponse.ok && forecastResponse.ok) {
                displayWeather(await weatherResponse.json(), await forecastResponse.json());
            } else {
                // Log the exact status and text for debugging
                const weatherError = await weatherResponse.text();
                const forecastError = await forecastResponse.text();
                console.error('Failed to fetch weather data:', weatherResponse.status, weatherError);
                console.error('Failed to fetch forecast data:', forecastResponse.status, forecastError);
                throw new Error(`Failed to fetch weather data: ${weatherResponse.status} / ${forecastResponse.status}`);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            // Update UI to show error message
            if (currentTempElement) currentTempElement.textContent = 'Error';
            if (currentDescElement) currentDescElement.textContent = 'al cargar el clima.';
            if (forecastListElement) forecastListElement.innerHTML = '<li>Error al cargar el pronóstico.</li>';
        }
    };

    const displaySpotlights = (members) => {
        const spotlightContainer = document.getElementById('spotlight-container');
        if (!spotlightContainer) return; // Safeguard
        spotlightContainer.innerHTML = ''; // Clear existing content

        const eligibleMembers = members.filter(m => m.membership_level === 'Gold' || m.membership_level === 'Silver');
        const shuffled = eligibleMembers.sort(() => 0.5 - Math.random());
        // Select 2 to 4 members
        const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 2); // Randomly select 2, 3, or 4

        if (selected.length === 0) {
            spotlightContainer.innerHTML = '<p>No hay empresas destacadas disponibles en este momento.</p>';
            return;
        }

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
        const spotlightContainer = document.getElementById('spotlight-container');
        if (!spotlightContainer) return; // Safeguard
        spotlightContainer.innerHTML = '<p>Cargando empresas destacadas...</p>'; // Show loading message

        try {
            const response = await fetch(membersDataUrl);
            if (response.ok) {
                const data = await response.json();
                displaySpotlights(data.members);
            } else {
                const errorText = await response.text();
                console.error('Error loading spotlight data:', response.status, errorText);
                throw Error(errorText);
            }
        } catch (error) {
            console.error('Error loading spotlight data:', error);
            spotlightContainer.innerHTML = '<p>Error al cargar las empresas destacadas. Por favor, inténtalo de nuevo más tarde.</p>';
        }
    };

    if (isHomePage) {
        getWeatherData();
        getSpotlightData();
    }

    // --- Join Page Modals & Form Load Time (Only if on Join page) ---
    const joinMain = document.querySelector('main.join-main');
    if (joinMain) {
        const learnMoreButtons = document.querySelectorAll('.membership-levels .learn-more-btn');
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.close-button');

        learnMoreButtons.forEach(button => {
            button.addEventListener('click', function() {
                const levelCard = this.closest('.level-card');
                const level = levelCard.dataset.level;
                const modalId = `modal-${level.toLowerCase()}`;
                const targetModal = document.getElementById(modalId);
                if (targetModal) {
                    targetModal.style.display = 'block';
                }
            });
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });

        window.addEventListener('click', function(event) {
            modals.forEach(modal => {
                if (event.target === modal) { // Use strict equality
                    modal.style.display = 'none';
                }
            });
        });

        // --- Join Page Form Load Time ---
        const formLoadTimeInput = document.getElementById('form-load-time');
        if (formLoadTimeInput) {
            formLoadTimeInput.value = new Date().toISOString();
        }
    }
});