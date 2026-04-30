function updateDate() {
    const days = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    const dateString = `${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
    const el = document.getElementById('livedate');
    if (el) el.textContent = dateString;
}
updateDate();
setInterval(updateDate, 60000);

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

document.addEventListener('DOMContentLoaded', function () {
    const scrollToTopLinks = document.querySelectorAll('.footer-socials a');
    scrollToTopLinks.forEach(link => {
        if (link.textContent.trim() === '^') {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    });

    const menuOverlay = document.getElementById('menuOverlay');
    const menuButtons = document.querySelectorAll('.footer-socials a');
    menuButtons.forEach(button => {
        if (button.textContent.trim() === 'Menu') {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                menuOverlay.classList.toggle('active');
            });
        }
    });

    menuOverlay.addEventListener('click', function (e) {
        if (e.target === menuOverlay) menuOverlay.classList.remove('active');
    });

    const menuLinks = document.querySelectorAll('.menu-overlay-link');
    menuLinks.forEach(link => {
        if (!link.href.startsWith('mailto:')) {
            link.addEventListener('click', function () {
                menuOverlay.classList.remove('active');
            });
        }
    });

    updateScale();
});