// discover.js
document.addEventListener('DOMContentLoaded', () => {
    // Add image loading states and error handling
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = 1;
        });
        
        img.addEventListener('error', function() {
            this.src = 'images/placeholder.webp';
            this.alt = 'Image not available';
        });
        
        // Initial state
        img.style.opacity = 0;
        img.style.transition = 'opacity 0.3s ease';
    });

    // Add intersection observer for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.dataset.src = img.src;
            imageObserver.observe(img);
        });
    }

    // Add visit message functionality
    const visitMessage = document.createElement('div');
    visitMessage.className = 'visit-message';
    visitMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 1000;
        max-width: 300px;
        display: none;
    `;
    
    document.body.appendChild(visitMessage);

    // Track visits
    const lastVisit = localStorage.getItem('lastVisit');
    const currentVisit = new Date().toISOString();
    
    if (!lastVisit) {
        visitMessage.textContent = "Welcome! Let us know if you have any questions.";
        visitMessage.style.display = 'block';
        setTimeout(() => {
            visitMessage.style.display = 'none';
        }, 5000);
    } else {
        const daysBetween = Math.floor((new Date(currentVisit) - new Date(lastVisit)) / (1000 * 60 * 60 * 24));
        
        if (daysBetween === 0) {
            visitMessage.textContent = "Back so soon! Awesome!";
        } else {
            const dayText = daysBetween === 1 ? 'day' : 'days';
            visitMessage.textContent = `You last visited ${daysBetween} ${dayText} ago.`;
        }
        
        visitMessage.style.display = 'block';
        setTimeout(() => {
            visitMessage.style.display = 'none';
        }, 5000);
    }
    
    localStorage.setItem('lastVisit', currentVisit);
});