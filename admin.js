// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = checkAuth();
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('userPhone').textContent = currentUser.phone;
    loadEmployeeList();
});

// Handle employee Excel upload
function handleEmployeeExcelUpload(event) {
    event.preventDefault();
    
    const file = document.getElementById('employeeExcelFile').files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const records = XLSX.utils.sheet_to_json(firstSheet);
        
        const users = JSON.parse(localStorage.getItem('users'));
        
        records.forEach(record => {
            const phone = String(record['رقم الهاتف']);
            const password = String(record['كلمة المرور']);
            
            if (!users.find(u => u.phone === phone)) {
                users.push({
                    phone: phone,
                    password: password,
                    isAdmin: false,
                    files: []
                });
            }
        });
        
        localStorage.setItem('users', JSON.stringify(users));
        alert('تم استيراد بيانات الموظفين بنجاح');
        loadEmployeeList();
    };
    
    reader.readAsArrayBuffer(file);
    return false;
}

// Handle files Excel upload
function handleFilesExcelUpload(event) {
    event.preventDefault();
    
    const file = document.getElementById('filesExcelFile').files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const records = XLSX.utils.sheet_to_json(firstSheet);
        
        const users = JSON.parse(localStorage.getItem('users'));
        let successCount = 0;
        let errorCount = 0;
        
        records.forEach(record => {
            const phone = String(record['رقم الهاتف']);
            const filePath = String(record['مسار الملف']);
            const user = users.find(u => u.phone === phone);
            
            if (user) {
                const fileName = filePath.split('\\').pop().split('/').pop();
                user.files.push({
                    name: fileName,
                    data: filePath // In a real app, we'd store the file data
                });
                successCount++;
            } else {
                errorCount++;
            }
        });
        
        localStorage.setItem('users', JSON.stringify(users));
        alert(`تم استيراد ${successCount} ملف بنجاح\nفشل استيراد ${errorCount} ملف`);
        loadEmployeeList();
    };
    
    reader.readAsArrayBuffer(file);
    return false;
}

// Handle single file upload
function handleFileUpload(event) {
    event.preventDefault();
    
    const phone = document.getElementById('employeePhone').value;
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.phone === phone);
    
    if (!user) {
        alert('رقم هاتف الموظف غير موجود');
        return false;
    }
    
    // In a real app, we'd upload the file to a server
    user.files.push({
        name: file.name,
        data: URL.createObjectURL(file)
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    alert('تم رفع الملف بنجاح');
    loadEmployeeList();
    return false;
}

// Load and display employee list
function loadEmployeeList() {
    const users = JSON.parse(localStorage.getItem('users'));
    const employees = users.filter(u => !u.isAdmin);
    const container = document.getElementById('employeeList');
    
    if (employees.length === 0) {
        container.innerHTML = '<p class="text-center">لا يوجد موظفين مسجلين</p>';
        return;
    }
    
    let html = '<div class="list-group">';
    employees.forEach(employee => {
        html += `
            <div class="list-group-item">
                <h5 class="mb-2">رقم الهاتف: ${employee.phone}</h5>
                ${employee.files.length > 0 ? `
                    <div class="ms-3">
                        <p class="mb-2">الملفات:</p>
                        <ul class="list-unstyled">
                            ${employee.files.map(file => `
                                <li class="d-flex justify-content-between align-items-center mb-2">
                                    <span>${file.name}</span>
                                    <a href="${file.data}" class="btn btn-sm btn-primary" download>
                                        <i class="bi bi-download"></i> تحميل
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : '<p class="text-muted mb-0">لا توجد ملفات</p>'}
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}
