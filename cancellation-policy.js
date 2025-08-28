document.addEventListener('DOMContentLoaded', function() {
    initializeNavbarScroll();
    initializeSmoothScrolling();
    initializePrintFunctionality();
    initializeTableOfContents();
});

// Initialize navbar scroll effect
function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Initialize smooth scrolling for internal links
function initializeSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize print functionality
function initializePrintFunctionality() {
    // Add print styles
    const printStyles = document.createElement('style');
    printStyles.textContent = `
        @media print {
            .header, .footer, .quick-actions, .table-of-contents {
                display: none !important;
            }
            
            .cancellation-policy-section {
                margin: 0 !important;
                padding: 20px !important;
            }
            
            .policy-header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .policy-section {
                page-break-inside: avoid;
                margin-bottom: 30px;
            }
            
            h1, h2, h3 {
                color: #000 !important;
            }
            
            body {
                font-size: 12pt;
                line-height: 1.4;
            }
        }
    `;
    document.head.appendChild(printStyles);
}

// Initialize dynamic table of contents
function initializeTableOfContents() {
    const tocList = document.getElementById('toc-list');
    const policySections = document.querySelectorAll('.policy-section');
    
    if (!tocList || policySections.length === 0) return;
    
    policySections.forEach((section, index) => {
        const heading = section.querySelector('h2');
        if (!heading) return;
        
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        
        link.textContent = heading.textContent;
        link.href = `#${section.id}`;
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
}

// Add embedded CSS for the cancellation policy page
const embeddedStyles = `
    .cancellation-policy-section {
        margin-top: 80px;
        min-height: calc(100vh - 80px);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px 0;
    }

    .policy-header {
        text-align: center;
        margin-bottom: 40px;
        color: white;
    }

    .policy-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .policy-header p {
        font-size: 1.1rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
    }

    .quick-actions {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 40px;
        flex-wrap: wrap;
    }

    .quick-actions .btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .quick-actions .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .table-of-contents {
        background: white;
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 40px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }

    .table-of-contents h3 {
        color: #333;
        margin-bottom: 20px;
        font-size: 1.3rem;
        border-bottom: 2px solid #667eea;
        padding-bottom: 10px;
    }

    .table-of-contents ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .table-of-contents li {
        margin-bottom: 12px;
    }

    .table-of-contents a {
        color: #555;
        text-decoration: none;
        padding: 8px 12px;
        border-radius: 6px;
        display: block;
        transition: all 0.3s ease;
        border-right: 3px solid transparent;
    }

    .table-of-contents a:hover {
        background: #f8f9ff;
        color: #667eea;
        border-right-color: #667eea;
        transform: translateX(-5px);
    }

    .policy-content {
        background: white;
        border-radius: 12px;
        padding: 40px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }

    .policy-section {
        margin-bottom: 40px;
        padding-bottom: 30px;
        border-bottom: 1px solid #eee;
    }

    .policy-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }

    .policy-section h2 {
        color: #333;
        font-size: 1.8rem;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #667eea;
        position: relative;
    }

    .policy-section h2::before {
        content: '';
        position: absolute;
        bottom: -2px;
        right: 0;
        width: 50px;
        height: 2px;
        background: #764ba2;
    }

    .policy-section h3 {
        color: #555;
        font-size: 1.3rem;
        margin: 25px 0 15px 0;
        font-weight: 600;
    }

    .policy-section p {
        color: #666;
        line-height: 1.7;
        margin-bottom: 15px;
        text-align: justify;
    }

    .policy-section ul, .policy-section ol {
        color: #666;
        line-height: 1.7;
        margin: 15px 0;
        padding-right: 20px;
    }

    .policy-section li {
        margin-bottom: 8px;
        position: relative;
    }

    .policy-section ul li::before {
        content: '•';
        color: #667eea;
        font-weight: bold;
        position: absolute;
        right: -15px;
    }

    .policy-section ol {
        counter-reset: item;
    }

    .policy-section ol li {
        counter-increment: item;
        position: relative;
        padding-right: 25px;
    }

    .policy-section ol li::before {
        content: counter(item) '.';
        color: #667eea;
        font-weight: bold;
        position: absolute;
        right: 0;
    }

    .contact-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 25px;
        margin-top: 20px;
    }

    .contact-item {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        padding: 20px;
        background: #f8f9ff;
        border-radius: 8px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }

    .contact-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .contact-item i {
        color: #667eea;
        font-size: 1.5rem;
        margin-top: 5px;
    }

    .contact-item h4 {
        color: #333;
        margin-bottom: 8px;
        font-size: 1.1rem;
    }

    .contact-item p {
        color: #666;
        margin: 0;
        line-height: 1.5;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .cancellation-policy-section {
            margin-top: 60px;
            padding: 20px 0;
        }

        .policy-header h1 {
            font-size: 2rem;
        }

        .policy-header p {
            font-size: 1rem;
        }

        .quick-actions {
            flex-direction: column;
            align-items: center;
        }

        .quick-actions .btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
        }

        .policy-content {
            padding: 25px 20px;
        }

        .policy-section h2 {
            font-size: 1.5rem;
        }

        .policy-section h3 {
            font-size: 1.2rem;
        }

        .contact-details {
            grid-template-columns: 1fr;
        }

        .table-of-contents {
            padding: 20px;
        }
    }

    @media (max-width: 480px) {
        .policy-header h1 {
            font-size: 1.8rem;
        }

        .policy-content {
            padding: 20px 15px;
        }

        .policy-section {
            margin-bottom: 30px;
            padding-bottom: 20px;
        }

        .contact-item {
            padding: 15px;
        }
    }

    /* Print Styles */
    @media print {
        .cancellation-policy-section {
            background: white !important;
            margin: 0 !important;
            padding: 20px !important;
        }

        .policy-header {
            color: black !important;
        }

        .policy-header h1 {
            text-shadow: none !important;
        }

        .quick-actions, .table-of-contents {
            display: none !important;
        }

        .policy-content {
            box-shadow: none !important;
            padding: 0 !important;
        }

        .policy-section {
            page-break-inside: avoid;
        }
    }
`;

// Add styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = embeddedStyles;
document.head.appendChild(styleSheet);
