
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
        
const firebaseConfig = {
  apiKey: "AIzaSyBPKaCoFsfC5h7DRrH9xwSdONusfMe7_qw",
  authDomain: "elden-ring-lore-b2a75.firebaseapp.com",
  databaseURL: "https://elden-ring-lore-b2a75-default-rtdb.firebaseio.com",
  projectId: "elden-ring-lore-b2a75",
  storageBucket: "elden-ring-lore-b2a75.firebasestorage.app",
  messagingSenderId: "964511506360",
  appId: "1:964511506360:web:80a008c95ddb872cd4394d",
  measurementId: "G-N8ZYY2FNQW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// The firebase.database() this gives us access to realtime database service.
const database = firebase.database();

// Here we creating a reference to 'notes' collection (or path) in our database.
// Every notes we add or modify will go under this "notes" node.
const noteRef = database.ref("notes");

// 3. Get elements From the Page
// get the container elements from the html where all the notes will be displayed dynamically
const notesContainer = document.getElementById("notes-container");

// get the input box where the user types a new notes.
const noteInput = document.getElementById("note-input");

// get the submit button that will trigger dding a new note when clicked
const submitButton = document.getElementById("submit-button");

// 1.) Create
// add an event listener to handle click actions on submit button
submitButton.addEventListener("click", () => {
  // retrieve the text typed by the user in the input box.
  const noteText = noteInput.value;

  // If the user click on submit button with an empty or white space-only input field, do nothing
  if (noteText.trim() === "") return;

  // Push a new noteobject into the notes path in our realtime database
  // The push() method returns a unique key for the new note.
  noteRef.push({
    text: noteText, //the actual note text
    timestamp: Date.now(), //Save the current time (milisec from 1970)
  });

  // after adding the notes to firebase, clear the input box for the next note
  noteInput.value = "";
});

// 2.) Read

noteRef.on("child_added", (snapshot) => {
  // Step 1: Extract ID and object
  const noteId = snapshot.key;
  const newNote = snapshot.val();
  const notesElement = createNoteElement(noteId, newNote.text);
  notesContainer.prepend(notesElement);
});

function createNoteElement(noteId, noteText) {
  // Outer box
  const noteElement = document.createElement("div");
  noteElement.classList.add("note");
  noteElement.setAttribute("data-id", noteId);

  // text
  const noteTextElement = document.createElement("span");
  noteTextElement.textContent = noteText;
  noteElement.appendChild(noteTextElement);
  // delete
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener("click", () => {
    deleteNote(noteId);
  });

  noteElement.appendChild(deleteButton);
  // Edit button
  const editButton = document.createElement("button");
  editButton.classList.add("edit-btn");
  editButton.innerText = "Edit";
  editButton.addEventListener("click", () => {
    const currentText = noteElement.querySelector("span").innerText;
    editNote(noteId, noteText);
  });

  noteElement.appendChild(editButton);

  return noteElement;
}

function deleteNote(noteId) {
  // create a reference to the specific note to be deleted
  const specificNoteref = database.ref("notes/" + noteId);

  // remove the note from the database
  specificNoteref.remove();
}

noteRef.on("child_removed", (snapshot) => {
  const noteId = snapshot.key;

  const noteElement = document.querySelector(`div[data-id="${noteId}"]`);

  if (noteElement) {
    noteElement.remove();
  }
});

function editNote(noteId, currentText) {
  // prompt is a built in tool that forces a small popup window to appear
  // We gives it two things
  // 1] the question : "fix your typo:"(This tells the user what to do)
  // 2] the default answer :currentText (this puts the old note in the box automatically)
  const newText = prompt("Fix your typo:", currentText);

  if (newText && newText.trim() !== "") {
    const specificNoteRef = database.ref("notes/" + noteId);
    specificNoteRef.update({
      text: newText,
    });
  }
}

noteRef.on("child_changed", (snapshot) => {
  const noteId = snapshot.key;
  const updatedNote = snapshot.val();
  const noteElement = document.querySelector(`div[data-id="${noteId}"]`);
  // If it exists locate the <span> in side and update its displayed
  if (noteElement)
    noteElement.querySelector("span").innerText = updatedNote.text;
});