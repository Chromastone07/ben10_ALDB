
document.addEventListener('DOMContentLoaded', () => {
    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    const playlistsContainer = document.getElementById('playlists-container');
    const activePlaylistNameElement = document.getElementById('active-playlist-name');
    const alienIconGrid = document.getElementById('alien-icon-grid');

    let activePlaylistId = null;


    const renderPlaylists = (playlists) => {
        playlistsContainer.innerHTML = ''; 

        if (!playlists || playlists.length === 0) {
            const noPlaylistsMsg = document.createElement('p');
            noPlaylistsMsg.textContent = 'No playlists found.';
            noPlaylistsMsg.className = 'no-playlists-msg';
            playlistsContainer.appendChild(noPlaylistsMsg);
            activePlaylistNameElement.textContent = 'Active Playlist: None';
            return;
        }

        const playlistList = document.createElement('ul');
        playlistList.className = 'playlist-list';

        playlists.forEach(playlist => {
            const listItem = document.createElement('li');
            listItem.className = 'playlist-item';
            listItem.textContent = playlist.name;
            listItem.dataset.playlistId = playlist._id;

            if (playlist._id === activePlaylistId) {
                listItem.classList.add('active');
                activePlaylistNameElement.textContent = `Active Playlist: ${playlist.name}`;
            }

            listItem.addEventListener('click', () => handleSetActivePlaylist(playlist._id, playlists));

            playlistList.appendChild(listItem);
        });

        playlistsContainer.appendChild(playlistList);
    };

    const handleCreatePlaylist = async () => {
        const playlistName = prompt('Enter a name for your new playlist:');
        if (!playlistName || playlistName.trim() === '') {
            return; 
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to create a playlist.');
            return;
        }

        try {
            const response = await fetch('/api/playlists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ name: playlistName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to create playlist');
            }
            
            
            const updatedState = await fetchPlaylists(); 
            renderPlaylists(updatedState.playlists);
            const favoritedAliens = await fetchFavoritedAliens();
            renderAliensCircular(favoritedAliens);

        } catch (err) {
            console.error('Error creating playlist:', err);
            alert(`Error: ${err.message}`);
        }
    };
    
    const handleSetActivePlaylist = async (playlistId, playlists) => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`/api/playlists/set-active/${playlistId}`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });

            activePlaylistId = playlistId;
            renderPlaylists(playlists); 
            const favoritedAliens = await fetchFavoritedAliens();
            renderAliensCircular(favoritedAliens);

        } catch (err) {
            console.error('Error setting active playlist:', err);
        }
    };



    const fetchPlaylists = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            renderPlaylists([]);
            return { playlists: [], activePlaylistId: null };
        }

        try {
            const response = await fetch('/api/playlists', {
                headers: { 'x-auth-token': token }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch playlists: ${response.status}`);
            }

            const data = await response.json();
            activePlaylistId = data.activePlaylistId; 
            return data;

        } catch (err) {
            console.error(err);
            playlistsContainer.innerHTML = '<p>Error loading playlists.</p>';
            return { playlists: [], activePlaylistId: null };
        }
    };

    const fetchFavoritedAliens = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn("User not logged in. Cannot fetch favorites.");
            alienIconGrid.innerHTML = "<p style='color: var(--text-secondary); text-align: center;'>Please log in to view your Omnitrix favorites.</p>";
            activePlaylistNameElement.textContent = 'Active Playlist: N/A';
            return { aliens: [] };
        }

        alienIconGrid.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;

        try {
            const response = await fetch('/api/playlists/active-playlist-aliens', {
                headers: { 'x-auth-token': token }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch favorited aliens: ${response.status}`);
            }
            return await response.json(); 

        } catch (err) {
            console.error(err);
            alienIconGrid.innerHTML = '<p>Error fetching aliens.</p>';
            return { aliens: [] };
        }
    };



    const renderAliensCircular = (data) => {
        alienIconGrid.innerHTML = '';
        const aliens = data.aliens; 

        if (!aliens || !Array.isArray(aliens)) {
            console.error("Invalid data passed to renderAliensCircular. Expected an object with an 'aliens' array.", data);
            alienIconGrid.innerHTML = "<p style='color: var(--text-secondary); text-align: center;'>Error displaying aliens.</p>";
            return;
        }

        const numAliens = aliens.length;

        if (numAliens === 0) {
            alienIconGrid.innerHTML = "<p style='color: var(--text-secondary); text-align: center;'>Your active playlist is empty.</p>";
            return;
        }

        const gridRect = alienIconGrid.getBoundingClientRect();
        const centerX = gridRect.width / 2;
        const centerY = gridRect.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;

        aliens.forEach((alien, index) => {
            const angle = (2 * Math.PI / numAliens) * index;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const iconContainer = document.createElement('div');
            iconContainer.className = 'alien-icon-container';
            iconContainer.style.position = 'absolute';
            iconContainer.style.left = `${x}px`;
            iconContainer.style.top = `${y}px`;
            iconContainer.style.transform = 'translate(-50%, -50%)';

            const iconLink = document.createElement('a');
            iconLink.href = `alien-details.html?id=${alien._id}`;

            const iconImage = document.createElement('img');
            iconImage.src = alien.iconUrl;
            iconImage.alt = alien.name;
            iconImage.className = 'alien-icon';

            iconLink.appendChild(iconImage);
            iconContainer.appendChild(iconLink);
            alienIconGrid.appendChild(iconContainer);
        });
    };


    console.log("DOMContentLoaded fired. Initiating initial load for new favorites page.");
    fetchPlaylists().then(initialState => {
        renderPlaylists(initialState.playlists);
        fetchFavoritedAliens().then(renderAliensCircular);
    }).catch(err => {
        console.error("Error in initial fetch or render on new favorites page:", err);
         alienIconGrid.innerHTML = "<p style='color: var(--text-secondary); text-align: center;'>Error loading favorites.</p>";
    });
    
    
    if(createPlaylistBtn) {
        createPlaylistBtn.addEventListener('click', handleCreatePlaylist);
    }
});
