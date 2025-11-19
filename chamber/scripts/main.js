document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // 1. CRITICAL FUNCTIONALITY (Run immediately)
    // ============================================================

    // --- Join Page Form Load Time (Fix for validation error) ---
    // Movemos esto al principio para asegurar que el valor exista cuando el validador lo revise.
    const formLoadTimeInput = document.getElementById('form-load-time');
    if (formLoadTimeInput) {
        formLoadTimeInput.value = Date.now(); // Usamos Timestamp simple o toISOString()
    }

    // --- Footer Info ---
    const copyrightYearElement = document.getElementById('copyright-year');
    if (copyrightYearElement) {
        copyrightYearElement.textContent = new Date().getFullYear();
    }
    
    const lastModifiedElement = document.getElementById('last-modified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }

    // --- Mobile Navigation ---
    const menuButton = document.getElementById('menu-button');
    const navLinks = document.getElementById('nav-links');
    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            menuButton.textContent = isOpen ? '✕' : '☰';
            menuButton.setAttribute('aria-expanded', isOpen);
        });
    }

    // ============================================================
    // 2. PAGE SPECIFIC LOGIC
    // ============================================================

    // --- Join Page Modals ---
    // Verificamos si estamos en la página de Join buscando un elemento único de esa página
    const joinMain = document.querySelector('.join-main');
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
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    // --- Discover Page Functionality ---
    if (document.querySelector('main.discover-main')) {
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
                    <button class="learn-more-btn">Saber Más</button>
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
                placesOfInterestGrid.innerHTML = '<p>Error al cargar los lugares de interés.</p>';
            }
        };

        setupVisitMessage();
        getDiscoverPlacesData();
    }
    
    // --- Directory Page Functionality ---
    if (document.querySelector('main.directory-main')) {
        const gridBtn = document.getElementById('grid-view-btn');
        const listBtn = document.getElementById('list-view-btn');
        const directoryContainer = document.getElementById('directory-container');
        const membersDataUrl = 'data/members.json'; 

        if (gridBtn && listBtn && directoryContainer) {
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
                }
            } catch (error) {
                console.error('Error loading member data:', error);
            }
        };

        getMembersData();
    }

    // --- Home Page Functionality ---
    // CORRECCIÓN: Detectar Home Page basándose en la existencia del contenedor del clima
    // Esto evita que se ejecute en join.html
    const weatherCard = document.getElementById('weather-card');
    
    if (weatherCard) {
        
        // Weather Functions
        const displayWeather = (weatherData, forecastData) => {
            const currentTempElement = document.getElementById('current-temp');
            const currentDescElement = document.getElementById('current-description');
            const forecastListElement = document.getElementById('forecast-list');

            if (currentTempElement && currentDescElement) {
                currentTempElement.textContent = `${weatherData.main.temp.toFixed(0)}°C`;
                // Capitalize Description
                const desc = weatherData.weather[0].description;
                currentDescElement.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
                
                const iconElement = document.getElementById('weather-icon');
                if(iconElement) {
                    iconElement.setAttribute('src', `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`);
                    iconElement.setAttribute('alt', desc);
                }
            }

            if (forecastListElement) {
                forecastListElement.innerHTML = '';
                // Filter for ~noon for the next few days
                const upcomingForecasts = forecastData.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

                upcomingForecasts.forEach(item => {
                    const date = new Date(item.dt * 1000);
                    // Get day name in Spanish
                    const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);
                    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
                    
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${capitalizedDay}:</strong> ${item.main.temp.toFixed(0)}°C`;
                    forecastListElement.appendChild(li);
                });
            }
        };
        
        const getWeatherData = async () => {
            const weatherAPIKey = '67ee60c3c34a6a70fce5339a14be7ed3';
            const lat = -33.1333, lon = -58.3;
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${weatherAPIKey}`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${weatherAPIKey}`;
            
            try {
                const [weatherResponse, forecastResponse] = await Promise.all([
                    fetch(weatherUrl), 
                    fetch(forecastUrl)
                ]);

                if (weatherResponse.ok && forecastResponse.ok) {
                    displayWeather(await weatherResponse.json(), await forecastResponse.json());
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        // Spotlight Functions
        const displaySpotlights = (members) => {
            const spotlightContainer = document.getElementById('spotlight-container');
            if (!spotlightContainer) return;
            spotlightContainer.innerHTML = '';

            const eligibleMembers = members.filter(m => m.membership_level === 'Gold' || m.membership_level === 'Silver');
            const shuffled = eligibleMembers.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3); // Select up to 3

            selected.forEach(member => {
                let card = document.createElement('div');
                card.className = 'card business-spotlight';
                card.innerHTML = `
                    <img src="${member.image}" alt="Logo de ${member.name}" loading="lazy">
                    <h3>${member.name}</h3>
                    <p>${member.phone}</p>
                    <p>${member.address}</p>
                    <hr>
                    <a href="${member.website}" target="_blank">Visitar Web</a>`;
                spotlightContainer.appendChild(card);
            });
        };

        const getSpotlightData = async () => {
            try {
                const response = await fetch('data/members.json');
                if (response.ok) {
                    const data = await response.json();
                    displaySpotlights(data.members);
                }
            } catch (error) {
                console.error('Error loading spotlight data:', error);
            }
        };

        getWeatherData();
        getSpotlightData();
    }
});