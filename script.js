
//Bosses Section//
const bossContainer = document.getElementById('boss-container');
const API_URL = 'https://eldenring.fanapis.com/api/bosses?limit=100'; // Fetch up to 100 bosses

async function fetchBosses() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayBosses(data.data); // The actual boss list is in the 'data' field
    } catch (error) {
        console.error("Could not fetch bosses:", error);
        bossContainer.innerHTML = '<p>Failed to load boss data.</p>';
    }
}

function displayBosses(bosses) {
    bosses.forEach(boss => {
        const bossCard = document.createElement('div');
        bossCard.classList.add('boss-card');

        bossCard.innerHTML = `
            <h2>${boss.name}</h2>
            <img src="${boss.image}" alt="${boss.name}">
            <p><strong>Location:</strong> ${boss.location}</p>
            <p><strong>Health Points:</strong> ${boss.healthPoints || 'N/A'}</p>
            <p><strong>Drops:</strong> ${boss.drops.join(', ') || 'N/A'}</p>
            <p>${boss.description}</p>
        `;

        bossContainer.appendChild(bossCard);
    });
}

// Call the function to fetch and display the bosses when the page loads
fetchBosses();


//Classes
const apiURL = 'https://eldenring.fanapis.com/api/classes';
        const classListElement = document.getElementById('class-list');

        async function fetchClasses() {
            try {
                const response = await fetch(apiURL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                displayClasses(data.data); // The API nests the array under a 'data' key
            } catch (error) {
                console.error('Error fetching Elden Ring classes:', error);
                classListElement.innerHTML = '<p>Failed to load classes. Please try again later.</p>';
            }
        }

        function displayClasses(classes) {
            classListElement.innerHTML = ''; // Clear loading message
            classes.forEach(classData => {
                const card = document.createElement('div');
                card.classList.add('class-card');

                card.innerHTML = `
                    <img src="${classData.image}" alt="${classData.name}">
                    <h2>${classData.name}</h2>
                    <p>${classData.description}</p>
                `;

                // Optional: add basic stats information
                if (classData.stats) {
                    const statsList = document.createElement('ul');
                    statsList.style.textAlign = 'left';
                    for (const stat in classData.stats) {
                        const statItem = document.createElement('li');
                        statItem.textContent = `${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${classData.stats[stat]}`;
                        statsList.appendChild(statItem);
                    }
                    card.appendChild(statsList);
                }

                classListElement.appendChild(card);
            });
        }

        fetchClasses()

//NPCs
const npcList = document.getElementById('npc-list');

        async function fetchNPCs() {
            try {
                const response = await fetch(apiURL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                displayNPCs(data.data); // The actual data is in the 'data' field of the response
            } catch (error) {
                npcList.innerHTML = `<p>Error loading NPCs: ${error.message}</p>`;
            }
        }

        function displayNPCs(npcs) {
            npcList.innerHTML = ''; // Clear loading message
            npcs.forEach(npc => {
                const card = document.createElement('div');
                card.classList.add('npc-card');

                // Add image if available
                if (npc.image) {
                    const img = document.createElement('img');
                    img.src = npc.image;
                    img.alt = npc.name;
                    img.classList.add('npc-image');
                    card.appendChild(img);
                }

                const details = document.createElement('div');
                details.classList.add('npc-details');
                
                const name = document.createElement('h2');
                name.textContent = npc.name;
                details.appendChild(name);

                const location = document.createElement('p');
                location.textContent = `Location: ${npc.location || 'Unknown'}`;
                details.appendChild(location);

                const quote = document.createElement('p');
                quote.textContent = `"${npc.quote || 'No quote available'}"`;
                details.appendChild(quote);

                card.appendChild(details);
                npcList.appendChild(card);
            });
        }

        // Call the fetch function when the page loads
        fetchNPCs()
        
