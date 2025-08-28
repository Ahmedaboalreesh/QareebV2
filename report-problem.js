document.addEventListener('DOMContentLoaded', function() {
    initializeNavbarScroll();
    initializeFormValidation();
    initializeFormSubmission();
    initializeFileUpload();
    initializeAutoFill();
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
    const form = document.getElementById('reportForm');
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
    const form = document.getElementById('reportForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitReport();
        }
    });
}

// Initialize file upload functionality
function initializeFileUpload() {
    const screenshotInput = document.getElementById('screenshots');
    const documentInput = document.getElementById('documents');
    
    // Add file size validation
    [screenshotInput, documentInput].forEach(input => {
        if (input) {
            input.addEventListener('change', function() {
                validateFiles(this);
            });
        }
    });
}

// Initialize auto-fill functionality
function initializeAutoFill() {
    // Auto-detect browser
    const browserField = document.getElementById('browser');
    if (browserField) {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Chrome')) {
            browserField.value = 'chrome';
        } else if (userAgent.includes('Firefox')) {
            browserField.value = 'firefox';
        } else if (userAgent.includes('Safari')) {
            browserField.value = 'safari';
        } else if (userAgent.includes('Edge')) {
            browserField.value = 'edge';
        }
    }
    
    // Auto-detect device type
    const deviceField = document.getElementById('device');
    if (deviceField) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(navigator.userAgent);
        
        if (isTablet) {
            deviceField.value = 'tablet';
        } else if (isMobile) {
            deviceField.value = 'mobile';
        } else {
            deviceField.value = 'desktop';
        }
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
    const form = document.getElementById('reportForm');
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

// Validate uploaded files
function validateFiles(input) {
    const files = input.files;
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = input.accept.split(',');
    
    for (let file of files) {
        // Check file size
        if (file.size > maxSize) {
            showMessage(`الملف ${file.name} كبير جداً. الحد الأقصى 5 ميجابايت`, 'error');
            input.value = '';
            return false;
        }
        
        // Check file type
        const isValidType = allowedTypes.some(type => {
            if (type.includes('*')) {
                return true; // Accept all files
            }
            return file.type.match(type.trim());
        });
        
        if (!isValidType) {
            showMessage(`نوع الملف ${file.name} غير مدعوم`, 'error');
            input.value = '';
            return false;
        }
    }
    
    return true;
}

// Submit report
function submitReport() {
    const form = document.getElementById('reportForm');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    submitBtn.disabled = true;
    
    // Simulate form submission (in real app, this would be an API call)
    setTimeout(() => {
        // Store report in localStorage for demo purposes
        const reportData = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            status: 'pending',
            ...Object.fromEntries(formData)
        };
        
        // Get existing reports or create new array
        const existingReports = JSON.parse(localStorage.getItem('problemReports') || '[]');
        existingReports.push(reportData);
        localStorage.setItem('problemReports', JSON.stringify(reportData));
        
        // Reset form
        form.reset();
        
        // Show success message
        showMessage('تم إرسال البلاغ بنجاح! سنتواصل معك قريباً.', 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    }, 2000);
}

// Show message
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
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
    
    // Add to page
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    // Auto remove after 5 seconds
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

// Add embedded CSS for the report problem page
const embeddedStyles = `
    .report-problem-section {
        margin-top: 80px;
        min-height: calc(100vh - 80px);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px 0;
    }

    .report-header {
        text-align: center;
        margin-bottom: 40px;
        color: white;
    }

    .report-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .report-header p {
        font-size: 1.1rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
    }

    .quick-actions {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 40px;
        flex-wrap: wrap;
    }

    .quick-actions .btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .quick-actions .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .report-form-container {
        background: white;
        border-radius: 12px;
        padding: 40px;
        margin-bottom: 40px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }

    .form-header {
        text-align: center;
        margin-bottom: 30px;
    }

    .form-header h2 {
        color: #333;
        font-size: 1.8rem;
        margin-bottom: 10px;
    }

    .form-header p {
        color: #666;
        font-size: 1rem;
    }

    .report-form {
        max-width: 800px;
        margin: 0 auto;
    }

    .form-section {
        margin-bottom: 30px;
        padding: 25px;
        background: #f8f9ff;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    }

    .form-section h3 {
        color: #333;
        font-size: 1.3rem;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #667eea;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        display: block;
        color: #333;
        font-weight: 600;
        margin-bottom: 8px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s ease;
        font-family: 'Cairo', sans-serif;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc3545;
    }

    .field-error {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 5px;
        display: block;
    }

    .form-group small {
        color: #666;
        font-size: 0.875rem;
        margin-top: 5px;
        display: block;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        font-weight: 500;
    }

    .checkbox-label input[type="checkbox"] {
        width: auto;
        margin: 0;
    }

    .checkmark {
        width: 20px;
        height: 20px;
        border: 2px solid #667eea;
        border-radius: 4px;
        display: inline-block;
        position: relative;
    }

    .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #667eea;
        font-weight: bold;
    }

    .form-actions {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 30px;
        flex-wrap: wrap;
    }

    .form-actions .btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 15px 30px;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 8px;
        transition: all 0.3s ease;
    }

    .form-actions .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .help-section {
        background: white;
        border-radius: 12px;
        padding: 40px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }

    .help-section h2 {
        text-align: center;
        color: #333;
        font-size: 1.8rem;
        margin-bottom: 30px;
    }

    .help-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 25px;
    }

    .help-option {
        text-align: center;
        padding: 30px 20px;
        background: #f8f9ff;
        border-radius: 8px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }

    .help-option:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .help-option i {
        font-size: 2.5rem;
        color: #667eea;
        margin-bottom: 15px;
    }

    .help-option h3 {
        color: #333;
        font-size: 1.2rem;
        margin-bottom: 10px;
    }

    .help-option p {
        color: #666;
        margin: 5px 0;
        font-size: 0.9rem;
    }

    .message {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 1000;
        max-width: 400px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    }

    .message-success {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }

    .message-error {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }

    .message-warning {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
    }

    .message-info {
        background: #d1ecf1;
        border: 1px solid #bee5eb;
        color: #0c5460;
    }

    .message-content {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px 20px;
    }

    .message-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        margin-right: auto;
        padding: 0;
        font-size: 1rem;
    }

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

    /* Responsive Design */
    @media (max-width: 768px) {
        .report-problem-section {
            margin-top: 60px;
            padding: 20px 0;
        }

        .report-header h1 {
            font-size: 2rem;
        }

        .report-header p {
            font-size: 1rem;
        }

        .quick-actions {
            flex-direction: column;
            align-items: center;
        }

        .quick-actions .btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
        }

        .report-form-container {
            padding: 25px 20px;
        }

        .form-section {
            padding: 20px;
        }

        .form-row {
            grid-template-columns: 1fr;
            gap: 15px;
        }

        .form-actions {
            flex-direction: column;
            align-items: center;
        }

        .form-actions .btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
        }

        .help-options {
            grid-template-columns: 1fr;
        }

        .message {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }

    @media (max-width: 480px) {
        .report-header h1 {
            font-size: 1.8rem;
        }

        .report-form-container {
            padding: 20px 15px;
        }

        .form-section {
            padding: 15px;
        }

        .help-section {
            padding: 25px 20px;
        }
    }
`;

// Add styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = embeddedStyles;
document.head.appendChild(styleSheet);
