// directory.js
document.addEventListener('DOMContentLoaded', () => {
    const businessContainer = document.getElementById('businessContainer');
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    // Business data (4 fictional members as requested)
    const businesses = [
        {
            id: 1,
            name: "TechSolutions Río Negro",
            address: "Av. Uruguay 1234, Fray Bentos",
            phone: "+598 4562 1234",
            website: "www.techsolutions.com.uy",
            image: "images/business1.webp",
            category: "technology",
            description: "IT services and software development for local businesses."
        },
        {
            id: 2,
            name: "Los Alamos Winery",
            address: "Route 24 km 12, Young",
            phone: "+598 4568 5678",
            website: "www.losalamoswinery.com",
            image: "images/business2.webp",
            category: "agriculture",
            description: "Family vineyards producing quality wines since 1985."
        },
        {
            id: 3,
            name: "Río Negro Meat Packing",
            address: "Industrial Zone, Fray Bentos",
            phone: "+598 4562 9876",
            website: "www.rionegromeat.com",
            image: "images/business3.webp",
            category: "manufacturing",
            description: "Beef processing and export to international markets."
        },
        {
            id: 4,
            name: "Uruguay River Hotel",
            address: "Rambla Costanera 567, Fray Bentos",
            phone: "+598 4562 3456",
            website: "www.uruguayriverhotel.com",
            image: "images/business4.webp",
            category: "tourism",
            description: "4-star hotel with river view and first-class services."
        },
        {
            id: 5,
            name: "Success Supermarket",
            address: "Av. 18 de Julio 890, Fray Bentos",
            phone: "+598 4562 2345",
            website: "www.successsupermarket.com.uy",
            image: "images/business5.webp",
            category: "retail",
            description: "Supermarket chain with the best prices and quality."
        },
        {
            id: 6,
            name: "Business & More Consulting",
            address: "Street 33 456, Fray Bentos",
            phone: "+598 4562 6789",
            website: "www.businessandmore.com",
            image: "images/business6.webp",
            category: "services",
            description: "Business, accounting and financial advisory services."
        }
    ];

    // Display businesses
    function displayBusinesses(businessList = businesses) {
        businessContainer.innerHTML = '';
        
        if (businessList.length === 0) {
            businessContainer.innerHTML = '<p class="no-results">No businesses found matching your criteria.</p>';
            return;
        }
        
        businessList.forEach(business => {
            const businessCard = document.createElement('div');
            businessCard.className = `business-card ${businessContainer.classList.contains('list-view') ? 'list-view' : 'grid-view'}`;
            
            businessCard.innerHTML = `
                <div class="business-image">
                    <img src="${business.image}" alt="${business.name}" loading="lazy">
                </div>
                <div class="business-info">
                    <h3 class="business-name">${business.name}</h3>
                    <div class="business-category">${getCategoryName(business.category)}</div>
                    <p class="business-address">📍 ${business.address}</p>
                    <p class="business-phone">📞 ${business.phone}</p>
                    <p class="business-website">🌐 <a href="https://${business.website}" target="_blank">${business.website}</a></p>
                    <p class="business-description">${business.description}</p>
                </div>
            `;
            
            businessContainer.appendChild(businessCard);
        });
    }

    // Get category name in English
    function getCategoryName(category) {
        const categories = {
            'agriculture': 'Agriculture',
            'technology': 'Technology',
            'retail': 'Retail',
            'services': 'Services',
            'tourism': 'Tourism',
            'manufacturing': 'Manufacturing'
        };
        return categories[category] || category;
    }

    // Filter businesses
    function filterBusinesses() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        
        const filteredBusinesses = businesses.filter(business => {
            const matchesSearch = business.name.toLowerCase().includes(searchTerm) || 
                                 business.description.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || business.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
        
        displayBusinesses(filteredBusinesses);
    }

    // Event listeners
    gridViewBtn.addEventListener('click', () => {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        businessContainer.classList.remove('list-view');
        displayBusinesses();
    });

    listViewBtn.addEventListener('click', () => {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        businessContainer.classList.add('list-view');
        displayBusinesses();
    });

    searchInput.addEventListener('input', filterBusinesses);
    categoryFilter.addEventListener('change', filterBusinesses);

    // Initial display
    displayBusinesses();
});