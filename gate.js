/* ==========================================================
   ENTRY GATE — HOLD TO DETONATE
   Press & hold anywhere. The charge builds, the screen
   rumbles, the letters vibrate… then everything blows.
   Release early and the charge drains back down.
   ========================================================== */
(function gate() {
  const gateEl = document.getElementById("gate");
  const cv = document.getElementById("gateCanvas");
  const bar = document.getElementById("gateBar");
  const skip = document.getElementById("gateSkip");
  if (!gateEl || !cv) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rs = getComputedStyle(document.documentElement);
  const theme = () => ({
    accent: rs.getPropertyValue("--accent").trim(),
    ink: rs.getPropertyValue("--accent-ink").trim(),
  });

  const ctx = cv.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const NAME = "PRATHVI";
  const CHARGE_TIME = 1.6; // seconds of holding to blow

  let W, H, fontSize, letters = [], opened = false, exploded = false;
  let charge = 0, holding = false, t = 0;
  const debris = [], waves = [];
  let shake = 0, whiteout = 0;
  let mouse = { x: 0.5, y: 0.5 };

  function layout() {
    W = cv.width = innerWidth * dpr;
    H = cv.height = innerHeight * dpr;
    fontSize = Math.min(W * 0.115, 190 * dpr);
    ctx.font = `800 ${fontSize}px Archivo, sans-serif`;
    const widths = [...NAME].map((c) => ctx.measureText(c).width);
    const gap = fontSize * 0.06;
    const total = widths.reduce((a, b) => a + b, 0) + gap * (NAME.length - 1);
    let x = (W - total) / 2;
    letters = [...NAME].map((ch, i) => {
      const l = { ch, x: x + widths[i] / 2, y: H / 2, w: widths[i], phase: Math.random() * Math.PI * 2 };
      x += widths[i] + gap;
      return l;
    });
  }
  layout();
  window.addEventListener("resize", () => { if (!opened && !exploded) layout(); });

  // ---- sample a letter's glyph into debris particles ----
  function burst(l) {
    const { accent, ink } = theme();
    const pad = fontSize * 0.2;
    const ow = Math.ceil(l.w + pad * 2), oh = Math.ceil(fontSize * 1.2);
    const off = document.createElement("canvas");
    off.width = ow; off.height = oh;
    const octx = off.getContext("2d");
    octx.font = `800 ${fontSize}px Archivo, sans-serif`;
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillStyle = "#fff";
    octx.fillText(l.ch, ow / 2, oh / 2);
    const data = octx.getImageData(0, 0, ow, oh).data;

    const step = Math.max(4, Math.round(fontSize / 24));
    for (let py = 0; py < oh; py += step) {
      for (let px = 0; px < ow; px += step) {
        if (data[(py * ow + px) * 4 + 3] > 128) {
          const gx = l.x - ow / 2 + px;
          const gy = l.y - oh / 2 + py;
          const ang = Math.atan2(gy - H / 2, gx - W / 2) + (Math.random() - 0.5) * 0.6;
          const spd = (5 + Math.random() * 14) * dpr;
          debris.push({
            x: gx, y: gy,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd - 4 * dpr,
            s: step * (0.55 + Math.random() * 0.5),
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.4,
            life: 1,
            color: Math.random() < 0.8 ? ink : accent,
          });
        }
      }
    }
  }

  function detonate() {
    if (exploded) return;
    exploded = true;
    letters.forEach(burst);
    waves.push({ x: W / 2, y: H / 2, r: fontSize * 0.3, alpha: 1, lw: 6 });
    waves.push({ x: W / 2, y: H / 2, r: fontSize * 0.1, alpha: 0.8, lw: 3 });
    shake = 30 * dpr;
    whiteout = 1;
    bar.style.width = "100%";
    setTimeout(open, 900); // savor the destruction, then enter
  }

  // ---- render loop ----
  let lastT = performance.now();
  function draw(now) {
    if (opened) return;
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;
    t += dt;
    const { accent, ink } = theme();

    // charge up / drain down
    if (!exploded) {
      if (holding) {
        charge = Math.min(1, charge + dt / CHARGE_TIME);
        if (charge >= 1) detonate();
      } else {
        charge = Math.max(0, charge - dt / (CHARGE_TIME * 0.7));
      }
      bar.style.width = `${charge * 100}%`;
      shake = Math.max(shake, charge * charge * 10 * dpr);
    }

    const sx = (Math.random() - 0.5) * shake;
    const sy = (Math.random() - 0.5) * shake;
    shake *= 0.88;

    ctx.setTransform(1, 0, 0, 1, sx, sy);
    ctx.fillStyle = accent;
    ctx.fillRect(-40, -40, W + 80, H + 80);

    if (!exploded) {
      // hint
      ctx.fillStyle = ink;
      ctx.textAlign = "center";
      ctx.globalAlpha = 0.7;
      ctx.font = `500 ${15 * dpr}px "Space Grotesk", sans-serif`;
      ctx.fillText(
        holding ? (charge > 0.7 ? "..." : "keep holding...") : "hold anywhere to detonate",
        W / 2, H / 2 + fontSize * 0.85
      );
      ctx.globalAlpha = 1;

      // growing danger ring around the cursor while charging
      if (charge > 0.02) {
        const r = (20 + charge * 70) * dpr;
        ctx.strokeStyle = ink;
        ctx.lineWidth = 2 * dpr + charge * 3 * dpr;
        ctx.globalAlpha = 0.35 + charge * 0.5;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, r + Math.sin(t * 18) * charge * 6 * dpr, 0, Math.PI * 2);
        ctx.stroke();
        // ticks
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 + t * (1 + charge * 4);
          ctx.beginPath();
          ctx.moveTo(mouse.x + Math.cos(a) * (r + 8 * dpr), mouse.y + Math.sin(a) * (r + 8 * dpr));
          ctx.lineTo(mouse.x + Math.cos(a) * (r + 16 * dpr), mouse.y + Math.sin(a) * (r + 16 * dpr));
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // letters: idle float → violent vibration as charge grows
      ctx.font = `800 ${fontSize}px Archivo, sans-serif`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      for (const l of letters) {
        const wob = Math.sin(t * 2 + l.phase) * fontSize * 0.02;
        const rumble = charge * charge * 9 * dpr;
        const jx = (Math.random() - 0.5) * rumble;
        const jy = (Math.random() - 0.5) * rumble;
        ctx.save();
        ctx.translate(l.x + jx, l.y + wob + jy);
        ctx.rotate((Math.random() - 0.5) * 0.05 * charge);
        // letters heat up: blend toward warning red at high charge
        ctx.fillStyle = ink;
        ctx.fillText(l.ch, 0, 0);
        if (charge > 0.5) {
          ctx.globalAlpha = (charge - 0.5) * 1.4;
          ctx.fillStyle = "#ff3728";
          ctx.fillText(l.ch, 0, 0);
          ctx.globalAlpha = 1;
        }
        ctx.restore();
      }
    }

    // ---- debris ----
    for (let i = debris.length - 1; i >= 0; i--) {
      const p = debris[i];
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.22 * dpr;
      p.vx *= 0.99;
      p.rot += p.vr;
      p.life -= 0.007;
      if (p.life <= 0 || p.y > H + 60) { debris.splice(i, 1); continue; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, p.life * 1.6);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // ---- shockwaves ----
    for (let i = waves.length - 1; i >= 0; i--) {
      const w = waves[i];
      w.r += 22 * dpr;
      w.alpha *= 0.92;
      if (w.alpha < 0.02) { waves.splice(i, 1); continue; }
      ctx.strokeStyle = ink;
      ctx.globalAlpha = w.alpha;
      ctx.lineWidth = (w.lw || 3) * dpr;
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // ---- detonation whiteout flash ----
    if (whiteout > 0.02) {
      ctx.fillStyle = `rgba(255,255,255,${whiteout * 0.85})`;
      ctx.fillRect(-40, -40, W + 80, H + 80);
      whiteout *= 0.9;
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  function open() {
    if (opened) return;
    opened = true;
    gateEl.classList.add("is-opening");
    document.body.classList.remove("is-locked"); // unleash all reveal animations
    gateEl.addEventListener("animationend", () => gateEl.remove());
  }

  gateEl.addEventListener("pointermove", (e) => {
    mouse = { x: e.clientX * dpr, y: e.clientY * dpr };
  });
  gateEl.addEventListener("pointerdown", (e) => {
    mouse = { x: e.clientX * dpr, y: e.clientY * dpr };
    holding = true;
  });
  window.addEventListener("pointerup", () => { holding = false; });
  gateEl.addEventListener("pointercancel", () => { holding = false; });

  // space bar can hold too
  window.addEventListener("keydown", (e) => {
    if (e.key === " ") { holding = true; mouse = { x: W / 2, y: H / 2 }; }
    if (e.key === "Enter" || e.key === "Escape") open();
  });
  window.addEventListener("keyup", (e) => { if (e.key === " ") holding = false; });

  skip.addEventListener("click", open);

  if (reduced) open(); // don't gate reduced-motion users
})();
