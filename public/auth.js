// --- GLOBAL AUDIO SYSTEM (AzmuthSynth) ---
// Attached to 'window' so it can be used by all pages
window.SFX = {
    ctx: null,
    init: function() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },
    // Generic Beep
    playBeep: function(freq = 1200, type = 'sine', duration = 0.1) {
        if (!this.ctx) this.init(); // Auto-init if missing
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },
    // Power Up (Modal Open / Victory)
    playPowerUp: function() {
        if (!this.ctx) this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    },
    playTick: function() { this.playBeep(800, 'square', 0.05); },
    playLock: function() {
        this.playBeep(2000, 'sine', 0.3);
        setTimeout(() => this.playBeep(1000, 'sine', 0.4), 100);
    },
    // Battle Impact Noise
    playImpact: function() {
        if (!this.ctx) this.init();
        const bufferSize = this.ctx.sampleRate * 0.5; 
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500;
        
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Audio Context on first interaction
    document.body.addEventListener('click', () => window.SFX.init(), { once: true });

    // --- GLOBAL THEME LOGIC ---
    window.setTheme = (themeName) => {
        document.body.classList.remove('theme-red', 'theme-blue', 'theme-purple');
        if (themeName !== 'default') document.body.classList.add(themeName);
        localStorage.setItem('omnitrix-theme', themeName);
    };
    const savedTheme = localStorage.getItem('omnitrix-theme');
    if (savedTheme) window.setTheme(savedTheme);

    // --- AUTH & NAV LOGIC ---
    const navContainer = document.getElementById('main-nav');
    const token = localStorage.getItem('token');

    const updateNav = () => {
        if (!navContainer) return;
        if (token) {
            navContainer.innerHTML = `
                <a href="index.html" class="nav-link">Aliens</a>
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
                <a href="index.html" class="nav-link">Aliens</a>
                <a href="characters.html" class="nav-link">Universe</a>
                <a href="planets.html" class="nav-link">Planets</a>
                <a href="episodes.html" class="nav-link">Episodes</a>
                <a href="login.html" class="nav-link">Login</a>
                <a href="register.html" class="nav-link">Register</a>
            `;
        }
    };
    updateNav();

    // Attach global click sounds
    attachGlobalAudioListeners();
});

// --- AUTOMATIC AUDIO INJECTION ---
function attachGlobalAudioListeners() {
    // 1. Global Click Sounds
    document.addEventListener('click', (e) => {
        if (e.target.closest('button, a, .filter-btn, .nav-link, .close-button, .alien-card, .character-card, .planet-card')) {
            if (window.SFX) window.SFX.playBeep();
        }
    });

    // 2. Global Hover Sounds
    document.addEventListener('mouseover', (e) => {
        const card = e.target.closest('.alien-card, .character-card, .planet-card, .episode-card, .profile-card, .nav-link');
        if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
            if (window.SFX) window.SFX.playBeep(800, 'sine', 0.05);
        }
    });
}

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