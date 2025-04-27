import { useRef, useEffect } from "react";

const PARTICLE_COUNT = 30; // Fewer since only right gutter
const PARTICLE_RADIUS = 2.2;
const LINE_DISTANCE = 120;
const MOUSE_ATTRACT_DISTANCE = 100;
const MOUSE_ATTRACT_STRENGTH = 0.13;
const CENTER_WIDTH = 900; // width of your app-container

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function ParticleNetwork() {
  const canvasRef = useRef();
  const particles = useRef([]);
  const mouse = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    resize();
    window.addEventListener("resize", resize);

    // Spawn a particle in the right gutter only
    function spawnParticle() {
      const rightGutterStart = width - (width - CENTER_WIDTH) / 2;
      return {
        x: randomBetween(rightGutterStart, width),
        y: randomBetween(0, height),
        vx: randomBetween(-0.5, 0.5),
        vy: randomBetween(-0.5, 0.5),
      };
    }

    function spawnParticles() {
      particles.current = Array.from({ length: PARTICLE_COUNT }).map(spawnParticle);
    }
    spawnParticles();

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // CLIP TO RIGHT GUTTER ONLY
      ctx.save();
      ctx.beginPath();
      ctx.rect(width - (width - CENTER_WIDTH) / 2, 0, (width - CENTER_WIDTH) / 2, height);
      ctx.clip();

      const rightGutterStart = width - (width - CENTER_WIDTH) / 2;

      // Move and draw particles
      for (let p of particles.current) {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off gutter boundaries (hard wall at gutter/center boundary and right edge)
        if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }
        if (p.x < rightGutterStart + PARTICLE_RADIUS) {
          p.x = rightGutterStart + PARTICLE_RADIUS;
          p.vx *= -1;
        }
        // Bounce off top/bottom
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        }
        if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }

        // Mouse attraction (only if mouse is in right gutter)
        if (
          mouse.current.x !== null &&
          mouse.current.y !== null &&
          mouse.current.x > rightGutterStart
        ) {
          const dx = mouse.current.x - p.x;
          const dy = mouse.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_ATTRACT_DISTANCE) {
            p.vx += (dx / dist) * MOUSE_ATTRACT_STRENGTH;
            p.vy += (dy / dist) * MOUSE_ATTRACT_STRENGTH;
          }
        }
      }

      // Draw lines (only if both nodes are in the right gutter)
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i];
          const b = particles.current[j];
          if (a.x > rightGutterStart && b.x > rightGutterStart) {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < LINE_DISTANCE) {
              ctx.strokeStyle = "rgba(26, 115, 232, 0.13)";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw particles (gutter only, enforced by clip)
      for (let p of particles.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = "#1a73e8";
        ctx.shadowColor = "#1a73e8";
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Mouse move
    function handleMouse(e) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    }
    function handleMouseLeave() {
      mouse.current.x = null;
      mouse.current.y = null;
    }
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Re-spawn particles on resize for new gutter
    window.addEventListener("resize", spawnParticles);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", spawnParticles);
    };
  }, []);

  // Hide canvas on small screens
  const isDesktop = typeof window !== "undefined" ? window.innerWidth > CENTER_WIDTH : true;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        display: isDesktop ? "block" : "none",
      }}
      width={typeof window !== "undefined" ? window.innerWidth : 1920}
      height={typeof window !== "undefined" ? window.innerHeight : 1080}
      aria-hidden="true"
    />
  );
}

export default ParticleNetwork;