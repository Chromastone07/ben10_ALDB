

document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('main-nav');
    const token = localStorage.getItem('token');

   
    window.userFavorites = {
        aliens: new Set(),
        characters: new Set(),
        planets: new Set()
    };

  
    const fetchFavorites = async () => {
        if (!token) return;
        try {
            const res = await fetch('/api/favorites/ids', { headers: { 'x-auth-token': token } });
            if (res.ok) {
                const data = await res.json();
                window.userFavorites.aliens = new Set(data.aliens || []);
                window.userFavorites.characters = new Set(data.characters || []);
                window.userFavorites.planets = new Set(data.planets || []);
            } else {
                 console.error("Failed to fetch favorite IDs:", res.status, res.statusText);
            }
        } catch (err) { console.error('Could not fetch favorite IDs:', err); }
    };

    const updateNav = () => {
        if (!navContainer) {
            console.error("Navigation container with ID 'main-nav' not found.");
            return; 
        }

        

        if (token) {
            navContainer.innerHTML = `
                <a href="index.html" class="nav-link">Aliens</a>
                <a href="characters.html" class="nav-link">Universe</a>
                <a href="planets.html" class="nav-link">Planets</a>
                <a href="new-favorites.html" class="nav-link">My Omnitrix</a>
                <a href="profile.html" class="nav-link">Profile</a> <a href="#" id="logout-btn" class="nav-link">Logout</a>
            `;



            
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                 logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('token');
                    
                    window.location.href = 'login.html';
                });
            }

        } else {
            navContainer.innerHTML = `
                <a href="index.html" class="nav-link">Aliens</a>
                <a href="characters.html" class="nav-link">Universe</a>
                <a href="planets.html" class="nav-link">Planets</a>
                <a href="login.html" class="nav-link">Login</a>
                <a href="register.html" class="nav-link">Register</a>
            `;
        }
    };

     console.log("auth.js: DOMContentLoaded fired.");

    
    fetchFavorites().then(() => {
        updateNav(); 
     });

  
     updateNav();


});
