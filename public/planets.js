document.addEventListener('DOMContentLoaded', () => {
    const planetContainer = document.getElementById('planet-container');
    const searchBar = document.getElementById('search-bar');
    const modal = document.getElementById('planet-modal');
    const closeButton = modal.querySelector('.close-button');
    const toastNotification = document.getElementById('toast-notification'); 
    
    const sentinel = document.getElementById('scroll-sentinel');
    const sentinelLoader = sentinel.querySelector('.loader');
    const suggestionsBox = document.getElementById('suggestions-box');
    
    const playlistSelectModal = document.getElementById('playlist-select-modal');
    const closePlaylistSelect = document.getElementById('close-playlist-select');
    const playlistListContainer = document.getElementById('playlist-list-container');
    const playlistLoader = document.getElementById('playlist-loader');

    let currentPage = 1;
    let searchTimeout;
    let toastTimeout;
    let isLoading = false;
    let pendingItemToAdd = null;

    const showToast = (message, isError = false) => {
        if (!toastNotification) return;
        toastNotification.textContent = message;
        toastNotification.className = `toast show ${isError ? 'error' : ''}`;
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => toastNotification.classList.remove('show'), 3000); 
    };

    const fetchUserPlaylists = async () => {
        const token = localStorage.getItem('token');
        if (!token) return [];
        try {
            const res = await fetch('/api/playlists/planets', { headers: { 'x-auth-token': token } });
            if (res.ok) {
                const data = await res.json();
                return data.playlists || [];
            }
            return [];
        } catch (err) { return []; }
    };

    const openPlaylistSelectionModal = async (planetId, planetName) => {
        const token = localStorage.getItem('token');
        if (!token) return showToast('Please log in to add planets.', true);

        pendingItemToAdd = { id: planetId, name: planetName };
        playlistSelectModal.classList.add('active');
        playlistLoader.style.display = 'block';
        playlistListContainer.innerHTML = '';

        const playlists = await fetchUserPlaylists();
        playlistLoader.style.display = 'none';

        if (playlists.length === 0) {
            playlistListContainer.innerHTML = '<p>No planet playlists found. Create one in Profile.</p>';
            return;
        }

        playlists.forEach(pl => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.style.width = '100%';
            btn.style.marginBottom = '10px';
            btn.textContent = pl.name;
            btn.onclick = () => confirmAddToPlaylist(pl._id, pl.name);
            playlistListContainer.appendChild(btn);
        });
    };

    const confirmAddToPlaylist = async (playlistId, playlistName) => {
        const token = localStorage.getItem('token');
        if (!pendingItemToAdd) return;

        try {
            const res = await fetch(`/api/playlists/planets/${playlistId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ itemId: pendingItemToAdd.id, action: 'add' })
            });
            if (res.ok) {
                showToast(`${pendingItemToAdd.name} added to ${playlistName}!`);
                playlistSelectModal.classList.remove('active');
            } else {
                 const err = await res.json();
                showToast(err.msg || 'Failed to add planet', true);
            }
        } catch (err) {
            showToast('Network error', true);
        }
    };

    closePlaylistSelect.addEventListener('click', () => playlistSelectModal.classList.remove('active'));

    const fetchPlanets = async (page, shouldAppend = false) => {
        if (isLoading) return;
        isLoading = true;

        if (!shouldAppend) {
            planetContainer.innerHTML = '';
            sentinelLoader.style.display = 'none';
        } else {
            sentinelLoader.style.display = 'block';
        }

        try {
            const response = await fetch(`/api/planets?page=${page}&limit=12`);
            const data = await response.json();

            data.results.forEach(planet => {
                const planetCard = document.createElement('div');
                planetCard.className = 'alien-card'; 
                planetCard.innerHTML = `
                    <div class="alien-image-wrapper">
                        <img class="alien-image" src="${planet.image || 'images/placeholder.png'}" alt="${planet.name}">
                    </div>
                    <div class="alien-info"><h3>${planet.name}</h3></div>
                `;
                planetCard.addEventListener('click', () => showPlanetDetails(planet));
                planetContainer.appendChild(planetCard);
            });

            if (data.hasNextPage) {
                observer.observe(sentinel);
            } else {
                observer.unobserve(sentinel);
                sentinelLoader.style.display = 'none';
            }
        } catch (error) {
            console.error("Could not fetch planets:", error);
        } finally {
            isLoading = false;
            if(shouldAppend) sentinelLoader.style.display = 'none';
        }
    };

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
            currentPage++;
            fetchPlanets(currentPage, true);
        }
    }, { rootMargin: '100px' });

    const showSuggestions = (results) => {
        suggestionsBox.innerHTML = '';
        if (results.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }
        results.forEach(planet => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `<img src="${planet.image || 'images/placeholder.png'}"><span>${planet.name}</span>`;
            div.addEventListener('click', () => {
                showPlanetDetails(planet);
                suggestionsBox.style.display = 'none';
                searchBar.value = '';
            });
            suggestionsBox.appendChild(div);
        });
        suggestionsBox.style.display = 'block';
    };

    searchBar.addEventListener('input', (e) => {
        const term = e.target.value.trim();
        clearTimeout(searchTimeout);
        if (term.length < 2) {
            suggestionsBox.style.display = 'none';
            return;
        }
        searchTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`/api/planets/search/${encodeURIComponent(term)}`);
                const data = await response.json();
                showSuggestions(data.results || []);
            } catch (error) { console.error(error); }
        }, 300);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) suggestionsBox.style.display = 'none';
    });

    const showPlanetDetails = (planet) => {
        document.getElementById('modal-planet-img').src = planet.image || 'images/placeholder.png';
        document.getElementById('modal-planet-name').innerText = planet.name;
        document.getElementById('modal-planet-species').innerText = (planet.nativeSpecies || []).join(', ');
        document.getElementById('modal-planet-appearance').innerText = planet.firstAppearance || 'N/A';
        document.getElementById('modal-planet-description').innerText = planet.description || 'No data.';
        document.getElementById('modal-planet-habitat').innerText = planet.habitat || 'No data.';

        const addToOmnitrixBtn = document.getElementById('modal-add-btn'); 
        if (addToOmnitrixBtn) {
            addToOmnitrixBtn.textContent = 'Add to Playlist';
            addToOmnitrixBtn.onclick = () => openPlaylistSelectionModal(planet._id, planet.name);
        }

        const knowMoreBtn = modal.querySelector('.know-more-btn');
        const aiContentDiv = modal.querySelector('.ai-details-content');

        const fetchAiDetails = async () => {
            aiContentDiv.innerHTML = '<div class="loading-spinner"></div>';
            knowMoreBtn.style.display = 'none';
            try {
                const response = await fetch(`/api/ai/details/planet/${encodeURIComponent(planet.name)}`);
                const htmlContent = await response.text();
                aiContentDiv.innerHTML = htmlContent;
            } catch (err) {
                aiContentDiv.innerHTML = `<p style="color: #ff4d4d;">Error.</p>`;
            }
        };

        aiContentDiv.innerHTML = '';
        knowMoreBtn.style.display = 'block';
        knowMoreBtn.onclick = fetchAiDetails;

        modal.classList.add('active');
    };

    const closeModal = () => modal.classList.remove('active');
    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    fetchPlanets(currentPage);
});