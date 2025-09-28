document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reset-password-form');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        messageDiv.textContent = '';
        messageDiv.className = 'message';
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            messageDiv.textContent = 'Passwords do not match.';
            return;
        }

        // Get token from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            messageDiv.textContent = 'Invalid or missing reset token.';
            return;
        }

        try {
            const res = await fetch(`/api/users/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Try to parse errors if they are in an array format from the validator
                const errorMsg = data.errors ? data.errors[0].msg : (data.msg || 'Something went wrong');
                throw new Error(errorMsg);
            }

            messageDiv.textContent = 'Password has been updated successfully! Redirecting to login...';
            messageDiv.classList.add('success');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);

        } catch (err) {
            messageDiv.textContent = err.message;
        }
    });
});