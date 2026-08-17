/* ==========================================================
   Prathvi portfolio — 3D interactions
   ========================================================== */

// ---------- 0. ENTRY GATE : smash the letters to enter ----------
(function gate() {
  const gateEl = document.getElementById("gate");
  const cv = document.getElementById("gateCanvas");
  const bar = document.getElementById("gateBar");
  const skip = document.getElementById("gateSkip");
  if (!gateEl || !cv) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rootStyles = getComputedStyle(document.documentElement);
  const theme = () => ({
    accent: rootStyles.getPropertyValue("--accent").trim(),
    accentInk: rootStyles.getPropertyValue("--accent-ink").trim(),
  });

  const ctx = cv.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W, H, fontSize, letters = [], opened = false;
  const NAME = "PRATHVI";
  const particles = [];
  const waves = [];
  let shake = 0;
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
      const l = {
        ch,
        x: x + widths[i] / 2,
        y,
        w: widths[i],
        alive: prev[i] ? prev[i].alive : true,
        phase: Math.random() * Math.PI * 2,
      };
      x += widths[i] + gap;
      return l;
    });
  }
  layout();
  window.addEventListener("resize", () => { if (!opened) layout(); });

  // ---- explode a letter into pixel debris ----
  function explode(l) {
    l.alive = false;
    const { accent, accentInk } = theme();

    // sample the letter's pixels on an offscreen canvas
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

    const step = Math.max(4, Math.round(fontSize / 26));
    for (let py = 0; py < oh; py += step) {
      for (let px = 0; px < ow; px += step) {
        if (data[(py * ow + px) * 4 + 3] > 128) {
          const gx = l.x - ow / 2 + px;
          const gy = l.y - oh / 2 + py;
          const ang = Math.atan2(gy - l.y, gx - l.x) + (Math.random() - 0.5);
          const spd = (2 + Math.random() * 9) * dpr;
          particles.push({
            x: gx, y: gy,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd - 3 * dpr,
            s: step * (0.55 + Math.random() * 0.5),
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.3,
            life: 1,
            color: Math.random() < 0.85 ? accentInk : accent,
          });
        }
      }
    }

    waves.push({ x: l.x, y: l.y, r: fontSize * 0.2, alpha: 0.9 });
    shake = 14 * dpr;

    const left = letters.filter((k) => k.alive).length;
    bar.style.width = `${((NAME.length - left) / NAME.length) * 100}%`;
    if (left === 0) setTimeout(open, 550); // let the debris fly first
  }

  function hit(px, py) {
    for (const l of letters) {
      if (!l.alive) continue;
      if (Math.abs(px - l.x) < l.w * 0.65 && Math.abs(py - l.y) < fontSize * 0.6) {
        explode(l);
        return;
      }
    }
  }

  // ---- render loop ----
  let t = 0;
  function draw() {
    if (opened) return;
    t += 0.016;
    const { accent, accentInk } = theme();

    // screen shake
    const sx = (Math.random() - 0.5) * shake;
    const sy = (Math.random() - 0.5) * shake;
    shake *= 0.86;

    ctx.setTransform(1, 0, 0, 1, sx, sy);
    ctx.fillStyle = accent;
    ctx.fillRect(-20, -20, W + 40, H + 40);

    // hint
    ctx.fillStyle = accentInk;
    ctx.textAlign = "center";
    ctx.globalAlpha = 0.7;
    ctx.font = `500 ${15 * dpr}px "Space Grotesk", sans-serif`;
    ctx.fillText("smash the letters to enter", W / 2, H / 2 + fontSize * 0.85);
    ctx.globalAlpha = 1;

    // letters: float, and tremble when the cursor is near
    ctx.font = `800 ${fontSize}px Archivo, sans-serif`;
    ctx.textBaseline = "middle";
    for (const l of letters) {
      if (!l.alive) continue;
      const near =
        Math.abs(mouse.x - l.x) < l.w * 0.9 &&
        Math.abs(mouse.y - l.y) < fontSize * 0.8;
      const wob = Math.sin(t * 2 + l.phase) * fontSize * 0.02;
      const tx = near ? (Math.random() - 0.5) * 6 * dpr : 0;
      const ty = near ? (Math.random() - 0.5) * 6 * dpr : 0;
      ctx.save();
      ctx.translate(l.x + tx, l.y + wob + ty);
      if (near) ctx.rotate((Math.random() - 0.5) * 0.04);
      ctx.fillStyle = accentInk;
      ctx.fillText(l.ch, 0, 0);
      ctx.restore();
    }

    // debris
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.22 * dpr;         // gravity
      p.vx *= 0.99;
      p.rot += p.vr;
      p.life -= 0.008;
      if (p.life <= 0 || p.y > H + 40) { particles.splice(i, 1); continue; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, p.life * 1.6);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // shockwave rings
    for (let i = waves.length - 1; i >= 0; i--) {
      const w = waves[i];
      w.r += 18 * dpr;
      w.alpha *= 0.9;
      if (w.alpha < 0.02) { waves.splice(i, 1); continue; }
      ctx.strokeStyle = accentInk;
      ctx.globalAlpha = w.alpha;
      ctx.lineWidth = 3 * dpr;
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
  }
  draw();

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
  gateEl.addEventListener("pointerdown", (e) => hit(e.clientX * dpr, e.clientY * dpr));

  skip.addEventListener("click", open);
  window.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === "Escape") open(); });

  if (reduced) open(); // don't gate reduced-motion users
})();

// ---------- 1. Split headline words into chars for 3D flip reveal ----------
document.querySelectorAll(".word").forEach((word) => {
  const base = parseFloat(word.dataset.delay || 0);
  const text = word.textContent;
  word.textContent = "";
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch;
    span.style.setProperty("--cd", `${base + i * 0.045}s`);
    word.appendChild(span);
  });
});

// ---------- 2. Strip speed control ----------
document.querySelectorAll(".strip[data-speed]").forEach((strip) => {
  strip.style.setProperty("--dur", `${strip.dataset.speed}s`);
});

// ---------- 3. Mouse-tracked 3D tilt on the whole hero ----------
const tilt = document.getElementById("tilt");
const glow = document.getElementById("glow");
const parallaxEls = document.querySelectorAll("[data-depth]");
const finePointer = window.matchMedia("(pointer: fine)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;
let mouseX = 0.5, mouseY = 0.5;

if (finePointer && !reducedMotion) {
  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
      targetRY = (mouseX - 0.5) * 7;   // rotateY
      targetRX = (0.5 - mouseY) * 5;   // rotateX
    },
    { passive: true }
  );

  (function animate() {
    // ease toward target for buttery motion
    curRX += (targetRX - curRX) * 0.07;
    curRY += (targetRY - curRY) * 0.07;

    if (tilt) {
      tilt.style.transform = `rotateX(${curRX.toFixed(3)}deg) rotateY(${curRY.toFixed(3)}deg)`;
    }

    // parallax the background shapes at different depths
    parallaxEls.forEach((el) => {
      const depth = parseFloat(el.dataset.depth || 0);
      const x = (mouseX - 0.5) * depth;
      const y = (mouseY - 0.5) * depth;
      el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });

    if (glow) {
      glow.style.transform = `translate(${(mouseX - 0.5) * 60}px, ${(mouseY - 0.5) * 60}px)`;
    }

    requestAnimationFrame(animate);
  })();
}

// ---------- 4. Per-card 3D tilt on the role cards ----------
document.querySelectorAll(".role").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.setProperty("--ry", `${(px * 18).toFixed(2)}deg`);
    card.style.setProperty("--rx", `${(-py * 14).toFixed(2)}deg`);
  });
  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });
});

// ---------- 5. Theme toggle with radial wipe ----------
const toggle = document.getElementById("themeToggle");
const root = document.documentElement;

// restore saved preference
const saved = localStorage.getItem("prathvi-theme");
if (saved === "light" || saved === "dark") root.dataset.theme = saved;

toggle?.addEventListener("click", (e) => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";

  // radial wipe from the button position
  if (!reducedMotion) {
    const wipe = document.createElement("div");
    wipe.className = "theme-wipe";
    const r = toggle.getBoundingClientRect();
    wipe.style.left = `${r.left + r.width / 2}px`;
    wipe.style.top = `${r.top + r.height / 2}px`;
    document.body.appendChild(wipe);
    wipe.addEventListener("animationend", () => wipe.remove());
  }

  root.dataset.theme = next;
  localStorage.setItem("prathvi-theme", next);
});

// ---------- 6. Drifting particle field ----------
const canvas = document.getElementById("particles");
if (canvas && !reducedMotion) {
  const ctx = canvas.getContext("2d");
  let W, H, dots;

  const accent = () =>
    getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    const n = Math.min(70, Math.floor(W / 22));
    dots = Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.6 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      depth: 0.3 + Math.random() * 0.7, // parallax factor + alpha
    }));
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    const col = accent();
    const px = (mouseX - 0.5) * 30;
    const py = (mouseY - 0.5) * 30;

    for (const d of dots) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < -10) d.x = W + 10; else if (d.x > W + 10) d.x = -10;
      if (d.y < -10) d.y = H + 10; else if (d.y > H + 10) d.y = -10;

      ctx.globalAlpha = 0.12 + d.depth * 0.25;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(d.x + px * d.depth, d.y + py * d.depth, d.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // connect close pairs with faint lines
    ctx.globalAlpha = 1;
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i], b = dots[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 110 * 110) {
          ctx.strokeStyle = col;
          ctx.globalAlpha = 0.05 * (1 - dist2 / (110 * 110));
          ctx.beginPath();
          ctx.moveTo(a.x + px * a.depth, a.y + py * a.depth);
          ctx.lineTo(b.x + px * b.depth, b.y + py * b.depth);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  })();
}

// ---------- 7. Scroll parallax on strips ----------
const strips = document.querySelectorAll(".strip");
let ticking = false;

window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      strips.forEach((s, i) => {
        const shift = Math.min(y * (i % 2 === 0 ? 0.04 : -0.04), 40);
        s.style.translate = `0 ${shift}px`;
      });
      ticking = false;
    });
  },
  { passive: true }
);
