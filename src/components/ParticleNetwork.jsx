import { useRef, useEffect } from "react";

const PARTICLE_COUNT = 60;
const PARTICLE_RADIUS = 2.2;
const LINE_DISTANCE = 120;
const MOUSE_ATTRACT_DISTANCE = 100;
const MOUSE_ATTRACT_STRENGTH = 0.13;

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

    // Init particles
    particles.current = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      vx: randomBetween(-0.5, 0.5),
      vy: randomBetween(-0.5, 0.5),
    }));

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Move and draw particles
      for (let p of particles.current) {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce at edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse attraction
        if (mouse.current.x !== null && mouse.current.y !== null) {
          const dx = mouse.current.x - p.x;
          const dy = mouse.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_ATTRACT_DISTANCE) {
            p.vx += (dx / dist) * MOUSE_ATTRACT_STRENGTH;
            p.vy += (dy / dist) * MOUSE_ATTRACT_STRENGTH;
          }
        }
      }

      // Draw lines
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i];
          const b = particles.current[j];
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

      // Draw particles
      for (let p of particles.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = "#1a73e8";
        ctx.shadowColor = "#1a73e8";
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

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

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 900,
        zIndex: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      }}
      width={window.innerWidth}
      height={window.innerHeight}
      aria-hidden="true"
    />
  );
}

export default ParticleNetwork;