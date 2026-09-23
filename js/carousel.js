// Drifting carousels — shared by every page.
// Any .carousel on the page slides slowly and loops forever; the < > arrows still work.
(function () {
    var SECONDS_PER_SLIDE = 20; // drift speed: higher = slower
    var ARROW_TIME = 0.6;       // how long an arrow click takes to glide (s)

    function init() {
        document.querySelectorAll('.carousel').forEach(function (el) {
            if (el.dataset.drift) return; // don't set up the same carousel twice
            el.dataset.drift = 'on';

            var track = el.querySelector('.carousel__track');
            if (!track) return;
            var slides = track.querySelectorAll('.carousel__slide');
            var n = slides.length;
            if (n < 2) return;

            // Copy the first slide onto the end so the loop is seamless
            track.appendChild(slides[0].cloneNode(true));
            track.style.transition = 'none';

            var pos = 0, last = null, jump = null, visible = true;

            function ease(k) { return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }

            function frame(t) {
                var dt = last === null ? 0 : Math.min((t - last) / 1000, 0.1);
                last = t;

                if (visible) {
                    if (jump) {
                        jump.elapsed += dt;
                        var k = Math.min(jump.elapsed / ARROW_TIME, 1);
                        pos = jump.from + (jump.to - jump.from) * ease(k);
                        if (k === 1) jump = null;
                    } else {
                        pos += dt / SECONDS_PER_SLIDE;
                    }
                    if (pos >= n) { pos -= n; if (jump) { jump.from -= n; jump.to -= n; } }
                    if (pos < 0)  { pos += n; if (jump) { jump.from += n; jump.to += n; } }
                    track.style.transform = 'translateX(' + (-pos * 100) + '%)';
                }
                requestAnimationFrame(frame);
            }

            function jumpTo(dir) {
                var base = jump ? jump.to : pos;
                var to = dir > 0 ? Math.floor(base + 0.001) + 1 : Math.ceil(base - 0.001) - 1;
                jump = { from: pos, to: to, elapsed: 0 };
            }

            var prev = el.querySelector('.prev');
            var next = el.querySelector('.next');
            if (prev) prev.addEventListener('click', function (e) { e.stopImmediatePropagation(); jumpTo(-1); });
            if (next) next.addEventListener('click', function (e) { e.stopImmediatePropagation(); jumpTo(1); });

            // Pause the drift while a carousel is scrolled off screen
            if ('IntersectionObserver' in window) {
                new IntersectionObserver(function (entries) {
                    visible = entries[0].isIntersecting;
                }).observe(el);
            }

            requestAnimationFrame(frame);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();