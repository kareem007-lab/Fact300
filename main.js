// Add client-side validation for phone numbers
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="text"][name="phone"]');

    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove non-numeric characters
            this.value = this.value.replace(/[^\d]/g, '');

            // Limit length
            if (this.value.length > 20) {
                this.value = this.value.slice(0, 20);
            }
        });
    });

    // Add confirmation for file upload
    const uploadForms = document.querySelectorAll('form[enctype="multipart/form-data"]');
    uploadForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!confirm('هل أنت متأكد من رفع هذا الملف؟')) {
                e.preventDefault();
            }
        });
    });
});