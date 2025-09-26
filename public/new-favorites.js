function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

const showToast = (message, isError = false) => {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show ${isError ? 'error' : ''}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
};


const alienModalController = {
    modal: document.getElementById('alien-detail-modal'),
    init() {
        this.modal.querySelector('.close-button').addEventListener('click', () => this.hide());
        this.modal.addEventListener('click', e => e.target === this.modal && this.hide());
    },
    show(item) {
        let isUltimate = false;
        
        const nameElement = this.modal.querySelector('#modal-alien-name');
        const speciesElement = this.modal.querySelector('#modal-alien-species');
        const planetElement = this.modal.querySelector('#modal-alien-planet');
        const abilitiesElement = this.modal.querySelector('#modal-alien-abilities');
        const weaknessesElement = this.modal.querySelector('#modal-alien-weaknesses');
        const ultimateControl = this.modal.querySelector('#ultimate-control');
        const knowMoreBtn = this.modal.querySelector('.know-more-btn');
        const aiContentDiv = this.modal.querySelector('.ai-details-content');
        const animAlienImg = this.modal.querySelector('#anim-alien-img');
        const animGlow = this.modal.querySelector('#anim-glow');

        const runAnimation = (isUlt) => {
            const currentImage = isUlt ? (item.ultimateImage || item.image) : item.image;
            if (currentImage) animAlienImg.src = currentImage;
            
            this.modal.classList.add('animating');
            animGlow.className = 'anim-glow'; 
            animAlienImg.className = 'anim-alien-img';
            
            setTimeout(() => animGlow.classList.add('flash'), 200);
            setTimeout(() => animAlienImg.classList.add('hologram'), 400);
        };

        const updateButton = () => {
            ultimateControl.innerHTML = '';
            if (item.ultimateForm) {
                const btn = document.createElement('button');
                btn.className = 'ultimate-btn';
                btn.innerText = isUltimate ? 'Revert to Normal' : 'Go Ultimate!';
                btn.onclick = () => {
                    isUltimate = !isUltimate;
                    this.modal.classList.remove('animating');
                    setTimeout(() => updateDisplay(), 50);
                };
                ultimateControl.appendChild(btn);
            }
        };
        
        const updateDisplay = () => {
            this.modal.classList.toggle('is-ultimate', isUltimate);
            nameElement.innerText = isUltimate ? (item.ultimateForm || item.name) : item.name;
            const currentAbilities = isUltimate ? (item.ultimateAbilities || []) : (item.abilities || []);
            abilitiesElement.innerHTML = currentAbilities.length ? currentAbilities.map(p => `<li>${p}</li>`).join('') : '<li>N/A</li>';
            runAnimation(isUltimate);
            updateButton();
        };

        const fetchAiDetails = async () => {
            aiContentDiv.innerHTML = '<div class="loading-spinner"></div>';
            knowMoreBtn.style.display = 'none';
            try {
                const response = await fetch(`/api/ai/details/alien/${encodeURIComponent(item.name)}`);
                aiContentDiv.innerHTML = await response.text();
            } catch (err) {
                aiContentDiv.innerHTML = '<p>Could not load additional details at this time.</p>';
                console.error(err);
            }
        };
        
        speciesElement.innerText = item.species || 'Unknown';
        planetElement.innerText = item.homePlanet || 'Unknown';
        weaknessesElement.innerHTML = (item.weaknesses || []).length ? (item.weaknesses || []).map(w => `<li>${w}</li>`).join('') : '<li>N/A</li>';
        
        aiContentDiv.innerHTML = '';
        knowMoreBtn.style.display = 'block';
        knowMoreBtn.onclick = fetchAiDetails;
        
        updateDisplay();
        this.modal.classList.add('active');
    },
    hide() { this.modal.classList.remove('active'); }
};

const characterModalController = {
     modal: document.getElementById('character-detail-modal'),
    init() {
        this.modal.querySelector('.close-button').addEventListener('click', () => this.hide());
        this.modal.addEventListener('click', e => e.target === this.modal && this.hide());
    },
    show(item) {
        this.modal.querySelector('.detail-card').classList.remove('ai-view');
        this.modal.querySelector('#modal-char-image').src = item.image || 'images/placeholder.png';
        this.modal.querySelector('#modal-char-name').textContent = item.name.toUpperCase();
        this.modal.querySelector('#modal-char-species').textContent = item.species || 'Unknown';
        this.modal.querySelector('#tab-personality').textContent = item.personality || 'N/A';
        this.modal.querySelector('#tab-appearance').textContent = item.appearance || 'N/A';
        this.modal.querySelector('#tab-powers').textContent = item.powersAndAbilities || 'N/A';
        
        const tabNav = this.modal.querySelector('.tab-nav');
        tabNav.querySelector('.active')?.classList.remove('active');
        tabNav.querySelector('button')?.click();

        const knowMoreBtn = this.modal.querySelector('.know-more-btn');
        const backBtn = this.modal.querySelector('.back-button');
        const aiContentDiv = this.modal.querySelector('.ai-details-content');

        knowMoreBtn.onclick = async () => {
            this.modal.querySelector('.detail-card').classList.add('ai-view');
            aiContentDiv.innerHTML = '<div class="loading-spinner"></div>';
            try {
                const response = await fetch(`/api/ai/details/character/${encodeURIComponent(item.name)}`);
                aiContentDiv.innerHTML = await response.text();
            } catch (err) {
                aiContentDiv.innerHTML = '<p>Could not load additional details.</p>';
            }
        };

        backBtn.onclick = () => {
            this.modal.querySelector('.detail-card').classList.remove('ai-view');
        };

        this.modal.classList.add('active');
    },
    hide() { this.modal.classList.remove('active'); }
};

const planetModalController = {
    modal: document.getElementById('planet-detail-modal'),
    init() {
        this.modal.querySelector('.close-button').addEventListener('click', () => this.hide());
        this.modal.addEventListener('click', e => e.target === this.modal && this.hide());
    },
    show(item) {
        this.modal.querySelector('#modal-planet-img').src = item.image || 'images/placeholder.png';
        this.modal.querySelector('#modal-planet-name').textContent = item.name;
        this.modal.querySelector('#modal-planet-species').textContent = (item.nativeSpecies || []).join(', ');
        this.modal.querySelector('#modal-planet-appearance').textContent = item.firstAppearance || 'N/A';
        this.modal.querySelector('#modal-planet-description').textContent = item.description || 'N/A';
        this.modal.querySelector('#modal-planet-habitat').textContent = item.habitat || 'N/A';
        
        const knowMoreBtn = this.modal.querySelector('.know-more-btn');
        const aiContentDiv = this.modal.querySelector('.ai-details-content');
        aiContentDiv.innerHTML = '';
        knowMoreBtn.style.display = 'block';

        knowMoreBtn.onclick = async () => {
            aiContentDiv.innerHTML = '<div class="loading-spinner"></div>';
            knowMoreBtn.style.display = 'none';
            try {
                const response = await fetch(`/api/ai/details/planet/${encodeURIComponent(item.name)}`);
                aiContentDiv.innerHTML = await response.text();
            } catch (err) {
                aiContentDiv.innerHTML = '<p>Could not load additional details.</p>';
            }
        };

        this.modal.classList.add('active');
    },
    hide() { this.modal.classList.remove('active'); }
};

const confirmModal = {
    modal: document.getElementById('confirm-modal'),
    title: document.getElementById('confirm-title'),
    text: document.getElementById('confirm-text'),
    yesBtn: document.getElementById('confirm-yes'),
    noBtn: document.getElementById('confirm-no'),
    show(title, text) {
        return new Promise(resolve => {
            this.title.textContent = title;
            this.text.textContent = text;
            this.modal.classList.add('active');
            this.yesBtn.onclick = () => { this.hide(); resolve(true); };
            this.noBtn.onclick = () => { this.hide(); resolve(false); };
        });
    },
    hide() { this.modal.classList.remove('active'); }
};

const playlistManager = {
    init(type) {
        const controlsContainer = document.getElementById(`${type}-playlist-controls`);
        const itemsGrid = document.getElementById(`${type}-items-grid`);
        const token = localStorage.getItem('token');
        const typeSingular = type.slice(0, -1);

        if (!token) {
            controlsContainer.innerHTML = '<p>Please log in to manage your playlists.</p>';
            return;
        }

        let playlists = [];
        let activePlaylistId = null;
        
        const modalMap = {
            aliens: alienModalController,
            characters: characterModalController,
            planets: planetModalController
        };

        const fetchItemDetailsAndShowModal = async (itemId) => {
            try {
                const res = await fetch(`/api/details/${typeSingular}/${itemId}`);
                if (!res.ok) throw new Error('Could not fetch item details.');
                const item = await res.json();
                modalMap[type].show(item);
            } catch (err) {
                showToast(err.message, true);
            }
        };

        const renderItems = (items) => {
            itemsGrid.innerHTML = '';
            if (!items || items.length === 0) {
                itemsGrid.innerHTML = `<p class="empty-playlist-message">This playlist is empty. Add some ${type} to it!</p>`;
                return;
            }
            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'item-card';
                card.innerHTML = `
                    <button class="remove-item-btn" data-item-id="${item._id}" title="Remove from playlist">&times;</button>
                    <img src="${item.image || 'images/placeholder.png'}" alt="${item.name}">
                    <h3>${item.name}</h3>
                `;
                card.querySelector('.remove-item-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeItemFromPlaylist(item._id);
                });
                card.addEventListener('click', () => fetchItemDetailsAndShowModal(item._id));
                itemsGrid.appendChild(card);
            });
        };
        
        const renderControls = () => {
            controlsContainer.innerHTML = `
                <label for="${type}-playlist-select">Active Playlist:</label>
                <select id="${type}-playlist-select"></select>
                <button class="btn-delete">Delete</button>
                <input type="text" id="${type}-new-playlist-name" placeholder="New Playlist Name">
                <button class="btn-create">Create New</button>
            `;

            const select = controlsContainer.querySelector('select');
            if (playlists.length === 0) {
                select.innerHTML = '<option>No playlists yet</option>';
                 itemsGrid.innerHTML = `<p class="empty-playlist-message">Create your first ${type} playlist!</p>`;
            } else {
                select.innerHTML = playlists.map(p => 
                    `<option value="${p._id}" ${p._id === activePlaylistId ? 'selected' : ''}>${p.name}</option>`
                ).join('');
            }
            
            select.addEventListener('change', (e) => setActivePlaylist(e.target.value));
            controlsContainer.querySelector('.btn-create').addEventListener('click', createPlaylist);
            controlsContainer.querySelector('.btn-delete').addEventListener('click', () => deletePlaylist(select.value));
        };

        const fetchPlaylists = async () => {
            try {
                const res = await fetch(`/api/playlists/${type}`, { headers: { 'x-auth-token': token } });
                if (!res.ok) throw new Error('Could not fetch playlists');
                const data = await res.json();
                playlists = data.playlists;
                activePlaylistId = data.activePlaylistId;
                renderControls();
                renderItems(data.activePlaylistItems || []);
            } catch (err) {
                console.error(err);
                showToast(err.message, true);
            }
        };

        const createPlaylist = async () => {
            const input = document.getElementById(`${type}-new-playlist-name`);
            const name = input.value.trim();
            if (!name) return showToast('Please enter a name for the new playlist.', true);
            
            try {
                const res = await fetch(`/api/playlists/${type}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                    body: JSON.stringify({ name })
                });
                if (!res.ok) throw new Error('Failed to create playlist');
                input.value = '';
                showToast(`Playlist "${name}" created!`);
                fetchPlaylists();
            } catch (err) {
                showToast(err.message, true);
            }
        };
        
        const deletePlaylist = async (playlistId) => {
            if (!playlistId || playlists.length === 0) return showToast('No playlist selected to delete.', true);
            const playlist = playlists.find(p => p._id === playlistId);
            
            const confirmed = await confirmModal.show('Delete Playlist', `Are you sure you want to delete the playlist "${playlist.name}"?`);
            if (!confirmed) return;

            try {
                const res = await fetch(`/api/playlists/${type}/${playlistId}`, {
                    method: 'DELETE',
                    headers: { 'x-auth-token': token }
                });
                if (!res.ok) throw new Error('Failed to delete playlist');
                showToast(`Playlist "${playlist.name}" deleted.`);
                fetchPlaylists();
            } catch (err) {
                showToast(err.message, true);
            }
        };

        const setActivePlaylist = async (playlistId) => {
             try {
                const res = await fetch(`/api/playlists/${type}/set-active/${playlistId}`, {
                    method: 'PUT',
                    headers: { 'x-auth-token': token }
                });
                if (!res.ok) throw new Error('Failed to set active playlist');
                fetchPlaylists();
            } catch (err) {
                showToast(err.message, true);
            }
        };

        const removeItemFromPlaylist = async (itemId) => {
            if (!activePlaylistId) return showToast('No active playlist to remove from.', true);
            try {
                 const res = await fetch(`/api/playlists/${type}/${activePlaylistId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                    body: JSON.stringify({ itemId, action: 'remove' })
                });
                if (!res.ok) throw new Error('Failed to remove item');
                showToast('Item removed from playlist.');
                fetchPlaylists();
            } catch (err) {
                showToast(err.message, true);
            }
        };

        fetchPlaylists();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.tab-link').click(); 
    
    alienModalController.init();
    characterModalController.init();
    planetModalController.init();
    
    playlistManager.init('aliens');
    playlistManager.init('characters');
    playlistManager.init('planets');
});