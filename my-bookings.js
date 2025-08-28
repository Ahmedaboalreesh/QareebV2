// My Bookings functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const userToken = localStorage.getItem('userToken');
    const userType = localStorage.getItem('userType');
    
    if (!userToken) {
        window.location.href = 'login.html';
        return;
    }
    
    if (userType !== 'renter') {
        // Redirect to appropriate dashboard
        if (userType === 'owner') {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'login.html';
        }
        return;
    }

    // Load bookings
    loadBookings();
    
    // Setup filter tabs
    setupFilterTabs();
    
    // Add refresh functionality
    setupRefreshButton();
    
    // Listen for storage changes to auto-refresh
    window.addEventListener('storage', function(e) {
        if (e.key === 'mockBookings') {
            console.log('🔄 Detected booking updates, refreshing...');
            loadBookings();
        }
    });
});

// Setup refresh button
function setupRefreshButton() {
    const refreshBtn = document.getElementById('refreshBookings');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('rotating');
            loadBookings();
            setTimeout(() => {
                this.classList.remove('rotating');
            }, 1000);
        });
    }
}

// Load bookings with mock data
async function loadBookings() {
    try {
        console.log('🔄 Loading bookings...');
        
        // Get mock bookings from localStorage
        let mockBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        
        // Get current user ID
        const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
        const currentUserId = currentUser.id || 1;
        
        console.log(`👤 Current user ID: ${currentUserId}`);
        console.log(`📊 Total bookings in storage: ${mockBookings.length}`);
        
        // Get cars data for fixing car names
        const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
        
        // Fix bookings without renter_id and fix car names
        let hasFixedBookings = false;
        mockBookings.forEach(booking => {
            // Fix renter_id
            if (!booking.renter_id) {
                booking.renter_id = currentUserId;
                hasFixedBookings = true;
            }
            
            // Fix car name if it's "سيارة غير محددة" or missing
            if (!booking.car_name || booking.car_name === 'سيارة غير محددة') {
                const car = cars.find(c => c.id == booking.car_id);
                if (car) {
                    booking.car_name = `${car.brand} ${car.model} ${car.year}`;
                    booking.car_brand = car.brand;
                    booking.car_model = car.model;
                    booking.car_year = car.year;
                    hasFixedBookings = true;
                } else if (booking.car_brand && booking.car_model && booking.car_year) {
                    // Use individual fields if available
                    booking.car_name = `${booking.car_brand} ${booking.car_model} ${booking.car_year}`;
                    hasFixedBookings = true;
                }
            }
        });
        
        // Save fixed bookings back to localStorage
        if (hasFixedBookings) {
            localStorage.setItem('mockBookings', JSON.stringify(mockBookings));
            console.log('🔧 Fixed bookings without renter_id and car names');
        }
        
        // Filter bookings for current user
        const userBookings = mockBookings.filter(booking => booking.renter_id === currentUserId);
        
        console.log(`📋 User bookings found: ${userBookings.length}`);
        userBookings.forEach(booking => {
            console.log(`  - Booking ${booking.id}: ${booking.car_name} (${booking.status})`);
        });
        
        // Add some sample bookings if none exist
        if (userBookings.length === 0) {
            console.log('📝 No bookings found, creating sample bookings...');
            const sampleBookings = [
                {
                    id: 1,
                    car_id: 1,
                    renter_id: currentUserId,
                    car_name: 'تويوتا كامري 2023',
                    car_brand: 'تويوتا',
                    car_model: 'كامري',
                    car_year: '2023',
                    start_date: '2024-01-15',
                    end_date: '2024-01-18',
                    total_amount: 450,
                    deposit_amount: 500,
                    status: 'pending',
                    pickup_location: 'مطار الملك خالد الدولي',
                    return_location: 'مطار الملك خالد الدولي',
                    renter_notes: 'أحتاج سيارة للتنقل في الرياض',
                    created_at: '2024-01-10T10:00:00Z',
                    owner_name: 'أحمد محمد',
                    owner_phone: '+966501234567'
                },
                {
                    id: 2,
                    car_id: 3,
                    renter_id: currentUserId,
                    car_name: 'مرسيدس C-Class 2023',
                    car_brand: 'مرسيدس',
                    car_model: 'C-Class',
                    car_year: '2023',
                    start_date: '2024-01-20',
                    end_date: '2024-01-25',
                    total_amount: 1500,
                    deposit_amount: 500,
                    status: 'approved',
                    pickup_location: 'فندق الشرق',
                    return_location: 'فندق الشرق',
                    renter_notes: 'رحلة عمل في الدمام',
                    created_at: '2024-01-12T14:30:00Z',
                    owner_name: 'فاطمة علي',
                    owner_phone: '+966507654321'
                },
                {
                    id: 3,
                    car_id: 5,
                    renter_id: currentUserId,
                    car_name: 'هيونداي سوناتا 2022',
                    car_brand: 'هيونداي',
                    car_model: 'سوناتا',
                    car_year: '2022',
                    start_date: '2024-02-01',
                    end_date: '2024-02-03',
                    total_amount: 300,
                    deposit_amount: 400,
                    status: 'completed',
                    pickup_location: 'مركز المدينة التجاري',
                    return_location: 'مركز المدينة التجاري',
                    renter_notes: 'رحلة عائلية قصيرة',
                    created_at: '2024-01-25T09:15:00Z',
                    owner_name: 'خالد عبدالله',
                    owner_phone: '+966509876543'
                }
            ];
            
            // Save all bookings (including other users)
            const allBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
            const updatedBookings = [...allBookings, ...sampleBookings];
            localStorage.setItem('mockBookings', JSON.stringify(updatedBookings));
            
            displayBookings(sampleBookings);
            updateStats(sampleBookings);
        } else {
            displayBookings(userBookings);
            updateStats(userBookings);
        }
        
        console.log('✅ Bookings loaded successfully');
        
    } catch (error) {
        console.error('Error loading bookings:', error);
        showMessage('حدث خطأ في تحميل الحجوزات', 'error');
    }
}

// Display bookings
function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    const emptyState = document.getElementById('emptyState');
    
    if (bookings.length === 0) {
        bookingsList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    bookingsList.style.display = 'block';
    emptyState.style.display = 'none';
    bookingsList.innerHTML = '';
    
    bookings.forEach(booking => {
        const bookingCard = createBookingCard(booking);
        bookingsList.appendChild(bookingCard);
    });
}

// Create booking card
function createBookingCard(booking) {
    const card = document.createElement('div');
    card.className = `booking-card ${booking.status}`;
    
    const statusText = {
        'pending': 'في انتظار الموافقة',
        'approved': 'تمت الموافقة',
        'rejected': 'مرفوضة',
        'completed': 'مكتملة'
    };
    
    const statusIcon = {
        'pending': 'fas fa-clock',
        'approved': 'fas fa-check-circle',
        'rejected': 'fas fa-times-circle',
        'completed': 'fas fa-calendar-check'
    };
    
    // Safe date formatting with fallbacks
    const startDate = booking.start_date ? new Date(booking.start_date).toLocaleDateString('ar-SA') : 'غير محدد';
    const endDate = booking.end_date ? new Date(booking.end_date).toLocaleDateString('ar-SA') : 'غير محدد';
    const createdDate = booking.created_at ? new Date(booking.created_at).toLocaleDateString('ar-SA') : 'غير محدد';
    
    // Safe data access with fallbacks - improved car name logic
    let carName = booking.car_name;
    if (!carName || carName === 'سيارة غير محددة') {
        if (booking.car_brand && booking.car_model && booking.car_year) {
            carName = `${booking.car_brand} ${booking.car_model} ${booking.car_year}`;
        } else if (booking.car_brand && booking.car_model) {
            carName = `${booking.car_brand} ${booking.car_model}`;
        } else {
            carName = 'سيارة غير محددة';
        }
    }
    const totalAmount = booking.total_amount || 0;
    const pickupLocation = booking.pickup_location || 'غير محدد';
    
    card.innerHTML = `
        <div class="booking-header">
            <div class="booking-info">
                <h3>${carName}</h3>
                <div class="booking-status ${booking.status}">
                    <i class="${statusIcon[booking.status] || 'fas fa-question'}"></i>
                    <span>${statusText[booking.status] || 'غير محدد'}</span>
                </div>
            </div>
            <div class="booking-actions">
                <button class="btn btn-outline" onclick="viewBookingDetails(${booking.id})">
                    <i class="fas fa-eye"></i>
                    عرض التفاصيل
                </button>
                ${booking.status === 'approved' ? `
                    <button class="btn btn-info" onclick="uploadPhotos(${booking.id})">
                        <i class="fas fa-camera"></i>
                        رفع صور
                    </button>
                ` : ''}
                ${booking.status === 'completed' ? `
                    <button class="btn btn-primary" onclick="addReview(${booking.id})">
                        <i class="fas fa-star"></i>
                        إضافة تقييم
                    </button>
                ` : ''}
            </div>
        </div>
        <div class="booking-details">
            <div class="detail-row">
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>من ${startDate} إلى ${endDate}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>${totalAmount} ريال</span>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${pickupLocation}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>تم الحجز في ${createdDate}</span>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Update statistics
function updateStats(bookings) {
    const stats = {
        pending: 0,
        approved: 0,
        rejected: 0,
        completed: 0
    };
    
    bookings.forEach(booking => {
        stats[booking.status]++;
    });
    
    document.getElementById('pendingCount').textContent = stats.pending;
    document.getElementById('approvedCount').textContent = stats.approved;
    document.getElementById('rejectedCount').textContent = stats.rejected;
    document.getElementById('completedCount').textContent = stats.completed;
}

// Setup filter tabs
function setupFilterTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter bookings
            const status = this.getAttribute('data-status');
            filterBookings(status);
        });
    });
}

// Filter bookings
function filterBookings(status) {
    const mockBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
    
    // Get current user ID
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const currentUserId = currentUser.id || 1;
    
    // Get cars data for fixing car names
    const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
    
    // Fix bookings without renter_id and fix car names
    let hasFixedBookings = false;
    mockBookings.forEach(booking => {
        // Fix renter_id
        if (!booking.renter_id) {
            booking.renter_id = currentUserId;
            hasFixedBookings = true;
        }
        
        // Fix car name if it's "سيارة غير محددة" or missing
        if (!booking.car_name || booking.car_name === 'سيارة غير محددة') {
            const car = cars.find(c => c.id == booking.car_id);
            if (car) {
                booking.car_name = `${car.brand} ${car.model} ${car.year}`;
                booking.car_brand = car.brand;
                booking.car_model = car.model;
                booking.car_year = car.year;
                hasFixedBookings = true;
            } else if (booking.car_brand && booking.car_model && booking.car_year) {
                // Use individual fields if available
                booking.car_name = `${booking.car_brand} ${booking.car_model} ${booking.car_year}`;
                hasFixedBookings = true;
            }
        }
    });
    
    // Save fixed bookings back to localStorage
    if (hasFixedBookings) {
        localStorage.setItem('mockBookings', JSON.stringify(mockBookings));
        console.log('🔧 Fixed bookings without renter_id and car names in filter');
    }
    
    // Filter bookings for current user first
    const userBookings = mockBookings.filter(booking => booking.renter_id === currentUserId);
    
    if (status === 'all') {
        displayBookings(userBookings);
        updateStats(userBookings);
    } else {
        const filteredBookings = userBookings.filter(booking => booking.status === status);
        displayBookings(filteredBookings);
        updateStats(userBookings); // Keep original stats for current user
    }
}

// View booking details
function viewBookingDetails(bookingId) {
    const mockBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
    
    // Get current user ID
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const currentUserId = currentUser.id || 1;
    
    // Find booking and ensure it belongs to current user
    const booking = mockBookings.find(b => b.id === bookingId && b.renter_id === currentUserId);
    
    if (!booking) {
        showMessage('لم يتم العثور على الحجز', 'error');
        return;
    }
    
    const modal = document.getElementById('bookingModal');
    const modalBody = document.getElementById('modalBody');
    
    // Safe date formatting with fallbacks
    const startDate = booking.start_date ? new Date(booking.start_date).toLocaleDateString('ar-SA') : 'غير محدد';
    const endDate = booking.end_date ? new Date(booking.end_date).toLocaleDateString('ar-SA') : 'غير محدد';
    const createdDate = booking.created_at ? new Date(booking.created_at).toLocaleDateString('ar-SA') : 'غير محدد';
    
    const statusText = {
        'pending': 'في انتظار الموافقة',
        'approved': 'تمت الموافقة',
        'rejected': 'مرفوضة',
        'completed': 'مكتملة'
    };
    
    // Safe data access with fallbacks - improved car name logic
    let carName = booking.car_name;
    if (!carName || carName === 'سيارة غير محددة') {
        if (booking.car_brand && booking.car_model && booking.car_year) {
            carName = `${booking.car_brand} ${booking.car_model} ${booking.car_year}`;
        } else if (booking.car_brand && booking.car_model) {
            carName = `${booking.car_brand} ${booking.car_model}`;
        } else {
            carName = 'سيارة غير محددة';
        }
    }
    const totalAmount = booking.total_amount || 0;
    const depositAmount = booking.deposit_amount || 0;
    const pickupLocation = booking.pickup_location || 'غير محدد';
    const returnLocation = booking.return_location || 'غير محدد';
    const ownerName = booking.owner_name || 'غير محدد';
    const ownerPhone = booking.owner_phone || 'غير محدد';
    
    modalBody.innerHTML = `
        <div class="booking-details-modal">
            <div class="detail-section">
                <h3>معلومات السيارة</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <i class="fas fa-car"></i>
                        <div>
                            <strong>اسم السيارة:</strong>
                            <span>${carName}</span>
                        </div>
                    </div>
                    ${booking.car_brand ? `
                    <div class="detail-item">
                        <i class="fas fa-tag"></i>
                        <div>
                            <strong>الماركة:</strong>
                            <span>${booking.car_brand}</span>
                        </div>
                    </div>
                    ` : ''}
                    ${booking.car_model ? `
                    <div class="detail-item">
                        <i class="fas fa-cog"></i>
                        <div>
                            <strong>الموديل:</strong>
                            <span>${booking.car_model}</span>
                        </div>
                    </div>
                    ` : ''}
                    ${booking.car_year ? `
                    <div class="detail-item">
                        <i class="fas fa-calendar-alt"></i>
                        <div>
                            <strong>سنة الصنع:</strong>
                            <span>${booking.car_year}</span>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="detail-section">
                <h3>معلومات مالك السيارة</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <i class="fas fa-user"></i>
                        <div>
                            <strong>اسم المالك:</strong>
                            <span>${ownerName}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <div>
                            <strong>رقم الهاتف:</strong>
                            <span>${ownerPhone}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>تفاصيل الحجز</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <div>
                            <strong>تاريخ البداية:</strong>
                            <span>${startDate}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <div>
                            <strong>تاريخ النهاية:</strong>
                            <span>${endDate}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-money-bill-wave"></i>
                        <div>
                            <strong>المبلغ الإجمالي:</strong>
                            <span>${totalAmount} ريال</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-shield-alt"></i>
                        <div>
                            <strong>الوديعة:</strong>
                            <span>${depositAmount} ريال</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>معلومات الاستلام والإرجاع</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>موقع الاستلام:</strong>
                            <span>${pickupLocation}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>موقع الإرجاع:</strong>
                            <span>${returnLocation}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Map Section -->
                <div class="map-section">
                    <h4>خريطة موقع الاستلام</h4>
                    <div id="pickupMap" class="booking-map"></div>
                    <div class="map-actions">
                        <button class="btn btn-outline" onclick="getDirections('${pickupLocation}')">
                            <i class="fas fa-directions"></i>
                            الحصول على الاتجاهات
                        </button>
                        <button class="btn btn-outline" onclick="copyLocation('${pickupLocation}')">
                            <i class="fas fa-copy"></i>
                            نسخ العنوان
                        </button>
                    </div>
                </div>
            </div>
            
            ${booking.renter_notes ? `
            <div class="detail-section">
                <h3>ملاحظاتك</h3>
                <p>${booking.renter_notes}</p>
            </div>
            ` : ''}
            
            <div class="detail-section">
                <h3>حالة الحجز</h3>
                <div class="status-info">
                    <span class="status-badge ${booking.status}">${statusText[booking.status] || 'غير محدد'}</span>
                    <p>تم إنشاء الحجز في ${createdDate}</p>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Initialize map after modal is displayed
    setTimeout(() => {
        initializePickupMap(pickupLocation);
    }, 100);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Show message function
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Add review function
function addReview(bookingId) {
    window.location.href = `add-review.html?booking_id=${bookingId}`;
}

// Upload photos function
function uploadPhotos(bookingId) {
    window.location.href = `upload-booking-photos.html?booking_id=${bookingId}`;
}

// Create new booking function
function createNewBooking(bookingData) {
    try {
        const mockBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
        
        const newBooking = {
            id: Date.now(),
            renter_id: currentUser.id || 1,
            car_id: bookingData.car_id,
            car_name: bookingData.car_name,
            car_brand: bookingData.car_brand,
            car_model: bookingData.car_model,
            car_year: bookingData.car_year,
            start_date: bookingData.start_date,
            end_date: bookingData.end_date,
            total_amount: bookingData.total_amount,
            deposit_amount: bookingData.deposit_amount,
            status: 'pending',
            pickup_location: bookingData.pickup_location,
            return_location: bookingData.return_location,
            renter_notes: bookingData.renter_notes,
            created_at: new Date().toISOString(),
            owner_name: bookingData.owner_name || 'مالك السيارة',
            owner_phone: bookingData.owner_phone || '+966500000000'
        };
        
        mockBookings.push(newBooking);
        localStorage.setItem('mockBookings', JSON.stringify(mockBookings));
        
        return newBooking;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}

// Initialize pickup map
function initializePickupMap(location) {
    try {
        const mapElement = document.getElementById('pickupMap');
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }

        // Default coordinates for Saudi Arabia
        let defaultLat = 24.7136;
        let defaultLng = 46.6753;

        // Try to geocode the location
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: location + ', Saudi Arabia' }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                defaultLat = location.lat();
                defaultLng = location.lng();
            }

            // Create map
            const map = new google.maps.Map(mapElement, {
                center: { lat: defaultLat, lng: defaultLng },
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true
            });

            // Add marker
            const marker = new google.maps.Marker({
                position: { lat: defaultLat, lng: defaultLng },
                map: map,
                title: 'موقع الاستلام',
                icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    scaledSize: new google.maps.Size(32, 32)
                }
            });

            // Add info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="text-align: center; font-family: 'Cairo', sans-serif;">
                        <h4 style="margin: 0 0 5px 0; color: #333;">موقع الاستلام</h4>
                        <p style="margin: 0; color: #666; font-size: 14px;">${location}</p>
                    </div>
                `
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });

            // Store map reference for later use
            mapElement.mapInstance = map;
            mapElement.markerInstance = marker;
        });
    } catch (error) {
        console.error('Error initializing map:', error);
        const mapElement = document.getElementById('pickupMap');
        if (mapElement) {
            mapElement.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 200px; background: #f8f9fa; border-radius: 8px; color: #666;">
                    <div style="text-align: center;">
                        <i class="fas fa-map-marker-alt" style="font-size: 2rem; margin-bottom: 10px; color: #999;"></i>
                        <p>لا يمكن تحميل الخريطة</p>
                        <small>${location}</small>
                    </div>
                </div>
            `;
        }
    }
}

// Get directions function
function getDirections(location) {
    try {
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location + ', Saudi Arabia')}`;
        window.open(directionsUrl, '_blank');
    } catch (error) {
        console.error('Error opening directions:', error);
        showMessage('حدث خطأ في فتح الاتجاهات', 'error');
    }
}

// Copy location function
function copyLocation(location) {
    try {
        navigator.clipboard.writeText(location).then(() => {
            showMessage('تم نسخ العنوان بنجاح', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = location;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showMessage('تم نسخ العنوان بنجاح', 'success');
        });
    } catch (error) {
        console.error('Error copying location:', error);
        showMessage('حدث خطأ في نسخ العنوان', 'error');
    }
}

// Fix car names in existing bookings
function fixCarNamesInBookings() {
    const bookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
    const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
    
    let fixedCount = 0;
    
    bookings.forEach(booking => {
        if (!booking.car_name || booking.car_name === 'سيارة غير محددة') {
            const car = cars.find(c => c.id == booking.car_id);
            if (car) {
                booking.car_name = `${car.brand} ${car.model} ${car.year}`;
                booking.car_brand = car.brand;
                booking.car_model = car.model;
                booking.car_year = car.year;
                fixedCount++;
            } else if (booking.car_brand && booking.car_model && booking.car_year) {
                booking.car_name = `${booking.car_brand} ${booking.car_model} ${booking.car_year}`;
                fixedCount++;
            }
        }
    });
    
    if (fixedCount > 0) {
        localStorage.setItem('mockBookings', JSON.stringify(bookings));
        showMessage(`تم إصلاح ${fixedCount} حجز`, 'success');
        loadBookings(); // Reload to show changes
    } else {
        showMessage('لا توجد حجوزات تحتاج إصلاح', 'info');
    }
}

// Create test booking for Honda Accord
function createHondaAccordBooking() {
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const currentUserId = currentUser.id || 1;
    
    const hondaBooking = {
        id: Date.now(),
        car_id: 1,
        renter_id: currentUserId,
        car_name: 'هوندا أكورد 2023',
        car_brand: 'هوندا',
        car_model: 'أكورد',
        car_year: '2023',
        start_date: '2024-02-15',
        end_date: '2024-02-18',
        total_amount: 600,
        deposit_amount: 1000,
        status: 'approved',
        pickup_location: 'مطار الملك خالد الدولي',
        return_location: 'مطار الملك خالد الدولي',
        renter_notes: 'حجز للهوندا أكورد 2023',
        created_at: new Date().toISOString(),
        owner_name: 'أحمد محمد',
        owner_phone: '+966501234567',
        daily_rate: 200,
        delivery_choice: 'no',
        delivery_fee: 0
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
    existingBookings.push(hondaBooking);
    localStorage.setItem('mockBookings', JSON.stringify(existingBookings));
    
    // Reload bookings
    loadBookings();
    
    showMessage('تم إنشاء حجز الهوندا أكورد بنجاح', 'success');
}

// Logout function
function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    localStorage.removeItem('rememberMe');
    
    window.location.href = 'index.html';
}
