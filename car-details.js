// Car Details functionality
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

    // Get car ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    
    if (!carId) {
        showMessage('معرف السيارة غير صحيح', 'error');
        setTimeout(() => {
            window.location.href = 'browse-cars.html';
        }, 2000);
        return;
    }

    // Load car details with mock data
    loadCarDetails(carId);
    
    // Setup booking form
    setupBookingForm();
    
    // Setup favorite button
    setupFavoriteButton(carId);
});

// Load car details with mock data
async function loadCarDetails(carId) {
    try {
        // Get car data from localStorage
        const existingCars = JSON.parse(localStorage.getItem('mockCars') || '[]');
        let car = existingCars.find(c => c.id == carId);
        
        // If car not found, create mock data
        if (!car) {
            car = {
                id: carId,
                brand: 'تويوتا',
                model: 'كامري',
                year: '2023',
                daily_rate: 150,
                deposit: 500,
                owner_name: 'أحمد محمد',
                location: 'الرياض',
                transmission: 'أوتوماتيك',
                fuel_type: 'بنزين',
                mileage: 25000,
                description: 'سيارة ممتازة في حالة جيدة، مكيفة بالكامل، مناسبة للرحلات العائلية والتنقل اليومي.',
                features: ['ac', 'bluetooth', 'gps', 'backup_camera', 'cruise_control'],
                photos: [
                    { filename: 'car1.jpg' },
                    { filename: 'car2.jpg' },
                    { filename: 'car3.jpg' }
                ]
            };
            
            // Save mock car to localStorage
            existingCars.push(car);
            localStorage.setItem('mockCars', JSON.stringify(existingCars));
        }
        
        // Update car information
        updateCarInfo(car);
        
        // Load car photos
        loadCarPhotos(car);
        
        // Load car reviews
        loadCarReviews(carId);
        
    } catch (error) {
        console.error('Error loading car details:', error);
        showMessage('حدث خطأ في تحميل تفاصيل السيارة', 'error');
    }
}

// Update car information in the UI
function updateCarInfo(car) {
    document.getElementById('carName').textContent = `${car.brand} ${car.model} ${car.year}`;
    document.getElementById('carRating').textContent = '4.8'; // Mock rating
    document.getElementById('carPrice').textContent = car.daily_rate;
    document.getElementById('carOwner').textContent = car.owner_name || 'غير محدد';
    document.getElementById('carLocation').textContent = car.location;
    document.getElementById('carYear').textContent = car.year;
    document.getElementById('carTransmission').textContent = car.transmission;
    document.getElementById('carFuelType').textContent = car.fuel_type;
    document.getElementById('carMileage').textContent = car.mileage.toLocaleString();
    document.getElementById('carDescription').textContent = car.description || 'لا يوجد وصف متاح';
    
    // Update deposit amount
    document.getElementById('depositAmount').textContent = `${car.deposit} ريال`;
    
    // Update features
    updateCarFeatures(car.features);
    
    // Update delivery service information
    updateDeliveryService(car);
    
    // Setup delivery options in booking form
    setupDeliveryOptions(car);
    
    // Update booking summary with initial values
    setTimeout(() => {
        updateBookingSummary();
    }, 100);
}

// Update car features
function updateCarFeatures(features) {
    const featuresContainer = document.getElementById('carFeatures');
    featuresContainer.innerHTML = '';
    
    const featureNames = {
        'ac': 'مكيف هواء',
        'bluetooth': 'بلوتوث',
        'gps': 'نظام ملاحة',
        'backup_camera': 'كاميرا خلفية',
        'cruise_control': 'تحكم في السرعة',
        'leather_seats': 'مقاعد جلدية',
        'sunroof': 'سقف قابل للفتح',
        'child_seat': 'مقعد أطفال'
    };
    
    if (features && features.length > 0) {
        features.forEach(feature => {
            const featureItem = document.createElement('div');
            featureItem.className = 'feature-item';
            featureItem.innerHTML = `
                <i class="fas fa-check"></i>
                <span>${featureNames[feature] || feature}</span>
            `;
            featuresContainer.appendChild(featureItem);
        });
    } else {
        featuresContainer.innerHTML = '<p>لا توجد مميزات محددة</p>';
    }
}

// Load car photos with actual images
function loadCarPhotos(car) {
    const gallery = document.getElementById('imageGallery');
    const mainImage = document.getElementById('mainCarImage');
    gallery.innerHTML = '';
    
    // Set main image
    let mainImageSrc = `https://via.placeholder.com/600x400/007bff/ffffff?text=${car.brand}+${car.model}`;
    
    if (car.photos && car.photos.length > 0) {
        const firstPhoto = car.photos[0];
        if (firstPhoto.preview) {
            mainImageSrc = firstPhoto.preview;
        } else if (firstPhoto.filename) {
            mainImageSrc = firstPhoto.filename;
        }
    }
    
    mainImage.src = mainImageSrc;
    mainImage.alt = `${car.brand} ${car.model}`;
    
    // Load gallery images
    if (car.photos && car.photos.length > 0) {
        car.photos.forEach((photo, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            if (index === 0) galleryItem.classList.add('active');
            
            const img = document.createElement('img');
            
            if (photo.preview) {
                img.src = photo.preview;
            } else if (photo.filename) {
                img.src = photo.filename;
            } else {
                img.src = `https://via.placeholder.com/150x100/007bff/ffffff?text=صورة+${index + 1}`;
            }
            
            img.alt = `صورة السيارة ${index + 1}`;
            
            galleryItem.appendChild(img);
            
            galleryItem.onclick = () => {
                // إزالة الفئة النشطة من جميع العناصر
                gallery.querySelectorAll('.gallery-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // إضافة الفئة النشطة للعنصر المحدد
                galleryItem.classList.add('active');
                
                // تغيير الصورة الرئيسية
                mainImage.src = img.src;
                mainImage.alt = img.alt;
            };
            
            gallery.appendChild(galleryItem);
        });
    } else {
        // Create placeholder images if no photos
        for (let i = 1; i <= 3; i++) {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            if (i === 1) galleryItem.classList.add('active');
            
            const img = document.createElement('img');
            img.src = `https://via.placeholder.com/150x100/007bff/ffffff?text=صورة+${i}`;
            img.alt = `صورة السيارة ${i}`;
            
            galleryItem.appendChild(img);
            
            galleryItem.onclick = () => {
                // إزالة الفئة النشطة من جميع العناصر
                gallery.querySelectorAll('.gallery-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // إضافة الفئة النشطة للعنصر المحدد
                galleryItem.classList.add('active');
                
                // تغيير الصورة الرئيسية
                mainImage.src = img.src;
                mainImage.alt = img.alt;
            };
            
            gallery.appendChild(galleryItem);
        }
    }
}

// Setup booking form
function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    // Set minimum dates
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    endDateInput.min = today;
    
    // Check if there are search dates from homepage
    const searchStartDate = localStorage.getItem('searchStartDate');
    const searchEndDate = localStorage.getItem('searchEndDate');
    
    if (searchStartDate && searchEndDate) {
        // Pre-fill dates from search
        startDateInput.value = searchStartDate;
        endDateInput.value = searchEndDate;
        
        // Clear the stored dates
        localStorage.removeItem('searchStartDate');
        localStorage.removeItem('searchEndDate');
    }
    
    // Update end date minimum when start date changes
    startDateInput.addEventListener('change', function() {
        endDateInput.min = this.value;
        if (endDateInput.value && endDateInput.value < this.value) {
            endDateInput.value = this.value;
        }
        updateBookingSummary();
    });
    
    // Update summary when dates change
    startDateInput.addEventListener('change', updateBookingSummary);
    endDateInput.addEventListener('change', updateBookingSummary);
    
    // Handle form submission
    form.addEventListener('submit', handleBookingSubmission);
    
    // Initial summary update
    updateBookingSummary();
}

// Update booking summary
function updateBookingSummary() {
    console.log('updateBookingSummary called'); // Debug log
    
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // Get car data for accurate pricing
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
    const car = cars.find(c => c.id == carId);
    
    console.log('Car found:', car); // Debug log
    
    const dailyRate = car ? car.daily_rate : 150;
    const deposit = car ? car.deposit : 500;
    
    // Get delivery choice
    const deliveryChoice = document.querySelector('input[name="deliveryChoice"]:checked')?.value || 'no';
    const deliveryFee = getDeliveryFee();
    
    console.log('Daily rate:', dailyRate, 'Deposit:', deposit, 'Delivery choice:', deliveryChoice, 'Delivery fee:', deliveryFee); // Debug log
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        
        console.log('Days calculated:', days); // Debug log
        
        if (days > 0) {
            const basePrice = days * dailyRate;
            const totalPrice = deliveryChoice === 'yes' ? basePrice + deliveryFee : basePrice;
            
            console.log('Base price:', basePrice, 'Total price:', totalPrice); // Debug log
            
            const totalDaysElement = document.getElementById('totalDays');
            const totalPriceElement = document.getElementById('totalPrice');
            const depositAmountElement = document.getElementById('depositAmount');
            
            if (totalDaysElement) totalDaysElement.textContent = days;
            if (totalPriceElement) totalPriceElement.textContent = `${totalPrice} ريال`;
            if (depositAmountElement) depositAmountElement.textContent = `${deposit} ريال`;
            
            // Update delivery fee display in summary if delivery is selected
            updateDeliveryFeeInSummary(deliveryChoice, deliveryFee);
        } else {
            const totalDaysElement = document.getElementById('totalDays');
            const totalPriceElement = document.getElementById('totalPrice');
            const depositAmountElement = document.getElementById('depositAmount');
            
            if (totalDaysElement) totalDaysElement.textContent = '0';
            if (totalPriceElement) totalPriceElement.textContent = '0 ريال';
            if (depositAmountElement) depositAmountElement.textContent = `${deposit} ريال`;
            updateDeliveryFeeInSummary('no', 0);
        }
    } else {
        const totalDaysElement = document.getElementById('totalDays');
        const totalPriceElement = document.getElementById('totalPrice');
        const depositAmountElement = document.getElementById('depositAmount');
        
        if (totalDaysElement) totalDaysElement.textContent = '0';
        if (totalPriceElement) totalPriceElement.textContent = '0 ريال';
        if (depositAmountElement) depositAmountElement.textContent = `${deposit} ريال`;
        updateDeliveryFeeInSummary('no', 0);
    }
}

// Get delivery fee from car data
function getDeliveryFee() {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    
    if (carId) {
        const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
        const car = cars.find(c => c.id == carId);
        return car?.delivery_fee || 0;
    }
    
    return 0;
}

// Update delivery fee display in booking summary
function updateDeliveryFeeInSummary(deliveryChoice, deliveryFee) {
    // Get car data for accurate deposit
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
    const car = cars.find(c => c.id == carId);
    const deposit = car ? car.deposit : 500;
    
    // Update deposit amount
    const depositElement = document.getElementById('depositAmount');
    if (depositElement) {
        depositElement.textContent = `${deposit} ريال`;
    }
    
    // Handle delivery fee display
    const bookingSummary = document.querySelector('.booking-summary');
    if (bookingSummary) {
        // Remove existing delivery fee item if any
        const existingDeliveryFee = bookingSummary.querySelector('.delivery-fee-item');
        if (existingDeliveryFee) {
            existingDeliveryFee.remove();
        }
        
        // Add delivery fee item if delivery is chosen and fee > 0
        if (deliveryChoice === 'yes' && deliveryFee > 0) {
            const totalDaysElement = document.getElementById('totalDays');
            if (totalDaysElement) {
                const deliveryFeeItem = document.createElement('div');
                deliveryFeeItem.className = 'summary-item delivery-fee-item';
                deliveryFeeItem.innerHTML = `
                    <span>رسوم التوصيل:</span>
                    <span>${deliveryFee} ريال</span>
                `;
                
                // Insert after total days
                totalDaysElement.parentElement.after(deliveryFeeItem);
            }
        }
    }
}

// Handle booking submission with mock functionality
async function handleBookingSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = {
        car_id: new URLSearchParams(window.location.search).get('id'),
        start_date: formData.get('startDate'),
        end_date: formData.get('endDate'),
        pickup_location: formData.get('pickupLocation'),
        return_location: formData.get('returnLocation'),
        renter_notes: formData.get('renterNotes'),
        delivery_choice: formData.get('deliveryChoice') || 'no'
    };
    
    // Validate dates
    const startDate = new Date(bookingData.start_date);
    const endDate = new Date(bookingData.end_date);
    
    if (endDate <= startDate) {
        showMessage('تاريخ النهاية يجب أن يكون بعد تاريخ البداية', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إنشاء الحجز...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Calculate total amount using the same logic as payment summary
        const startDate = new Date(bookingData.start_date);
        const endDate = new Date(bookingData.end_date);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        // Get car data for accurate pricing
        const urlParams = new URLSearchParams(window.location.search);
        const carId = urlParams.get('id');
        const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
        const car = cars.find(c => c.id == carId);
        const dailyRate = car ? car.daily_rate : 150;
        
        const baseAmount = days * dailyRate;
        const deliveryFee = bookingData.delivery_choice === 'yes' ? getDeliveryFee() : 0;
        const totalAmount = baseAmount + deliveryFee;
        
        console.log('📊 Booking calculation:', {
            days: days,
            dailyRate: dailyRate,
            baseAmount: baseAmount,
            deliveryChoice: bookingData.delivery_choice,
            deliveryFee: deliveryFee,
            totalAmount: totalAmount
        });
        
        // Get current user data
        const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
        const currentUserId = currentUser.id || 1;
        
        // Mock successful booking
        const mockBooking = {
            id: Date.now(),
            car_id: bookingData.car_id,
            renter_id: currentUserId, // Add renter ID
            car_name: car ? `${car.brand} ${car.model} ${car.year}` : 'سيارة غير محددة',
            car_brand: car ? car.brand : '',
            car_model: car ? car.model : '',
            car_year: car ? car.year : '',
            start_date: bookingData.start_date,
            end_date: bookingData.end_date,
            status: 'pending',
            total_amount: totalAmount,
            daily_rate: dailyRate, // Add daily rate to booking
            deposit_amount: car ? car.deposit : 500,
            delivery_choice: bookingData.delivery_choice,
            delivery_fee: deliveryFee,
            pickup_location: bookingData.pickup_location || 'موقع الاستلام',
            return_location: bookingData.return_location || 'موقع الإرجاع',
            renter_notes: bookingData.renter_notes || '',
            created_at: new Date().toISOString(),
            owner_name: car ? (car.owner_name || 'مالك السيارة') : 'مالك السيارة',
            owner_phone: car ? (car.owner_phone || '+966500000000') : '+966500000000'
        };
        
        // Ensure car data is saved to mockCars if not exists
        if (car && !JSON.parse(localStorage.getItem('mockCars') || '[]').find(c => c.id == car.id)) {
            const existingCars = JSON.parse(localStorage.getItem('mockCars') || '[]');
            existingCars.push(car);
            localStorage.setItem('mockCars', JSON.stringify(existingCars));
            console.log('💾 Saved car data to mockCars:', car);
        }
        
        // Store booking in localStorage for demo purposes
        const existingBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        existingBookings.push(mockBooking);
        localStorage.setItem('mockBookings', JSON.stringify(existingBookings));
        
        showMessage('تم إنشاء الحجز بنجاح! سيتم توجيهك لصفحة الدفع', 'success');
        
        // Reset form
        e.target.reset();
        updateBookingSummary();
        
        // Redirect to payment page after 2 seconds
        setTimeout(() => {
            window.location.href = `payment.html?booking_id=${mockBooking.id}`;
        }, 2000);
        
    } catch (error) {
        console.error('Booking error:', error);
        showMessage('حدث خطأ أثناء إنشاء الحجز', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Calculate total amount
function calculateTotalAmount(startDate, endDate, deliveryChoice = 'no') {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // Get car data for accurate pricing
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    const cars = JSON.parse(localStorage.getItem('mockCars') || '[]');
    const car = cars.find(c => c.id == carId);
    const dailyRate = car ? car.daily_rate : 150;
    
    const baseAmount = days * dailyRate;
    
    // Add delivery fee if delivery is chosen
    if (deliveryChoice === 'yes') {
        const deliveryFee = getDeliveryFee();
        return baseAmount + deliveryFee;
    }
    
    return baseAmount;
}

// Show message function
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    const messageContent = messageContainer.querySelector('.message-content');
    const messageIcon = messageContent.querySelector('.message-icon');
    const messageText = messageContent.querySelector('.message-text');

    messageText.textContent = message;
    
    // Set icon and class based on message type
    if (type === 'success') {
        messageIcon.className = 'message-icon fas fa-check-circle';
        messageContainer.className = 'message-container success';
    } else if (type === 'error') {
        messageIcon.className = 'message-icon fas fa-exclamation-circle';
        messageContainer.className = 'message-container error';
    }

    messageContainer.style.display = 'block';

    // Auto hide after 5 seconds
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}

// Load car reviews
async function loadCarReviews(carId) {
    try {
        // Mock reviews data
        const mockReviews = [
            {
                id: 1,
                reviewer_name: 'محمد أحمد',
                rating: 5,
                comment: 'سيارة ممتازة وحالة جيدة جداً، المالك متعاون والتواصل كان سلس.',
                created_at: '2024-01-15T10:00:00Z'
            },
            {
                id: 2,
                reviewer_name: 'فاطمة علي',
                rating: 4,
                comment: 'تجربة جيدة، السيارة نظيفة والخدمة ممتازة.',
                created_at: '2024-01-10T14:30:00Z'
            },
            {
                id: 3,
                reviewer_name: 'علي حسن',
                rating: 5,
                comment: 'أفضل تجربة حجز سيارة، أنصح بها بشدة.',
                created_at: '2024-01-05T09:15:00Z'
            }
        ];
        
        // Calculate average rating
        const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;
        
        // Display average rating
        displayAverageRating(averageRating, mockReviews.length);
        
        // Display reviews
        displayReviews(mockReviews);
        
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

// Display average rating
function displayAverageRating(averageRating, totalReviews) {
    const averageRatingDiv = document.getElementById('averageRating');
    
    const stars = '★'.repeat(Math.floor(averageRating)) + '☆'.repeat(5 - Math.floor(averageRating));
    
    averageRatingDiv.innerHTML = `
        <div class="average-score">${averageRating.toFixed(1)}</div>
        <div class="average-stars">
            ${Array.from({length: 5}, (_, i) => 
                `<i class="fas fa-star ${i < Math.floor(averageRating) ? 'text-warning' : ''}"></i>`
            ).join('')}
        </div>
        <div class="rating-stats">
            <div class="rating-stat">
                <span>${totalReviews} تقييم</span>
            </div>
        </div>
    `;
}

// Display reviews
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="no-reviews">لا توجد تقييمات بعد</p>';
        return;
    }
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        ${review.reviewer_name.charAt(0)}
                    </div>
                    <div>
                        <div class="reviewer-name">${review.reviewer_name}</div>
                        <div class="review-date">${new Date(review.created_at).toLocaleDateString('ar-SA')}</div>
                    </div>
                </div>
                <div class="review-rating">
                    <div class="review-stars">
                        ${Array.from({length: 5}, (_, i) => 
                            `<i class="fas fa-star ${i < review.rating ? 'text-warning' : ''}"></i>`
                        ).join('')}
                    </div>
                    <span class="review-score">${review.rating}/5</span>
                </div>
            </div>
            ${review.comment ? `<div class="review-comment">${review.comment}</div>` : ''}
        </div>
    `).join('');
}

// Logout function
function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    localStorage.removeItem('rememberMe');
    
    window.location.href = 'index.html';
}

// Setup favorite button
function setupFavoriteButton(carId) {
    try {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const isFavorite = favorites.includes(parseInt(carId));
        
        updateFavoriteButtonUI(isFavorite);
    } catch (error) {
        console.error('Error setting up favorite button:', error);
    }
}

// Toggle favorite function
function toggleFavorite() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const carId = parseInt(urlParams.get('id'));
        
        if (!carId) {
            showMessage('معرف السيارة غير صحيح', 'error');
            return;
        }
        
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const isFavorite = favorites.includes(carId);
        
        if (isFavorite) {
            // Remove from favorites
            const updatedFavorites = favorites.filter(id => id !== carId);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            showMessage('تم إزالة السيارة من المفضلة', 'success');
        } else {
            // Add to favorites
            favorites.push(carId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            showMessage('تم إضافة السيارة للمفضلة', 'success');
        }
        
        // Update button appearance
        updateFavoriteButtonUI(!isFavorite);
        
    } catch (error) {
        console.error('Error toggling favorite:', error);
        showMessage('حدث خطأ في تحديث المفضلة', 'error');
    }
}

// Update favorite button UI
function updateFavoriteButtonUI(isFavorite) {
    const favoriteBtn = document.getElementById('favoriteBtn');
    const favoriteIcon = favoriteBtn.querySelector('i');
    const favoriteText = favoriteBtn.querySelector('.favorite-text');
    
    if (isFavorite) {
        favoriteBtn.classList.add('active');
        favoriteIcon.className = 'fas fa-heart';
        favoriteText.textContent = 'إزالة من المفضلة';
    } else {
        favoriteBtn.classList.remove('active');
        favoriteIcon.className = 'far fa-heart';
        favoriteText.textContent = 'أضف للمفضلة';
    }
}

// Update delivery service information
function updateDeliveryService(car) {
    const deliveryInfo = document.getElementById('deliveryInfo');
    
    if (!deliveryInfo) {
        console.error('Delivery info element not found');
        return;
    }
    
    const deliveryService = car.delivery_service || false;
    const deliveryFee = car.delivery_fee || null;
    const deliveryNote = car.delivery_note || null;
    
    let deliveryHTML = '';
    
    if (deliveryService) {
        // Delivery service is available
        deliveryHTML = `
            <div class="delivery-status delivery-available">
                <i class="fas fa-check-circle"></i>
                <span>خدمة التوصيل متاحة</span>
            </div>
        `;
        
        // Add delivery fee if available
        if (deliveryFee) {
            deliveryHTML += `
                <div class="delivery-fee">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>رسوم التوصيل: ${deliveryFee} ريال</span>
                </div>
            `;
        }
        
        // Add delivery note if available
        if (deliveryNote) {
            deliveryHTML += `
                <div class="delivery-note">
                    <i class="fas fa-info-circle"></i>
                    <span>${deliveryNote}</span>
                </div>
            `;
        }
    } else {
        // Delivery service is not available
        deliveryHTML = `
            <div class="delivery-status delivery-not-available">
                <i class="fas fa-times-circle"></i>
                <span>خدمة التوصيل غير متاحة</span>
            </div>
        `;
    }
    
    deliveryInfo.innerHTML = deliveryHTML;
}

// Setup delivery options in booking form
function setupDeliveryOptions(car) {
    const deliveryOptionSection = document.getElementById('deliveryOptionSection');
    const deliveryOption = document.getElementById('deliveryOption');
    const deliveryFeeDisplay = document.getElementById('deliveryFeeDisplay');
    const deliveryNoteDisplay = document.getElementById('deliveryNoteDisplay');
    
    if (!deliveryOptionSection) {
        console.error('Delivery option section not found');
        return;
    }
    
    const deliveryService = car.delivery_service || false;
    const deliveryFee = car.delivery_fee || null;
    const deliveryNote = car.delivery_note || null;
    
    if (deliveryService) {
        // Show delivery options section
        deliveryOptionSection.style.display = 'block';
        
        // Update delivery fee display
        if (deliveryFee !== null) {
            const feeText = deliveryFee === 0 ? 'مجاني' : `${deliveryFee} ريال`;
            deliveryFeeDisplay.textContent = `(${feeText})`;
            deliveryFeeDisplay.style.display = 'inline';
        } else {
            deliveryFeeDisplay.style.display = 'none';
        }
        
        // Update delivery note display
        if (deliveryNote) {
            deliveryNoteDisplay.innerHTML = `
                <i class="fas fa-info-circle"></i>
                <span>${deliveryNote}</span>
            `;
            deliveryNoteDisplay.style.display = 'block';
        } else {
            deliveryNoteDisplay.style.display = 'none';
        }
        
        // Add event listeners for delivery options
        setupDeliveryOptionListeners();
        
    } else {
        // Hide delivery options section if service is not available
        deliveryOptionSection.style.display = 'none';
    }
}

// Setup event listeners for delivery options
function setupDeliveryOptionListeners() {
    const deliveryOptions = document.querySelectorAll('input[name="deliveryChoice"]');
    const deliveryOptionElements = document.querySelectorAll('.delivery-option');
    
    console.log('Setting up delivery option listeners'); // Debug log
    
    deliveryOptions.forEach((option, index) => {
        option.addEventListener('change', function() {
            console.log('Delivery option changed:', this.value); // Debug log
            
            // Update visual selection
            deliveryOptionElements.forEach(el => el.classList.remove('selected'));
            if (this.checked) {
                deliveryOptionElements[index].classList.add('selected');
            }
            
            // Update booking summary
            updateBookingSummary();
        });
    });
    
    // Add click listeners to option containers
    deliveryOptionElements.forEach((element, index) => {
        element.addEventListener('click', function() {
            console.log('Delivery option clicked:', index); // Debug log
            deliveryOptions[index].checked = true;
            deliveryOptions[index].dispatchEvent(new Event('change'));
        });
    });
}
