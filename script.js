/* ==========================================================
   Prathvi portfolio — 3D interactions
   ========================================================== */

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
      targetRY = (mouseX - 0.5) * 10;  // rotateY — deeper immersive tilt
      targetRX = (0.5 - mouseY) * 7;   // rotateX
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
