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

// Toggle favorite function
function toggleFavorite(carId) {
    try {
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
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            showMessage('تم إضافة السيارة للمفضلة', 'success');
        }
        
        // Update button appearance
        updateFavoriteButton(carId, !isFavorite);
        
    } catch (error) {
        console.error('Error toggling favorite:', error);
        showMessage('حدث خطأ في تحديث المفضلة', 'error');
    }
}

// Update favorite button appearance
function updateFavoriteButton(carId, isFavorite) {
    const button = document.querySelector(`[onclick="toggleFavorite(${carId})"]`);
    if (button) {
        const icon = button.querySelector('i');
        if (isFavorite) {
            icon.className = 'fas fa-heart';
            button.style.color = '#e74c3c';
        } else {
            icon.className = 'far fa-heart';
            button.style.color = '#6c757d';
        }
    }
}

// Browse Cars functionality
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

    // Load cars with mock data
    loadCars();
    
    // Setup search filters
    setupSearchFilters();
    
    // Listen for storage changes to auto-refresh cars
    window.addEventListener('storage', function(e) {
        if (e.key === 'mockCars') {
            console.log('🔄 Detected car updates, refreshing cars list...');
            loadCars();
        }
    });
    
    // Add refresh functionality
    setupRefreshButton();
});

// Setup refresh button
function setupRefreshButton() {
    const refreshBtn = document.getElementById('refreshCars');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('rotating');
            loadCars();
            setTimeout(() => {
                this.classList.remove('rotating');
            }, 1000);
        });
    }
}

// Load cars with mock data
async function loadCars() {
    try {
        console.log('🔄 Loading cars for browsing...');
        
        // Get cars from localStorage (added by users)
        const userCars = JSON.parse(localStorage.getItem('mockCars') || '[]');
        console.log(`📊 Total cars in storage: ${userCars.length}`);
        
        // Log car statuses for debugging
        userCars.forEach(car => {
            console.log(`  - Car ${car.id}: ${car.brand} ${car.model} (${car.status})`);
        });
        
        // Filter only active cars
        const activeCars = userCars.filter(car => car.status === 'active');
        console.log(`✅ Active cars found: ${activeCars.length}`);
        
        // Add some default cars if no user cars exist
        let allCars = [...activeCars];
        
        if (allCars.length === 0) {
            const defaultCars = [
                {
                    id: 1,
                    brand: 'تويوتا',
                    model: 'كامري',
                    year: '2023',
                    daily_rate: 150,
                    location: 'الرياض',
                    transmission: 'أوتوماتيك',
                    fuel_type: 'بنزين',
                    mileage: 25000,
                    rating: 4.8,
                    photos: ['car1.jpg'],
                    features: ['ac', 'bluetooth', 'gps'],
                    status: 'active'
                },
                {
                    id: 2,
                    brand: 'هيونداي',
                    model: 'سوناتا',
                    year: '2022',
                    daily_rate: 120,
                    location: 'جدة',
                    transmission: 'أوتوماتيك',
                    fuel_type: 'بنزين',
                    mileage: 30000,
                    rating: 4.6,
                    photos: ['car2.jpg'],
                    features: ['ac', 'bluetooth'],
                    status: 'active'
                },
                {
                    id: 3,
                    brand: 'مرسيدس',
                    model: 'C-Class',
                    year: '2023',
                    daily_rate: 300,
                    location: 'الدمام',
                    transmission: 'أوتوماتيك',
                    fuel_type: 'بنزين',
                    mileage: 15000,
                    rating: 4.9,
                    photos: ['car3.jpg'],
                    features: ['ac', 'bluetooth', 'gps', 'leather_seats'],
                    status: 'active'
                }
            ];
            allCars = defaultCars;
        }
        
        // Apply search parameters if they exist
        const searchParams = JSON.parse(localStorage.getItem('searchParams') || '{}');
        if (searchParams.location) {
            // Filter cars by location
            allCars = allCars.filter(car => 
                car.location.toLowerCase().includes(searchParams.location.toLowerCase())
            );
            
            // Pre-fill location filter
            const locationFilter = document.getElementById('locationFilter');
            if (locationFilter) {
                locationFilter.value = searchParams.location;
            }
        }
        
        // Store search dates for booking
        if (searchParams.startDate && searchParams.endDate) {
            localStorage.setItem('searchStartDate', searchParams.startDate);
            localStorage.setItem('searchEndDate', searchParams.endDate);
        }
        
        displayCars(allCars);
        updateResultsCount(allCars.length);
        
        // Clear search params after applying them
        localStorage.removeItem('searchParams');
        
    } catch (error) {
        console.error('Error loading cars:', error);
        showMessage('حدث خطأ في تحميل السيارات', 'error');
    }
}

// Display cars in the grid
function displayCars(cars) {
    const carsGrid = document.getElementById('carsGrid');
    carsGrid.innerHTML = '';
    
    if (cars.length === 0) {
        carsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-car"></i>
                </div>
                <h3>لا توجد سيارات متاحة</h3>
                <p>جرب تغيير معايير البحث</p>
            </div>
        `;
        return;
    }
    
    cars.forEach(car => {
        const carCard = createCarCard(car);
        carsGrid.appendChild(carCard);
    });
}

// Create car card element
function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';
    
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
    
    // Get the first photo from the car's photos array
    let imageSrc = "https://via.placeholder.com/300x200/007bff/ffffff?text=${car.brand}+${car.model}";
    let imageAlt = `${car.brand} ${car.model}`;
    
    if (car.photos && car.photos.length > 0) {
        const firstPhoto = car.photos[0];
        if (firstPhoto.preview) {
            imageSrc = firstPhoto.preview;
        } else if (firstPhoto.filename) {
            imageSrc = firstPhoto.filename;
        }
    }
    
    // Format features for display
    const featuresList = car.features ? car.features.slice(0, 4).map(f => featureNames[f] || f) : [];
    const featuresDisplay = featuresList.length > 0 ? featuresList.join(' • ') : 'مميزات أساسية';
    
    // Format mileage
    const mileage = car.mileage ? car.mileage.toLocaleString() : 'غير محدد';
    
    // Get fuel type
    const fuelType = car.fuel_type || 'غير محدد';
    
    // Calculate discount if available
    const originalPrice = car.original_price || car.daily_rate;
    const currentPrice = car.daily_rate;
    const hasDiscount = originalPrice > currentPrice;
    const discountPercentage = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
    
    card.innerHTML = `
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
                    <button class="btn btn-outline btn-favorite" onclick="toggleFavorite(${car.id})" title="إضافة للمفضلة">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Setup search filters
function setupSearchFilters() {
    const filtersForm = document.getElementById('searchFiltersForm');
    filtersForm.addEventListener('submit', function(e) {
        e.preventDefault();
        applyFilters();
    });
}

// Apply filters
function applyFilters() {
    const locationFilter = document.getElementById('locationFilter').value;
    const brandFilter = document.getElementById('brandFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const transmissionFilter = document.getElementById('transmissionFilter').value;
    
    // Get cars from localStorage
    const userCars = JSON.parse(localStorage.getItem('mockCars') || '[]');
    const activeCars = userCars.filter(car => car.status === 'active');
    
    // Add default cars if no user cars exist
    let filteredCars = [...activeCars];
    
    if (filteredCars.length === 0) {
        const defaultCars = [
            {
                id: 1,
                brand: 'تويوتا',
                model: 'كامري',
                year: '2023',
                daily_rate: 150,
                location: 'الرياض',
                transmission: 'أوتوماتيك',
                fuel_type: 'بنزين',
                mileage: 25000,
                rating: 4.8,
                photos: ['car1.jpg'],
                features: ['ac', 'bluetooth', 'gps'],
                status: 'active'
            },
            {
                id: 2,
                brand: 'هيونداي',
                model: 'سوناتا',
                year: '2022',
                daily_rate: 120,
                location: 'جدة',
                transmission: 'أوتوماتيك',
                fuel_type: 'بنزين',
                mileage: 30000,
                rating: 4.6,
                photos: ['car2.jpg'],
                features: ['ac', 'bluetooth'],
                status: 'active'
            },
            {
                id: 3,
                brand: 'مرسيدس',
                model: 'C-Class',
                year: '2023',
                daily_rate: 300,
                location: 'الدمام',
                transmission: 'أوتوماتيك',
                fuel_type: 'بنزين',
                mileage: 15000,
                rating: 4.9,
                photos: ['car3.jpg'],
                features: ['ac', 'bluetooth', 'gps', 'leather_seats'],
                status: 'active'
            }
        ];
        filteredCars = defaultCars;
    }
    
    // Apply location filter
    if (locationFilter) {
        filteredCars = filteredCars.filter(car => car.location === locationFilter);
    }
    
    // Apply brand filter
    if (brandFilter) {
        filteredCars = filteredCars.filter(car => car.brand === brandFilter);
    }
    
    // Apply price filter
    if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(Number);
        if (max) {
            filteredCars = filteredCars.filter(car => car.daily_rate >= min && car.daily_rate <= max);
        } else {
            filteredCars = filteredCars.filter(car => car.daily_rate >= min);
        }
    }
    
    // Apply transmission filter
    if (transmissionFilter) {
        filteredCars = filteredCars.filter(car => car.transmission === transmissionFilter);
    }
    
    displayCars(filteredCars);
    updateResultsCount(filteredCars.length);
}

// Clear filters
function clearFilters() {
    document.getElementById('locationFilter').value = '';
    document.getElementById('brandFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('transmissionFilter').value = '';
    
    loadCars();
}

// Sort cars
function sortCars() {
    const sortBy = document.getElementById('sortBy').value;
    const carsGrid = document.getElementById('carsGrid');
    const cars = Array.from(carsGrid.children);
    
    cars.sort((a, b) => {
        const priceA = parseInt(a.querySelector('.price').textContent);
        const priceB = parseInt(b.querySelector('.price').textContent);
        const ratingA = parseFloat(a.querySelector('.car-rating span').textContent);
        const ratingB = parseFloat(b.querySelector('.car-rating span').textContent);
        
        switch (sortBy) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'rating':
                return ratingB - ratingA;
            default:
                return 0;
        }
    });
    
    cars.forEach(car => carsGrid.appendChild(car));
}

// Update results count
function updateResultsCount(count) {
    document.getElementById('resultsCount').textContent = count;
}

// View car details
function viewCarDetails(carId) {
    // Redirect to car details page
    window.location.href = `car-details.html?id=${carId}`;
}

// Load more cars (mock implementation)
function loadMoreCars() {
    // This would load more cars in a real implementation
    showMessage('تم تحميل المزيد من السيارات', 'success');
}

// Show message function
function showMessage(message, type) {
    // Create a simple message display
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
