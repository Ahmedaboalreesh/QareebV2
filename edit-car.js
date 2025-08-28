// Edit Car page functionality
let currentStep = 1;
let totalSteps = 5;
let carData = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuth();
    
    // Get car ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    
    if (!carId) {
        showMessage('لم يتم تحديد السيارة المراد تعديلها', 'error');
        setTimeout(() => {
            window.location.href = 'my-cars.html';
        }, 2000);
        return;
    }
    
    // Load car data
    loadCarData(carId);
    
    // Initialize page
    initializePage();
    
    // Setup form submission
    setupFormSubmission();
});

// Check authentication
function checkAuth() {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
        window.location.href = 'index.html';
        return;
    }
}

// Load car data from localStorage
function loadCarData(carId) {
    try {
        const carsData = JSON.parse(localStorage.getItem('mockCars') || '[]');
        carData = carsData.find(car => car.id == carId);
        
        if (!carData) {
            showMessage('لم يتم العثور على السيارة', 'error');
            setTimeout(() => {
                window.location.href = 'my-cars.html';
            }, 2000);
            return;
        }
        
        // Set car ID in hidden field
        document.getElementById('carId').value = carId;
        
        // Populate form fields
        populateFormFields(carData);
        
    } catch (error) {
        console.error('Error loading car data:', error);
        showMessage('حدث خطأ في تحميل بيانات السيارة', 'error');
    }
}

// Populate form fields with car data
function populateFormFields(car) {
    // Basic car information
    document.getElementById('carBrand').value = car.brand || '';
    document.getElementById('carModel').value = car.model || '';
    document.getElementById('carYear').value = car.year || '';
    document.getElementById('carColor').value = car.color || '';
    document.getElementById('carType').value = car.type || '';
    document.getElementById('transmission').value = car.transmission || '';
    document.getElementById('fuelType').value = car.fuelType || '';
    document.getElementById('mileage').value = car.mileage || '';
    
    // Rental information
    document.getElementById('dailyRate').value = car.dailyRate || '';
    document.getElementById('weeklyRate').value = car.weeklyRate || '';
    document.getElementById('monthlyRate').value = car.monthlyRate || '';
    document.getElementById('deposit').value = car.deposit || '';
    
    // Availability
    document.getElementById('availableFrom').value = car.availableFrom || '';
    document.getElementById('availableTo').value = car.availableTo || '';
    document.getElementById('location').value = car.location || '';
    document.getElementById('pickupLocation').value = car.pickupLocation || '';
    
    // Delivery service
    if (car.delivery_service) {
        document.getElementById('deliveryService').checked = true;
        document.getElementById('deliveryFields').style.display = 'block';
        document.getElementById('deliveryFee').value = car.delivery_fee || '';
        document.getElementById('deliveryNote').value = car.delivery_note || '';
    }
    
    // Car description
    document.getElementById('carDescription').value = car.description || '';
    
    // Features
    if (car.features && Array.isArray(car.features)) {
        car.features.forEach(feature => {
            const checkbox = document.querySelector(`input[name="features"][value="${feature}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
}

// Initialize page
function initializePage() {
    // Setup delivery service toggle
    const deliveryServiceCheckbox = document.getElementById('deliveryService');
    const deliveryFields = document.getElementById('deliveryFields');
    
    deliveryServiceCheckbox.addEventListener('change', function() {
        if (this.checked) {
            deliveryFields.style.display = 'block';
        } else {
            deliveryFields.style.display = 'none';
            document.getElementById('deliveryFee').value = '';
            document.getElementById('deliveryNote').value = '';
        }
    });
    
    // Setup input focus effects
    const inputWrappers = document.querySelectorAll('.input-wrapper');
    inputWrappers.forEach(wrapper => {
        const input = wrapper.querySelector('input, select, textarea');
        if (input) {
            input.addEventListener('focus', function() {
                wrapper.style.borderColor = '#3b82f6';
                wrapper.style.backgroundColor = 'white';
                wrapper.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            });
            
            input.addEventListener('blur', function() {
                wrapper.style.borderColor = '#e5e7eb';
                wrapper.style.backgroundColor = '#f9fafb';
                wrapper.style.boxShadow = 'none';
            });
        }
    });
}

// Setup form submission
function setupFormSubmission() {
    const form = document.getElementById('editCarForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        updateCar();
    });
}

// Next step function
function nextStep() {
    if (currentStep < totalSteps) {
        // Validate current step
        if (validateCurrentStep()) {
            // Hide current step
            document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
            
            // Show next step
            currentStep++;
            document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
            
            // Update progress steps
            updateProgressSteps();
            
            // Update buttons
            updateButtons();
        }
    }
}

// Previous step function
function previousStep() {
    if (currentStep > 1) {
        // Hide current step
        document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
        
        // Show previous step
        currentStep--;
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
        
        // Update progress steps
        updateProgressSteps();
        
        // Update buttons
        updateButtons();
    }
}

// Validate current step
function validateCurrentStep() {
    const currentSection = document.querySelector(`[data-step="${currentStep}"]`);
    const requiredFields = currentSection.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.focus();
            showMessage(`يرجى ملء جميع الحقول المطلوبة في الخطوة ${currentStep}`, 'error');
            return false;
        }
    }
    
    return true;
}

// Update progress steps
function updateProgressSteps() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// Update buttons
function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    } else if (currentStep === totalSteps) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
    } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    }
}

// Update car function
async function updateCar() {
    try {
        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <div class="btn-icon">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div class="btn-content">
                <span class="btn-title">جاري الحفظ...</span>
                <span class="btn-subtitle">يرجى الانتظار</span>
            </div>
        `;
        submitBtn.disabled = true;
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get form data
        const formData = new FormData(document.getElementById('editCarForm'));
        const carId = formData.get('carId');
        
        // Get cars from localStorage
        const carsData = JSON.parse(localStorage.getItem('mockCars') || '[]');
        const carIndex = carsData.findIndex(car => car.id == carId);
        
        if (carIndex === -1) {
            throw new Error('لم يتم العثور على السيارة');
        }
        
        // Get selected features
        const selectedFeatures = [];
        const featureCheckboxes = document.querySelectorAll('input[name="features"]:checked');
        featureCheckboxes.forEach(checkbox => {
            selectedFeatures.push(checkbox.value);
        });
        
        // Update car data
        const updatedCar = {
            ...carsData[carIndex],
            brand: formData.get('carBrand'),
            model: formData.get('carModel'),
            year: formData.get('carYear'),
            color: formData.get('carColor'),
            type: formData.get('carType'),
            transmission: formData.get('transmission'),
            fuelType: formData.get('fuelType'),
            mileage: formData.get('mileage'),
            dailyRate: formData.get('dailyRate'),
            weeklyRate: formData.get('weeklyRate'),
            monthlyRate: formData.get('monthlyRate'),
            deposit: formData.get('deposit'),
            availableFrom: formData.get('availableFrom'),
            availableTo: formData.get('availableTo'),
            location: formData.get('location'),
            pickupLocation: formData.get('pickupLocation'),
            delivery_service: formData.get('deliveryService') === 'on',
            delivery_fee: formData.get('deliveryFee'),
            delivery_note: formData.get('deliveryNote'),
            description: formData.get('carDescription'),
            features: selectedFeatures,
            updated_at: new Date().toISOString()
        };
        
        // Update car in array
        carsData[carIndex] = updatedCar;
        
        // Save back to localStorage
        localStorage.setItem('mockCars', JSON.stringify(carsData));
        
        // Show success message
        showMessage('تم تحديث السيارة بنجاح', 'success');
        
        // Redirect to my cars page after delay
        setTimeout(() => {
            window.location.href = 'my-cars.html';
        }, 2000);
        
    } catch (error) {
        console.error('Update car error:', error);
        showMessage('حدث خطأ أثناء تحديث السيارة', 'error');
        
        // Reset button
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.innerHTML = `
            <div class="btn-icon">
                <i class="fas fa-save"></i>
            </div>
            <div class="btn-content">
                <span class="btn-title">حفظ التعديلات</span>
                <span class="btn-subtitle">تحديث معلومات السيارة</span>
            </div>
        `;
        submitBtn.disabled = false;
    }
}

// Go back function
function goBack() {
    if (confirm('هل أنت متأكد من الرجوع؟ سيتم فقدان التغييرات غير المحفوظة.')) {
        window.location.href = 'my-cars.html';
    }
}

// Show message function
function showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.className = `message message-${type}`;
    message.innerHTML = `
        <div class="message-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <p>${text}</p>
            <button onclick="this.parentElement.parentElement.remove()">حسناً</button>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (message.parentElement) {
            message.remove();
        }
    }, 5000);
}

// Add CSS for edit car page
const editCarStyles = `
    .edit-car-section {
        padding: 120px 0 60px;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        min-height: 100vh;
    }
    
    .edit-car-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding: 2rem;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .header-content h1 {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .header-content p {
        color: #6b7280;
        font-size: 1.1rem;
    }
    
    .progress-steps {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3rem;
        padding: 2rem;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        position: relative;
    }
    
    .step:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 25px;
        right: -50%;
        width: 100%;
        height: 2px;
        background: #e5e7eb;
        z-index: 1;
    }
    
    .step.completed:not(:last-child)::after {
        background: #10b981;
    }
    
    .step-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        font-size: 1.2rem;
        position: relative;
        z-index: 2;
        transition: all 0.3s ease;
    }
    
    .step.active .step-icon {
        background: #3b82f6;
        color: white;
    }
    
    .step.completed .step-icon {
        background: #10b981;
        color: white;
    }
    
    .step span {
        font-size: 0.9rem;
        font-weight: 600;
        color: #6b7280;
        text-align: center;
    }
    
    .step.active span {
        color: #3b82f6;
    }
    
    .step.completed span {
        color: #10b981;
    }
    
    .edit-car-form {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .form-section {
        display: none;
    }
    
    .form-section.active {
        display: block;
    }
    
    .section-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .section-header h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
    
    .section-header p {
        color: #6b7280;
        font-size: 1rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .field-icon {
        color: #667eea;
        font-size: 1rem;
        width: 20px;
        text-align: center;
    }
    
    .input-wrapper {
        position: relative;
        background: #f9fafb;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        transition: all 0.3s ease;
        overflow: hidden;
    }
    
    .input-wrapper:focus-within {
        border-color: #3b82f6;
        background: white;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .input-wrapper input,
    .input-wrapper select,
    .input-wrapper textarea {
        width: 100%;
        border: none;
        background: transparent;
        padding: 1rem;
        font-size: 1rem;
        color: #1f2937;
        outline: none;
        font-family: inherit;
    }
    
    .input-wrapper select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
        background-position: left 1rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-left: 3rem;
    }
    
    .input-suffix {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #6b7280;
        font-size: 0.9rem;
        font-weight: 500;
        pointer-events: none;
        z-index: 1;
    }
    
    .input-wrapper input[type="number"] {
        padding-left: 3rem;
    }
    
    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-weight: 500;
        color: #374151;
    }
    
    .checkbox-label input[type="checkbox"] {
        display: none;
    }
    
    .checkmark {
        width: 20px;
        height: 20px;
        border: 2px solid #d1d5db;
        border-radius: 4px;
        position: relative;
        transition: all 0.3s ease;
    }
    
    .checkbox-label input[type="checkbox"]:checked + .checkmark {
        background: #3b82f6;
        border-color: #3b82f6;
    }
    
    .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 0.8rem;
        font-weight: bold;
    }
    
    .delivery-fields {
        margin-top: 1rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
    }
    
    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .feature-checkbox {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .feature-checkbox:hover {
        background: #f1f5f9;
        border-color: #3b82f6;
    }
    
    .feature-checkbox input[type="checkbox"] {
        display: none;
    }
    
    .feature-checkbox input[type="checkbox"]:checked + .checkmark {
        background: #3b82f6;
        border-color: #3b82f6;
    }
    
    .feature-checkbox i {
        color: #6b7280;
        font-size: 1rem;
    }
    
    .feature-checkbox input[type="checkbox"]:checked ~ i {
        color: #3b82f6;
    }
    
    .message {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    }
    
    .message-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
    }
    
    .message-success .message-content {
        background: #10b981;
    }
    
    .message-error .message-content {
        background: #ef4444;
    }
    
    .message-info .message-content {
        background: #3b82f6;
    }
    
    .message button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-weight: bold;
        margin-left: auto;
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
    
    @media (max-width: 768px) {
        .edit-car-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }
        
        .progress-steps {
            flex-direction: column;
            gap: 1rem;
        }
        
        .step:not(:last-child)::after {
            display: none;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .features-grid {
            grid-template-columns: 1fr;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = editCarStyles;
document.head.appendChild(styleSheet);
