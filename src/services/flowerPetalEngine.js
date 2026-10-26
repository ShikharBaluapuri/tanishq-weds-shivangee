import React, { useEffect } from 'react';

/**
 * Organic Falling Flower Petals Physics Engine
 * Simulates gentle botanical petals (Jasmine, Blush Rose, Sage Leaves, Gold Pollen, Marigold)
 * with sine-wave sway, 3D tumbling (oscillating scaleX/scaleY), and realistic gravity.
 */

class FlowerPetalManager {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.petals = [];
    this.animId = null;
    this.isActive = false;
    this.initCanvas();
  }

  initCanvas() {
    if (typeof window === 'undefined') return;

    // Check if canvas already exists in DOM
    let existing = document.getElementById('flower-petal-canvas');
    if (existing) {
      this.canvas = existing;
    } else {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'flower-petal-canvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100vw';
      this.canvas.style.height = '100vh';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '9999';
      document.body.appendChild(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  }

  /**
   * Trigger a flower petal shower
   * @param {'royal' | 'haldi' | 'pushpavarsha' | 'jasmine'} preset
   * @param {number} count Number of petals (default 50-60)
   */
  shower(preset = 'royal', count = 55) {
    if (!this.canvas || !this.ctx) {
      this.initCanvas();
    }
    if (!this.canvas || !this.ctx) return;

    const newPetals = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      newPetals.push(this.createPetal(preset, now + i * 40));
    }

    this.petals.push(...newPetals);

    if (!this.isActive) {
      this.isActive = true;
      this.loop();
    }
  }

  createPetal(preset, spawnDelay) {
    const types = this.getTypesForPreset(preset);
    const chosenType = types[Math.floor(Math.random() * types.length)];

    return {
      type: chosenType.type,
      color: chosenType.color,
      accentColor: chosenType.accentColor,
      size: chosenType.baseSize * (0.75 + Math.random() * 0.5),
      x: Math.random() * (this.width || window.innerWidth),
      y: -20 - Math.random() * 80,
      vx: (Math.random() - 0.5) * 1.2,
      vy: 1.2 + Math.random() * 1.6,
      swaySpeed: 0.02 + Math.random() * 0.03,
      swayAmp: 1.5 + Math.random() * 2.5,
      swayPhase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      vRotation: (Math.random() - 0.5) * 0.04,
      flipSpeed: 0.03 + Math.random() * 0.04,
      flipPhase: Math.random() * Math.PI * 2,
      opacity: 0.95,
      spawnAt: spawnDelay,
      born: false
    };
  }

  getTypesForPreset(preset) {
    if (preset === 'haldi') {
      return [
        { type: 'marigold', color: '#F59E0B', accentColor: '#D97706', baseSize: 13 },
        { type: 'marigold', color: '#FBBF24', accentColor: '#F59E0B', baseSize: 14 },
        { type: 'rose', color: '#F43F5E', accentColor: '#E11D48', baseSize: 12 },
        { type: 'leaf', color: '#84CC16', accentColor: '#65A30D', baseSize: 11 },
        { type: 'pollen', color: '#FDE047', accentColor: '#FACC15', baseSize: 4 }
      ];
    }

    if (preset === 'pushpavarsha') {
      return [
        { type: 'rose', color: '#E8A598', accentColor: '#B85D57', baseSize: 14 },
        { type: 'rose', color: '#C04E4A', accentColor: '#932824', baseSize: 15 },
        { type: 'jasmine', color: '#FDFBF7', accentColor: '#B8A072', baseSize: 13 },
        { type: 'pollen', color: '#B8A072', accentColor: '#9A8052', baseSize: 4.5 },
        { type: 'leaf', color: '#6E8572', accentColor: '#526B58', baseSize: 12 }
      ];
    }

    // Default 'royal' preset matching त-S logo & luxury botanical palette
    return [
      { type: 'rose', color: '#E8A598', accentColor: '#B85D57', baseSize: 14 },
      { type: 'rose', color: '#C86D67', accentColor: '#9E3B36', baseSize: 13 },
      { type: 'jasmine', color: '#FDFBF7', accentColor: '#C5A869', baseSize: 13 },
      { type: 'leaf', color: '#6E8572', accentColor: '#4F6553', baseSize: 12 },
      { type: 'pollen', color: '#D4B872', accentColor: '#B39043', baseSize: 4 }
    ];
  }

  loop() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.width, this.height);
    const now = Date.now();
    let aliveCount = 0;

    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];

      // Delay stagger
      if (now < p.spawnAt) continue;
      p.born = true;

      // Update Physics
      p.swayPhase += p.swaySpeed;
      p.flipPhase += p.flipSpeed;
      p.rotation += p.vRotation;

      p.x += Math.sin(p.swayPhase) * p.swayAmp + p.vx;
      p.y += p.vy;

      // Fade out smoothly near bottom
      if (p.y > this.height - 120) {
        p.opacity = Math.max(0, (this.height - p.y) / 120);
      }

      if (p.y < this.height && p.opacity > 0) {
        aliveCount++;
        this.drawPetal(p);
      }
    }

    // Filter dead petals
    if (this.petals.length > 200 || aliveCount === 0) {
      this.petals = this.petals.filter(p => !p.born || (p.y < this.height && p.opacity > 0));
    }

    if (this.petals.length > 0 && aliveCount > 0) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.isActive = false;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  drawPetal(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    // 3D Fluttering effect via scaleX & scaleY oscillation
    const scaleX = Math.cos(p.flipPhase);
    const scaleY = Math.sin(p.swayPhase * 0.7);
    ctx.scale(scaleX, Math.max(0.3, Math.abs(scaleY)));
    ctx.globalAlpha = p.opacity;

    const s = p.size;

    if (p.type === 'rose') {
      // Elegant organic rose petal shape
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.8, -s * 0.7, s * 1.1, s * 0.4, 0, s);
      ctx.bezierCurveTo(-s * 1.1, s * 0.4, -s * 0.8, -s * 0.7, 0, -s);
      
      const grad = ctx.createLinearGradient(0, -s, 0, s);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, p.accentColor);
      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(0,0,0,0.12)';
      ctx.shadowBlur = 4;
      ctx.fill();

    } else if (p.type === 'jasmine') {
      // 5-petal delicate white jasmine blossom
      ctx.fillStyle = p.color;
      ctx.shadowColor = 'rgba(0,0,0,0.08)';
      ctx.shadowBlur = 3;
      for (let j = 0; j < 5; j++) {
        ctx.save();
        ctx.rotate((j * Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.55, s * 0.28, s * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // Warm gold stamen center
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = p.accentColor;
      ctx.fill();

    } else if (p.type === 'marigold') {
      // Ruffled festive marigold petal
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.8);
      ctx.bezierCurveTo(s * 0.9, -s * 0.5, s * 0.7, s * 0.7, 0, s);
      ctx.bezierCurveTo(-s * 0.7, s * 0.7, -s * 0.9, -s * 0.5, 0, -s * 0.8);
      ctx.fillStyle = p.color;
      ctx.shadowColor = 'rgba(217, 119, 6, 0.2)';
      ctx.shadowBlur = 4;
      ctx.fill();

    } else if (p.type === 'leaf') {
      // Delicate sage / olive leaf with vein
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s * 0.6, 0, 0, s);
      ctx.quadraticCurveTo(-s * 0.6, 0, 0, -s);
      ctx.fillStyle = p.color;
      ctx.shadowColor = 'rgba(0,0,0,0.08)';
      ctx.shadowBlur = 3;
      ctx.fill();

      // Vein line
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.8);
      ctx.lineTo(0, s * 0.8);
      ctx.strokeStyle = p.accentColor;
      ctx.lineWidth = 0.8;
      ctx.stroke();

    } else if (p.type === 'pollen') {
      // Golden shimmering pollen speck
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.accentColor;
      ctx.shadowBlur = 6;
      ctx.fill();
    }

    ctx.restore();
  }
}

// Global Singleton
export const flowerPetalEngine = new FlowerPetalManager();

/**
 * Convenience helper to trigger flower petal shower anywhere
 * @param {'royal' | 'haldi' | 'pushpavarsha' | 'jasmine'} preset 
 * @param {number} count 
 */
export function triggerFlowerPetals(preset = 'royal', count = 55) {
  flowerPetalEngine.shower(preset, count);
}

/**
 * React Component wrapper for the Flower Petal Shower Canvas
 */
export function FlowerPetalShower() {
  useEffect(() => {
    flowerPetalEngine.initCanvas();
  }, []);
  return null;
}

