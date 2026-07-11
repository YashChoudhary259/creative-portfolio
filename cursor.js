(function () {
  // 1. Check if the device supports hover (desktop with mouse/trackpad)
  const hoverMediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!hoverMediaQuery.matches) {
    return;
  }

  // 2. State variables
  let mouse = { x: 0, y: 0 };
  let ring = { x: 0, y: 0 };
  let isInitialized = false;
  let resetOnNextMove = false;
  let animationFrameId = null;

  // 3. Create DOM elements
  const ringWrap = document.createElement('div');
  ringWrap.className = 'cursor-ring-wrap';
  
  const ringEl = document.createElement('div');
  ringEl.className = 'cursor-ring';
  
  const textEl = document.createElement('span');
  textEl.className = 'cursor-text';
  textEl.textContent = 'View';
  
  ringEl.appendChild(textEl);
  ringWrap.appendChild(ringEl);

  const dotWrap = document.createElement('div');
  dotWrap.className = 'cursor-dot-wrap';
  
  const dotEl = document.createElement('div');
  dotEl.className = 'cursor-dot';
  
  dotWrap.appendChild(dotEl);

  document.body.appendChild(ringWrap);
  document.body.appendChild(dotWrap);

  // 4. Mouse movement handler
  const onMouseMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (!isInitialized) {
      // First movement setup
      ring.x = mouse.x;
      ring.y = mouse.y;
      
      // Update DOM immediately to avoid starting at (0, 0)
      ringWrap.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      dotWrap.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      
      document.body.classList.add('cursor-visible');
      isInitialized = true;
    } else if (resetOnNextMove) {
      // Instantly move ring on viewport reentry to avoid sliding across screen
      ring.x = mouse.x;
      ring.y = mouse.y;
      resetOnNextMove = false;
    }
  };

  // 5. Interpolation (Lerp) tick loop
  const tick = () => {
    if (isInitialized) {
      // Lerp ring position with 0.15 interpolation factor
      ring.x += (mouse.x - ring.x) * 0.15;
      ring.y += (mouse.y - ring.y) * 0.15;

      // Render positions
      ringWrap.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      dotWrap.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
    }
    animationFrameId = requestAnimationFrame(tick);
  };

  // 6. Event listeners
  window.addEventListener('mousemove', onMouseMove);

  // Active click states
  const onMouseDown = () => {
    document.body.classList.add('cursor-clicked');
  };
  const onMouseUp = () => {
    document.body.classList.remove('cursor-clicked');
  };

  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);

  // Viewport exit / entry boundaries
  const onMouseLeaveDoc = () => {
    document.body.classList.remove('cursor-visible');
  };
  const onMouseEnterDoc = () => {
    if (isInitialized) {
      document.body.classList.add('cursor-visible');
      resetOnNextMove = true;
    }
  };

  document.addEventListener('mouseleave', onMouseLeaveDoc);
  document.addEventListener('mouseenter', onMouseEnterDoc);

  // Hover state delegation
  const onMouseOver = (e) => {
    const target = e.target;
    if (!target) return;

    // Clear all hover classes
    document.body.classList.remove(
      'cursor-hover-link',
      'cursor-hover-project',
      'cursor-hover-text',
      'cursor-hover-input'
    );

    // Apply appropriate class based on targets (order matters for specificity)
    if (target.closest('input, textarea, [contenteditable="true"]')) {
      document.body.classList.add('cursor-hover-input');
    } else if (target.closest('.project-card')) {
      document.body.classList.add('cursor-hover-project');
    } else if (target.closest('a, button, .nav-link, #theme-toggle, .hamburger')) {
      document.body.classList.add('cursor-hover-link');
    } else if (target.closest('h1, h2, h3, p, span.pill, .tag-chip, .eyebrow, .tag')) {
      document.body.classList.add('cursor-hover-text');
    }
  };

  const onMouseOut = () => {
    // Reset all hover classes when mouse leaves elements
    document.body.classList.remove(
      'cursor-hover-link',
      'cursor-hover-project',
      'cursor-hover-text',
      'cursor-hover-input'
    );
  };

  document.addEventListener('mouseover', onMouseOver);
  document.addEventListener('mouseout', onMouseOut);

  // Start rendering loop
  animationFrameId = requestAnimationFrame(tick);

  // Cleanup helper
  window.destroyCustomCursor = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mouseleave', onMouseLeaveDoc);
    document.removeEventListener('mouseenter', onMouseEnterDoc);
    document.removeEventListener('mouseover', onMouseOver);
    document.removeEventListener('mouseout', onMouseOut);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    ringWrap.remove();
    dotWrap.remove();
    document.body.classList.remove(
      'cursor-visible',
      'cursor-clicked',
      'cursor-hover-link',
      'cursor-hover-project',
      'cursor-hover-text',
      'cursor-hover-input'
    );
  };
})();
