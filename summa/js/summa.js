const specImages = {
  "Airbrush":          ["../images/Specs-400w/Specs-400w-09.webp"],
  "Prototyping":       ["../images/Specs-400w/Specs-400w-08.webp"],
  "Visual Research":   ["../images/Specs-400w/Specs-400w-11.webp"],
  "Laser Cut":         ["../images/Specs-400w/Specs-400w-12.webp"],
  "Experimentation":   ["../images/Specs-400w/Specs-400w-07.webp"],
  "Material Research": ["../images/Specs-400w/Specs-400w-10.webp"],
};

// Load and decode every spec image as soon as the page loads,
// so the popup shows instantly instead of waiting on the network.
const preloaded = [];
Object.values(specImages).flat().forEach(src => {
  const img = new Image();
  img.src = src;
  if (img.decode) img.decode().catch(() => {});
  preloaded.push(img); // keep a reference so the browser keeps it cached
});

const popup = document.getElementById('specPopup');
const popupImg = document.getElementById('specPopupImg');

const PW = 180, PH = 220;  // popup size (matches .spec-popup img in CSS)
const OFFSET = 30;         // distance from cursor on desktop
const EDGE = 8;            // keep this far from the screen edge
const HOLD_MS = 150;       // how long to hold on mobile before it shows

let holdTimer = null;

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function positionPopup(x, y, isTouch) {
  const vw = window.innerWidth, vh = window.innerHeight;
  let left, top;

  if (isTouch) {
    // Centered above the finger so it isn't covered
    left = x - PW / 2;
    top = y - PH - 50;
    if (top < EDGE) top = y + 50; // no room above, go below
  } else {
    // Beside the cursor, flipping left near the right edge
    left = x + OFFSET;
    top = y - PH / 2;
    if (left + PW > vw - EDGE) left = x - PW - OFFSET;
  }

  left = Math.max(EDGE, Math.min(left, vw - PW - EDGE));
  top = Math.max(EDGE, Math.min(top, vh - PH - EDGE));

  popup.style.left = left + 'px';
  popup.style.top = top + 'px';
}

function showPopup(link, x, y, isTouch) {
  const imgs = specImages[link.dataset.spec];
  if (!imgs) return;
  const src = pickRandom(imgs);
  if (popupImg.getAttribute('src') !== src) popupImg.src = src;
  positionPopup(x, y, isTouch);
  popup.classList.add('visible');
}

function hidePopup() {
  clearTimeout(holdTimer);
  holdTimer = null;
  popup.classList.remove('visible');
}

document.querySelectorAll('.specs__section a[data-spec]').forEach(link => {
  // Links go nowhere, and block the long-press menu on mobile
  link.addEventListener('click', e => e.preventDefault());
  link.addEventListener('contextmenu', e => e.preventDefault());

  // Desktop: show on hover, follow the cursor, hide on leave
  link.addEventListener('pointerenter', e => {
    if (e.pointerType !== 'touch') showPopup(link, e.clientX, e.clientY, false);
  });
  link.addEventListener('pointermove', e => {
    if (e.pointerType !== 'touch' && popup.classList.contains('visible')) {
      positionPopup(e.clientX, e.clientY, false);
    }
  });
  link.addEventListener('pointerleave', e => {
    if (e.pointerType !== 'touch') hidePopup();
  });

  // Mobile: press and hold to show, let go to hide.
  // Scrolling fires pointercancel, so a swipe won't trigger it.
  link.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'touch') return;
    const x = e.clientX, y = e.clientY;
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => showPopup(link, x, y, true), HOLD_MS);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => {
    link.addEventListener(type, e => {
      if (e.pointerType === 'touch') hidePopup();
    });
  });
});

document.querySelectorAll(
  '.designintent-grid img, .process-grid img, .outcome-grid img, .outcome-grid video'
).forEach(el => {
  el.style.cursor = 'pointer';
  el.style.transition = 'transform 0.3s ease';
  el.style.position = 'relative';
  el.style.zIndex = '1';

  el.addEventListener('click', () => {
    const isExpanded = el.dataset.expanded === 'true';
    if (isExpanded) {
      el.style.transform = '';
      el.style.zIndex = '1';
      el.dataset.expanded = 'false';
    } else {
      const rect = el.getBoundingClientRect();
      const dx = window.innerWidth / 2 - (rect.left + rect.width / 2);
      const dy = window.innerHeight / 2 - (rect.top + rect.height / 2);
      // Scale to ~80% of viewport width regardless of starting size
      const targetWidth = window.innerWidth * 0.8;
      const scale = targetWidth / rect.width;
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      el.style.zIndex = '9999';
      el.dataset.expanded = 'true';
    }
  });
});