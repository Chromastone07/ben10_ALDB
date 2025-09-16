


document.addEventListener('DOMContentLoaded', () => {
    const planetContainer = document.getElementById('planet-container');
    const loadMoreButton = document.getElementById('load-more-planets');
    const modal = document.getElementById('planet-modal');
    const closeButton = modal.querySelector('.close-button');
    const toastNotification = document.getElementById('toast-notification'); 
    let currentPage = 1;
    let favoritePlanetIds = []; 

    const favoritesChannel = new BroadcastChannel('favorites_channel');

    const showToast = (message, isError = false) => {
        if (!toastNotification) return;

        toastNotification.textContent = message;
        toastNotification.classList.add('show');
        if (isError) {
            toastNotification.classList.add('error');
        } else {
            toastNotification.classList.remove('error');
        }

        setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 3000); 
    };


    const fetchFavoritePlanetIds = async () => {
        try {
            const res = await fetch("/api/favorites/ids", {
                headers: { "x-auth-token": localStorage.getItem("token") }
            });
            if (!res.ok) {
                throw new Error("Failed to fetch favorite IDs");
            }
            const data = await res.json();
            favoritePlanetIds = data.planets.map(planet => planet._id || planet);
        } catch (err) {
            console.error("Error fetching favorite planet IDs:", err);
        }
    };


    const fetchPlanets = async (page, shouldAppend = false) => {
        try {
            const response = await fetch(`/api/planets?page=${page}&limit=12`);
            const data = await response.json();

            if (!shouldAppend) planetContainer.innerHTML = '';

            data.results.forEach(planet => {
                const planetCard = document.createElement('div');
                planetCard.className = 'alien-card'; 
                planetCard.dataset.planetId = planet._id;
                planetCard.innerHTML = `
                    <div class="alien-image-wrapper">
                        <img class="alien-image" src="${planet.image || 'images/placeholder.png'}" alt="${planet.name}">
                    </div>
                    <div class="alien-info"><h3>${planet.name}</h3></div>
                     ${favoritePlanetIds.includes(planet._id) ? '<div class="favorite-omnitrix favorited"></div>' : ''} <!-- Add favorite icon -->
                `;
                planetCard.addEventListener('click', () => showPlanetDetails(planet));
                planetContainer.appendChild(planetCard);
            });

            loadMoreButton.style.display = data.hasNextPage ? 'block' : 'none';
        } catch (error) {
            console.error("Could not fetch planets:", error);
            showToast('Could not load planets.', true); 
        }
    };

    const showPlanetDetails = (planet) => {
        document.getElementById('modal-planet-img').src = planet.image || 'images/placeholder.png';
        document.getElementById('modal-planet-name').innerText = planet.name;
        document.getElementById('modal-planet-species').innerText = (planet.nativeSpecies || []).join(', ');
        document.getElementById('modal-planet-appearance').innerText = planet.firstAppearance || 'N/A';
        document.getElementById('modal-planet-description').innerText = planet.description || 'No data.';
        document.getElementById('modal-planet-habitat').innerText = planet.habitat || 'No data.';

        const knowMoreBtn = modal.querySelector('.know-more-btn');
        const aiContentDiv = modal.querySelector('.ai-details-content');
        const addToOmnitrixBtn = modal.querySelector('.add-to-omnitrix-btn'); 


        if (addToOmnitrixBtn) {
            addToOmnitrixBtn.dataset.planetId = planet._id; 
            const isFavorited = favoritePlanetIds.includes(planet._id);
            addToOmnitrixBtn.textContent = isFavorited ? 'Remove from My Omnitrix' : 'Add to My Omnitrix';
            addToOmnitrixBtn.classList.toggle('favorited', isFavorited);
            addToOmnitrixBtn.onclick = async () => {
                const planetId = addToOmnitrixBtn.dataset.planetId;
                const method = favoritePlanetIds.includes(planetId) ? 'DELETE' : 'POST';
                const url = `/api/favorites/planet/${planetId}`;

                try {
                    const res = await fetch(url, {
                        method: method,
                        headers: { 'x-auth-token': localStorage.getItem('token') }
                    });

                    if (!res.ok) {
                        throw new Error(`Failed to ${method === 'POST' ? 'add' : 'remove'} from favorites`);
                    }

                    if (method === 'POST') {
                        favoritePlanetIds.push(planetId);
                        showToast('Planet added to My Omnitrix!');
                    } else {
                        favoritePlanetIds = favoritePlanetIds.filter(id => id !== planetId);
                        showToast('Planet removed from My Omnitrix!');
                    }

                    const isNowFavorited = favoritePlanetIds.includes(planetId);
                    addToOmnitrixBtn.textContent = isNowFavorited ? 'Remove from My Omnitrix' : 'Add to My Omnitrix';
                    addToOmnitrixBtn.classList.toggle('favorited', isNowFavorited);

                    const planetCard = document.querySelector(`.alien-card[data-planet-id='${planetId}']`);
                    if (planetCard) {
                        let favIcon = planetCard.querySelector('.favorite-omnitrix');
                        if (isNowFavorited && !favIcon) {
                            favIcon = document.createElement('div');
                            favIcon.className = 'favorite-omnitrix favorited';
                            planetCard.appendChild(favIcon);
                        } else if (!isNowFavorited && favIcon) {
                            favIcon.remove();
                        }
                    }

                    favoritesChannel.postMessage({ favoritesUpdated: true });


                } catch (err) {
                    console.error(`Error ${method === 'POST' ? 'adding' : 'removing'} from favorites:`, err);
                    showToast(`Error ${method === 'POST' ? 'adding' : 'removing'} planet.`, true);
                }
            };
        }


        const fetchAiDetails = async () => {
            aiContentDiv.innerHTML = '<div class="loading-spinner"></div>';
            knowMoreBtn.style.display = 'none';

            try {
const response = await fetch(`/api/ai/details/planet/${encodeURIComponent(planet.name)}`);
                const htmlContent = await response.text();
                aiContentDiv.innerHTML = htmlContent;
            } catch (err) {
                aiContentDiv.innerHTML = '<p>Could not load additional details at this time.</p>';
                console.error(err);
                showToast('Error fetching AI details.', true); 
            }
        };

        aiContentDiv.innerHTML = '';
        knowMoreBtn.style.display = 'block';
        knowMoreBtn.onclick = fetchAiDetails;


        modal.classList.add('active');

        const closeModal = () => {
            modal.classList.remove('active');
        };

        closeButton.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    };

    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        fetchPlanets(currentPage, true);
    });

    fetchFavoritePlanetIds().then(() => {
        fetchPlanets(currentPage);
    });

});
