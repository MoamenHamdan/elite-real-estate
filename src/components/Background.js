'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Background() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-[#f8f9fa]">
            {/* Animated Gradient Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/5 blur-[100px]"
            />

            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-navy/5 blur-[120px]"
            />

            {/* Moving "Articles" / Keywords in Background */}
            <div className="absolute inset-0 opacity-[0.02] select-none">
                <div className="absolute top-[15%] left-0 w-full overflow-hidden whitespace-nowrap">
                    <motion.div
                        animate={{ x: [0, -1000] }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="text-[10vh] font-serif font-bold uppercase tracking-[0.5em]"
                    >
                        Luxury Real Estate • Premium Assets • Strategic Investment • Exclusive Acquisitions • High-Yield Portfolio •
                    </motion.div>
                </div>
                <div className="absolute top-[60%] left-0 w-full overflow-hidden whitespace-nowrap">
                    <motion.div
                        animate={{ x: [-1000, 0] }}
                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        className="text-[12vh] font-serif font-bold uppercase tracking-[0.5em] text-accent"
                    >
                        Architectural Excellence • Modern Living • Beirut • Lebanon • Buyers-lb • Elite Properties •
                    </motion.div>
                </div>
            </div>

            <motion.div
                animate={{
                    x: mousePosition.x * 0.05,
                    y: mousePosition.y * 0.05,
                }}
                className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-accent/3 blur-[90px]"
            />

            {/* Subtle Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />
        </div>
    );
}
