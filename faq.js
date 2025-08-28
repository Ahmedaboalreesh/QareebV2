// FAQ page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQ functionality
    initializeFAQ();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize category filtering
    initializeCategoryFilter();
    
    // Initialize navbar scroll effect
    initializeNavbarScroll();
});

// Initialize FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('faqSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchFAQ();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchFAQ();
            }
        });
    }
}

// Search FAQ function
function searchFAQ() {
    const searchTerm = document.getElementById('faqSearch').value.toLowerCase().trim();
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (searchTerm === '') {
        // Show all items if search is empty
        faqItems.forEach(item => {
            item.style.display = 'block';
        });
        return;
    }
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
            // Highlight search term
            highlightSearchTerm(item, searchTerm);
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show search results message
    showSearchResults(searchTerm);
}

// Highlight search term
function highlightSearchTerm(item, searchTerm) {
    const question = item.querySelector('.faq-question h3');
    const answer = item.querySelector('.faq-answer p');
    
    // Remove existing highlights
    question.innerHTML = question.innerHTML.replace(/<mark class="highlight">(.*?)<\/mark>/g, '$1');
    answer.innerHTML = answer.innerHTML.replace(/<mark class="highlight">(.*?)<\/mark>/g, '$1');
    
    // Add new highlights
    const questionText = question.textContent;
    const answerText = answer.textContent;
    
    const highlightedQuestion = questionText.replace(new RegExp(searchTerm, 'gi'), `<mark class="highlight">$&</mark>`);
    const highlightedAnswer = answerText.replace(new RegExp(searchTerm, 'gi'), `<mark class="highlight">$&</mark>`);
    
    question.innerHTML = highlightedQuestion;
    answer.innerHTML = highlightedAnswer;
}

// Show search results message
function showSearchResults(searchTerm) {
    const visibleItems = document.querySelectorAll('.faq-item[style="display: block"]');
    const totalItems = document.querySelectorAll('.faq-item');
    
    // Remove existing message
    const existingMessage = document.querySelector('.search-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (searchTerm !== '') {
        const message = document.createElement('div');
        message.className = 'search-results-message';
        message.innerHTML = `
            <p>تم العثور على ${visibleItems.length} نتيجة من أصل ${totalItems.length} سؤال</p>
            <button onclick="clearSearch()" class="clear-search-btn">
                <i class="fas fa-times"></i>
                مسح البحث
            </button>
        `;
        
        const searchContainer = document.querySelector('.faq-search');
        searchContainer.appendChild(message);
    }
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById('faqSearch');
    searchInput.value = '';
    
    // Show all items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.style.display = 'block';
        // Remove highlights
        const question = item.querySelector('.faq-question h3');
        const answer = item.querySelector('.faq-answer p');
        question.innerHTML = question.innerHTML.replace(/<mark class="highlight">(.*?)<\/mark>/g, '$1');
        answer.innerHTML = answer.innerHTML.replace(/<mark class="highlight">(.*?)<\/mark>/g, '$1');
    });
    
    // Remove search results message
    const existingMessage = document.querySelector('.search-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Initialize category filtering
function initializeCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.faq-category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter FAQ items
            filterByCategory(category);
        });
    });
}

// Filter by category
function filterByCategory(category) {
    const faqCategories = document.querySelectorAll('.faq-category');
    
    if (category === 'all') {
        // Show all categories
        faqCategories.forEach(cat => {
            cat.style.display = 'block';
        });
    } else {
        // Show only selected category
        faqCategories.forEach(cat => {
            if (cat.getAttribute('data-category') === category) {
                cat.style.display = 'block';
            } else {
                cat.style.display = 'none';
            }
        });
    }
    
    // Clear search when changing category
    clearSearch();
}

// Initialize navbar scroll effect
function initializeNavbarScroll() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Add CSS for FAQ page
const faqStyles = document.createElement('style');
faqStyles.textContent = `
    .faq-section {
        margin-top: 80px;
        padding: 60px 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
    }
    
    .faq-header {
        text-align: center;
        margin-bottom: 50px;
        color: white;
    }
    
    .faq-header h1 {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .faq-header p {
        font-size: 1.2rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
    }
    
    .faq-search {
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 30px;
        margin-bottom: 40px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.2);
    }
    
    .search-container {
        position: relative;
        max-width: 600px;
        margin: 0 auto;
    }
    
    .search-container i {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        color: #667eea;
        font-size: 1.2rem;
        z-index: 2;
    }
    
    .search-input {
        width: 100%;
        padding: 18px 60px 18px 20px;
        border: 2px solid #e9ecef;
        border-radius: 15px;
        font-size: 1.1rem;
        font-family: 'Cairo', sans-serif;
        transition: all 0.3s ease;
        background: white;
    }
    
    .search-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .search-btn {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 12px 15px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
    }
    
    .search-btn:hover {
        transform: translateY(-50%) scale(1.05);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }
    
    .faq-categories {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 40px;
    }
    
    .faq-category-btn {
        background: rgba(255,255,255,0.9);
        color: #333;
        border: 2px solid #e9ecef;
        padding: 12px 25px;
        border-radius: 25px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .faq-category-btn:hover {
        background: #667eea;
        color: white;
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }
    
    .faq-category-btn.active {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }
    
    .faq-category-btn i {
        font-size: 1.1rem;
    }
    
    .faq-content {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    .faq-category {
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 40px;
        margin-bottom: 30px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        transition: all 0.3s ease;
    }
    
    .faq-category:hover {
        transform: translateY(-5px);
        box-shadow: 0 25px 50px rgba(0,0,0,0.15);
    }
    
    .faq-category h2 {
        color: #333;
        font-size: 2rem;
        margin-bottom: 30px;
        font-weight: 700;
        border-bottom: 3px solid #667eea;
        padding-bottom: 15px;
        text-align: center;
    }
    
    .faq-item {
        background: #f8f9fa;
        border-radius: 15px;
        margin-bottom: 20px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
        overflow: hidden;
    }
    
    .faq-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        border-color: #667eea;
    }
    
    .faq-item.active {
        background: white;
        border-color: #667eea;
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
    }
    
    .faq-question {
        padding: 25px 30px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s ease;
        background: transparent;
    }
    
    .faq-question:hover {
        background: rgba(102, 126, 234, 0.05);
    }
    
    .faq-question h3 {
        color: #333;
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0;
        flex: 1;
        padding-left: 20px;
    }
    
    .faq-question i {
        color: #667eea;
        font-size: 1.2rem;
        transition: transform 0.3s ease;
        flex-shrink: 0;
    }
    
    .faq-item.active .faq-question i {
        transform: rotate(180deg);
    }
    
    .faq-answer {
        display: none;
        padding: 0 30px 25px 30px;
        border-top: 1px solid #e9ecef;
        background: white;
    }
    
    .faq-item.active .faq-answer {
        display: block;
    }
    
    .faq-answer p {
        color: #666;
        line-height: 1.8;
        margin: 0;
        font-size: 1.1rem;
    }
    
    .faq-support {
        text-align: center;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 40px;
        margin-top: 40px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.2);
    }
    
    .faq-support h2 {
        color: #333;
        font-size: 2rem;
        margin-bottom: 15px;
        font-weight: 700;
    }
    
    .faq-support p {
        color: #666;
        font-size: 1.1rem;
        margin-bottom: 30px;
    }
    
    .support-buttons {
        display: flex;
        gap: 20px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .support-buttons .btn {
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: 600;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s ease;
        cursor: pointer;
        border: none;
    }
    
    .support-buttons .btn-primary {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
    }
    
    .support-buttons .btn-outline {
        background: transparent;
        color: #667eea;
        border: 2px solid #667eea;
    }
    
    .support-buttons .btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    
    .support-buttons .btn-outline:hover {
        background: #667eea;
        color: white;
    }
    
    .search-results-message {
        margin-top: 20px;
        padding: 15px;
        background: rgba(102, 126, 234, 0.1);
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .search-results-message p {
        color: #667eea;
        font-weight: 600;
        margin: 0;
    }
    
    .clear-search-btn {
        background: #667eea;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.3s ease;
    }
    
    .clear-search-btn:hover {
        background: #5a67d8;
        transform: translateY(-1px);
    }
    
    .highlight {
        background: #ffd700;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: 600;
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
        .faq-header h1 {
            font-size: 2.5rem;
        }
        
        .faq-category {
            padding: 25px;
        }
        
        .faq-category h2 {
            font-size: 1.8rem;
        }
        
        .faq-question {
            padding: 20px 25px;
        }
        
        .faq-question h3 {
            font-size: 1.1rem;
            padding-left: 15px;
        }
        
        .faq-answer {
            padding: 0 25px 20px 25px;
        }
        
        .search-container {
            padding: 0 10px;
        }
        
        .search-input {
            padding: 15px 50px 15px 15px;
            font-size: 1rem;
        }
        
        .support-buttons {
            flex-direction: column;
            align-items: center;
        }
        
        .support-buttons .btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
        }
        
        .faq-categories {
            flex-direction: column;
            align-items: center;
        }
        
        .faq-category-btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
        }
    }
    
    @media (max-width: 480px) {
        .faq-section {
            padding: 40px 0;
        }
        
        .faq-header h1 {
            font-size: 2rem;
        }
        
        .faq-category {
            padding: 20px;
        }
        
        .faq-category h2 {
            font-size: 1.6rem;
        }
        
        .faq-question {
            padding: 15px 20px;
        }
        
        .faq-question h3 {
            font-size: 1rem;
            padding-left: 10px;
        }
        
        .faq-answer {
            padding: 0 20px 15px 20px;
        }
        
        .faq-answer p {
            font-size: 1rem;
        }
        
        .search-input {
            padding: 12px 45px 12px 12px;
            font-size: 0.95rem;
        }
        
        .search-btn {
            padding: 10px 12px;
            font-size: 0.9rem;
        }
        
        .faq-support {
            padding: 25px;
        }
        
        .faq-support h2 {
            font-size: 1.8rem;
        }
    }
`;
document.head.appendChild(faqStyles);
