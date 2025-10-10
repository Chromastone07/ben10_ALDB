document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const usernameDisplay = document.getElementById('username-display');
    const emailDisplay = document.getElementById('email-display');
    const memberSinceDisplay = document.getElementById('member-since-display');

    const usernameModal = document.getElementById('username-modal');
    const passwordModal = document.getElementById('password-modal');
    const deleteModal = document.getElementById('delete-modal');

    const modals = {
        username: { element: usernameModal, btn: document.getElementById('open-username-modal-btn'), msg: document.getElementById('username-message') },
        password: { element: passwordModal, btn: document.getElementById('open-password-modal-btn'), msg: document.getElementById('password-message') },
        delete: { element: deleteModal, btn: document.getElementById('open-delete-modal-btn'), msg: document.getElementById('delete-message') },
    };

    const showToast = (message, isError = false) => {
        const toast = document.getElementById('toast-notification');
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast show ${isError ? 'error' : ''}`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    const openModal = (modalKey) => modals[modalKey].element.classList.add('active');
    const closeModal = (modalKey) => modals[modalKey].element.classList.remove('active');

    Object.values(modals).forEach(({ element }) => {
        element.querySelector('.close-button').addEventListener('click', () => element.classList.remove('active'));
    });

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile/me', { headers: { 'x-auth-token': token } });
            if (!res.ok) throw new Error('Could not load profile. Please log in again.');
            const user = await res.json();
            usernameDisplay.textContent = user.username;
            emailDisplay.textContent = user.email;
            memberSinceDisplay.textContent = new Date(user.createdAt).toLocaleDateString();
        } catch (err) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    };


    modals.username.btn.addEventListener('click', () => openModal('username'));
    modals.password.btn.addEventListener('click', () => openModal('password'));
    modals.delete.btn.addEventListener('click', () => openModal('delete'));

    const updateUsernameBtn = document.getElementById('update-username-btn');
    updateUsernameBtn.addEventListener('click', async () => {
        const newUsername = document.getElementById('new-username').value.trim();
        if (!newUsername) return modals.username.msg.textContent = 'Username cannot be empty.';
        
        try {
            const res = await fetch('/api/profile/update-username', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ username: newUsername })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.errors ? data.errors[0].msg : (data.msg || 'Failed to update username'));
            
            showToast('Username updated successfully!');
            fetchProfile();
            closeModal('username');
        } catch (err) {
            modals.username.msg.textContent = err.message;
        }
    });

    const changePasswordBtn = document.getElementById('change-password-btn');
    changePasswordBtn.addEventListener('click', async () => {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmNewPassword) {
            return modals.password.msg.textContent = 'New passwords do not match.';
        }

        try {
            const res = await fetch('/api/profile/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.errors ? data.errors[0].msg : (data.msg || 'Failed to change password'));

            showToast('Password updated successfully!');
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-new-password').value = '';
            closeModal('password');
        } catch (err) {
            modals.password.msg.textContent = err.message;
        }
    });

    const deleteConfirmInput = document.getElementById('delete-confirm');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    
    deleteConfirmInput.addEventListener('input', () => {
        deleteAccountBtn.disabled = deleteConfirmInput.value !== 'DELETE';
    });

    deleteAccountBtn.addEventListener('click', async () => {
        try {
            const res = await fetch('/api/profile/delete-account', {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Failed to delete account');
            
            showToast(data.msg);
            localStorage.removeItem('token');
            setTimeout(() => { window.location.href = 'index.html'; }, 2000);

        } catch (err) {
            modals.delete.msg.textContent = err.message;
        }
    });

    fetchProfile();
});