// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Contact form validation and submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const formMessage = document.getElementById('form-message');

    // Reset previous messages
    formMessage.textContent = '';
    formMessage.className = '';

    // Get current language for translations
    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    const t = window.translations[currentLang].contact.formMessages;
    
    // Validation
    if (!name || !email || !subject || !message) {
        showFormMessage(t.fillAllFields, 'error');
        return;
    }

    if (!validateEmail(email)) {
        showFormMessage(t.validEmail, 'error');
        return;
    }

    // Send to Firebase directly
    showFormMessage(t.sending, 'info');
    
    // Use Firebase directly
    if (window.firebaseDB) {
        window.firebaseDB.collection('contacts').add({
            name: name,
            email: email,
            subject: subject,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            // Also log to server for console output
            fetch(`${window.BACKEND_URL}/api/log-firebase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                })
            }).catch(err => console.log('Server logging failed:', err));
            
                                    showFormMessage(t.success, 'success');
                        document.getElementById('contact-form').reset();
                    })
                    .catch(error => {
                        console.error('Firebase Error:', error);
                        showFormMessage(t.error, 'error');
                    });
    } else {
        // Fallback to backend API if Firebase is not available
        fetch(`${window.BACKEND_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                subject: subject,
                message: message
            })
        })
        .then(response => response.json())
                            .then(data => {
                        if (data.message) {
                            showFormMessage(t.success, 'success');
                            document.getElementById('contact-form').reset();
                        } else {
                            showFormMessage(t.error, 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showFormMessage(t.error, 'error');
                    });
    }
});

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form messages with styling
function showFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Add CSS classes for styling
    if (type === 'error') {
        formMessage.style.backgroundColor = '#fee2e2';
        formMessage.style.color = '#dc2626';
        formMessage.style.border = '1px solid #fecaca';
    } else if (type === 'success') {
        formMessage.style.backgroundColor = '#dcfce7';
        formMessage.style.color = '#16a34a';
        formMessage.style.border = '1px solid #bbf7d0';
    } else if (type === 'info') {
        formMessage.style.backgroundColor = '#dbeafe';
        formMessage.style.color = '#2563eb';
        formMessage.style.border = '1px solid #bfdbfe';
    }
}

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 100) {
        navbar.style.background = 'var(--navbar-bg-scrolled, var(--navbar-bg))';
        navbar.style.boxShadow = '0 2px 20px var(--shadow-color)';
    } else {
        navbar.style.background = 'var(--navbar-bg)';
        navbar.style.boxShadow = 'none';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .stat');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Uncomment the next line to enable typing effect
        // typeWriter(heroTitle, originalText, 50);
    }
});

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Skill item hover effects
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.2)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
    });
});

// Social links hover effects
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Back to top functionality (optional)
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', createBackToTopButton);

// Language Dropdown Functionality
const languageToggle = document.getElementById('language-toggle');
const languageDropdown = document.querySelector('.language-dropdown');
const langText = document.querySelector('.lang-text');
const languageOptions = document.querySelectorAll('.language-option');

// Function to translate the page content
function translatePage(lang) {
    const t = window.translations[lang];
    
    // Navigation
    document.querySelector('a[href="#home"]').textContent = t.nav.home;
    document.querySelector('a[href="#about"]').textContent = t.nav.about;
    document.querySelector('a[href="#skills"]').textContent = t.nav.skills;
    document.querySelector('a[href="#projects"]').textContent = t.nav.projects;
    document.querySelector('a[href="#contact"]').textContent = t.nav.contact;
    
    // Hero Section
    const heroTitle = document.querySelector('.hero-title');
    const nameSpan = heroTitle.querySelector('.highlight');
    heroTitle.innerHTML = `${t.hero.title} <span class="highlight">${nameSpan.textContent}</span>`;
    
    document.querySelector('.hero-subtitle').textContent = t.hero.subtitle;
    document.querySelector('.hero-description').textContent = t.hero.description;
    document.querySelector('.hero-buttons .btn-primary').textContent = t.hero.viewWork;
    document.querySelector('.hero-buttons .btn-secondary').textContent = t.hero.getInTouch;
    
    // About Section
    document.querySelector('#about .section-title').textContent = t.about.title;
    const aboutParagraphs = document.querySelectorAll('#about .about-text p');
    aboutParagraphs[0].textContent = t.about.paragraph1;
    aboutParagraphs[1].textContent = t.about.paragraph2;
    aboutParagraphs[2].textContent = t.about.paragraph3;
    
    const stats = document.querySelectorAll('#about .stat p');
    stats[0].textContent = t.about.yearsExperience;
    stats[1].textContent = t.about.projectsCompleted;
    stats[2].textContent = t.about.happyClients;
    stats[3].textContent = t.about.clientSatisfaction;
    
    // Skills Section
    document.querySelector('#skills .section-title').textContent = t.skills.title;
    const skillCategories = document.querySelectorAll('#skills .skill-category h3');
    skillCategories[0].innerHTML = `<i class="fab fa-html5"></i> ${t.skills.frontend}`;
    skillCategories[1].innerHTML = `<i class="fas fa-server"></i> ${t.skills.backend}`;
    skillCategories[2].innerHTML = `<i class="fas fa-tools"></i> ${t.skills.tools}`;
    
    // Update specific skill items that have translations
    const skillItems = document.querySelectorAll('#skills .skill-item span');
    skillItems.forEach(item => {
        if (item.textContent === 'Responsive Design') {
            item.textContent = t.skills.responsiveDesign;
        } else if (item.textContent === 'Performance Optimization') {
            item.textContent = t.skills.performanceOptimization;
        }
    });
    
    // Projects Section
    document.querySelector('#projects .section-title').textContent = t.projects.title;
    
    const projectCards = document.querySelectorAll('#projects .project-card');
    projectCards[0].querySelector('h3').textContent = t.projects.ecommerce.title;
    projectCards[0].querySelector('p').textContent = t.projects.ecommerce.description;
    projectCards[1].querySelector('h3').textContent = t.projects.taskManager.title;
    projectCards[1].querySelector('p').textContent = t.projects.taskManager.description;
    projectCards[2].querySelector('h3').textContent = t.projects.analytics.title;
    projectCards[2].querySelector('p').textContent = t.projects.analytics.description;
    
    const projectLinks = document.querySelectorAll('#projects .project-link');
    projectLinks.forEach((link, index) => {
        if (index % 2 === 0) {
            link.innerHTML = `<i class="fas fa-external-link-alt"></i> ${t.projects.liveDemo}`;
        } else {
            link.innerHTML = `<i class="fab fa-github"></i> ${t.projects.code}`;
        }
    });
    
    // Contact Section
    document.querySelector('#contact .section-title').textContent = t.contact.title;
    document.querySelector('#contact h3').textContent = t.contact.subtitle;
    document.querySelector('#contact .contact-info p').textContent = t.contact.description;
    
    const formLabels = document.querySelectorAll('#contact-form label');
    formLabels[0].textContent = t.contact.name;
    formLabels[1].textContent = t.contact.email;
    formLabels[2].textContent = t.contact.subject;
    formLabels[3].textContent = t.contact.message;
    
    document.querySelector('#contact-form button').textContent = t.contact.sendMessage;
    
    // Footer
    document.querySelector('.footer p').textContent = t.footer.copyright;
}

// Function to set language
function setLanguage(lang) {
    // Remove active class from all options
    languageOptions.forEach(option => option.classList.remove('active'));
    
    if (lang === 'ar') {
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
        langText.textContent = 'AR';
        localStorage.setItem('language', 'ar');
        document.querySelector('[data-lang="ar"]').classList.add('active');
    } else if (lang === 'fr') {
        document.documentElement.setAttribute('lang', 'fr');
        document.documentElement.setAttribute('dir', 'ltr');
        langText.textContent = 'FR';
        localStorage.setItem('language', 'fr');
        document.querySelector('[data-lang="fr"]').classList.add('active');
    } else {
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
        langText.textContent = 'EN';
        localStorage.setItem('language', 'en');
        document.querySelector('[data-lang="en"]').classList.add('active');
    }
    
    // Translate the page content
    translatePage(lang);
}

// Initialize language
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        setLanguage(savedLanguage);
    } else {
        setLanguage('en'); // Default to English
    }
}

// Language dropdown toggle
languageToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    languageDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!languageDropdown.contains(e.target)) {
        languageDropdown.classList.remove('active');
    }
});

// Language option click handlers
languageOptions.forEach(option => {
    option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang');
        setLanguage(lang);
        languageDropdown.classList.remove('active');
    });
});

// Apply language immediately
initializeLanguage();

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Function to set theme
function setTheme(theme) {
    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
    
    // Reset navbar background to use CSS variables
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'var(--navbar-bg-scrolled, var(--navbar-bg))';
    } else {
        navbar.style.background = 'var(--navbar-bg)';
    }
}

// Initialize theme immediately when script loads
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
}

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Apply theme immediately and on DOM load
initializeTheme();
document.addEventListener('DOMContentLoaded', initializeTheme);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

