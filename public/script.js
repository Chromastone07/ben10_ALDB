

document.addEventListener('DOMContentLoaded', () => {
    const alienContainer = document.querySelector('.alien-container');
    const searchBar = document.getElementById('search-bar');
    const loadMoreButton = document.getElementById('load-more-aliens');
    const filterNav = document.querySelector('.filter-nav');
    const modal = document.getElementById('alien-modal');
    const closeButton = modal.querySelector('.close-button');
    const animOmnitrix = document.getElementById('anim-omnitrix');
    const animGlow = document.getElementById('anim-glow');
    const animAlienImg = document.getElementById('anim-alien-img');
    const toast = document.getElementById('toast-notification');

    let currentPage = 1;
    let currentSeries = 'All';
    let searchTimeout;
    let toastTimeout;

    if (!window.userFavorites) window.userFavorites = {};
    if (!window.userFavorites.aliens) window.userFavorites.aliens = new Set();

    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    const toggleFavorite = async (alienId, buttonEl, type = 'icon') => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Please log in to add to your Omnitrix.');

        try {
            const res = await fetch(`/api/favorites/alien/${alienId}`, {
                method: 'POST',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const favoriteIds = await res.json();
                window.userFavorites.aliens = new Set(favoriteIds);

                updateAllFavoriteIcons(alienId);

                if (window.userFavorites.aliens.has(alienId)) {
                    showToast(`${buttonEl.dataset.name} added to My Omnitrix!`);
                } else {
                    showToast(`${buttonEl.dataset.name} removed from My Omnitrix.`);
                }
            }
        } catch (err) {
            console.error('Failed to toggle favorite', err);
        }
    };

    const updateAllFavoriteIcons = (alienId) => {
        const isFavorited = window.userFavorites.aliens.has(alienId);

        const cardIcon = document.querySelector(`.favorite-omnitrix[data-id="${alienId}"]`);
        if (cardIcon) cardIcon.classList.toggle('favorited', isFavorited);

        const modalBtn = document.getElementById('modal-favorite-btn');
        if (modalBtn && modalBtn.dataset.id === String(alienId)) {
            modalBtn.classList.toggle('favorited', isFavorited);
            modalBtn.textContent = isFavorited ? 'Remove from Omnitrix' : 'Add to Your Omnitrix';
        }
    };

    const fetchAliens = async (page, series, shouldAppend = false) => {
        if (!shouldAppend) {
            alienContainer.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;
        }
        loadMoreButton.style.display = 'none';

        let url = `/api/aliens?page=${page}&limit=12`;
        if (series && series !== 'All') url += `&series=${encodeURIComponent(series)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!shouldAppend) alienContainer.innerHTML = '';
            displayAliens(data.results || []);
            if (data.hasNextPage) {
                loadMoreButton.style.display = 'block';
            }
        } catch (error) {
            console.error("Could not fetch aliens:", error);
        }
    };




async function loadUserFavorites() {
    try {
        const res = await fetch('/api/favorites/ids', {
            headers: { 'x-auth-token': localStorage.getItem('token') }
        });

        if (!res.ok) {
            console.error("Could not fetch favorites");
            return;
        }

        const favorites = await res.json();

        const omnitrixContainer = document.getElementById('my-omnitrix');
        omnitrixContainer.innerHTML = '';

        async function renderFavorites(ids, type) {
            for (const id of ids) {
                try {
                    const itemRes = await fetch(`/api/${type}s/${id}`);
                    if (!itemRes.ok) continue;

                    const item = await itemRes.json();

                    const card = document.createElement('div');
                    card.className = 'alien-card';
                    card.innerHTML = `
                        <div class="alien-image-wrapper">
                            <img class="alien-image" src="${item.image || 'images/placeholder.png'}" alt="${item.name}">
                        </div>
                        <div class="alien-info">
                            <h3>${item.name}</h3>
                        </div>
                    `;
                    omnitrixContainer.appendChild(card);
                } catch (err) {
                    console.error(`Error rendering ${type} ${id}:`, err);
                }
            }
        }

        await renderFavorites(favorites.aliens, 'alien');
        await renderFavorites(favorites.characters, 'character');
        await renderFavorites(favorites.planets, 'planet');

    } catch (err) {
        console.error("Error loading favorites:", err);
    }
}

document.addEventListener('DOMContentLoaded', loadUserFavorites);






    const fetchSearchResults = async (term) => {
        alienContainer.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;
        filterNav.style.display = 'none';
        loadMoreButton.style.display = 'none';

        if (!term) {
            filterNav.style.display = 'flex';
            fetchAliens(1, currentSeries, false);
            return;
        }
        try {
            const response = await fetch(`/api/aliens/search/${encodeURIComponent(term)}`);
            const data = await response.json();
            alienContainer.innerHTML = '';
            displayAliens(data.results || []);
        } catch (error) {
            console.error("Could not fetch search results:", error);
        }
    };

    function displayAliens(aliensToDisplay) {
        if (aliensToDisplay.length === 0 && currentPage === 1) {
            alienContainer.innerHTML = `<p style="color: #778da9; grid-column: 1 / -1;">No aliens found.</p>`;
            return;
        }

        aliensToDisplay.forEach(alien => {
            const alienCard = document.createElement('div');
            alienCard.className = 'alien-card';

            const isFavorited = window.userFavorites.aliens.has(alien._id);

            alienCard.innerHTML = `
                <div class="favorite-omnitrix ${isFavorited ? 'favorited' : ''}" data-id="${alien._id}" data-name="${alien.name}" title="Add to My Omnitrix"></div>
                <div class="alien-image-wrapper"><img class="alien-image" src="${alien.image || 'images/placeholder.png'}" alt="${alien.name}"></div>
                <div class="alien-info"><h3>${alien.name}</h3><p>${alien.species}</p></div>
            `;

            alienCard.addEventListener('click', (e) => {
                if (e.target.classList.contains('favorite-omnitrix')) {
                    toggleFavorite(alien._id, e.target, 'icon');
                } else {
                    showAlienDetails(alien);
                }
            });

            alienContainer.appendChild(alienCard);
        });
    }

    searchBar.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const v = e.target.value.trim();
        searchTimeout = setTimeout(() => { fetchSearchResults(v); }, 300);
    });

    filterNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentSeries = e.target.dataset.series;
            currentPage = 1;
            const currentActive = document.querySelector('.filter-btn.active');
            if (currentActive) currentActive.classList.remove('active');
            e.target.classList.add('active');
            fetchAliens(currentPage, currentSeries, false);
        }
    });

    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        fetchAliens(currentPage, currentSeries, true);
    });

    function showAlienDetails(alien) {
        let isUltimate = false;

        const ultimateControl = document.getElementById('ultimate-control');
        const nameElement = document.getElementById('modal-alien-name');
        const powersElement = document.getElementById('modal-alien-abilities');
        const knowMoreBtn = modal.querySelector('.know-more-btn');
        const aiContentDiv = modal.querySelector('.ai-details-content');
        const detailsPane = modal.querySelector('.details-pane');
        const isFavorited = window.userFavorites.aliens.has(alien._id);

        const oldBtn = document.getElementById('modal-favorite-btn');
        if (oldBtn) oldBtn.remove();

        const favButton = document.createElement('button');
        favButton.id = 'modal-favorite-btn';
        favButton.className = `add-to-omnitrix-btn ${isFavorited ? 'favorited' : ''}`;
        favButton.textContent = isFavorited ? 'Remove from Omnitrix' : 'Add to Your Omnitrix';
        favButton.dataset.id = String(alien._id);
        favButton.dataset.name = alien.name;
        favButton.onclick = (e) => {
            toggleFavorite(alien._id, e.target, 'button');
        };
        detailsPane.appendChild(favButton);

        const runAnimation = (isUlt) => {
            const currentImage = isUlt ? (alien.ultimateImage || alien.image) : alien.image;
            if (currentImage) animAlienImg.src = currentImage;
            modal.classList.add('animating');
            animOmnitrix.classList.add('active');
            setTimeout(() => animGlow.classList.add('flash'), 200);
            setTimeout(() => animAlienImg.classList.add('hologram'), 400);
        };

        const updateButton = () => {
            ultimateControl.innerHTML = '';
            if (alien.ultimateForm) {
                const btn = document.createElement('button');
                btn.className = 'ultimate-btn';
                btn.innerText = isUltimate ? 'Revert to Normal' : 'Go Ultimate!';
                btn.onclick = () => {
                    isUltimate = !isUltimate;
                    modal.classList.remove('animating');
                    animOmnitrix.classList.remove('active');
                    animGlow.classList.remove('flash');
                    animAlienImg.classList.remove('hologram');
                    setTimeout(updateDisplay, 50);
                };
                ultimateControl.appendChild(btn);
            }
        };

        const updateDisplay = () => {
            modal.classList.toggle('is-ultimate', isUltimate);
            nameElement.innerText = isUltimate ? (alien.ultimateForm || alien.name) : alien.name;
            const currentAbilities = isUltimate ? (alien.ultimateAbilities || []) : (alien.abilities || []);
            powersElement.innerHTML = currentAbilities.length
                ? currentAbilities.map(p => `<li>${p}</li>`).join('')
                : '<li>None listed.</li>';
            runAnimation(isUltimate);
            updateButton();
        };

        const fetchAiDetails = async () => {
            aiContentDiv.innerHTML = '<div class="loading-spinner"></div>';
            knowMoreBtn.style.display = 'none';
            try {
                const response = await fetch(`/api/ai/details/alien/${encodeURIComponent(alien.name)}`);
                const htmlContent = await response.text();
                aiContentDiv.innerHTML = htmlContent;
            } catch (err) {
                aiContentDiv.innerHTML = '<p>Could not load additional details at this time.</p>';
                console.error(err);
            }
        };

        document.getElementById('modal-alien-species').innerText = alien.species || 'Unknown';
        document.getElementById('modal-alien-planet').innerText = alien.homePlanet || 'Unknown';
        document.getElementById('modal-alien-weaknesses').innerHTML =
            (alien.weaknesses || []).length
                ? (alien.weaknesses || []).map(w => `<li>${w}</li>`).join('')
                : '<li>None listed.</li>';

        aiContentDiv.innerHTML = '';
        knowMoreBtn.style.display = 'block';
        knowMoreBtn.onclick = fetchAiDetails;

        updateDisplay();
        modal.classList.add('active');
    }

    const closeModal = () => {
        modal.classList.remove('active');
    };

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    const chatToggleButton = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendButton = document.getElementById('chat-send-btn');
    const ttsButton = document.getElementById('chat-tts-btn');
    let isTtsEnabled = false;
    let voices = [];

    function populateVoiceList() {
        voices = speechSynthesis.getVoices();
    }
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    const speak = (text) => {
        if (!isTtsEnabled || !text) return;
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        let azmuthVoice =
            voices.find(voice => voice.name === 'Google UK English Male') ||
            voices.find(voice => voice.name === 'Daniel') ||
            voices.find(voice => voice.lang === 'en-US');
        if (azmuthVoice) utterance.voice = azmuthVoice;
        utterance.pitch = 1.5;
        utterance.rate = 1.1;
        speechSynthesis.speak(utterance);
    };

    ttsButton.addEventListener('click', () => {
        isTtsEnabled = !isTtsEnabled;
        ttsButton.classList.toggle('active', isTtsEnabled);
        if (!isTtsEnabled) {
            speechSynthesis.cancel();
        } else {
            if (voices.length > 0) speak("Voice diagnostics online.");
        }
    });

    chatToggleButton.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
    });

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
            if (!response.ok) throw new Error('Network response was not ok.');
            const data = await response.json();
            thinkingMessage.textContent = data.answer;
            thinkingMessage.classList.remove('thinking');
            speak(data.answer);
        } catch (error) {
            thinkingMessage.textContent = 'Apologies, my connection to the Codon Stream seems to be failing. Try again.';
            thinkingMessage.classList.remove('thinking');
            console.error('Chat error:', error);
        }
    };

    chatSendButton.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });

    fetchAliens(currentPage, currentSeries);
});
