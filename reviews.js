// Reviews management functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const userToken = localStorage.getItem('userToken');
    const userType = localStorage.getItem('userType');
    
    if (!userToken) {
        window.location.href = 'login.html';
        return;
    }
    
    // Create sample data if not exists
    createSampleData();
    
    // Load reviews
    loadReviews();
    
    // Setup filter tabs
    setupFilterTabs();
    
    // Setup rating input
    setupRatingInput();
    
    // Setup add review form
    setupAddReviewForm();
    
    // Update notification badge
    updateNotificationBadge();
});

// Create sample data if not exists
function createSampleData() {
    try {
        // Check if sample reviews exist
        const existingReviews = JSON.parse(localStorage.getItem('mockReviews') || '[]');
        if (existingReviews.length === 0) {
            const sampleReviews = [
                {
                    id: 1,
                    car_id: 1,
                    car_name: 'تويوتا كامري 2023',
                    reviewer_name: 'أحمد محمد',
                    reviewer_id: 'user-1',
                    rating: 5,
                    title: 'تجربة ممتازة',
                    comment: 'سيارة ممتازة وحالة جيدة جداً، المالك متعاون والتجربة كانت رائعة',
                    review_type: 'received', // received, given
                    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 2,
                    car_id: 2,
                    car_name: 'مرسيدس C-Class 2022',
                    reviewer_name: 'فاطمة علي',
                    reviewer_id: 'user-2',
                    rating: 4,
                    title: 'سيارة فاخرة ومريحة',
                    comment: 'سيارة فاخرة ومريحة للرحلات الطويلة، المالك محترم جداً',
                    review_type: 'received',
                    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 3,
                    car_id: 1,
                    car_name: 'تويوتا كامري 2023',
                    reviewer_name: 'محمد أحمد',
                    reviewer_id: 'current-user',
                    rating: 5,
                    title: 'تجربة رائعة',
                    comment: 'استأجرت هذه السيارة وكانت تجربة ممتازة، أنصح بها بشدة',
                    review_type: 'given',
                    created_at: new Date().toISOString()
                }
            ];
            localStorage.setItem('mockReviews', JSON.stringify(sampleReviews));
            console.log('✅ Sample reviews created');
        }
    } catch (error) {
        console.error('❌ Error creating sample data:', error);
    }
}

// Load reviews
function loadReviews() {
    try {
        const reviews = JSON.parse(localStorage.getItem('mockReviews') || '[]');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const currentUserId = userData.id || 'current-user';
        
        // Filter reviews based on user type and current filter
        const currentFilter = document.querySelector('.tab-btn.active').dataset.filter;
        let filteredReviews = reviews;
        
        if (currentFilter === 'received') {
            // Show reviews received by current user (as car owner)
            filteredReviews = reviews.filter(review => 
                review.review_type === 'received' && 
                review.reviewer_id !== currentUserId
            );
        } else if (currentFilter === 'given') {
            // Show reviews given by current user
            filteredReviews = reviews.filter(review => 
                review.reviewer_id === currentUserId
            );
        } else if (currentFilter === 'pending') {
            // Show pending reviews (for future implementation)
            filteredReviews = [];
        }
        
        displayReviews(filteredReviews);
        updateStats(reviews, currentUserId);
        
    } catch (error) {
        console.error('❌ Error loading reviews:', error);
        showMessage('حدث خطأ في تحميل التقييمات', 'error');
    }
}

// Display reviews
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    const emptyState = document.getElementById('emptyState');
    
    if (reviews.length === 0) {
        reviewsList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    reviewsList.style.display = 'block';
    emptyState.style.display = 'none';
    
    const reviewsHTML = reviews.map(review => createReviewCard(review)).join('');
    reviewsList.innerHTML = reviewsHTML;
}

// Create review card
function createReviewCard(review) {
    const stars = generateStars(review.rating);
    const reviewDate = formatDate(review.created_at);
    
    return `
        <div class="review-card" onclick="viewReviewDetails(${review.id})">
            <div class="review-header">
                <div class="review-info">
                    <h3>${review.title}</h3>
                    <p class="car-name">${review.car_name}</p>
                </div>
                <div class="review-rating">
                    ${stars}
                    <span class="rating-number">${review.rating}/5</span>
                </div>
            </div>
            
            <div class="review-content">
                <p>${review.comment}</p>
            </div>
            
            <div class="review-footer">
                <div class="reviewer-info">
                    <i class="fas fa-user"></i>
                    <span>${review.reviewer_name}</span>
                </div>
                <div class="review-date">
                    <i class="fas fa-calendar"></i>
                    <span>${reviewDate}</span>
                </div>
                <div class="review-type">
                    <span class="badge ${review.review_type === 'received' ? 'badge-success' : 'badge-primary'}">
                        ${review.review_type === 'received' ? 'مستلم' : 'مقدم'}
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Update stats
function updateStats(reviews, currentUserId) {
    try {
        // Calculate average rating
        const receivedReviews = reviews.filter(review => 
            review.review_type === 'received' && review.reviewer_id !== currentUserId
        );
        
        const totalRating = receivedReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = receivedReviews.length > 0 ? (totalRating / receivedReviews.length).toFixed(1) : '0.0';
        
        // Count positive reviews (4+ stars)
        const positiveReviews = receivedReviews.filter(review => review.rating >= 4).length;
        
        // Count pending reviews (for future implementation)
        const pendingReviews = 0;
        
        // Update stats display
        document.getElementById('averageRating').textContent = averageRating;
        document.getElementById('totalReviews').textContent = receivedReviews.length;
        document.getElementById('positiveReviews').textContent = positiveReviews;
        document.getElementById('pendingReviews').textContent = pendingReviews;
        
    } catch (error) {
        console.error('❌ Error updating stats:', error);
    }
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
            
            // Reload reviews with new filter
            loadReviews();
        });
    });
}

// Setup rating input
function setupRatingInput() {
    const stars = document.querySelectorAll('.rating-input .fa-star');
    const selectedRatingInput = document.getElementById('selectedRating');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            selectedRatingInput.value = rating;
            
            // Update star display
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('hover');
                } else {
                    s.classList.remove('hover');
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });
}

// Setup add review form
function setupAddReviewForm() {
    const form = document.getElementById('addReviewForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewReview();
    });
    
    // Load cars for review
    loadCarsForReview();
}

// Load cars for review
function loadCarsForReview() {
    try {
        const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
        const select = document.getElementById('reviewCar');
        
        cars.forEach(car => {
            const option = document.createElement('option');
            option.value = car.id;
            option.textContent = `${car.brand} ${car.model} ${car.year}`;
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error('❌ Error loading cars for review:', error);
    }
}

// Add new review
function addNewReview() {
    try {
        const carId = document.getElementById('reviewCar').value;
        const rating = parseInt(document.getElementById('selectedRating').value);
        const title = document.getElementById('reviewTitle').value;
        const comment = document.getElementById('reviewComment').value;
        
        if (!carId || !rating || !title || !comment) {
            showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        // Get car details
        const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
        const car = cars.find(c => c.id == carId);
        
        if (!car) {
            showMessage('السيارة المختارة غير موجودة', 'error');
            return;
        }
        
        // Get user data
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Create new review
        const newReview = {
            id: Date.now(),
            car_id: carId,
            car_name: `${car.brand} ${car.model} ${car.year}`,
            reviewer_name: userData.full_name || 'مستخدم',
            reviewer_id: userData.id || 'current-user',
            rating: rating,
            title: title,
            comment: comment,
            review_type: 'given',
            created_at: new Date().toISOString()
        };
        
        // Save to localStorage
        const reviews = JSON.parse(localStorage.getItem('mockReviews') || '[]');
        reviews.push(newReview);
        localStorage.setItem('mockReviews', JSON.stringify(reviews));
        
        showMessage('تم إضافة التقييم بنجاح', 'success');
        closeAddReviewModal();
        loadReviews();
        
    } catch (error) {
        console.error('❌ Error adding review:', error);
        showMessage('حدث خطأ في إضافة التقييم', 'error');
    }
}

// View review details
function viewReviewDetails(reviewId) {
    try {
        const reviews = JSON.parse(localStorage.getItem('mockReviews') || '[]');
        const review = reviews.find(r => r.id === reviewId);
        
        if (review) {
            showReviewModal(review);
        } else {
            showMessage('لم يتم العثور على التقييم', 'error');
        }
    } catch (error) {
        console.error('❌ Error viewing review details:', error);
        showMessage('حدث خطأ في عرض تفاصيل التقييم', 'error');
    }
}

// Show review modal
function showReviewModal(review) {
    const modal = document.getElementById('reviewModal');
    const modalBody = document.getElementById('reviewModalBody');
    
    const stars = generateStars(review.rating);
    const reviewDate = formatDate(review.created_at);
    
    modalBody.innerHTML = `
        <div class="review-details">
            <div class="review-header-detail">
                <h3>${review.title}</h3>
                <div class="review-rating-detail">
                    ${stars}
                    <span class="rating-number">${review.rating}/5</span>
                </div>
            </div>
            
            <div class="review-info-detail">
                <p><strong>السيارة:</strong> ${review.car_name}</p>
                <p><strong>المقيّم:</strong> ${review.reviewer_name}</p>
                <p><strong>التاريخ:</strong> ${reviewDate}</p>
                <p><strong>النوع:</strong> 
                    <span class="badge ${review.review_type === 'received' ? 'badge-success' : 'badge-primary'}">
                        ${review.review_type === 'received' ? 'تقييم مستلم' : 'تقييم مقدم'}
                    </span>
                </p>
            </div>
            
            <div class="review-comment-detail">
                <h4>التعليق:</h4>
                <p>${review.comment}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close review modal
function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.style.display = 'none';
}

// Close add review modal
function closeAddReviewModal() {
    const modal = document.getElementById('addReviewModal');
    modal.style.display = 'none';
    
    // Reset form
    document.getElementById('addReviewForm').reset();
    document.getElementById('selectedRating').value = '0';
    
    // Reset stars
    const stars = document.querySelectorAll('.rating-input .fa-star');
    stars.forEach(star => star.classList.remove('active'));
}

// Open add review modal
function openAddReviewModal() {
    const modal = document.getElementById('addReviewModal');
    modal.style.display = 'block';
}

// Create sample reviews
function createSampleReviews() {
    try {
        const existingReviews = JSON.parse(localStorage.getItem('mockReviews') || '[]');
        
        if (existingReviews.length === 0) {
            createSampleData();
            showMessage('تم إنشاء تقييمات تجريبية بنجاح', 'success');
        } else {
            showMessage('التقييمات التجريبية موجودة بالفعل', 'info');
        }
        
        loadReviews();
        
    } catch (error) {
        console.error('❌ Error creating sample reviews:', error);
        showMessage('حدث خطأ في إنشاء التقييمات التجريبية', 'error');
    }
}

// Debug reviews data
function debugReviewsData() {
    console.log('🔍 Debugging reviews data:');
    console.log('📝 Reviews:', JSON.parse(localStorage.getItem('mockReviews') || '[]'));
    console.log('🚗 Cars:', JSON.parse(localStorage.getItem('mockCars') || '[]'));
    console.log('👤 User Data:', JSON.parse(localStorage.getItem('userData') || '{}'));
}

// Generate stars HTML
function generateStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star active"></i>';
        } else {
            starsHTML += '<i class="fas fa-star"></i>';
        }
    }
    return starsHTML;
}

// Format date
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA');
    } catch (error) {
        return 'غير محدد';
    }
}

// Show message
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
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

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const reviewModal = document.getElementById('reviewModal');
    const addReviewModal = document.getElementById('addReviewModal');
    
    if (event.target === reviewModal) {
        closeReviewModal();
    }
    
    if (event.target === addReviewModal) {
        closeAddReviewModal();
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
