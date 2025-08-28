// Add Car page functionality
document.addEventListener('DOMContentLoaded', function() {
    const addCarForm = document.getElementById('addCarForm');
    const photoUploadArea = document.getElementById('photoUploadArea');
    const uploadBox = document.getElementById('uploadBox');
    const carPhotosInput = document.getElementById('carPhotos');
    const photoPreview = document.getElementById('photoPreview');
    
    let uploadedPhotos = [];
    const maxPhotos = 6;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    
    // Set minimum date for availability
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('availableFrom').min = today;
    document.getElementById('availableTo').min = today;
    
    // Update availableTo minimum date when availableFrom changes
    document.getElementById('availableFrom').addEventListener('change', function() {
        document.getElementById('availableTo').min = this.value;
        if (document.getElementById('availableTo').value && document.getElementById('availableTo').value < this.value) {
            document.getElementById('availableTo').value = this.value;
        }
    });
    
    // Photo upload functionality
    uploadBox.addEventListener('click', function() {
        carPhotosInput.click();
    });
    
    // Drag and drop functionality
    photoUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadBox.classList.add('drag-over');
    });
    
    photoUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadBox.classList.remove('drag-over');
    });
    
    photoUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadBox.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        handlePhotoFiles(files);
    });
    
    carPhotosInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        handlePhotoFiles(files);
    });
    
    function handlePhotoFiles(files) {
        files.forEach(file => {
            if (uploadedPhotos.length >= maxPhotos) {
                showMessage('الحد الأقصى للصور هو 6 صور', 'error');
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                showMessage('يرجى اختيار ملفات صور فقط', 'error');
                return;
            }
            
            if (file.size > maxFileSize) {
                showMessage('حجم الملف يجب أن يكون أقل من 5 ميجابايت', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoData = {
                    file: file,
                    preview: e.target.result,
                    id: Date.now() + Math.random()
                };
                
                uploadedPhotos.push(photoData);
                displayPhotoPreview(photoData);
                updateUploadBox();
            };
            reader.readAsDataURL(file);
        });
    }
    
    function displayPhotoPreview(photoData) {
        const photoElement = document.createElement('div');
        photoElement.className = 'photo-item';
        photoElement.dataset.photoId = photoData.id;
        
        photoElement.innerHTML = `
            <img src="${photoData.preview}" alt="صورة السيارة">
            <button type="button" class="remove-photo" onclick="removePhoto(${photoData.id})">
                <i class="fas fa-times"></i>
            </button>
            <div class="photo-overlay">
                <span>صورة ${uploadedPhotos.indexOf(photoData) + 1}</span>
            </div>
        `;
        
        photoPreview.appendChild(photoElement);
    }
    
    function updateUploadBox() {
        if (uploadedPhotos.length >= maxPhotos) {
            uploadBox.style.display = 'none';
        } else {
            uploadBox.style.display = 'flex';
            uploadBox.querySelector('p').textContent = `اضغط هنا أو اسحب الصور لإضافتها (${uploadedPhotos.length}/${maxPhotos})`;
        }
    }
    
    // Remove photo function (global scope for onclick)
    window.removePhoto = function(photoId) {
        uploadedPhotos = uploadedPhotos.filter(photo => photo.id !== photoId);
        const photoElement = document.querySelector(`[data-photo-id="${photoId}"]`);
        if (photoElement) {
            photoElement.remove();
        }
        updateUploadBox();
        
        // Update photo numbers
        const photoItems = document.querySelectorAll('.photo-item');
        photoItems.forEach((item, index) => {
            const overlay = item.querySelector('.photo-overlay span');
            if (overlay) {
                overlay.textContent = `صورة ${index + 1}`;
            }
        });
    };
    
    // Form validation
    function validateForm() {
        let isValid = true;
        const requiredFields = addCarForm.querySelectorAll('[required]');
        
        // Clear previous error states
        addCarForm.querySelectorAll('.input-group').forEach(group => {
            group.classList.remove('error');
        });
        
        // Validate required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.closest('.input-group').classList.add('error');
                isValid = false;
            }
        });
        
        // Validate photos
        if (uploadedPhotos.length === 0) {
            photoUploadArea.classList.add('error');
            isValid = false;
        } else {
            photoUploadArea.classList.remove('error');
        }
        
        // Validate dates
        const availableFrom = document.getElementById('availableFrom').value;
        const availableTo = document.getElementById('availableTo').value;
        
        if (availableFrom && availableTo && availableFrom > availableTo) {
            document.getElementById('availableTo').closest('.input-group').classList.add('error');
            isValid = false;
        }
        
        // Validate prices
        const dailyRate = document.getElementById('dailyRate').value;
        if (dailyRate && dailyRate < 50) {
            document.getElementById('dailyRate').closest('.input-group').classList.add('error');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Real-time validation
    addCarForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.closest('.input-group').classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        const inputGroup = field.closest('.input-group');
        
        if (field.hasAttribute('required') && !value) {
            inputGroup.classList.add('error');
            return;
        }
        
        // Specific validations
        switch(field.id) {
            case 'carModel':
                if (value.length < 2) {
                    inputGroup.classList.add('error');
                    return;
                }
                break;
                
            case 'mileage':
                if (value && (parseInt(value) < 0 || parseInt(value) > 1000000)) {
                    inputGroup.classList.add('error');
                    return;
                }
                break;
                
            case 'dailyRate':
                if (value && parseInt(value) < 50) {
                    inputGroup.classList.add('error');
                    return;
                }
                break;
                
            case 'deposit':
                if (value && parseInt(value) < 100) {
                    inputGroup.classList.add('error');
                    return;
                }
                break;
        }
        
        inputGroup.classList.remove('error');
    }
    
    // Form submission
    addCarForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show loading state
            const submitBtn = addCarForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إضافة السيارة...';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Collect form data
                const formData = new FormData(addCarForm);
                
                // Create mock car data
                const carData = {
                    id: Date.now(),
                    brand: formData.get('carBrand'),
                    model: formData.get('carModel'),
                    year: formData.get('carYear'),
                    daily_rate: parseFloat(formData.get('dailyRate')),
                    deposit: parseFloat(formData.get('deposit')),
                    location: formData.get('location'),
                    transmission: formData.get('transmission'),
                    fuel_type: formData.get('fuelType'),
                    mileage: parseInt(formData.get('mileage')),
                    description: formData.get('carDescription'),
                    features: [],
                    photos: uploadedPhotos.map(photo => ({
                        filename: photo.file.name,
                        preview: photo.preview
                    })),
                    // Delivery service data
                    delivery_service: formData.get('deliveryService') === 'on',
                    delivery_fee: formData.get('deliveryFee') ? parseFloat(formData.get('deliveryFee')) : null,
                    delivery_note: formData.get('deliveryNote') || null,
                    status: 'active',
                    created_at: new Date().toISOString()
                };
                
                // Add features
                addCarForm.querySelectorAll('input[name="features"]:checked').forEach(checkbox => {
                    carData.features.push(checkbox.value);
                });
                
                // Get existing cars from localStorage
                const existingCars = JSON.parse(localStorage.getItem('mockCars') || '[]');
                existingCars.push(carData);
                localStorage.setItem('mockCars', JSON.stringify(existingCars));
                
                // Success message
                showSuccessMessage();
                
                // Reset form
                addCarForm.reset();
                uploadedPhotos = [];
                photoPreview.innerHTML = '';
                updateUploadBox();
                
                // Clear draft
                localStorage.removeItem('carDraft');
                
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
                
            } catch (error) {
                console.error('Add car error:', error);
                showMessage('حدث خطأ أثناء إضافة السيارة', 'error');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } else {
            showMessage('يرجى تصحيح الأخطاء في النموذج', 'error');
        }
    });
    
    // Save draft functionality
    window.saveDraft = function() {
        const formData = new FormData(addCarForm);
        const draftData = {};
        
        // Collect form data
        for (let [key, value] of formData.entries()) {
            draftData[key] = value;
        }
        
        // Add photos info
        draftData.photos = uploadedPhotos.map(photo => ({
            name: photo.file.name,
            size: photo.file.size
        }));
        
        // Save to localStorage
        localStorage.setItem('carDraft', JSON.stringify(draftData));
        
        showMessage('تم حفظ المسودة بنجاح', 'success');
    };
    
    // Load draft if exists
    function loadDraft() {
        const draftData = localStorage.getItem('carDraft');
        if (draftData) {
            const draft = JSON.parse(draftData);
            
            // Fill form fields
            Object.keys(draft).forEach(key => {
                const field = addCarForm.querySelector(`[name="${key}"]`);
                if (field && key !== 'photos') {
                    if (field.type === 'checkbox') {
                        field.checked = draft[key] === 'on';
                        // Handle delivery service checkbox
                        if (key === 'deliveryService' && draft[key] === 'on') {
                            toggleDeliveryFee();
                        }
                    } else {
                        field.value = draft[key];
                    }
                }
            });
            
            showMessage('تم تحميل المسودة المحفوظة', 'info');
        }
    }
    
    // Success message
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-check-circle"></i>
                <h3>تم إضافة السيارة بنجاح!</h3>
                <p>سيتم توجيهك إلى صفحة سياراتك خلال لحظات...</p>
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
    
    // General message function
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
        
        // Add CSS for messages
        const style = document.createElement('style');
        style.textContent = `
            .message {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem;
                border-radius: 8px;
                z-index: 10000;
                max-width: 300px;
                animation: slideIn 0.3s ease-out;
            }
            
            .message-error {
                background: #ef4444;
                color: white;
            }
            
            .message-success {
                background: #10b981;
                color: white;
            }
            
            .message-info {
                background: #3b82f6;
                color: white;
            }
            
            .message .message-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .message i {
                font-size: 1.2rem;
            }
            
            .message button {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 0.5rem;
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
        `;
        document.head.appendChild(style);
    }
    
    // Delivery service toggle function
    window.toggleDeliveryFee = function() {
        const deliveryService = document.getElementById('deliveryService');
        const deliveryFeeGroup = document.getElementById('deliveryFeeGroup');
        const deliveryNoteGroup = document.getElementById('deliveryNoteGroup');
        
        if (deliveryService.checked) {
            deliveryFeeGroup.style.display = 'block';
            deliveryNoteGroup.style.display = 'block';
        } else {
            deliveryFeeGroup.style.display = 'none';
            deliveryNoteGroup.style.display = 'none';
            // Clear the fields when unchecked
            document.getElementById('deliveryFee').value = '';
            document.getElementById('deliveryNote').value = '';
        }
    };
    
    // Logout function
    window.logout = function() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            localStorage.removeItem('userToken');
            window.location.href = 'index.html';
        }
    };
    
    // Initialize page
    loadDraft();
    updateUploadBox();
});
