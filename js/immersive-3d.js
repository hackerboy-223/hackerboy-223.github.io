/* Lightweight WebGL tunnel + scroll-driven spatial cards. No external dependency. */
(() => {
  'use strict';

  const section = document.querySelector('[data-hb3d-scroll]');
  if (!section) return;

  const canvas = section.querySelector('[data-hb3d-canvas]');
  const world = section.querySelector('.hb3d-world');
  const progress = section.querySelector('.hb3d-progress');
  const footer = section.querySelector('.hb3d-footer');
  const projectCards = Array.from(section.querySelectorAll('.hb3d-project'));
  const compactViewport = window.matchMedia('(max-width: 900px)');
  const desktopProjectDepths = [100, 420, 740, 1060];
  const compactProjectDepths = [100, 390, 680, 970];
  let projectDepths = compactViewport.matches ? compactProjectDepths : desktopProjectDepths;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const lowPower = Boolean(
    (connection && connection.saveData) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
  );

  function setStaticMode() {
    section.classList.remove('is-rendering', 'hb3d-enhanced');
    section.classList.add('hb3d-static');
    projectCards.forEach(card => {
      card.classList.remove('is-active');
      card.style.removeProperty('--hb3d-card-opacity');
      card.removeAttribute('aria-hidden');
      card.removeAttribute('tabindex');
    });
  }

  if (!canvas || !world || !projectCards.length || !('IntersectionObserver' in window) || reducedMotion.matches || lowPower) {
    setStaticMode();
    return;
  }

  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
    preserveDrawingBuffer: false
  });

  if (!gl) {
    setStaticMode();
    return;
  }

  const vertexSource = `
    attribute vec3 a_position;
    attribute float a_size;
    attribute float a_seed;
    uniform float u_time;
    uniform float u_progress;
    uniform float u_aspect;
    uniform vec2 u_pointer;
    varying float v_alpha;
    varying float v_seed;
    varying float v_depth;
    void main() {
      float z = mod(a_position.z + u_progress * 34.0 + 42.0, 42.0) - 42.0;
      float drift = sin(u_time * 0.22 + a_seed * 6.2831) * 0.035;
      float depth = max(1.0, -z);
      vec2 xy = a_position.xy + vec2(drift, drift * 0.55) + u_pointer * (1.15 / depth);
      float focal = 1.38 / depth;
      gl_Position = vec4(xy.x * focal / u_aspect, xy.y * focal, (depth - 1.0) / 41.0 * 2.0 - 1.0, 1.0);
      gl_PointSize = clamp(a_size * (1.2 + 9.0 / depth), 1.0, 5.5);
      v_depth = depth;
      v_seed = a_seed;
      v_alpha = clamp(1.0 - depth / 48.0, 0.12, 0.82);
    }`;

  const fragmentSource = `
    precision mediump float;
    uniform float u_point_mode;
    varying float v_alpha;
    varying float v_seed;
    varying float v_depth;
    void main() {
      if (u_point_mode > 0.5) {
        vec2 p = gl_PointCoord - 0.5;
        float d = length(p);
        if (d > 0.5) discard;
        float glow = 1.0 - smoothstep(0.02, 0.5, d);
        vec3 tint = mix(vec3(0.25, 0.48, 0.85), vec3(0.55, 0.78, 1.0), fract(v_seed * 17.0));
        gl_FragColor = vec4(tint, v_alpha * glow);
      } else {
        gl_FragColor = vec4(0.24, 0.43, 0.72, 0.19 * v_alpha);
      }
    }`;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error('WebGL shader compilation failed');
    }
    return shader;
  }

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('WebGL program link failed');
  } catch (error) {
    setStaticMode();
    return;
  }

  section.classList.add('hb3d-enhanced');
  gl.useProgram(program);
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  const locations = {
    position: gl.getAttribLocation(program, 'a_position'),
    size: gl.getAttribLocation(program, 'a_size'),
    seed: gl.getAttribLocation(program, 'a_seed'),
    time: gl.getUniformLocation(program, 'u_time'),
    progress: gl.getUniformLocation(program, 'u_progress'),
    aspect: gl.getUniformLocation(program, 'u_aspect'),
    pointer: gl.getUniformLocation(program, 'u_pointer'),
    pointMode: gl.getUniformLocation(program, 'u_point_mode')
  };

  let seed = 92821;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const points = [];
  for (let i = 0; i < 1050; i++) {
    const z = -random() * 42;
    const angle = random() * Math.PI * 2;
    const radius = random() < 0.7 ? 5.8 + (random() - 0.5) * 0.42 : 8.6 + (random() - 0.5) * 0.55;
    points.push(Math.cos(angle) * radius, Math.sin(angle) * radius, z, 0.7 + random() * 1.8, random());
  }

  const lines = [];
  const addLine = (ax, ay, az, bx, by, bz, s) => {
    lines.push(ax, ay, az, 1, s, bx, by, bz, 1, s);
  };
  for (let ring = 0; ring < 15; ring++) {
    const z = -ring * 2.8 - 0.5;
    for (let side = 0; side < 64; side++) {
      const a = side / 64 * Math.PI * 2;
      const b = (side + 1) / 64 * Math.PI * 2;
      for (const radius of [5.8, 8.6]) {
        addLine(Math.cos(a) * radius, Math.sin(a) * radius, z,
          Math.cos(b) * radius, Math.sin(b) * radius, z, 0.4);
      }
    }
  }
  for (let rail = 0; rail < 16; rail++) {
    const a = rail / 16 * Math.PI * 2;
    const r = rail % 4 === 0 ? 8.6 : 5.8;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    addLine(x, y, 0, x, y, -42, 0.2);
  }

  function makeBuffer(data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return buffer;
  }

  const pointBuffer = makeBuffer(points);
  const lineBuffer = makeBuffer(lines);

  function bindBuffer(buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(locations.position);
    gl.vertexAttribPointer(locations.position, 3, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(locations.size);
    gl.vertexAttribPointer(locations.size, 1, gl.FLOAT, false, 20, 12);
    gl.enableVertexAttribArray(locations.seed);
    gl.vertexAttribPointer(locations.seed, 1, gl.FLOAT, false, 20, 16);
  }

  let amount = 0;
  let targetAmount = 0;
  let frame = 0;
  let lastFrame = 0;
  let visible = false;
  let destroyed = false;
  let startTime = 0;
  let activeProject = -1;
  let lastProgressValue = -1;
  let pointerX = 0;
  let pointerY = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const counterEl = footer?.querySelector('span:first-child') || null;
  const hintEl = footer?.querySelector('span:last-child') || null;
  let chapterButtons = [];

  if (footer && projectCards.length > 1) {
    const nav = document.createElement('div');
    nav.className = 'hb3d-chapters-nav';
    nav.setAttribute('role', 'group');
    nav.setAttribute('aria-label', 'Accéder directement à un projet');
    chapterButtons = projectCards.map((card, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hb3d-chapter-dot';
      const title = card.querySelector('h3')?.textContent?.trim() || ('Projet ' + (index + 1));
      btn.textContent = String(index + 1).padStart(2, '0');
      btn.setAttribute('aria-label', 'Afficher ' + title);
      btn.addEventListener('click', () => {
        const cameraStart = 40;
        const cameraEnd = projectDepths[projectDepths.length - 1] - 20;
        const targetRatio = clamp((projectDepths[index] - cameraStart) / Math.max(1, cameraEnd - cameraStart), 0, 1);
        const travel = Math.max(1, section.offsetHeight - window.innerHeight);
        const top = section.getBoundingClientRect().top + window.scrollY + targetRatio * travel;
        window.scrollTo({ top, behavior: 'smooth' });
      });
      nav.appendChild(btn);
      return btn;
    });
    if (hintEl) footer.insertBefore(nav, hintEl);
    else footer.appendChild(nav);
  }

  function updateScene() {
    const cameraStart = 40;
    const cameraEnd = projectDepths[projectDepths.length - 1] - 20;
    const camera = cameraStart + amount * (cameraEnd - cameraStart);
    const tilt = Math.sin(amount * Math.PI) * -2.0;

    world.style.setProperty('--hb3d-camera', camera.toFixed(2) + 'px');
    world.style.setProperty('--hb3d-tilt', tilt.toFixed(2) + 'deg');
    section.style.setProperty('--hb3d-progress', amount.toFixed(4));

    const progressValue = Math.round(amount * 100);
    if (progress && progressValue !== lastProgressValue) {
      progress.setAttribute('aria-valuenow', String(progressValue));
      lastProgressValue = progressValue;
    }

    // Update accessibility, counter, and card state only when the active project changes.
    const nextProject = projectDepths.reduce((best, depth, index, all) =>
      Math.abs(camera - depth) < Math.abs(camera - all[best]) ? index : best, 0);

    if (nextProject !== activeProject) {
      projectCards.forEach((card, index) => {
        const active = index === nextProject;
        card.classList.toggle('is-active', active);
        card.style.setProperty('--hb3d-card-opacity', active ? '1' : '0');
        card.setAttribute('aria-hidden', String(!active));
        card.setAttribute('tabindex', active ? '0' : '-1');
      });

      chapterButtons.forEach((btn, index) => {
        const current = index === nextProject;
        btn.classList.toggle('is-current', current);
        btn.setAttribute('aria-pressed', String(current));
      });

      if (counterEl) {
        counterEl.textContent = String(nextProject + 1).padStart(2, '0') + ' / ' + String(projectCards.length).padStart(2, '0');
      }
      if (hintEl) {
        const activeTitle = projectCards[nextProject]?.querySelector('h3')?.textContent?.trim();
        hintEl.textContent = nextProject === projectCards.length - 1
          ? (activeTitle || 'Fin du tunnel') + ' · Explorer ci-dessous'
          : (activeTitle || 'Continue à explorer');
      }

      activeProject = nextProject;
      section.dataset.chapter = String(nextProject + 1);
    }
  }

  function updateScroll() {
    const rect = section.getBoundingClientRect();
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    targetAmount = clamp(-rect.top / travel, 0, 1);
    if (!visible) {
      amount = targetAmount;
      updateScene();
    } else {
      schedule();
    }
  }

  function resize() {
    projectDepths = compactViewport.matches ? compactProjectDepths : desktopProjectDepths;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, compactViewport.matches ? 1 : 1.25);
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    updateScroll();
    updateScene();
  }

  function draw(now) {
    frame = 0;
    if (!visible || destroyed || document.hidden) return;

    const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 1 / 60;
    lastFrame = now;
    if (!startTime) startTime = now;

    const easing = 1 - Math.exp(-9 * delta);
    amount += (targetAmount - amount) * easing;

    const stillMoving = Math.abs(targetAmount - amount) > 0.00035;
    if (!stillMoving) amount = targetAmount;

    updateScene();

    const time = (now - startTime) / 1000;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(locations.time, time);
    gl.uniform1f(locations.progress, amount);
    gl.uniform1f(locations.aspect, canvas.width / Math.max(1, canvas.height));
    gl.uniform2f(locations.pointer, pointerX * 0.35, -pointerY * 0.35);

    bindBuffer(lineBuffer);
    gl.uniform1f(locations.pointMode, 0);
    gl.drawArrays(gl.LINES, 0, lines.length / 5);

    bindBuffer(pointBuffer);
    gl.uniform1f(locations.pointMode, 1);
    gl.drawArrays(gl.POINTS, 0, points.length / 5);

    if (stillMoving) schedule();
    else lastFrame = 0;
  }

  function schedule() {
    if (!frame && visible && !destroyed) frame = window.requestAnimationFrame(draw);
  }

  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    section.classList.toggle('is-rendering', visible);

    if (visible) {
      lastFrame = 0;
      resize();
      schedule();
    } else {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
    }
  }, { rootMargin: '120px 0px' });
  observer.observe(section);

  if (finePointer.matches) {
    const sticky = section.querySelector('.hb3d-sticky');
    sticky?.addEventListener('pointermove', event => {
      const rect = sticky.getBoundingClientRect();
      pointerX = (((event.clientX - rect.left) / Math.max(1, rect.width)) - 0.5) * 4.5;
      pointerY = (((event.clientY - rect.top) / Math.max(1, rect.height)) - 0.5) * -3.5;
      world.style.setProperty('--hb3d-px', pointerX.toFixed(2) + 'deg');
      world.style.setProperty('--hb3d-py', pointerY.toFixed(2) + 'deg');
      if (visible) schedule();
    }, { passive: true });
    sticky?.addEventListener('pointerleave', () => {
      pointerX = 0;
      pointerY = 0;
      world.style.setProperty('--hb3d-px', '0deg');
      world.style.setProperty('--hb3d-py', '0deg');
      if (visible) schedule();
    });
  }

  const onScroll = () => updateScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
    } else {
      updateScroll();
      schedule();
    }
  });
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    destroyed = true;
    setStaticMode();
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  }, { once: true });

  resize();
})();
