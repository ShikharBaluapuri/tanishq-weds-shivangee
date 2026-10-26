import React, { useEffect, useRef } from 'react';

/**
 * Romantic Botanical Floral & Petal Animation Engine
 * Inspired by luxury Indian wedding stationery:
 * - White jasmine (mogra) blossoms
 * - Soft translucent ivory petals
 * - Subtle blush-pink petals
 * - Delicate sage botanical leaflets
 */

// Draw delicate Jasmine blossom (5 white petals with golden center)
function drawJasmine(ctx, size) {
  ctx.save();
  const petalCount = 5;
  const radius = size * 0.45;

  for (let i = 0; i < petalCount; i++) {
    const angle = (i * 2 * Math.PI) / petalCount;
    ctx.save();
    ctx.rotate(angle);
    
    // Petal gradient
    const grad = ctx.createLinearGradient(0, 0, 0, radius);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
    grad.addColorStop(0.7, 'rgba(252, 249, 242, 0.95)');
    grad.addColorStop(1, 'rgba(240, 233, 220, 0.85)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-radius * 0.35, radius * 0.4, -radius * 0.25, radius, 0, radius * 1.1);
    ctx.bezierCurveTo(radius * 0.25, radius, radius * 0.35, radius * 0.4, 0, 0);
    ctx.fill();

    // Subtle petal spine
    ctx.strokeStyle = 'rgba(195, 165, 107, 0.2)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, radius * 0.85);
    ctx.stroke();

    ctx.restore();
  }

  // Golden stamen center
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = '#C3A56B';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, size * 0.05, 0, Math.PI * 2);
  ctx.fillStyle = '#8B6B38';
  ctx.fill();

  ctx.restore();
}

// Draw soft ivory curved petal
function drawIvoryPetal(ctx, size) {
  ctx.save();
  const w = size * 0.55;
  const h = size * 0.85;

  const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.5, 'rgba(250, 246, 238, 0.92)');
  grad.addColorStop(1, 'rgba(235, 225, 208, 0.8)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.bezierCurveTo(w, -h * 0.3, w * 0.85, h * 0.4, 0, h / 2);
  ctx.bezierCurveTo(-w * 0.7, h * 0.35, -w * 0.9, -h * 0.25, 0, -h / 2);
  ctx.fill();

  // Subtle translucent ribbing
  ctx.strokeStyle = 'rgba(195, 165, 107, 0.15)';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.4);
  ctx.quadraticCurveTo(w * 0.1, 0, 0, h * 0.4);
  ctx.stroke();

  ctx.restore();
}

// Draw subtle blush-pink petal
function drawBlushPetal(ctx, size) {
  ctx.save();
  const w = size * 0.6;
  const h = size * 0.9;

  const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  grad.addColorStop(0, 'rgba(255, 245, 245, 0.96)');
  grad.addColorStop(0.4, 'rgba(248, 230, 228, 0.92)');
  grad.addColorStop(1, 'rgba(232, 205, 202, 0.82)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.bezierCurveTo(w * 0.95, -h * 0.25, w, h * 0.3, 0, h / 2);
  ctx.bezierCurveTo(-w, h * 0.3, -w * 0.8, -h * 0.3, 0, -h / 2);
  ctx.fill();

  // Gentle blush vein
  ctx.strokeStyle = 'rgba(200, 140, 140, 0.18)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.35);
  ctx.lineTo(0, h * 0.35);
  ctx.stroke();

  ctx.restore();
}

// Draw tiny delicate sage leaf
function drawLeaf(ctx, size) {
  ctx.save();
  const w = size * 0.35;
  const h = size * 0.75;

  const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  grad.addColorStop(0, 'rgba(122, 145, 127, 0.9)');
  grad.addColorStop(0.7, 'rgba(88, 114, 94, 0.85)');
  grad.addColorStop(1, 'rgba(53, 79, 59, 0.8)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.bezierCurveTo(w, -h * 0.1, w * 0.9, h * 0.3, 0, h / 2);
  ctx.bezierCurveTo(-w * 0.9, h * 0.3, -w, -h * 0.1, 0, -h / 2);
  ctx.fill();

  // Leaf vein
  ctx.strokeStyle = 'rgba(232, 228, 216, 0.3)';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.4);
  ctx.lineTo(0, h * 0.4);
  ctx.stroke();

  ctx.restore();
}

export class FloralParticle {
  constructor(originX, originY, spreadRadius = 120) {
    this.x = originX + (Math.random() - 0.5) * spreadRadius;
    this.y = originY + (Math.random() - 0.5) * (spreadRadius * 0.6);

    // Initial upward and outward burst
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.95);
    const speed = 2.2 + Math.random() * 4.5;
    this.vx = Math.cos(angle) * speed + (Math.random() - 0.5) * 1.5;
    this.vy = Math.sin(angle) * speed - 1.2;

    // Natural drift & oscillation
    this.swayOffset = Math.random() * Math.PI * 2;
    this.swaySpeed = 0.02 + Math.random() * 0.025;
    this.swayAmount = 0.6 + Math.random() * 1.2;

    // Gravity & air resistance
    this.gravity = 0.045 + Math.random() * 0.025;
    this.friction = 0.978;

    // 3D rotation and tumbling
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.04;
    this.flip = Math.random() * Math.PI * 2;
    this.flipSpeed = 0.02 + Math.random() * 0.05;

    // Size: between 14px and 26px
    this.size = 14 + Math.random() * 14;

    // Type distribution: 25% jasmine, 35% ivory petal, 25% blush petal, 15% leaf
    const rand = Math.random();
    if (rand < 0.25) this.type = 'jasmine';
    else if (rand < 0.60) this.type = 'ivory';
    else if (rand < 0.85) this.type = 'blush';
    else this.type = 'leaf';

    // Opacity and lifespan
    this.alpha = 0;
    this.maxAlpha = 0.85 + Math.random() * 0.15;
    this.life = 0;
    this.maxLife = 140 + Math.random() * 60; // ~2.5 - 3.5 seconds at 60fps
  }

  update() {
    this.life++;

    // Fade in quickly, then gentle float, then soft fade out
    if (this.life < 18) {
      this.alpha = (this.life / 18) * this.maxAlpha;
    } else if (this.life > this.maxLife - 35) {
      this.alpha = ((this.maxLife - this.life) / 35) * this.maxAlpha;
    }

    // Apply velocities with friction and gravity
    this.vx *= this.friction;
    this.vy = this.vy * this.friction + this.gravity;

    // Horizontal gentle wind wave
    const wave = Math.sin(this.swayOffset + this.life * this.swaySpeed) * this.swayAmount;
    this.x += this.vx + wave;
    this.y += this.vy;

    // Rotations
    this.rotation += this.rotationSpeed;
    this.flip += this.flipSpeed;

    return this.life < this.maxLife && this.alpha > 0.005;
  }

  render(ctx) {
    if (this.alpha <= 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // 3D tumble flip effect by scaling along the vertical axis
    const flipScale = Math.cos(this.flip);
    ctx.scale(1, Math.max(0.12, Math.abs(flipScale)));

    ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));

    if (this.type === 'jasmine') {
      drawJasmine(ctx, this.size);
    } else if (this.type === 'ivory') {
      drawIvoryPetal(ctx, this.size);
    } else if (this.type === 'blush') {
      drawBlushPetal(ctx, this.size);
    } else {
      drawLeaf(ctx, this.size);
    }

    ctx.restore();
  }
}

/**
 * Global Floral Particle Engine manager
 * Creates an ultra-smooth transparent full-screen canvas
 */
export function triggerFloralShower(origin = null, count = 42) {
  if (typeof window === 'undefined') return;

  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let canvas = document.getElementById('wedding-floral-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'wedding-floral-canvas';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const startX = origin?.x ?? width / 2;
  const startY = origin?.y ?? height * 0.54;

  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new FloralParticle(startX, startY, Math.min(width * 0.4, 200)));
  }

  let animationFrameId;

  function loop() {
    ctx.clearRect(0, 0, width, height);

    let activeCount = 0;
    for (let i = 0; i < particles.length; i++) {
      const isAlive = particles[i].update();
      if (isAlive) {
        particles[i].render(ctx);
        activeCount++;
      }
    }

    if (activeCount > 0) {
      animationFrameId = requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, width, height);
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  animationFrameId = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(animationFrameId);
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  };
}

/**
 * Optional Declarative Floral Shower Component
 */
export default function FloralPetalsCanvas({ trigger, origin, count = 40 }) {
  useEffect(() => {
    if (trigger) {
      const cancel = triggerFloralShower(origin, count);
      return () => {
        if (cancel) cancel();
      };
    }
  }, [trigger]);

  return null;
}
