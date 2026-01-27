'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { TrendingUp, Users, Award, Building2 } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function CountUp({ value, suffix = "+" }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Parse the value (e.g., "250M" -> 250, "1500" -> 1500)
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    const unit = value.replace(/[0-9.]/g, ''); // Extract M, K, etc.

    const motionValue = useSpring(0, {
        damping: 30,
        stiffness: 100,
    });

    const displayValue = useTransform(motionValue, (latest) => {
        if (latest >= 1000 && !unit) {
            return Math.floor(latest).toLocaleString() + suffix;
        }
        return Math.floor(latest) + unit + suffix;
    });

    useEffect(() => {
        if (isInView) {
            motionValue.set(numericValue);
        }
    }, [isInView, numericValue, motionValue]);

    return <motion.span ref={ref}>{displayValue}</motion.span>;
}

const Stats = () => {
    const [statsData, setStatsData] = useState([
        {
            icon: <TrendingUp size={32} />,
            value: "250M",
            label: "Total Property Value",
            description: "Managed and sold across Lebanon"
        },
        {
            icon: <Users size={32} />,
            value: "1500",
            label: "Premium Clients",
            description: "Trusted by investors worldwide"
        },
        {
            icon: <Award size={32} />,
            value: "12",
            label: "Years Excellence",
            description: "Leading the real estate market"
        },
        {
            icon: <Building2 size={32} />,
            value: "450",
            label: "Active Listings",
            description: "Exclusive off-market opportunities"
        }
    ]);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'content', 'homepage'), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                if (data.stats) {
                    setStatsData(prev => data.stats.map((s, i) => ({
                        ...prev[i],
                        ...s
                    })));
                }
            }
        });
        return () => unsub();
    }, []);

    return (
        <section className="relative py-32 overflow-hidden">
            {/* Premium Background */}
            <div className="absolute inset-0 bg-[#0a0f1a]">
                {/* Subtle Gradient Overlays */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(201,169,97,0.05)_0%,transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(201,169,97,0.05)_0%,transparent_50%)]" />

                {/* Architectural Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '100px 100px'
                    }}
                />
            </div>

            <div className="container-custom relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {statsData.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="relative group"
                        >
                            {/* Card Glassmorphism */}
                            <div className="h-full p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm hover:bg-white/[0.04] hover:border-accent/20 transition-all duration-500">
                                {/* Icon with Glow */}
                                <div className="relative w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10">{stat.icon}</div>
                                </div>

                                {/* Counter */}
                                <div className="text-5xl font-serif font-bold text-white mb-3 tracking-tight">
                                    <CountUp value={stat.value} />
                                </div>

                                {/* Label & Description */}
                                <div className="space-y-3">
                                    <h4 className="text-accent font-bold uppercase tracking-[0.2em] text-xs">
                                        {stat.label}
                                    </h4>
                                    <p className="text-gray-500 text-sm leading-relaxed font-light">
                                        {stat.description}
                                    </p>
                                </div>
                            </div>

                            {/* Decorative Corner Element */}
                            <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-accent/0 group-hover:border-accent/30 rounded-tr-[2.5rem] transition-all duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
