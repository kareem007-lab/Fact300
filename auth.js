// Default admin credentials
const ADMIN_PHONE = '0123';
const ADMIN_PASSWORD = 'Admin@123';

// Mock user database in localStorage
function initializeDatabase() {
    if (!localStorage.getItem('users')) {
        const users = [{
            phone: ADMIN_PHONE,
            password: ADMIN_PASSWORD,
            isAdmin: true,
            files: []
        }];
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Initialize on page load
initializeDatabase();

function handleLogin(event) {
    event.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.phone === phone);
    
    if (user && user.password === password) {
        // Store current user info in session
        sessionStorage.setItem('currentUser', JSON.stringify({
            phone: user.phone,
            isAdmin: user.isAdmin
        }));
        
        // Redirect based on role
        if (user.isAdmin) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'employee.html';
        }
        return false;
    }
    
    alert('رقم الهاتف أو كلمة المرور غير صحيحة');
    return false;
}

// Check if user is logged in
function checkAuth() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return null;
    }
    return currentUser;
}

// Logout function
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
