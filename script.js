// Get DOM elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Handle navigation tab clicks
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get the tab name from data attribute
        const tabName = link.getAttribute('data-tab');
        
        // Remove active class from all nav links and pages
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        
        // Add active class to clicked link and corresponding page
        link.classList.add('active');
        const activePage = document.querySelector(`[data-page="${tabName}"]`);
        if (activePage) {
            activePage.classList.add('active');
        }
        
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Update URL hash
        window.location.hash = tabName;
    });
});

// Handle browser back/forward buttons
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const link = document.querySelector(`[data-tab="${hash}"]`);
        if (link) {
            link.click();
        }
    }
});

// Initialize on page load
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const link = document.querySelector(`[data-tab="${hash}"]`);
        if (link) {
            link.click();
        }
    }
});