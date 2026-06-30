import { useRef, useEffect } from "react";

const CLUSTERS = [
  {
    title: "AI / RAG",
    subtitle: "OpenAI + LangChain + Qdrant",
    design: "Document intelligence flow",
    terminal: {
      path: "~/agents/rag-intel",
      folder: "rag-intel",
      tools: ["openai.responses", "langchain", "qdrant"],
      memory: "vector-memory",
      strategy: "retrieve -> reason -> verify",
    },
    color: "#8ab4f8",
    nodes: [
      { label: "Prompt", detail: "Intent, guardrails, and output shape" },
      { label: "Embed", detail: "Chunked documents and semantic search" },
      { label: "Retrieve", detail: "Qdrant context and citations" },
      { label: "Answer", detail: "LLM response with business context" },
    ],
  },
  {
    title: "Backend APIs",
    subtitle: "Nest.js + FastAPI + Laravel",
    design: "Service boundary map",
    terminal: {
      path: "~/systems/api-mesh",
      folder: "api-mesh",
      tools: ["nestjs", "fastapi", "queues"],
      memory: "event-log",
      strategy: "route -> execute -> retry",
    },
    color: "#7dd3a8",
    nodes: [
      { label: "REST", detail: "Typed endpoints and public contracts" },
      { label: "Queue", detail: "Jobs, retries, and async processing" },
      { label: "Auth", detail: "JWT, roles, sessions, and audit trails" },
      { label: "Worker", detail: "Crawlers, enrichers, and scheduled tasks" },
    ],
  },
  {
    title: "Frontend",
    subtitle: "React + Native + MUI",
    design: "Interface delivery loop",
    terminal: {
      path: "~/interfaces/workflow-ui",
      folder: "workflow-ui",
      tools: ["react", "mui", "playwright"],
      memory: "user-state",
      strategy: "intent -> screen -> feedback",
    },
    color: "#f4b942",
    nodes: [
      { label: "UX", detail: "Scannable screens and workflow fit" },
      { label: "SPA", detail: "React state, routing, and API clients" },
      { label: "Mobile", detail: "React Native and Flutter apps" },
      { label: "Portal", detail: "Operational dashboards and admin tools" },
    ],
  },
  {
    title: "Ops",
    subtitle: "Docker + nginx + PostgreSQL",
    design: "Production support surface",
    terminal: {
      path: "~/ops/prod-watch",
      folder: "prod-watch",
      tools: ["nginx", "postgresql", "systemd"],
      memory: "logs-metrics",
      strategy: "detect -> isolate -> recover",
    },
    color: "#c7d0dc",
    nodes: [
      { label: "Linux", detail: "Processes, memory, logs, and service health" },
      { label: "Proxy", detail: "nginx, Apache, TLS, and routing" },
      { label: "Data", detail: "PostgreSQL, MariaDB, Redis, backups" },
      { label: "Metrics", detail: "Monitoring, alerts, and incident notes" },
    ],
  },
  {
    title: "Full-Stacks Vercel",
    subtitle: "Laravel / Next.js",
    design: "Production support surface",
    terminal: {
      path: "~/full-stack",
      folder: "app",
      tools: ["nightwatch", "postgresql", "php-fpm", "Vercel", "TS"],
      memory: "redis",
      strategy: "backend -> frontend -> data flow",
    },
    color: "#c7d0dc",
    nodes: [
      { label: "Cloud", detail: "Vercel" },
      { label: "Data", detail: "Supabase, MongoDB" },
      { label: "Metrics", detail: "Vercel log system" },
    ],
  },
];

const FLOATING_PARTICLE_COUNT = 72;
const MOUSE_PUSH_DISTANCE = 120;
const MOUSE_PUSH_STRENGTH = 0.045;
const STAR_COLORS = ["#f8fbff", "#b8d7ff", "#8ab4f8", "#d8ecff", "#f4b942"];
const HOLOGRAM_CYAN = "#28f7ef";
const LAND_MASSES = [
  { lon: -102, lat: 45, rx: 34, ry: 24, tilt: -0.55, dots: 115 },
  { lon: -66, lat: -16, rx: 18, ry: 31, tilt: 0.24, dots: 86 },
  { lon: -42, lat: 72, rx: 15, ry: 8, tilt: -0.2, dots: 26 },
  { lon: 15, lat: 51, rx: 24, ry: 13, tilt: -0.05, dots: 62 },
  { lon: 19, lat: 2, rx: 23, ry: 37, tilt: 0.08, dots: 104 },
  { lon: 76, lat: 35, rx: 38, ry: 21, tilt: 0.22, dots: 84 },
  { lon: 134, lat: -25, rx: 16, ry: 10, tilt: 0.1, dots: 28 },
];

function getSideWidth() {
  return Math.max(window.innerWidth - 900, 320);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function seededFraction(index, salt) {
  return Math.abs(Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1;
}

function createGlobeDots() {
  const dots = [];

  LAND_MASSES.forEach((mass, massIndex) => {
    for (let index = 0; index < mass.dots; index += 1) {
      const radius = Math.sqrt(seededFraction(index + massIndex * 200, 1));
      const angle = seededFraction(index + massIndex * 200, 2) * Math.PI * 2;
      const localX = Math.cos(angle) * radius * mass.rx;
      const localY = Math.sin(angle) * radius * mass.ry;
      const rotatedX = localX * Math.cos(mass.tilt) - localY * Math.sin(mass.tilt);
      const rotatedY = localX * Math.sin(mass.tilt) + localY * Math.cos(mass.tilt);

      dots.push({
        lon: mass.lon + rotatedX,
        lat: clamp(mass.lat + rotatedY, -72, 78),
        size: 0.78 + seededFraction(index + massIndex * 200, 3) * 1.35,
        alpha: 0.42 + seededFraction(index + massIndex * 200, 4) * 0.52,
      });
    }
  });

  return dots;
}

const GLOBE_DOTS = createGlobeDots();

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

function drawRoundedRect(ctx, x, y, width, height, radius) {
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

function trimText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;

  let next = text;
  while (next.length > 4 && ctx.measureText(`${next}...`).width > maxWidth) {
    next = next.slice(0, -1);
  }
  return `${next}...`;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createFloatingParticles(width, height) {
  return Array.from({ length: FLOATING_PARTICLE_COUNT }).map((_, index) => ({
    x: randomBetween(0, width),
    y: randomBetween(0, height * 0.9),
    vx: randomBetween(-0.22, 0.22),
    vy: randomBetween(-0.18, 0.18),
    radius: index % 9 === 0 ? 2.2 : randomBetween(0.8, 1.7),
    color: STAR_COLORS[index % STAR_COLORS.length],
    phase: randomBetween(0, Math.PI * 2),
    twinkle: randomBetween(0.35, 0.9),
  }));
}

function drawParticleGroup(ctx, focus, color, tick, activeStrength) {
  const groupSize = 9;
  for (let index = 0; index < groupSize; index += 1) {
    const angle = (Math.PI * 2 * index) / groupSize + tick / 28;
    const radius = 13 + Math.sin(tick / 18 + index) * 5;
    const x = focus.x + Math.cos(angle) * radius * activeStrength;
    const y = focus.y + Math.sin(angle) * radius * activeStrength;

    ctx.beginPath();
    ctx.arc(x, y, index % 3 === 0 ? 2.3 : 1.6, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.42 + (index % 3) * 0.12;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = `${color}32`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(focus.x, focus.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function drawTerminalCard(ctx, cluster, focusNode, width, height) {
  const terminal = cluster.terminal;
  const nodeSlug = focusNode.label.toLowerCase().replace(/\s+/g, "-");
  const tools = terminal.tools.join(" + ");
  const cardWidth = Math.min(330, width - 18);
  const cardHeight = 196;
  const x = clamp(cluster.x + 36, 10, width - cardWidth - 10);
  const y = clamp(cluster.y - 92, 12, height - cardHeight - 20);
  const lines = [
    { text: `zoran@systempro:${terminal.path}$ inspect ${nodeSlug}`, color: "#97a3b6" },
    { text: `./${terminal.folder}`, color: "#f8fbff" },
    { text: `+- agents/${nodeSlug}.agent.ts`, color: cluster.color },
    { text: `+- tools/${tools}`, color: "#c7d0dc" },
    { text: `+- memory/${terminal.memory}.json`, color: "#c7d0dc" },
    { text: `+- loops/${terminal.strategy}`, color: "#c7d0dc" },
    { text: `detail: ${focusNode.detail}`, color: "#f8fbff" },
  ];

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.36)";
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 14;
  ctx.fillStyle = "rgba(5, 10, 18, 0.94)";
  ctx.strokeStyle = `${cluster.color}99`;
  ctx.lineWidth = 1.4;
  drawRoundedRect(ctx, x, y, cardWidth, cardHeight, 9);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "rgba(13, 19, 31, 0.98)";
  drawRoundedRect(ctx, x + 1, y + 1, cardWidth - 2, 28, 8);
  ctx.fill();

  ["#ff5f56", "#ffbd2e", "#27c93f"].forEach((color, index) => {
    ctx.beginPath();
    ctx.arc(x + 15 + index * 14, y + 15, 3.8, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.86;
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  ctx.font = "800 10px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillStyle = cluster.color;
  ctx.fillText(trimText(ctx, `${cluster.title} / ${focusNode.label}`, cardWidth - 82), x + 62, y + 19);

  ctx.font = "700 10.5px ui-monospace, SFMono-Regular, Menlo, monospace";
  lines.forEach((line, index) => {
    const offsetY = y + 50 + index * 19;
    ctx.fillStyle = line.color;
    ctx.globalAlpha = index === 0 ? 0.82 : 1;
    ctx.fillText(trimText(ctx, line.text, cardWidth - 24), x + 12, offsetY);
  });
  ctx.globalAlpha = 1;

  ctx.fillStyle = "rgba(138, 180, 248, 0.06)";
  drawRoundedRect(ctx, x + 12, y + cardHeight - 31, cardWidth - 24, 19, 6);
  ctx.fill();
  ctx.font = "800 10px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillStyle = cluster.color;
  ctx.fillText(trimText(ctx, `strategy: ${cluster.design}`, cardWidth - 40), x + 22, y + cardHeight - 18);
}

function projectGlobePoint(point, centerX, centerY, radius, centerLon) {
  const latRad = (point.lat * Math.PI) / 180;
  const lonRad = ((point.lon - centerLon) * Math.PI) / 180;
  const depth = Math.cos(latRad) * Math.cos(lonRad);

  return {
    x: centerX + radius * Math.cos(latRad) * Math.sin(lonRad),
    y: centerY - radius * Math.sin(latRad),
    visible: depth > 0,
    depth,
  };
}

function drawProjectedPath(ctx, points, strokeStyle, lineWidth) {
  ctx.beginPath();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;

  let open = false;
  points.forEach((point) => {
    if (!point.visible) {
      open = false;
      return;
    }

    if (!open) {
      ctx.moveTo(point.x, point.y);
      open = true;
      return;
    }

    ctx.lineTo(point.x, point.y);
  });

  ctx.stroke();
}

function drawHologramBase(ctx, centerX, baseY, radius, tick, layer = "back") {
  ctx.save();
  ctx.shadowColor = "rgba(40, 247, 239, 0.68)";
  ctx.shadowBlur = layer === "back" ? 22 : 18;

  for (let index = 0; index < 4; index += 1) {
    const ringWidth = radius * (1.66 - index * 0.22);
    const ringHeight = radius * (0.3 - index * 0.034);
    const y = baseY - index * 5;
    ctx.beginPath();
    ctx.ellipse(
      centerX,
      y,
      ringWidth,
      ringHeight,
      0,
      layer === "back" ? Math.PI : 0,
      layer === "back" ? Math.PI * 2 : Math.PI,
    );
    ctx.strokeStyle = `rgba(40, 247, 239, ${
      layer === "back" ? 0.38 - index * 0.06 : 0.62 - index * 0.1
    })`;
    ctx.lineWidth = index === 0 ? 2.2 : 1.2;
    ctx.stroke();
  }

  if (layer === "front") {
    ctx.restore();
    return;
  }

  ctx.shadowBlur = 10;
  for (let index = 0; index < 30; index += 1) {
    const angle = (Math.PI * 2 * index) / 30 + tick / 260;
    const rx = radius * 1.58;
    const ry = radius * 0.25;
    const x = centerX + Math.cos(angle) * rx;
    const y = baseY + Math.sin(angle) * ry;
    const size = index % 5 === 0 ? 5 : 2.8;

    ctx.beginPath();
    ctx.moveTo(x - size * 0.5, y);
    ctx.lineTo(x + size * 0.5, y);
    ctx.strokeStyle = "rgba(184, 255, 252, 0.44)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
}

function drawHologramGlobe(ctx, width, height, tick) {
  const radius = clamp(Math.min(width * 0.43, height * 0.24), 218, 390);
  const centerX = clamp(width * 0.6, radius + 20, width - radius - 12);
  const centerY = height - radius * 1.02;
  const baseY = centerY + radius * 0.82;
  const centerLon = -35 + Math.sin(tick / 820) * 4;
  const projectedDots = GLOBE_DOTS.map((dot) => ({
    ...projectGlobePoint(dot, centerX, centerY, radius, centerLon),
    source: dot,
  }));

  drawHologramBase(ctx, centerX, baseY, radius, tick, "back");

  ctx.save();
  ctx.shadowColor = "rgba(40, 247, 239, 0.48)";
  ctx.shadowBlur = 28;
  const globeGlow = ctx.createRadialGradient(centerX - radius * 0.28, centerY - radius * 0.24, radius * 0.08, centerX, centerY, radius);
  globeGlow.addColorStop(0, "rgba(40, 247, 239, 0.17)");
  globeGlow.addColorStop(0.48, "rgba(40, 247, 239, 0.06)");
  globeGlow.addColorStop(1, "rgba(5, 12, 22, 0.12)");
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = globeGlow;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  for (let lon = -180; lon <= 180; lon += 24) {
    const points = [];
    for (let lat = -78; lat <= 78; lat += 5) {
      points.push(projectGlobePoint({ lon, lat }, centerX, centerY, radius, centerLon));
    }
    drawProjectedPath(ctx, points, "rgba(40, 247, 239, 0.16)", 0.8);
  }

  for (let lat = -60; lat <= 60; lat += 20) {
    const points = [];
    for (let lon = -180; lon <= 180; lon += 5) {
      points.push(projectGlobePoint({ lon, lat }, centerX, centerY, radius, centerLon));
    }
    drawProjectedPath(ctx, points, "rgba(40, 247, 239, 0.13)", 0.8);
  }

  for (let index = 0; index < projectedDots.length; index += 8) {
    const a = projectedDots[index];
    const b = projectedDots[(index + 17) % projectedDots.length];
    if (!a.visible || !b.visible || distance(a, b) > radius * 0.54) continue;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = "rgba(40, 247, 239, 0.12)";
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }

  projectedDots.forEach((dot, index) => {
    if (!dot.visible) return;

    const pulse = 0.76 + Math.sin(tick / 30 + index) * 0.2;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.source.size * (0.74 + dot.depth * 0.36), 0, Math.PI * 2);
    ctx.fillStyle = index % 13 === 0 ? "#d8fffd" : HOLOGRAM_CYAN;
    ctx.globalAlpha = dot.source.alpha * pulse * (0.5 + dot.depth * 0.48);
    ctx.shadowColor = HOLOGRAM_CYAN;
    ctx.shadowBlur = index % 11 === 0 ? 7 : 3;
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.restore();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(40, 247, 239, 0.76)";
  ctx.lineWidth = 1.5;
  ctx.shadowColor = "rgba(40, 247, 239, 0.7)";
  ctx.shadowBlur = 16;
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.beginPath();
  ctx.arc(centerX - radius * 0.2, centerY - radius * 0.1, radius * 0.92, -0.55, 1.35);
  ctx.strokeStyle = "rgba(184, 255, 252, 0.28)";
  ctx.lineWidth = 1.1;
  ctx.stroke();

  drawHologramBase(ctx, centerX, baseY, radius, tick, "front");

  ctx.save();
  const beam = ctx.createLinearGradient(centerX, centerY + radius * 0.72, centerX, baseY);
  beam.addColorStop(0, "rgba(40, 247, 239, 0.16)");
  beam.addColorStop(1, "rgba(40, 247, 239, 0.02)");
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(centerX - radius * 0.18, centerY + radius * 0.64);
  ctx.lineTo(centerX + radius * 0.18, centerY + radius * 0.64);
  ctx.lineTo(centerX + radius * 0.5, baseY);
  ctx.lineTo(centerX - radius * 0.5, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function ParticleNetwork() {
  const canvasRef = useRef();
  const mouse = useRef({ x: null, y: null });
  const floatingParticles = useRef([]);

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

      if (floatingParticles.current.length === 0) {
        floatingParticles.current = createFloatingParticles(width, height);
      } else {
        floatingParticles.current = floatingParticles.current.map((particle) => ({
          ...particle,
          x: clamp(particle.x, 0, width),
          y: clamp(particle.y, 0, height),
        }));
      }
    }

    function getNodePositions(cluster, index, active) {
      const pulse = Math.sin(tick / 44 + index) * 4;
      const nodeRadius = active ? 64 + pulse : 46 + pulse;

      return cluster.nodes.map((node, nodeIndex) => {
        const angle = (Math.PI * 2 * nodeIndex) / cluster.nodes.length + tick / (active ? 620 : 420);
        return {
          ...node,
          x: cluster.x + Math.cos(angle) * nodeRadius,
          y: cluster.y + Math.sin(angle) * nodeRadius,
        };
      });
    }

    function findFocus(cluster, nodePositions) {
      if (mouse.current.x === null || mouse.current.y === null) {
        return { active: false, focusNode: null, focusPoint: { x: cluster.x, y: cluster.y } };
      }

      const pointer = mouse.current;
      const focusNode = nodePositions.find((node) => distance(pointer, node) < 46) || null;
      const clusterActive = Boolean(focusNode);

      return {
        active: clusterActive,
        focusNode,
        focusPoint: focusNode || { x: cluster.x, y: cluster.y },
      };
    }

    function drawCluster(cluster, index) {
      const initialNodes = getNodePositions(cluster, index, false);
      const initialFocus = findFocus(cluster, initialNodes);
      const nodePositions = getNodePositions(cluster, index, initialFocus.active);
      const { active, focusNode, focusPoint } = findFocus(cluster, nodePositions);

      ctx.strokeStyle = active ? `${cluster.color}70` : `${cluster.color}20`;
      ctx.lineWidth = active ? 1.4 : 0.8;
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
          ctx.strokeStyle = active ? `${cluster.color}34` : `${cluster.color}0f`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(cluster.x, cluster.y, active ? 10 : 6, 0, Math.PI * 2);
      ctx.fillStyle = cluster.color;
      ctx.shadowColor = cluster.color;
      ctx.globalAlpha = active ? 1 : 0.78;
      ctx.shadowBlur = active ? 22 : 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      if (active) {
        drawParticleGroup(ctx, focusPoint, cluster.color, tick, focusNode ? 1.2 : 1);
      }

      nodePositions.forEach((node) => {
        const selected = focusNode?.label === node.label;
        const pointerNear = mouse.current.x !== null && distance(mouse.current, node) < 58;

        ctx.beginPath();
        ctx.arc(node.x, node.y, selected ? 6.6 : pointerNear ? 5.4 : 3.8, 0, Math.PI * 2);
        ctx.fillStyle = selected || pointerNear ? cluster.color : "#8b98a8";
        ctx.globalAlpha = active || pointerNear ? 1 : 0.74;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (selected || pointerNear) {
          ctx.font = "800 11px ui-monospace, SFMono-Regular, Menlo, monospace";
          ctx.fillStyle = "#f8fbff";
          ctx.shadowColor = "rgba(0, 0, 0, 0.42)";
          ctx.shadowBlur = 8;
          ctx.fillText(node.label, node.x + 8, node.y + 4);
          ctx.shadowBlur = 0;
        }
      });

      if (active) {
        drawTerminalCard(ctx, cluster, focusNode, width, height);
      }
    }

    function drawFloatingParticles() {
      for (const [index, particle] of floatingParticles.current.entries()) {
        particle.vx += Math.cos(tick / 86 + particle.phase) * 0.006;
        particle.vy += Math.sin(tick / 74 + particle.phase) * 0.006;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        if (mouse.current.x !== null && mouse.current.y !== null) {
          const dx = particle.x - mouse.current.x;
          const dy = particle.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 0 && dist < MOUSE_PUSH_DISTANCE) {
            const force = (1 - dist / MOUSE_PUSH_DISTANCE) * MOUSE_PUSH_STRENGTH;
            const swirl = index % 2 === 0 ? 1 : -1;
            particle.vx += (dx / dist) * force;
            particle.vy += (dy / dist) * force;
            particle.vx += (-dy / dist) * force * 0.75 * swirl;
            particle.vy += (dx / dist) * force * 0.75 * swirl;
          }
        }

        particle.vx *= 0.992;
        particle.vy *= 0.992;
        particle.vx = clamp(particle.vx, -0.9, 0.9);
        particle.vy = clamp(particle.vy, -0.9, 0.9);
      }

      for (let i = 0; i < floatingParticles.current.length; i += 1) {
        for (let j = i + 1; j < floatingParticles.current.length; j += 1) {
          const a = floatingParticles.current[i];
          const b = floatingParticles.current[j];
          const dist = distance(a, b);

          if (dist < 118) {
            ctx.strokeStyle = `rgba(184, 215, 255, ${0.13 * (1 - dist / 118)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const particle of floatingParticles.current) {
        const twinkle = particle.twinkle + Math.sin(tick / 26 + particle.phase) * 0.18;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = clamp(twinkle, 0.22, 0.92);
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.radius > 1.8 ? 8 : 3;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    function animate() {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(4, 8, 16, 0.04)");
      gradient.addColorStop(0.6, "rgba(8, 13, 24, 0.08)");
      gradient.addColorStop(1, "rgba(3, 7, 14, 0.24)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      drawFloatingParticles();
      drawHologramGlobe(ctx, width, height, tick);
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
