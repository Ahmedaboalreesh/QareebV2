// Terms and Conditions page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navbar scroll effect
    initializeNavbarScroll();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize print functionality
    initializePrintFunctionality();
    
    // Initialize table of contents
    initializeTableOfContents();
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
        printButton.innerHTML = '<i class="fas fa-print"></i> طباعة الشروط';
        printButton.onclick = printTerms;
        
        actionButtons.appendChild(printButton);
    }
}

// Print terms and conditions
function printTerms() {
    window.print();
}

// Initialize table of contents
function initializeTableOfContents() {
    const termsContent = document.querySelector('.terms-content');
    const sections = termsContent.querySelectorAll('.terms-section-block h2');
    
    if (sections.length > 0) {
        const toc = createTableOfContents(sections);
        termsContent.insertBefore(toc, termsContent.firstChild);
    }
}

// Create table of contents
function createTableOfContents(sections) {
    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    
    const tocHeader = document.createElement('h3');
    tocHeader.innerHTML = '<i class="fas fa-list"></i> محتويات الشروط والأحكام';
    toc.appendChild(tocHeader);
    
    const tocList = document.createElement('ul');
    
    sections.forEach((section, index) => {
        const sectionId = `section-${index + 1}`;
        section.id = sectionId;
        
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${sectionId}`;
        link.textContent = section.textContent;
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
    
    toc.appendChild(tocList);
    return toc;
}

// Add CSS for terms page
const termsStyles = document.createElement('style');
termsStyles.textContent = `
    .terms-section {
        margin-top: 80px;
        padding: 60px 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
    }
    
    .terms-header {
        text-align: center;
        margin-bottom: 50px;
        color: white;
    }
    
    .terms-header h1 {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .terms-header p {
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
    
    .terms-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    .terms-section-block {
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 40px;
        margin-bottom: 30px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        transition: all 0.3s ease;
    }
    
    .terms-section-block:hover {
        transform: translateY(-5px);
        box-shadow: 0 25px 50px rgba(0,0,0,0.15);
    }
    
    .terms-section-block h2 {
        color: #333;
        font-size: 2rem;
        margin-bottom: 25px;
        font-weight: 700;
        border-bottom: 3px solid #667eea;
        padding-bottom: 15px;
    }
    
    .terms-section-block h3 {
        color: #667eea;
        font-size: 1.4rem;
        margin: 25px 0 15px;
        font-weight: 600;
    }
    
    .terms-section-block h4 {
        color: #333;
        font-size: 1.2rem;
        margin: 20px 0 10px;
        font-weight: 600;
    }
    
    .terms-section-block p {
        color: #666;
        line-height: 1.8;
        margin-bottom: 15px;
        font-size: 1.1rem;
    }
    
    .terms-section-block ul {
        color: #666;
        line-height: 1.8;
        margin-bottom: 15px;
        padding-right: 20px;
    }
    
    .terms-section-block li {
        margin-bottom: 8px;
        font-size: 1.1rem;
    }
    
    /* Table of Contents */
    .table-of-contents {
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 30px;
        margin-bottom: 40px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.2);
    }
    
    .table-of-contents h3 {
        color: #333;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
    }
    
    .table-of-contents ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .table-of-contents li {
        margin-bottom: 10px;
    }
    
    .table-of-contents a {
        color: #667eea;
        text-decoration: none;
        padding: 10px 15px;
        display: block;
        border-radius: 10px;
        transition: all 0.3s ease;
        border: 1px solid transparent;
    }
    
    .table-of-contents a:hover {
        background: #f8f9fa;
        border-color: #667eea;
        transform: translateX(-5px);
    }
    
    /* Definitions Grid */
    .definitions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
        margin: 30px 0;
    }
    
    .definition-item {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 25px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .definition-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        border-color: #667eea;
    }
    
    .definition-item h4 {
        color: #667eea;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
    }
    
    .definition-item h4 i {
        font-size: 1.2rem;
    }
    
    .definition-item p {
        color: #666;
        margin: 0;
    }
    
    /* Eligibility Requirements */
    .eligibility-requirements {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .requirement-item {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        background: #f8f9fa;
        border-radius: 15px;
        padding: 20px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .requirement-item:hover {
        border-color: #667eea;
        transform: translateY(-2px);
    }
    
    .requirement-item i {
        color: #667eea;
        font-size: 1.5rem;
        margin-top: 5px;
    }
    
    .requirement-item h4 {
        color: #333;
        margin-bottom: 8px;
        font-weight: 600;
    }
    
    .requirement-item p {
        color: #666;
        margin: 0;
    }
    
    /* Responsibilities Grid */
    .responsibilities-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
        margin: 30px 0;
    }
    
    .responsibility-card {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 25px;
        text-align: center;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .responsibility-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        border-color: #667eea;
    }
    
    .responsibility-icon {
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
    
    .responsibility-card h4 {
        color: #333;
        margin-bottom: 15px;
        font-weight: 600;
    }
    
    .responsibility-card p {
        color: #666;
        margin: 0;
    }
    
    /* Owner and Renter Responsibilities */
    .owner-responsibilities,
    .renter-responsibilities {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .owner-item,
    .renter-item {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 20px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .owner-item:hover,
    .renter-item:hover {
        border-color: #667eea;
        transform: translateY(-2px);
    }
    
    .owner-item h4,
    .renter-item h4 {
        color: #667eea;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .owner-item p,
    .renter-item p {
        color: #666;
        margin: 0;
    }
    
    /* Payment Terms */
    .payment-terms {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .payment-item {
        display: flex;
        align-items: center;
        gap: 15px;
        background: #f8f9fa;
        border-radius: 15px;
        padding: 20px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .payment-item:hover {
        border-color: #667eea;
        transform: translateY(-2px);
    }
    
    .payment-item i {
        color: #667eea;
        font-size: 1.5rem;
    }
    
    .payment-item h4 {
        color: #333;
        margin-bottom: 5px;
        font-weight: 600;
    }
    
    .payment-item p {
        color: #666;
        margin: 0;
    }
    
    /* Cancellation Policy */
    .cancellation-policy {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .cancellation-item {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 20px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .cancellation-item:hover {
        border-color: #667eea;
        transform: translateY(-2px);
    }
    
    .cancellation-item h4 {
        color: #667eea;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .cancellation-item p {
        color: #666;
        margin: 0;
    }
    
    /* Insurance Terms */
    .insurance-terms {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .insurance-item {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 20px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .insurance-item:hover {
        border-color: #667eea;
        transform: translateY(-2px);
    }
    
    .insurance-item h4 {
        color: #667eea;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .insurance-item p {
        color: #666;
        margin: 0;
    }
    
    /* Prohibited Activities */
    .prohibited-activities {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .prohibited-item {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        background: #f8f9fa;
        border-radius: 15px;
        padding: 20px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .prohibited-item:hover {
        border-color: #667eea;
        transform: translateY(-2px);
    }
    
    .prohibited-item i {
        color: #ef4444;
        font-size: 1.5rem;
        margin-top: 5px;
    }
    
    .prohibited-item h4 {
        color: #333;
        margin-bottom: 8px;
        font-weight: 600;
    }
    
    .prohibited-item p {
        color: #666;
        margin: 0;
    }
    
    /* Dispute Resolution */
    .dispute-resolution {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .dispute-item {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 20px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .dispute-item:hover {
        border-color: #667eea;
        transform: translateY(-2px);
    }
    
    .dispute-item h4 {
        color: #667eea;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .dispute-item p {
        color: #666;
        margin: 0;
    }
    
    /* Termination Terms */
    .termination-terms {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .termination-item {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 20px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .termination-item:hover {
        border-color: #667eea;
        transform: translateY(-2px);
    }
    
    .termination-item h4 {
        color: #667eea;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .termination-item p {
        color: #666;
        margin: 0;
    }
    
    /* Contact Methods */
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
    
    /* Terms Actions */
    .terms-actions {
        text-align: center;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 40px;
        margin-top: 40px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.2);
    }
    
    .terms-actions h3 {
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
        .terms-header h1 {
            font-size: 2.5rem;
        }
        
        .terms-section-block {
            padding: 25px;
        }
        
        .terms-section-block h2 {
            font-size: 1.8rem;
        }
        
        .definitions-grid,
        .responsibilities-grid,
        .eligibility-requirements,
        .owner-responsibilities,
        .renter-responsibilities,
        .payment-terms,
        .cancellation-policy,
        .insurance-terms,
        .prohibited-activities,
        .dispute-resolution,
        .termination-terms,
        .contact-methods {
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
        .terms-section {
            padding: 40px 0;
        }
        
        .terms-header h1 {
            font-size: 2rem;
        }
        
        .terms-section-block {
            padding: 20px;
        }
        
        .terms-section-block h2 {
            font-size: 1.6rem;
        }
        
        .terms-section-block h3 {
            font-size: 1.3rem;
        }
        
        .definition-item,
        .responsibility-card,
        .requirement-item,
        .owner-item,
        .renter-item,
        .payment-item,
        .cancellation-item,
        .insurance-item,
        .prohibited-item,
        .dispute-item,
        .termination-item,
        .contact-method {
            padding: 15px;
        }
        
        .terms-actions {
            padding: 25px;
        }
        
        .terms-actions h3 {
            font-size: 1.8rem;
        }
    }
`;
document.head.appendChild(termsStyles);
