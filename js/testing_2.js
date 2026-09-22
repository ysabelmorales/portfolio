// Update date
function updateDate() {
    const days = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const today = new Date();
    const dayName = days[today.getDay()];
    const monthName = months[today.getMonth()];
    const dayNumber = today.getDate();
    const year = today.getFullYear();
    
    const dateString = `${dayName}, ${monthName} ${dayNumber}, ${year}`;
    const dateElement = document.getElementById('livedate');
    if (dateElement) {
        dateElement.textContent = dateString;
    }
}

updateDate();
setInterval(updateDate, 60000);

// Scroll scaling (throttled for performance)
let ticking = false;

function updateScale() {
    const scrollY = window.scrollY;
    const maxScroll = 400;
    const minScale = 0.65;
    
    let scale = 1;
    if (scrollY > 0) {
        const progress = Math.min(scrollY / maxScroll, 1);
        scale = 1 - (progress * (1 - minScale));
    }
    
    document.documentElement.style.setProperty('--scroll-scale', scale);
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScale);
        ticking = true;
    }
}, { passive: true });

document.addEventListener('DOMContentLoaded', function() {

    // Menu overlay
    const menuOverlay = document.getElementById('menuOverlay');
    const menuButtons = document.querySelectorAll('.footer-socials a');
    
    menuButtons.forEach(button => {
        if (button.textContent.trim() === 'Menu') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                menuOverlay.classList.toggle('active');
            });
        }
    });
    
    menuOverlay.addEventListener('click', function(e) {
        if (e.target === menuOverlay) {
            menuOverlay.classList.remove('active');
        }
    });
    
    const menuLinks = document.querySelectorAll('.menu-overlay-link');
    menuLinks.forEach(link => {
        if (!link.href.startsWith('mailto:')) {
            link.addEventListener('click', function(e) {
                menuOverlay.classList.remove('active');
            });
        }
    });
    
    updateScale();
});

// Carousels and the ^ / v scroll buttons now live in the <script> tags
// at the bottom of the HTML file, so they aren't repeated here.