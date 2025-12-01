// Rubric #12: ES Module use (Importing from utils.js)
import { calculateDaysBetween, fetchData, capitalizeWords } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. GLOBAL FUNCTIONALITY
    // ============================================================
    
    // Update Copyright and Modified Date
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    const modifiedSpan = document.getElementById('last-modified');
    if (modifiedSpan) modifiedSpan.textContent = document.lastModified;

    // Mobile Menu Toggle
    const menuButton = document.getElementById('menu-button');
    const navLinks = document.getElementById('nav-links');
    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const isOpen = navLinks.classList.contains('open');
            menuButton.textContent = isOpen ? '✕' : '☰';
            menuButton.setAttribute('aria-expanded', isOpen);
        });
    }

    // ============================================================
    // 2. PAGE SPECIFIC LOGIC
    // ============================================================
    
    // --- JOIN PAGE ---
    if (document.querySelector('.join-main')) {
        // Timestamp for hidden input
        const timestampInput = document.getElementById('form-load-time');
        if (timestampInput) timestampInput.value = new Date().toISOString();

        // Modals Logic (Rubric #10)
        const modals = document.querySelectorAll('.modal');
        const buttons = document.querySelectorAll('.learn-more-btn');
        const closes = document.querySelectorAll('.close-button');

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = e.target.closest('.level-card').dataset.level; // e.g., "Gold"
                const modal = document.getElementById(`modal-${level.toLowerCase()}`);
                if (modal) modal.style.display = 'block';
            });
        });

        closes.forEach(span => {
            span.addEventListener('click', () => {
                modals.forEach(m => m.style.display = 'none');
            });
        });

        window.onclick = (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        };
    }

    // --- THANK YOU PAGE (Rubric #7: Display Form Data) ---
    const resultsContainer = document.getElementById('results');
    if (resultsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Helper to append data
        const addResult = (label, key) => {
            const value = urlParams.get(key);
            if (value) {
                const p = document.createElement('p');
                p.innerHTML = `<strong>${label}:</strong> ${value}`;
                resultsContainer.appendChild(p);
            }
        };

        if (Array.from(urlParams).length > 0) {
            addResult('Nombre', 'fname');
            addResult('Apellido', 'lname');
            addResult('Email', 'email');
            addResult('Teléfono', 'phone');
            addResult('Empresa', 'business');
            addResult('Membresía', 'membership-level');
            addResult('Fecha Solicitud', 'form-load-time');
        } else {
            resultsContainer.innerHTML = '<p>No se encontraron datos de envío.</p>';
        }
    }

    // --- DIRECTORY PAGE ---
    const directoryContainer = document.getElementById('directory-container');
    if (directoryContainer) {
        const gridBtn = document.getElementById('grid-view-btn');
        const listBtn = document.getElementById('list-view-btn');
        const url = 'data/members.json';

        // Toggle View
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

        const loadMembers = async () => {
            const data = await fetchData(url);
            if (data && data.members) {
                directoryContainer.innerHTML = '';
                data.members.forEach(member => {
                    const section = document.createElement('section');
                    section.className = 'card member-card';
                    section.innerHTML = `
                        <img src="${member.image}" alt="${member.name} Logo" loading="lazy" width="150" height="100">
                        <div>
                            <h3>${member.name}</h3>
                            <p>${member.address}</p>
                            <p>${member.phone}</p>
                            <a href="${member.website}" target="_blank">Website</a>
                            <p><em>${member.membership_level} Member</em></p>
                        </div>
                    `;
                    directoryContainer.appendChild(section);
                });
            }
        };
        loadMembers();
    }

    // --- DISCOVER PAGE ---
    const discoverGrid = document.getElementById('places-of-interest-grid');
    if (discoverGrid) {
        // Rubric #9: LocalStorage
        const visitMessage = document.getElementById('visit-message');
        const lastVisit = localStorage.getItem('lastVisit');
        const now = Date.now();
        
        if (!lastVisit) {
            visitMessage.textContent = "Welcome! Let us know if you have any questions.";
        } else {
            const days = calculateDaysBetween(parseInt(lastVisit), now);
            if (days < 1) {
                visitMessage.textContent = "Back so soon! Awesome!";
            } else {
                visitMessage.textContent = `You last visited ${days} ${days === 1 ? 'day' : 'days'} ago.`;
            }
        }
        localStorage.setItem('lastVisit', now);

        // Load Places
        const loadPlaces = async () => {
            const data = await fetchData('data/discover-places.json');
            if (data && data.places) {
                discoverGrid.innerHTML = '';
                data.places.forEach(place => {
                    const card = document.createElement('div');
                    card.className = 'card place-card';
                    card.innerHTML = `
                        <h2>${place.name}</h2>
                        <figure>
                            <img src="${place.image}" alt="${place.name}" loading="lazy" width="300" height="200">
                            <figcaption>${place.description}</figcaption>
                        </figure>
                        <button class="learn-more-btn">Learn More</button>
                    `;
                    discoverGrid.appendChild(card);
                });
            }
        };
        loadPlaces();
    }

    // --- HOME PAGE (Weather & Spotlights) ---
    const weatherCard = document.getElementById('weather-card');
    if (weatherCard) {
        // Weather
        const apiKey = '67ee60c3c34a6a70fce5339a14be7ed3';
        const lat = -33.1333, lon = -58.3; // Fray Bentos
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;

        const displayWeather = (current, forecast) => {
            const temp = document.getElementById('current-temp');
            const desc = document.getElementById('current-description');
            const icon = document.getElementById('weather-icon');
            const forecastList = document.getElementById('forecast-list');

            if(current.main) {
                temp.innerHTML = `${Math.round(current.main.temp)}&deg;C`;
                desc.textContent = capitalizeWords(current.weather[0].description);
                icon.setAttribute('src', `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`);
                icon.setAttribute('alt', current.weather[0].description);
            }

            if(forecast.list) {
                forecastList.innerHTML = '';
                // Filter for approx noon next 3 days
                const noonForecasts = forecast.list.filter(x => x.dt_txt.includes('12:00:00')).slice(0, 3);
                noonForecasts.forEach(day => {
                    const date = new Date(day.dt * 1000);
                    const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${capitalizeWords(dayName)}:</strong> ${Math.round(day.main.temp)}&deg;C`;
                    forecastList.appendChild(li);
                });
            }
        };

        const fetchWeather = async () => {
            try {
                const [wRes, fRes] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)]);
                if (wRes.ok && fRes.ok) {
                    displayWeather(await wRes.json(), await fRes.json());
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchWeather();

        // Spotlights (Gold/Silver members)
        const loadSpotlights = async () => {
            const data = await fetchData('data/members.json');
            const container = document.getElementById('spotlight-container');
            if (data && data.members && container) {
                const qualified = data.members.filter(m => m.membership_level === 'Gold' || m.membership_level === 'Silver');
                // Random shuffle
                const shuffled = qualified.sort(() => 0.5 - Math.random()).slice(0, 3);
                
                container.innerHTML = '';
                shuffled.forEach(m => {
                    const div = document.createElement('div');
                    div.className = 'card business-spotlight';
                    div.innerHTML = `
                        <h3>${m.name}</h3>
                        <img src="${m.image}" alt="${m.name}" loading="lazy" width="100" height="auto">
                        <p>${m.phone}</p>
                        <p>${m.address}</p>
                        <a href="${m.website}">Website</a>
                        <p>${m.membership_level} Member</p>
                    `;
                    container.appendChild(div);
                });
            }
        };
        loadSpotlights();
    }
});