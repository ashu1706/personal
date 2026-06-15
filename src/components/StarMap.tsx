import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MapPin, Calendar, Clock, Compass, ZoomIn, ZoomOut, RotateCcw, Heart, Sparkles, Volume2 } from 'lucide-react';

interface ConstellationStar {
  x: number;
  y: number;
  size: number;
  name?: string;
  isDestinyStar?: boolean;
}

interface Constellation {
  name: string;
  stars: ConstellationStar[];
  connections: [number, number][]; // pairs of indices to connect
  description: string;
}

const CONSTELLATIONS: Constellation[] = [
  {
    name: 'Ursa Major (The Great Bear)',
    description: 'Guiding travelers to the North Star, symbolizing our steady direction together.',
    stars: [
      { x: 100, y: 150, size: 2.2 },
      { x: 140, y: 160, size: 1.8 },
      { x: 180, y: 180, size: 2.0 },
      { x: 210, y: 220, size: 1.9 },
      { x: 230, y: 270, size: 2.5 },
      { x: 180, y: 310, size: 3.0, name: 'Merak (Loyalty)' },
      { x: 130, y: 290, size: 2.8, name: 'Dubhe (Devotion)' }
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 4]]
  },
  {
    name: 'Cygnus (The Swan / Eternity)',
    description: 'The swan represents grace, beauty, and lifelong monogamy. Representing our eternal romance.',
    stars: [
      { x: 400, y: 100, size: 3.2, name: 'Deneb (Eternal Spark)', isDestinyStar: true },
      { x: 450, y: 150, size: 2.0 },
      { x: 480, y: 180, size: 1.8 },
      { x: 520, y: 220, size: 2.2, name: 'Albireo (Harmony)' },
      { x: 420, y: 170, size: 2.0 },
      { x: 380, y: 190, size: 1.8 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5]]
  },
  {
    name: 'Cassiopeia (The Queen of Hearts)',
    description: 'M-shaped constellation representing the high crowns of our commitment and shared royalty.',
    stars: [
      { x: 650, y: 120, size: 2.2 },
      { x: 680, y: 90, size: 2.5, name: 'Schedar (Commitment)' },
      { x: 720, y: 130, size: 2.0 },
      { x: 760, y: 80, size: 2.4 },
      { x: 800, y: 140, size: 1.8 }
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4]]
  },
  {
    name: 'Orion (The Loving Hunter)',
    description: 'The standard belt pointing straight into a galaxy of hearts.',
    stars: [
      { x: 250, y: 400, size: 3.0, name: 'Betelgeuse (Warmth)' },
      { x: 350, y: 430, size: 2.5 },
      { x: 280, y: 470, size: 2.8, name: 'Alnitak (Strength)' },
      { x: 300, y: 475, size: 2.8, name: 'Alnilam (Beauty)' },
      { x: 320, y: 480, size: 2.8, name: 'Mintaka (Soulmate)' },
      { x: 260, y: 550, size: 2.2 },
      { x: 340, y: 560, size: 3.2, name: 'Rigel (Radiance)' }
    ],
    connections: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]]
  }
];

interface StarMapProps {
  onPlayRequest?: () => void;
}

export default function StarMap({ onPlayRequest }: StarMapProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Custom Zoom and Drag state
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredStar, setHoveredStar] = useState<{ name: string; desc: string } | null>(null);
  
  // Relive State
  const [isReliving, setIsReliving] = useState(false);
  const [reliveStep, setReliveStep] = useState(0);

  // Dynamic meeting details
const MET_DATE = 'June 16, 2025';
const MET_TIME = '08:00 PM';
const MET_LOCATION = 'Golf Course Road, Sector 54, Gurugram';
  
  const calculateDaysSince = (dateStr: string) => {
    const met = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - met.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysSince = calculateDaysSince(MET_DATE);

  // Shooting star simulations
  interface ShootingStar {
    x: number;
    y: number;
    length: number;
    speed: number;
    opacity: number;
    active: boolean;
  }
  const shootingStarRef = useRef<ShootingStar>({ x: 0, y: 0, length: 0, speed: 0, opacity: 0, active: false });

  // Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let twinkleOffset = 0;

    const drawSky = () => {
      // Clear with dark navy romantic cosmic gradient look
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        20,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      gradient.addColorStop(0, '#0f172a'); // slate-900
      gradient.addColorStop(0.5, '#0a0f1d'); 
      gradient.addColorStop(1, '#020617'); // slate-950
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save state for zoom and translate
      ctx.save();
      ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
      ctx.scale(zoom, zoom);
      // Center constellation coordinates to origin
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Draw background ambient starfield (twinkling)
      twinkleOffset += 0.05;
      for (let i = 0; i < 250; i++) {
        const sx = (Math.sin(i * 123.4) * 0.5 + 0.5) * canvas.width;
        const sy = (Math.cos(i * 456.7) * 0.5 + 0.5) * canvas.height;
        const size = (Math.sin(i * 789.0) * 0.5 + 0.5) * 1.5 + 0.5;
        const twinkle = Math.sin(twinkleOffset + i) * 0.4 + 0.6;
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.85})`;
        ctx.fillRect(sx, sy, size, size);
      }

      // Draw shooting star
      const ss = shootingStarRef.current;
      if (ss.active) {
        ctx.strokeStyle = `rgba(212, 175, 55, ${ss.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x + ss.length, ss.y + ss.length * 0.8);
        ctx.stroke();

        // Update shooting star
        ss.x += ss.speed;
        ss.y += ss.speed * 0.8;
        ss.opacity -= 0.015;
        if (ss.opacity <= 0) {
          ss.active = false;
        }
      } else {
        // Chance to spawn a new shooting star
        if (Math.random() < 0.008) {
          shootingStarRef.current = {
            x: Math.random() * (canvas.width * 0.7),
            y: Math.random() * (canvas.height * 0.4),
            length: Math.random() * 80 + 40,
            speed: Math.random() * 4 + 3,
            opacity: 1,
            active: true
          };
        }
      }

      // Draw Constellations
      CONSTELLATIONS.forEach((c) => {
        // Draw connection lines
        ctx.strokeStyle = 'rgba(248, 200, 220, 0.25)';
        ctx.lineWidth = 1;
        c.connections.forEach(([sIndex, eIndex]) => {
          const sStar = c.stars[sIndex];
          const eStar = c.stars[eIndex];
          ctx.beginPath();
          ctx.moveTo(sStar.x, sStar.y);
          ctx.lineTo(eStar.x, eStar.y);
          ctx.stroke();
        });

        // Draw Stars
        c.stars.forEach((s) => {
          const pulsate = Math.sin(twinkleOffset * 1.5 + s.x) * 0.3 + 0.7;
          
          if (s.isDestinyStar) {
            // Draw stunning golden glowing destiny star
            const gradGlow = ctx.createRadialGradient(s.x, s.y, 1, s.x, s.y, 15);
            gradGlow.addColorStop(0, 'rgba(212, 175, 55, 1)');
            gradGlow.addColorStop(0.3, 'rgba(212, 175, 55, 0.4)');
            gradGlow.addColorStop(1, 'rgba(212, 175, 55, 0)');
            ctx.fillStyle = gradGlow;
            ctx.beginPath();
            ctx.arc(s.x, s.y, 15, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#D4AF37';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Label Destiny Star
            ctx.fillStyle = '#D4AF37';
            ctx.font = '500 11px Poppins, sans-serif';
            ctx.fillText('⭐ Destiny Star (Deneb)', s.x + 10, s.y + 4);
          } else {
            // Regular constellation star
            ctx.fillStyle = `rgba(255, 249, 251, ${pulsate})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();

            if (s.name) {
              ctx.fillStyle = 'rgba(248, 200, 220, 0.85)';
              ctx.font = '400 9px Poppins, sans-serif';
              ctx.fillText(s.name, s.x + 8, s.y + 3);
            }
          }
        });

        // Label constellation names
        if (c.stars.length > 0) {
          const midStar = c.stars[Math.floor(c.stars.length / 2)];
          ctx.fillStyle = 'rgba(212, 175, 55, 0.55)';
          ctx.font = 'italic 500 11px "Playfair Display", Georgia, serif';
          ctx.fillText(c.name, midStar.x, midStar.y - 15);
        }
      });

      ctx.restore();
      animId = requestAnimationFrame(drawSky);
    };

    drawSky();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [zoom, offsetX, offsetY]);

  // Touch and Drag actions
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) {
      // Handle hovering to detect constellations/stars
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left - rect.width / 2 - offsetX) / zoom + rect.width / 2;
      const y = (e.clientY - rect.top - rect.height / 2 - offsetY) / zoom + rect.height / 2;

      let found: { name: string; desc: string } | null = null;
      CONSTELLATIONS.forEach((c) => {
        c.stars.forEach((s) => {
          const dist = Math.hypot(s.x - x, s.y - y);
          if (dist < 15 && s.name) {
            found = { name: s.name, desc: c.description };
          }
        });
      });
      setHoveredStar(found);
      return;
    }
    setOffsetX(e.clientX - dragStart.x);
    setOffsetY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetSky = () => {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));

  const startRelive = () => {
    setIsReliving(true);
    setReliveStep(1);
    if (onPlayRequest) {
      onPlayRequest();
    }
    // Slowly increment steps for animated experience
    setTimeout(() => {
      setReliveStep(2);
    }, 2800);
    setTimeout(() => {
      setReliveStep(3);
    }, 5600);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Intro Heading */}
      <div className="text-center mb-8">
        <h2 className="font-display font-semibold text-3xl md:text-4xl text-wine dark:text-rose-pink flex items-center justify-center gap-2 mb-2">
          Sky On The Day<Sparkles className="w-5 h-5 text-champagne animate-pulse" />
        </h2>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-300 max-w-xl mx-auto">
          Beneath these stars, we celebrate another beautiful chapter of our love story.
        </p>
      </div>

      {/* Map Container */}
      <div className="relative w-full max-w-4xl bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-champagne/30 p-1 md:p-3">
        {/* Navigation / Toolbar */}
        <div className="absolute top-4 left-4 z-30 flex gap-2">
          <button
            onClick={zoomIn}
            className="p-2 py-2 rounded-lg bg-slate-900/80 border border-champagne/20 text-champagne hover:bg-slate-800 hover:scale-105 active:scale-95 duration-200"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            className="p-2 py-2 rounded-lg bg-slate-900/80 border border-champagne/20 text-champagne hover:bg-slate-800 hover:scale-105 active:scale-95 duration-200"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetSky}
            className="p-2 py-2 rounded-lg bg-slate-900/80 border border-champagne/20 text-champagne hover:bg-slate-800 hover:scale-105 active:scale-95 duration-200"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Tooltip on Hover */}
        {hoveredStar && (
          <div className="absolute top-4 right-4 z-30 bg-slate-900/90 border border-rose-pink/30 p-2 px-3 rounded-lg text-xs text-soft-white max-w-xs transition-opacity duration-300">
            <div className="font-semibold text-champagne flex items-center gap-1.5 mb-1">
              <Heart className="w-3.5 h-3.5 fill-current" /> {hoveredStar.name}
            </div>
            <p className="text-[11px] text-gray-300">{hoveredStar.desc}</p>
          </div>
        )}

        {/* The Live Interactive Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`w-full aspect-[8/5] block object-cover rounded-2xl cursor-grab active:cursor-grabbing transition-opacity duration-700 ${isReliving && reliveStep === 1 ? 'opacity-30' : 'opacity-100'}`}
        />

        {/* Relive Night Overlay */}
        <AnimatePresence>
          {isReliving && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="max-w-md space-y-4">
                {reliveStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.05, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-3"
                  >
                    <div className="flex justify-center">
                      <Sparkles className="w-12 h-12 text-champagne animate-spin-slow" />
                    </div>
                    <h4 className="font-display text-2xl font-semibold text-rose-pink italic">" Observatory Hill, 08:45 PM "</h4>
                    <p className="text-sm text-gray-300 leading-relaxed font-sans">
                      The autumn air was crisp, and the stars glowed like ancient diamonds. Little did we know, our destiny was about to unfold with a single gaze...
                    </p>
                  </motion.div>
                )}

                {reliveStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.05, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-3"
                  >
                    <div className="flex justify-center">
                      <Heart className="w-12 h-12 text-rose-pink animate-pulse" />
                    </div>
                    <h4 className="font-display text-2xl font-semibold text-champagne">The Star that Aligned is You</h4>
                    <p className="text-sm text-gray-300 leading-relaxed font-sans mt-2">
                      When I heard your gentle laugh, all the constellations seemed to dim in comparison to your warmth. That night, Deneb shone directly over our path.
                    </p>
                  </motion.div>
                )}

                {reliveStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-4"
                  >
                    <p className="text-base text-rose-pink font-handwritten italic leading-relaxed">
                      "I love you since that night, and with every milestone, our stars only align closer. Happy Anniversary, light of my path."
                    </p>
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => setIsReliving(false)}
                        className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full bg-champagne text-slate-950 font-sans hover:shadow-lg transition active:scale-95"
                      >
                        Return to Sky Map
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial Trigger Banner Overlay */}
        {!isReliving && (
          <div className="absolute bottom-4 right-4 z-30">
            <button
              onClick={startRelive}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-pink to-champagne hover:shadow-lg hover:scale-105 active:scale-95 duration-200 text-charcoal font-semibold text-xs border border-white/20 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" /> Relive That Night
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
