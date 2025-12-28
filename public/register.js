document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                if (window.playError) window.playError();
                if (window.showGlobalToast) {
                    window.showGlobalToast("Passcodes do not match", true);
                } else {
                    alert("Passcodes do not match");
                }
                return;
            }

            try {
                const res = await fetch('/api/auth/register', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    if (window.playSuccess) window.playSuccess();
                    
                    if (window.showGlobalToast) {
                        window.showGlobalToast("RECRUIT REGISTERED. Redirecting...", false);
                    }

                    registerForm.reset();
                    
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);

                } else {
                    if (window.playError) window.playError();
                    
                    let errorMsg = data.msg;
                    
                    if (!errorMsg && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                        errorMsg = data.errors[0].msg;
                    }
                    
                    if (!errorMsg) errorMsg = "Registration Failed";

                    if (window.showGlobalToast) {
                        window.showGlobalToast(errorMsg, true);
                    } else {
                        alert(errorMsg);
                    }
                }

            } catch (err) {
                console.error("Registration Error:", err);
                if (window.playError) window.playError();
                
                if (window.showGlobalToast) {
                    window.showGlobalToast("Server Connection Failed", true);
                } else {
                    alert("Server Connection Failed");
                }
            }
        });
    }
});