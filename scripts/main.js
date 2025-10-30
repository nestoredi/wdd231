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

    // --- Course Data Array ---
    const courses = [
        { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
        { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
        { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: true },
        { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: false },
        { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: false },
        { subject: 'WDD', number: 231, title: 'Frontend Development 1', credits: 2, completed: false }
    ];

    // --- DOM Element References ---
    const courseContainer = document.getElementById('course-cards-container');
    const totalCreditsSpan = document.getElementById('total-credits');
    const filterButtons = document.querySelectorAll('.course-filters button');

    // --- Functions ---
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