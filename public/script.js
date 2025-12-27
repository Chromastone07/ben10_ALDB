document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DOM ELEMENTS (Defined at top to prevent errors) ---
    const alienContainer = document.querySelector('.alien-container');
    const searchBar = document.getElementById('search-bar');
    const filterNav = document.querySelector('.filter-nav');
    
    // Main Modal Elements
    const modal = document.getElementById('alien-modal');
    const closeButton = modal ? modal.querySelector('.close-button') : null;
    const animOmnitrix = document.getElementById('anim-omnitrix');
    const animGlow = document.getElementById('anim-glow');
    const animAlienImg = document.getElementById('anim-alien-img');
    const suggestionsBox = document.getElementById('suggestions-box');
    
    // Sentinel for Scrolling
    const sentinel = document.getElementById('scroll-sentinel');
    const sentinelLoader = sentinel ? sentinel.querySelector('.loader') : null;

    // Playlist Modal Elements
    const playlistSelectModal = document.getElementById('playlist-select-modal');
    const closePlaylistSelect = document.getElementById('close-playlist-select');
    const playlistListContainer = document.getElementById('playlist-list-container');
    const playlistLoader = document.getElementById('playlist-loader');

    // Battle Mode Elements (The ones causing issues)
    const battleBtn = document.getElementById('battle-mode-btn');
    const battleModal = document.getElementById('battle-modal');
    const closeBattle = document.getElementById('close-battle'); // The "X" button
    const resetBattleBtn = document.getElementById('reset-battle-btn'); // The Reset button
    
    // Battle Navigation & Setup
    const battleModeSelect = document.getElementById('battle-mode-select');
    const battleCustomSetup = document.getElementById('battle-custom-setup');
    const selectRandomBtn = document.getElementById('select-random-mode');
    const selectCustomBtn = document.getElementById('select-custom-mode');
    
    // Custom Setup Inputs
    const customPlaylistSelect = document.getElementById('custom-playlist-select');
    const customHeroSelect = document.getElementById('custom-hero-select');
    const customVillainSelect = document.getElementById('custom-villain-select');
    const previewHeroImg = document.getElementById('preview-hero-img');
    const previewVillainImg = document.getElementById('preview-villain-img');
    const backToModeBtn = document.getElementById('back-to-mode-btn');
    const startCustomBattleBtn = document.getElementById('start-custom-battle-btn');

    // --- State Variables ---
    let currentPage = 1;
    let currentSeries = 'All';
    let searchTimeout;
    let isLoading = false;
    let userPlaylists = []; 

    // --- 2. BATTLE MODE LOGIC (Fixed) ---

    // Open Battle Modal
    if(battleBtn) {
        battleBtn.addEventListener('click', async () => {
            if(window.SFX) window.SFX.playBeep();
            const token = localStorage.getItem('token');
            if (!token) return window.showGlobalToast("Log in to access Battle Mode!");

            battleModal.classList.add('active');
            
            // Reset to Step 1
            if(battleModeSelect) battleModeSelect.style.display = 'block';
            if(battleCustomSetup) battleCustomSetup.style.display = 'none';
            document.getElementById('battle-arena').style.display = 'none';
            document.getElementById('battle-loader').style.display = 'none';
            if(resetBattleBtn) resetBattleBtn.style.display = 'none';
            
            await fetchUserPlaylists(); 
        });
    }

    // Close Battle Modal (The "X" Button)
    if(closeBattle) {
        closeBattle.addEventListener('click', () => {
            battleModal.classList.remove('active');
        });
    }

    // Mode Selection: Random
    if(selectRandomBtn) {
        selectRandomBtn.addEventListener('click', () => {
            if(window.SFX) window.SFX.playBeep();
            if(userPlaylists.length === 0) {
                window.showGlobalToast("Create a playlist first!", true);
                return;
            }
            initiateBattle(userPlaylists[0].items.map(i => i.name), null, null, userPlaylists[0].items);
        });
    }

    // Mode Selection: Custom
    if(selectCustomBtn) {
        selectCustomBtn.addEventListener('click', () => {
            if(window.SFX) window.SFX.playBeep();
            if(userPlaylists.length === 0) {
                window.showGlobalToast("Create a playlist first!", true);
                return;
            }
            battleModeSelect.style.display = 'none';
            battleCustomSetup.style.display = 'block';
            
            // Populate Playlists
            customPlaylistSelect.innerHTML = '';
            userPlaylists.forEach((pl, idx) => {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = pl.name;
                customPlaylistSelect.appendChild(opt);
            });
            updateCustomHeroList();
        });
    }

    // Custom Mode Helpers
    if(customPlaylistSelect) customPlaylistSelect.addEventListener('change', updateCustomHeroList);

    function updateCustomHeroList() {
        const plIndex = customPlaylistSelect.value;
        if(!userPlaylists[plIndex]) return;
        
        const items = userPlaylists[plIndex].items;
        
        customHeroSelect.innerHTML = '';
        items.forEach(alien => {
            const opt = document.createElement('option');
            opt.value = alien.name;
            opt.dataset.img = alien.image;
            // Store data in dataset for easy retrieval
            opt.dataset.species = alien.species || 'Unknown';
            // Join abilities with a delimiter (e.g., |) to store in a string
            opt.dataset.abilities = (alien.abilities || []).join('|'); 
            
            opt.textContent = alien.name;
            customHeroSelect.appendChild(opt);
        });
        
        // Trigger update for the first item
        if(items.length > 0) {
            updateHeroStats(customHeroSelect.options[0]);
        }
    }

    // NEW Helper function to update text
    function updateHeroStats(selectedOption) {
        if(!selectedOption) return;
        
        document.getElementById('preview-hero-img').src = selectedOption.dataset.img;
        document.getElementById('hero-species-text').textContent = selectedOption.dataset.species;
        
        const powersList = document.getElementById('hero-powers-list');
        powersList.innerHTML = '';
        
        const abilities = selectedOption.dataset.abilities ? selectedOption.dataset.abilities.split('|') : ['Standard Combat'];
        abilities.slice(0, 3).forEach(ab => { // Limit to 3 to fit UI
            const li = document.createElement('li');
            li.textContent = ab;
            powersList.appendChild(li);
        });
    }

    // Update the Event Listener for Hero Select
    if(customHeroSelect) {
        customHeroSelect.addEventListener('change', () => {
            const selectedOpt = customHeroSelect.options[customHeroSelect.selectedIndex];
            updateHeroStats(selectedOpt);
        });
    }

    // Optional: Add descriptions for Villains
    const villainDescriptions = {
        "Vilgax": "Intergalactic conqueror. Strength, durability, laser eyes.",
        "Malware": "Galvanic Mechamorph. Absorbs technology.",
        "Kevin 11": "Absorbs matter/energy. Chaotic fighting style.",
        "Highbreed": "Xenophobic alien race. Flight, needle blasts.",
        "Zs'Skayr": "Ectonurite ghost. Possession, intangibility.",
        "Dr. Animo": "Mad scientist. Controls mutant animals."
    };

    if(customVillainSelect) {
        customVillainSelect.addEventListener('change', () => {
            const val = customVillainSelect.value;
            const filename = val.toLowerCase().replace(/[\s'.]/g, '_').replace('__', '_'); 
            const img = document.getElementById('preview-villain-img');
            img.src = `images/${filename}.png`;
            img.onerror = () => img.src = 'images/vilgax.png';
            
            // Update Description
            const desc = villainDescriptions[val] || "A dangerous foe.";
            document.getElementById('villain-desc-text').textContent = desc;
        });
    }

    if(backToModeBtn) {
        backToModeBtn.addEventListener('click', () => {
            battleCustomSetup.style.display = 'none';
            battleModeSelect.style.display = 'block';
        });
    }

    if(startCustomBattleBtn) {
        startCustomBattleBtn.addEventListener('click', () => {
            const heroName = customHeroSelect.value;
            const villainName = customVillainSelect.value;
            const plIndex = customPlaylistSelect.value;
            const playlistItems = userPlaylists[plIndex].items;
            initiateBattle(null, heroName, villainName, playlistItems);
        });
    }

    // Unified Battle Initiator
    async function initiateBattle(team, customHero, customVillain, playlistItems) {
        if(window.SFX) window.SFX.playLock();
        
        battleModeSelect.style.display = 'none';
        battleCustomSetup.style.display = 'none';
        const loader = document.getElementById('battle-loader');
        loader.style.display = 'block';

        try {
            const payload = customHero ? { customHero, customVillain } : { team };
            
            const res = await fetch('/api/ai/battle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.outcome === "ERROR") throw new Error("AI Failed");

            setupArena(data, playlistItems);
            
            loader.style.display = 'none';
            document.getElementById('battle-arena').style.display = 'block';
            runBattleSequence(data.rounds, data.outcome, data.finalComment);

        } catch (err) {
            console.error(err);
            loader.style.display = 'none';
            battleModeSelect.style.display = 'block'; 
            window.showGlobalToast("Simulation Failed. Try again.", true);
        }
    }

    // Arena Logic
    function setupArena(data, playlistItems) {
        document.getElementById('hero-health').style.width = '100%';
        document.getElementById('villain-health').style.width = '100%';
        
        document.getElementById('battle-hero-name').textContent = data.heroName;
        document.getElementById('battle-villain-name').textContent = data.villainName;
        document.getElementById('battle-message').textContent = "BATTLE INITIALIZED.";

        const heroImg = document.getElementById('battle-hero-img');
        const villainImg = document.getElementById('battle-villain-img');

        const heroItem = playlistItems.find(i => i.name === data.heroName);
        heroImg.src = heroItem ? heroItem.image : 'images/omnitrix.png';

        // Villain Name Normalization
        let vName = data.villainName.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
        if(vName.includes('dr_animo')) vName = 'dr_animo';
        if(vName.includes('kevin')) vName = 'kevin_levin';
        if(vName.includes('forever_king')) vName = 'forever_king';
        
        villainImg.src = `images/${vName}.png`;
        villainImg.onerror = () => villainImg.src = 'images/vilgax.png';
    }

    async function runBattleSequence(rounds, outcome, finalComment) {
        let heroHP = 100;
        let villainHP = 100;
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const battleMessage = document.getElementById('battle-message');
        const heroCard = document.querySelector('.fighter-card.hero');
        const villainCard = document.querySelector('.fighter-card.villain');
        const heroHealth = document.getElementById('hero-health');
        const villainHealth = document.getElementById('villain-health');

        for (const round of rounds) {
            await wait(1500);
            
            battleMessage.textContent = round.message;
            if (typeof speak === 'function') speak(round.message);

            if (round.damageToHero > 0) {
                if(window.SFX) window.SFX.playImpact();
                heroHP = Math.max(0, heroHP - round.damageToHero);
                heroHealth.style.width = `${heroHP}%`;
                showDamage(heroCard, round.damageToHero);
                heroCard.classList.add('shake');
                setTimeout(() => heroCard.classList.remove('shake'), 500);
            }

            if (round.damageToVillain > 0) {
                if(window.SFX) window.SFX.playImpact();
                villainHP = Math.max(0, villainHP - round.damageToVillain);
                villainHealth.style.width = `${villainHP}%`;
                showDamage(villainCard, round.damageToVillain);
                villainCard.classList.add('shake');
                setTimeout(() => villainCard.classList.remove('shake'), 500);
            }
        }

        await wait(1500);

        if (outcome === "VICTORY") {
            villainHealth.style.width = '0%'; 
            if(window.SFX) window.SFX.playPowerUp();
            battleMessage.textContent = `VICTORY! ${finalComment}`;
            heroCard.classList.add('winner-glow');
        } else {
            heroHealth.style.width = '0%'; 
            if(window.SFX) window.SFX.playBeep(200, 'sawtooth', 0.5);
            battleMessage.textContent = `DEFEAT. ${finalComment}`;
            villainCard.classList.add('winner-glow');
        }

        if(resetBattleBtn) resetBattleBtn.style.display = 'inline-block';
    }

    // Reset Button Logic (Fixed Reference)
    // Reset Button Logic
    if(resetBattleBtn) {
        resetBattleBtn.addEventListener('click', () => {
            if(window.SFX) window.SFX.playBeep();
            
            // Hide Arena
            document.getElementById('battle-arena').style.display = 'none';
            
            // Show Mode Selection (Restart)
            if(battleModeSelect) battleModeSelect.style.display = 'block'; 
        });
    }

    function showDamage(card, amount) {
        const popup = card.querySelector('.damage-popup');
        if(popup) {
            popup.textContent = `-${amount}`;
            popup.classList.remove('pop');
            void popup.offsetWidth; 
            popup.classList.add('pop');
        }
    }

    // --- 3. CORE FUNCTIONALITY (Aliens, Playlist, Search) ---

    // Fetch Playlists Helper
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

    // Add to Playlist Logic
    let pendingAlienToAdd = null; 
    const openPlaylistSelectionModal = async (alienId, alienName) => {
        const token = localStorage.getItem('token');
        if (!token) return window.showGlobalToast('Please log in to use the Omnitrix.', true);

        pendingAlienToAdd = { id: alienId, name: alienName };
        if(playlistSelectModal) {
            playlistSelectModal.classList.add('active');
            if(playlistLoader) playlistLoader.style.display = 'block';
            if(playlistListContainer) playlistListContainer.innerHTML = '';

            const playlists = await fetchUserPlaylists();
            if(playlistLoader) playlistLoader.style.display = 'none';

            if (playlists.length === 0) {
                if(playlistListContainer) playlistListContainer.innerHTML = '<p>No playlists found. Create one in your Profile.</p>';
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
        }
    };

    const confirmAddToPlaylist = async (playlistId, playlistName) => {
        if(window.SFX) window.SFX.playLock(); 
        const token = localStorage.getItem('token');
        if (!pendingAlienToAdd) return;

        try {
            const res = await fetch(`/api/playlists/aliens/${playlistId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ itemId: pendingAlienToAdd.id, action: 'add' })
            });

            if (res.ok) {
                window.showGlobalToast(`${pendingAlienToAdd.name} added to ${playlistName}!`);
                if(playlistSelectModal) playlistSelectModal.classList.remove('active');
            } else {
                const err = await res.json();
                window.showGlobalToast(err.msg || 'Failed to add alien', true);
            }
        } catch (error) {
            window.showGlobalToast('Network error', true);
        }
    };

    if(closePlaylistSelect) {
        closePlaylistSelect.addEventListener('click', () => {
            if(playlistSelectModal) playlistSelectModal.classList.remove('active');
        });
    }

    // Fetch Aliens
    const fetchAliens = async (page, series, shouldAppend = false) => {
        if (!alienContainer) return;
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

            if (sentinel) {
                if (data.hasNextPage) {
                    observer.observe(sentinel);
                } else {
                    observer.unobserve(sentinel);
                    if (sentinelLoader) sentinelLoader.style.display = 'none';
                }
            }
        } catch (error) {
            console.error("Could not fetch aliens:", error);
        } finally {
            isLoading = false;
            if (shouldAppend && sentinelLoader) sentinelLoader.style.display = 'none';
        }
    };

    // Autocomplete
    const showSuggestions = (aliens) => {
        if(!suggestionsBox) return;
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
                if(searchBar) searchBar.value = '';
            });
            suggestionsBox.appendChild(div);
        });
        suggestionsBox.style.display = 'block';
    };

    if(searchBar) {
        searchBar.addEventListener('input', (e) => {
            const term = e.target.value.trim();
            clearTimeout(searchTimeout);
            if (term.length < 2) {
                if(suggestionsBox) suggestionsBox.style.display = 'none';
                if (term.length === 0 && filterNav) {
                    filterNav.style.display = 'flex';
                    fetchAliens(1, currentSeries, false);
                }
                return;
            }
            searchTimeout = setTimeout(async () => { 
                if(filterNav) filterNav.style.display = 'none';
                try {
                    const res = await fetch(`/api/aliens/search/${encodeURIComponent(term)}`);
                    const data = await res.json();
                    showSuggestions(data.results || []);
                } catch(e) { console.error(e); }
            }, 300);
        });
    }

    document.addEventListener('click', (e) => {
        if (suggestionsBox && !e.target.closest('.search-container')) suggestionsBox.style.display = 'none';
    });

    function displayAliens(aliensToDisplay) {
        if (!alienContainer) return;
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

    // Filter & Scroll
    if(filterNav) {
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
    }

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
            currentPage++;
            fetchAliens(currentPage, currentSeries, true);
        }
    }, { rootMargin: '100px' });

    // Alien Detail Modal
    function showAlienDetails(alien) {
        if(!modal) return;
        if(window.SFX) window.SFX.playPowerUp(); 

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
        if(nameElement) nameElement.style.color = ''; 
        
        const updateDisplay = () => {
            modal.classList.toggle('is-ultimate', isUltimate);
            if(nameElement) nameElement.innerText = isUltimate ? (alien.ultimateForm || alien.name) : alien.name;
            
            const currentAbilities = isUltimate ? (alien.ultimateAbilities || []) : (alien.abilities || []);
            const abilitiesEl = document.getElementById('modal-alien-abilities');
            if(abilitiesEl) abilitiesEl.innerHTML = currentAbilities.length ? currentAbilities.map(p => `<li>${p}</li>`).join('') : '<li>None listed.</li>';
            
            const currentImage = isUltimate ? (alien.ultimateImage || alien.image) : alien.image;
            if (currentImage && animAlienImg) animAlienImg.src = currentImage;
            modal.classList.add('animating');
            if(animOmnitrix) animOmnitrix.classList.add('active');
            if(animGlow) {
                animGlow.classList.remove('flash');
                void animGlow.offsetWidth;
                animGlow.classList.add('flash');
            }
            if(animAlienImg) {
                animAlienImg.classList.remove('hologram');
                void animAlienImg.offsetWidth;
                animAlienImg.classList.add('hologram');
            }

            const ultControl = document.getElementById('ultimate-control');
            if(ultControl) {
                ultControl.innerHTML = '';
                if (alien.ultimateForm) {
                    const btn = document.createElement('button');
                    btn.className = 'ultimate-btn';
                    btn.innerText = isUltimate ? 'Revert to Normal' : 'Go Ultimate!';
                    btn.onclick = () => { 
                        if(window.SFX) window.SFX.playPowerUp(); 
                        isUltimate = !isUltimate; 
                        updateDisplay(); 
                    };
                    ultControl.appendChild(btn);
                }
            }
        };

        const speciesEl = document.getElementById('modal-alien-species');
        if(speciesEl) speciesEl.innerText = alien.species || 'Unknown';
        
        const planetEl = document.getElementById('modal-alien-planet');
        if(planetEl) planetEl.innerText = alien.homePlanet || 'Unknown';
        
        const weakEl = document.getElementById('modal-alien-weaknesses');
        if(weakEl) weakEl.innerHTML = (alien.weaknesses || []).map(w => `<li>${w}</li>`).join('');
        
        const aiContent = modal.querySelector('.ai-details-content');
        if(aiContent) aiContent.innerHTML = '';
        
        const knowMoreBtn = modal.querySelector('.know-more-btn');
        if(knowMoreBtn) {
            knowMoreBtn.style.display = 'block';
            knowMoreBtn.onclick = async () => {
                if(window.SFX) window.SFX.playBeep();
                aiContent.innerHTML = '<div class="loading-spinner"></div>';
                knowMoreBtn.style.display = 'none';
                try {
                    const res = await fetch(`/api/ai/details/alien/${encodeURIComponent(alien.name)}`);
                    aiContent.innerHTML = await res.text();
                } catch (e) { aiContent.innerHTML = 'Error fetching details.'; }
            };
        }

        updateDisplay();
        modal.classList.add('active');
    }

    if(closeButton) {
        closeButton.addEventListener('click', () => modal.classList.remove('active'));
    }

    // --- NEW FEATURE: OMNITRIX ROULETTE (INDEX ONLY) ---
    const rouletteBtn = document.getElementById('roulette-btn');

    if (rouletteBtn) {
        rouletteBtn.addEventListener('click', async () => {
            if(window.SFX) window.SFX.init(); 
            
            rouletteBtn.style.transform = 'rotate(360deg)';
            rouletteBtn.style.transition = 'transform 0.5s ease';
            
            window.showGlobalToast("⚠️ OMNITRIX MALFUNCTION DETECTED! Rerouting DNA...", true); 
            
            // Audio Ticking
            let ticks = 0;
            const tickInterval = setInterval(() => {
                if(window.SFX) window.SFX.playTick();
                ticks++;
                if(ticks > 8) clearInterval(tickInterval);
            }, 100);

            try {
                const res = await fetch('/api/aliens/random');
                if (!res.ok) throw new Error('Glitch in the system');
                const alien = await res.json();

                setTimeout(() => {
                    clearInterval(tickInterval);
                    if(window.SFX) window.SFX.playLock(); 
                    
                    rouletteBtn.style.transform = 'none';
                    showAlienDetails(alien);
                    
                    // Locked On Effect
                    const modalTitle = document.getElementById('modal-alien-name');
                    if(modalTitle) {
                        const originalColor = modalTitle.style.color;
                        modalTitle.style.color = '#ff3333'; // Red
                        setTimeout(() => modalTitle.style.color = originalColor, 1000);
                    }
                    
                }, 800);

            } catch (err) {
                console.error(err);
                window.showGlobalToast("Omnitrix is recharging. Try again later.", true);
                rouletteBtn.style.transform = 'none';
            }
        });
    }

    // Voice Setup
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

    if (ttsButton) {
        ttsButton.addEventListener('click', () => {
            isTtsEnabled = !isTtsEnabled;
            ttsButton.classList.toggle('active', isTtsEnabled);
            if (!isTtsEnabled) speechSynthesis.cancel();
            else speak("Voice systems calibrated.");
        });
    }

    // Chat Widget Logic
    const chatToggleButton = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendButton = document.getElementById('chat-send-btn');

    if (chatToggleButton) {
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
                const data = await response.json();
                thinkingMessage.textContent = data.answer;
                thinkingMessage.classList.remove('thinking');
                speak(data.answer);
            } catch (error) {
                thinkingMessage.textContent = "Error connecting to AI.";
                thinkingMessage.classList.remove('thinking');
            }
        };

        chatSendButton.addEventListener('click', () => { sendChatMessage(); });
        chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });
    }


    // Add this to public/script.js inside DOMContentLoaded
const urlParams = new URLSearchParams(window.location.search);
const searchParam = urlParams.get('search');

if (searchParam) {
    if(searchBar) searchBar.value = searchParam;
    
    setTimeout(async () => {
        // Hide filters if they exist
        const filterNav = document.querySelector('.filter-nav');
        if(filterNav) filterNav.style.display = 'none';
        
        try {
            // Trigger the search API
            const res = await fetch(`/api/aliens/search/${encodeURIComponent(searchParam)}`);
            const data = await res.json();
            
            // If we find the alien, open it automatically
            if (data.results && data.results.length > 0) {
                showAlienDetails(data.results[0]);
                // Clear the URL so refreshing doesn't re-search
                window.history.replaceState({}, document.title, "index.html"); 
            } else {
                 if(window.showGlobalToast) window.showGlobalToast(`No data found for species: ${searchParam}`, true);
            }
        } catch(e) { console.error(e); }
    }, 500);
}

    // Initial Load
    if(alienContainer) fetchAliens(currentPage, currentSeries);
});