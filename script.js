// Main page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize money counter
    initializeMoneyCounter();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize cars section functionality
    initializeCarsSection();
});



// Initialize money counter
function initializeMoneyCounter() {
    const daySlider = document.getElementById('daySlider');
    const sliderFill = document.getElementById('sliderFill');
    const sliderThumb = document.getElementById('sliderThumb');
    const currentDay = document.getElementById('currentDay');
    const monthlyAmount = document.getElementById('monthlyAmount');
    const totalDays = document.getElementById('totalDays');
    const totalEarnings = document.getElementById('totalEarnings');
    const monthlyProjection = document.getElementById('monthlyProjection');
    
    const dailyRate = 150; // ريال يومياً
    
    function updateCounter() {
        const days = parseInt(daySlider.value);
        const earnings = days * dailyRate;
        const monthlyProjectionValue = earnings * 30 / days; // تقدير شهري
        
        // Update display
        currentDay.textContent = `اليوم ${days}`;
        monthlyAmount.textContent = earnings.toLocaleString();
        totalDays.textContent = days;
        totalEarnings.textContent = earnings.toLocaleString();
        monthlyProjection.textContent = Math.round(monthlyProjectionValue).toLocaleString();
        
        // Update slider fill
        const percentage = (days - 1) / 29 * 100; // 29 is max - min
        sliderFill.style.width = `${percentage}%`;
        
        // Update thumb position
        sliderThumb.style.left = `${percentage}%`;
    }
    
    // Initial update
    updateCounter();
    
    // Slider change handler
    daySlider.addEventListener('input', updateCounter);
    
    // Add smooth animation
    daySlider.addEventListener('mousedown', function() {
        sliderThumb.style.transition = 'none';
    });
    
    daySlider.addEventListener('mouseup', function() {
        sliderThumb.style.transition = 'left 0.3s ease';
    });
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Show message function
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add CSS for message content
    const messageContent = messageDiv.querySelector('.message-content');
    messageContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    // Add styles for close button
    const closeBtn = messageDiv.querySelector('button');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-right: 0;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add hover effects to category cards
document.addEventListener('DOMContentLoaded', function() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        });
    });
});

// Add click handlers for category cards
document.addEventListener('DOMContentLoaded', function() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // Store category preference
            const categoryName = this.querySelector('h4').textContent;
            localStorage.setItem('selectedCategory', categoryName);
            
            // Redirect to browse cars
            window.location.href = 'browse-cars.html';
        });
    });
});

// Add navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Add CSS for navbar scroll effect and search suggestions
const navbarStyle = document.createElement('style');
navbarStyle.textContent = `
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .search-box {
        transition: all 0.3s ease;
    }
    
    .search-box:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .search-input input {
        transition: border-color 0.3s ease;
    }
    
    .search-input input:focus {
        border-color: #3b82f6;
        outline: none;
    }
    
    .search-btn {
        transition: all 0.3s ease;
    }
    
    .search-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
    }
    
    .search-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }
    
    .search-suggestions {
        margin-top: 15px;
        text-align: center;
    }
    
    .suggestion-label {
        color: #6b7280;
        font-size: 0.9rem;
        margin-left: 10px;
    }
    
    .suggestion-btn {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
        border: 1px solid rgba(59, 130, 246, 0.2);
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        margin: 0 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .suggestion-btn:hover {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
        transform: translateY(-1px);
    }
    
    .hero-search {
        animation: fadeInUp 0.8s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(navbarStyle);

// Initialize cars section functionality
function initializeCarsSection() {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const carTypeFilter = document.getElementById('carTypeFilter');
    const cityFilter = document.getElementById('cityFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyCarFilters();
        });
    }
    
    // Add event listeners for filter changes
    if (carTypeFilter) {
        carTypeFilter.addEventListener('change', function() {
            applyCarFilters();
        });
    }
    
    if (cityFilter) {
        cityFilter.addEventListener('change', function() {
            applyCarFilters();
        });
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', function() {
            applyCarFilters();
        });
    }
}

// Apply car filters
function applyCarFilters() {
    const carTypeFilter = document.getElementById('carTypeFilter');
    const cityFilter = document.getElementById('cityFilter');
    const priceFilter = document.getElementById('priceFilter');
    const carsGrid = document.getElementById('carsGrid');
    
    if (!carsGrid) return;
    
    const selectedType = carTypeFilter ? carTypeFilter.value : '';
    const selectedCity = cityFilter ? cityFilter.value : '';
    const selectedPrice = priceFilter ? priceFilter.value : '';
    
    const carCards = carsGrid.querySelectorAll('.car-card');
    
    carCards.forEach(card => {
        let showCard = true;
        
        // Filter by car type
        if (selectedType) {
            const carBadge = card.querySelector('.car-badge');
            if (carBadge) {
                const carType = carBadge.classList.contains(selectedType);
                if (!carType) {
                    showCard = false;
                }
            }
        }
        
        // Filter by city
        if (selectedCity && showCard) {
            const citySpan = card.querySelector('.car-details span:first-child');
            if (citySpan) {
                const cityText = citySpan.textContent;
                if (!cityText.includes(selectedCity)) {
                    showCard = false;
                }
            }
        }
        
        // Filter by price
        if (selectedPrice && showCard) {
            const priceSpan = card.querySelector('.price');
            if (priceSpan) {
                const price = parseInt(priceSpan.textContent);
                const [minPrice, maxPrice] = selectedPrice.split('-').map(p => {
                    if (p.includes('+')) {
                        return Infinity;
                    }
                    return parseInt(p);
                });
                
                if (price < minPrice || (maxPrice !== Infinity && price > maxPrice)) {
                    showCard = false;
                }
            }
        }
        
        // Show/hide card
        if (showCard) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no cars found
    const visibleCards = Array.from(carCards).filter(card => card.style.display !== 'none');
    if (visibleCards.length === 0) {
        showMessage('لا توجد سيارات تطابق الفلاتر المحددة', 'info');
    }
}

// Expand search function
window.expandSearch = function() {
    const searchBox = document.querySelector('.hero-search');
    if (searchBox) {
        searchBox.scrollIntoView({ behavior: 'smooth' });
        const locationInput = document.getElementById('searchLocation');
        if (locationInput) {
            locationInput.focus();
        }
    }
};

// Add CSS for car filters animation
const carFiltersStyle = document.createElement('style');
carFiltersStyle.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .car-card {
        animation: fadeIn 0.5s ease-in-out;
    }
    
    .cars-filters {
        animation: fadeIn 0.8s ease-in-out;
    }
    
    .cars-grid {
        animation: fadeIn 1s ease-in-out;
    }
`;
document.head.appendChild(carFiltersStyle);
