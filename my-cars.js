// My Cars page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuth();
    
    // Load cars
    loadCars();
    
    // Initialize page
    initializePage();
    
    // Update notification badge
    updateNotificationBadge();
});

// Check authentication
function checkAuth() {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
        window.location.href = 'index.html';
        return;
    }
}

// Load cars from localStorage
async function loadCars() {
    try {
        // Get cars from localStorage
        const carsData = JSON.parse(localStorage.getItem('mockCars') || '[]');
        const carsGrid = document.getElementById('carsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (carsData.length === 0) {
            carsGrid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        carsGrid.style.display = 'grid';
        emptyState.style.display = 'none';
        
        // Clear existing cars
        carsGrid.innerHTML = '';
        
        // Add cars to grid
        carsData.forEach(car => {
            const carCard = createCarCard(car);
            carsGrid.appendChild(carCard);
        });
    } catch (error) {
        console.error('Error loading cars:', error);
        showMessage('حدث خطأ في تحميل السيارات', 'error');
    }
}

// Create car card element
function createCarCard(car) {
    const carCard = document.createElement('div');
    carCard.className = 'car-card';
    carCard.dataset.carId = car.id;
    
    const statusClass = car.status === 'active' ? 'active' : 'inactive';
    const statusText = car.status === 'active' ? 'متاح' : 'غير متاح';
    
    carCard.innerHTML = `
        <div class="car-image">
            <div class="car-placeholder">
                <i class="fas fa-car"></i>
            </div>
            <div class="car-status ${statusClass}">
                <span>${statusText}</span>
            </div>
        </div>
        
        <div class="car-info">
            <h3>${car.brand} ${car.model}</h3>
            <p class="car-year">${car.year} • ${car.color} • ${car.transmission}</p>
            <p class="car-location">
                <i class="fas fa-map-marker-alt"></i>
                ${car.location}
            </p>
            
            <div class="car-details">
                <div class="detail-item">
                    <i class="fas fa-coins"></i>
                    <span>${car.dailyRate} ريال/يوم</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>${car.mileage} كم</span>
                </div>
            </div>
            
            <div class="car-features">
                ${car.features && car.features.length > 0 ? 
                    car.features.slice(0, 3).map(feature => 
                        `<span class="feature-tag">${getFeatureName(feature)}</span>`
                    ).join('') : 
                    '<span class="no-features">لا توجد مميزات</span>'
                }
            </div>
        </div>
        
        <div class="car-actions">
            <button class="btn btn-outline btn-sm" onclick="editCar(${car.id})">
                <i class="fas fa-edit"></i>
                تعديل
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteCar(${car.id})">
                <i class="fas fa-trash"></i>
                حذف
            </button>
            <button class="btn btn-primary btn-sm" onclick="toggleCarStatus(${car.id})">
                <i class="fas fa-${car.status === 'active' ? 'pause' : 'play'}"></i>
                ${car.status === 'active' ? 'إيقاف' : 'تفعيل'}
            </button>
        </div>
    `;
    
    return carCard;
}

// Get feature name in Arabic
function getFeatureName(feature) {
    const featureNames = {
        'ac': 'مكيف',
        'bluetooth': 'بلوتوث',
        'gps': 'ملاحة',
        'backup_camera': 'كاميرا خلفية',
        'cruise_control': 'تحكم في السرعة',
        'leather_seats': 'مقاعد جلدية',
        'sunroof': 'سقف قابل للفتح',
        'child_seat': 'مقعد أطفال'
    };
    
    return featureNames[feature] || feature;
}

// Edit car function
function editCar(carId) {
    // Redirect to edit car page with car ID
    window.location.href = `edit-car.html?id=${carId}`;
}

// Delete car function
async function deleteCar(carId) {
    if (confirm('هل أنت متأكد من حذف هذه السيارة؟')) {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Get cars from localStorage
            const carsData = JSON.parse(localStorage.getItem('mockCars') || '[]');
            
            // Remove car from array
            const updatedCars = carsData.filter(car => car.id !== carId);
            
            // Save back to localStorage
            localStorage.setItem('mockCars', JSON.stringify(updatedCars));
            
            // Reload cars
            loadCars();
            showMessage('تم حذف السيارة بنجاح', 'success');
        } catch (error) {
            console.error('Delete car error:', error);
            showMessage('حدث خطأ أثناء حذف السيارة', 'error');
        }
    }
}

// Toggle car status function
async function toggleCarStatus(carId) {
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get cars from localStorage
        const carsData = JSON.parse(localStorage.getItem('mockCars') || '[]');
        
        // Find and update car status
        const carIndex = carsData.findIndex(car => car.id === carId);
        if (carIndex !== -1) {
            const currentStatus = carsData[carIndex].status;
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            
            carsData[carIndex].status = newStatus;
            
            // Save back to localStorage
            localStorage.setItem('mockCars', JSON.stringify(carsData));
            
            // Reload cars
            loadCars();
            
            // Show success message
            const statusText = newStatus === 'active' ? 'تم تفعيل السيارة' : 'تم إيقاف السيارة';
            showMessage(statusText, 'success');
        } else {
            showMessage('لم يتم العثور على السيارة', 'error');
        }
    } catch (error) {
        console.error('Toggle car status error:', error);
        showMessage('حدث خطأ أثناء تحديث حالة السيارة', 'error');
    }
}

// Initialize page
function initializePage() {
    // Add click event listeners
    const addCarButton = document.querySelector('.add-car-button .btn');
    addCarButton.addEventListener('click', function(e) {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Logout function
function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
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

// Add CSS for my cars page
const myCarsStyles = `
    .my-cars-section {
        padding: 120px 0 60px;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        min-height: 100vh;
    }
    
    .my-cars-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .my-cars-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 1rem;
    }
    
    .my-cars-header p {
        font-size: 1.1rem;
        color: #6b7280;
        max-width: 600px;
        margin: 0 auto;
    }
    
    .add-car-button {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .cars-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }
    
    .car-card {
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }
    
    .car-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }
    
    .car-image {
        position: relative;
        height: 200px;
        background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .car-placeholder {
        font-size: 3rem;
        color: #9ca3af;
    }
    
    .car-status {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .car-status.active {
        background: #10b981;
        color: white;
    }
    
    .car-status.inactive {
        background: #6b7280;
        color: white;
    }
    
    .car-info {
        padding: 1.5rem;
    }
    
    .car-info h3 {
        font-size: 1.3rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }
    
    .car-year {
        color: #6b7280;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }
    
    .car-location {
        color: #6b7280;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .car-details {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .detail-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #374151;
        font-size: 0.9rem;
    }
    
    .detail-item i {
        color: #3b82f6;
    }
    
    .car-features {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }
    
    .feature-tag {
        background: #eff6ff;
        color: #1e40af;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .no-features {
        color: #9ca3af;
        font-size: 0.9rem;
        font-style: italic;
    }
    
    .car-actions {
        padding: 1.5rem;
        border-top: 1px solid #f3f4f6;
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
    
    .btn-danger {
        background: #ef4444;
        color: white;
        border: none;
    }
    
    .btn-danger:hover {
        background: #dc2626;
    }
    
    .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .empty-icon {
        font-size: 4rem;
        color: #9ca3af;
        margin-bottom: 1.5rem;
    }
    
    .empty-state h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1rem;
    }
    
    .empty-state p {
        color: #6b7280;
        margin-bottom: 2rem;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @media (max-width: 768px) {
        .my-cars-header h1 {
            font-size: 2rem;
        }
        
        .cars-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        
        .car-actions {
            flex-direction: column;
        }
        
        .car-actions .btn {
            width: 100%;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = myCarsStyles;
document.head.appendChild(styleSheet);

// Update notification badge
async function updateNotificationBadge() {
    try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('/api/notifications/unread-count', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            const badge = document.getElementById('notificationBadge');
            
            if (result.count > 0) {
                badge.textContent = result.count;
                badge.style.display = 'inline';
            } else {
                badge.style.display = 'none';
            }
        }
        
    } catch (error) {
        console.error('Error updating notification badge:', error);
        // In test mode, update badge from localStorage
        updateMockNotificationBadge();
    }
}

// Update mock notification badge for testing
function updateMockNotificationBadge() {
    try {
        const mockNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const currentUserId = userData.id || 'test-user';
        
        // Filter unread notifications for current user
        const unreadCount = mockNotifications.filter(n => 
            n.user_id === currentUserId && !n.is_read
        ).length;
        
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'inline';
                console.log('🔔 Updated mock notification badge:', unreadCount);
            } else {
                badge.style.display = 'none';
            }
        }
        
    } catch (error) {
        console.error('❌ Error updating mock notification badge:', error);
    }
}
