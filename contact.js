// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form
    initializeContactForm();
    
    // Initialize FAQ functionality
    initializeFAQ();
    
    // Initialize navbar scroll effect
    initializeNavbarScroll();
});

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission();
        });
    }
    
    // Add input validation
    addFormValidation();
}

// Handle contact form submission
function handleContactFormSubmission() {
    const formData = new FormData(document.getElementById('contactForm'));
    const formObject = {};
    
    // Convert FormData to object
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Validate form
    if (!validateContactForm(formObject)) {
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Store contact message in localStorage (for demo purposes)
        const contactMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        const newMessage = {
            id: Date.now(),
            ...formObject,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        contactMessages.push(newMessage);
        localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
        
        // Show success message
        showMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Validate contact form
function validateContactForm(data) {
    const errors = [];
    
    // Check required fields
    if (!data.firstName || data.firstName.trim().length < 2) {
        errors.push('الاسم الأول يجب أن يكون على الأقل حرفين');
    }
    
    if (!data.lastName || data.lastName.trim().length < 2) {
        errors.push('اسم العائلة يجب أن يكون على الأقل حرفين');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('يرجى إدخال بريد إلكتروني صحيح');
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
        errors.push('يرجى إدخال رقم هاتف صحيح');
    }
    
    if (!data.subject) {
        errors.push('يرجى اختيار نوع الاستفسار');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('الرسالة يجب أن تكون على الأقل 10 أحرف');
    }
    
    if (!data.privacy) {
        errors.push('يجب الموافقة على سياسة الخصوصية والشروط والأحكام');
    }
    
    if (errors.length > 0) {
        showMessage(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add form validation
function addFormValidation() {
    const inputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (field.name) {
        case 'firstName':
        case 'lastName':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'يجب أن يكون على الأقل حرفين';
            }
            break;
            
        case 'email':
            if (!isValidEmail(value)) {
                isValid = false;
                errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
            }
            break;
            
        case 'phone':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'يرجى إدخال رقم هاتف صحيح';
            }
            break;
            
        case 'subject':
            if (!value) {
                isValid = false;
                errorMessage = 'يرجى اختيار نوع الاستفسار';
            }
            break;
            
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'يجب أن تكون على الأقل 10 أحرف';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        animation: fadeIn 0.3s ease;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = '#e2e8f0';
    field.style.boxShadow = 'none';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Initialize FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Initialize navbar scroll effect
function initializeNavbarScroll() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Show message function
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add CSS for message content
    const messageContent = messageDiv.querySelector('.message-content');
    messageContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    // Add styles for close button
    const closeBtn = messageDiv.querySelector('button');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-right: 0;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Add CSS for navbar scroll effect
const navbarStyle = document.createElement('style');
navbarStyle.textContent = `
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .contact-form input:focus,
    .contact-form select:focus,
    .contact-form textarea:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .faq-item {
        transition: all 0.3s ease;
    }
    
    .faq-answer {
        transition: all 0.3s ease;
    }
    
    .contact-info-card {
        transition: all 0.3s ease;
    }
    
    .social-contact-section .social-link {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(navbarStyle);
