document.addEventListener('DOMContentLoaded', function() {
    initializeNavbarScroll();
    initializeFormValidation();
    initializeFormSubmission();
    initializeProfilePicture();
    loadUserData();
});

// Initialize navbar scroll effect
function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.getElementById('profileForm');
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearFieldError(this);
            }
        });
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    emailField.addEventListener('blur', function() {
        if (this.value && !isValidEmail(this.value)) {
            showFieldError(this, 'يرجى إدخال بريد إلكتروني صحيح');
        }
    });
    
    // Phone validation
    const phoneField = document.getElementById('phone');
    phoneField.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9+\-\s]/g, '');
    });
}

// Initialize form submission
function initializeFormSubmission() {
    const form = document.getElementById('profileForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            saveProfile();
        }
    });
}

// Initialize profile picture functionality
function initializeProfilePicture() {
    const profilePictureInput = document.getElementById('profilePictureInput');
    const profilePicture = document.getElementById('profilePicture');
    
    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (validateImageFile(file)) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        profilePicture.src = e.target.result;
                        localStorage.setItem('profilePicture', e.target.result);
                        showMessage('تم رفع الصورة بنجاح', 'success');
                    };
                    reader.readAsDataURL(file);
                } else {
                    showMessage('يرجى اختيار صورة صحيحة (JPG, PNG, GIF) بحجم أقل من 5 ميجابايت', 'error');
                }
            }
        });
    }
}

// Load user data from localStorage
function loadUserData() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Fill form fields with user data
        if (userData.full_name) document.getElementById('fullName').value = userData.full_name;
        if (userData.username) document.getElementById('username').value = userData.username;
        if (userData.email) document.getElementById('email').value = userData.email;
        if (userData.phone) document.getElementById('phone').value = userData.phone;
        if (userData.date_of_birth) document.getElementById('dateOfBirth').value = userData.date_of_birth;
        if (userData.gender) document.getElementById('gender').value = userData.gender;
        if (userData.city) document.getElementById('city').value = userData.city;
        if (userData.address) document.getElementById('address').value = userData.address;
        if (userData.bio) document.getElementById('bio').value = userData.bio;
        if (userData.language) document.getElementById('language').value = userData.language;
        if (userData.currency) document.getElementById('currency').value = userData.currency;
        
        // Load profile picture
        const savedPicture = localStorage.getItem('profilePicture');
        if (savedPicture) {
            document.getElementById('profilePicture').src = savedPicture;
        }
        
    } catch (error) {
        console.error('Error loading user data:', error);
        showMessage('حدث خطأ في تحميل البيانات', 'error');
    }
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'هذا الحقل مطلوب');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'يرجى إدخال بريد إلكتروني صحيح');
        return false;
    }
    
    return true;
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('profileForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate image file
function validateImageFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (file.size > maxSize) {
        return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
        return false;
    }
    
    return true;
}

// Save profile data
function saveProfile() {
    const form = document.getElementById('profileForm');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
    submitBtn.disabled = true;
    
    // Simulate saving
    setTimeout(() => {
        try {
            // Collect form data
            const profileData = {
                full_name: formData.get('fullName'),
                username: formData.get('username'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                date_of_birth: formData.get('dateOfBirth'),
                gender: formData.get('gender'),
                city: formData.get('city'),
                address: formData.get('address'),
                bio: formData.get('bio'),
                language: formData.get('language'),
                currency: formData.get('currency'),
                updated_at: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('userData', JSON.stringify(profileData));
            
            showMessage('تم حفظ البيانات بنجاح', 'success');
            
        } catch (error) {
            console.error('Error saving profile:', error);
            showMessage('حدث خطأ في حفظ البيانات', 'error');
        }
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

// Remove profile picture
function removeProfilePicture() {
    const profilePicture = document.getElementById('profilePicture');
    const defaultPicture = 'https://via.placeholder.com/150x150/667eea/ffffff?text=صورة+شخصية';
    
    profilePicture.src = defaultPicture;
    localStorage.removeItem('profilePicture');
    showMessage('تم إزالة الصورة الشخصية', 'success');
}

// Export user data
function exportUserData() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        const exportData = {
            ...userData,
            export_date: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `user_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showMessage('تم تصدير البيانات بنجاح', 'success');
        
    } catch (error) {
        console.error('Error exporting data:', error);
        showMessage('حدث خطأ في تصدير البيانات', 'error');
    }
}

// Deactivate account
function deactivateAccount() {
    if (confirm('هل أنت متأكد من إخفاء حسابك؟ يمكنك إعادة تفعيله لاحقاً.')) {
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            userData.is_active = false;
            userData.deactivated_at = new Date().toISOString();
            localStorage.setItem('userData', JSON.stringify(userData));
            
            showMessage('تم إخفاء الحساب بنجاح', 'success');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            console.error('Error deactivating account:', error);
            showMessage('حدث خطأ في إخفاء الحساب', 'error');
        }
    }
}

// Delete account
function deleteAccount() {
    if (confirm('هل أنت متأكد من حذف حسابك نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        const confirmation = prompt('اكتب "حذف" لتأكيد حذف الحساب:');
        
        if (confirmation === 'حذف') {
            try {
                localStorage.removeItem('userData');
                localStorage.removeItem('userToken');
                localStorage.removeItem('userType');
                localStorage.removeItem('profilePicture');
                
                showMessage('تم حذف الحساب بنجاح', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                
            } catch (error) {
                console.error('Error deleting account:', error);
                showMessage('حدث خطأ في حذف الحساب', 'error');
            }
        } else {
            showMessage('تم إلغاء حذف الحساب', 'info');
        }
    }
}

// Show message function
function showMessage(message, type = 'info') {
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas ${getMessageIcon(type)}"></i>
            <span>${message}</span>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Get message icon
function getMessageIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}
