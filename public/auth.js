document.addEventListener('DOMContentLoaded', () => {
    

    window.setTheme = (themeName) => {
        document.body.classList.remove('theme-red', 'theme-blue', 'theme-purple');
        
        if (themeName !== 'default') {
            document.body.classList.add(themeName);
        }
        
        localStorage.setItem('omnitrix-theme', themeName);
        
        playThemeTransition(themeName);
    };

    window.cycleTheme = () => {
        const themes = ['default', 'theme-red', 'theme-blue', 'theme-purple'];
        
        let current = localStorage.getItem('omnitrix-theme') || 'default';
        let currentIndex = themes.indexOf(current);
        if (currentIndex === -1) currentIndex = 0;
        
        let nextIndex = (currentIndex + 1) % themes.length;
        
        window.setTheme(themes[nextIndex]);
    };

    function playThemeTransition(theme) {
        const assets = {
            'theme-red': { 
                img: 'images/albedo_pose.png', 
                audio: 'sounds/omnitrix-ativado.mp3', 
                color: '#ff0000' 
            },
            'theme-blue': { 
                img: 'images/ben23_pose.png', 
                audio: 'sounds/omnitrix-ativado.mp3', 
                color: '#00ccff' 
            },
            'theme-purple': { 
                img: 'images/gwen_pose.png', 
                audio: 'sounds/omnitrix-ativado.mp3', 
                color: '#d000ff' 
            },
            'default': { 
                img: 'images/ben10_pose.png', 
                audio: 'sounds/omnitrix-ativado.mp3', 
                color: '#00ff00' 
            }
        };

        const config = assets[theme] || assets['default'];

        let overlay = document.getElementById('theme-transition-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'theme-transition-overlay';
            document.body.appendChild(overlay);
            
            const img = document.createElement('img');
            img.id = 'theme-char-img';
            overlay.appendChild(img);
        }

        const charImg = document.getElementById('theme-char-img');

        charImg.src = config.img;
        charImg.style.color = config.color; 
        
        overlay.style.opacity = '1';
        charImg.classList.remove('animate-theme-change');
        void charImg.offsetWidth; 
        charImg.classList.add('animate-theme-change');

        if (window.audioSystem) {
            window.audioSystem.playFile(config.audio, true);
        } else {
            const audio = new Audio(config.audio);
            audio.volume = 0.5;
            audio.play().catch(err => console.log("Audio waiting for interaction:", err));
        }

        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 3000);
    }
    
    const savedTheme = localStorage.getItem('omnitrix-theme');
    if (savedTheme) {
        document.body.classList.remove('theme-red', 'theme-blue', 'theme-purple');
        if (savedTheme !== 'default') document.body.classList.add(savedTheme);
    }



    const navContainer = document.getElementById('main-nav');
    
    const logoBtn = document.querySelector('.nav-logo');
    if (logoBtn) {
        logoBtn.style.cursor = 'pointer';
        logoBtn.title = "Tap to Change Interface Mode";
        
        logoBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.cycleTheme(); 
        });
    }

    const token = localStorage.getItem('token');
    
    if (navContainer) {
        if (token) {
            navContainer.innerHTML = `
                <a href="index.html" class="nav-link">❮ Gateway</a>
                <a href="aliens.html" class="nav-link">Aliens</a>
                <a href="characters.html" class="nav-link">Universe</a>
                <a href="planets.html" class="nav-link">Planets</a>
                <a href="episodes.html" class="nav-link">Episodes</a> 
                <a href="new-favorites.html" class="nav-link">My Omnitrix</a>
                <a href="profile.html" class="nav-link">Profile</a> 
                <a href="#" id="logout-btn" class="nav-link logout-link">Logout</a>
            `;

            document.getElementById('logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                
                if(window.showGlobalToast) window.showGlobalToast("Logging out...", false);
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            });

        } else {
            navContainer.innerHTML = `
                <a href="index.html" class="nav-link">❮ Gateway</a>
                <a href="login.html" class="nav-link">Login</a>
                <a href="register.html" class="nav-link">Register</a>
            `;
        }
    }
});



window.showGlobalToast = function(msg, isError) {
    let toast = document.getElementById('toast-notification');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = msg;
    toast.className = `toast ${isError ? 'error' : ''} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
};

window.togglePassword = function(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input) {
        if (input.type === "password") {
            input.type = "text";
            icon.textContent = "🔒"; 
        } else {
            input.type = "password";
            icon.textContent = "👁️"; 
        }
    }
};