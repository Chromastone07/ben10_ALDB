document.addEventListener('DOMContentLoaded', async () => {
    
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    
    const usernameEl = document.getElementById('profile-username');
    const emailEl = document.getElementById('profile-email');
    const rankEl = document.getElementById('profile-rank'); 
    const rankBadgeEl = document.getElementById('profile-rank-badge'); 
    const joinedEl = document.getElementById('profile-joined');
    const avatarImg = document.getElementById('profile-avatar');
    const badgeImg = document.getElementById('profile-badge'); 
    
    const currentRankName = document.getElementById('current-rank-name');
    const nextRankName = document.getElementById('next-rank-name');
    const progressBar = document.getElementById('rank-progress-bar');
    const xpText = document.getElementById('xp-text');
    
    const badgesGrid = document.getElementById('badges-grid');

    const toastContainer = document.getElementById('toast-container');

    const showToast = (message, type = 'success') => {
        if (window.showGlobalToast) {
            window.showGlobalToast(message, type === 'error');
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        toast.innerHTML = type === 'success' 
            ? `<span>✅</span> <span>${message}</span>` 
            : `<span>⚠️</span> <span>${message}</span>`;
        
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    try {
        const res = await fetch('/api/profile/me', {
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token }
        });

        if (res.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }

        const data = await res.json();

        if (res.ok) {
            if (usernameEl) usernameEl.textContent = data.username;
            if (emailEl) emailEl.textContent = data.email;
            if (joinedEl && data.createdAt) joinedEl.textContent = new Date(data.createdAt).toLocaleDateString();
            
            const userRank = data.rank || "Recruit";
            if (rankEl) rankEl.textContent = userRank;
            if (rankBadgeEl) rankBadgeEl.textContent = userRank;

            if (avatarImg) avatarImg.src = data.avatar || 'images/omnitrix.png';

            if (currentRankName) currentRankName.textContent = userRank;
            if (nextRankName) nextRankName.textContent = data.nextRank === 'Max Rank' ? 'Max Rank' : `Next: ${data.nextRank}`;
            if (xpText) xpText.textContent = `Time Active: ${data.timeActive || 0} Minutes`;
            
            if (progressBar) {
                setTimeout(() => {
                    progressBar.style.width = `${data.progress || 0}%`;
                }, 100);
            }

          
            if (badgesGrid && data.badges) {
                badgesGrid.innerHTML = ''; 
                data.badges.forEach(badge => {
                    const div = document.createElement('div');
                    div.className = `badge-card ${badge.unlocked ? 'unlocked' : ''}`;
                    div.title = badge.desc;
                    div.innerHTML = `
                        <span class="badge-icon">${badge.icon}</span>
                        <span class="badge-name">${badge.name}</span>
                    `;
                    badgesGrid.appendChild(div);
                });
            } 
            else if (badgeImg) {
                let badgeSrc = 'images/omnitrix.png';
                if (userRank === 'Plumber') badgeSrc = 'images/badges/plumber.png';
                if (userRank === 'Magister') badgeSrc = 'images/badges/magister.png';
                badgeImg.src = badgeSrc;
            }

            const editInput = document.getElementById('edit-username-input');
            if (editInput) editInput.value = data.username;
        }
    } catch (err) { 
        console.error("Profile Load Error:", err); 
        showToast("Failed to load profile data. Server might be offline.", "error");
    }

    window.openModal = (id) => {
        const el = document.getElementById(id);
        if(el) {
            el.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    window.closeModal = (id) => {
        const el = document.getElementById(id);
        if(el) {
            el.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    const avatarModal = document.getElementById('avatar-modal');
    window.openAvatarModal = () => {
        if(avatarModal) {
            avatarModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    window.closeAvatarModal = () => {
        if(avatarModal) {
            avatarModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

   
    document.getElementById('edit-username-btn')?.addEventListener('click', () => window.openModal('edit-profile-modal'));
    document.getElementById('change-password-btn')?.addEventListener('click', () => window.openModal('password-modal'));
    document.getElementById('delete-account-btn')?.addEventListener('click', () => window.openModal('delete-modal'));

    document.querySelectorAll('.close-button').forEach(btn => btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) {
            if(modal.id === 'avatar-modal') window.closeAvatarModal();
            else window.closeModal(modal.id);
        }
    }));

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            if(e.target.id === 'avatar-modal') window.closeAvatarModal();
            else window.closeModal(e.target.id);
        }
    });

   
    document.getElementById('confirm-edit-btn')?.addEventListener('click', async () => {
        const newName = document.getElementById('edit-username-input').value;
        if (!newName.trim()) return showToast("Username cannot be empty", "error");

        try {
            const res = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ username: newName })
            });
            
            if (res.ok) {
                showToast("Username updated!");
                if (usernameEl) usernameEl.textContent = newName;
                window.closeModal('edit-profile-modal');
            } else {
                const d = await res.json();
                showToast(d.msg || "Update failed", "error");
            }
        } catch (e) { showToast("Server Error", "error"); }
    });

    document.getElementById('confirm-password-btn')?.addEventListener('click', async () => {
        const currentPass = document.getElementById('current-pass-input').value;
        const newPass = document.getElementById('new-pass-input').value;

        if (!currentPass || !newPass) return showToast("Fill all fields", "error");
        if (newPass.length < 6) return showToast("New password must be 6+ chars", "error");

        try {
            const res = await fetch('/api/profile/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass })
            });

            if (res.ok) {
                showToast("Password changed! Logging out...", "success");
                setTimeout(() => {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                const d = await res.json();
                showToast(d.msg || "Failed to change password", "error");
            }
        } catch (e) { showToast("Server Error", "error"); }
    });

    document.getElementById('confirm-delete-btn')?.addEventListener('click', async () => {
        try {
            const res = await fetch('/api/profile/me', {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                showToast("Account deleted. Goodbye.", "success");
                setTimeout(() => {
                    localStorage.removeItem('token');
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                showToast("Could not delete account", "error");
            }
        } catch (e) { showToast("Server Error", "error"); }
    });

    document.getElementById('logout-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    window.togglePassword = (id, icon) => {
        const input = document.getElementById(id);
        if (input) {
            input.type = input.type === "password" ? "text" : "password";
            icon.textContent = input.type === "password" ? "👁️" : "🔒";
        }
    };

 
    const audioBtn = document.getElementById('system-audio-btn');
    const audioStatusText = document.getElementById('audio-status-text');

    
    const isMuted = localStorage.getItem('plumber_muted') !== 'false'; 
    
    updateAudioUI(isMuted);

    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
           
            const currentState = localStorage.getItem('plumber_muted') !== 'false';
            const newState = !currentState; 
            
            if(window.audioSystem) {
                window.audioSystem.setMute(newState);
                if (!newState) window.audioSystem.playLock(); 
            } else {
                localStorage.setItem('plumber_muted', newState);
            }
            
            updateAudioUI(newState);
        });
    }

    function updateAudioUI(muted) {
        if (!audioStatusText || !audioBtn) return;
        if (muted) {
            audioStatusText.textContent = "OFF";
            audioStatusText.style.color = "#666";
            audioBtn.style.borderColor = "#666";
        } else {
            audioStatusText.textContent = "ON";
            audioStatusText.style.color = "var(--accent-green)";
            audioBtn.style.borderColor = "var(--accent-cyan)";
        }
    }

    window.selectAvatar = async (imgSrc) => {
        try {
            const res = await fetch('/api/profile/avatar', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                },
                body: JSON.stringify({ avatar: imgSrc })
            });

            if (res.ok) {
                if(avatarImg) avatarImg.src = imgSrc;
                showToast("ID Image Updated Successfully");
                window.closeAvatarModal();
            } else {
                showToast("Failed to update avatar", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Connection Error", "error");
        }
    };
});