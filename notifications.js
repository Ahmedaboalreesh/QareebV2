// Global variables
let notifications = [];
let currentPage = 0;
let hasMore = true;
let currentFilter = 'all';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔔 Initializing notifications page...');
    
    // Check authentication
    if (!checkAuth()) {
        return;
    }
    
    // Initialize real notifications system
    initializeRealNotifications();
    
    // Load notifications
    loadNotifications();
    
    // Update notification badge
    updateNotificationBadge();
    
    // Listen for real-time events
    setupRealTimeNotifications();
    
    console.log('✅ Notifications page initialized');
});

// Initialize real notifications system
function initializeRealNotifications() {
    try {
        console.log('🔔 Initializing real notifications system...');
        
        // Get user data
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userType = localStorage.getItem('userType');
        
        if (!userData.id) {
            console.log('⚠️ No user data found, skipping real notifications initialization');
            return;
        }
        
        // Create real notifications based on user type and actual events
        if (userType === 'renter') {
            createRenterRealNotifications(userData);
        } else if (userType === 'owner') {
            createOwnerRealNotifications(userData);
        }
        
        console.log('✅ Real notifications system initialized');
        
    } catch (error) {
        console.error('Error initializing real notifications:', error);
    }
}

// Create real notifications for renters
function createRenterRealNotifications(userData) {
    try {
        console.log('🔔 Creating real notifications for renter...');
        
        const mockNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
        const mockBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        const mockCars = JSON.parse(localStorage.getItem('mockCars') || '[]');
        
        // Clear existing notifications for this user
        const userNotifications = mockNotifications.filter(n => n.user_id !== userData.id);
        
        // Get user's bookings
        const userBookings = mockBookings.filter(booking => booking.renter_id === userData.id);
        
        const realNotifications = [];
        
        // Create notifications for each booking
        userBookings.forEach((booking, index) => {
            const car = mockCars.find(c => c.id === booking.car_id);
            const carName = car ? `${car.brand} ${car.model} ${car.year}` : booking.car_name || 'سيارة غير محددة';
            
            // Booking created notification
            realNotifications.push({
                id: `booking-created-${booking.id}`,
                user_id: userData.id,
                type: 'booking_created',
                title: 'تم إنشاء طلب الحجز',
                description: `تم إنشاء طلب حجز السيارة ${carName} بنجاح`,
                related_id: booking.id,
                related_type: 'booking',
                is_read: false,
                created_at: booking.created_at || new Date().toISOString(),
                car_name: carName,
                booking_amount: booking.total_amount,
                booking_dates: `${booking.start_date} - ${booking.end_date}`
            });
            
            // Booking status updates
            if (booking.status === 'approved') {
                realNotifications.push({
                    id: `booking-approved-${booking.id}`,
                    user_id: userData.id,
                    type: 'booking_status_updated',
                    title: 'تمت الموافقة على الحجز',
                    description: `تمت الموافقة على حجز السيارة ${carName} من قبل صاحب السيارة`,
                    related_id: booking.id,
                    related_type: 'booking',
                    is_read: false,
                    created_at: booking.updated_at || new Date().toISOString(),
                    car_name: carName,
                    old_status: 'pending',
                    new_status: 'approved'
                });
            } else if (booking.status === 'rejected') {
                realNotifications.push({
                    id: `booking-rejected-${booking.id}`,
                    user_id: userData.id,
                    type: 'booking_status_updated',
                    title: 'تم رفض طلب الحجز',
                    description: `تم رفض طلب حجز السيارة ${carName} من قبل صاحب السيارة`,
                    related_id: booking.id,
                    related_type: 'booking',
                    is_read: false,
                    created_at: booking.updated_at || new Date().toISOString(),
                    car_name: carName,
                    old_status: 'pending',
                    new_status: 'rejected',
                    rejection_reason: booking.owner_notes || 'لم يتم تحديد سبب'
                });
            } else if (booking.status === 'completed') {
                realNotifications.push({
                    id: `booking-completed-${booking.id}`,
                    user_id: userData.id,
                    type: 'booking_completed',
                    title: 'تم إكمال الحجز',
                    description: `تم إكمال حجز السيارة ${carName} بنجاح`,
                    related_id: booking.id,
                    related_type: 'booking',
                    is_read: false,
                    created_at: booking.updated_at || new Date().toISOString(),
                    car_name: carName,
                    total_paid: booking.total_amount
                });
            }
            
            // Payment notifications
            if (booking.status === 'approved' && booking.total_amount) {
                realNotifications.push({
                    id: `payment-required-${booking.id}`,
                    user_id: userData.id,
                    type: 'payment_required',
                    title: 'مطلوب دفع مبلغ الحجز',
                    description: `يرجى دفع مبلغ ${booking.total_amount} ريال لحجز السيارة ${carName}`,
                    related_id: booking.id,
                    related_type: 'booking',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                    car_name: carName,
                    payment_amount: booking.total_amount
                });
            }
        });
        
        // Add system notifications
        realNotifications.push({
            id: 'welcome-renter',
            user_id: userData.id,
            type: 'system',
            title: 'مرحباً بك في منصة شارك سيارتك',
            description: 'يمكنك الآن تصفح السيارات المتاحة وحجز السيارة المناسبة لك',
            related_id: null,
            related_type: 'system',
            is_read: false,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        });
        
        // Save real notifications
        localStorage.setItem('mockNotifications', JSON.stringify([...userNotifications, ...realNotifications]));
        
        console.log(`✅ Created ${realNotifications.length} real notifications for renter`);
        
    } catch (error) {
        console.error('Error creating renter real notifications:', error);
    }
}

// Create real notifications for car owners
function createOwnerRealNotifications(userData) {
    try {
        console.log('🔔 Creating real notifications for car owner...');
        
        const mockNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
        const mockBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        const mockCars = JSON.parse(localStorage.getItem('mockCars') || '[]');
        
        // Clear existing notifications for this user
        const userNotifications = mockNotifications.filter(n => n.user_id !== userData.id);
        
        // Get user's cars
        const userCars = mockCars.filter(car => car.owner_id === userData.id);
        
        // Get bookings for user's cars
        const carBookings = mockBookings.filter(booking => {
            const car = mockCars.find(c => c.id === booking.car_id);
            return car && car.owner_id === userData.id;
        });
        
        const realNotifications = [];
        
        // Create notifications for each booking
        carBookings.forEach((booking, index) => {
            const car = mockCars.find(c => c.id === booking.car_id);
            const carName = car ? `${car.brand} ${car.model} ${car.year}` : booking.car_name || 'سيارة غير محددة';
            
            // New booking request notification
            if (booking.status === 'pending') {
                realNotifications.push({
                    id: `new-booking-${booking.id}`,
                    user_id: userData.id,
                    type: 'new_booking_request',
                    title: 'طلب حجز جديد',
                    description: `طلب المستأجر حجز السيارة ${carName} لمدة ${getBookingDuration(booking)}`,
                    related_id: booking.id,
                    related_type: 'booking',
                    is_read: false,
                    created_at: booking.created_at || new Date().toISOString(),
                    car_name: carName,
                    renter_name: booking.renter_name || 'مستأجر',
                    duration: getBookingDuration(booking),
                    amount: booking.total_amount
                });
            }
            
            // Booking status updates
            if (booking.status === 'approved') {
                realNotifications.push({
                    id: `booking-approved-${booking.id}`,
                    user_id: userData.id,
                    type: 'booking_status_updated',
                    title: 'تمت الموافقة على الحجز',
                    description: `تمت الموافقة على حجز السيارة ${carName}`,
                    related_id: booking.id,
                    related_type: 'booking',
                    is_read: false,
                    created_at: booking.updated_at || new Date().toISOString(),
                    car_name: carName,
                    old_status: 'pending',
                    new_status: 'approved'
                });
            } else if (booking.status === 'rejected') {
                realNotifications.push({
                    id: `booking-rejected-${booking.id}`,
                    user_id: userData.id,
                    type: 'booking_status_updated',
                    title: 'تم رفض طلب الحجز',
                    description: `تم رفض طلب حجز السيارة ${carName}`,
                    related_id: booking.id,
                    related_type: 'booking',
                    is_read: false,
                    created_at: booking.updated_at || new Date().toISOString(),
                    car_name: carName,
                    old_status: 'pending',
                    new_status: 'rejected'
                });
            } else if (booking.status === 'completed') {
                realNotifications.push({
                    id: `booking-completed-${booking.id}`,
                    user_id: userData.id,
                    type: 'booking_completed',
                    title: 'تم إكمال الحجز',
                    description: `تم إكمال حجز السيارة ${carName} بنجاح`,
                    related_id: booking.id,
                    related_type: 'booking',
                    is_read: false,
                    created_at: booking.updated_at || new Date().toISOString(),
                    car_name: carName,
                    total_earnings: booking.total_amount
                });
            }
        });
        
        // Add system notifications
        realNotifications.push({
            id: 'welcome-owner',
            user_id: userData.id,
            type: 'system',
            title: 'مرحباً بك في منصة شارك سيارتك',
            description: 'يمكنك الآن إضافة سياراتك وإدارة الحجوزات',
            related_id: null,
            related_type: 'system',
            is_read: false,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        });
        
        // Save real notifications
        localStorage.setItem('mockNotifications', JSON.stringify([...userNotifications, ...realNotifications]));
        
        console.log(`✅ Created ${realNotifications.length} real notifications for car owner`);
        
    } catch (error) {
        console.error('Error creating owner real notifications:', error);
    }
}

// Helper function to calculate booking duration
function getBookingDuration(booking) {
    if (!booking.start_date || !booking.end_date) {
        return 'غير محدد';
    }
    
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'يوم واحد';
    } else if (diffDays === 2) {
        return 'يومان';
    } else {
        return `${diffDays} أيام`;
    }
}

// Create new notification for real events
function createNotification(eventType, eventData) {
    try {
        console.log(`🔔 Creating notification for event: ${eventType}`, eventData);
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userType = localStorage.getItem('userType');
        
        if (!userData.id) {
            console.log('⚠️ No user data found, skipping notification creation');
            return;
        }
        
        const mockNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
        let newNotification = null;
        
        switch (eventType) {
            case 'booking_created':
                newNotification = createBookingCreatedNotification(eventData, userData, userType);
                break;
            case 'booking_status_updated':
                newNotification = createBookingStatusUpdatedNotification(eventData, userData, userType);
                break;
            case 'booking_completed':
                newNotification = createBookingCompletedNotification(eventData, userData, userType);
                break;
            case 'payment_received':
                newNotification = createPaymentReceivedNotification(eventData, userData, userType);
                break;
            case 'review_received':
                newNotification = createReviewReceivedNotification(eventData, userData, userType);
                break;
            case 'photo_uploaded':
                newNotification = createPhotoUploadedNotification(eventData, userData, userType);
                break;
            default:
                console.log(`⚠️ Unknown event type: ${eventType}`);
                return;
        }
        
        if (newNotification) {
            // Add to notifications
            const updatedNotifications = [newNotification, ...mockNotifications];
            localStorage.setItem('mockNotifications', JSON.stringify(updatedNotifications));
            
            // Update notification badge
            updateNotificationBadge();
            
            console.log(`✅ Created notification: ${newNotification.title}`);
        }
        
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

// Create booking created notification
function createBookingCreatedNotification(bookingData, userData, userType) {
    const carName = bookingData.car_name || 'سيارة غير محددة';
    
    if (userType === 'renter') {
        return {
            id: `booking-created-${bookingData.id}-${Date.now()}`,
            user_id: userData.id,
            type: 'booking_created',
            title: 'تم إنشاء طلب الحجز',
            description: `تم إنشاء طلب حجز السيارة ${carName} بنجاح`,
            related_id: bookingData.id,
            related_type: 'booking',
            is_read: false,
            created_at: new Date().toISOString(),
            car_name: carName,
            booking_amount: bookingData.total_amount,
            booking_dates: `${bookingData.start_date} - ${bookingData.end_date}`
        };
    } else if (userType === 'owner') {
        return {
            id: `new-booking-${bookingData.id}-${Date.now()}`,
            user_id: userData.id,
            type: 'new_booking_request',
            title: 'طلب حجز جديد',
            description: `طلب المستأجر حجز السيارة ${carName} لمدة ${getBookingDuration(bookingData)}`,
            related_id: bookingData.id,
            related_type: 'booking',
            is_read: false,
            created_at: new Date().toISOString(),
            car_name: carName,
            renter_name: bookingData.renter_name || 'مستأجر',
            duration: getBookingDuration(bookingData),
            amount: bookingData.total_amount
        };
    }
}

// Create booking status updated notification
function createBookingStatusUpdatedNotification(bookingData, userData, userType) {
    const carName = bookingData.car_name || 'سيارة غير محددة';
    const statusText = getStatusText(bookingData.status);
    
    if (userType === 'renter') {
        return {
            id: `booking-status-${bookingData.id}-${Date.now()}`,
            user_id: userData.id,
            type: 'booking_status_updated',
            title: `تم ${statusText} الحجز`,
            description: `تم ${statusText.toLowerCase()} حجز السيارة ${carName}`,
            related_id: bookingData.id,
            related_type: 'booking',
            is_read: false,
            created_at: new Date().toISOString(),
            car_name: carName,
            old_status: bookingData.old_status || 'pending',
            new_status: bookingData.status
        };
    } else if (userType === 'owner') {
        return {
            id: `booking-status-${bookingData.id}-${Date.now()}`,
            user_id: userData.id,
            type: 'booking_status_updated',
            title: `تم ${statusText} الحجز`,
            description: `تم ${statusText.toLowerCase()} حجز السيارة ${carName}`,
            related_id: bookingData.id,
            related_type: 'booking',
            is_read: false,
            created_at: new Date().toISOString(),
            car_name: carName,
            old_status: bookingData.old_status || 'pending',
            new_status: bookingData.status
        };
    }
}

// Create booking completed notification
function createBookingCompletedNotification(bookingData, userData, userType) {
    const carName = bookingData.car_name || 'سيارة غير محددة';
    
    if (userType === 'renter') {
        return {
            id: `booking-completed-${bookingData.id}-${Date.now()}`,
            user_id: userData.id,
            type: 'booking_completed',
            title: 'تم إكمال الحجز',
            description: `تم إكمال حجز السيارة ${carName} بنجاح`,
            related_id: bookingData.id,
            related_type: 'booking',
            is_read: false,
            created_at: new Date().toISOString(),
            car_name: carName,
            total_paid: bookingData.total_amount
        };
    } else if (userType === 'owner') {
        return {
            id: `booking-completed-${bookingData.id}-${Date.now()}`,
            user_id: userData.id,
            type: 'booking_completed',
            title: 'تم إكمال الحجز',
            description: `تم إكمال حجز السيارة ${carName} بنجاح`,
            related_id: bookingData.id,
            related_type: 'booking',
            is_read: false,
            created_at: new Date().toISOString(),
            car_name: carName,
            total_earnings: bookingData.total_amount
        };
    }
}

// Helper function to get status text
function getStatusText(status) {
    const statusMap = {
        'approved': 'الموافقة على',
        'rejected': 'رفض',
        'completed': 'إكمال',
        'cancelled': 'إلغاء'
    };
    return statusMap[status] || status;
}

// Setup real-time notifications monitoring
function setupRealTimeNotifications() {
    try {
        console.log('🔔 Setting up real-time notifications monitoring...');
        
        // Listen for storage changes
        window.addEventListener('storage', function(e) {
            if (e.key === 'mockBookings') {
                console.log('🔔 Detected booking changes, checking for new notifications...');
                checkForNewNotifications();
            }
        });
        
        // Also listen for local changes (same tab)
        let lastBookingsData = localStorage.getItem('mockBookings');
        
        // Check for changes every 5 seconds
        setInterval(() => {
            const currentBookingsData = localStorage.getItem('mockBookings');
            if (currentBookingsData !== lastBookingsData) {
                console.log('🔔 Detected local booking changes, checking for new notifications...');
                lastBookingsData = currentBookingsData;
                checkForNewNotifications();
            }
        }, 5000);
        
        console.log('✅ Real-time notifications monitoring setup complete');
        
    } catch (error) {
        console.error('Error setting up real-time notifications:', error);
    }
}

// Check for new notifications based on booking changes
function checkForNewNotifications() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userType = localStorage.getItem('userType');
        const mockBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        const mockNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
        
        if (!userData.id) {
            return;
        }
        
        // Get relevant bookings based on user type
        let relevantBookings = [];
        if (userType === 'renter') {
            relevantBookings = mockBookings.filter(booking => booking.renter_id === userData.id);
        } else if (userType === 'owner') {
            const mockCars = JSON.parse(localStorage.getItem('mockCars') || '[]');
            relevantBookings = mockBookings.filter(booking => {
                const car = mockCars.find(c => c.id === booking.car_id);
                return car && car.owner_id === userData.id;
            });
        }
        
        // Check each booking for new notifications
        relevantBookings.forEach(booking => {
            const existingNotification = mockNotifications.find(n => 
                n.related_id === booking.id && 
                n.type === 'booking_status_updated' &&
                n.new_status === booking.status
            );
            
            if (!existingNotification) {
                // Create new notification for status change
                if (booking.status === 'approved' || booking.status === 'rejected' || booking.status === 'completed') {
                    const car = JSON.parse(localStorage.getItem('mockCars') || '[]').find(c => c.id === booking.car_id);
                    const bookingData = {
                        ...booking,
                        car_name: car ? `${car.brand} ${car.model} ${car.year}` : booking.car_name
                    };
                    
                    createNotification('booking_status_updated', bookingData);
                }
            }
        });
        
    } catch (error) {
        console.error('Error checking for new notifications:', error);
    }
}

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('userToken');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Load notifications
async function loadNotifications(append = false) {
    try {
        const notificationsList = document.getElementById('notificationsList');
        const emptyState = document.getElementById('emptyState');
        
        if (!append) {
            // Show loading spinner
            notificationsList.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>جاري تحميل الإشعارات...</p>
                </div>
            `;
        }
        
        const token = localStorage.getItem('userToken');
        const limit = 10;
        const offset = append ? currentPage * limit : 0;
        
        const response = await fetch(`/api/notifications?limit=${limit}&offset=${offset}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            const newNotifications = result.notifications || [];
            
            if (!append) {
                notifications = newNotifications;
                currentPage = 0;
            } else {
                notifications = [...notifications, ...newNotifications];
                currentPage++;
            }
            
            hasMore = newNotifications.length === limit;
            
            // Display notifications
            displayNotifications();
            
            // Show/hide load more button
            const loadMoreContainer = document.getElementById('loadMoreContainer');
            if (hasMore) {
                loadMoreContainer.style.display = 'block';
            } else {
                loadMoreContainer.style.display = 'none';
            }
            
        } else {
            throw new Error(result.error || 'حدث خطأ في تحميل الإشعارات');
        }
        
    } catch (error) {
        console.error('Error loading notifications:', error);
        
        // Check if it's a network error (server not running)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.log('🔔 Server not running, loading mock notifications...');
            loadMockNotifications(append);
            return;
        }
        
        const notificationsList = document.getElementById('notificationsList');
        notificationsList.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>حدث خطأ</h3>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="loadNotifications()">
                    <i class="fas fa-redo"></i>
                    إعادة المحاولة
                </button>
            </div>
        `;
    }
}

// Display notifications
function displayNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    const emptyState = document.getElementById('emptyState');
    
    // Filter notifications based on current filter
    let filteredNotifications = notifications;
    
    if (currentFilter === 'unread') {
        filteredNotifications = notifications.filter(n => !n.is_read);
    } else if (currentFilter !== 'all') {
        filteredNotifications = notifications.filter(n => n.type === currentFilter);
    }
    
    if (filteredNotifications.length === 0) {
        notificationsList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    notificationsList.style.display = 'block';
    emptyState.style.display = 'none';
    
    // Clear existing content
    notificationsList.innerHTML = '';
    
    // Add notifications
    filteredNotifications.forEach(notification => {
        const notificationElement = createNotificationElement(notification);
        notificationsList.appendChild(notificationElement);
    });
}

// Create notification element
function createNotificationElement(notification) {
    const template = document.getElementById('notificationTemplate');
    const notificationElement = template.content.cloneNode(true);
    
    const notificationItem = notificationElement.querySelector('.notification-item');
    const icon = notificationElement.querySelector('.notification-icon i');
    const title = notificationElement.querySelector('.notification-title');
    const description = notificationElement.querySelector('.notification-description');
    const time = notificationElement.querySelector('.notification-time');
    const type = notificationElement.querySelector('.notification-type');
    const unreadIndicator = notificationElement.querySelector('.unread-indicator');
    
    // Set notification ID
    notificationItem.setAttribute('data-id', notification.id);
    
    // Set icon based on type
    const iconMap = {
        'photo_uploaded': 'fas fa-camera',
        'booking_status_updated': 'fas fa-calendar-check',
        'review_received': 'fas fa-star',
        'booking_created': 'fas fa-calendar-plus',
        'payment_received': 'fas fa-money-bill-wave'
    };
    
    icon.className = iconMap[notification.type] || 'fas fa-bell';
    
    // Set content
    title.textContent = notification.title;
    description.textContent = notification.description;
    time.textContent = formatTime(notification.created_at);
    type.textContent = getNotificationTypeText(notification.type);
    
    // Set unread indicator
    if (!notification.is_read) {
        unreadIndicator.style.display = 'block';
        notificationItem.classList.add('unread');
    } else {
        unreadIndicator.style.display = 'none';
        notificationItem.classList.remove('unread');
    }
    
    // Add click handler for navigation
    notificationItem.addEventListener('click', function(e) {
        // Don't trigger if clicking on action buttons
        if (e.target.closest('.notification-actions')) {
            e.stopPropagation(); // Prevent event bubbling
            return;
        }
        
        navigateToNotificationSource(notification);
    });
    
    // Add hover effect
    notificationItem.style.cursor = 'pointer';
    
    // Add event listeners for buttons
    const viewButton = notificationElement.querySelector('.btn-view');
    const markReadButton = notificationElement.querySelector('.btn-icon:not(.btn-view)');
    const deleteButton = notificationElement.querySelector('.btn-icon:last-child');
    
    if (viewButton) {
        viewButton.addEventListener('click', function(e) {
            e.stopPropagation();
            viewNotificationSource(this);
        });
    }
    
    if (markReadButton) {
        markReadButton.addEventListener('click', function(e) {
            e.stopPropagation();
            markAsRead(this);
        });
    }
    
    if (deleteButton) {
        deleteButton.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteNotification(this);
        });
    }
    
    return notificationElement;
}

// Format time
function formatTime(timestamp) {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) {
        return 'الآن';
    } else if (diffInMinutes < 60) {
        return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `منذ ${hours} ساعة`;
    } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `منذ ${days} يوم`;
    }
}

// Get notification type text
function getNotificationTypeText(type) {
    const typeMap = {
        'photo_uploaded': 'رفع الصور',
        'booking_status_updated': 'تحديث الحجز',
        'review_received': 'التقييمات',
        'booking_created': 'حجز جديد',
        'payment_received': 'الدفع'
    };
    
    return typeMap[type] || type;
}

// Navigate to notification source
function navigateToNotificationSource(notification) {
    console.log('🔗 Navigating to notification source:', notification);
    
    try {
        switch (notification.type) {
            case 'photo_uploaded':
                navigateToPhotoUpload(notification);
                break;
            case 'booking_status_updated':
                navigateToBooking(notification);
                break;
            case 'review_received':
                navigateToReview(notification);
                break;
            case 'booking_created':
                navigateToBooking(notification);
                break;
            case 'payment_received':
                navigateToPayment(notification);
                break;
            default:
                console.log('⚠️ Unknown notification type:', notification.type);
                showMessage('نوع الإشعار غير معروف', 'warning');
        }
    } catch (error) {
        console.error('❌ Error navigating to notification source:', error);
        showMessage('حدث خطأ في الانتقال إلى المصدر', 'error');
    }
}

// Navigate to photo upload page
function navigateToPhotoUpload(notification) {
    console.log('📸 Navigating to photo upload for booking:', notification.related_id);
    
    // Get booking data from localStorage
    const bookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
    const booking = bookings.find(b => b.id === notification.related_id);
    
    if (booking) {
        // Save booking data for photo upload page
        localStorage.setItem('currentBookingForPhotos', JSON.stringify(booking));
        
        // Navigate to photo upload page
        window.location.href = 'upload-booking-photos.html';
        
        showMessage('جاري الانتقال إلى صفحة رفع الصور...', 'info');
    } else {
        console.log('⚠️ Booking not found:', notification.related_id);
        showMessage('لم يتم العثور على بيانات الحجز', 'warning');
    }
}

// Navigate to booking details
function navigateToBooking(notification) {
    console.log('📅 Navigating to booking:', notification.related_id);
    
    // Get booking data from localStorage
    const bookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
    const booking = bookings.find(b => b.id === notification.related_id);
    
    if (booking) {
        // Save booking data for booking details page
        localStorage.setItem('currentBookingForDetails', JSON.stringify(booking));
        
        // Navigate to bookings page
        window.location.href = 'bookings.html';
        
        showMessage('جاري الانتقال إلى صفحة الحجوزات...', 'info');
    } else {
        console.log('⚠️ Booking not found:', notification.related_id);
        showMessage('لم يتم العثور على بيانات الحجز', 'warning');
    }
}

// Navigate to review details
function navigateToReview(notification) {
    console.log('⭐ Navigating to review:', notification.related_id);
    
    // Get review data from localStorage
    const reviews = JSON.parse(localStorage.getItem('mockReviews') || '[]');
    const review = reviews.find(r => r.id === notification.related_id);
    
    if (review) {
        // Save review data for review details page
        localStorage.setItem('currentReviewForDetails', JSON.stringify(review));
        
        // Navigate to reviews page
        window.location.href = 'reviews.html';
        
        showMessage('جاري الانتقال إلى صفحة التقييمات...', 'info');
    } else {
        console.log('⚠️ Review not found:', notification.related_id);
        showMessage('لم يتم العثور على بيانات التقييم', 'warning');
    }
}

// Navigate to payment details
function navigateToPayment(notification) {
    console.log('💰 Navigating to payment:', notification.related_id);
    
    // Get payment data from localStorage
    const payments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
    const payment = payments.find(p => p.id === notification.related_id);
    
    if (payment) {
        // Save payment data for payment details page
        localStorage.setItem('currentPaymentForDetails', JSON.stringify(payment));
        
        // Navigate to payment page or dashboard
        window.location.href = 'dashboard.html';
        
        showMessage('جاري الانتقال إلى لوحة التحكم...', 'info');
    } else {
        console.log('⚠️ Payment not found:', notification.related_id);
        showMessage('لم يتم العثور على بيانات الدفع', 'warning');
    }
}

// View notification source (button click)
function viewNotificationSource(button) {
    const notificationItem = button.closest('.notification-item');
    const notificationId = notificationItem.getAttribute('data-id');
    
    // Find notification in the array
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
        navigateToNotificationSource(notification);
    } else {
        console.error('❌ Notification not found:', notificationId);
        showMessage('لم يتم العثور على الإشعار', 'error');
    }
}

// Filter notifications
function filterNotifications() {
    const filterSelect = document.getElementById('filterType');
    currentFilter = filterSelect.value;
    
    displayNotifications();
}

// Load more notifications
function loadMoreNotifications() {
    loadNotifications(true);
}

// Mark notification as read
async function markAsRead(button) {
    try {
        console.log('🔔 Marking notification as read...');
        
        const notificationItem = button.closest('.notification-item');
        const notificationId = notificationItem.getAttribute('data-id');
        
        console.log('📝 Notification ID:', notificationId);
        
        if (!notificationId) {
            throw new Error('لم يتم العثور على معرف الإشعار');
        }
        
        const token = localStorage.getItem('userToken');
        
        // Try to update via API first
        try {
            const response = await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                // Update local state
                const notification = notifications.find(n => n.id === notificationId);
                if (notification) {
                    notification.is_read = true;
                }
                
                // Update UI
                notificationItem.classList.remove('unread');
                const unreadIndicator = notificationItem.querySelector('.unread-indicator');
                if (unreadIndicator) {
                    unreadIndicator.style.display = 'none';
                }
                
                // Update notification badge
                updateNotificationBadge();
                
                showMessage('تم تحديث الإشعار', 'success');
                return;
            } else {
                throw new Error('حدث خطأ في تحديث الإشعار');
            }
            
        } catch (apiError) {
            console.log('🔔 API error, trying mock mode...');
            
            // If API fails, use mock mode
            if (apiError.name === 'TypeError' && apiError.message.includes('fetch')) {
                markMockNotificationAsRead(notificationId);
                return;
            } else {
                throw apiError;
            }
        }
        
    } catch (error) {
        console.error('❌ Error marking notification as read:', error);
        showMessage(error.message, 'error');
    }
}

// Mark all notifications as read
async function markAllAsRead() {
    try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('/api/notifications/mark-all-read', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            // Update local state
            notifications.forEach(notification => {
                notification.is_read = true;
            });
            
            // Update UI
            displayNotifications();
            
            // Update notification badge
            updateNotificationBadge();
            
            showMessage('تم تحديث جميع الإشعارات', 'success');
        } else {
            throw new Error('حدث خطأ في تحديث الإشعارات');
        }
        
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        
        // Check if it's a network error (server not running)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.log('🔔 Server not running, updating all mock notifications...');
            markAllMockNotificationsAsRead();
            return;
        }
        
        showMessage(error.message, 'error');
    }
}

// Delete notification
async function deleteNotification(button) {
    console.log('🗑️ Deleting notification...');
    
    if (!confirm('هل أنت متأكد من حذف هذا الإشعار؟')) {
        return;
    }
    
    try {
        const notificationItem = button.closest('.notification-item');
        const notificationId = notificationItem.getAttribute('data-id');
        
        console.log('📝 Notification ID to delete:', notificationId);
        
        if (!notificationId) {
            throw new Error('لم يتم العثور على معرف الإشعار');
        }
        
        const token = localStorage.getItem('userToken');
        
        // Try to delete via API first
        try {
            const response = await fetch(`/api/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                // Remove from local state
                notifications = notifications.filter(n => n.id !== notificationId);
                
                // Remove from UI
                notificationItem.remove();
                
                // Update notification badge
                updateNotificationBadge();
                
                showMessage('تم حذف الإشعار', 'success');
                return;
            } else {
                throw new Error('حدث خطأ في حذف الإشعار');
            }
            
        } catch (apiError) {
            console.log('🔔 API error, trying mock mode...');
            
            // If API fails, use mock mode
            if (apiError.name === 'TypeError' && apiError.message.includes('fetch')) {
                deleteMockNotification(notificationId);
                return;
            } else {
                throw apiError;
            }
        }
        
    } catch (error) {
        console.error('❌ Error deleting notification:', error);
        showMessage(error.message, 'error');
    }
}

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

// Load mock notifications for testing
function loadMockNotifications(append = false) {
    try {
        console.log('🔔 Loading mock notifications from localStorage...');
        
        const notificationsList = document.getElementById('notificationsList');
        const emptyState = document.getElementById('emptyState');
        
        if (!append) {
            // Show loading spinner
            notificationsList.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>جاري تحميل الإشعارات التجريبية...</p>
                </div>
            `;
        }
        
        // Get mock notifications from localStorage
        const mockNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
        
        // Get current user data
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const currentUserId = userData.id || 'test-user';
        
        console.log('👤 Current user ID:', currentUserId);
        console.log('🔔 All notifications:', mockNotifications);
        
        // Filter notifications for current user
        let userNotifications = mockNotifications.filter(n => n.user_id === currentUserId);
        
        // If no notifications for current user, show all notifications for testing
        if (userNotifications.length === 0 && mockNotifications.length > 0) {
            console.log('🔔 No notifications for current user, showing all notifications for testing...');
            userNotifications = mockNotifications;
        }
        
        console.log('🔔 Filtered notifications for user:', userNotifications);
        
        // Sort by creation date (newest first)
        userNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        if (!append) {
            notifications = userNotifications;
            currentPage = 0;
        } else {
            notifications = [...notifications, ...userNotifications];
            currentPage++;
        }
        
        hasMore = false; // No pagination for mock data
        
        // Display notifications
        displayNotifications();
        
        // Hide load more button for mock data
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        if (loadMoreContainer) {
            loadMoreContainer.style.display = 'none';
        }
        
        console.log(`🔔 Loaded ${userNotifications.length} mock notifications for user ${currentUserId}`);
        
    } catch (error) {
        console.error('❌ Error loading mock notifications:', error);
        
        const notificationsList = document.getElementById('notificationsList');
        notificationsList.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>حدث خطأ</h3>
                <p>فشل في تحميل الإشعارات التجريبية</p>
                <button class="btn btn-primary" onclick="loadMockNotifications()">
                    <i class="fas fa-redo"></i>
                    إعادة المحاولة
                </button>
            </div>
        `;
    }
}

// Update mock notification badge
function updateMockNotificationBadge() {
    try {
        const mockNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const currentUserId = userData.id || 'test-user';
        
        // Filter unread notifications for current user
        let unreadCount = mockNotifications.filter(n => 
            n.user_id === currentUserId && !n.is_read
        ).length;
        
        // If no notifications for current user, show total unread count for testing
        if (unreadCount === 0 && mockNotifications.length > 0) {
            unreadCount = mockNotifications.filter(n => !n.is_read).length;
        }
        
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'inline';
                console.log('🔔 Updated mock notification badge:', unreadCount);
            } else {
                badge.style.display = 'none';
                console.log('🔔 No unread notifications, hiding badge');
            }
        }
        
    } catch (error) {
        console.error('❌ Error updating mock notification badge:', error);
    }
}

// Mark mock notification as read
function markMockNotificationAsRead(notificationId) {
    try {
        console.log('🔔 Marking mock notification as read:', notificationId);
        
        // Update in localStorage
        const mockNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
        const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
        
        if (notificationIndex !== -1) {
            mockNotifications[notificationIndex].is_read = true;
            localStorage.setItem('mockNotifications', JSON.stringify(mockNotifications));
            
            // Update local state
            const notification = notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.is_read = true;
            }
            
            // Update UI
            const notificationItem = document.querySelector(`[data-id="${notificationId}"]`);
            if (notificationItem) {
                notificationItem.classList.remove('unread');
                const unreadIndicator = notificationItem.querySelector('.unread-indicator');
                if (unreadIndicator) {
                    unreadIndicator.style.display = 'none';
                }
            }
            
            // Update notification badge
            updateMockNotificationBadge();
            
            showMessage('تم تحديث الإشعار', 'success');
            console.log('✅ Mock notification marked as read');
        }
        
    } catch (error) {
        console.error('❌ Error marking mock notification as read:', error);
        showMessage('حدث خطأ في تحديث الإشعار', 'error');
    }
}

// Mark all mock notifications as read
function markAllMockNotificationsAsRead() {
    try {
        console.log('🔔 Marking all mock notifications as read...');
        
        // Update in localStorage
        const mockNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const currentUserId = userData.id || 'test-user';
        
        // Mark all notifications for current user as read
        mockNotifications.forEach(notification => {
            if (notification.user_id === currentUserId) {
                notification.is_read = true;
            }
        });
        
        localStorage.setItem('mockNotifications', JSON.stringify(mockNotifications));
        
        // Update local state
        notifications.forEach(notification => {
            notification.is_read = true;
        });
        
        // Update UI
        displayNotifications();
        
        // Update notification badge
        updateMockNotificationBadge();
        
        showMessage('تم تحديث جميع الإشعارات', 'success');
        console.log('✅ All mock notifications marked as read');
        
    } catch (error) {
        console.error('❌ Error marking all mock notifications as read:', error);
        showMessage('حدث خطأ في تحديث الإشعارات', 'error');
    }
}

// Delete mock notification
function deleteMockNotification(notificationId) {
    try {
        console.log('🔔 Deleting mock notification:', notificationId);
        
        // Remove from localStorage
        const mockNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
        const updatedNotifications = mockNotifications.filter(n => n.id !== notificationId);
        localStorage.setItem('mockNotifications', JSON.stringify(updatedNotifications));
        
        // Remove from local state
        notifications = notifications.filter(n => n.id !== notificationId);
        
        // Update UI
        displayNotifications();
        
        // Update notification badge
        updateMockNotificationBadge();
        
        showMessage('تم حذف الإشعار', 'success');
        console.log('✅ Mock notification deleted');
        
    } catch (error) {
        console.error('❌ Error deleting mock notification:', error);
        showMessage('حدث خطأ في حذف الإشعار', 'error');
    }
}

// Show message
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
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Create new notification function
function createNotification(type, title, description, data = {}) {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const currentUserId = userData.id || 'test-user';
        
        const newNotification = {
            id: 'notification-' + Date.now(),
            user_id: currentUserId,
            type: type,
            title: title,
            description: description,
            related_id: data.related_id || null,
            related_type: data.related_type || null,
            is_read: false,
            created_at: new Date().toISOString(),
            ...data
        };
        
        // Get existing notifications
        const existingNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');
        
        // Add new notification to the beginning
        existingNotifications.unshift(newNotification);
        
        // Keep only last 100 notifications
        if (existingNotifications.length > 100) {
            existingNotifications.splice(100);
        }
        
        // Save back to localStorage
        localStorage.setItem('mockNotifications', JSON.stringify(existingNotifications));
        
        console.log('🔔 Created new notification:', newNotification);
        
        // Update notification badge
        updateNotificationBadge();
        
        return newNotification;
        
    } catch (error) {
        console.error('❌ Error creating notification:', error);
        return null;
    }
}

// Notification creation helpers for different types
function createBookingNotification(bookingData) {
    return createNotification(
        'new_booking_request',
        'طلب حجز جديد',
        `طلب المستأجر ${bookingData.renter_name} حجز السيارة ${bookingData.car_name} لمدة ${bookingData.duration}`,
        {
            related_id: bookingData.booking_id,
            related_type: 'booking',
            car_name: bookingData.car_name,
            renter_name: bookingData.renter_name,
            duration: bookingData.duration,
            amount: bookingData.amount
        }
    );
}

function createPhotoUploadNotification(photoData) {
    return createNotification(
        'photo_uploaded',
        'تم رفع صور جديدة',
        `قام المستأجر ${photoData.renter_name} برفع ${photoData.photo_count} صور جديدة للسيارة ${photoData.car_name}`,
        {
            related_id: photoData.booking_id,
            related_type: 'booking',
            car_name: photoData.car_name,
            renter_name: photoData.renter_name,
            photo_count: photoData.photo_count,
            photo_types: photoData.photo_types || []
        }
    );
}

function createReviewNotification(reviewData) {
    return createNotification(
        'review_received',
        'تقييم جديد لسيارتك',
        `قام المستأجر ${reviewData.reviewer_name} بتقييم السيارة ${reviewData.car_name} بـ ${reviewData.rating} نجوم`,
        {
            related_id: reviewData.review_id,
            related_type: 'review',
            car_name: reviewData.car_name,
            reviewer_name: reviewData.reviewer_name,
            rating: reviewData.rating,
            review_title: reviewData.review_title
        }
    );
}

function createPaymentNotification(paymentData) {
    return createNotification(
        'payment_received',
        'تم استلام الدفع',
        `تم استلام دفعة بقيمة ${paymentData.amount} لحجز السيارة ${paymentData.car_name}`,
        {
            related_id: paymentData.payment_id,
            related_type: 'payment',
            car_name: paymentData.car_name,
            amount: paymentData.amount,
            payment_method: paymentData.payment_method
        }
    );
}

function createSystemNotification(title, description, data = {}) {
    return createNotification(
        'system_notification',
        title,
        description,
        {
            related_type: 'system',
            ...data
        }
    );
}



// Create comprehensive sample notifications
function createComprehensiveSampleNotifications() {
    try {
        const mockNotifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');

        // Only create sample notifications if none exist
        if (mockNotifications.length === 0) {
            console.log('🔔 Creating comprehensive sample notifications for car owner...');

            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const currentUserId = userData.id || 'test-user';

            // Create sample data for better linking
            createSampleData();

            const sampleNotifications = [
                // إشعارات الحجوزات
                {
                    id: 'booking-1',
                    user_id: currentUserId,
                    type: 'new_booking_request',
                    title: 'طلب حجز جديد',
                    description: 'طلب المستأجر أحمد محمد حجز السيارة تويوتا كامري 2023 لمدة 3 أيام',
                    related_id: 'booking-1',
                    related_type: 'booking',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                    car_name: 'تويوتا كامري 2023',
                    renter_name: 'أحمد محمد',
                    duration: '3 أيام',
                    amount: '600 ريال'
                },
                {
                    id: 'booking-2',
                    user_id: currentUserId,
                    type: 'booking_status_updated',
                    title: 'تم تحديث حالة الحجز',
                    description: 'تم تغيير حالة حجز السيارة تويوتا كامري 2023 إلى "موافق عليها"',
                    related_id: 'booking-1',
                    related_type: 'booking',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                    car_name: 'تويوتا كامري 2023',
                    old_status: 'pending',
                    new_status: 'approved'
                },
                {
                    id: 'booking-3',
                    user_id: currentUserId,
                    type: 'booking_cancelled',
                    title: 'تم إلغاء الحجز',
                    description: 'قام المستأجر فاطمة علي بإلغاء حجز السيارة مرسيدس C-Class 2022',
                    related_id: 'booking-2',
                    related_type: 'booking',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
                    car_name: 'مرسيدس C-Class 2022',
                    renter_name: 'فاطمة علي',
                    reason: 'تغيير في الخطط'
                },
                {
                    id: 'booking-4',
                    user_id: currentUserId,
                    type: 'booking_completed',
                    title: 'تم إكمال الحجز',
                    description: 'تم إكمال حجز السيارة تويوتا كامري 2023 بنجاح',
                    related_id: 'booking-1',
                    related_type: 'booking',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                    car_name: 'تويوتا كامري 2023',
                    renter_name: 'أحمد محمد',
                    total_earnings: '600 ريال'
                },
                
                // إشعارات رفع الصور
                {
                    id: 'photo-1',
                    user_id: currentUserId,
                    type: 'photo_uploaded',
                    title: 'تم رفع صور جديدة',
                    description: 'قام المستأجر أحمد محمد برفع 3 صور جديدة للسيارة تويوتا كامري 2023',
                    related_id: 'booking-1',
                    related_type: 'booking',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
                    car_name: 'تويوتا كامري 2023',
                    renter_name: 'أحمد محمد',
                    photo_count: 3,
                    photo_types: ['حالة السيارة', 'المقصورة الداخلية', 'الخارجية']
                },
                {
                    id: 'photo-2',
                    user_id: currentUserId,
                    type: 'photo_uploaded',
                    title: 'تم رفع صور إضافية',
                    description: 'قام المستأجر فاطمة علي برفع 2 صورة إضافية للسيارة مرسيدس C-Class 2022',
                    related_id: 'booking-2',
                    related_type: 'booking',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
                    car_name: 'مرسيدس C-Class 2022',
                    renter_name: 'فاطمة علي',
                    photo_count: 2,
                    photo_types: ['حالة السيارة', 'الأضرار']
                },
                
                // إشعارات التقييمات
                {
                    id: 'review-1',
                    user_id: currentUserId,
                    type: 'review_received',
                    title: 'تقييم جديد لسيارتك',
                    description: 'قام المستأجر أحمد محمد بتقييم السيارة تويوتا كامري 2023 بـ 5 نجوم',
                    related_id: 'review-1',
                    related_type: 'review',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
                    car_name: 'تويوتا كامري 2023',
                    reviewer_name: 'أحمد محمد',
                    rating: 5,
                    review_title: 'تجربة ممتازة'
                },
                {
                    id: 'review-2',
                    user_id: currentUserId,
                    type: 'review_received',
                    title: 'تقييم إيجابي جديد',
                    description: 'قام المستأجر فاطمة علي بتقييم السيارة مرسيدس C-Class 2022 بـ 4 نجوم',
                    related_id: 'review-2',
                    related_type: 'review',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
                    car_name: 'مرسيدس C-Class 2022',
                    reviewer_name: 'فاطمة علي',
                    rating: 4,
                    review_title: 'سيارة فاخرة ومريحة'
                },
                
                // إشعارات المدفوعات
                {
                    id: 'payment-1',
                    user_id: currentUserId,
                    type: 'payment_received',
                    title: 'تم استلام الدفع',
                    description: 'تم استلام دفعة بقيمة 600 ريال لحجز السيارة تويوتا كامري 2023',
                    related_id: 'payment-1',
                    related_type: 'payment',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
                    car_name: 'تويوتا كامري 2023',
                    amount: '600 ريال',
                    payment_method: 'بطاقة ائتمان'
                },
                {
                    id: 'payment-2',
                    user_id: currentUserId,
                    type: 'payment_received',
                    title: 'دفعة جديدة',
                    description: 'تم استلام دفعة بقيمة 1050 ريال لحجز السيارة مرسيدس C-Class 2022',
                    related_id: 'payment-2',
                    related_type: 'payment',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
                    car_name: 'مرسيدس C-Class 2022',
                    amount: '1050 ريال',
                    payment_method: 'MADA'
                },
                
                // إشعارات النظام
                {
                    id: 'system-1',
                    user_id: currentUserId,
                    type: 'system_notification',
                    title: 'تحديث النظام',
                    description: 'تم إضافة ميزات جديدة للنظام: إمكانية رفع الصور وإدارة التقييمات',
                    related_id: 'system-1',
                    related_type: 'system',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                    update_type: 'new_features',
                    features: ['رفع الصور', 'إدارة التقييمات', 'تحسينات في الواجهة']
                },
                {
                    id: 'system-2',
                    user_id: currentUserId,
                    type: 'system_notification',
                    title: 'تذكير مهم',
                    description: 'تذكر بتحديث معلومات سياراتك للحصول على أفضل النتائج',
                    related_id: 'system-2',
                    related_type: 'system',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
                    reminder_type: 'profile_update',
                    action_required: 'تحديث معلومات السيارات'
                },
                
                // إشعارات الأمان
                {
                    id: 'security-1',
                    user_id: currentUserId,
                    type: 'security_notification',
                    title: 'تسجيل دخول جديد',
                    description: 'تم تسجيل دخول جديد إلى حسابك من جهاز غير معروف',
                    related_id: 'security-1',
                    related_type: 'security',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
                    device_info: 'جهاز غير معروف',
                    location: 'الرياض، السعودية',
                    ip_address: '192.168.1.100'
                },
                
                // إشعارات الترويج
                {
                    id: 'promo-1',
                    user_id: currentUserId,
                    type: 'promotional_notification',
                    title: 'عرض خاص',
                    description: 'احصل على خصم 10% على العمولة عند إضافة 3 سيارات جديدة',
                    related_id: 'promo-1',
                    related_type: 'promotional',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
                    offer_type: 'commission_discount',
                    discount_percentage: 10,
                    conditions: 'إضافة 3 سيارات جديدة',
                    valid_until: '2024-12-31'
                },
                
                // إشعارات الدعم
                {
                    id: 'support-1',
                    user_id: currentUserId,
                    type: 'support_notification',
                    title: 'رد على استفسارك',
                    description: 'تم الرد على استفسارك حول إعدادات الحساب',
                    related_id: 'support-1',
                    related_type: 'support',
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
                    ticket_id: 'TKT-2024-001',
                    subject: 'إعدادات الحساب',
                    response_time: '24 ساعة'
                }
            ];

            localStorage.setItem('mockNotifications', JSON.stringify(sampleNotifications));
            console.log('✅ Created sample notifications:', sampleNotifications.length);
        } else {
            console.log('🔔 Sample notifications already exist:', mockNotifications.length);
        }

    } catch (error) {
        console.error('❌ Error creating sample notifications:', error);
    }
}

// Create sample data for better linking
function createSampleData() {
    try {
        // Create sample bookings
        const sampleBookings = [
            {
                id: 'booking-1',
                car_id: 'car-1',
                car_name: 'تويوتا كامري 2023',
                renter_id: 'renter-1',
                renter_name: 'أحمد محمد',
                owner_id: 'test-user',
                start_date: '2024-01-15',
                end_date: '2024-01-18',
                status: 'confirmed',
                total_amount: 450,
                daily_rate: 150,
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
            },
            {
                id: 'booking-2',
                car_id: 'car-2',
                car_name: 'هونداي أكسنت 2022',
                renter_id: 'renter-2',
                renter_name: 'سارة أحمد',
                owner_id: 'test-user',
                start_date: '2024-01-20',
                end_date: '2024-01-22',
                status: 'confirmed',
                total_amount: 300,
                daily_rate: 100,
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
            },
            {
                id: 'booking-3',
                car_id: 'car-3',
                car_name: 'نيسان صني 2021',
                renter_id: 'renter-3',
                renter_name: 'فاطمة علي',
                owner_id: 'test-user',
                start_date: '2024-01-25',
                end_date: '2024-01-27',
                status: 'pending',
                total_amount: 300,
                daily_rate: 100,
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
            }
        ];

        // Create sample reviews
        const sampleReviews = [
            {
                id: 'review-1',
                booking_id: 'booking-1',
                car_id: 'car-1',
                car_name: 'تويوتا كامري 2023',
                reviewer_id: 'renter-1',
                reviewer_name: 'أحمد محمد',
                owner_id: 'test-user',
                rating: 5,
                comment: 'تجربة ممتازة، أنصح بها',
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
            }
        ];

        // Create sample payments
        const samplePayments = [
            {
                id: 'payment-1',
                booking_id: 'booking-1',
                car_id: 'car-1',
                car_name: 'تويوتا كامري 2023',
                amount: 450,
                payment_method: 'بطاقة ائتمانية',
                status: 'completed',
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
            }
        ];

        // Save to localStorage
        localStorage.setItem('mockBookings', JSON.stringify(sampleBookings));
        localStorage.setItem('mockReviews', JSON.stringify(sampleReviews));
        localStorage.setItem('mockPayments', JSON.stringify(samplePayments));

        console.log('✅ Created sample data:', {
            bookings: sampleBookings.length,
            reviews: sampleReviews.length,
            payments: samplePayments.length
        });

    } catch (error) {
        console.error('❌ Error creating sample data:', error);
    }
}

// Logout function
function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userType');
        localStorage.removeItem('rememberMe');
        
        window.location.href = 'index.html';
    }
}
