// 1. Declare constants for the JSON URL and the main 'cards' container element.
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

// 2. Create an async function 'getProphetData' to fetch data from the API.
const getProphetData = async () => {
    try {
        // Fetch the data from the URL and wait for the response.
        const response = await fetch(url);
        
        // Check if the response was successful.
        if (response.ok) {
            // Convert the response to a JSON object.
            const data = await response.json();
            
            // Pass the 'prophets' array to the function that will display the cards.
            displayProphets(data.prophets);
        } else {
            // If the response is not ok, throw an error.
            throw Error(await response.text());
        }
    } catch (error) {
        // Log any errors to the console for debugging.
        console.error('Error fetching data:', error);
    }
};

// 3. Define the 'displayProphets' function to build and display the cards.
const displayProphets = (prophets) => {
    // Loop through each prophet object in the array using forEach.
    prophets.forEach((prophet) => {
        // Create the necessary HTML elements for a single card.
        let card = document.createElement('section');
        let fullName = document.createElement('h2');
        let birthDate = document.createElement('p');
        let birthPlace = document.createElement('p');
        let portrait = document.createElement('img');

        // Populate the content of the elements with data from the prophet object.
        fullName.textContent = `${prophet.firstname} ${prophet.lastname}`;
        birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
        birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;

        // Set the attributes for the image element.
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.firstname} ${prophet.lastname}`);
        portrait.setAttribute('loading', 'lazy'); // Lazy loading for better performance.
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');

        // Append the elements to the card ('section').
        card.appendChild(fullName);
        card.appendChild(birthDate);
        card.appendChild(birthPlace);
        card.appendChild(portrait);

        // Finally, append the completed card to the main 'cards' div.
        cards.appendChild(card);
    });
};

// 4. Call the getProphetData function to start the entire process.
getProphetData();```