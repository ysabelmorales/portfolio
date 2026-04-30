const specImages = {
  "Book Binding":      ["../images/Specs-12.webp"],
  "Print":             ["../images/Specs-08.webp"],
  "Screenprinting":    ["../images/Specs-11.webp"],
  "Prototyping":       ["../images/Specs-10.webp"],
  "Material Research": ["../images/Specs-09.webp"],
};

const popup = document.getElementById('specPopup');
const popupImg = document.getElementById('specPopupImg');
let activeLink = null;

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function showPopup(link, e) {
  const spec = link.dataset.spec;
  const imgs = specImages[spec];
  if (!imgs) return;
  popupImg.src = pickRandom(imgs);

  const x = e.clientX;
  const y = e.clientY;
  const pw = 180, ph = 220, offset = 30;
  const vw = window.innerWidth, vh = window.innerHeight;

  let left = x + offset;
  let top = y - ph / 2;
  if (left + pw > vw - 8) left = x - pw - offset;
  if (top < 8) top = 8;
  if (top + ph > vh - 8) top = vh - ph - 8;

  popup.style.left = left + 'px';
  popup.style.top = top + 'px';
  popup.classList.add('visible');
}

function hidePopup() {
  popup.classList.remove('visible');
  activeLink = null;
}

document.querySelectorAll('.specs__section a[data-spec]').forEach(link => {
  link.addEventListener('click', e => {
      e.preventDefault();
      if (activeLink === link) {
          hidePopup();
      } else {
          activeLink = link;
          const t = e.changedTouches ? e.changedTouches[0] : e;
          showPopup(link, t);
      }
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