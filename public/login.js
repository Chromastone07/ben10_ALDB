document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const messageDiv = document.getElementById('message');

    document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/auth/login', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            if(window.playSuccess) window.playSuccess();
            if(window.showGlobalToast) window.showGlobalToast("ACCESS GRANTED. Welcome, Plumber.", false);
            
            localStorage.setItem('token', data.token);
            
            setTimeout(() => {
                window.location.href = 'profile.html'; 
            }, 1500);
        } else {
            if(window.playError) window.playError();
            if(window.showGlobalToast) window.showGlobalToast(data.msg || "Login Failed", true);
        }
    } catch (err) {
        console.error(err);
        if(window.showGlobalToast) window.showGlobalToast("Server Connection Failed", true);
    }
});
});