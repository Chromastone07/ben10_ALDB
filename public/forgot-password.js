document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgot-password-form');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        messageDiv.textContent = '';
        messageDiv.className = 'message';
        
        const email = document.getElementById('email').value;

        try {
            const res = await fetch('/api/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || 'Something went wrong');
            }

            messageDiv.textContent = data.msg;
            messageDiv.classList.add('success');

        } catch (err) {
            messageDiv.textContent = err.message;
        }
    });
});