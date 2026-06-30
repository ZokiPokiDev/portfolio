import { useRef, useEffect } from "react";

const CLUSTERS = [
  {
    title: "AI / RAG",
    subtitle: "OpenAI + LangChain + Qdrant",
    color: "#8ab4f8",
    nodes: ["LLM", "Embeddings", "Vector DB", "Context"],
  },
  {
    title: "Backend APIs",
    subtitle: "Nest.js + FastAPI + Laravel",
    color: "#7dd3a8",
    nodes: ["REST", "Queues", "Auth", "Workers"],
  },
  {
    title: "Frontend",
    subtitle: "React + Native + MUI",
    color: "#f4b942",
    nodes: ["UX", "SPA", "Mobile", "Dashboards"],
  },
  {
    title: "Ops",
    subtitle: "Docker + nginx + PostgreSQL",
    color: "#c7d0dc",
    nodes: ["Linux", "Plesk", "CI/CD", "Metrics"],
  },
];

function getSideWidth() {
  return Math.max(window.innerWidth - 900, 320);
}

function getClusterLayout(width, height) {
  const railReserve = width > 560 ? 290 : 90;
  const drawingWidth = Math.max(width - railReserve, 260);
  const centerX = Math.min(drawingWidth * 0.5, 260);
  const firstY = Math.max(118, height * 0.18);
  const gap = Math.max(132, Math.min(178, height * 0.19));

  return CLUSTERS.map((cluster, index) => ({
    ...cluster,
    x: centerX + (index % 2 === 0 ? -28 : 28),
    y: firstY + index * gap,
  }));
}

function drawRoundedLabel(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function ParticleNetwork() {
  const canvasRef = useRef();
  const mouse = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = getSideWidth();
    let height = window.innerHeight;
    let animationId;
    let tick = 0;

    function resize() {
      width = getSideWidth();
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function drawCluster(cluster, index) {
      const pulse = Math.sin(tick / 44 + index) * 4;
      const nodeRadius = 46 + pulse;
      const nodePositions = cluster.nodes.map((node, nodeIndex) => {
        const angle = (Math.PI * 2 * nodeIndex) / cluster.nodes.length + tick / 420;
        return {
          label: node,
          x: cluster.x + Math.cos(angle) * nodeRadius,
          y: cluster.y + Math.sin(angle) * nodeRadius,
        };
      });

      ctx.strokeStyle = `${cluster.color}38`;
      ctx.lineWidth = 1;
      nodePositions.forEach((node) => {
        ctx.beginPath();
        ctx.moveTo(cluster.x, cluster.y);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
      });

      for (let i = 0; i < nodePositions.length; i += 1) {
        for (let j = i + 1; j < nodePositions.length; j += 1) {
          const a = nodePositions[i];
          const b = nodePositions[j];
          ctx.strokeStyle = `${cluster.color}18`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(cluster.x, cluster.y, 7.5, 0, Math.PI * 2);
      ctx.fillStyle = cluster.color;
      ctx.shadowColor = cluster.color;
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      nodePositions.forEach((node) => {
        const dx = (mouse.current.x ?? -9999) - node.x;
        const dy = (mouse.current.y ?? -9999) - node.y;
        const active = Math.sqrt(dx * dx + dy * dy) < 58;

        ctx.beginPath();
        ctx.arc(node.x, node.y, active ? 5.4 : 4.2, 0, Math.PI * 2);
        ctx.fillStyle = active ? cluster.color : "#8b98a8";
        ctx.fill();

        ctx.font = active ? "700 11px ui-monospace, SFMono-Regular, Menlo, monospace" : "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillStyle = active ? "#1f2937" : "#68717d";
        ctx.fillText(node.label, node.x + 8, node.y + 4);
      });

      const labelWidth = Math.min(220, width - cluster.x - 18);
      const labelX = Math.min(cluster.x + 18, width - labelWidth - 14);
      const labelY = cluster.y - 28;

      ctx.fillStyle = "rgba(248, 250, 252, 0.82)";
      ctx.strokeStyle = "rgba(31, 41, 55, 0.12)";
      ctx.lineWidth = 1;
      drawRoundedLabel(ctx, labelX, labelY, labelWidth, 56, 9);
      ctx.fill();
      ctx.stroke();

      ctx.font = "800 12px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillStyle = "#222831";
      ctx.fillText(cluster.title, labelX + 12, labelY + 21);
      ctx.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillStyle = "#68717d";
      ctx.fillText(cluster.subtitle, labelX + 12, labelY + 40);
    }

    function animate() {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(31, 111, 235, 0.03)");
      gradient.addColorStop(1, "rgba(31, 41, 55, 0.02)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      getClusterLayout(width, height).forEach(drawCluster);
      animationId = requestAnimationFrame(animate);
    }

    function handleMouse(event) {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = event.clientX - rect.left;
      mouse.current.y = event.clientY - rect.top;
    }

    function handleMouseLeave() {
      mouse.current.x = null;
      mouse.current.y = null;
    }

    resize();
    animate();
    window.addEventListener("resize", resize);
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
        left: "900px",
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}

export default ParticleNetwork;
