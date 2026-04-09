const specImages = {
    "Book Binding":      ["../images/tcbCarousel3.jpg"],
    "Print":             ["../images/tcbCarousel5.jpg"],
    "Screenprinting":    ["../images/tcbCarousel4.jpg"],
    "Prototyping":       ["../images/tcbCarousel1.jpg"],
    "Material Research": ["../images/tcbCarousel6.jpg"],
    "Installation":      ["../images/installation.JPG"],
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
  
  document.addEventListener('click', e => {
    if (!e.target.closest('.specs__section a[data-spec]')) hidePopup();
  });