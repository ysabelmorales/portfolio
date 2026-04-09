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

// Scroll scaling
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
}

window.addEventListener('scroll', updateScale, { passive: true });

document.addEventListener('DOMContentLoaded', function() {
    // Scroll to top
    const scrollToTopLinks = document.querySelectorAll('.footer-socials a');
    scrollToTopLinks.forEach(link => {
        if (link.textContent.trim() === '^') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    });
    
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

// Carousel
function initCarousel(el) {
    const track = el.querySelector('.carousel__track');
    const slides = el.querySelectorAll('.carousel__slide');
    const prev = el.querySelector('.prev');
    const next = el.querySelector('.next');
    let current = 0, startX = 0, isDragging = false, dragDelta = 0;

    function goTo(index) {
        current = Math.max(0, Math.min(index, slides.length - 1));
        track.style.transition = 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
        track.style.transform = `translateX(-${current * 100}%)`;
    }

    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));

    el.addEventListener('mousedown', e => {
        if (e.target.closest('.carousel__arrow')) return;
        isDragging = true; startX = e.clientX; dragDelta = 0;
        el.classList.add('is-dragging');
        track.style.transition = 'none';
    });
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        dragDelta = e.clientX - startX;
        track.style.transform = `translateX(calc(-${current * 100}% + ${dragDelta}px))`;
    });
    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        el.classList.remove('is-dragging');
        goTo(Math.abs(dragDelta) > 50 ? (dragDelta < 0 ? current + 1 : current - 1) : current);
    });

    el.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX; dragDelta = 0;
        track.style.transition = 'none';
    }, { passive: true });
    el.addEventListener('touchmove', e => {
        dragDelta = e.touches[0].clientX - startX;
        track.style.transform = `translateX(calc(-${current * 100}% + ${dragDelta}px))`;
    }, { passive: true });
    el.addEventListener('touchend', () => {
        goTo(Math.abs(dragDelta) > 50 ? (dragDelta < 0 ? current + 1 : current - 1) : current);
    });
}

document.querySelectorAll('.carousel').forEach(initCarousel);