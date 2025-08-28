// Renter Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Initializing renter dashboard...');
    
    // Check authentication
    const userToken = localStorage.getItem('userToken');
    const userType = localStorage.getItem('userType');
    
    console.log('🔍 User token:', userToken);
    console.log('🔍 User type:', userType);
    
    // For testing purposes, create user data if not exists
    if (!localStorage.getItem('userData')) {
        const testUserData = {
            id: 'test-renter-' + Date.now(),
            full_name: 'مستخدم تجريبي',
            email: 'test@example.com'
        };
        localStorage.setItem('userData', JSON.stringify(testUserData));
        localStorage.setItem('userToken', 'test-token-' + Date.now());
        localStorage.setItem('userType', 'renter');
        console.log('✅ Created test user data');
    }
    
    // Load dashboard data
    loadDashboardData();
    
    // Setup search form
    setupSearchForm();
    
    // Load recommended cars
    loadRecommendedCars();
    
    // Load recent activity
    loadRecentActivity();
    
    // Create sample notifications if none exist
    createSampleNotifications();
    
    // Load notifications
    loadNotifications();
    
    // Setup notification dropdown
    setupNotificationDropdown();
    
    // Setup real-time notification updates (simulated)
    setupRealTimeNotifications();
    
    console.log('✅ Renter dashboard initialized successfully');
});

// Create sample notifications for demonstration
function createSampleNotifications() {
    try {
        const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Only create sample notifications if none exist for this user
        const userNotifications = existingNotifications.filter(n => 
            n.user_id === userData.id || n.user_id === 'all'
        );
        
        if (userNotifications.length === 0) {
            const sampleNotifications = [
                {
                    id: 'notif-1',
                    user_id: userData.id,
                    type: 'booking',
                    title: 'تم تأكيد حجزك',
                    message: 'تم تأكيد حجزك لسيارة تويوتا كامري 2023 بنجاح. يمكنك مراجعة تفاصيل الحجز في صفحة حجوزاتي.',
                    link: 'my-bookings.html',
                    read: false,
                    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
                },
                {
                    id: 'notif-2',
                    user_id: userData.id,
                    type: 'payment',
                    title: 'تم إتمام الدفع',
                    message: 'تم إتمام عملية الدفع بنجاح لمبلغ 450 ريال. سيتم إرسال إيصال الدفع إلى بريدك الإلكتروني.',
                    link: 'my-bookings.html',
                    read: false,
                    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
                },
                {
                    id: 'notif-3',
                    user_id: userData.id,
                    type: 'car',
                    title: 'سيارة جديدة متاحة',
                    message: 'تم إضافة سيارة مرسيدس S-Class 2023 جديدة في منطقتك. اطلع عليها الآن!',
                    link: 'browse-cars.html',
                    read: true,
                    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
                },
                {
                    id: 'notif-4',
                    user_id: 'all',
                    type: 'system',
                    title: 'تحديث النظام',
                    message: 'تم تحديث النظام لتحسين تجربة المستخدم. استمتع بالميزات الجديدة!',
                    link: null,
                    read: false,
                    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
                },
                {
                    id: 'notif-5',
                    user_id: userData.id,
                    type: 'warning',
                    title: 'تذكير: موعد استلام السيارة',
                    message: 'تذكير: موعد استلام سيارتك غداً الساعة 10:00 صباحاً. تأكد من إحضار الوثائق المطلوبة.',
                    link: 'my-bookings.html',
                    read: false,
                    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
                },
                {
                    id: 'notif-6',
                    user_id: userData.id,
                    type: 'success',
                    title: 'تم إضافة السيارة للمفضلة',
                    message: 'تم إضافة سيارة هوندا أكورد 2023 إلى قائمة المفضلة بنجاح.',
                    link: 'favorites.html',
                    read: true,
                    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
                }
            ];
            
            // Add sample notifications to existing ones
            const allNotifications = [...existingNotifications, ...sampleNotifications];
            localStorage.setItem('notifications', JSON.stringify(allNotifications));
            
            console.log('✅ Sample notifications created successfully');
        }
    } catch (error) {
        console.error('Error creating sample notifications:', error);
    }
}

// Setup real-time notification updates (simulated)
function setupRealTimeNotifications() {
    // Simulate new notifications every 30 seconds for demonstration
    setInterval(() => {
        const shouldCreateNotification = Math.random() < 0.1; // 10% chance every 30 seconds
        
        if (shouldCreateNotification) {
            createRandomNotification();
        }
    }, 30000);
}

// Create a random notification for demonstration
function createRandomNotification() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        
        const notificationTypes = [
            {
                type: 'info',
                title: 'عرض خاص',
                message: 'عرض خاص: خصم 20% على جميع السيارات هذا الأسبوع!',
                link: 'browse-cars.html'
            },
            {
                type: 'booking',
                title: 'تحديث حالة الحجز',
                message: 'تم تحديث حالة حجزك إلى "مؤكد". يمكنك مراجعة التفاصيل الآن.',
                link: 'my-bookings.html'
            },
            {
                type: 'car',
                title: 'سيارة متاحة قريباً',
                message: 'سيارة BMW X5 2023 ستكون متاحة للاستئجار غداً. احجزها مبكراً!',
                link: 'browse-cars.html'
            }
        ];
        
        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        const newNotification = {
            id: 'notif-' + Date.now(),
            user_id: userData.id,
            type: randomType.type,
            title: randomType.title,
            message: randomType.message,
            link: randomType.link,
            read: false,
            created_at: new Date().toISOString()
        };
        
        notifications.push(newNotification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        // Update notification badge if dropdown is not open
        const dropdown = document.getElementById('notificationsDropdown');
        if (dropdown && dropdown.style.display === 'none') {
            loadNotifications();
        }
        
        // Show toast notification
        showToastNotification(newNotification);
        
    } catch (error) {
        console.error('Error creating random notification:', error);
    }
}

// Show toast notification
function showToastNotification(notification) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon ${notification.type}">
                <i class="${getNotificationIconClass(notification.type)}"></i>
            </div>
            <div class="toast-text">
                <div class="toast-title">${notification.title}</div>
                <div class="toast-message">${notification.message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Load dashboard statistics and data
async function loadDashboardData() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // For now, we'll use mock data
        // In a real application, this would fetch from your API
        const mockStats = {
            activeBookings: 2,
            totalBookings: 8,
            favoritesCount: 5,
            averageRating: 4.7
        };
        
        updateStats(mockStats);
        
        // Update user welcome message if needed
        const dashboardHeader = document.querySelector('.dashboard-header h1');
        if (dashboardHeader && userData.full_name) {
            dashboardHeader.textContent = `مرحباً ${userData.full_name} في لوحة تحكم المستأجر`;
        }
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Fallback to default values
        updateStats({
            activeBookings: 0,
            totalBookings: 0,
            favoritesCount: 0,
            averageRating: 0.0
        });
    }
}

// Update statistics display
function updateStats(stats) {
    document.getElementById('activeBookings').textContent = stats.activeBookings;
    document.getElementById('totalBookings').textContent = stats.totalBookings;
    document.getElementById('favoritesCount').textContent = stats.favoritesCount;
    document.getElementById('averageRating').textContent = stats.averageRating.toFixed(1);
}

// Setup search form functionality
function setupSearchForm() {
    const searchForm = document.getElementById('quickSearchForm');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(searchForm);
            const searchParams = {
                location: formData.get('location'),
                startDate: formData.get('startDate'),
                endDate: formData.get('endDate'),
                maxPrice: formData.get('maxPrice')
            };
            
            // Validate dates
            if (searchParams.startDate && searchParams.endDate) {
                const startDate = new Date(searchParams.startDate);
                const endDate = new Date(searchParams.endDate);
                
                if (endDate <= startDate) {
                    showMessage('تاريخ النهاية يجب أن يكون بعد تاريخ البداية', 'error');
                    return;
                }
            }
            
            // Store search parameters and redirect to browse page
            localStorage.setItem('searchParams', JSON.stringify(searchParams));
            window.location.href = 'browse-cars.html';
        });
    }
    
    // Set minimum date for date inputs
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('searchStartDate');
    const endDateInput = document.getElementById('searchEndDate');
    
    if (startDateInput) {
        startDateInput.min = today;
        startDateInput.addEventListener('change', function() {
            if (endDateInput) {
                endDateInput.min = this.value;
            }
        });
    }
    
    if (endDateInput) {
        endDateInput.min = today;
    }
}

// Load recommended cars
function loadRecommendedCars() {
    const recommendedCarsContainer = document.getElementById('recommendedCars');
    
    if (!recommendedCarsContainer) return;
    
    // Mock recommended cars data
    const recommendedCars = [
        {
            id: 1,
            name: 'تويوتا كامري 2023',
            location: 'الرياض',
            price: 150,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            features: ['أوتوماتيك', 'تكييف', 'بلوتوث']
        },
        {
            id: 2,
            name: 'مرسيدس C-Class 2023',
            location: 'جدة',
            price: 250,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            features: ['أوتوماتيك', 'تكييف', 'GPS']
        },
        {
            id: 3,
            name: 'هيونداي توسان 2023',
            location: 'الدمام',
            price: 180,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            features: ['أوتوماتيك', 'تكييف', 'كاميرا خلفية']
        }
    ];
    
    // Clear container
    recommendedCarsContainer.innerHTML = '';
    
    // Add cars to container
    recommendedCars.forEach(car => {
        const carCard = createCarCard(car);
        recommendedCarsContainer.appendChild(carCard);
    });
}

// Create car card element
function createCarCard(car) {
    const carCard = document.createElement('div');
    carCard.className = 'car-card';
    carCard.innerHTML = `
        <div class="car-image">
            <img src="${car.image}" alt="${car.name}">
            <button class="favorite-btn" onclick="toggleFavorite(${car.id})">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="car-content">
            <h3>${car.name}</h3>
            <div class="car-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${car.location}</span>
            </div>
            <div class="car-rating">
                <span class="rating-text">التقييم:</span>
                <span>${car.rating}</span>
            </div>
            <div class="car-features">
                ${car.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <div class="car-price">
                <span class="price">${car.price}</span>
                <span class="currency">ريال/يوم</span>
            </div>
            <button class="btn btn-primary btn-full" onclick="viewCarDetails(${car.id})">
                <i class="fas fa-eye"></i>
                عرض التفاصيل
            </button>
        </div>
    `;
    
    return carCard;
}

// Load recent activity
function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    
    if (!activityList) return;
    
    // Mock activity data
    const activities = [
        {
            id: 1,
            type: 'booking',
            title: 'تم تأكيد حجز سيارة تويوتا كامري',
            description: 'تم تأكيد حجزك لسيارة تويوتا كامري 2023 في الرياض',
            date: '2024-01-15',
            icon: 'fas fa-calendar-check'
        },
        {
            id: 2,
            type: 'favorite',
            title: 'أضفت سيارة مرسيدس للمفضلة',
            description: 'تم إضافة مرسيدس C-Class 2023 إلى قائمة المفضلة',
            date: '2024-01-14',
            icon: 'fas fa-heart'
        },
        {
            id: 3,
            type: 'review',
            title: 'قمت بتقييم سيارة هيونداي توسان',
            description: 'تم إرسال تقييمك لسيارة هيونداي توسان 2023',
            date: '2024-01-13',
            icon: 'fas fa-comment'
        }
    ];
    
    // Clear container
    activityList.innerHTML = '';
    
    // Add activities to container
    activities.forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityList.appendChild(activityItem);
    });
}

// Create activity item element
function createActivityItem(activity) {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <div class="activity-icon">
            <i class="${activity.icon}"></i>
        </div>
        <div class="activity-content">
            <h4>${activity.title}</h4>
            <p>${activity.description}</p>
            <span class="activity-date">${formatDate(activity.date)}</span>
        </div>
    `;
    
    return activityItem;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Toggle favorite status
function toggleFavorite(carId) {
    // Get current favorites
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.includes(carId)) {
        // Remove from favorites
        favorites = favorites.filter(id => id !== carId);
        showMessage('تم إزالة السيارة من المفضلة', 'info');
    } else {
        // Add to favorites
        favorites.push(carId);
        showMessage('تم إضافة السيارة إلى المفضلة', 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Update favorites count
    const favoritesCountElement = document.getElementById('favoritesCount');
    if (favoritesCountElement) {
        favoritesCountElement.textContent = favorites.length;
    }
}

// View car details
function viewCarDetails(carId) {
    // Redirect to car details page
    window.location.href = `car-details.html?id=${carId}`;
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

// Setup notification dropdown
function setupNotificationDropdown() {
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('notificationsDropdown');
        const notificationBtn = document.getElementById('notificationBtn');
        
        if (dropdown && notificationBtn) {
            if (!dropdown.contains(event.target) && !notificationBtn.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        }
    });
}

// Toggle notifications dropdown
function toggleNotifications() {
    console.log('🔔 Toggle notifications called');
    
    const dropdown = document.getElementById('notificationsDropdown');
    const notificationBtn = document.getElementById('notificationBtn');
    
    console.log('🔍 Dropdown element:', dropdown);
    console.log('🔍 Notification button:', notificationBtn);
    
    if (dropdown) {
        const currentDisplay = dropdown.style.display;
        console.log('🔍 Current dropdown display:', currentDisplay);
        
        if (currentDisplay === 'none' || currentDisplay === '') {
            dropdown.style.display = 'block';
            loadNotifications(); // Refresh notifications when opening
            console.log('✅ Notifications dropdown opened');
        } else {
            dropdown.style.display = 'none';
            console.log('✅ Notifications dropdown closed');
        }
    } else {
        console.error('❌ Notifications dropdown element not found');
    }
}

// Load notifications
function loadNotifications() {
    try {
        console.log('🔍 Loading notifications...');
        
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        console.log('🔍 All notifications:', notifications);
        console.log('🔍 User data:', userData);
        
        // Filter notifications for current user
        const userNotifications = notifications.filter(notification => 
            notification.user_id === userData.id || notification.user_id === 'all'
        );
        
        console.log('🔍 User notifications:', userNotifications);
        
        displayNotifications(userNotifications);
        updateNotificationBadge(userNotifications);
        
        console.log('✅ Notifications loaded successfully');
        
    } catch (error) {
        console.error('❌ Error loading notifications:', error);
        displayNotifications([]);
        updateNotificationBadge([]);
    }
}

// Update notification badge
function updateNotificationBadge(notifications) {
    const badge = document.getElementById('notificationBadge');
    const unreadCount = notifications.filter(n => !n.read).length;
    
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Display notifications
function displayNotifications(notifications) {
    const container = document.getElementById('notificationsContainer');
    const noNotifications = document.getElementById('noNotifications');
    
    if (!container) return;
    
    if (notifications.length === 0) {
        container.innerHTML = '';
        if (noNotifications) {
            noNotifications.style.display = 'block';
        }
        return;
    }
    
    if (noNotifications) {
        noNotifications.style.display = 'none';
    }
    
    // Sort notifications by date (newest first)
    notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    container.innerHTML = notifications.map(notification => createNotificationItem(notification)).join('');
}

// Create notification item
function createNotificationItem(notification) {
    const isUnread = !notification.read;
    const iconClass = getNotificationIconClass(notification.type);
    const timeAgo = getTimeAgo(notification.created_at);
    
    return `
        <div class="notification-item ${isUnread ? 'unread' : ''}" data-notification-id="${notification.id}">
            <div class="notification-icon ${notification.type}">
                <i class="${iconClass}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-meta">
                    <span class="notification-time">${timeAgo}</span>
                    <div class="notification-actions">
                        ${notification.link ? `
                            <button class="btn-view" onclick="viewNotification('${notification.link}')">
                                <i class="fas fa-eye"></i>
                                عرض
                            </button>
                        ` : ''}
                        ${isUnread ? `
                            <button class="btn-mark-read" onclick="markAsRead(${notification.id})">
                                <i class="fas fa-check"></i>
                                مقروء
                            </button>
                        ` : ''}
                        <button class="btn-delete" onclick="deleteNotification(${notification.id})">
                            <i class="fas fa-trash"></i>
                            حذف
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get notification icon class
function getNotificationIconClass(type) {
    const iconMap = {
        'success': 'fas fa-check-circle',
        'info': 'fas fa-info-circle',
        'warning': 'fas fa-exclamation-triangle',
        'error': 'fas fa-times-circle',
        'booking': 'fas fa-calendar-check',
        'payment': 'fas fa-credit-card',
        'car': 'fas fa-car',
        'system': 'fas fa-cog'
    };
    
    return iconMap[type] || 'fas fa-bell';
}

// Get time ago
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'الآن';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `منذ ${minutes} دقيقة`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `منذ ${hours} ساعة`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `منذ ${days} يوم`;
    } else {
        return date.toLocaleDateString('ar-SA');
    }
}

// Mark notification as read
function markAsRead(notificationId) {
    try {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const notification = notifications.find(n => n.id === notificationId);
        
        if (notification) {
            notification.read = true;
            localStorage.setItem('notifications', JSON.stringify(notifications));
            
            // Update UI
            const notificationElement = document.querySelector(`[data-notification-id="${notificationId}"]`);
            if (notificationElement) {
                notificationElement.classList.remove('unread');
                const markReadBtn = notificationElement.querySelector('.btn-mark-read');
                if (markReadBtn) {
                    markReadBtn.remove();
                }
            }
            
            // Update badge
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userNotifications = notifications.filter(n => 
                n.user_id === userData.id || n.user_id === 'all'
            );
            updateNotificationBadge(userNotifications);
            
            showMessage('تم تعيين الإشعار كمقروء', 'success');
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
        showMessage('حدث خطأ في تحديث الإشعار', 'error');
    }
}

// Mark all notifications as read
function markAllAsRead() {
    try {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Mark all user notifications as read
        notifications.forEach(notification => {
            if (notification.user_id === userData.id || notification.user_id === 'all') {
                notification.read = true;
            }
        });
        
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        // Update UI
        const unreadNotifications = document.querySelectorAll('.notification-item.unread');
        unreadNotifications.forEach(item => {
            item.classList.remove('unread');
            const markReadBtn = item.querySelector('.btn-mark-read');
            if (markReadBtn) {
                markReadBtn.remove();
            }
        });
        
        // Update badge
        const userNotifications = notifications.filter(n => 
            n.user_id === userData.id || n.user_id === 'all'
        );
        updateNotificationBadge(userNotifications);
        
        showMessage('تم تعيين جميع الإشعارات كمقروءة', 'success');
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        showMessage('حدث خطأ في تحديث الإشعارات', 'error');
    }
}

// Delete notification
function deleteNotification(notificationId) {
    if (confirm('هل أنت متأكد من حذف هذا الإشعار؟')) {
        try {
            const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            const updatedNotifications = notifications.filter(n => n.id !== notificationId);
            
            localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
            
            // Remove from UI
            const notificationElement = document.querySelector(`[data-notification-id="${notificationId}"]`);
            if (notificationElement) {
                notificationElement.remove();
            }
            
            // Check if no notifications left
            const remainingNotifications = document.querySelectorAll('.notification-item');
            if (remainingNotifications.length === 0) {
                const noNotifications = document.getElementById('noNotifications');
                if (noNotifications) {
                    noNotifications.style.display = 'block';
                }
            }
            
            // Update badge
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userNotifications = updatedNotifications.filter(n => 
                n.user_id === userData.id || n.user_id === 'all'
            );
            updateNotificationBadge(userNotifications);
            
            showMessage('تم حذف الإشعار بنجاح', 'success');
        } catch (error) {
            console.error('Error deleting notification:', error);
            showMessage('حدث خطأ في حذف الإشعار', 'error');
        }
    }
}

// Clear all notifications
function clearAllNotifications() {
    if (confirm('هل أنت متأكد من حذف جميع الإشعارات؟')) {
        try {
            const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            // Remove all user notifications
            const updatedNotifications = notifications.filter(notification => 
                notification.user_id !== userData.id && notification.user_id !== 'all'
            );
            
            localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
            
            // Clear UI
            const container = document.getElementById('notificationsContainer');
            if (container) {
                container.innerHTML = '';
            }
            
            const noNotifications = document.getElementById('noNotifications');
            if (noNotifications) {
                noNotifications.style.display = 'block';
            }
            
            // Update badge
            updateNotificationBadge([]);
            
            showMessage('تم حذف جميع الإشعارات بنجاح', 'success');
        } catch (error) {
            console.error('Error clearing all notifications:', error);
            showMessage('حدث خطأ في حذف الإشعارات', 'error');
        }
    }
}

// View notification link
function viewNotification(link) {
    if (link) {
        window.location.href = link;
    }
}

// Create notification function (can be called from other pages)
function createNotification(type, title, message, link = null, userId = null) {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        
        const newNotification = {
            id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            user_id: userId || userData.id,
            type: type,
            title: title,
            message: message,
            link: link,
            read: false,
            created_at: new Date().toISOString()
        };
        
        notifications.push(newNotification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        // Update notification badge if on dashboard page
        if (window.location.pathname.includes('renter-dashboard.html')) {
            loadNotifications();
        }
        
        console.log('✅ Notification created:', newNotification);
        return newNotification;
        
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
}

// Test notification function (for demonstration)
function testNotification() {
    const testTypes = [
        {
            type: 'success',
            title: 'تم إتمام العملية بنجاح',
            message: 'تم إتمام العملية المطلوبة بنجاح. يمكنك مراجعة التفاصيل الآن.',
            link: 'my-bookings.html'
        },
        {
            type: 'warning',
            title: 'تنبيه مهم',
            message: 'يرجى مراجعة معلومات الحجز قبل المتابعة.',
            link: null
        },
        {
            type: 'info',
            title: 'معلومات جديدة',
            message: 'تم إضافة ميزات جديدة للنظام. اطلع عليها الآن!',
            link: 'browse-cars.html'
        }
    ];
    
    const randomType = testTypes[Math.floor(Math.random() * testTypes.length)];
    createNotification(randomType.type, randomType.title, randomType.message, randomType.link);
    
    // Show success message
    showMessage('تم إنشاء إشعار تجريبي بنجاح', 'success');
}

// Logout function
function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    localStorage.removeItem('rememberMe');
    
    window.location.href = 'index.html';
}
