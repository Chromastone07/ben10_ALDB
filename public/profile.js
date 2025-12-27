document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    
    // Redirect if no token
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // --- DOM ELEMENTS ---
    const usernameEl = document.getElementById('profile-username');
    const emailEl = document.getElementById('profile-email');
    const rankEl = document.getElementById('profile-rank');
    const joinedEl = document.getElementById('profile-joined');
    const badgeImg = document.getElementById('profile-badge');
    const toastContainer = document.getElementById('toast-container');

    // --- HELPER: TOAST NOTIFICATIONS ---
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        toast.innerHTML = type === 'success' 
            ? `<span>✅</span> <span>${message}</span>` 
            : `<span>⚠️</span> <span>${message}</span>`;
        
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // --- 1. LOAD PROFILE ---
    try {
        const res = await fetch('/api/profile/me', {
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token }
        });

        // Handle Expired Token (401)
        if (res.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }

        const data = await res.json();

        if (res.ok) {
            if (usernameEl) usernameEl.textContent = data.username;
            if (emailEl) emailEl.textContent = data.email;
            if (rankEl) rankEl.textContent = data.rank || "RECRUIT";
            if (joinedEl && data.createdAt) joinedEl.textContent = new Date(data.createdAt).toLocaleDateString();
            
            // Badge Logic
            if (badgeImg) {
                let badgeSrc = 'images/omnitrix.png'; // Default
                if (data.rank === 'Plumber') badgeSrc = 'images/badges/plumber.png';
                if (data.rank === 'Magister') badgeSrc = 'images/badges/magister.png';
                badgeImg.src = badgeSrc;
                badgeImg.onerror = () => badgeImg.src = 'images/omnitrix.png';
            }

            // Pre-fill Edit Modal
            const editInput = document.getElementById('edit-username-input');
            if (editInput) editInput.value = data.username;
        }
    } catch (err) { 
        console.error("Profile Load Error:", err); 
        showToast("Failed to load profile data", "error");
    }

    // --- 2. MODAL LOGIC ---
    window.openModal = (id) => {
        document.getElementById(id).classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    window.closeModal = (id) => {
        document.getElementById(id).classList.remove('active');
        document.body.style.overflow = '';
    };

    // Open Buttons
    document.getElementById('edit-username-btn')?.addEventListener('click', () => openModal('edit-profile-modal'));
    document.getElementById('change-password-btn')?.addEventListener('click', () => openModal('password-modal'));
    document.getElementById('delete-account-btn')?.addEventListener('click', () => openModal('delete-modal'));

    // Close Buttons (X and Outside Click)
    document.querySelectorAll('.close-button').forEach(btn => btn.addEventListener('click', (e) => {
        closeModal(e.target.closest('.modal-overlay').id);
    }));
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
    });

    // --- 3. ACTIONS ---

    // Edit Username
    document.getElementById('confirm-edit-btn')?.addEventListener('click', async () => {
        const newName = document.getElementById('edit-username-input').value;
        if (!newName.trim()) return showToast("Username cannot be empty", "error");

        try {
            const res = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ username: newName })
            });
            const data = await res.json();
            
            if (res.ok) {
                showToast("Username updated!");
                if (usernameEl) usernameEl.textContent = newName;
                closeModal('edit-profile-modal');
            } else {
                showToast(data.msg || "Update failed", "error");
            }
        } catch (e) { showToast("Server Error", "error"); }
    });

    // Change Password
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
            const data = await res.json();

            if (res.ok) {
                showToast("Password changed! Logging out...", "success");
                setTimeout(() => {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showToast(data.msg || "Failed to change password", "error");
            }
        } catch (e) { showToast("Server Error", "error"); }
    });

    // Delete Account
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

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    // Password Toggle Helper
    window.togglePassword = (id, icon) => {
        const input = document.getElementById(id);
        if (input.type === "password") {
            input.type = "text";
            icon.textContent = "🔒";
        } else {
            input.type = "password";
            icon.textContent = "👁️";
        }
    };

    // --- AUDIO SETTINGS LOGIC ---
    const audioBtn = document.getElementById('system-audio-btn');
    const audioStatusText = document.getElementById('audio-status-text');

    // 1. Initialize Button State on Load
    const isMuted = localStorage.getItem('plumber_muted') === 'true';
    updateAudioUI(isMuted);

    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            // Toggle State
            const currentState = localStorage.getItem('plumber_muted') === 'true';
            const newState = !currentState;
            
            // Call the global system to update
            audioSystem.setMute(newState);
            
            // Update UI
            updateAudioUI(newState);
            
            // Feedback sound (only if turning ON)
            if (!newState) audioSystem.sfxSuccess();
        });
    }

    function updateAudioUI(muted) {
        if (muted) {
            audioStatusText.textContent = "OFF";
            audioStatusText.style.color = "#666";
            audioBtn.style.borderColor = "#666";
        } else {
            audioStatusText.textContent = "ON";
            audioStatusText.style.color = "var(--accent-green)"; // Green for ON
            audioBtn.style.borderColor = "var(--accent-cyan)";
        }
    }
});