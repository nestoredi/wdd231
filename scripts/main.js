// main.js - Common functionality
// Set current year and last modified date
document.getElementById('currentYear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Hamburger menu functionality
const hamburgerBtn = document.getElementById('hamburgerBtn');
const primaryNav = document.getElementById('primaryNav');

hamburgerBtn.addEventListener('click', () => {
    primaryNav.classList.toggle('show');
    hamburgerBtn.innerHTML = primaryNav.classList.contains('show') ? '✕' : '&#9776;';
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && primaryNav.classList.contains('show')) {
        primaryNav.classList.remove('show');
        hamburgerBtn.innerHTML = '&#9776;';
    }
});

// Weather data (mock)
function displayWeather() {
    const forecastContainer = document.querySelector('.forecast');
    if (!forecastContainer) return;
    
    const forecastData = [
        { day: 'Tomorrow', temp: '75°F', condition: 'Partly cloudy' },
        { day: 'Wednesday', temp: '68°F', condition: 'Rainy' },
        { day: 'Thursday', temp: '73°F', condition: 'Sunny' }
    ];
    
    forecastData.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        dayElement.innerHTML = `
            <h4>${day.day}</h4>
            <div class="temp">${day.temp}</div>
            <div class="condition">${day.condition}</div>
        `;
        forecastContainer.appendChild(dayElement);
    });
}

// Business spotlights (mock data)
function displayBusinessSpotlights() {
    const spotlightContainer = document.querySelector('.spotlight-container');
    if (!spotlightContainer) return;
    
    const businesses = [
        { 
            name: 'Los Alamos Winery', 
            description: 'Family vineyards producing quality wines since 1985.', 
            image: 'images/business1.jpg',
            type: 'Wineries'
        },
        { 
            name: 'Río Negro Meat Packing', 
            description: 'Beef processing and export to international markets.', 
            image: 'images/business2.jpg',
            type: 'Agribusiness'
        },
        { 
            name: 'TechSolutions', 
            description: 'IT services and software development for local businesses.', 
            image: 'images/business3.jpg',
            type: 'Technology'
        }
    ];
    
    businesses.forEach(business => {
        const card = document.createElement('div');
        card.className = 'spotlight-card';
        card.innerHTML = `
            <img src="${business.image}" alt="${business.name}" loading="lazy">
            <div class="spotlight-content">
                <h3>${business.name}</h3>
                <p class="business-type">${business.type}</p>
                <p>${business.description}</p>
            </div>
        `;
        spotlightContainer.appendChild(card);
    });
}

// Events (mock data)
function displayEvents() {
    const eventsContainer = document.querySelector('.events-container');
    if (!eventsContainer) return;
    
    const events = [
        { 
            title: 'Business Networking', 
            date: 'October 15, 2023', 
            location: 'Convention Center', 
            description: 'Connect with other local business owners.'
        },
        { 
            title: 'Export Workshop', 
            date: 'October 22, 2023', 
            location: 'Municipal Hall', 
            description: 'Learn how to export your products abroad.'
        },
        { 
            title: 'Job Fair', 
            date: 'November 5, 2023', 
            location: 'Main Square', 
            description: 'Find talent for your company.'
        }
    ];
    
    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <h3>${event.title}</h3>
            <p class="event-date"><strong>Date:</strong> ${event.date}</p>
            <p class="event-location"><strong>Location:</strong> ${event.location}</p>
            <p>${event.description}</p>
        `;
        eventsContainer.appendChild(card);
    });
}

// Initialize page elements
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.forecast')) {
        displayWeather();
    }
    
    if (document.querySelector('.spotlight-container')) {
        displayBusinessSpotlights();
    }
    
    if (document.querySelector('.events-container')) {
        displayEvents();
    }
});