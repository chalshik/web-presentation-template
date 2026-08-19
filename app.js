/* Hero clips: play one at a time, advance when each finishes, and let the
   visitor swipe. Enhancement only — with JavaScript off the first clip plays
   and the other two sit on their poster frames. */
(function () {
  "use strict";

  var track = document.getElementById("track");
  if (!track) return;

  var slides = [].slice.call(track.querySelectorAll("video"));
  var dots = [].slice.call(document.querySelectorAll(".dot"));
  var still = window.matchMedia("(prefers-reduced-motion: reduce)");
  var current = 0;
  var onScreen = true;

  function quiet() {
    return still.matches;
  }

  function show(i, smooth) {
    current = i;
    dots.forEach(function (d, n) {
      d.classList.toggle("is-on", n === i);
      d.setAttribute("aria-current", n === i ? "true" : "false");
    });
    track.scrollTo({
      left: track.clientWidth * i,
      behavior: smooth && !quiet() ? "smooth" : "auto"
    });
    play();
  }

  function visible() {
    return document.visibilityState !== "hidden";
  }

  function start(v) {
    var p = v.play();
    if (!p || !p.catch) return;
    p.catch(function () {
      /* Coming back to a tab that sat in the background, or out of the
         back/forward cache, the element can be left with nothing decoded and
         play() rejects. Re-fetching the source is what recovers it. Once per
         stall — cleared again as soon as the clip is actually running — so a
         browser that simply refuses to autoplay is not put in a loop. */
      if (v.dataset.reloading) return;
      v.dataset.reloading = "1";
      try {
        v.load();
      } catch (e) {}
      var again = v.play();
      if (again && again.catch) again.catch(function () {});
    });
  }

  slides.forEach(function (v) {
    v.addEventListener("playing", function () {
      delete v.dataset.reloading;
    });
  });

  function play() {
    slides.forEach(function (v, n) {
      if (n === current && onScreen && visible() && !quiet()) {
        /* preload="none" on the other two means the file is only fetched the
           first time it is actually played, so opening the page costs one
           clip rather than three. */
        start(v);
      } else if (n !== current) {
        v.pause();
        /* Rewind what we left so it starts from the top next time round. */
        if (v.currentTime) v.currentTime = 0;
      }
    });
  }

  /* Advance when a clip finishes. The clips are not looped — running to the
     end is what drives the sequence. */
  slides.forEach(function (v, i) {
    v.addEventListener("ended", function () {
      if (i === current) show((i + 1) % slides.length, true);
    });
  });

  /* Manual swipe wins: follow whatever the visitor scrolled to. */
  var settle;
  track.addEventListener(
    "scroll",
    function () {
      clearTimeout(settle);
      settle = setTimeout(function () {
        var i = Math.round(track.scrollLeft / track.clientWidth);
        i = Math.max(0, Math.min(slides.length - 1, i));
        if (i !== current) {
          current = i;
          dots.forEach(function (d, n) {
            d.classList.toggle("is-on", n === i);
            d.setAttribute("aria-current", n === i ? "true" : "false");
          });
          play();
        }
      }, 120);
    },
    { passive: true }
  );

  dots.forEach(function (d, i) {
    d.addEventListener("click", function () {
      show(i, true);
    });
  });

  /* Nothing decodes while the hero is off screen. */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        onScreen = entries[0].isIntersecting;
        play();
      },
      { threshold: 0.12 }
    ).observe(track);
  }

  /* Leaving the tab pauses the clip, and nothing restarts it on the way back:
     the observer above only fires when the hero crosses the viewport edge, and
     a page restored from the back/forward cache never re-runs this script. So
     listen for the return itself. `pageshow` covers the bfcache restore,
     `visibilitychange` a tab or app switch, and `focus` the browsers that are
     stingy with the other two. */
  document.addEventListener("visibilitychange", function () {
    if (visible()) play();
  });
  window.addEventListener("pageshow", function () {
    play();
  });
  window.addEventListener("focus", function () {
    play();
  });

  /* Last resort: a browser in low-power mode refuses to autoplay at all. A tap
     on the hero is a user gesture, which it will honour. */
  track.addEventListener("click", function () {
    var v = slides[current];
    if (v && v.paused && !quiet()) start(v);
  });

  /* Autoplay is motion. If the visitor asked for less of it, nothing starts on
     its own and every clip gets a normal control instead. */
  function applyMotionPreference() {
    if (quiet()) {
      slides.forEach(function (v) {
        v.pause();
        v.setAttribute("controls", "");
        v.removeAttribute("autoplay");
      });
    } else {
      slides.forEach(function (v) {
        v.removeAttribute("controls");
      });
      play();
    }
  }
  if (still.addEventListener) still.addEventListener("change", applyMotionPreference);

  /* Browsers restore the scroll position of scrollable elements across a
     reload, which would drop a returning visitor into the middle of the
     sequence. That restore lands *after* this script runs, so reset both now
     and once the page has finished loading. */
  function rewind() {
    track.scrollLeft = 0;
    current = 0;
    dots.forEach(function (d, n) {
      d.classList.toggle("is-on", n === 0);
      d.setAttribute("aria-current", n === 0 ? "true" : "false");
    });
    play();
  }
  rewind();

  /* Scroll restoration lands at an unpredictable moment after load — later
     than `load` itself in Chrome — so rather than guess a delay, hold the
     track at the first clip for a short settling window, and stop the moment
     the visitor touches it. Auto-advance cannot fire in this window; the
     shortest clip is 5s. */
  var touched = false;
  ["pointerdown", "touchstart", "wheel", "keydown"].forEach(function (evt) {
    track.addEventListener(evt, function () {
      touched = true;
    }, { passive: true, once: true });
  });

  var settleUntil = Date.now() + 1600;
  (function hold() {
    if (touched || Date.now() > settleUntil) return;
    if (track.scrollLeft !== 0) rewind();
    requestAnimationFrame(hold);
  })();

  applyMotionPreference();
})();
