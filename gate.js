/* ==========================================================
   ENTRY GATE — the letters FIGHT BACK
   Smash all 7 letters of PRATHVI to enter.
   They dodge, they take 2 hits, they shoot back,
   and a hit on YOU revives one of their fallen.
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
  const MAX_REVIVES = 3; // they can only cheat death 3 times — you always win eventually

  let W, H, fontSize, letters = [], opened = false, revives = 0;
  const debris = [], waves = [], shots = [];
  let shake = 0, flash = 0, t = 0;
  let mouse = { x: -9999, y: -9999 };

  function layout() {
    W = cv.width = innerWidth * dpr;
    H = cv.height = innerHeight * dpr;
    fontSize = Math.min(W * 0.115, 190 * dpr);
    ctx.font = `800 ${fontSize}px Archivo, sans-serif`;
    const widths = [...NAME].map((c) => ctx.measureText(c).width);
    const gap = fontSize * 0.06;
    const total = widths.reduce((a, b) => a + b, 0) + gap * (NAME.length - 1);
    let x = (W - total) / 2;
    const y = H / 2;
    const prev = letters;
    letters = [...NAME].map((ch, i) => {
      const p = prev[i] || {};
      const l = {
        ch,
        hx: x + widths[i] / 2, hy: y,          // home position
        x: p.alive === undefined ? x + widths[i] / 2 : p.x,
        y: p.alive === undefined ? y : p.y,
        vx: 0, vy: 0,
        w: widths[i],
        hp: p.hp ?? 2,
        alive: p.alive ?? true,
        phase: Math.random() * Math.PI * 2,
        cool: 1.5 + Math.random() * 3,          // seconds until next shot
      };
      x += widths[i] + gap;
      return l;
    });
  }
  layout();
  window.addEventListener("resize", () => { if (!opened) layout(); });

  const aliveCount = () => letters.filter((l) => l.alive).length;
  const enraged = () => aliveCount() <= 2;

  function updateBar() {
    bar.style.width = `${((NAME.length - aliveCount()) / NAME.length) * 100}%`;
  }

  // ---- debris burst sampled from the letter's own glyph ----
  function burst(l, full) {
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

    const step = Math.max(4, Math.round(fontSize / (full ? 26 : 12)));
    for (let py = 0; py < oh; py += step) {
      for (let px = 0; px < ow; px += step) {
        if (data[(py * ow + px) * 4 + 3] > 128 && (full || Math.random() < 0.25)) {
          const gx = l.x - ow / 2 + px;
          const gy = l.y - oh / 2 + py;
          const ang = Math.atan2(gy - l.y, gx - l.x) + (Math.random() - 0.5);
          const spd = (2 + Math.random() * (full ? 9 : 5)) * dpr;
          debris.push({
            x: gx, y: gy,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd - 3 * dpr,
            s: step * (0.55 + Math.random() * 0.5),
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.3,
            life: 1,
            color: Math.random() < 0.85 ? ink : accent,
          });
        }
      }
    }
  }

  function hit(px, py) {
    if (opened) return;
    for (const l of letters) {
      if (!l.alive) continue;
      if (Math.abs(px - l.x) < l.w * 0.65 && Math.abs(py - l.y) < fontSize * 0.6) {
        l.hp--;
        if (l.hp <= 0) {
          l.alive = false;
          burst(l, true);
          waves.push({ x: l.x, y: l.y, r: fontSize * 0.2, alpha: 0.9 });
          shake = 14 * dpr;
          updateBar();
          if (aliveCount() === 0) setTimeout(open, 550);
        } else {
          // wounded: chip off some debris and knock it flying
          burst(l, false);
          const ang = Math.atan2(l.y - py, l.x - px);
          l.vx += Math.cos(ang) * 22 * dpr;
          l.vy += Math.sin(ang) * 22 * dpr;
          shake = 7 * dpr;
        }
        return;
      }
    }
  }

  // ---- a projectile hit YOU: sting + revive one fallen letter ----
  function playerHit(x, y) {
    flash = 1;
    shake = 18 * dpr;
    waves.push({ x, y, r: 10 * dpr, alpha: 0.9 });
    if (revives < MAX_REVIVES) {
      const dead = letters.filter((l) => !l.alive);
      if (dead.length) {
        const l = dead[Math.floor(Math.random() * dead.length)];
        l.alive = true;
        l.hp = 1;
        l.x = l.hx; l.y = l.hy; l.vx = l.vy = 0;
        waves.push({ x: l.hx, y: l.hy, r: fontSize * 0.15, alpha: 0.7 });
        revives++;
        updateBar();
      }
    }
  }

  // ---- render loop ----
  let lastT = performance.now();
  function draw(now) {
    if (opened) return;
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;
    t += dt;
    const { accent, ink } = theme();
    const rage = enraged();

    const sx = (Math.random() - 0.5) * shake;
    const sy = (Math.random() - 0.5) * shake;
    shake *= 0.86;

    ctx.setTransform(1, 0, 0, 1, sx, sy);
    ctx.fillStyle = accent;
    ctx.fillRect(-30, -30, W + 60, H + 60);

    // hint
    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    ctx.globalAlpha = 0.7;
    ctx.font = `500 ${15 * dpr}px "Space Grotesk", sans-serif`;
    ctx.fillText(
      rage && aliveCount() > 0
        ? "they're angry now. finish it."
        : "smash all 7 letters to enter — careful, they fight back",
      W / 2, H / 2 + fontSize * 0.85
    );
    ctx.globalAlpha = 1;

    // ---- letters: dodge, drift home, tremble, shoot ----
    ctx.font = `800 ${fontSize}px Archivo, sans-serif`;
    ctx.textBaseline = "middle";
    for (const l of letters) {
      if (!l.alive) continue;

      // dodge the cursor
      const dx = l.x - mouse.x, dy = l.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      const R = fontSize * (rage ? 1.5 : 1.05);
      if (dist < R && dist > 0.01) {
        const f = ((R - dist) / R) * (rage ? 4.2 : 2.6) * dpr;
        l.vx += (dx / dist) * f;
        l.vy += (dy / dist) * f;
      }

      // spring home + damping
      l.vx += (l.hx - l.x) * 0.012;
      l.vy += (l.hy - l.y) * 0.012;
      l.vx *= 0.92; l.vy *= 0.92;
      l.x += l.vx; l.y += l.vy;

      // stay on screen
      const m = fontSize * 0.5;
      l.x = Math.max(m, Math.min(W - m, l.x));
      l.y = Math.max(m, Math.min(H - m, l.y));

      // shoot at the cursor
      if (mouse.x > -999) {
        l.cool -= dt;
        if (l.cool <= 0) {
          l.cool = (rage ? 1.2 : 2.5) + Math.random() * (rage ? 1.5 : 3);
          const a = Math.atan2(mouse.y - l.y, mouse.x - l.x);
          const spd = (rage ? 7.5 : 5.5) * dpr;
          shots.push({ x: l.x, y: l.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd });
        }
      }

      // draw: wounded letters tremble, enraged letters pulse
      const wounded = l.hp === 1;
      const wob = Math.sin(t * 2 + l.phase) * fontSize * 0.02;
      const jx = wounded ? (Math.random() - 0.5) * 5 * dpr : 0;
      const jy = wounded ? (Math.random() - 0.5) * 5 * dpr : 0;
      ctx.save();
      ctx.translate(l.x + jx, l.y + wob + jy);
      if (wounded) ctx.rotate((Math.random() - 0.5) * 0.06);
      if (rage) {
        const p = 1 + Math.sin(t * 10 + l.phase) * 0.035;
        ctx.scale(p, p);
      }
      ctx.globalAlpha = wounded ? 0.85 : 1;
      ctx.fillStyle = ink;
      ctx.fillText(l.ch, 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    // ---- projectiles ----
    for (let i = shots.length - 1; i >= 0; i--) {
      const s = shots[i];
      s.x += s.vx; s.y += s.vy;
      if (s.x < -20 || s.x > W + 20 || s.y < -20 || s.y > H + 20) {
        shots.splice(i, 1);
        continue;
      }
      if (Math.hypot(s.x - mouse.x, s.y - mouse.y) < 22 * dpr) {
        shots.splice(i, 1);
        playerHit(s.x, s.y);
        continue;
      }
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 5 * dpr, 0, Math.PI * 2);
      ctx.fill();
      // little tail
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(s.x - s.vx * 1.5, s.y - s.vy * 1.5, 3 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // ---- debris ----
    for (let i = debris.length - 1; i >= 0; i--) {
      const p = debris[i];
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.22 * dpr;
      p.vx *= 0.99;
      p.rot += p.vr;
      p.life -= 0.008;
      if (p.life <= 0 || p.y > H + 40) { debris.splice(i, 1); continue; }
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
      w.r += 18 * dpr;
      w.alpha *= 0.9;
      if (w.alpha < 0.02) { waves.splice(i, 1); continue; }
      ctx.strokeStyle = ink;
      ctx.globalAlpha = w.alpha;
      ctx.lineWidth = 3 * dpr;
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // ---- crosshair cursor ----
    if (mouse.x > -999) {
      const r = 14 * dpr;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, r, 0, Math.PI * 2);
      ctx.moveTo(mouse.x - r * 1.6, mouse.y); ctx.lineTo(mouse.x - r * 0.6, mouse.y);
      ctx.moveTo(mouse.x + r * 0.6, mouse.y); ctx.lineTo(mouse.x + r * 1.6, mouse.y);
      ctx.moveTo(mouse.x, mouse.y - r * 1.6); ctx.lineTo(mouse.x, mouse.y - r * 0.6);
      ctx.moveTo(mouse.x, mouse.y + r * 0.6); ctx.lineTo(mouse.x, mouse.y + r * 1.6);
      ctx.stroke();
    }

    // ---- "you got hit" red sting ----
    if (flash > 0.02) {
      ctx.fillStyle = `rgba(255, 55, 40, ${flash * 0.3})`;
      ctx.fillRect(-30, -30, W + 60, H + 60);
      flash *= 0.88;
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
    hit(e.clientX * dpr, e.clientY * dpr);
  });

  skip.addEventListener("click", open);
  window.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === "Escape") open(); });

  if (reduced) open(); // don't gate reduced-motion users
})();
