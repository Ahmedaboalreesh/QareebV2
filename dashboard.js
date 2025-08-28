// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuth();
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize dashboard
    initializeDashboard();
});

// Check authentication
function checkAuth() {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
        return;
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Get data from localStorage
        const carsData = JSON.parse(localStorage.getItem('mockCars') || '[]');
        const bookingsData = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        
        // Calculate stats
        const stats = {
            cars_count: carsData.length,
            active_bookings: bookingsData.filter(booking => booking.status === 'pending' || booking.status === 'approved').length,
            monthly_earnings: bookingsData
                .filter(booking => booking.status === 'completed')
                .reduce((total, booking) => total + (booking.total_amount || 0), 0)
        };
        
        updateStats(stats);
        updateRecentActivity();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        updateStats({ cars_count: 0, active_bookings: 0, monthly_earnings: 0 });
        updateRecentActivity();
    }
}

// Update dashboard statistics
function updateStats(stats) {
    const statsElements = document.querySelectorAll('.stat-card h3');
    
    // Cars count
    statsElements[0].textContent = stats.cars_count || 0;
    
    // Active bookings count
    statsElements[1].textContent = stats.active_bookings || 0;
    
    // Monthly earnings
    statsElements[2].textContent = `${stats.monthly_earnings || 0} ريال`;
    
    // Average rating (placeholder for now)
    statsElements[3].textContent = '0.0';
}

// Update recent activity
function updateRecentActivity(activities = []) {
    const activityList = document.querySelector('.activity-list');
    
    // Clear existing activities (except the first welcome message)
    const existingActivities = activityList.querySelectorAll('.activity-item:not(:first-child)');
    existingActivities.forEach(activity => activity.remove());
    
    // Add recent activities
    activities.forEach(activity => {
        const activityElement = createActivityElement(activity);
        activityList.appendChild(activityElement);
    });
    
    // Show empty state if no activities
    if (activities.length === 0) {
        const emptyActivity = activityList.querySelector('.activity-item.empty');
        if (emptyActivity) {
            emptyActivity.style.display = 'flex';
        }
    }
}

// Create activity element
function createActivityElement(activity) {
    const activityElement = document.createElement('div');
    activityElement.className = 'activity-item';
    
    const icons = {
        'car_added': 'fas fa-car',
        'booking_received': 'fas fa-calendar-plus',
        'booking_completed': 'fas fa-check-circle',
        'earnings_received': 'fas fa-money-bill-wave',
        'review_received': 'fas fa-comment'
    };
    
    activityElement.innerHTML = `
        <div class="activity-icon">
            <i class="${icons[activity.type] || 'fas fa-info-circle'}"></i>
        </div>
        <div class="activity-content">
            <h4>${activity.title}</h4>
            <p>${activity.description}</p>
            <span class="activity-time">${formatTime(activity.timestamp)}</span>
        </div>
    `;
    
    return activityElement;
}

// Format time
function formatTime(timestamp) {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
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

// Initialize dashboard
function initializeDashboard() {
    // Add welcome activity if this is the first visit
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    if (activities.length === 0) {
        const welcomeActivity = {
            type: 'welcome',
            title: 'تم إنشاء حسابك بنجاح',
            description: 'مرحباً بك في منصة شارك سيارتك',
            timestamp: new Date().toISOString()
        };
        
        activities.push(welcomeActivity);
        localStorage.setItem('activities', JSON.stringify(activities));
    }
    
    // Add click event listeners to action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Logout function
function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        // Clear user data
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

// Add CSS for dashboard animations
const dashboardStyles = `
    .dashboard-section {
        padding: 120px 0 60px;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        min-height: 100vh;
    }
    
    .dashboard-header {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .dashboard-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 1rem;
    }
    
    .dashboard-header p {
        font-size: 1.1rem;
        color: #6b7280;
        max-width: 600px;
        margin: 0 auto;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
    }
    
    .stat-card {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: all 0.3s ease;
    }
    
    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }
    
    .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        background: linear-gradient(135deg, #3b82f6, #1e3a8a);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
    }
    
    .stat-content h3 {
        font-size: 1.8rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.25rem;
    }
    
    .stat-content p {
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .quick-actions {
        margin-bottom: 3rem;
    }
    
    .quick-actions h2 {
        font-size: 1.8rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1.5rem;
        text-align: center;
    }
    
    .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
    }
    
    .action-card {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        text-decoration: none;
        color: inherit;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .action-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }
    
    .action-card.primary {
        background: linear-gradient(135deg, #1e3a8a, #3b82f6);
        color: white;
    }
    
    .action-card.primary .action-icon {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .action-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        background: #f3f4f6;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        font-size: 1.5rem;
        color: #3b82f6;
    }
    
    .action-card h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    
    .action-card p {
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .action-card.primary p {
        color: rgba(255, 255, 255, 0.8);
    }
    
    .recent-activity {
        margin-bottom: 3rem;
    }
    
    .recent-activity h2 {
        font-size: 1.8rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1.5rem;
        text-align: center;
    }
    
    .activity-list {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .activity-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        border-bottom: 1px solid #f3f4f6;
        transition: background-color 0.3s ease;
    }
    
    .activity-item:last-child {
        border-bottom: none;
    }
    
    .activity-item:hover {
        background-color: #f9fafb;
    }
    
    .activity-item.empty {
        opacity: 0.6;
    }
    
    .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: #f3f4f6;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        font-size: 1rem;
    }
    
    .activity-content {
        flex: 1;
    }
    
    .activity-content h4 {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.25rem;
    }
    
    .activity-content p {
        color: #6b7280;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
    }
    
    .activity-time {
        color: #9ca3af;
        font-size: 0.8rem;
    }
    
    .tips-section {
        margin-bottom: 3rem;
    }
    
    .tips-section h2 {
        font-size: 1.8rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1.5rem;
        text-align: center;
    }
    
    .tips-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }
    
    .tip-card {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        text-align: center;
        transition: all 0.3s ease;
    }
    
    .tip-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }
    
    .tip-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        background: linear-gradient(135deg, #10b981, #059669);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        color: white;
        font-size: 1.5rem;
    }
    
    .tip-card h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }
    
    .tip-card p {
        color: #6b7280;
        font-size: 0.9rem;
        line-height: 1.5;
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
        .dashboard-header h1 {
            font-size: 2rem;
        }
        
        .stats-grid {
            grid-template-columns: 1fr;
        }
        
        .actions-grid {
            grid-template-columns: 1fr;
        }
        
        .tips-grid {
            grid-template-columns: 1fr;
        }
        
        .stat-card,
        .action-card,
        .tip-card {
            padding: 1.5rem;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = dashboardStyles;
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
