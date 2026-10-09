(() => {
  "use strict";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const loader = $("#loader");
  const motionToggle = $("#motionToggle");

  let motionEnabled =
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // CINEMATIC INTRO
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader?.classList.add("done");
    }, 1500);

    setTimeout(() => {
      loader?.remove();
    }, 2600);
  });

  // MOTION CONTROL
  function setMotion(enabled) {
    motionEnabled = enabled;

    document.body.classList.toggle(
      "motion-off",
      !enabled
    );

    if (motionToggle) {
      motionToggle.innerHTML = `
        <span class="status-dot"
        style="background:${enabled ? "#55d99a" : "#777"}"></span>
        ${enabled ? "MOTION ON" : "MOTION OFF"}
      `;

      motionToggle.setAttribute(
        "aria-pressed",
        String(!enabled)
      );
    }

    if (window.goddenScene) {
      window.goddenScene.setMotion(enabled);
    }
  }

  motionToggle?.addEventListener("click", () => {
    setMotion(!motionEnabled);
  });

  // SMOOTH CINEMATIC NAVIGATION
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = $(link.getAttribute("href"));

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: motionEnabled ? "smooth" : "auto",
        block: "start"
      });
    });
  });

  // SCROLL REVEALS
  const revealElements = $$(`
    .vision-content,
    .energy-core,
    .section-heading,
    .product-card,
    .collection-footer,
    .finale .eyebrow,
    .finale h2,
    .finale-brand,
    .crown,
    .jesus,
    .finale-button
  `);

  revealElements.forEach(element => {
    element.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("visible");
    });
  }

  // HERO PHONE PARALLAX
  const stage = $("#productStage");
  const phone = $("#phone");

  if (
    stage &&
    phone &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    stage.addEventListener("pointermove", event => {
      const rect = stage.getBoundingClientRect();

      targetX =
        ((event.clientX - rect.left) / rect.width - 0.5) * 14;

      targetY =
        ((event.clientY - rect.top) / rect.height - 0.5) * -12;
    });

    stage.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
    });

    function movePhone() {
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;

      if (motionEnabled) {
        phone.style.marginLeft = `${currentX}px`;
        phone.style.marginTop = `${currentY}px`;
      }

      requestAnimationFrame(movePhone);
    }

    requestAnimationFrame(movePhone);
  }

  // ACTIVE NAVIGATION
  const navigationLinks = $$("nav a");

  const navigationSections = [
    $("#home"),
    $("#vision"),
    $("#products")
  ].filter(Boolean);

  if ("IntersectionObserver" in window) {
    const navigationObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          navigationLinks.forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") ===
                `#${entry.target.id}`
            );
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px"
      }
    );

    navigationSections.forEach(section => {
      navigationObserver.observe(section);
    });
  }

  // THREE.JS 3D PARTICLE WORLD
  // If Three.js cannot load, the CSS animations still work.
  function startThreeWorld() {
    if (!window.THREE) {
      console.warn(
        "Three.js did not load. CSS animation remains active."
      );
      return;
    }

    const canvas = $("#world");

    if (!canvas) return;

    let renderer;
    let scene;
    let camera;
    let particles;
    let streaks;
    let clock;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power"
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.5)
      );

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        58,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );

      camera.position.z = 18;

      clock = new THREE.Clock();

      // Floating particles
      const particleCount =
        window.innerWidth < 700 ? 450 : 1000;

      const positions = new Float32Array(
        particleCount * 3
      );

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] =
          (Math.random() - 0.5) * 34;

        positions[i * 3 + 1] =
          (Math.random() - 0.5) * 22;

        positions[i * 3 + 2] =
          (Math.random() - 0.5) * 26;
      }

      const particleGeometry =
        new THREE.BufferGeometry();

      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particleMaterial =
        new THREE.PointsMaterial({
          color: 0xff4a52,
          size: 0.045,
          transparent: true,
          opacity: 0.72,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

      particles = new THREE.Points(
        particleGeometry,
        particleMaterial
      );

      scene.add(particles);

      // Cinematic red light streaks
      const linePositions = [];

      for (let i = 0; i < 65; i++) {
        const x = (Math.random() - 0.5) * 35;
        const y = (Math.random() - 0.5) * 23;
        const z = (Math.random() - 0.5) * 25;

        linePositions.push(
          x, y, z,
          x + (Math.random() - 0.5) * 1.5,
          y + (Math.random() - 0.5) * 1.5,
          z - Math.random() * 2.5
        );
      }

      const streakGeometry =
        new THREE.BufferGeometry();

      streakGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
          linePositions,
          3
        )
      );

      const streakMaterial =
        new THREE.LineBasicMaterial({
          color: 0xff2736,
          transparent: true,
          opacity: 0.19
        });

      streaks = new THREE.LineSegments(
        streakGeometry,
        streakMaterial
      );

      scene.add(streaks);

      // Pointer-controlled camera
      let targetX = 0;
      let targetY = 0;
      let cameraX = 0;
      let cameraY = 0;

      window.addEventListener(
        "pointermove",
        event => {
          if (event.pointerType === "touch") return;

          targetX =
            (event.clientX / window.innerWidth - 0.5) * 0.65;

          targetY =
            (event.clientY / window.innerHeight - 0.5) * -0.35;
        },
        { passive: true }
      );

      let running = false;

      function animate() {
        if (!running) return;

        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        if (motionEnabled) {
          cameraX += (targetX - cameraX) * 0.015;
          cameraY += (targetY - cameraY) * 0.015;

          camera.position.x =
            cameraX + Math.sin(time * 0.16) * 0.18;

          camera.position.y =
            cameraY + Math.cos(time * 0.13) * 0.12;

          camera.lookAt(0, 0, 0);

          particles.rotation.y = time * 0.012;

          particles.rotation.x =
            Math.sin(time * 0.09) * 0.025;

          streaks.rotation.y = -time * 0.008;

          const particlePositions =
            particleGeometry.attributes.position;

          for (
            let i = 2;
            i < particlePositions.array.length;
            i += 3
          ) {
            particlePositions.array[i] += 0.018;

            if (particlePositions.array[i] > 13) {
              particlePositions.array[i] = -13;
            }
          }

          particlePositions.needsUpdate = true;
        }

        renderer.render(scene, camera);
      }

      function startAnimation() {
        if (running) return;

        running = true;
        clock.start();
        animate();
      }

      function stopAnimation() {
        running = false;
      }

      function resize() {
        camera.aspect =
          window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio || 1, 1.5)
        );

        renderer.setSize(
          window.innerWidth,
          window.innerHeight
        );
      }

      window.addEventListener(
        "resize",
        resize,
        { passive: true }
      );

      document.addEventListener(
        "visibilitychange",
        () => {
          if (document.hidden) {
            stopAnimation();
          } else {
            startAnimation();
          }
        }
      );

      window.goddenScene = {
        setMotion(enabled) {
          particleMaterial.opacity =
            enabled ? 0.72 : 0.25;

          streakMaterial.opacity =
            enabled ? 0.19 : 0.05;
        }
      };

      startAnimation();

    } catch (error) {
      console.warn(
        "3D environment unavailable. CSS animations remain active.",
        error
      );
    }
  }

  startThreeWorld();

  // SMALL PRODUCT INTERACTION
  $$(".product-card").forEach(card => {
    card.addEventListener("click", () => {
      card.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(0.98)" },
          { transform: "scale(1)" }
        ],
        {
          duration: 350,
          easing: "ease-out"
        }
      );
    });
  });

})();
