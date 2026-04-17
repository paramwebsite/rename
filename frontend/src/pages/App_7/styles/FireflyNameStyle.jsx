import { useEffect, useRef } from 'react';

export default function FireflyNameStyle({ name }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let animationFrameId;
    let particles = [];
    let targets = [];
    let scatterTargets = [];
    let phase = 'float';
    let phaseTimer = 0;

    // Config
    const N = 1800;
    const speedMult = 1.0;
    const sizeMult = 1.0;
    const glowMult = 1.0;

    // Longer free-floating time before forming again
    const FLOAT_DUR = 220;
    const ATTRACT_DUR = 220;
    const HOLD_DUR = 220;
    const RELEASE_DUR = 220;

    const colors = [
      [255, 220, 80],
      [255, 180, 40],
      [255, 240, 140],
      [255, 200, 60],
      [240, 160, 30],
      [255, 255, 200],
    ];

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      rebuildParticles();
    };

    const getTextPoints = (text, count) => {
      const off = document.createElement('canvas');
      const fontSize = Math.min(canvas.width * 0.18, 110);
      off.width = canvas.width;
      off.height = canvas.height;
      const ox = off.getContext('2d', { willReadFrequently: true });

      ox.clearRect(0, 0, off.width, off.height);
      ox.fillStyle = '#fff';
      ox.font = `900 ${fontSize}px sans-serif`;
      ox.textAlign = 'center';
      ox.textBaseline = 'middle';
      ox.fillText(text || '', off.width / 2, off.height / 2);

      const data = ox.getImageData(0, 0, off.width, off.height).data;
      const pts = [];
      const step = 4;

      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          if (data[(y * off.width + x) * 4 + 3] > 128) {
            pts.push({ x, y });
          }
        }
      }

      const out = [];
      if (pts.length > 0) {
        for (let i = 0; i < count; i++) {
          out.push(pts[Math.floor(Math.random() * pts.length)]);
        }
      } else {
        for (let i = 0; i < count; i++) {
          out.push({ x: canvas.width / 2, y: canvas.height / 2 });
        }
      }

      return out;
    };

    const getScatterPoints = (count) => {
      return Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      }));
    };

    class Particle {
      constructor(i) {
        this.idx = i;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3.0;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.baseR = 0.6 + Math.random() * 1.0;
        this.col = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 0.6 + Math.random() * 0.4;
        this.flicker = Math.random() * Math.PI * 2;
        this.flickerSpeed = 0.04 + Math.random() * 0.06;
        this.angle = angle;
        this.angleSpeed = (Math.random() - 0.5) * 0.015;
        this.floatR = 0.3 + Math.random() * 0.5;
        this.drawAlpha = this.alpha;

        // used for soft release drift
        this.releaseDriftX = 0;
        this.releaseDriftY = 0;
      }

      update(p, t) {
        this.flicker += this.flickerSpeed * speedMult;
        this.angle += this.angleSpeed * speedMult;
        const flickerVal = 0.7 + 0.3 * Math.sin(this.flicker);

        if (p === 'float') {
          this.vx += Math.cos(this.angle) * this.floatR * 0.012 * speedMult;
          this.vy += Math.sin(this.angle) * this.floatR * 0.012 * speedMult;

          this.vx *= 0.985;
          this.vy *= 0.985;

          this.x += this.vx * speedMult;
          this.y += this.vy * speedMult;

          if (this.x < -20) this.x = canvas.width + 10;
          if (this.x > canvas.width + 20) this.x = -10;
          if (this.y < -20) this.y = canvas.height + 10;
          if (this.y > canvas.height + 20) this.y = -10;

          this.drawAlpha = flickerVal * this.alpha;
        } else if (p === 'attract' || p === 'hold') {
          const tgt = targets[this.idx % targets.length];
          if (!tgt) return;

          const dx = tgt.x - this.x;
          const dy = tgt.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;

          let strength;
          if (p === 'attract') {
            const progress = Math.min(t / ATTRACT_DUR, 1);
            const eased =
              progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            strength = eased * (0.010 + 0.06 / (dist * 0.1 + 1));
          } else {
            strength = 0.11 + 0.05 / (dist * 0.1 + 1);
          }

          this.vx += dx * strength * 0.11 * speedMult;
          this.vy += dy * strength * 0.11 * speedMult;

          // more damping so hold feels stable, not bouncy
          this.vx *= 0.80;
          this.vy *= 0.80;

          this.x += this.vx;
          this.y += this.vy;

          this.drawAlpha =
            p === 'hold'
              ? flickerVal * (0.75 + 0.25 * Math.sin(this.flicker * 0.7 + this.idx))
              : this.alpha * flickerVal;
        } else if (p === 'release') {
          const tgt = scatterTargets[this.idx];
          if (!tgt) return;

          const dx = tgt.x - this.x;
          const dy = tgt.y - this.y;
          const progress = Math.min(t / RELEASE_DUR, 1);

          // softer easing so it doesn't look elastic
          const easeOut = 1 - Math.pow(1 - progress, 2);

          // gentle steering instead of spring snap
          this.vx += dx * 0.0025 * easeOut * speedMult;
          this.vy += dy * 0.0025 * easeOut * speedMult;

          // add a small natural drift
          this.vx += this.releaseDriftX * 0.015;
          this.vy += this.releaseDriftY * 0.015;

          // strong damping to remove elastic feel
          this.vx *= 0.965;
          this.vy *= 0.965;

          this.x += this.vx;
          this.y += this.vy;

          this.drawAlpha = flickerVal * this.alpha;
        }
      }

      draw() {
        const [r, g, b] = this.col;
        const a = Math.max(0, Math.min(1, this.drawAlpha));
        const coreR = this.baseR * sizeMult;
        const isFormed = phase === 'hold' || phase === 'attract';
        const glowSize = (isFormed ? coreR * 2.2 : coreR * 4.0) * glowMult;

        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize);
        grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        grad.addColorStop(0.35, `rgba(${r},${g},${b},${a * 0.2})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.globalCompositeOperation = 'lighter';

        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, coreR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, a * 1.8)})`;
        ctx.fill();

        ctx.globalCompositeOperation = 'source-over';
      }
    }

    const rebuildParticles = () => {
      targets = getTextPoints(name, N);
      scatterTargets = getScatterPoints(N);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles = Array.from({ length: N }, (_, i) => new Particle(i));
      phase = 'float';
      phaseTimer = 0;
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      phaseTimer += speedMult;

      if (phase === 'float' && phaseTimer > FLOAT_DUR) {
        phase = 'attract';
        phaseTimer = 0;
        targets = getTextPoints(name, N);
      } else if (phase === 'attract' && phaseTimer > ATTRACT_DUR) {
        phase = 'hold';
        phaseTimer = 0;
      } else if (phase === 'hold' && phaseTimer > HOLD_DUR) {
        phase = 'release';
        phaseTimer = 0;
        scatterTargets = getScatterPoints(N);

        particles.forEach((p) => {
          // small outward break from the text
          const cx = canvas.width / 2;
          const cy = canvas.height / 2;
          const dx = p.x - cx;
          const dy = p.y - cy;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;

          // much softer than before
          p.vx *= 0.35;
          p.vy *= 0.35;

          p.vx += (dx / len) * (0.4 + Math.random() * 0.6);
          p.vy += (dy / len) * (0.4 + Math.random() * 0.6);

          p.releaseDriftX = (Math.random() - 0.5) * 1.2;
          p.releaseDriftY = (Math.random() - 0.5) * 1.2;

          p.angle = Math.random() * Math.PI * 2;
          p.angleSpeed = (Math.random() - 0.5) * 0.01;
        });
      } else if (phase === 'release' && phaseTimer > RELEASE_DUR) {
        phase = 'float';
        phaseTimer = 0;
      }

      for (const p of particles) {
        p.update(phase, phaseTimer);
        p.draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [name]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block bg-zinc-950"
    />
  );
}