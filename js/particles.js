/**
 * THE GRAND BIRTHDAY EXPERIENCE — PARTICLE & VISUAL EFFECTS ENGINE
 * High-performance, canvas-driven particle system optimized for mobile & desktop.
 * Features: Starfield, Shooting Stars / Meteors, Floating Cosmic Dust,
 * Floating Rose Petals, and Luxury Gold/Rose Confetti burst.
 */

class BirthdayParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.width = (this.canvas.width = window.innerWidth);
    this.height = (this.canvas.height = window.innerHeight);

    this.isMobile = window.innerWidth < 768;
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    this.stars = [];
    this.shootingStars = [];
    this.petals = [];
    this.confetti = [];
    this.cosmicDust = [];

    this.activeMode = "stars"; // 'stars', 'warm', 'petals', 'wishing', 'celebration'
    this.animationFrameId = null;
    this.isPaused = false;
    this.lastTime = performance.now();

    // Mouse parallax
    this.mouse = { x: this.width / 2, y: this.height / 2, targetX: 0, targetY: 0 };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize(), { passive: true });

    if (!this.isMobile) {
      window.addEventListener(
        "mousemove",
        (e) => {
          this.mouse.targetX = (e.clientX - this.width / 2) * 0.03;
          this.mouse.targetY = (e.clientY - this.height / 2) * 0.03;
        },
        { passive: true }
      );
    }

    // Pause when tab is inactive to save battery & CPU
    document.addEventListener("visibilitychange", () => {
      this.isPaused = document.hidden;
      if (!this.isPaused) {
        this.lastTime = performance.now();
        this.animate(this.lastTime);
      }
    });

    this.createStars();
    this.createCosmicDust();
    this.createPetals();

    this.animate(performance.now());
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.isMobile = window.innerWidth < 768;
  }

  createStars() {
    this.stars = [];
    const count = this.isMobile ? 55 : 120;
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        color:
          Math.random() > 0.35
            ? "rgba(255, 248, 236, " // soft ivory
            : Math.random() > 0.5
            ? "rgba(216, 189, 131, " // champagne gold
            : "rgba(180, 215, 255, ", // aurora pale blue
      });
    }
  }

  createCosmicDust() {
    this.cosmicDust = [];
    const count = this.isMobile ? 20 : 45;
    for (let i = 0; i < count; i++) {
      this.cosmicDust.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.5 + 0.8,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.3 - 0.1,
        alpha: Math.random() * 0.6 + 0.2,
        gold: Math.random() > 0.4,
      });
    }
  }

  createPetals() {
    this.petals = [];
    const count = this.isMobile ? 12 : 24;
    for (let i = 0; i < count; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 10 + 7,
        vx: Math.random() * 0.6 - 0.3,
        vy: Math.random() * 0.8 + 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        alpha: Math.random() * 0.5 + 0.3,
        color:
          Math.random() > 0.5
            ? "rgba(216, 166, 177, " // dusty rose
            : "rgba(244, 206, 214, ", // soft blush
      });
    }
  }

  spawnShootingStar(force = false) {
    if (this.reducedMotion) return;
    if (
      !force &&
      (this.shootingStars.length > 2 ||
        (this.isMobile && this.shootingStars.length > 0))
    )
      return;

    const startX = Math.random() * this.width * 0.8;
    const startY = Math.random() * this.height * 0.4;
    const length = Math.random() * 140 + 80;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3; // ~45 deg downward
    const speed = Math.random() * 8 + 10;

    this.shootingStars.push({
      x: startX,
      y: startY,
      length: length,
      speed: speed,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      life: 0,
      maxLife: Math.random() * 25 + 25,
      color: "rgba(255, 248, 236,",
      width: Math.random() * 1.5 + 1.2,
    });
  }

  triggerWishMeteorShower() {
    // Dramatic meteor burst for "Make a Wish"
    for (let i = 0; i < (this.isMobile ? 4 : 7); i++) {
      setTimeout(() => {
        this.spawnShootingStar(true);
      }, i * 220);
    }
  }

  triggerConfettiBurst(originX, originY) {
    const ox = originX || this.width / 2;
    const oy = originY || this.height * 0.5;
    const count = this.isMobile ? 50 : 90;

    const colors = [
      "#D8BD83", // champagne gold
      "#FFF8EC", // soft ivory
      "#D8A6B1", // dusty rose
      "#F3E5AB", // warm gold
      "#E8C1C8", // blush
    ];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      this.confetti.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5,
        gravity: 0.16,
        size: Math.random() * 7 + 4,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 80 + 70,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }
  }

  setMode(mode) {
    this.activeMode = mode;
  }

  animate(now) {
    if (this.isPaused) return;

    this.animationFrameId = requestAnimationFrame((t) => this.animate(t));

    // Parallax damping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Random shooting star occasion
    if (
      Math.random() < (this.isMobile ? 0.003 : 0.008) &&
      this.activeMode !== "warm"
    ) {
      this.spawnShootingStar();
    }

    // 1. Draw & Update Stars
    const starAlphaMultiplier = this.activeMode === "warm" ? 0.25 : 1.0;
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      if (!this.reducedMotion) {
        s.alpha += s.twinkleSpeed * s.twinkleDirection;
        if (s.alpha > 0.95) {
          s.alpha = 0.95;
          s.twinkleDirection = -1;
        } else if (s.alpha < 0.2) {
          s.alpha = 0.2;
          s.twinkleDirection = 1;
        }
      }

      const drawX = s.x + this.mouse.x * (s.radius * 0.4);
      const drawY = s.y + this.mouse.y * (s.radius * 0.4);

      this.ctx.fillStyle = s.color + s.alpha * starAlphaMultiplier + ")";
      this.ctx.beginPath();
      this.ctx.arc(drawX, drawY, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Draw & Update Shooting Stars
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];
      ss.x += ss.dx;
      ss.y += ss.dy;
      ss.life++;

      const progress = ss.life / ss.maxLife;
      const alpha = (1 - progress) * 0.9;

      const grad = this.ctx.createLinearGradient(
        ss.x,
        ss.y,
        ss.x - ss.dx * 3.5,
        ss.y - ss.dy * 3.5
      );
      grad.addColorStop(0, `rgba(255, 248, 236, ${alpha})`);
      grad.addColorStop(0.3, `rgba(216, 189, 131, ${alpha * 0.6})`);
      grad.addColorStop(1, "rgba(216, 189, 131, 0)");

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = ss.width;
      this.ctx.lineCap = "round";
      this.ctx.beginPath();
      this.ctx.moveTo(ss.x, ss.y);
      this.ctx.lineTo(ss.x - ss.dx * 3.5, ss.y - ss.dy * 3.5);
      this.ctx.stroke();

      if (ss.life >= ss.maxLife || ss.x > this.width + 100 || ss.y > this.height + 100) {
        this.shootingStars.splice(i, 1);
      }
    }

    // 3. Draw & Update Cosmic Dust
    for (let i = 0; i < this.cosmicDust.length; i++) {
      const d = this.cosmicDust[i];
      d.x += d.vx;
      d.y += d.vy;

      if (d.y < -10) d.y = this.height + 10;
      if (d.x < -10) d.x = this.width + 10;
      if (d.x > this.width + 10) d.x = -10;

      const color = d.gold
        ? `rgba(216, 189, 131, ${d.alpha * 0.7})`
        : `rgba(255, 248, 236, ${d.alpha * 0.5})`;

      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 4. Draw & Update Floating Rose Petals (Scene 3 & 8 or when enabled)
    if (this.activeMode === "petals" || this.activeMode === "warm" || this.activeMode === "celebration") {
      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        p.x += p.vx + Math.sin(p.y * 0.015) * 0.4;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        if (p.y > this.height + 20) {
          p.y = -20;
          p.x = Math.random() * this.width;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillStyle = p.color + p.alpha + ")";
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    // 5. Draw & Update Confetti (Gift Box Opening)
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.vx *= 0.98;
      c.rot += c.rotSpeed;
      c.life++;

      const fade = Math.max(0, 1 - c.life / c.maxLife);
      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate(c.rot);
      this.ctx.fillStyle = c.color;
      this.ctx.globalAlpha = fade;

      if (c.shape === "rect") {
        this.ctx.fillRect(-c.size / 2, -c.size / 3, c.size, c.size * 0.7);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();

      if (c.life >= c.maxLife || c.y > this.height + 40) {
        this.confetti.splice(i, 1);
      }
    }
  }
}

window.BirthdayParticles = BirthdayParticleEngine;
