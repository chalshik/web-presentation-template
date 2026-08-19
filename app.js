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
  /* Set as soon as the visitor picks a clip themselves, by tap or by dot, which
     ends the settling window below. */
  var touched = false;

  function quiet() {
    return still.matches;
  }

  function visible() {
    return document.visibilityState !== "hidden";
  }

  function wanted(v) {
    return v === slides[current] && onScreen && visible() && !quiet();
  }

  function mark(i) {
    dots.forEach(function (d, n) {
      d.classList.toggle("is-on", n === i);
      d.setAttribute("aria-current", n === i ? "true" : "false");
    });
  }

  function show(i, smooth) {
    current = i;
    mark(i);
    track.scrollTo({
      left: track.clientWidth * i,
      behavior: smooth && !quiet() ? "smooth" : "auto"
    });
    play();
  }

  /* Asking a clip to play on the way back into the page is not a single
     yes-or-no. The browser can refuse simply because the page is still being
     restored, so back off and ask again for a couple of seconds rather than
     giving up on the first no. */
  var WAITS = [90, 250, 600, 1200, 2000];

  function start(v, tries) {
    tries = tries || 0;
    clearTimeout(v.retryTimer);
    v.climbing = false;
    /* Every fresh attempt retires the one before it, so overlapping resume
       signals — pageshow and visibilitychange and focus can all land on the
       same return — cannot leave two ladders climbing at once. */
    var gen = (v.attempt = (v.attempt || 0) + 1);
    var p = v.play();
    if (!p || !p.catch) return;
    p.catch(function () {
      if (gen !== v.attempt) return;
      v.climbing = false;
      if (!wanted(v) || tries >= WAITS.length) return;
      /* A tab that sat in the background, or a page out of the back/forward
         cache, can leave the element with nothing decoded; re-fetching the
         source is what recovers that. Try it once part-way up the ladder —
         late enough that a merely mistimed refusal has had its chances, early
         enough to still have attempts left afterwards. */
      if (tries === 1) reload(v);
      v.climbing = true;
      v.retryTimer = setTimeout(function () {
        v.climbing = false;
        if (gen === v.attempt) start(v, tries + 1);
      }, WAITS[tries]);
    });
  }

  function reload(v) {
    try {
      v.load();
    } catch (e) {}
  }

  function play() {
    slides.forEach(function (v, n) {
      if (n === current) {
        /* preload="none" on the other two means the file is only fetched the
           first time it is actually played, so opening the page costs one
           clip rather than three. */
        if (wanted(v)) start(v);
        /* Off screen or in a hidden tab, stop decoding — but under reduced
           motion the clip has a control on it and whatever the visitor chose
           with it is theirs to keep. */
        else if (!quiet()) stop(v, false);
      } else {
        /* Rewind what we left so it starts from the top next time round. */
        stop(v, true);
      }
    });
  }

  function stop(v, rewindIt) {
    clearTimeout(v.retryTimer);
    v.climbing = false;
    v.attempt = (v.attempt || 0) + 1;
    v.pause();
    if (rewindIt && v.currentTime) v.currentTime = 0;
  }

  /* play() resolving is not proof that anything moved: a clip that lost its
     decoded frames while the tab was away reports itself as playing and sits
     on a frozen frame. Watch the clock rather than trust the promise. */
  var seen = -1;
  var stalled = 0;

  function watch() {
    var v = slides[current];
    if (!v || !wanted(v) || v.ended) {
      seen = -1;
      stalled = 0;
      return;
    }
    if (v.paused) {
      seen = -1;
      stalled = 0;
      /* Unless a resume is already working its way up the ladder above. */
      if (!v.climbing) start(v);
      return;
    }
    if (v.currentTime === seen) {
      /* Three ticks, so a clip that is merely buffering gets a fair chance to
         come good before the source is fetched again. */
      if (++stalled >= 3) {
        stalled = 0;
        reload(v);
        start(v);
      }
    } else {
      stalled = 0;
    }
    seen = v.currentTime;
  }
  setInterval(watch, 1000);

  slides.forEach(function (v) {
    v.addEventListener("playing", function () {
      clearTimeout(v.retryTimer);
      v.climbing = false;
      stalled = 0;
    });
  });

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
          mark(i);
          play();
        }
      }, 120);
    },
    { passive: true }
  );

  dots.forEach(function (d, i) {
    d.addEventListener("click", function () {
      touched = true;
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
        stop(v, false);
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
    mark(0);
    play();
  }
  rewind();

  /* Scroll restoration lands at an unpredictable moment after load — later
     than `load` itself in Chrome — so rather than guess a delay, hold the
     track at the first clip for a short settling window, and stop the moment
     the visitor touches it. Auto-advance cannot fire in this window; the
     shortest clip is 5s. */
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
