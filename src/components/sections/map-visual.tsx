"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Client {
  name: string;
  sector: string;
  location: string;
  // Position relative to the container (%)
  x: number;
  y: number;
  // Pill visual position
  pillPos: string;
  floatDelay: number;
}

const clients: Client[] = [
  {
    name: "Cliente A",
    sector: "Escola de Condu\u00e7\u00e3o",
    location: "Lisboa",
    x: 32,
    y: 65,
    pillPos: "top-[8%] left-[2%]",
    floatDelay: 0,
  },
  {
    name: "Cliente B",
    sector: "Escola de Condu\u00e7\u00e3o",
    location: "Set\u00fabal",
    x: 35,
    y: 72,
    pillPos: "bottom-[18%] left-0",
    floatDelay: 0.5,
  },
  {
    name: "Cliente C",
    sector: "Cooperativa",
    location: "Coimbra",
    x: 38,
    y: 45,
    pillPos: "top-[12%] right-[2%]",
    floatDelay: 1,
  },
  {
    name: "Cliente D",
    sector: "Escola de Condu\u00e7\u00e3o",
    location: "Porto",
    x: 40,
    y: 28,
    pillPos: "bottom-[10%] right-0",
    floatDelay: 1.5,
  },
];

// Floating particle dots around the map
const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: 15 + Math.random() * 70,
  y: 10 + Math.random() * 80,
  size: 1 + Math.random() * 2,
  duration: 3 + Math.random() * 4,
  delay: Math.random() * 3,
}));

export function MapVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredClient, setHoveredClient] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for parallax
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax transforms at different depths
  const mapX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const mapY = useTransform(smoothY, [-1, 1], [-8, 8]);
  const glowX = useTransform(smoothX, [-1, 1], [-15, 15]);
  const glowY = useTransform(smoothY, [-1, 1], [-15, 15]);
  const pillX = useTransform(smoothX, [-1, 1], [-20, 20]);
  const pillY = useTransform(smoothY, [-1, 1], [-20, 20]);
  const particleX = useTransform(smoothX, [-1, 1], [-30, 30]);
  const particleY = useTransform(smoothY, [-1, 1], [-30, 30]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    },
    [isMobile, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredClient(null);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[700px] h-[480px] mx-auto my-10 flex items-center justify-center z-[2] max-md:h-[360px] max-md:my-6 cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      {/* Animated glow — follows mouse */}
      <motion.div
        className="absolute w-[420px] h-[420px] top-1/2 left-1/2 rounded-full pointer-events-none"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary ring glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] top-1/2 left-1/2 rounded-full pointer-events-none border border-blue-500/[0.05]"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400/30 pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            x: particleX,
            y: particleY,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.5, 0.5],
            y: [0, -20, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* Connection lines SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Lines connecting clients */}
        {clients.map((from, i) =>
          clients.slice(i + 1).map((to, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="url(#lineGrad)"
              strokeWidth="0.15"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity:
                  hoveredClient === i || hoveredClient === i + j + 1
                    ? 0.8
                    : 0.2,
              }}
              transition={{ duration: 2, delay: i * 0.3 }}
            />
          ))
        )}

        {/* Animated data pulses along lines */}
        {clients.map((from, i) =>
          clients.slice(i + 1).map((to, j) => (
            <motion.circle
              key={`pulse-${i}-${j}`}
              r="0.4"
              fill="#60a5fa"
              initial={{ opacity: 0 }}
              animate={{
                cx: [from.x, to.x],
                cy: [from.y, to.y],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3 + j,
                repeat: Infinity,
                delay: i * 1.5 + j * 0.8,
                ease: "easeInOut",
              }}
            />
          ))
        )}

        {/* Pin dots on the map */}
        {clients.map((client, i) => (
          <g key={`pin-${i}`}>
            {/* Pulse ring */}
            <motion.circle
              cx={client.x}
              cy={client.y}
              r="1.5"
              fill="none"
              stroke="#34d399"
              strokeWidth="0.2"
              animate={{
                r: [1.5, 3, 1.5],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
            {/* Pin */}
            <motion.circle
              cx={client.x}
              cy={client.y}
              r="0.8"
              fill="#34d399"
              animate={{
                r: hoveredClient === i ? [0.8, 1.2, 0.8] : 0.8,
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </g>
        ))}
      </svg>

      {/* Portugal image — parallax layer */}
      <motion.div
        className="relative z-[2]"
        style={{ x: mapX, y: mapY }}
      >
        <Image
          src="/assets/portugal.avif"
          alt=""
          width={308}
          height={420}
          className="h-[440px] w-auto object-contain drop-shadow-[0_0_60px_rgba(96,165,250,0.15)] opacity-80 max-md:h-[300px]"
          priority
        />
      </motion.div>

      {/* Floating client pills — parallax + interactive */}
      {clients.map((client, i) => (
        <motion.div
          key={i}
          className={`absolute z-[3] ${client.pillPos} max-md:text-[0.7rem] max-md:py-1.5 max-md:px-3`}
          style={{ x: pillX, y: pillY }}
          onMouseEnter={() => setHoveredClient(i)}
          onMouseLeave={() => setHoveredClient(null)}
        >
          <motion.div
            className={`inline-flex items-center gap-2 py-2 px-4 backdrop-blur-[12px] border rounded-full text-[0.78rem] font-semibold whitespace-nowrap cursor-pointer transition-all duration-300 ${
              hoveredClient === i
                ? "bg-[rgba(37,99,235,0.2)] border-flow-accent text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                : "bg-[rgba(17,24,39,0.85)] border-flow-border-light text-flow-white70 hover:border-flow-accent hover:text-white"
            }`}
            animate={{
              y: [0, i % 2 === 0 ? -10 : 8, 0],
              x: [0, i % 2 === 0 ? 0 : 4, 0],
            }}
            transition={{
              duration: 5.5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: client.floatDelay,
            }}
            whileHover={{ scale: 1.08 }}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 ${
                hoveredClient === i
                  ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                  : "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)] animate-pill-dot-pulse"
              }`}
            />
            {client.name}

            {/* Tooltip on hover */}
            {hoveredClient === i && (
              <motion.div
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-[rgba(17,24,39,0.95)] backdrop-blur-md border border-flow-border-light rounded-lg px-3 py-1.5 whitespace-nowrap z-10"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                <span className="text-[0.68rem] text-flow-white40">
                  {client.sector} &middot; {client.location}
                </span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
