// Favorites page functionality
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

    // Load favorites
    loadFavorites();
});

// Load favorites from localStorage
function loadFavorites() {
    try {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const existingCars = JSON.parse(localStorage.getItem('mockCars') || '[]');
        
        // Get favorite cars details
        const favoriteCars = favorites.map(carId => {
            return existingCars.find(car => car.id === carId);
        }).filter(car => car); // Remove undefined cars
        
        displayFavorites(favoriteCars);
        updateFavoritesCount(favoriteCars.length);
        
    } catch (error) {
        console.error('Error loading favorites:', error);
        showMessage('حدث خطأ في تحميل المفضلة', 'error');
    }
}

// Display favorites in the grid
function displayFavorites(cars) {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const emptyState = document.getElementById('emptyState');
    const clearFavorites = document.getElementById('clearFavorites');
    
    if (cars.length === 0) {
        favoritesGrid.innerHTML = '';
        emptyState.style.display = 'block';
        clearFavorites.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    clearFavorites.style.display = 'block';
    
    favoritesGrid.innerHTML = cars.map(car => createFavoriteCard(car)).join('');
}

// Create favorite car card
function createFavoriteCard(car) {
    // Get the first photo from the car's photos array
    let imageSrc = "https://via.placeholder.com/300x200/007bff/ffffff?text=${car.brand}+${car.model}";
    let imageAlt = `${car.brand} ${car.model}`;
    
    // Format features for display
    const featuresList = car.features ? car.features.slice(0, 4).map(f => getFeatureName(f)) : [];
    
    // Format mileage
    const mileage = car.mileage ? car.mileage.toLocaleString() : 'غير محدد';
    
    // Get fuel type
    const fuelType = car.fuel_type || 'غير محدد';
    
    // Calculate discount if available
    const originalPrice = car.original_price || car.daily_rate;
    const currentPrice = car.daily_rate;
    const hasDiscount = originalPrice > currentPrice;
    const discountPercentage = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
    
    return `
        <div class="car-card favorite-card" data-car-id="${car.id}">
            <div class="car-card-header">
                <div class="car-image">
                    <img src="${imageSrc}" alt="${imageAlt}" onerror="this.src='https://via.placeholder.com/300x200/007bff/ffffff?text=${car.brand}+${car.model}'">
                    ${hasDiscount ? `<div class="discount-badge">-${discountPercentage}%</div>` : ''}
                    <div class="car-rating">
                        <div class="rating-stars">
                            ${generateStarRating(car.rating || 4.5)}
                        </div>
                        <span class="rating-score">${car.rating || '4.5'}</span>
                    </div>
                </div>
            </div>
            
            <div class="car-info">
                <div class="car-header">
                    <h3 class="car-title">${car.brand} ${car.model}</h3>
                    <span class="car-year">${car.year}</span>
                </div>
                
                <div class="car-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${car.location}</span>
                </div>
                
                <div class="car-specs">
                    <div class="spec-item">
                        <i class="fas fa-cog"></i>
                        <span>${car.transmission || 'غير محدد'}</span>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-gas-pump"></i>
                        <span>${fuelType}</span>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-road"></i>
                        <span>${mileage} كم</span>
                    </div>
                </div>
                
                <div class="car-features">
                    <div class="features-title">
                        <i class="fas fa-star"></i>
                        <span>المميزات</span>
                    </div>
                    <div class="features-list">
                        ${featuresList.map(feature => `
                            <span class="feature-tag">
                                <i class="fas fa-check"></i>
                                ${feature}
                            </span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="car-price-section">
                    <div class="price-info">
                        ${hasDiscount ? `
                            <div class="original-price">${originalPrice} ريال</div>
                        ` : ''}
                        <div class="current-price">
                            <span class="price-amount">${currentPrice}</span>
                            <span class="price-currency">ريال/يوم</span>
                        </div>
                    </div>
                    <div class="car-actions">
                        <button class="btn btn-primary btn-book" onclick="viewCarDetails(${car.id})">
                            <i class="fas fa-eye"></i>
                            عرض التفاصيل
                        </button>
                        <button class="btn btn-outline btn-favorite active" onclick="removeFromFavorites(${car.id})" title="إزالة من المفضلة">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get feature name in Arabic
function getFeatureName(feature) {
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
    
    return featureNames[feature] || feature;
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star text-warning"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star text-warning"></i>';
    }
    
    return starsHTML;
}

// Update favorites count
function updateFavoritesCount(count) {
    const countElement = document.getElementById('favoritesCount');
    countElement.textContent = count;
}

// Remove car from favorites
function removeFromFavorites(carId) {
    try {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const updatedFavorites = favorites.filter(id => id !== carId);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        
        // Remove card from UI
        const card = document.querySelector(`[data-car-id="${carId}"]`);
        if (card) {
            card.remove();
        }
        
        // Update count
        const newCount = updatedFavorites.length;
        updateFavoritesCount(newCount);
        
        // Show/hide empty state
        if (newCount === 0) {
            document.getElementById('emptyState').style.display = 'block';
            document.getElementById('clearFavorites').style.display = 'none';
        }
        
        showMessage('تم إزالة السيارة من المفضلة', 'success');
        
    } catch (error) {
        console.error('Error removing from favorites:', error);
        showMessage('حدث خطأ في إزالة السيارة من المفضلة', 'error');
    }
}

// Clear all favorites
function clearAllFavorites() {
    if (confirm('هل أنت متأكد من رغبتك في مسح جميع السيارات من المفضلة؟')) {
        try {
            localStorage.removeItem('favorites');
            
            // Clear UI
            document.getElementById('favoritesGrid').innerHTML = '';
            document.getElementById('emptyState').style.display = 'block';
            document.getElementById('clearFavorites').style.display = 'none';
            updateFavoritesCount(0);
            
            showMessage('تم مسح جميع المفضلة بنجاح', 'success');
            
        } catch (error) {
            console.error('Error clearing favorites:', error);
            showMessage('حدث خطأ في مسح المفضلة', 'error');
        }
    }
}

// Filter favorites by search
function filterFavorites() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.favorite-card');
    
    cards.forEach(card => {
        const title = card.querySelector('.car-title').textContent.toLowerCase();
        const location = card.querySelector('.car-location span').textContent.toLowerCase();
        const brand = card.querySelector('.car-title').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || location.includes(searchTerm) || brand.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filter by all (show all)
function filterByAll() {
    const cards = document.querySelectorAll('.favorite-card');
    cards.forEach(card => card.style.display = 'block');
    
    // Update active button
    updateActiveFilter('filterByAll');
}

// Filter by price (sort by price)
function filterByPrice() {
    const cards = Array.from(document.querySelectorAll('.favorite-card'));
    const favoritesGrid = document.getElementById('favoritesGrid');
    
    cards.sort((a, b) => {
        const priceA = parseInt(a.querySelector('.price-amount').textContent);
        const priceB = parseInt(b.querySelector('.price-amount').textContent);
        return priceA - priceB;
    });
    
    cards.forEach(card => favoritesGrid.appendChild(card));
    
    // Update active button
    updateActiveFilter('filterByPrice');
}

// Filter by rating (sort by rating)
function filterByRating() {
    const cards = Array.from(document.querySelectorAll('.favorite-card'));
    const favoritesGrid = document.getElementById('favoritesGrid');
    
    cards.sort((a, b) => {
        const ratingA = parseFloat(a.querySelector('.rating-score').textContent);
        const ratingB = parseFloat(b.querySelector('.rating-score').textContent);
        return ratingB - ratingA; // Highest first
    });
    
    cards.forEach(card => favoritesGrid.appendChild(card));
    
    // Update active button
    updateActiveFilter('filterByRating');
}

// Update active filter button
function updateActiveFilter(activeFunction) {
    const buttons = document.querySelectorAll('.filter-buttons .btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Find and activate the correct button
    if (activeFunction === 'filterByAll') {
        document.querySelector('[onclick="filterByAll()"]').classList.add('active');
    } else if (activeFunction === 'filterByPrice') {
        document.querySelector('[onclick="filterByPrice()"]').classList.add('active');
    } else if (activeFunction === 'filterByRating') {
        document.querySelector('[onclick="filterByRating()"]').classList.add('active');
    }
}

// View car details
function viewCarDetails(carId) {
    window.location.href = `car-details.html?id=${carId}`;
}

// Show message
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    const messageContent = messageContainer.querySelector('.message-content');
    const messageIcon = messageContent.querySelector('.message-icon');
    const messageText = messageContent.querySelector('.message-text');
    
    // Set message content
    messageText.textContent = message;
    
    // Set icon and class based on type
    if (type === 'success') {
        messageIcon.className = 'fas fa-check-circle';
        messageContent.className = 'message-content success';
    } else if (type === 'error') {
        messageIcon.className = 'fas fa-exclamation-circle';
        messageContent.className = 'message-content error';
    } else {
        messageIcon.className = 'fas fa-info-circle';
        messageContent.className = 'message-content info';
    }
    
    // Show message
    messageContainer.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        messageContainer.style.display = 'none';
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
