

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('character-grid');
    const searchBar = document.getElementById('search-bar');
    const loadMoreButton = document.getElementById('load-more-characters');
    const filterNav = document.querySelector('.filter-nav');
    const modal = document.getElementById('modal');
    const closeButton = modal.querySelector('.close-button');
    const toast = document.getElementById('toast-notification');

    let currentPage = 1;
    let currentCategory = 'All';
    let searchTimeout;
    let activeCharacterPlaylistId = null;

    const getActivePlaylistId = async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const res = await fetch('/api/playlists/characters', { headers: { 'x-auth-token': token } });
            if (res.ok) {
                const data = await res.json();
                return data.activePlaylistId;
            }
            return null;
        } catch (err) {
            console.error('Could not fetch active character playlist ID', err);
            return null;
        }
    };
    
    const showToast = (message, isError = false) => {
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast show ${isError ? 'error' : ''}`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    };
    
    const addItemToActivePlaylist = async (characterId, characterName) => {
        const token = localStorage.getItem('token');
        if (!token) return showToast('Please log in to add characters.');
        
        if (!activeCharacterPlaylistId) {
            return showToast('Please select an active character playlist in "My Omnitrix".', true);
        }

        try {
            const res = await fetch(`/api/playlists/characters/${activeCharacterPlaylistId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ itemId: characterId, action: 'add' })
            });
            if (res.ok) {
                showToast(`${characterName} added to your active playlist!`);
            } else {
                 const errData = await res.json();
                throw new Error(errData.msg || 'Failed to add character to playlist');
            }
        } catch (err) {
            console.error('Failed to add to playlist', err);
            showToast(err.message, true);
        }
    };

    const fetchAndDisplay = async (category, page, shouldAppend = false) => {
        if (!shouldAppend) {
            grid.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;
        }
        loadMoreButton.style.display = 'none';
        
        let url = `/api/characters?page=${page}&limit=12`;
        if (category && category !== 'All') url += `&category=${category}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!shouldAppend) grid.innerHTML = '';
            renderGrid(data.results);
            if (data.hasNextPage) {
                loadMoreButton.style.display = 'block';
            }
        } catch (error) { console.error('Failed to fetch characters:', error); }
    };

    const fetchSearchResults = async (term) => {
        grid.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;
        filterNav.style.display = 'none';
        loadMoreButton.style.display = 'none';

        if (!term) {
            filterNav.style.display = 'flex';
            fetchAndDisplay(currentCategory, 1, false);
            return;
        }
        try {
            const response = await fetch(`/api/characters/search/${term}`);
            const data = await response.json();
            grid.innerHTML = '';
            renderGrid(data.results);
        } catch (error) { console.error('Failed to fetch search results:', error); }
    };

    const renderGrid = (characters) => {
        if (characters.length === 0 && currentPage === 1) {
            grid.innerHTML = `<p style="color: var(--text-light); opacity: 0.7;">No characters found.</p>`;
        }
        characters.forEach(char => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <div class="favorite-omnitrix" title="Add to Active Playlist"></div>
                <div class="character-card-image-wrapper"><img src="${char.image || 'images/placeholder.png'}" alt="${char.name}"></div>
                <div class="character-card-info"><h3>${char.name.toUpperCase()}</h3></div>`;
            
            card.addEventListener('click', (e) => {
                if(e.target.classList.contains('favorite-omnitrix')) {
                    addItemToActivePlaylist(char._id, char.name);
                } else {
                    openModal(char)
                }
            });
            grid.appendChild(card);
        });
    };

    searchBar.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => { fetchSearchResults(e.target.value.trim()); }, 300);
    });

    filterNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentCategory = e.target.dataset.category;
            currentPage = 1;
            document.querySelector('.filter-btn.active').classList.remove('active');
            e.target.classList.add('active');
            fetchAndDisplay(currentCategory, currentPage, false);
        }
    });

    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        fetchAndDisplay(currentCategory, currentPage, true);
    });

    const openModal = (char) => {
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
        favButton.textContent = 'Add to Active Playlist';
        favButton.onclick = () => {
            addItemToActivePlaylist(char._id, char.name);
        };
        
        detailCardBody.appendChild(favButton);

        modal.classList.add('active');

        const tabNav = modal.querySelector('.tab-nav');
        if (tabNav) {
            const tabPanes = modal.querySelectorAll('.tab-pane');
            const onTabClick = (e) => {
                if (e.target.tagName === 'BUTTON') {
                    tabNav.querySelector('.active')?.classList.remove('active');
                    e.target.classList.add('active');
                    tabPanes.forEach(pane => pane.classList.remove('active'));
                    modal.querySelector(`#${e.target.dataset.tab}`).classList.add('active');
                }
            };
            const newTabNav = tabNav.cloneNode(true);
            tabNav.parentNode.replaceChild(newTabNav, tabNav);
            newTabNav.addEventListener('click', onTabClick);
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
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch AI details');
                }
                const htmlContent = await response.text();
                aiContentDiv.innerHTML = htmlContent;
            } catch (err) {
                aiContentDiv.innerHTML = `<p style="color: #ff4d4d;">Error: ${err.message}</p>`;
            }
        };

        backBtn.onclick = () => {
            detailCard.classList.remove('ai-view');
        };
    };
    
    const closeModal = () => {
        modal.classList.remove('active');
    };
    
    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    getActivePlaylistId().then(id => {
        activeCharacterPlaylistId = id;
    });
    fetchAndDisplay(currentCategory, currentPage);
});