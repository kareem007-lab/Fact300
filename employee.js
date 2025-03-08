// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = checkAuth();
    if (!currentUser || currentUser.isAdmin) {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('userPhone').textContent = currentUser.phone;
    loadUserFiles();
});

// Load and display user files
function loadUserFiles() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.phone === currentUser.phone);
    const container = document.getElementById('fileList');
    
    if (!user || user.files.length === 0) {
        container.innerHTML = '<p class="text-center">لا توجد ملفات متاحة</p>';
        return;
    }
    
    let html = '<div class="list-group">';
    user.files.forEach(file => {
        html += `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <span>${file.name}</span>
                <a href="${file.data}" class="btn btn-sm btn-primary" download>
                    <i class="bi bi-download"></i> تحميل
                </a>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}
