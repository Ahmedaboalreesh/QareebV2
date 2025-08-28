// Global variables
let currentUser = null;
let currentBooking = null;
let currentCar = null;

// DOM elements
const reviewForm = document.getElementById('reviewForm');
const bookingInfo = document.getElementById('bookingInfo');
const loadingOverlay = document.getElementById('loadingOverlay');
const successModal = document.getElementById('successModal');
const logoutBtn = document.getElementById('logoutBtn');
const commentTextarea = document.getElementById('comment');
const charCount = document.getElementById('charCount');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeRatingStars();
    initializeCharCount();
    loadBookingData();
});

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Get user data from token
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUser = {
            id: payload.id,
            email: payload.email
        };
    } catch (error) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}

// Initialize rating stars
function initializeRatingStars() {
    const ratingInputs = document.querySelectorAll('.rating-input');
    
    ratingInputs.forEach(input => {
        const stars = input.querySelectorAll('.stars i');
        const ratingText = input.querySelector('.rating-text');
        const hiddenInput = input.parentElement.querySelector('input[type="hidden"]');
        
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                setRating(stars, rating, ratingText, hiddenInput);
            });
            
            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.dataset.rating);
                highlightStars(stars, rating);
            });
        });
        
        input.addEventListener('mouseleave', function() {
            const currentRating = hiddenInput.value ? parseInt(hiddenInput.value) : 0;
            highlightStars(stars, currentRating);
        });
    });
}

// Set rating
function setRating(stars, rating, ratingText, hiddenInput) {
    hiddenInput.value = rating;
    highlightStars(stars, rating);
    
    const ratingLabels = {
        1: 'سيء جداً',
        2: 'سيء',
        3: 'متوسط',
        4: 'جيد',
        5: 'ممتاز'
    };
    
    ratingText.textContent = ratingLabels[rating] || 'اختر التقييم';
}

// Highlight stars
function highlightStars(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas', 'text-warning');
        } else {
            star.classList.remove('fas', 'text-warning');
            star.classList.add('far');
        }
    });
}

// Initialize character count
function initializeCharCount() {
    commentTextarea.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = count;
        
        if (count > 450) {
            charCount.style.color = '#dc3545';
        } else if (count > 400) {
            charCount.style.color = '#ffc107';
        } else {
            charCount.style.color = '#6c757d';
        }
    });
}

// Load booking data
async function loadBookingData() {
    try {
        showLoading();
        
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('booking_id');
        
        if (!bookingId) {
            showError('معرف الحجز مطلوب');
            return;
        }
        
        const response = await fetch(`/api/bookings/${bookingId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('فشل في تحميل بيانات الحجز');
        }
        
        const data = await response.json();
        currentBooking = data.booking;
        
        // Load car data
        const carResponse = await fetch(`/api/cars/${currentBooking.car_id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (carResponse.ok) {
            const carData = await carResponse.json();
            currentCar = carData.car;
        }
        
        displayBookingInfo();
        
    } catch (error) {
        console.error('Error loading booking data:', error);
        showError('فشل في تحميل بيانات الحجز');
    } finally {
        hideLoading();
    }
}

// Display booking information
function displayBookingInfo() {
    if (!currentBooking || !currentCar) return;
    
    const bookingDate = new Date(currentBooking.start_date).toLocaleDateString('ar-SA');
    const returnDate = new Date(currentBooking.end_date).toLocaleDateString('ar-SA');
    
    bookingInfo.innerHTML = `
        <div class="booking-info-grid">
            <div class="info-item">
                <i class="fas fa-car"></i>
                <div>
                    <strong>السيارة:</strong>
                    <span>${currentCar.brand} ${currentCar.model} ${currentCar.year}</span>
                </div>
            </div>
            <div class="info-item">
                <i class="fas fa-calendar"></i>
                <div>
                    <strong>تاريخ الحجز:</strong>
                    <span>${bookingDate} - ${returnDate}</span>
                </div>
            </div>
            <div class="info-item">
                <i class="fas fa-user"></i>
                <div>
                    <strong>المالك:</strong>
                    <span>${currentBooking.owner_name || 'غير محدد'}</span>
                </div>
            </div>
            <div class="info-item">
                <i class="fas fa-money-bill-wave"></i>
                <div>
                    <strong>المبلغ الإجمالي:</strong>
                    <span>${currentBooking.total_amount} ريال</span>
                </div>
            </div>
        </div>
    `;
}

// Handle form submission
reviewForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    try {
        showLoading();
        
        const formData = new FormData(reviewForm);
        const reviewData = {
            booking_id: currentBooking.id,
            car_id: currentBooking.car_id,
            rating: formData.get('rating'),
            cleanliness_rating: formData.get('cleanliness_rating') || null,
            condition_rating: formData.get('condition_rating') || null,
            communication_rating: formData.get('communication_rating') || null,
            comment: formData.get('comment') || '',
            review_type: 'renter_to_owner'
        };
        
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(reviewData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'فشل في إرسال التقييم');
        }
        
        const result = await response.json();
        showSuccessModal();
        
    } catch (error) {
        console.error('Error submitting review:', error);
        showError(error.message || 'فشل في إرسال التقييم');
    } finally {
        hideLoading();
    }
});

// Validate form
function validateForm() {
    const rating = document.getElementById('overallRating').value;
    
    if (!rating) {
        showError('يرجى اختيار التقييم العام');
        return false;
    }
    
    return true;
}

// Show loading overlay
function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

// Show success modal
function showSuccessModal() {
    successModal.classList.remove('hidden');
}

// Show error message
function showError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'notification notification-error';
    notification.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Logout functionality
logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

// Close modal when clicking outside
successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
        successModal.classList.add('hidden');
    }
});
