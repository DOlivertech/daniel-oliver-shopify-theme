/* GalaxyField — animated starfield on a single fixed <canvas>.
   Ported from the danieloliverracing.com site (GalaxyField.astro) to plain JS.
   Runs on DOMContentLoaded (no Astro events). Stars twinkle on sine phases and
   drift slowly up-right with size-based parallax; a few bright stars carry a
   radial halo; an occasional brand-tinted shooting star streaks across.
   devicePixelRatio capped at 2. Reduced motion: draw once, static — no loop. */
(function () {
  "use strict";

  function init() {
    var canvas = document.getElementById("galaxy-field");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pale white / cyan / violet / pink — stars read white with a brand hint.
    var TINTS = [
      [255, 255, 255],
      [255, 255, 255],
      [186, 230, 253],
      [221, 214, 254],
      [251, 207, 232]
    ];

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var w = 0, h = 0;
    var stars = [];
    var comets = [];
    var nextComet = 6 + Math.random() * 8;
    var raf = 0;

    function seed() {
      var n = Math.min(280, Math.round((w * h) / 6500));
      stars = [];
      for (var i = 0; i < n; i++) {
        var bright = Math.random() < 0.12; // standout stars carry a glow halo
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: bright ? 1.4 + Math.random() * 0.9 : 0.5 + Math.random() * 1.1,
          a: bright ? 0.75 + Math.random() * 0.25 : 0.35 + Math.random() * 0.45,
          tw: 0.4 + Math.random() * 1.5,
          ph: Math.random() * Math.PI * 2,
          v: 1.2 + Math.random() * 3.2,
          tint: TINTS[(Math.random() * TINTS.length) | 0],
          glow: bright
        });
      }
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduce) drawStatic();
    }

    function drawStars(t) {
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var twinkle = reduce ? 0.8 : 0.62 + 0.38 * Math.sin(t * s.tw + s.ph);
        var R = s.tint[0], G = s.tint[1], B = s.tint[2];
        if (s.glow) {
          var halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
          halo.addColorStop(0, "rgba(" + R + "," + G + "," + B + "," + (0.28 * s.a * twinkle) + ")");
          halo.addColorStop(1, "rgba(" + R + "," + G + "," + B + ",0)");
          ctx.globalAlpha = 1;
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = s.a * twinkle;
        ctx.fillStyle = "rgb(" + R + "," + G + "," + B + ")";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function drawStatic() {
      ctx.clearRect(0, 0, w, h);
      drawStars(0);
    }

    function spawnComet() {
      var fromTop = Math.random() < 0.7;
      var speed = 380 + Math.random() * 260;
      var ang = (18 + Math.random() * 22) * (Math.PI / 180);
      comets.push({
        x: fromTop ? Math.random() * w * 0.9 : -40,
        y: fromTop ? -30 : Math.random() * h * 0.4,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        life: 0,
        max: 0.8 + Math.random() * 0.5
      });
    }

    function drawComets(dt) {
      for (var i = 0; i < comets.length; i++) {
        var c = comets[i];
        c.life += dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        var fade = Math.sin(Math.min(1, c.life / c.max) * Math.PI);
        var len = 90;
        var hyp = Math.hypot(c.vx, c.vy);
        var tx = c.x - (c.vx / hyp) * len;
        var ty = c.y - (c.vy / hyp) * len;
        var grad = ctx.createLinearGradient(tx, ty, c.x, c.y);
        grad.addColorStop(0, "rgba(139,92,246,0)");
        grad.addColorStop(0.6, "rgba(56,189,248," + (0.35 * fade) + ")");
        grad.addColorStop(1, "rgba(255,255,255," + (0.85 * fade) + ")");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();
      }
      comets = comets.filter(function (c) {
        return c.life < c.max && c.x < w + 120 && c.y < h + 120;
      });
    }

    var last = (window.performance && performance.now) ? performance.now() : Date.now();
    function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      var t = now / 1000;

      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.x += s.v * s.r * dt * 0.5;
        s.y -= s.v * s.r * dt * 0.25;
        if (s.x > w + 2) s.x = -2;
        if (s.y < -2) s.y = h + 2;
      }
      drawStars(t);

      nextComet -= dt;
      if (nextComet <= 0) {
        spawnComet();
        nextComet = 7 + Math.random() * 9;
      }
      drawComets(dt);

      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });

    if (!reduce) {
      last = (window.performance && performance.now) ? performance.now() : Date.now();
      raf = requestAnimationFrame(frame);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
