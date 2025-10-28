// join.js
document.addEventListener('DOMContentLoaded', () => {
    const membershipForm = document.getElementById('membershipForm');
    const membershipLevel = document.getElementById('membershipLevel');
    const selectedLevelDisplay = document.getElementById('selectedLevelDisplay');
    const submitBtn = document.getElementById('submitBtn');
    const levelButtons = document.querySelectorAll('.select-level');

    // Membership level data
    const membershipLevels = {
        'non-profit': {
            name: 'Non-Profit',
            price: 'Free',
            description: 'Ideal for non-profit organizations and small businesses just starting'
        },
        'silver': {
            name: 'Silver',
            price: '$5,000/year',
            description: 'Perfect for growing businesses seeking greater visibility'
        },
        'gold': {
            name: 'Gold',
            price: '$10,000/year',
            description: 'For established businesses seeking maximum impact and leadership'
        }
    };

    // Handle level selection
    levelButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const level = button.getAttribute('data-level');
            
            // Update selected level
            membershipLevel.value = level;
            
            // Update display
            const levelData = membershipLevels[level];
            selectedLevelDisplay.innerHTML = `
                <h3>${levelData.name}</h3>
                <p class="price">${levelData.price}</p>
                <p>${levelData.description}</p>
            `;
            
            // Enable submit button
            submitBtn.disabled = false;
            
            // Update button states
            levelButtons.forEach(btn => {
                btn.textContent = btn === button ? 'Selected' : 'Select';
                btn.disabled = btn === button;
            });
        });
    });

    // Form submission
    membershipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!membershipLevel.value) {
            alert('Please select a membership level');
            return;
        }
        
        // Form validation
        const requiredFields = membershipForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'red';
            } else {
                field.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            alert('Please complete all required fields');
            return;
        }
        
        // In a real application, you would send the form data to a server
        // For this example, we'll just show a success message
        
        const formData = new FormData(membershipForm);
        const data = Object.fromEntries(formData);
        
        console.log('Form submission:', data);
        
        // Show success message
        alert(`Thank you for your membership application ${data.firstName}!\n\nWe have received your application for the ${membershipLevels[data.membershipLevel].name} level. We will contact you shortly to complete the process.`);
        
        // Reset form
        membershipForm.reset();
        selectedLevelDisplay.innerHTML = '<p>Please select a membership level above</p>';
        submitBtn.disabled = true;
        
        // Reset button states
        levelButtons.forEach(btn => {
            btn.textContent = 'Select';
            btn.disabled = false;
        });
    });
});