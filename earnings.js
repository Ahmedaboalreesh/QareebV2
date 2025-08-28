// Earnings functionality
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

    // Load earnings data
    loadEarningsData();
    
    // Setup chart filters
    setupChartFilters();
    
    // Update notification badge
    updateNotificationBadge();
});

// Load earnings data with mock data
async function loadEarningsData() {
    try {
        // Mock earnings data
        const mockEarnings = {
            totalEarnings: 8500,
            monthlyEarnings: 3200,
            completedBookings: 8,
            averagePerBooking: 400,
            transactions: [
                {
                    id: 1,
                    car_name: 'تويوتا كامري 2023',
                    renter_name: 'أحمد محمد',
                    amount: 450,
                    date: '2024-01-15',
                    status: 'completed',
                    booking_days: 3
                },
                {
                    id: 2,
                    car_name: 'تويوتا كامري 2023',
                    renter_name: 'سارة أحمد',
                    amount: 600,
                    date: '2024-01-12',
                    status: 'completed',
                    booking_days: 4
                },
                {
                    id: 3,
                    car_name: 'هيونداي سوناتا 2022',
                    renter_name: 'محمد علي',
                    amount: 480,
                    date: '2024-01-10',
                    status: 'completed',
                    booking_days: 4
                },
                {
                    id: 4,
                    car_name: 'تويوتا كامري 2023',
                    renter_name: 'فاطمة حسن',
                    amount: 300,
                    date: '2024-01-08',
                    status: 'completed',
                    booking_days: 2
                },
                {
                    id: 5,
                    car_name: 'هيونداي سوناتا 2022',
                    renter_name: 'خالد عبدالله',
                    amount: 720,
                    date: '2024-01-05',
                    status: 'completed',
                    booking_days: 6
                }
            ],
            carsEarnings: [
                {
                    car_id: 1,
                    car_name: 'تويوتا كامري 2023',
                    total_earnings: 1350,
                    bookings_count: 3,
                    average_earnings: 450
                },
                {
                    car_id: 2,
                    car_name: 'هيونداي سوناتا 2022',
                    total_earnings: 1200,
                    bookings_count: 2,
                    average_earnings: 600
                }
            ]
        };
        
        // Update overview cards
        updateOverviewCards(mockEarnings);
        
        // Load transactions
        displayTransactions(mockEarnings.transactions);
        
        // Load car earnings
        displayCarEarnings(mockEarnings.carsEarnings);
        
        // Initialize chart
        initializeChart();
        
    } catch (error) {
        console.error('Error loading earnings data:', error);
        showMessage('حدث خطأ في تحميل بيانات الأرباح', 'error');
    }
}

// Update overview cards
function updateOverviewCards(data) {
    document.getElementById('totalEarnings').textContent = data.totalEarnings.toLocaleString();
    document.getElementById('monthlyEarnings').textContent = data.monthlyEarnings.toLocaleString();
    document.getElementById('completedBookings').textContent = data.completedBookings;
    document.getElementById('averagePerBooking').textContent = data.averagePerBooking.toLocaleString();
}

// Display transactions
function displayTransactions(transactions) {
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = '';
    
    transactions.forEach(transaction => {
        const transactionCard = createTransactionCard(transaction);
        transactionsList.appendChild(transactionCard);
    });
}

// Create transaction card
function createTransactionCard(transaction) {
    const card = document.createElement('div');
    card.className = 'transaction-card';
    
    const date = new Date(transaction.date).toLocaleDateString('ar-SA');
    
    card.innerHTML = `
        <div class="transaction-info">
            <div class="transaction-details">
                <h4>${transaction.car_name}</h4>
                <p>المستأجر: ${transaction.renter_name}</p>
                <span class="transaction-date">${date}</span>
            </div>
            <div class="transaction-amount">
                <span class="amount">${transaction.amount} ريال</span>
                <span class="days">${transaction.booking_days} أيام</span>
            </div>
        </div>
        <div class="transaction-status ${transaction.status}">
            <i class="fas fa-check-circle"></i>
            <span>مكتملة</span>
        </div>
    `;
    
    return card;
}

// Display car earnings
function displayCarEarnings(carsEarnings) {
    const carsEarningsGrid = document.getElementById('carsEarningsGrid');
    carsEarningsGrid.innerHTML = '';
    
    carsEarnings.forEach(car => {
        const carEarningsCard = createCarEarningsCard(car);
        carsEarningsGrid.appendChild(carEarningsCard);
    });
}

// Create car earnings card
function createCarEarningsCard(car) {
    const card = document.createElement('div');
    card.className = 'car-earnings-card';
    
    card.innerHTML = `
        <div class="car-earnings-header">
            <h3>${car.car_name}</h3>
            <div class="car-earnings-icon">
                <i class="fas fa-car"></i>
            </div>
        </div>
        <div class="car-earnings-stats">
            <div class="stat-item">
                <span class="stat-label">إجمالي الأرباح</span>
                <span class="stat-value">${car.total_earnings.toLocaleString()} ريال</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">عدد الحجوزات</span>
                <span class="stat-value">${car.bookings_count}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">متوسط الربح</span>
                <span class="stat-value">${car.average_earnings.toLocaleString()} ريال</span>
            </div>
        </div>
    `;
    
    return card;
}

// Setup chart filters
function setupChartFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update chart
            const period = this.getAttribute('data-period');
            updateChart(period);
        });
    });
}

// Initialize chart
function initializeChart() {
    const ctx = document.getElementById('earningsChart').getContext('2d');
    
    // Mock chart data for week
    const weekData = {
        labels: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        datasets: [{
            label: 'الأرباح اليومية',
            data: [0, 150, 300, 450, 600, 450, 300],
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };
    
    window.earningsChart = new Chart(ctx, {
        type: 'line',
        data: weekData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' ريال';
                        }
                    }
                }
            }
        }
    });
}

// Update chart based on period
function updateChart(period) {
    let chartData;
    
    switch (period) {
        case 'week':
            chartData = {
                labels: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
                data: [0, 150, 300, 450, 600, 450, 300]
            };
            break;
        case 'month':
            chartData = {
                labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'],
                data: [1200, 1800, 2100, 2400]
            };
            break;
        case 'year':
            chartData = {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
                data: [3200, 2800, 3500, 4200, 3800, 4500, 5200, 4800, 4100, 3900, 4400, 5000]
            };
            break;
    }
    
    window.earningsChart.data.labels = chartData.labels;
    window.earningsChart.data.datasets[0].data = chartData.data;
    window.earningsChart.update();
}

// Export earnings report
function exportEarnings() {
    // Create a simple CSV export
    const csvContent = "data:text/csv;charset=utf-8," 
        + "التاريخ,السيارة,المستأجر,المبلغ,الحالة\n"
        + "2024-01-15,تويوتا كامري 2023,أحمد محمد,450 ريال,مكتملة\n"
        + "2024-01-12,تويوتا كامري 2023,سارة أحمد,600 ريال,مكتملة\n"
        + "2024-01-10,هيونداي سوناتا 2022,محمد علي,480 ريال,مكتملة\n"
        + "2024-01-08,تويوتا كامري 2023,فاطمة حسن,300 ريال,مكتملة\n"
        + "2024-01-05,هيونداي سوناتا 2022,خالد عبدالله,720 ريال,مكتملة";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "earnings_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showMessage('تم تصدير التقرير بنجاح', 'success');
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

// Logout function
function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    localStorage.removeItem('rememberMe');
    
    window.location.href = 'index.html';
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
