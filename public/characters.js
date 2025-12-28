document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('character-grid');
    const searchBar = document.getElementById('search-bar');
    const filterNav = document.querySelector('.filter-nav');
    const modal = document.getElementById('modal');
    const closeButton = modal.querySelector('.close-button');
    const toast = document.getElementById('toast-notification');
    
    const sentinel = document.getElementById('scroll-sentinel');
    const sentinelLoader = sentinel.querySelector('.loader');
    const suggestionsBox = document.getElementById('suggestions-box');
    const playlistSelectModal = document.getElementById('playlist-select-modal');
    const closePlaylistSelect = document.getElementById('close-playlist-select');
    const playlistListContainer = document.getElementById('playlist-list-container');
    const playlistLoader = document.getElementById('playlist-loader');

    let currentPage = 1;
    let currentCategory = 'All';
    let searchTimeout;
    let toastTimeout;
    let isLoading = false;
    let pendingItemToAdd = null;

    const showToast = (message, isError = false) => {
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast show ${isError ? 'error' : ''}`;
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
    };

    const fetchUserPlaylists = async () => {
        const token = localStorage.getItem('token');
        if (!token) return [];
        try {
            const res = await fetch('/api/playlists/characters', { headers: { 'x-auth-token': token } });
            if (res.ok) {
                const data = await res.json();
                return data.playlists || [];
            }
            return [];
        } catch (err) {
            console.error('Could not fetch playlists', err);
            return [];
        }
    };

    const openPlaylistSelectionModal = async (charId, charName) => {
        const token = localStorage.getItem('token');
        if (!token) return showToast('Please log in to use the Omnitrix.', true);

        pendingItemToAdd = { id: charId, name: charName };
        playlistSelectModal.classList.add('active');
        playlistLoader.style.display = 'block';
        playlistListContainer.innerHTML = '';

        const playlists = await fetchUserPlaylists();
        playlistLoader.style.display = 'none';

        if (playlists.length === 0) {
            playlistListContainer.innerHTML = '<p>No character playlists found. Create one in Profile.</p>';
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
            const res = await fetch(`/api/playlists/characters/${playlistId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ itemId: pendingItemToAdd.id, action: 'add' })
            });

            if (res.ok) {
                showToast(`${pendingItemToAdd.name} added to ${playlistName}!`);
                playlistSelectModal.classList.remove('active');
            } else {
                const err = await res.json();
                showToast(err.msg || 'Failed to add character', true);
            }
        } catch (error) {
            showToast('Network error', true);
        }
    };

    closePlaylistSelect.addEventListener('click', () => playlistSelectModal.classList.remove('active'));

    const fetchAndDisplay = async (category, page, shouldAppend = false) => {
        if (isLoading) return;
        isLoading = true;

        if (!shouldAppend) {
            grid.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;
            sentinelLoader.style.display = 'none';
        } else {
            sentinelLoader.style.display = 'block';
        }
        
        let url = `/api/characters?page=${page}&limit=12`;
        if (category && category !== 'All') url += `&category=${category}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (!shouldAppend) grid.innerHTML = '';
            renderGrid(data.results || []);

            if (data.hasNextPage) {
                observer.observe(sentinel);
            } else {
                observer.unobserve(sentinel);
                sentinelLoader.style.display = 'none';
            }
        } catch (error) { 
            console.error('Failed to fetch characters:', error); 
        } finally {
            isLoading = false;
            if (shouldAppend) sentinelLoader.style.display = 'none';
        }
    };

    const renderGrid = (characters) => {
        if (characters.length === 0 && currentPage === 1) {
            grid.innerHTML = `<p style="color: var(--text-light); opacity: 0.7;">No characters found.</p>`;
        }
        characters.forEach(char => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <div class="favorite-omnitrix" title="Add to Playlist"></div>
                <div class="character-card-image-wrapper"><img src="${char.image || 'images/placeholder.png'}" alt="${char.name}"></div>
                <div class="character-card-info"><h3>${char.name.toUpperCase()}</h3></div>`;
            
            card.querySelector('.favorite-omnitrix').addEventListener('click', (e) => {
                e.stopPropagation();
                openPlaylistSelectionModal(char._id, char.name);
            });

            card.addEventListener('click', () => openModal(char));
            grid.appendChild(card);
        });
    };

    const showSuggestions = (results) => {
        suggestionsBox.innerHTML = '';
        if (results.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }
        results.forEach(char => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `<img src="${char.image || 'images/placeholder.png'}"><span>${char.name}</span>`;
            div.addEventListener('click', () => {
                openModal(char);
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
            if (term.length === 0) {
               
            }
            return;
        }
        searchTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`/api/characters/search/${encodeURIComponent(term)}`);
                const data = await response.json();
                showSuggestions(data.results || []);
            } catch (error) { console.error(error); }
        }, 300);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) suggestionsBox.style.display = 'none';
    });

    filterNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentCategory = e.target.dataset.category;
            currentPage = 1;
            document.querySelector('.filter-btn.active')?.classList.remove('active');
            e.target.classList.add('active');
            if (observer) observer.disconnect();
            fetchAndDisplay(currentCategory, currentPage, false);
        }
    });

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
            currentPage++;
            fetchAndDisplay(currentCategory, currentPage, true);
        }
    }, { rootMargin: '100px' });

    const openModal = (char) => {
        document.body.style.overflow = 'hidden'; 

        const detailCard = modal.querySelector('.detail-card');
        detailCard.classList.remove('ai-view');

        document.getElementById('modal-image').src = char.image || 'images/placeholder.png';
        document.getElementById('modal-name').textContent = char.name.toUpperCase();
        document.getElementById('modal-species').textContent = char.species || 'Unknown';
        document.getElementById('tab-personality').textContent = char.personality || 'No information available.';
        document.getElementById('tab-appearance').textContent = char.appearance || 'No information available.';
        
        const powersTab = document.getElementById('tab-powers');
        const abilities = char.powersAndAbilities;
        if (abilities) {
            const abilitiesList = abilities.split(/[,.]+/).filter(a => a.trim() !== '');
            powersTab.innerHTML = `<ul>${abilitiesList.map(a => `<li>${a.trim()}</li>`).join('')}</ul>`;
        } else {
            powersTab.textContent = 'No information available.';
        }
        
        document.getElementById('tab-history').textContent = char.history || 'No information available.';
        document.getElementById('tab-relationships').textContent = char.relationships || 'No information available.';

        const detailCardBody = modal.querySelector('.detail-card-body');
        const oldBtn = document.getElementById('modal-char-favorite-btn');
        if (oldBtn) oldBtn.remove();
        
        const favButton = document.createElement('button');
        favButton.id = 'modal-char-favorite-btn';
        favButton.className = 'add-to-omnitrix-btn'; 
        favButton.textContent = 'Add to Playlist';
        favButton.onclick = () => openPlaylistSelectionModal(char._id, char.name);
        detailCardBody.appendChild(favButton);

        modal.classList.add('active');

        const tabNav = modal.querySelector('.tab-nav');
        if (tabNav) {
            const tabPanes = modal.querySelectorAll('.tab-pane');
            const newTabNav = tabNav.cloneNode(true);
            tabNav.parentNode.replaceChild(newTabNav, tabNav);
            newTabNav.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    newTabNav.querySelector('.active')?.classList.remove('active');
                    e.target.classList.add('active');
                    tabPanes.forEach(pane => pane.classList.remove('active'));
                    modal.querySelector(`#${e.target.dataset.tab}`).classList.add('active');
                }
            });
            newTabNav.querySelector('button')?.click();
        }

        const knowMoreBtn = modal.querySelector('.know-more-btn');
        const backBtn = modal.querySelector('.back-button');
        const aiContentDiv = modal.querySelector('.ai-details-content');

        knowMoreBtn.onclick = async () => {
            detailCard.classList.add('ai-view');
            aiContentDiv.innerHTML = '<div class="loading-spinner"></div>';
            try {
                const response = await fetch(`/api/ai/details/character/${encodeURIComponent(char.name)}`);
                const htmlContent = await response.text();
                aiContentDiv.innerHTML = htmlContent;
            } catch (err) {
                aiContentDiv.innerHTML = `<p style="color: #ff4d4d;">Error.</p>`;
            }
        };

        backBtn.onclick = () => detailCard.classList.remove('ai-view');
    };

    const closeModal = () => {
        document.body.style.overflow = ''; 

        modal.classList.remove('active');
    };

    if(closeButton) closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    fetchAndDisplay(currentCategory, currentPage);
});


