// Privacy Policy page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navbar scroll effect
    initializeNavbarScroll();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize print functionality
    initializePrintFunctionality();
});

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

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    // Add smooth scrolling to all internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize print functionality
function initializePrintFunctionality() {
    // Add print button to actions
    const actionButtons = document.querySelector('.action-buttons');
    
    if (actionButtons) {
        const printButton = document.createElement('button');
        printButton.className = 'btn btn-outline';
        printButton.innerHTML = '<i class="fas fa-print"></i> طباعة السياسة';
        printButton.onclick = printPrivacyPolicy;
        
        actionButtons.appendChild(printButton);
    }
}

// Print privacy policy
function printPrivacyPolicy() {
    window.print();
}

// Add CSS for privacy page
const privacyStyles = document.createElement('style');
privacyStyles.textContent = `
    .privacy-section {
        margin-top: 80px;
        padding: 60px 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
    }
    
    .privacy-header {
        text-align: center;
        margin-bottom: 50px;
        color: white;
    }
    
    .privacy-header h1 {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .privacy-header p {
        font-size: 1.2rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto 20px;
    }
    
    .last-updated {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: rgba(255,255,255,0.2);
        padding: 10px 20px;
        border-radius: 25px;
        font-size: 0.9rem;
    }
    
    .privacy-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    .privacy-section-block {
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 40px;
        margin-bottom: 30px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        transition: all 0.3s ease;
    }
    
    .privacy-section-block:hover {
        transform: translateY(-5px);
        box-shadow: 0 25px 50px rgba(0,0,0,0.15);
    }
    
    .privacy-section-block h2 {
        color: #333;
        font-size: 2rem;
        margin-bottom: 25px;
        font-weight: 700;
        border-bottom: 3px solid #667eea;
        padding-bottom: 15px;
    }
    
    .privacy-section-block h3 {
        color: #667eea;
        font-size: 1.4rem;
        margin: 25px 0 15px;
        font-weight: 600;
    }
    
    .privacy-section-block h4 {
        color: #333;
        font-size: 1.2rem;
        margin: 20px 0 10px;
        font-weight: 600;
    }
    
    .privacy-section-block p {
        color: #666;
        line-height: 1.8;
        margin-bottom: 15px;
        font-size: 1.1rem;
    }
    
    .privacy-section-block ul {
        color: #666;
        line-height: 1.8;
        margin-bottom: 15px;
        padding-right: 20px;
    }
    
    .privacy-section-block li {
        margin-bottom: 8px;
        font-size: 1.1rem;
    }
    
    .info-category {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 25px;
        margin: 20px 0;
        border: 1px solid #e9ecef;
    }
    
    .info-category h3 {
        color: #667eea;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .info-category h3 i {
        font-size: 1.2rem;
    }
    
    .usage-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
        margin: 30px 0;
    }
    
    .usage-card {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 25px;
        text-align: center;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .usage-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        border-color: #667eea;
    }
    
    .usage-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        color: white;
        font-size: 1.5rem;
    }
    
    .usage-card h4 {
        color: #333;
        margin-bottom: 15px;
        font-weight: 600;
    }
    
    .usage-card p {
        color: #666;
        margin: 0;
    }
    
    .sharing-categories {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .sharing-item {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 20px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .sharing-item:hover {
        border-color: #667eea;
        transform: translateY(-2px);
    }
    
    .sharing-item h4 {
        color: #667eea;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .sharing-item p {
        color: #666;
        margin: 0;
    }
    
    .security-features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .security-item {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        background: #f8f9fa;
        border-radius: 15px;
        padding: 20px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .security-item:hover {
        border-color: #667eea;
        transform: translateY(-2px);
    }
    
    .security-item i {
        color: #667eea;
        font-size: 1.5rem;
        margin-top: 5px;
    }
    
    .security-item h4 {
        color: #333;
        margin-bottom: 8px;
        font-weight: 600;
    }
    
    .security-item p {
        color: #666;
        margin: 0;
    }
    
    .rights-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .right-item {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 25px;
        text-align: center;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .right-item:hover {
        border-color: #667eea;
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    
    .right-item i {
        color: #667eea;
        font-size: 2rem;
        margin-bottom: 15px;
    }
    
    .right-item h4 {
        color: #333;
        margin-bottom: 10px;
        font-weight: 600;
    }
    
    .right-item p {
        color: #666;
        margin: 0;
    }
    
    .cookies-types {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .cookie-type {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 20px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .cookie-type:hover {
        border-color: #667eea;
        transform: translateY(-2px);
    }
    
    .cookie-type h4 {
        color: #667eea;
        margin-bottom: 10px;
        font-weight: 600;
    }
    
    .cookie-type p {
        color: #666;
        margin: 0;
    }
    
    .contact-methods {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .contact-method {
        display: flex;
        align-items: center;
        gap: 15px;
        background: #f8f9fa;
        border-radius: 15px;
        padding: 20px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .contact-method:hover {
        border-color: #667eea;
        transform: translateY(-2px);
    }
    
    .contact-method i {
        color: #667eea;
        font-size: 1.5rem;
    }
    
    .contact-method h4 {
        color: #333;
        margin-bottom: 5px;
        font-weight: 600;
    }
    
    .contact-method p {
        color: #666;
        margin: 0;
    }
    
    .privacy-actions {
        text-align: center;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 40px;
        margin-top: 40px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.2);
    }
    
    .privacy-actions h3 {
        color: #333;
        font-size: 2rem;
        margin-bottom: 30px;
        font-weight: 700;
    }
    
    .action-buttons {
        display: flex;
        gap: 20px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .action-buttons .btn {
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
    
    .action-buttons .btn-primary {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
    }
    
    .action-buttons .btn-outline {
        background: transparent;
        color: #667eea;
        border: 2px solid #667eea;
    }
    
    .action-buttons .btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    
    .action-buttons .btn-outline:hover {
        background: #667eea;
        color: white;
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
        .privacy-header h1 {
            font-size: 2.5rem;
        }
        
        .privacy-section-block {
            padding: 25px;
        }
        
        .privacy-section-block h2 {
            font-size: 1.8rem;
        }
        
        .usage-grid, .rights-grid, .security-features, .sharing-categories, .cookies-types, .contact-methods {
            grid-template-columns: 1fr;
        }
        
        .action-buttons {
            flex-direction: column;
            align-items: center;
        }
        
        .action-buttons .btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
        }
    }
    
    @media (max-width: 480px) {
        .privacy-section {
            padding: 40px 0;
        }
        
        .privacy-header h1 {
            font-size: 2rem;
        }
        
        .privacy-section-block {
            padding: 20px;
        }
        
        .privacy-section-block h2 {
            font-size: 1.6rem;
        }
        
        .privacy-section-block h3 {
            font-size: 1.3rem;
        }
        
        .usage-card, .right-item, .security-item, .sharing-item, .cookie-type, .contact-method {
            padding: 15px;
        }
        
        .privacy-actions {
            padding: 25px;
        }
        
        .privacy-actions h3 {
            font-size: 1.8rem;
        }
    }
`;
document.head.appendChild(privacyStyles);
