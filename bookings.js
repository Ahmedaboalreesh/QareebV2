// Bookings management functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const userToken = localStorage.getItem('userToken');
    const userType = localStorage.getItem('userType');
    
    if (!userToken) {
        window.location.href = 'login.html';
        return;
    }
    
    if (userType !== 'owner') {
        // Redirect to appropriate dashboard
        if (userType === 'renter') {
            window.location.href = 'renter-dashboard.html';
        } else {
            window.location.href = 'login.html';
        }
        return;
    }

    // Create sample data if not exists
    createSampleData();
    
    // Load bookings
    loadBookings();
    
    // Setup filter tabs
    setupFilterTabs();
    
    // Update notification badge
    updateNotificationBadge();
});

// Create sample data if not exists
function createSampleData() {
    // Create sample booking photos for testing
    createSampleBookingPhotos();
    try {
        // Check if sample cars exist
        const existingCars = JSON.parse(localStorage.getItem('mockCars') || '[]');
        if (existingCars.length === 0) {
            const sampleCars = [
                {
                    id: 1,
                    brand: 'تويوتا',
                    model: 'كامري',
                    year: '2023',
                    transmission: 'أوتوماتيك',
                    fuel_type: 'بنزين',
                    mileage: '15000',
                    location: 'الرياض',
                    description: 'سيارة تويوتا كامري 2023 بحالة ممتازة، مكيفة بالكامل ومريحة للرحلات الطويلة',
                    features: ['ac', 'bluetooth', 'gps', 'backup_camera'],
                    daily_rate: 200,
                    deposit: 1000,
                    delivery_service: true,
                    delivery_fee: 50,
                    delivery_note: 'توصيل مجاني داخل الرياض'
                },
                {
                    id: 2,
                    brand: 'مرسيدس',
                    model: 'C-Class',
                    year: '2022',
                    transmission: 'أوتوماتيك',
                    fuel_type: 'بنزين',
                    mileage: '25000',
                    location: 'جدة',
                    description: 'مرسيدس C-Class فاخرة ومريحة، مثالية للرحلات التجارية',
                    features: ['ac', 'bluetooth', 'gps', 'leather_seats', 'sunroof'],
                    daily_rate: 350,
                    deposit: 1500,
                    delivery_service: false
                }
            ];
            localStorage.setItem('mockCars', JSON.stringify(sampleCars));
            console.log('✅ Sample cars created');
        }

        // Check if sample bookings exist
        const existingBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        if (existingBookings.length === 0) {
            const sampleBookings = [
                {
                    id: 1,
                    car_id: 1,
                    renter_name: 'أحمد محمد',
                    renter_email: 'ahmed@example.com',
                    renter_phone: '0501234567',
                    start_date: '2024-02-01',
                    end_date: '2024-02-03',
                    total_amount: 400,
                    deposit_amount: 1000,
                    status: 'pending',
                    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 2,
                    car_id: 2,
                    renter_name: 'فاطمة علي',
                    renter_email: 'fatima@example.com',
                    renter_phone: '0509876543',
                    start_date: '2024-02-05',
                    end_date: '2024-02-07',
                    total_amount: 700,
                    deposit_amount: 1500,
                    status: 'approved',
                    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
                }
            ];
            localStorage.setItem('mockBookings', JSON.stringify(sampleBookings));
            console.log('✅ Sample bookings created');
        }
    } catch (error) {
        console.error('Error creating sample data:', error);
    }
}

// Load bookings
async function loadBookings() {
    try {
        // Get bookings from localStorage
        const bookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        
        // Update stats
        updateBookingStats(bookings);
        
        // Display bookings
        displayBookings(bookings);
        
    } catch (error) {
        console.error('Error loading bookings:', error);
        showMessage('حدث خطأ في تحميل الحجوزات', 'error');
    }
}

// Update booking statistics
function updateBookingStats(bookings) {
    const stats = {
        pending: 0,
        approved: 0,
        rejected: 0,
        completed: 0
    };
    
    bookings.forEach(booking => {
        switch (booking.status) {
            case 'pending':
                stats.pending++;
                break;
            case 'approved':
                stats.approved++;
                break;
            case 'rejected':
                stats.rejected++;
                break;
            case 'completed':
                stats.completed++;
                break;
        }
    });
    
    document.getElementById('pendingCount').textContent = stats.pending;
    document.getElementById('approvedCount').textContent = stats.approved;
    document.getElementById('rejectedCount').textContent = stats.rejected;
    document.getElementById('completedCount').textContent = stats.completed;
}

// Display bookings
function displayBookings(bookings, filterStatus = 'all') {
    const bookingsList = document.getElementById('bookingsList');
    const emptyState = document.getElementById('emptyState');
    
    // Filter bookings if needed
    let filteredBookings = bookings;
    if (filterStatus !== 'all') {
        filteredBookings = bookings.filter(booking => booking.status === filterStatus);
    }
    
    if (filteredBookings.length === 0) {
        bookingsList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    bookingsList.style.display = 'block';
    emptyState.style.display = 'none';
    
    // Clear existing bookings
    bookingsList.innerHTML = '';
    
    // Add bookings to list
    filteredBookings.forEach(booking => {
        const bookingCard = createBookingCard(booking);
        bookingsList.appendChild(bookingCard);
    });
}

// Create booking card
function createBookingCard(booking) {
    const bookingCard = document.createElement('div');
    bookingCard.className = 'booking-card';
    
    const statusClass = getStatusClass(booking.status);
    const statusText = getStatusText(booking.status);
    const statusIcon = getStatusIcon(booking.status);
    
    // Get car data from mockCars using car_id
    const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
    const car = cars.find(c => c.id == booking.car_id) || {};
    
    // Safe data access with fallbacks
    const carBrand = car.brand || booking.brand || booking.car_brand || 'غير محدد';
    const carModel = car.model || booking.model || booking.car_model || 'غير محدد';
    const carYear = car.year || booking.year || booking.car_year || 'غير محدد';
    const renterName = booking.renter_name || booking.user_name || 'غير محدد';
    const renterPhone = booking.renter_phone || booking.user_phone || 'غير محدد';
    const renterEmail = booking.renter_email || booking.user_email || 'غير محدد';
    const startDate = booking.start_date || booking.rental_start || 'غير محدد';
    const endDate = booking.end_date || booking.rental_end || 'غير محدد';
    const totalAmount = booking.total_amount || booking.amount || '0';
    const createdAt = booking.created_at || booking.created_date || new Date().toISOString();
    
    bookingCard.innerHTML = `
        <div class="booking-header">
            <div class="booking-info">
                <h3>${carBrand} ${carModel} ${carYear}</h3>
                <div class="booking-meta">
                    <span><i class="fas fa-user"></i> ${renterName}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(createdAt)}</span>
                </div>
            </div>
            <div class="booking-status ${statusClass}">
                <i class="${statusIcon}"></i>
                <span>${statusText}</span>
            </div>
        </div>
        
        <div class="booking-details">
            <div class="detail-row">
                <div class="detail-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>من ${formatDate(startDate)} إلى ${formatDate(endDate)}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>${totalAmount} ريال</span>
                </div>
            </div>
            
            <div class="detail-row">
                <div class="detail-item">
                    <i class="fas fa-phone"></i>
                    <span>${renterPhone}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-envelope"></i>
                    <span>${renterEmail}</span>
                </div>
            </div>
        </div>
        
        <div class="booking-actions">
            <button class="btn btn-outline" onclick="viewBookingDetails(${booking.id})">
                <i class="fas fa-eye"></i>
                عرض التفاصيل
            </button>
            
            ${booking.status === 'pending' ? `
                <button class="btn btn-success" onclick="updateBookingStatus(${booking.id}, 'approved')">
                    <i class="fas fa-check"></i>
                    موافقة
                </button>
                <button class="btn btn-danger" onclick="updateBookingStatus(${booking.id}, 'rejected')">
                    <i class="fas fa-times"></i>
                    رفض
                </button>
            ` : ''}
            
            ${booking.status === 'approved' ? `
                <button class="btn btn-primary" onclick="updateBookingStatus(${booking.id}, 'completed')">
                    <i class="fas fa-calendar-check"></i>
                    إكمال الحجز
                </button>
            ` : ''}
        </div>
    `;
    
    return bookingCard;
}

// Get status class
function getStatusClass(status) {
    switch (status) {
        case 'pending': return 'status-pending';
        case 'approved': return 'status-approved';
        case 'rejected': return 'status-rejected';
        case 'completed': return 'status-completed';
        default: return 'status-pending';
    }
}

// Get status text
function getStatusText(status) {
    switch (status) {
        case 'pending': return 'في الانتظار';
        case 'approved': return 'موافق عليها';
        case 'rejected': return 'مرفوضة';
        case 'completed': return 'مكتملة';
        default: return 'غير محدد';
    }
}

// Get status icon
function getStatusIcon(status) {
    switch (status) {
        case 'pending': return 'fas fa-clock';
        case 'approved': return 'fas fa-check-circle';
        case 'rejected': return 'fas fa-times-circle';
        case 'completed': return 'fas fa-calendar-check';
        default: return 'fas fa-question-circle';
    }
}

// Setup filter tabs
function setupFilterTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter bookings
            const status = this.dataset.status;
            filterBookings(status);
        });
    });
}

// Filter bookings
async function filterBookings(status) {
    try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('/api/bookings/owner', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const bookings = data.bookings;
            
            displayBookings(bookings, status);
        }
    } catch (error) {
        console.error('Error filtering bookings:', error);
    }
}

// View booking details
async function viewBookingDetails(bookingId) {
    try {
        // Get bookings from localStorage
        const bookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        
        // Find the booking by ID
        const booking = bookings.find(b => b.id === bookingId);
        
        if (booking) {
            showBookingModal(booking);
        } else {
            showMessage('لم يتم العثور على الحجز', 'error');
        }
    } catch (error) {
        console.error('Error loading booking details:', error);
        showMessage('حدث خطأ في تحميل تفاصيل الحجز', 'error');
    }
}

// Show booking modal
function showBookingModal(booking) {
    const modal = document.getElementById('bookingModal');
    const modalBody = document.getElementById('modalBody');
    
    // Get car details from mockCars using car_id
    const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
    const carDetails = cars.find(car => car.id == booking.car_id) || {};
    
    // Safe data access with fallbacks
    const carBrand = carDetails.brand || booking.brand || booking.car_brand || 'غير محدد';
    const carModel = carDetails.model || booking.model || booking.car_model || 'غير محدد';
    const carYear = carDetails.year || booking.year || booking.car_year || 'غير محدد';
    const dailyRate = booking.daily_rate || booking.dailyRate || 'غير محدد';
    const renterName = booking.renter_name || booking.user_name || 'غير محدد';
    const renterEmail = booking.renter_email || booking.user_email || 'غير محدد';
    const renterPhone = booking.renter_phone || booking.user_phone || 'غير محدد';
    const startDate = booking.start_date || booking.rental_start || 'غير محدد';
    const endDate = booking.end_date || booking.rental_end || 'غير محدد';
    const totalAmount = booking.total_amount || booking.amount || '0';
    const depositAmount = booking.deposit_amount || booking.deposit || '0';
    const pickupLocation = booking.pickup_location || booking.pickupLocation || '';
    const returnLocation = booking.return_location || booking.returnLocation || '';
    const renterNotes = booking.renter_notes || booking.notes || '';
    const ownerNotes = booking.owner_notes || booking.ownerNotes || '';
    
    // Car details from add-car form
    const carTransmission = carDetails?.transmission || 'غير محدد';
    const carFuelType = carDetails?.fuel_type || 'غير محدد';
    const carMileage = carDetails?.mileage || 'غير محدد';
    const carLocation = carDetails?.location || 'غير محدد';
    const carDescription = carDetails?.description || 'غير محدد';
    const carFeatures = carDetails?.features || [];
    const carPhotos = carDetails?.photos || [];
    const carDeliveryService = carDetails?.delivery_service || false;
    const carDeliveryFee = carDetails?.delivery_fee || null;
    const carDeliveryNote = carDetails?.delivery_note || null;
    
    modalBody.innerHTML = `
        <div class="booking-details-modal">
            <div class="detail-section">
                <h3>معلومات السيارة الأساسية</h3>
                <p><strong>الماركة:</strong> ${carBrand}</p>
                <p><strong>الموديل:</strong> ${carModel}</p>
                <p><strong>السنة:</strong> ${carYear}</p>
                <p><strong>ناقل الحركة:</strong> ${carTransmission}</p>
                <p><strong>نوع الوقود:</strong> ${carFuelType}</p>
                <p><strong>عدد الكيلومترات:</strong> ${carMileage} كم</p>
                <p><strong>الموقع:</strong> ${carLocation}</p>
                <p><strong>السعر اليومي:</strong> ${dailyRate} ريال</p>
            </div>
            
            ${carDescription && carDescription !== 'غير محدد' ? `
                <div class="detail-section">
                    <h3>وصف السيارة</h3>
                    <p>${carDescription}</p>
                </div>
            ` : ''}
            
            ${carFeatures.length > 0 ? `
                <div class="detail-section">
                    <h3>مميزات السيارة</h3>
                    <div class="features-list">
                        ${carFeatures.map(feature => {
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
                            return `<span class="feature-tag">${featureNames[feature] || feature}</span>`;
                        }).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${carPhotos.length > 0 ? `
                <div class="detail-section">
                    <h3>صور السيارة</h3>
                    <div class="car-photos-grid">
                        ${carPhotos.slice(0, 3).map(photo => `
                            <div class="car-photo">
                                <img src="${photo.preview}" alt="صورة السيارة" onclick="openPhotoModal('${photo.preview}')">
                            </div>
                        `).join('')}
                        ${carPhotos.length > 3 ? `<div class="more-photos">+${carPhotos.length - 3} صور أخرى</div>` : ''}
                    </div>
                </div>
            ` : ''}
            
            ${carDeliveryService ? `
                <div class="detail-section">
                    <h3>خدمة التوصيل</h3>
                    <p><strong>متاحة:</strong> نعم</p>
                    ${carDeliveryFee ? `<p><strong>رسوم التوصيل:</strong> ${carDeliveryFee} ريال</p>` : ''}
                    ${carDeliveryNote ? `<p><strong>ملاحظات التوصيل:</strong> ${carDeliveryNote}</p>` : ''}
                </div>
            ` : ''}
            
            <div class="detail-section">
                <h3>معلومات المستأجر</h3>
                <p><strong>الاسم:</strong> ${renterName}</p>
                <p><strong>البريد الإلكتروني:</strong> ${renterEmail}</p>
                <p><strong>رقم الهاتف:</strong> ${renterPhone}</p>
            </div>
            
            <div class="detail-section">
                <h3>تفاصيل الحجز</h3>
                <p><strong>تاريخ البداية:</strong> ${formatDate(startDate)}</p>
                <p><strong>تاريخ النهاية:</strong> ${formatDate(endDate)}</p>
                <p><strong>السعر الإجمالي:</strong> ${totalAmount} ريال</p>
                <p><strong>الوديعة:</strong> ${depositAmount} ريال</p>
                <p><strong>الحالة:</strong> <span class="${getStatusClass(booking.status)}">${getStatusText(booking.status)}</span></p>
            </div>
            
            ${pickupLocation ? `
                <div class="detail-section">
                    <h3>مواقع الحجز</h3>
                    <p><strong>موقع الاستلام:</strong> ${pickupLocation}</p>
                    ${returnLocation ? `<p><strong>موقع الإرجاع:</strong> ${returnLocation}</p>` : ''}
                </div>
            ` : ''}
            
            ${renterNotes ? `
                <div class="detail-section">
                    <h3>ملاحظات المستأجر</h3>
                    <p>${renterNotes}</p>
                </div>
            ` : ''}
            
            ${ownerNotes ? `
                <div class="detail-section">
                    <h3>ملاحظات المالك</h3>
                    <p>${ownerNotes}</p>
                </div>
            ` : ''}
            
            ${(() => {
                const photos = getBookingPhotos(booking.id);
                console.log('📸 Photos for booking', booking.id, ':', photos);
                return photos.length > 0 ? `
                    <div class="detail-section">
                        <h3>صور السيارة من المستأجر (${photos.length} صورة)</h3>
                        <div class="renter-photos-grid">
                            ${photos.map(photo => `
                                <div class="renter-photo">
                                    <img src="${photo.download_url || photo.preview || photo.url}" alt="صورة من المستأجر" onclick="openPhotoModal('${photo.download_url || photo.preview || photo.url}')">
                                    <div class="photo-info">
                                        <small>تم الرفع: ${formatDate(photo.created_at || photo.uploaded_at)}</small>
                                        ${photo.description ? `<br><small>${photo.description}</small>` : ''}
                                        ${photo.photo_type ? `<br><small>النوع: ${getPhotoTypeText(photo.photo_type)}</small>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : `
                    <div class="detail-section">
                        <h3>صور السيارة من المستأجر</h3>
                        <p style="text-align: center; color: #666; padding: 2rem;">
                            <i class="fas fa-camera" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                            لا توجد صور مرفوعة من المستأجر بعد
                        </p>
                        <div style="text-align: center; margin-top: 1rem;">
                            <button class="btn btn-info" onclick="createPhotosForBooking(${booking.id})">
                                <i class="fas fa-plus"></i>
                                إنشاء صور تجريبية لهذا الحجز
                            </button>
                            <button class="btn btn-primary" onclick="openUploadPhotosPage(${booking.id})" style="margin-right: 10px;">
                                <i class="fas fa-upload"></i>
                                رفع صور حقيقية
                            </button>
                        </div>
                    </div>
                `;
            })()}
        </div>
    `;
    
    modal.style.display = 'block';
}

// Get photo type text
function getPhotoTypeText(photoType) {
    const photoTypes = {
        'general': 'عامة',
        'exterior': 'خارجية',
        'interior': 'داخلية',
        'damage': 'أضرار',
        'condition': 'حالة السيارة',
        'before': 'قبل الاستئجار',
        'after': 'بعد الاستئجار'
    };
    return photoTypes[photoType] || photoType;
}

// Get booking photos from localStorage
function getBookingPhotos(bookingId) {
    try {
        const mockPhotos = JSON.parse(localStorage.getItem('mockBookingPhotos') || '[]');
        const photos = mockPhotos.filter(photo => photo.booking_id == bookingId);
        console.log(`📸 Found ${photos.length} photos for booking ${bookingId}:`, photos);
        return photos;
    } catch (error) {
        console.error('Error getting booking photos:', error);
        return [];
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
}

// Open photo modal
function openPhotoModal(photoSrc) {
    // Create photo modal if it doesn't exist
    let photoModal = document.getElementById('photoModal');
    if (!photoModal) {
        photoModal = document.createElement('div');
        photoModal.id = 'photoModal';
        photoModal.className = 'photo-modal';
        photoModal.innerHTML = `
            <span class="photo-modal-close" onclick="closePhotoModal()">&times;</span>
            <div class="photo-modal-content">
                <img id="photoModalImg" src="" alt="صورة السيارة">
            </div>
        `;
        document.body.appendChild(photoModal);
    }
    
    // Set image source and show modal
    document.getElementById('photoModalImg').src = photoSrc;
    photoModal.style.display = 'block';
    
    // Close modal when clicking outside
    photoModal.addEventListener('click', function(e) {
        if (e.target === photoModal) {
            closePhotoModal();
        }
    });
}

// Close photo modal
function closePhotoModal() {
    const photoModal = document.getElementById('photoModal');
    if (photoModal) {
        photoModal.style.display = 'none';
    }
}

// Update booking status
async function updateBookingStatus(bookingId, status) {
    const actionText = status === 'approved' ? 'الموافقة على' : status === 'rejected' ? 'رفض' : 'إكمال';
    
    if (!confirm(`هل أنت متأكد من ${actionText} هذا الحجز؟`)) {
        return;
    }
    
    let ownerNotes = '';
    if (status === 'rejected') {
        ownerNotes = prompt('يرجى إدخال سبب الرفض (اختياري):') || '';
    }
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get bookings from localStorage
        const bookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        
        // Find and update booking
        const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
        if (bookingIndex !== -1) {
            const booking = bookings[bookingIndex];
            booking.status = status;
            if (ownerNotes) {
                booking.owner_notes = ownerNotes;
            }
            
            // Update car status based on booking status
            await updateCarStatusBasedOnBooking(booking.car_id, status);
            
            // Save back to localStorage
            localStorage.setItem('mockBookings', JSON.stringify(bookings));
            
            showMessage(`تم ${actionText} الحجز بنجاح`, 'success');
            
            // Reload bookings
            setTimeout(() => {
                loadBookings();
            }, 1000);
            
        } else {
            showMessage('لم يتم العثور على الحجز', 'error');
        }
    } catch (error) {
        console.error('Error updating booking status:', error);
        showMessage('حدث خطأ أثناء تحديث حالة الحجز', 'error');
    }
}

// Update car status based on booking status
async function updateCarStatusBasedOnBooking(carId, bookingStatus) {
    try {
        console.log(`🔄 Updating car ${carId} status based on booking status: ${bookingStatus}`);
        
        // Get cars from localStorage
        const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
        
        // Find the car
        const carIndex = cars.findIndex(car => car.id === carId);
        if (carIndex !== -1) {
            const car = cars[carIndex];
            
            // Update car status based on booking status
            switch (bookingStatus) {
                case 'approved':
                    // When booking is approved, car becomes unavailable
                    car.status = 'booked';
                    car.available = false;
                    console.log(`🚗 Car ${carId} marked as booked`);
                    break;
                    
                case 'completed':
                    // When booking is completed, car becomes available again
                    car.status = 'active';
                    car.available = true;
                    console.log(`🚗 Car ${carId} marked as active (available)`);
                    break;
                    
                case 'rejected':
                    // When booking is rejected, car becomes available again
                    car.status = 'active';
                    car.available = true;
                    console.log(`🚗 Car ${carId} marked as active (available)`);
                    break;
                    
                default:
                    // For other statuses, keep current status
                    console.log(`🚗 Car ${carId} status unchanged: ${car.status}`);
                    break;
            }
            
            // Save updated cars back to localStorage
            localStorage.setItem('mockCars', JSON.stringify(cars));
            console.log(`✅ Car status updated successfully`);
            
        } else {
            console.error(`❌ Car with ID ${carId} not found`);
        }
    } catch (error) {
        console.error('Error updating car status:', error);
        throw error;
    }
}

// Format date
function formatDate(dateString) {
    if (!dateString || dateString === 'غير محدد') {
        return 'غير محدد';
    }
    
    try {
        const date = new Date(dateString);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'غير محدد';
        }
        
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'غير محدد';
    }
}

// Show message function
function showMessage(message, type) {
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = `
        <div class="message-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(messageElement);
    
    // Show message
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 100);
    
    // Hide and remove message
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, 3000);
}

// Logout function
function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    localStorage.removeItem('rememberMe');
    
    window.location.href = 'index.html';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeModal();
    }
});

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

// Open upload photos page for specific booking
function openUploadPhotosPage(bookingId) {
    try {
        // Store current user data for upload page
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userType = localStorage.getItem('userType');
        
        if (userType !== 'renter') {
            showMessage('فقط المستأجر يمكنه رفع الصور', 'error');
            return;
        }
        
        // Navigate to upload photos page
        window.location.href = `upload-booking-photos.html?booking_id=${bookingId}`;
        
    } catch (error) {
        console.error('❌ Error opening upload photos page:', error);
        showMessage('حدث خطأ في فتح صفحة رفع الصور', 'error');
    }
}

// Create photos for specific booking
function createPhotosForBooking(bookingId) {
    try {
        const existingPhotos = JSON.parse(localStorage.getItem('mockBookingPhotos') || '[]');
        const nextPhotoId = existingPhotos.length > 0 ? Math.max(...existingPhotos.map(p => p.id)) + 1 : 1;
        
        const newPhotos = [
            {
                id: nextPhotoId,
                booking_id: bookingId,
                filename: `car_condition_${bookingId}.jpg`,
                preview: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A',
                uploaded_at: new Date().toISOString(),
                description: 'حالة السيارة عند الاستلام'
            },
            {
                id: nextPhotoId + 1,
                booking_id: bookingId,
                filename: `car_interior_${bookingId}.jpg`,
                preview: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A',
                uploaded_at: new Date().toISOString(),
                description: 'المقصورة الداخلية'
            },
            {
                id: nextPhotoId + 2,
                booking_id: bookingId,
                filename: `car_exterior_${bookingId}.jpg`,
                preview: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A',
                uploaded_at: new Date().toISOString(),
                description: 'الخارجية للسيارة'
            }
        ];
        
        existingPhotos.push(...newPhotos);
        localStorage.setItem('mockBookingPhotos', JSON.stringify(existingPhotos));
        
        console.log('✅ Created photos for booking', bookingId);
        showMessage('تم إنشاء صور تجريبية للحجز بنجاح', 'success');
        
        // Refresh the modal to show the new photos
        setTimeout(() => {
            viewBookingDetails(bookingId);
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error creating photos for booking:', error);
        showMessage('حدث خطأ في إنشاء الصور', 'error');
    }
}

// Debug function to check localStorage data
function debugLocalStorage() {
    console.log('🔍 Debugging localStorage data:');
    console.log('📋 Bookings:', JSON.parse(localStorage.getItem('mockBookings') || '[]'));
    console.log('📸 Photos:', JSON.parse(localStorage.getItem('mockBookingPhotos') || '[]'));
    console.log('🚗 Cars:', JSON.parse(localStorage.getItem('mockCars') || '[]'));
}

// Fix existing photos to include booking_id
function fixExistingPhotos() {
    try {
        const photos = JSON.parse(localStorage.getItem('mockBookingPhotos') || '[]');
        const bookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        
        let fixedCount = 0;
        const updatedPhotos = photos.map(photo => {
            if (!photo.booking_id && bookings.length > 0) {
                // Assign to first booking if no booking_id exists
                photo.booking_id = bookings[0].id;
                fixedCount++;
                console.log('🔧 Fixed photo:', photo.id, '-> booking_id:', photo.booking_id);
            }
            return photo;
        });
        
        if (fixedCount > 0) {
            localStorage.setItem('mockBookingPhotos', JSON.stringify(updatedPhotos));
            console.log(`✅ Fixed ${fixedCount} photos with booking_id`);
            showMessage(`تم إصلاح ${fixedCount} صورة بإضافة معرف الحجز`, 'success');
        } else {
            showMessage('جميع الصور تحتوي على معرف الحجز بالفعل', 'info');
        }
        
    } catch (error) {
        console.error('❌ Error fixing existing photos:', error);
        showMessage('حدث خطأ في إصلاح الصور', 'error');
    }
}

// Create sample booking photos for testing
function createSampleBookingPhotos() {
    try {
        // Get existing bookings to create photos for them
        const existingBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        const existingPhotos = JSON.parse(localStorage.getItem('mockBookingPhotos') || '[]');
        
        if (existingPhotos.length === 0 && existingBookings.length > 0) {
            const samplePhotos = [];
            let photoId = 1;
            
            // Create photos for each existing booking
            existingBookings.forEach((booking, index) => {
                const photosForBooking = [
                    {
                        id: photoId++,
                        booking_id: booking.id,
                        filename: `car_condition_${booking.id}.jpg`,
                        preview: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A',
                        uploaded_at: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
                        description: 'حالة السيارة عند الاستلام'
                    },
                    {
                        id: photoId++,
                        booking_id: booking.id,
                        filename: `car_interior_${booking.id}.jpg`,
                        preview: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A',
                        uploaded_at: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
                        description: 'المقصورة الداخلية'
                    }
                ];
                
                samplePhotos.push(...photosForBooking);
            });
            
            localStorage.setItem('mockBookingPhotos', JSON.stringify(samplePhotos));
            console.log('✅ Sample booking photos created for', existingBookings.length, 'bookings');
            showMessage(`تم إنشاء صور تجريبية لـ ${existingBookings.length} حجز بنجاح`, 'success');
        } else if (existingPhotos.length > 0) {
            showMessage('الصور التجريبية موجودة بالفعل', 'info');
        } else {
            showMessage('لا توجد حجوزات لإنشاء صور لها', 'info');
        }
    } catch (error) {
        console.error('❌ Error creating sample booking photos:', error);
        showMessage('حدث خطأ في إنشاء الصور التجريبية', 'error');
    }
}

