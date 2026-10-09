(() => {
  const scene = document.getElementById('sceneWrap');
  const orb = document.getElementById('coreOrb');
  const state = document.getElementById('interactionState');
  const toggle = document.getElementById('motionToggle');
  const hint = document.getElementById('interactHint');
  const year = document.getElementById('year');

  if (!scene || !orb) return;

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let baseX = 0;
  let baseY = 0;
  let pointerActive = false;

  let paused = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  function updateState(message) {
    if (state) state.textContent = message;
  }

  function setTargetFromPoint(clientX, clientY) {
    const rect = scene.getBoundingClientRect();

    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;

    targetY = (x - 0.5) * 48;
    targetX = (0.5 - y) * 34;

    pointerActive = true;
    updateState('SIGNAL DETECTED');
  }

  // Desktop mouse movement
  scene.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'mouse') {
      setTargetFromPoint(event.clientX, event.clientY);
      return;
    }

    // Mobile touch-and-drag
    if (dragging) {
      targetY = baseY + (event.clientX - startX) * 0.65;
      targetX = baseX - (event.clientY - startY) * 0.55;

      targetX = Math.max(-50, Math.min(50, targetX));
      targetY = Math.max(-65, Math.min(65, targetY));

      pointerActive = true;
      updateState('OBJECT ROTATING');
    }
  });

  scene.addEventListener('pointerdown', (event) => {
    dragging = true;

    startX = event.clientX;
    startY = event.clientY;

    baseX = targetX;
    baseY = targetY;

    pointerActive = true;
    updateState('OBJECT ROTATING');

    if (scene.setPointerCapture) {
      try {
        scene.setPointerCapture(event.pointerId);
      } catch (_) {}
    }
  });

  function releasePointer() {
    dragging = false;

    updateState(
      pointerActive ? 'SIGNAL DETECTED' : 'AWAITING INPUT'
    );
  }

  scene.addEventListener('pointerup', releasePointer);
  scene.addEventListener('pointercancel', releasePointer);

  scene.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse' && !dragging) {
      targetX *= 0.25;
      targetY *= 0.25;

      pointerActive = false;
      updateState('AWAITING INPUT');
    }
  });

  // Keyboard interaction
  scene.addEventListener('keydown', (event) => {
    const step = 8;

    if (event.key === 'ArrowLeft') {
      targetY -= step;
    } else if (event.key === 'ArrowRight') {
      targetY += step;
    } else if (event.key === 'ArrowUp') {
      targetX += step;
    } else if (event.key === 'ArrowDown') {
      targetX -= step;
    } else {
      return;
    }

    event.preventDefault();

    targetX = Math.max(-40, Math.min(40, targetX));
    targetY = Math.max(-55, Math.min(55, targetY));

    pointerActive = true;
    updateState('KEYBOARD CONTROL');
  });

  // Smooth animation loop
  function animate() {
    if (!paused) {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;

      const time = performance.now() * 0.00045;
      const idle = pointerActive ? 0 : Math.sin(time) * 3;

      orb.style.transform = `
        rotateX(${currentX + idle}deg)
        rotateY(${currentY + Math.cos(time) * 3}deg)
        translateY(${Math.sin(time * 1.4) * 5}px)
      `;

      scene.style.setProperty(
        '--pointer-glow-x',
        `${50 + currentY * 0.5}%`
      );
    }

    requestAnimationFrame(animate);
  }

  animate();

  // Pause and resume motion
  function toggleMotion() {
    paused = !paused;

    document.body.classList.toggle('paused', paused);

    if (toggle) {
      toggle.textContent = paused
        ? 'RESUME MOTION'
        : 'PAUSE MOTION';

      toggle.setAttribute('aria-pressed', String(paused));
    }

    updateState(paused ? 'MOTION PAUSED' : 'MOTION ACTIVE');
  }

  if (toggle) {
    toggle.addEventListener('click', toggleMotion);
  }

  // Interaction hint button
  if (hint) {
    hint.addEventListener('click', () => {
      targetX = -14;
      targetY = 24;

      pointerActive = true;

      updateState('INTERACTION READY');

      scene.focus({ preventScroll: true });

      if (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
        paused
      ) {
        paused = false;
        document.body.classList.remove('paused');

        if (toggle) {
          toggle.textContent = 'PAUSE MOTION';
          toggle.setAttribute('aria-pressed', 'false');
        }
      }

      orb.style.filter = 'brightness(1.25)';

      window.setTimeout(() => {
        orb.style.filter = '';
      }, 500);
    });
  }
})();
