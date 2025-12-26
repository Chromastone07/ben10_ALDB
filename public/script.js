
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const alienContainer = document.querySelector('.alien-container');
    const searchBar = document.getElementById('search-bar');
    const filterNav = document.querySelector('.filter-nav');
    const modal = document.getElementById('alien-modal');
    const closeButton = modal.querySelector('.close-button');
    const animOmnitrix = document.getElementById('anim-omnitrix');
    const animGlow = document.getElementById('anim-glow');
    const animAlienImg = document.getElementById('anim-alien-img');
    const toast = document.getElementById('toast-notification');
    const sentinel = document.getElementById('scroll-sentinel');
    const sentinelLoader = sentinel.querySelector('.loader');
    const suggestionsBox = document.getElementById('suggestions-box');

    // Playlist Modal Elements
    const playlistSelectModal = document.getElementById('playlist-select-modal');
    const closePlaylistSelect = document.getElementById('close-playlist-select');
    const playlistListContainer = document.getElementById('playlist-list-container');
    const playlistLoader = document.getElementById('playlist-loader');

    // --- State Variables ---
    let currentPage = 1;
    let currentSeries = 'All';
    let searchTimeout;
    let toastTimeout;
    let isLoading = false;
    let userPlaylists = []; 

    // --- Helper: Show Toast ---
    const showToast = (message, isError = false) => {
        toast.textContent = message;
        toast.className = `toast ${isError ? 'error' : ''}`;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    // --- Helper: Fetch Playlists ---
    const fetchUserPlaylists = async () => {
        const token = localStorage.getItem('token');
        if (!token) return [];
        try {
            const res = await fetch('/api/playlists/aliens', { headers: { 'x-auth-token': token } });
            if (res.ok) {
                const data = await res.json();
                userPlaylists = data.playlists || [];
                return userPlaylists;
            }
            return [];
        } catch (err) {
            console.error('Could not fetch playlists', err);
            return [];
        }
    };

    // --- Feature: Add to Playlist (With Selection) ---
    let pendingAlienToAdd = null; 

    const openPlaylistSelectionModal = async (alienId, alienName) => {
        const token = localStorage.getItem('token');
        if (!token) return showToast('Please log in to use the Omnitrix.', true);

        pendingAlienToAdd = { id: alienId, name: alienName };
        playlistSelectModal.classList.add('active');
        playlistLoader.style.display = 'block';
        playlistListContainer.innerHTML = '';

        const playlists = await fetchUserPlaylists();
        playlistLoader.style.display = 'none';

        if (playlists.length === 0) {
            playlistListContainer.innerHTML = '<p>No playlists found. Create one in your Profile.</p>';
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
        if (!pendingAlienToAdd) return;

        try {
            const res = await fetch(`/api/playlists/aliens/${playlistId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ itemId: pendingAlienToAdd.id, action: 'add' })
            });

            if (res.ok) {
                showToast(`${pendingAlienToAdd.name} added to ${playlistName}!`);
                playlistSelectModal.classList.remove('active');
            } else {
                const err = await res.json();
                showToast(err.msg || 'Failed to add alien', true);
            }
        } catch (error) {
            showToast('Network error', true);
        }
    };

    closePlaylistSelect.addEventListener('click', () => {
        playlistSelectModal.classList.remove('active');
    });

    // --- Core: Fetch Aliens ---
    const fetchAliens = async (page, series, shouldAppend = false) => {
        if (isLoading) return; 
        isLoading = true;

        if (!shouldAppend) {
            alienContainer.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;
            if (sentinelLoader) sentinelLoader.style.display = 'none';
        } else {
            if (sentinelLoader) sentinelLoader.style.display = 'block';
        }

        let url = `/api/aliens?page=${page}&limit=12`;
        if (series && series !== 'All') url += `&series=${encodeURIComponent(series)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (!shouldAppend) alienContainer.innerHTML = '';
            displayAliens(data.results || []);

            if (data.hasNextPage) {
                observer.observe(sentinel);
            } else {
                observer.unobserve(sentinel);
                if (sentinelLoader) sentinelLoader.style.display = 'none';
            }
        } catch (error) {
            console.error("Could not fetch aliens:", error);
        } finally {
            isLoading = false;
            if (shouldAppend && sentinelLoader) sentinelLoader.style.display = 'none';
        }
    };

    // --- Core: Autocomplete ---
    const showSuggestions = (aliens) => {
        suggestionsBox.innerHTML = '';
        if (aliens.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }
        aliens.forEach(alien => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `<img src="${alien.image || 'images/placeholder.png'}"><span>${alien.name}</span>`;
            div.addEventListener('click', () => {
                showAlienDetails(alien);
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
                filterNav.style.display = 'flex';
                fetchAliens(1, currentSeries, false);
            }
            return;
        }
        searchTimeout = setTimeout(async () => { 
            filterNav.style.display = 'none';
            try {
                const res = await fetch(`/api/aliens/search/${encodeURIComponent(term)}`);
                const data = await res.json();
                showSuggestions(data.results || []);
            } catch(e) { console.error(e); }
        }, 300);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) suggestionsBox.style.display = 'none';
    });

    // --- Display Logic ---
    function displayAliens(aliensToDisplay) {
        if (aliensToDisplay.length === 0 && currentPage === 1) {
            alienContainer.innerHTML = `<p style="color: #778da9; grid-column: 1 / -1;">No aliens found.</p>`;
            return;
        }

        aliensToDisplay.forEach(alien => {
            const alienCard = document.createElement('div');
            alienCard.className = 'alien-card';
            
            alienCard.innerHTML = `
                <div class="favorite-omnitrix" title="Add to Playlist"></div>
                <div class="alien-image-wrapper"><img class="alien-image" src="${alien.image || 'images/placeholder.png'}" alt="${alien.name}"></div>
                <div class="alien-info"><h3>${alien.name}</h3><p>${alien.species}</p></div>
            `;

            const favBtn = alienCard.querySelector('.favorite-omnitrix');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                openPlaylistSelectionModal(alien._id, alien.name);
            });

            alienCard.addEventListener('click', () => showAlienDetails(alien));
            alienContainer.appendChild(alienCard);
        });
    }

    // --- Filter & Scroll ---
    filterNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentSeries = e.target.dataset.series;
            currentPage = 1;
            document.querySelector('.filter-btn.active')?.classList.remove('active');
            e.target.classList.add('active');
            if (observer) observer.disconnect();
            fetchAliens(currentPage, currentSeries, false);
        }
    });

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
            currentPage++;
            fetchAliens(currentPage, currentSeries, true);
        }
    }, { rootMargin: '100px' });

    // --- Modal Logic ---
    function showAlienDetails(alien) {
        let isUltimate = false;
        const detailsPane = modal.querySelector('.details-pane');
        
        const oldBtn = document.getElementById('modal-favorite-btn');
        if (oldBtn) oldBtn.remove();
        const favButton = document.createElement('button');
        favButton.id = 'modal-favorite-btn';
        favButton.className = `add-to-omnitrix-btn`;
        favButton.textContent = 'Add to Playlist';
        favButton.onclick = () => openPlaylistSelectionModal(alien._id, alien.name);
        detailsPane.appendChild(favButton);

        const nameElement = document.getElementById('modal-alien-name');
        const powersElement = document.getElementById('modal-alien-abilities');
        
        const updateDisplay = () => {
            modal.classList.toggle('is-ultimate', isUltimate);
            nameElement.innerText = isUltimate ? (alien.ultimateForm || alien.name) : alien.name;
            const currentAbilities = isUltimate ? (alien.ultimateAbilities || []) : (alien.abilities || []);
            powersElement.innerHTML = currentAbilities.length ? currentAbilities.map(p => `<li>${p}</li>`).join('') : '<li>None listed.</li>';
            
            const currentImage = isUltimate ? (alien.ultimateImage || alien.image) : alien.image;
            if (currentImage) animAlienImg.src = currentImage;
            modal.classList.add('animating');
            animOmnitrix.classList.add('active');
            setTimeout(() => animGlow.classList.add('flash'), 200);
            setTimeout(() => animAlienImg.classList.add('hologram'), 400);

            const ultControl = document.getElementById('ultimate-control');
            ultControl.innerHTML = '';
            if (alien.ultimateForm) {
                const btn = document.createElement('button');
                btn.className = 'ultimate-btn';
                btn.innerText = isUltimate ? 'Revert to Normal' : 'Go Ultimate!';
                btn.onclick = () => { isUltimate = !isUltimate; updateDisplay(); };
                ultControl.appendChild(btn);
            }
        };

        document.getElementById('modal-alien-species').innerText = alien.species || 'Unknown';
        document.getElementById('modal-alien-planet').innerText = alien.homePlanet || 'Unknown';
        document.getElementById('modal-alien-weaknesses').innerHTML = (alien.weaknesses || []).map(w => `<li>${w}</li>`).join('');
        
        const aiContent = modal.querySelector('.ai-details-content');
        aiContent.innerHTML = '';
        const knowMoreBtn = modal.querySelector('.know-more-btn');
        knowMoreBtn.style.display = 'block';
        knowMoreBtn.onclick = async () => {
            aiContent.innerHTML = '<div class="loading-spinner"></div>';
            knowMoreBtn.style.display = 'none';
            try {
                const res = await fetch(`/api/ai/details/alien/${encodeURIComponent(alien.name)}`);
                aiContent.innerHTML = await res.text();
            } catch (e) { aiContent.innerHTML = 'Error fetching details.'; }
        };

        updateDisplay();
        modal.classList.add('active');
    }

    closeButton.addEventListener('click', () => modal.classList.remove('active'));

    // --- BATTLE SIMULATOR LOGIC (UPDATED) ---
    const battleBtn = document.getElementById('battle-mode-btn');
    const battleModal = document.getElementById('battle-modal');
    const closeBattle = document.getElementById('close-battle');
    const startBattleBtn = document.getElementById('start-battle-btn');
    const battleTeamList = document.getElementById('battle-team-list');
    const battleVillainName = document.getElementById('battle-villain-name');
    const battleLog = document.getElementById('battle-log');
    const battleLoader = document.getElementById('battle-loader');
    const battlePlaylistSelect = document.getElementById('battle-playlist-select');

    let currentBattleTeam = [];

    // --- Voice Logic (TTS) ---
    let isTtsEnabled = false;
    let voices = [];
    const ttsButton = document.getElementById('chat-tts-btn');

    function populateVoiceList() { voices = speechSynthesis.getVoices(); }
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = populateVoiceList;

    const speak = (text) => {
        if (!isTtsEnabled || !text) return;
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        let azmuthVoice = voices.find(v => v.name === 'Google UK English Male' || v.lang === 'en-GB' || v.lang === 'en-US');
        if (azmuthVoice) utterance.voice = azmuthVoice;
        utterance.pitch = 1.3;
        utterance.rate = 1.1;
        speechSynthesis.speak(utterance);
    };

    ttsButton.addEventListener('click', () => {
        isTtsEnabled = !isTtsEnabled;
        ttsButton.classList.toggle('active', isTtsEnabled);
        if (!isTtsEnabled) speechSynthesis.cancel();
        else speak("Voice systems calibrated.");
    });

    // Battle Modal Open
    battleBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        if (!token) return showToast("Log in to access Battle Mode!");

        battleModal.classList.add('active');
        battleTeamList.innerHTML = '<li>Loading Playlists...</li>';
        
        // 1. Fetch Playlists
        const playlists = await fetchUserPlaylists();
        
        // 2. Populate Dropdown
        battlePlaylistSelect.innerHTML = '';
        if (playlists.length === 0) {
            battlePlaylistSelect.innerHTML = '<option value="">No Playlists Found</option>';
            battleTeamList.innerHTML = '<li>Create a playlist first!</li>';
            startBattleBtn.disabled = true;
            return;
        }

        playlists.forEach((pl, index) => {
            const opt = document.createElement('option');
            opt.value = index; 
            opt.textContent = pl.name;
            battlePlaylistSelect.appendChild(opt);
        });

        // 3. Select first playlist by default
        loadBattleTeam(0);
        
        battleVillainName.innerText = "???";
        battleLog.innerHTML = "<p>System Ready. Initiating simulation...</p>";
        startBattleBtn.disabled = false;
    });

    battlePlaylistSelect.addEventListener('change', (e) => loadBattleTeam(e.target.value));

    function loadBattleTeam(index) {
        if (!userPlaylists[index]) return;
        
        const selectedPlaylist = userPlaylists[index];
        battleTeamList.innerHTML = '';
        
        // Debug Log
        console.log("Loading Playlist Data:", selectedPlaylist.items);

        // Filter out any nulls/broken data
        if (!selectedPlaylist.items || selectedPlaylist.items.length === 0) {
            battleTeamList.innerHTML = '<li style="color:red">Empty Playlist!</li>';
            currentBattleTeam = [];
            startBattleBtn.disabled = true;
            return;
        }

        // Map safe items
        currentBattleTeam = selectedPlaylist.items
            .filter(item => {
                if (item && item.name) return true;
                console.warn("Found invalid item (likely ID only or null):", item);
                return false;
            })
            .map(item => item.name);

        if (currentBattleTeam.length === 0) {
            battleTeamList.innerHTML = '<li style="color:red">Invalid Alien Data! (Check Console)</li>';
            startBattleBtn.disabled = true;
        } else {
            currentBattleTeam.forEach(name => {
                const li = document.createElement('li');
                li.textContent = name;
                battleTeamList.appendChild(li);
            });
            startBattleBtn.disabled = false;
        }
    }

    startBattleBtn.addEventListener('click', async () => {
        if (currentBattleTeam.length === 0) return;

        startBattleBtn.disabled = true;
        battleLoader.style.display = 'block';
        battleVillainName.innerText = "Scanning...";
        battleLog.innerHTML = "<p>Simulating combat scenarios...</p>";

        try {
            const response = await fetch('/api/ai/battle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ team: currentBattleTeam })
            });

            const data = await response.json();
            
            battleLoader.style.display = 'none';

            if (data.outcome === "ERROR" || !data.villain) {
                 battleVillainName.innerText = "Error";
                 battleLog.innerHTML = `<p style="color:red">${data.scenario || "Simulation Failed"}</p>`;
                 return;
            }

            battleVillainName.innerText = data.villain;
            const outcomeClass = data.outcome === 'VICTORY' ? 'outcome-win' : 'outcome-loss';
            battleLog.innerHTML = `
                <p>${data.scenario}</p>
                <hr style="border-color: #333; margin: 10px 0;">
                <p class="${outcomeClass}">RESULT: ${data.outcome}</p>
            `;

            speak(`Simulation complete. Result: ${data.outcome}`);

        } catch (error) {
            console.error(error);
            battleVillainName.innerText = "System Failure";
            battleLog.innerHTML = "<p style='color:red'>Connection lost to Primus.</p>";
            battleLoader.style.display = 'none';
        } finally {
            startBattleBtn.disabled = false;
        }
    });

    closeBattle.addEventListener('click', () => battleModal.classList.remove('active'));

    // --- Chat Widget Logic ---
    const chatToggleButton = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendButton = document.getElementById('chat-send-btn');

    chatToggleButton.addEventListener('click', () => chatWindow.classList.toggle('hidden'));

    const appendMessage = (text, type) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    };

    const sendChatMessage = async () => {
        const query = chatInput.value.trim();
        if (!query) return;
        appendMessage(query, 'user');
        chatInput.value = '';
        const thinkingMessage = appendMessage('Thinking...', 'ai thinking');
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });
            const data = await response.json();
            thinkingMessage.textContent = data.answer;
            thinkingMessage.classList.remove('thinking');
            speak(data.answer);
        } catch (error) {
            thinkingMessage.textContent = "Error connecting to AI.";
            thinkingMessage.classList.remove('thinking');
        }
    };

    chatSendButton.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });

    // --- Initial Load ---
    fetchAliens(currentPage, currentSeries);
});