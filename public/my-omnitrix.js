
// document.addEventListener("DOMContentLoaded", () => {
//     // Get containers for different favorite types
//     const alienFavoritesContainer = document.getElementById("favorites-list");
//     const characterFavoritesContainer = document.getElementById("favorites-characters");
//     const planetFavoritesContainer = document.getElementById("favorites-planets");


//     // Get modal elements using IDs from the index.html modal structure
//     const modal = document.getElementById('alien-modal'); // This modal will be used for all types
//     const closeButton = modal ? modal.querySelector('.close-button') : null;

//     // Get modal content elements (common for all types)
//     const modalName = document.getElementById('modal-alien-name'); // Reusing this for name
//     // You might need to add specific elements for planet and character details if they differ significantly from alien details
//     const modalSpecies = document.getElementById('modal-alien-species'); // Reusing for species
//     const modalPlanet = document.getElementById('modal-alien-planet'); // Reusing for home planet

//     // Reusing ability/weakness lists for other types - adjust content based on type
//     const modalAbilities = document.getElementById('modal-alien-abilities');
//     const modalWeaknesses = document.getElementById('modal-alien-weaknesses');


//     // Get modal image elements (different for alien and planet)
//     const modalAlienImage = document.getElementById('anim-alien-img'); // Alien image ID
//     const modalOmnitrix = document.getElementById('anim-omnitrix'); // Omnitrix ID (alien modal)
//     const modalGlow = document.getElementById('anim-glow'); // Glow ID (alien modal)
//     const modalPlanetImage = document.getElementById('modal-planet-img'); // Planet image ID (assuming this ID exists in your modal HTML)

//     // You might need a separate image element for characters if its structure is different
//     // const modalCharacterImage = document.getElementById('modal-character-img'); // Example character image ID


//     // Get the "Know More" button and AI details div (assuming they are in the modal)
//     const knowMoreBtn = modal ? modal.querySelector('.know-more-btn') : null;
//     const aiContentDiv = modal ? modal.querySelector('.ai-details-content') : null;
//     const backBtn = modal ? modal.querySelector('.back-button') : null;


//     // Get the remove button
//     const removeButton = modal ? modal.querySelector('.remove-from-omnitrix-btn') : null;


//     // Get the toast element
//     const toastNotification = document.getElementById('toast-notification');

//     let currentItemId = null; // Variable to store the ID of the currently displayed item
//     let currentItemType = null; // Variable to store the type of the currently displayed item


//     // Create a BroadcastChannel instance
//     const favoritesChannel = new BroadcastChannel('favorites_channel');

//     // Listen for messages on the broadcast channel
//     favoritesChannel.onmessage = (event) => {
//         if (event.data && event.data.favoritesUpdated) {
//             console.log("Received favorites update message. Re-fetching favorites.");
//             fetchFavorites(); // Re-fetch and re-render favorites
//         }
//     };


//     // Function to show a toast notification
//     const showToast = (message, isError = false) => {
//         if (!toastNotification) return;

//         toastNotification.textContent = message;
//         toastNotification.classList.add('show');
//         if (isError) {
//             toastNotification.classList.add('error');
//         } else {
//             toastNotification.classList.remove('error');
//         }

//         setTimeout(() => {
//             toastNotification.classList.remove('show');
//         }, 3000); // Hide after 3 seconds
//     };


//     // Fetch favorites from backend
//     async function fetchFavorites() {
//         try {
//             const res = await fetch("/api/favorites/ids", {
//                 headers: { "x-auth-token": localStorage.getItem("token") }
//             });

//             if (!res.ok) {
//                 throw new Error("Failed to fetch favorites");
//             }

//             const data = await res.json();
//             console.log("Fetched favorites:", data); // debug log
//             loadFavorites(data);
//         } catch (err) {
//             console.error("Error fetching favorites:", err);
//              if(alienFavoritesContainer) alienFavoritesContainer.innerHTML = `<p class=\"error\">Could not load favorites</p>`;
//              if(characterFavoritesContainer) characterFavoritesContainer.innerHTML = `<p class=\"error\">Could not load favorites</p>`;
//              if(planetFavoritesContainer) planetFavoritesContainer.innerHTML = `<p class=\"error\">Could not load favorites</p>`;
//              showToast('Could not load favorites.', true); // Show error toast
//         }
//     }

//     // Render favorites in their respective containers
//     function loadFavorites(favorites) {
//         // Clear all favorites containers
//         if(alienFavoritesContainer) alienFavoritesContainer.innerHTML = "";
//         if(characterFavoritesContainer) characterFavoritesContainer.innerHTML = "";
//         if(planetFavoritesContainer) planetFavoritesContainer.innerHTML = "";


//         // Render Alien Favorites
//         if (alienFavoritesContainer && favorites.aliens && favorites.aliens.length > 0) {
//             favorites.aliens.forEach(alien => {
//                 const card = document.createElement("div");
//                 card.classList.add("favorite-card");
//                 card.dataset.itemId = alien._id;
//                 card.dataset.itemType = 'alien';
//                 card.innerHTML = `
//                     <img src="${alien.image || '/images/default-alien.png'}" alt="${alien.name}">
//                     <h3>${alien.name}</h3>
//                     <p>${alien.description || ''}</p>
//                 `;
//                 card.addEventListener('click', () => openFavoriteModal(alien, 'alien'));
//                 alienFavoritesContainer.appendChild(card);
//             });
//         } else if (alienFavoritesContainer) {
//              alienFavoritesContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No favorite aliens yet.</p>';
//         }

//         // Render Character Favorites
//         if (characterFavoritesContainer && favorites.characters && favorites.characters.length > 0) {
//              favorites.characters.forEach(character => {
//                  const card = document.createElement("div");
//                  card.classList.add("favorite-card");
//                  card.dataset.itemId = character._id;
//                  card.dataset.itemType = 'character';
//                  card.innerHTML = `
//                      <img src="${character.image || '/images/default-character.png'}" alt="${character.name}">
//                      <h3>${character.name}</h3>
//                      <p>${character.description || ''}</p> {/* Assuming characters have a description */}
//                  `;
//                  card.addEventListener('click', () => openFavoriteModal(character, 'character'));
//                  characterFavoritesContainer.appendChild(card);
//              });
//         } else if (characterFavoritesContainer) {
//              characterFavoritesContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No favorite characters yet.</p>';
//         }

//         // Render Planet Favorites
//         if (planetFavoritesContainer && favorites.planets && favorites.planets.length > 0) {
//              favorites.planets.forEach(planet => {
//                  const card = document.createElement("div");
//                  card.classList.add("favorite-card");
//                  card.dataset.itemId = planet._id;
//                  card.dataset.itemType = 'planet';
//                  card.innerHTML = `
//                      <img src="${planet.image || '/images/default-planet.png'}" alt="${planet.name}">
//                      <h3>${planet.name}</h3>
//                      <p>${planet.description || ''}</p> {/* Assuming planets have a description */}
//                  `;
//                  card.addEventListener('click', () => openFavoriteModal(planet, 'planet'));
//                  planetFavoritesContainer.appendChild(card);
//              });
//         } else if (planetFavoritesContainer) {
//              planetFavoritesContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No favorite planets yet.</p>';
//         }
//     }

//     // Function to open the favorite modal - now takes item and type
//     const openFavoriteModal = (item, type) => {
//         // Close any currently open modal first (important for switching between types)
//         closeModal();

//         currentItemId = item._id; // Store the current item ID
//         currentItemType = type; // Store the current item type


//         // Get modal content elements (common for all types)
//         const modalNameElement = document.getElementById('modal-alien-name'); // Reusing for name
//         const modalSpeciesElement = document.getElementById('modal-alien-species'); // Reusing for species
//         const modalPlanetElement = document.getElementById('modal-alien-planet'); // Reusing for home planet
//         const modalAbilitiesElement = document.getElementById('modal-alien-abilities'); // Reusing for abilities
//         const modalWeaknessesElement = document.getElementById('modal-alien-weaknesses'); // Reusing for weaknesses


//         // Get modal image elements (different for alien and planet)
//         const modalAlienImageElement = document.getElementById('anim-alien-img'); // Alien image ID
//         const modalOmnitrixElement = document.getElementById('anim-omnitrix'); // Omnitrix ID (alien modal)
//         const modalGlowElement = document.getElementById('anim-glow'); // Glow ID (alien modal)
//         const modalPlanetImageElement = document.getElementById('modal-planet-img'); // Planet image ID

//         // You might need a separate image element for characters if its structure is different
//         // const modalCharacterImageElement = document.getElementById('modal-character-img'); // Example character image ID


//         // Get the "Know More" button and AI details div
//         const knowMoreBtnElement = modal.querySelector('.know-more-btn');
//         const aiContentDivElement = modal.querySelector('.ai-details-content');
//         const backBtnElement = modal.querySelector('.back-button');


//         // Get the remove button
//         const removeButtonElement = modal.querySelector('.remove-from-omnitrix-btn');


//         // Reset AI view on modal open
//         const detailCard = modal.querySelector('.modal-body');
//         if (detailCard) detailCard.classList.remove('ai-view');
//         if (aiContentDivElement) aiContentDivElement.innerHTML = '';
//         if (knowMoreBtnElement) knowMoreBtnElement.style.display = 'block';
//         if (backBtnElement) {
//             backBtnElement.style.opacity = 0;
//             backBtnElement.style.pointerEvents = 'none';
//         }


//         // Hide/show elements based on item type
//         if (modalAlienImageElement) modalAlienImageElement.style.display = 'none';
//         if (modalOmnitrixElement) modalOmnitrixElement.style.display = 'none';
//         if (modalGlowElement) modalGlowElement.style.display = 'none';
//         if (modalPlanetImageElement) modalPlanetImageElement.style.display = 'none';
//         // Hide character image element if it exists


//         if (type === 'alien') {
//             // Show alien-specific elements
//             if (modalAlienImageElement) modalAlienImageElement.style.display = 'block';
//             if (modalOmnitrixElement) modalOmnitrixElement.style.display = 'block';
//             if (modalGlowElement) modalGlowElement.style.display = 'block';

//             // Populate alien details
//             if (modalAlienImageElement) {
//                 modalAlienImageElement.src = item.image || '/images/default-alien.png';
//                 modalAlienImageElement.classList.add('hologram');
//             }
//             if (modalNameElement) modalNameElement.textContent = item.name ? item.name.toUpperCase() : 'Unknown Alien';
//             if (modalSpeciesElement) modalSpeciesElement.textContent = item.species || 'Unknown';
//             if (modalPlanetElement) modalPlanetElement.textContent = item.homePlanet || 'Unknown';
//             // Populate abilities and weaknesses
//             if (modalAbilitiesElement) {
//                 modalAbilitiesElement.innerHTML = '';
//                 if (Array.isArray(item.abilities)) {
//                     item.abilities.forEach(ability => { const li = document.createElement('li'); li.textContent = ability; modalAbilitiesElement.appendChild(li); });
//                 } else if (item.abilities) {
//                     const li = document.createElement('li'); li.textContent = item.abilities; modalAbilitiesElement.appendChild(li);
//                 } else { modalAbilitiesElement.innerHTML = '<li>No abilities listed.</li>'; }
//             }
//             if (modalWeaknessesElement) {
//                 modalWeaknessesElement.innerHTML = '';
//                 if (Array.isArray(item.weaknesses)) {
//                     item.weaknesses.forEach(weakness => { const li = document.createElement('li'); li.textContent = weakness; modalWeaknessesElement.appendChild(li); });
//                 } else if (item.weaknesses) {
//                     const li = document.createElement('li'); li.textContent = item.weaknesses; modalWeaknessesElement.appendChild(li);
//                 } else { modalWeaknessesElement.innerHTML = '<li>No weaknesses listed.</li>'; }
//             }

//             // Update AI Know More button for alien
//             if (knowMoreBtnElement) {
//                 knowMoreBtnElement.onclick = async () => {
//                     if (detailCard) detailCard.classList.add('ai-view');
//                     if (aiContentDivElement) aiContentDivElement.innerHTML = '<div class=\"loading-spinner\"></div>';
//                     if (knowMoreBtnElement) knowMoreBtnElement.style.display = 'none';
//                     if (backBtnElement) { backBtnElement.style.opacity = 0.7; backBtnElement.style.pointerEvents = 'auto'; }
//                     try {
//                         const response = await fetch(`/api/ai/details/alien/${item.name}`);
//                         const htmlContent = await response.text();
//                         if (aiContentDivElement) aiContentDivElement.innerHTML = htmlContent;
//                     } catch (err) {
//                         if (aiContentDivElement) aiContentDivElement.innerHTML = '<p>Could not load additional details.</p>';
//                         console.error(err);
//                         showToast('Error fetching AI details.', true);
//                     }
//                 };
//             }


//         } else if (type === 'planet') {
//             console.log("Handling planet type in openFavoriteModal");
//             const modalPlanetImageElement = document.getElementById('modal-planet-img');
//             if (modalPlanetImageElement) {
//                 console.log("Planet image element found:", modalPlanetImageElement);
//                 console.log("Setting planet image src to:", item.image || '/images/default-planet.png');
//                 modalPlanetImageElement.style.display = 'block'; // Ensure it's displayed
//                 modalPlanetImageElement.src = item.image || '/images/default-planet.png';
//             } else {
//                 console.log("Planet image element with ID 'modal-planet-img' not found.");
//             }
//             if (modalNameElement) modalNameElement.textContent = item.name ? item.name.toUpperCase() : 'Unknown Planet';
//             if (modalSpeciesElement) modalSpeciesElement.textContent = (item.nativeSpecies || []).join(', ') || 'Unknown'; // Planet species
//             if (modalPlanetElement) modalPlanetElement.textContent = 'N/A'; // Planets don't have a home planet in this context
//             if (modalAbilitiesElement) modalAbilitiesElement.innerHTML = '<li>No abilities listed.</li>'; // Planets don't have abilities
//             if (modalWeaknessesElement) modalWeaknessesElement.innerHTML = '<li>No weaknesses listed.</li>'; // Planets don't have weaknesses


//             // Update AI Know More button for planet
//             if (knowMoreBtnElement) {
//                 knowMoreBtnElement.onclick = async () => {
//                     if (detailCard) detailCard.classList.add('ai-view');
//                     if (aiContentDivElement) aiContentDivElement.innerHTML = '<div class=\"loading-spinner\"></div>';
//                     if (knowMoreBtnElement) knowMoreBtnElement.style.display = 'none';
//                     if (backBtnElement) { backBtnElement.style.opacity = 0.7; backBtnElement.style.pointerEvents = 'auto'; }
//                     try {
//                         const response = await fetch(`/api/ai/details/planet/${item.name}`);
//                         const htmlContent = await response.text();
//                         if (aiContentDivElement) aiContentDivElement.innerHTML = htmlContent;
//                     } catch (err) {
//                         if (aiContentDivElement) aiContentDivElement.innerHTML = '<p>Could not load additional details.</p>';
//                         console.error(err);
//                         showToast('Error fetching AI details.', true);
//                     }
//                 };
//             }


//         } else if (type === 'character') {
//             // Show character-specific elements (adapt based on your modal HTML)
//             // if (modalCharacterImageElement) modalCharacterImageElement.style.display = 'block';


//             // Populate character details (similar to alien, adapt based on your character data and modal HTML)
//             if (modalNameElement) modalNameElement.textContent = item.name ? item.name.toUpperCase() : 'Unknown Character';
//             if (modalSpeciesElement) modalSpeciesElement.textContent = item.species || 'Unknown';
//             if (modalPlanetElement) modalPlanetElement.textContent = item.homePlanet || 'N/A'; // Characters might have a home planet
//             // Populate character-specific details (e.g., powersAndAbilities, history)
//             if (modalAbilitiesElement) { // Reusing abilities section for powers/abilities
//                 modalAbilitiesElement.innerHTML = '';
//                 if (Array.isArray(item.powersAndAbilities)) {
//                     item.powersAndAbilities.forEach(ability => { const li = document.createElement('li'); li.textContent = ability; modalAbilitiesElement.appendChild(li); });
//                 } else if (item.powersAndAbilities) {
//                     const li = document.createElement('li'); li.textContent = item.powersAndAbilities; modalAbilitiesElement.appendChild(li);
//                 } else { modalAbilitiesElement.innerHTML = '<li>No powers or abilities listed.</li>'; }
//             }
//             if (modalWeaknessesElement) { // Reusing weaknesses section for weaknesses or other traits
//                 modalWeaknessesElement.innerHTML = '';
//                 if (Array.isArray(item.weaknesses)) { // Assuming characters might have weaknesses
//                     item.weaknesses.forEach(weakness => { const li = document.createElement('li'); li.textContent = weakness; modalWeaknessesElement.appendChild(li); });
//                 } else if (item.weaknesses) {
//                     const li = document.createElement('li'); li.textContent = item.weaknesses; modalWeaknessesElement.appendChild(li);
//                 } else { modalWeaknessesElement.innerHTML = '<li>No weaknesses listed.</li>'; }
//             }
//             // Add logic for other character-specific fields like history, relationships, etc. if you add them to the modal HTML


//             // if (modalCharacterImageElement) { // Assuming character image ID
//             //    modalCharacterImageElement.src = item.image || '/images/default-character.png';
//             // }

//             // Update AI Know More button for character
//             if (knowMoreBtnElement) {
//                 knowMoreBtnElement.onclick = async () => {
//                     if (detailCard) detailCard.classList.add('ai-view');
//                     if (aiContentDivElement) aiContentDivElement.innerHTML = '<div class=\"loading-spinner\"></div>';
//                     if (knowMoreBtnElement) knowMoreBtnElement.style.display = 'none';
//                     if (backBtnElement) { backBtnElement.style.opacity = 0.7; backBtnElement.style.pointerEvents = 'auto'; }
//                     try {
//                         const response = await fetch(`/api/ai/details/character/${item.name}`);
//                         const htmlContent = await response.text();
//                         if (aiContentDivElement) aiContentDivElement.innerHTML = htmlContent;
//                     } catch (err) {
//                         if (aiContentDivElement) aiContentDivElement.innerHTML = '<p>Could not load additional details.</p>';
//                         console.error(err);
//                         showToast('Error fetching AI details.', true);
//                     }
//                 };
//             }


//         } else {
//             // Handle unknown item type - hide detailed sections and AI
//             if (modalNameElement) modalNameElement.textContent = item.name ? item.name.toUpperCase() : 'Unknown Item';
//             if (modalSpeciesElement) modalSpeciesElement.textContent = '';
//             if (modalPlanetElement) modalPlanetElement.textContent = '';
//             if (modalAbilitiesElement) modalAbilitiesElement.innerHTML = '';
//             if (modalWeaknessesElement) modalWeaknessesElement.innerHTML = '';

//             if (knowMoreBtnElement) knowMoreBtnElement.style.display = 'none'; // Hide Know More for unknown

//         }

//         // Update remove button based on item type
//         if (removeButtonElement) {
//             removeButtonElement.style.display = 'block'; // Show remove button for all favorite types
//             removeButtonElement.dataset.itemId = item._id;
//             removeButtonElement.dataset.itemType = type;
//         }


//         // Handle Back button for AI details
//         const handleBack = () => {
//             if (detailCard) detailCard.classList.remove('ai-view');
//             if (aiContentDivElement) aiContentDivElement.innerHTML = '';
//             if (knowMoreBtnElement) knowMoreBtnElement.style.display = 'block';
//             if (backBtnElement) {
//                 backBtnElement.style.opacity = 0;
//                 backBtnElement.style.pointerEvents = 'none';
//             }
//         };
//         if (backBtnElement) backBtnElement.onclick = handleBack;


//         // Show the modal
//         if (modal) {
//             modal.classList.add('active');
//             // Add animating class only for alien modal if needed, or handle animations via CSS based on item type
//             if (type === 'alien') {
//                 modal.classList.add('animating');
//             } else {
//                 modal.classList.remove('animating'); // Ensure not animating for other types
//             }
//         }
//     };

//     // Function to close the modal
//     const closeModal = () => {
//         if (modal) {
//             modal.classList.remove('active');
//             modal.classList.remove('animating'); // Remove animating class on close
//         }
//         // Also reset the view inside the modal when it closes after a short delay to allow for fade-out
//         setTimeout(() => {
//             const detailCard = modal.querySelector('.modal-body');
//             const aiContentDivElement = modal.querySelector('.ai-details-content');
//             const knowMoreBtnElement = modal.querySelector('.know-more-btn');
//             const backBtnElement = modal.querySelector('.back-button');

//             if (detailCard) detailCard.classList.remove('ai-view');
//             if (aiContentDivElement) aiContentDivElement.innerHTML = '';
//             if (knowMoreBtnElement) knowMoreBtnElement.style.display = 'block';
//             if (backBtnElement) {
//                 backBtnElement.style.opacity = 0;
//                 backBtnElement.style.pointerEvents = 'none';
//             }
//         }, 400); // Match the modal transition duration
//     };

//     // Event listeners to close the modal
//     if (closeButton) {
//         closeButton.addEventListener('click', closeModal);
//     }
//     if (modal) {
//         modal.addEventListener('click', (e) => {
//             if (e.target === modal) { // Close if clicking outside the modal content
//                 closeModal();
//             }
//         });
//     }


//     // Add event listener for the remove button (handles alien, planet, character)
//     if (removeButton) {
//         removeButton.addEventListener('click', async () => {
//             const itemId = removeButton.dataset.itemId;
//             const itemType = removeButton.dataset.itemType;

//             if (!itemId || !itemType) return;

//             try {
//                 const res = await fetch(`/api/favorites/${itemType}/${itemId}`, { // Use itemType in the URL
//                     method: 'DELETE',
//                     headers: { 'x-auth-token': localStorage.getItem('token') }
//                 });

//                 if (!res.ok) {
//                     const errorData = await res.json(); // Try to get error message from backend
//                     throw new Error(errorData.msg || `Failed to remove ${itemType} from favorites`);
//                 }

//                 // Remove the card from the UI
//                 // Use the correct container based on item type to find the card
//                 let cardToRemove = null;
//                 if (itemType === 'alien' && alienFavoritesContainer) {
//                     cardToRemove = alienFavoritesContainer.querySelector(`.favorite-card[data-item-id='${itemId}']`);
//                 } else if (itemType === 'character' && characterFavoritesContainer) {
//                     cardToRemove = characterFavoritesContainer.querySelector(`.favorite-card[data-item-id='${itemId}']`);
//                 } else if (itemType === 'planet' && planetFavoritesContainer) {
//                     cardToRemove = planetFavoritesContainer.querySelector(`.favorite-card[data-item-id='${itemId}']`);
//                 }


//                 if (cardToRemove) {
//                     cardToRemove.remove();
//                 }

//                 closeModal(); // Close the modal after successful removal

//                 showToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} removed from My Omnitrix!`); // Show success toast

//                 // Post a message to the broadcast channel
//                 favoritesChannel.postMessage({ favoritesUpdated: true });

//             } catch (err) {
//                 console.error(`Error removing ${itemType} from favorites:`, err);
//                 showToast(`Error removing ${itemType}.`, true); // Show error toast
//             }
//         });
//     }


//     // Kickstart
//     fetchFavorites();
// });
