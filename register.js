// Registration page functionality - Works with localStorage only
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const inputs = document.querySelectorAll('.input-group input, .input-group select');
    const userTypeOptions = document.querySelectorAll('.type-option');
    
    let selectedUserType = 'renter'; // Default selection

    // User type selection
    userTypeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            userTypeOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            // Update selected user type
            selectedUserType = this.dataset.type;
        });
    });
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Clear previous error states
        inputs.forEach(input => {
            input.classList.remove('error');
        });
        
        // Validate full name
        const fullName = document.getElementById('fullName');
        if (fullName.value.trim().length < 3) {
            fullName.classList.add('error');
            isValid = false;
        }
        
        // Validate email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.classList.add('error');
            isValid = false;
        }
        
        // Validate phone
        const phone = document.getElementById('phone');
        const phoneRegex = /^[0-9+\-\s()]{10,}$/;
        if (!phoneRegex.test(phone.value)) {
            phone.classList.add('error');
            isValid = false;
        }
        
        // Validate password
        const password = document.getElementById('password');
        if (password.value.length < 8) {
            password.classList.add('error');
            isValid = false;
        }
        
        // Validate confirm password
        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword.value !== password.value) {
            confirmPassword.classList.add('error');
            isValid = false;
        }
        
        // Validate city
        const city = document.getElementById('city');
        if (!city.value) {
            city.classList.add('error');
            isValid = false;
        }
        
        // Validate terms
        const terms = document.getElementById('terms');
        if (!terms.checked) {
            terms.parentElement.style.color = '#ef4444';
            isValid = false;
        } else {
            terms.parentElement.style.color = '#374151';
        }
        
        return isValid;
    }
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        
        switch(field.id) {
            case 'fullName':
                if (value.length >= 3) {
                    field.classList.remove('error');
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(value)) {
                    field.classList.remove('error');
                }
                break;
                
            case 'phone':
                const phoneRegex = /^[0-9+\-\s()]{10,}$/;
                if (phoneRegex.test(value)) {
                    field.classList.remove('error');
                }
                break;
                
            case 'password':
                if (value.length >= 8) {
                    field.classList.remove('error');
                }
                break;
                
            case 'confirmPassword':
                const password = document.getElementById('password');
                if (value === password.value) {
                    field.classList.remove('error');
                }
                break;
                
            case 'city':
                if (value) {
                    field.classList.remove('error');
                }
                break;
        }
    }
    
    // Form submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show loading state
            const submitBtn = document.querySelector('.register-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
            submitBtn.disabled = true;
            
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            try {
                // Prepare user data
                const userData = {
                    id: 'user-' + Date.now(),
                    full_name: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    city: document.getElementById('city').value,
                    password: document.getElementById('password').value,
                    user_type: selectedUserType,
                    created_at: new Date().toISOString(),
                    is_active: true
                };
                
                // Check if email already exists
                const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
                const emailExists = existingUsers.find(user => user.email === userData.email);
                
                if (emailExists) {
                    showErrorMessage('البريد الإلكتروني مستخدم بالفعل');
                    return;
                }
                
                // Add user to localStorage
                existingUsers.push(userData);
                localStorage.setItem('mockUsers', JSON.stringify(existingUsers));
                
                // Create mock token
                const token = 'mock-token-' + Date.now();
                
                // Save user session data
                localStorage.setItem('userToken', token);
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('userType', selectedUserType);
                
                // Create sample data for the new user
                createSampleDataForUser(userData.id, selectedUserType);
                
                // Success message
                showSuccessMessage();
                
                // Reset form
                registerForm.reset();
                
                // Redirect to appropriate dashboard after 2 seconds
                setTimeout(() => {
                    if (selectedUserType === 'owner') {
                        window.location.href = 'dashboard.html';
                    } else {
                        window.location.href = 'renter-dashboard.html';
                    }
                }, 2000);
                
            } catch (error) {
                console.error('Registration error:', error);
                
                // Check if it's a network error
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    showErrorMessage('حدث خطأ في الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.');
                } else {
                    showErrorMessage('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.');
                }
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } else {
            showErrorMessage('يرجى تصحيح الأخطاء في النموذج');
        }
    });
    
    // Success message
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-check-circle"></i>
                <h3>تم إنشاء الحساب بنجاح!</h3>
                <p>سيتم توجيهك إلى لوحة التحكم خلال لحظات...</p>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Add CSS for success message
        const style = document.createElement('style');
        style.textContent = `
            .success-message {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .message-content {
                background: white;
                padding: 2rem;
                border-radius: 16px;
                text-align: center;
                max-width: 400px;
                margin: 0 1rem;
            }
            
            .message-content i {
                font-size: 3rem;
                color: #10b981;
                margin-bottom: 1rem;
            }
            
            .message-content h3 {
                color: #1f2937;
                margin-bottom: 0.5rem;
            }
            
            .message-content p {
                color: #6b7280;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Error message
    function showErrorMessage(text) {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-exclamation-circle"></i>
                <p>${text}</p>
                <button onclick="this.parentElement.parentElement.remove()">حسناً</button>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Add CSS for error message
        const style = document.createElement('style');
        style.textContent = `
            .error-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                z-index: 10000;
                max-width: 300px;
            }
            
            .error-message .message-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .error-message i {
                font-size: 1.2rem;
            }
            
            .error-message button {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 0.5rem;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Password strength indicator
    const password = document.getElementById('password');
    password.addEventListener('input', function() {
        const strength = getPasswordStrength(this.value);
        updatePasswordStrengthIndicator(strength);
    });
    
    function getPasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        if (score < 2) return 'weak';
        if (score < 4) return 'medium';
        return 'strong';
    }
    
    function updatePasswordStrengthIndicator(strength) {
        // Remove existing indicator
        const existingIndicator = document.querySelector('.password-strength');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Create new indicator
        const indicator = document.createElement('div');
        indicator.className = 'password-strength';
        
        const colors = {
            weak: '#ef4444',
            medium: '#f59e0b',
            strong: '#10b981'
        };
        
        const texts = {
            weak: 'ضعيف',
            medium: 'متوسط',
            strong: 'قوي'
        };
        
        indicator.innerHTML = `
            <span style="color: ${colors[strength]}">${texts[strength]}</span>
        `;
        
        password.parentElement.appendChild(indicator);
        
        // Add CSS for password strength
        const style = document.createElement('style');
        style.textContent = `
            .password-strength {
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);
                font-size: 0.8rem;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
});

// Create sample data for the new user
function createSampleDataForUser(userId, userType) {
    try {
        console.log('🔧 Creating sample data for new user:', userId, userType);
        
        if (userType === 'owner') {
            // Create sample cars for car owner
            const sampleCars = [
                {
                    id: 'car-' + Date.now(),
                    owner_id: userId,
                    brand: 'تويوتا',
                    model: 'كامري',
                    year: '2023',
                    color: 'أبيض',
                    transmission: 'أوتوماتيك',
                    fuel_type: 'بنزين',
                    daily_rate: 200,
                    location: 'الرياض',
                    description: 'سيارة فاخرة ومريحة للرحلات الطويلة',
                    features: ['مكيف', 'نظام صوت', 'كاميرا خلفية', 'ABS'],
                    photos: [],
                    is_available: true,
                    created_at: new Date().toISOString()
                }
            ];
            
            // Save sample cars
            const existingCars = JSON.parse(localStorage.getItem('mockCars') || '[]');
            existingCars.push(...sampleCars);
            localStorage.setItem('mockCars', JSON.stringify(existingCars));
            
            // Create sample bookings
            const sampleBookings = [
                {
                    id: 'booking-' + Date.now(),
                    car_id: sampleCars[0].id,
                    car_name: 'تويوتا كامري 2023',
                    renter_id: 'sample-renter',
                    renter_name: 'أحمد محمد',
                    owner_id: userId,
                    start_date: '2024-01-15',
                    end_date: '2024-01-18',
                    status: 'pending',
                    total_amount: 600,
                    daily_rate: 200,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
                }
            ];
            
            // Save sample bookings
            const existingBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
            existingBookings.push(...sampleBookings);
            localStorage.setItem('mockBookings', JSON.stringify(existingBookings));
            
        } else {
            // Create sample bookings for renter
            const sampleBookings = [
                {
                    id: 'booking-' + Date.now(),
                    car_id: 'sample-car',
                    car_name: 'هونداي أكسنت 2022',
                    renter_id: userId,
                    renter_name: document.getElementById('fullName').value,
                    owner_id: 'sample-owner',
                    start_date: '2024-01-20',
                    end_date: '2024-01-22',
                    status: 'approved',
                    total_amount: 300,
                    daily_rate: 100,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
                }
            ];
            
            // Save sample bookings
            const existingBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
            existingBookings.push(...sampleBookings);
            localStorage.setItem('mockBookings', JSON.stringify(existingBookings));
        }
        
        // Create sample notifications
        const sampleNotifications = [
            {
                id: 'notification-' + Date.now(),
                user_id: userId,
                type: 'welcome',
                title: 'مرحباً بك في منصة شارك سيارتك!',
                description: 'شكراً لك على الانضمام إلينا. نتمنى لك تجربة ممتعة!',
                is_read: false,
                created_at: new Date().toISOString()
            }
        ];
        
        // Save sample notifications
        const existingNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
        existingNotifications.push(...sampleNotifications);
        localStorage.setItem('mockNotifications', JSON.stringify(existingNotifications));
        
        console.log('✅ Sample data created successfully for user:', userId);
        
    } catch (error) {
        console.error('❌ Error creating sample data:', error);
    }
}
