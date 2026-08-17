/* ==========================================================
   Prathvi portfolio — 3D interactions
   ========================================================== */

// ---------- 0. ENTRY GATE : scratch to enter ----------
(function gate() {
  const gateEl = document.getElementById("gate");
  const cv = document.getElementById("gateCanvas");
  const bar = document.getElementById("gateBar");
  const skip = document.getElementById("gateSkip");
  if (!gateEl || !cv) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const styles = getComputedStyle(document.documentElement);
  const theme = () => ({
    accent: styles.getPropertyValue("--accent").trim(),
    accentInk: styles.getPropertyValue("--accent-ink").trim(),
  });

  const ctx = cv.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W, H, opened = false;

  function paintCover() {
    W = cv.width = innerWidth * dpr;
    H = cv.height = innerHeight * dpr;
    const { accent, accentInk } = theme();

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, W, H);

    // cover art: name + hint
    ctx.fillStyle = accentInk;
    ctx.textAlign = "center";

    ctx.font = `800 ${Math.min(W * 0.09, 150 * dpr)}px Archivo, sans-serif`;
    ctx.fillText("PRATHVI", W / 2, H / 2 - 10 * dpr);

    ctx.font = `500 ${15 * dpr}px "Space Grotesk", sans-serif`;
    ctx.globalAlpha = 0.75;
    ctx.fillText("scratch anywhere to enter", W / 2, H / 2 + 42 * dpr);
    ctx.globalAlpha = 1;
  }
  paintCover();
  window.addEventListener("resize", () => { if (!opened) paintCover(); });

  const brush = Math.max(innerWidth, innerHeight) * 0.07 * dpr;
  let last = null;

  function scratch(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = brush * 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    if (last) ctx.moveTo(last.x, last.y); else ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
    last = { x, y };
  }

  // sample the alpha channel on a coarse grid to estimate % cleared
  function cleared() {
    const step = 24;
    const data = ctx.getImageData(0, 0, W, H).data;
    let clear = 0, total = 0;
    for (let y = 0; y < H; y += step * dpr) {
      for (let x = 0; x < W; x += step * dpr) {
        total++;
        if (data[((y | 0) * W + (x | 0)) * 4 + 3] < 128) clear++;
      }
    }
    return clear / total;
  }

  function open() {
    if (opened) return;
    opened = true;
    gateEl.classList.add("is-opening");
    document.body.classList.remove("is-locked"); // unleash all reveal animations
    gateEl.addEventListener("animationend", () => gateEl.remove());
  }

  let down = false, moves = 0;
  const pos = (e) => ({ x: e.clientX * dpr, y: e.clientY * dpr });

  gateEl.addEventListener("pointerdown", (e) => { down = true; last = null; scratch(pos(e).x, pos(e).y); });
  gateEl.addEventListener("pointermove", (e) => {
    if (!down || opened) return;
    const p = pos(e);
    scratch(p.x, p.y);
    if (++moves % 6 === 0) { // check progress every few strokes
      const c = cleared();
      bar.style.width = `${Math.min(c / 0.45, 1) * 100}%`;
      if (c > 0.45) open();
    }
  });
  window.addEventListener("pointerup", () => { down = false; last = null; });

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
