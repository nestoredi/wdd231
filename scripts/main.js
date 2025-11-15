document.addEventListener('DOMContentLoaded', () => {

    // --- Dynamic Footer Content ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const lastModifiedSpan = document.getElementById('last-modified');
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }
    
    // --- Responsive Navigation (Hamburger Menu) ---
    const menuButton = document.getElementById('menu-button');
    const nav = document.querySelector('nav');
    menuButton.addEventListener('click', () => {
        nav.classList.toggle('open');
    });

    // --- Course Data Array (Updated with more details) ---
    const courses = [
        { 
            subject: 'CSE', 
            number: 110, 
            title: 'Introduction to Programming', 
            credits: 2, 
            completed: true,
            description: 'A foundational course on programming principles using Python, covering variables, control structures, and basic data structures.',
            certificate: 'Web and Computer Programming',
            technology: ['Python', 'VS Code']
        },
        { 
            subject: 'WDD', 
            number: 130, 
            title: 'Web Fundamentals', 
            credits: 2, 
            completed: true,
            description: 'An introduction to the basic technologies of the web: HTML for structure and CSS for styling and layout.',
            certificate: 'Web and Computer Programming',
            technology: ['HTML', 'CSS']
        },
        { 
            subject: 'CSE', 
            number: 111, 
            title: 'Programming with Functions', 
            credits: 2, 
            completed: true,
            description: 'Building on introductory programming, this course focuses on writing modular, reusable code using functions.',
            certificate: 'Web and Computer Programming',
            technology: ['Python', 'Functions']
        },
        { 
            subject: 'WDD', 
            number: 131, 
            title: 'Dynamic Web Fundamentals', 
            credits: 2, 
            completed: false,
            description: 'Introduction to JavaScript and the Document Object Model (DOM) to create interactive and dynamic web pages.',
            certificate: 'Web and Computer Programming',
            technology: ['JavaScript', 'DOM']
        },
        { 
            subject: 'CSE', 
            number: 210, 
            title: 'Programming with Classes', 
            credits: 2, 
            completed: false,
            description: 'An exploration of object-oriented programming (OOP) principles, including classes, inheritance, and polymorphism.',
            certificate: 'Web and Computer Programming',
            technology: ['Python', 'OOP']
        },
        { 
            subject: 'WDD', 
            number: 231, 
            title: 'Frontend Development 1', 
            credits: 2, 
            completed: false,
            description: 'Advanced frontend techniques including responsive design, modern CSS, and building interactive user interfaces.',
            certificate: 'Web and Computer Programming',
            technology: ['HTML', 'CSS', 'JavaScript', 'Responsive Design']
        }
    ];

    // --- DOM Element References ---
    const courseContainer = document.getElementById('course-cards-container');
    const totalCreditsSpan = document.getElementById('total-credits');
    const filterButtons = document.querySelectorAll('.course-filters button');
    const courseDetails = document.getElementById('course-details'); // Reference to the dialog element

    // --- Functions ---
    
    /**
     * Displays course details in a modal dialog.
     * @param {object} course - The course object with details to display.
     */
    function displayCourseDetails(course) {
        courseDetails.innerHTML = `
            <button id="closeModal" aria-label="Close dialog">❌</button>
            <h2>${course.subject} ${course.number}</h2>
            <h3>${course.title}</h3>
            <p><strong>Credits</strong>: ${course.credits}</p>
            <p><strong>Certificate</strong>: ${course.certificate}</p>
            <p>${course.description}</p>
            <p><strong>Technologies</strong>: ${course.technology.join(', ')}</p>
        `;
        courseDetails.showModal();
        
        // Add event listener to the new close button
        const closeModalButton = document.getElementById('closeModal');
        closeModalButton.addEventListener("click", () => {
            courseDetails.close();
        });
    }
    
    /**
     * Displays course cards and calculates total credits using reduce.
     * @param {Array} coursesToDisplay - The array of course objects to display.
     */
    function displayCourses(coursesToDisplay) {
        courseContainer.innerHTML = ''; // Clear existing cards

        coursesToDisplay.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';
            if (course.completed) {
                card.classList.add('completed');
            }
            card.textContent = `${course.subject} ${course.number}`;

            // Add click event listener to each card
            card.addEventListener('click', () => {
                displayCourseDetails(course);
            });

            courseContainer.appendChild(card);
        });
        
        // Calculate total credits for the displayed courses using reduce
        const totalCredits = coursesToDisplay.reduce((sum, course) => sum + course.credits, 0);
        totalCreditsSpan.textContent = totalCredits;
    }

    // --- Event Listeners for Filtering ---
    filterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Manage active button style
            filterButtons.forEach(btn => btn.classList.remove('active'));
            event.currentTarget.classList.add('active');

            const filter = event.currentTarget.id;
            let filteredCourses;

            if (filter === 'filter-wdd') {
                filteredCourses = courses.filter(course => course.subject === 'WDD');
            } else if (filter === 'filter-cse') {
                filteredCourses = courses.filter(course => course.subject === 'CSE');
            } else { // 'filter-all'
                filteredCourses = courses;
            }
            
            displayCourses(filteredCourses);
        });
    });

    // --- Initial Page Load ---
    displayCourses(courses); // Display all courses by default
    document.getElementById('filter-all').classList.add('active');

});