/* ==========================================================
   OPERATIVE MESHES — real, interactive 3D character models.
   Procedural low-poly rigs built in three.js:
   drag to rotate · head tracks your cursor · click = action
   ========================================================== */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  import("./vendor/three.module.js")
    .catch(() => import("https://unpkg.com/three@0.160.0/build/three.module.js"))
    .then(init)
    .catch(() => {});

  function init(THREE) {
    const M = (color, opts = {}) =>
      new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0.08, ...opts });

    const box = (w, h, d, mat) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    const cyl = (rt, rb, h, mat, seg = 10) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
    const sph = (r, mat, seg = 10) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg), mat);

    // limb with pivot at the top (shoulder / hip)
    function limb(w, len, d, mat) {
      const g = new THREE.Group();
      const m = box(w, len, d, mat);
      m.position.y = -len / 2;
      g.add(m);
      return g;
    }

    // ---------- shared humanoid rig ----------
    function rig(c) {
      const root = new THREE.Group();
      const parts = {};

      // legs
      parts.legL = limb(0.16, 0.62, 0.18, c.legs); parts.legL.position.set(-0.13, 0.62, 0);
      parts.legR = limb(0.16, 0.62, 0.18, c.legs); parts.legR.position.set(0.13, 0.62, 0);
      root.add(parts.legL, parts.legR);

      // torso
      parts.torso = box(0.52, 0.6, 0.28, c.torso);
      parts.torso.position.y = 0.95;
      root.add(parts.torso);

      // arms
      parts.armL = limb(0.14, 0.56, 0.16, c.arms); parts.armL.position.set(-0.35, 1.2, 0);
      parts.armR = limb(0.14, 0.56, 0.16, c.arms); parts.armR.position.set(0.35, 1.2, 0);
      parts.armL.rotation.z = 0.08; parts.armR.rotation.z = -0.08;
      root.add(parts.armL, parts.armR);

      // head group (so hats/helmets ride along)
      parts.headG = new THREE.Group();
      parts.headG.position.y = 1.42;
      const head = box(0.3, 0.3, 0.3, c.head);
      head.position.y = 0.15;
      parts.headG.add(head);
      parts.head = head;
      root.add(parts.headG);

      return { root, parts };
    }

    /* ================= CHARACTERS ================= */

    function ghostline() {
      const { root, parts } = rig({
        legs: M(0x23262b), torso: M(0x1a1d22), arms: M(0x23262b), head: M(0x14161a),
      });
      // skull faceplate
      const face = box(0.22, 0.18, 0.02, M(0xd8d4c8, { roughness: 0.5 }));
      face.position.set(0, 0.13, 0.16);
      parts.headG.add(face);
      // helmet + NVG
      const helmet = box(0.36, 0.14, 0.36, M(0x2c3038));
      helmet.position.y = 0.34;
      const nvg = cyl(0.045, 0.045, 0.14, M(0x0d0e10, { roughness: 0.4 }));
      nvg.rotation.x = Math.PI / 2;
      nvg.position.set(0, 0.32, 0.2);
      parts.headG.add(helmet, nvg);
      // vest
      const vest = box(0.56, 0.4, 0.34, M(0x101215));
      vest.position.y = 1.0;
      root.add(vest);
      // rifle in right hand
      const rifle = new THREE.Group();
      const body = box(0.08, 0.09, 0.62, M(0x0c0d0f, { roughness: 0.45, metalness: 0.3 }));
      const mag = box(0.06, 0.16, 0.09, M(0x15171a));
      mag.position.set(0, -0.11, 0.06);
      rifle.add(body, mag);
      rifle.position.set(0, -0.5, 0.14);
      parts.armR.add(rifle);
      parts.armR.rotation.x = -0.35;

      return {
        root, parts, accent: 0x9fd8cb,
        action(u, p) { // shoulder the rifle + recoil
          const s = Math.sin(u * Math.PI);
          p.armR.rotation.x = -0.35 - s * 1.15;
          p.armL.rotation.x = -s * 0.9;
          p.headG.rotation.x = s * 0.12;
          if (u > 0.45 && u < 0.7) p.torso.position.z = -Math.sin((u - 0.45) * 24) * 0.02;
          else p.torso.position.z = 0;
        },
      };
    }

    function skybloom() {
      const { root, parts } = rig({
        legs: M(0x2c3140), torso: M(0x7a4de8), arms: M(0x37d6c3), head: M(0xe8b98f),
      });
      // hair
      const hair = box(0.32, 0.1, 0.32, M(0x2d2440));
      hair.position.y = 0.32;
      parts.headG.add(hair);
      // chest stripe
      const stripe = box(0.54, 0.16, 0.3, M(0x37d6c3, { emissive: 0x0d4b44, emissiveIntensity: 0.6 }));
      stripe.position.y = 1.05;
      root.add(stripe);
      // glider backpack with fins
      const pack = box(0.34, 0.4, 0.16, M(0x241d3d));
      pack.position.set(0, 1.02, -0.24);
      const finL = box(0.05, 0.42, 0.14, M(0xb06ef0, { emissive: 0x4d1f85, emissiveIntensity: 0.5 }));
      const finR = finL.clone();
      finL.position.set(-0.16, 1.28, -0.28); finL.rotation.z = 0.5;
      finR.position.set(0.16, 1.28, -0.28); finR.rotation.z = -0.5;
      root.add(pack, finL, finR);

      return {
        root, parts, accent: 0xb06ef0,
        action(u, p) { // victory dance
          const w = Math.sin(u * Math.PI * 6);
          const s = Math.sin(u * Math.PI);
          p.armL.rotation.z = 0.08 + s * 2.4 + w * 0.2;
          p.armR.rotation.z = -0.08 - s * 2.4 - w * 0.2;
          p.root.position.y = Math.abs(w) * 0.08 * s;
          p.headG.rotation.z = w * 0.15 * s;
        },
      };
    }

    function lastcut() {
      const { root, parts } = rig({
        legs: M(0x3a4a5c), torso: M(0x7a352a), arms: M(0x6e2f25), head: M(0xd9a985),
      });
      // beard + hair
      const beard = box(0.26, 0.12, 0.06, M(0x4a3626));
      beard.position.set(0, 0.04, 0.15);
      const hair = box(0.32, 0.08, 0.32, M(0x4a3626));
      hair.position.y = 0.32;
      parts.headG.add(beard, hair);
      // flannel stripes
      for (let i = 0; i < 2; i++) {
        const st = box(0.54, 0.05, 0.3, M(0x2e2018));
        st.position.y = 0.85 + i * 0.2;
        root.add(st);
      }
      // backpack + bedroll
      const pack = box(0.36, 0.42, 0.18, M(0x6b5a3c));
      pack.position.set(0, 1.0, -0.25);
      const roll = cyl(0.07, 0.07, 0.4, M(0x8a7a55));
      roll.rotation.z = Math.PI / 2;
      roll.position.set(0, 1.28, -0.25);
      root.add(pack, roll);

      return {
        root, parts, accent: 0x9fb56a,
        action(u, p) { // wary crouch + scan the horizon
          const s = Math.sin(u * Math.PI);
          p.root.position.y = -s * 0.16;
          p.legL.rotation.x = s * 0.7; p.legR.rotation.x = s * 0.7;
          p.torso.rotation.x = s * 0.18;
          p.headG.rotation.y = Math.sin(u * Math.PI * 2) * 0.7;
        },
      };
    }

    function deadline() {
      const { root, parts } = rig({
        legs: M(0x2e2723), torso: M(0x4a3527), arms: M(0x4a3527), head: M(0xd9a985),
      });
      // beard
      const beard = box(0.26, 0.1, 0.06, M(0x3a2c1e));
      beard.position.set(0, 0.03, 0.15);
      parts.headG.add(beard);
      // bandana
      const band = box(0.31, 0.07, 0.31, M(0xa3271e));
      band.position.y = 0.26;
      parts.headG.add(band);
      // hat (group so it can tip)
      parts.hat = new THREE.Group();
      const brim = cyl(0.32, 0.32, 0.03, M(0x2b2118), 14);
      const crown = cyl(0.16, 0.19, 0.16, M(0x2b2118), 12);
      crown.position.y = 0.09;
      parts.hat.add(brim, crown);
      parts.hat.position.y = 0.33;
      parts.headG.add(parts.hat);
      // duster coat tails
      const coat = box(0.56, 0.5, 0.3, M(0x3a2a1e));
      coat.position.y = 0.62;
      root.add(coat);
      // gun belt + revolver
      const belt = box(0.56, 0.07, 0.32, M(0x241a12));
      belt.position.y = 0.68;
      const gun = box(0.05, 0.16, 0.08, M(0x555a5e, { metalness: 0.5, roughness: 0.35 }));
      gun.position.set(0.3, 0.58, 0.1);
      root.add(belt, gun);

      return {
        root, parts, accent: 0xd9a441,
        action(u, p) { // tip of the hat, partner
          const s = Math.sin(u * Math.PI);
          p.armR.rotation.x = -s * 2.3;
          p.armR.rotation.z = -0.08 - s * 0.5;
          p.hat.position.y = 0.33 + s * 0.14;
          p.hat.rotation.z = s * 0.45;
          p.headG.rotation.x = s * 0.1;
        },
      };
    }

    const builders = { ghostline, skybloom, lastcut, deadline };

    /* ================= VIEWPORTS ================= */
    const global = { mx: 0, my: 0 };
    addEventListener("mousemove", (e) => {
      global.mx = e.clientX; global.my = e.clientY;
    }, { passive: true });

    document.querySelectorAll("canvas.op__view").forEach((cv) => {
      const kind = cv.dataset.char;
      if (!builders[kind]) return;

      const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 3 / 4, 0.1, 40);
      camera.position.set(0, 1.35, 4.4);
      camera.lookAt(0, 0.85, 0);

      const char = builders[kind]();
      scene.add(char.root);

      // podium
      const podium = cyl(0.95, 1.1, 0.1, M(0x14110c, { roughness: 0.6 }), 24);
      podium.position.y = -0.05;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.02, 0.018, 8, 40),
        new THREE.MeshBasicMaterial({ color: char.accent })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.02;
      scene.add(podium, ring);

      // lights
      scene.add(new THREE.HemisphereLight(0xfff2dd, 0x1a160f, 1.15));
      const key = new THREE.DirectionalLight(0xffe6bf, 1.6);
      key.position.set(2, 4, 3);
      const rim = new THREE.PointLight(char.accent, 14, 8);
      rim.position.set(-2, 2.2, -2);
      scene.add(key, rim);

      function size() {
        const w = cv.clientWidth || 300, h = cv.clientHeight || 400;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      size();
      new ResizeObserver(size).observe(cv);

      // ---- interaction: drag to rotate, click = action ----
      let dragging = false, dragDist = 0, lastX = 0, userSpin = 0, spinVel = 0;
      let act = null;

      cv.addEventListener("pointerdown", (e) => {
        dragging = true; dragDist = 0; lastX = e.clientX;
        cv.setPointerCapture(e.pointerId);
      });
      cv.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        dragDist += Math.abs(dx);
        userSpin += dx * 0.012;
        spinVel = dx * 0.012;
      });
      const endDrag = () => { dragging = false; };
      cv.addEventListener("pointerup", endDrag);
      cv.addEventListener("pointercancel", endDrag);

      // suppress card-select if it was a drag; trigger the action if it was a tap
      cv.addEventListener("click", (e) => {
        if (dragDist > 8) { e.stopPropagation(); return; }
        if (!act) act = { start: performance.now(), dur: 1300 };
      }, true);

      // only render while on screen
      let visible = false;
      new IntersectionObserver((es) => es.forEach((x) => (visible = x.isIntersecting)), { rootMargin: "80px" })
        .observe(cv);

      const clock = new THREE.Clock();
      (function tick() {
        requestAnimationFrame(tick);
        if (!visible) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.getElapsedTime();
        const p = char.parts;

        // spin: inertia from drag + slow idle turn
        if (!dragging) {
          spinVel *= 0.94;
          userSpin += spinVel + dt * 0.25;
        }
        char.root.rotation.y = userSpin;
        ring.rotation.z += dt * 0.6;

        // idle: breathing + arm sway + micro bob
        p.torso.scale.y = 1 + Math.sin(t * 2.2) * 0.02;
        p.armL.rotation.x = Math.sin(t * 1.7) * 0.07;
        if (!act) p.armR.rotation.x = (kind === "ghostline" ? -0.35 : 0) + Math.sin(t * 1.7 + 1) * 0.07;
        char.root.position.y = Math.sin(t * 2.2) * 0.015;

        // head tracks your cursor (unless mid-action)
        if (!act) {
          const r = cv.getBoundingClientRect();
          const nx = ((global.mx - (r.left + r.width / 2)) / innerWidth) * 2;
          const ny = ((global.my - (r.top + r.height / 2)) / innerHeight) * 2;
          const targetY = THREE.MathUtils.clamp(nx * 1.2, -0.6, 0.6) - char.root.rotation.y % (Math.PI * 2) * 0;
          p.headG.rotation.y += (THREE.MathUtils.clamp(nx * 1.1, -0.65, 0.65) - p.headG.rotation.y) * 0.08;
          p.headG.rotation.x += (THREE.MathUtils.clamp(ny * 0.5, -0.3, 0.35) - p.headG.rotation.x) * 0.08;
        }

        // signature action
        if (act) {
          const u = (performance.now() - act.start) / act.dur;
          if (u >= 1) {
            act = null;
            p.headG.rotation.set(0, 0, 0);
            p.root?.position && (char.root.position.y = 0);
            p.legL.rotation.x = p.legR.rotation.x = 0;
            p.torso.rotation.x = 0;
            p.armL.rotation.z = 0.08; p.armR.rotation.z = -0.08;
            if (p.hat) { p.hat.position.y = 0.33; p.hat.rotation.z = 0; }
          } else {
            char.action(u, p);
          }
        }

        renderer.render(scene, camera);
      })();
    });
  }
})();
