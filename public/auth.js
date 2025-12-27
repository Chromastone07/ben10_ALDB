document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL THEME LOGIC ---
    // (Kept because this handles the Visual CSS classes)
    window.setTheme = (themeName) => {
        document.body.classList.remove('theme-red', 'theme-blue', 'theme-purple');
        if (themeName !== 'default') document.body.classList.add(themeName);
        localStorage.setItem('omnitrix-theme', themeName);
    };
    const savedTheme = localStorage.getItem('omnitrix-theme');
    if (savedTheme) window.setTheme(savedTheme);

    // --- AUTH & NAV LOGIC ---
    // (Kept to handle Login/Logout state in the navbar)
    const navContainer = document.getElementById('main-nav');
    const token = localStorage.getItem('token');

    const updateNav = () => {
        if (!navContainer) return;
        if (token) {
            navContainer.innerHTML = `
                <a href="index.html" class="nav-link" style="color: #fff; border-bottom: 1px solid #fff;">❮ Universes</a>
                <a href="aliens.html" class="nav-link">Aliens</a>
                <a href="characters.html" class="nav-link">Universe</a>
                <a href="planets.html" class="nav-link">Planets</a>
                <a href="episodes.html" class="nav-link">Episodes</a> 
                <a href="new-favorites.html" class="nav-link">My Omnitrix</a>
                <a href="profile.html" class="nav-link">Profile</a> 
                <a href="#" id="logout-btn" class="nav-link">Logout</a>
            `;
            document.getElementById('logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            });
        } else {
            navContainer.innerHTML = `
                <a href="index.html" class="nav-link" style="color: #fff; border-bottom: 1px solid #fff;">❮ Universes</a>
                <a href="aliens.html" class="nav-link">Aliens</a>
                <a href="characters.html" class="nav-link">Universe</a>
                <a href="planets.html" class="nav-link">Planets</a>
                <a href="episodes.html" class="nav-link">Episodes</a>
                <a href="login.html" class="nav-link">Login</a>
                <a href="register.html" class="nav-link">Register</a>
            `;
        }
    };
    updateNav();
});

// --- GLOBAL TOAST SYSTEM ---
// (Kept for UI notifications)
function showGlobalToast(msg, isError) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = `toast ${isError ? 'error' : ''} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}
// Expose Toast globally
window.showGlobalToast = showGlobalToast;

// --- TOGGLE PASSWORD VISIBILITY ---
// (Kept for Login/Signup/Profile forms)
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        icon.textContent = "🔒"; // Change icon to 'Hide'
    } else {
        input.type = "password";
        icon.textContent = "👁️"; // Change icon to 'Show'
    }
}