/* ==========================================================
   PRATHVI — game portfolio engine
   scroll reveals · XP tracker · letterbox · parallax ·
   3D operative cards · menu dust · objective updates
   ========================================================== */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

// ---------- scroll reveals ----------
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
  { threshold: 0.18 }
);
document.querySelectorAll(".rv").forEach((el) => io.observe(el));

// ---------- XP bar + objective + letterbox ----------
const xpFill = document.getElementById("xpFill");
const xpLabel = document.getElementById("xpLabel");
const hudObjective = document.getElementById("hudObjective");

const objectives = [
  { sel: "#top",     text: "OBJECTIVE: EXPLORE THE FRONTIER" },
  { sel: "#select",  text: "OBJECTIVE: SELECT YOUR OPERATIVE" },
  { sel: "#ch1",     text: "OBJECTIVE: SURVIVE THE DEADLINE" },
  { sel: "#ch2",     text: "OBJECTIVE: BUILD BEFORE THE STORM" },
  { sel: "#ch3",     text: "OBJECTIVE: FIND THE LAST LIGHT" },
  { sel: "#ch4",     text: "OBJECTIVE: TAME THE FRONTIER" },
  { sel: "#contact", text: "OBJECTIVE: SEND PARTY INVITE" },
].map((o) => ({ el: document.querySelector(o.sel), text: o.text }));

const chapters = [...document.querySelectorAll(".chapter")];

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - innerHeight;
    const p = Math.min(1, Math.max(0, scrollY / max));
    xpFill.style.width = `${p * 100}%`;
    xpLabel.textContent = `${Math.round(p * 100)}% EXPLORED`;

    // current objective = deepest section whose top has passed mid-screen
    let current = objectives[0];
    for (const o of objectives) {
      if (o.el && o.el.getBoundingClientRect().top < innerHeight * 0.55) current = o;
    }
    if (hudObjective.textContent !== current.text) {
      hudObjective.style.opacity = 0;
      setTimeout(() => {
        hudObjective.textContent = current.text;
        hudObjective.style.opacity = 1;
      }, 250);
    }

    // letterbox while inside a chapter
    const cinematic = chapters.some((c) => {
      const r = c.getBoundingClientRect();
      return r.top < innerHeight * 0.4 && r.bottom > innerHeight * 0.6;
    });
    document.body.classList.toggle("is-cinematic", cinematic);

    // parallax backgrounds
    if (!reducedMotion) {
      document.querySelectorAll(".parallax").forEach((bg) => {
        const r = bg.parentElement.getBoundingClientRect();
        const speed = parseFloat(bg.dataset.plx || 0.3);
        bg.style.transform = `translateY(${(r.top * -speed).toFixed(1)}px)`;
      });
    }

    ticking = false;
  });
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- operative cards: 3D tilt + select ----------
const status = document.getElementById("selectStatus");
document.querySelectorAll(".op").forEach((op) => {
  const card = op.querySelector(".op__card");

  if (finePointer && !reducedMotion) {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `rotateY(${(px * 22).toFixed(2)}deg) rotateX(${(-py * 16).toFixed(2)}deg) translateZ(24px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  }

  card.addEventListener("click", () => {
    const was = op.classList.contains("is-selected");
    document.querySelectorAll(".op").forEach((o) => o.classList.remove("is-selected"));
    if (!was) {
      op.classList.add("is-selected");
      const name = op.querySelector(".op__tag b").textContent;
      status.innerHTML = `OPERATIVE LOCKED: <b>${name}</b> · SCROLL TO DEPLOY ⌄`;
    } else {
      status.textContent = "HOVER TO INSPECT · CLICK TO SELECT";
    }
  });
});

// ---------- menu dust (embers drifting over the frontier) ----------
const dust = document.getElementById("dust");
if (dust && !reducedMotion) {
  const ctx = dust.getContext("2d");
  let W, H, parts;
  let mx = 0.5;

  function resize() {
    W = dust.width = dust.offsetWidth;
    H = dust.height = dust.offsetHeight;
    parts = Array.from({ length: Math.min(90, W / 16) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.5 + Math.random() * 1.8,
      vy: -(0.15 + Math.random() * 0.5),
      vx: (Math.random() - 0.5) * 0.3,
      a: 0.15 + Math.random() * 0.5,
      tw: Math.random() * Math.PI * 2,
    }));
  }
  resize();
  addEventListener("resize", resize, { passive: true });
  addEventListener("mousemove", (e) => { mx = e.clientX / innerWidth; }, { passive: true });

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    const t = performance.now() / 1000;
    for (const p of parts) {
      p.y += p.vy;
      p.x += p.vx + (mx - 0.5) * 0.6;
      if (p.y < -8) { p.y = H + 8; p.x = Math.random() * W; }
      if (p.x < -8) p.x = W + 8;
      if (p.x > W + 8) p.x = -8;
      const glow = p.a * (0.6 + 0.4 * Math.sin(t * 2 + p.tw));
      ctx.globalAlpha = glow;
      ctx.fillStyle = "#e8b45a";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  })();
}
