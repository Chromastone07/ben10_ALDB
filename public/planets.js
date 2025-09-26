document.addEventListener('DOMContentLoaded', () => {
    const planetContainer = document.getElementById('planet-container');
    const loadMoreButton = document.getElementById('load-more-planets');
    const modal = document.getElementById('planet-modal');
    const closeButton = modal.querySelector('.close-button');
    const toastNotification = document.getElementById('toast-notification'); 
    let currentPage = 1;
    let activePlanetPlaylistId = null;

    const getActivePlaylistId = async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const res = await fetch('/api/playlists/planets', { headers: { 'x-auth-token': token } });
            if (res.ok) {
                const data = await res.json();
                return data.activePlaylistId;
            }
            return null;
        } catch (err) {
            console.error('Could not fetch active planet playlist ID', err);
            return null;
        }
    };

    const showToast = (message, isError = false) => {
        if (!toastNotification) return;
        toastNotification.textContent = message;
        toastNotification.className = `toast show ${isError ? 'error' : ''}`;
        setTimeout(() => toastNotification.classList.remove('show'), 3000); 
    };

    // MODIFIED: This function now adds to the active playlist.
    const addItemToActivePlaylist = async (planetId, planetName) => {
        const token = localStorage.getItem('token');
        if (!token) return showToast('Please log in to add planets.');
        
        if (!activePlanetPlaylistId) {
            return showToast('Please select an active planet playlist in "My Omnitrix".', true);
        }

        try {
            const res = await fetch(`/api/playlists/planets/${activePlanetPlaylistId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ itemId: planetId, action: 'add' })
            });
            if (res.ok) {
                showToast(`${planetName} added to your active playlist!`);
            } else {
                 const errData = await res.json();
                throw new Error(errData.msg || 'Failed to add planet to playlist');
            }
        } catch (err) {
            console.error('Failed to add to playlist', err);
            showToast(err.message, true);
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
            addToOmnitrixBtn.textContent = 'Add to Active Playlist';
            addToOmnitrixBtn.onclick = () => {
                addItemToActivePlaylist(planet._id, planet.name);
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
    };

    const closeModal = () => {
        modal.classList.remove('active');
    };

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        fetchPlanets(currentPage, true);
    });
    
    // Initial Load
    getActivePlaylistId().then(id => {
        activePlanetPlaylistId = id;
    });
    fetchPlanets(currentPage);
});