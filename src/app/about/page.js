'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiAward, FiUsers, FiShield } from 'react-icons/fi';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AboutPage() {
    const [content, setContent] = useState({
        title: 'Our Story',
        subtitle: 'Excellence in Real Estate Investment',
        description: 'Lebanon Buyers was founded on the principle that real estate is more than just property—it is a vehicle for wealth creation and architectural preservation. We specialize in identifying undervalued assets in prime locations across Lebanon, transforming them through premium renovation, and offering them to discerning investors.',
        stats: [
            { label: 'Years Experience', value: '15+', icon: <FiAward /> },
            { label: 'Properties Sold', value: '500+', icon: <FiTrendingUp /> },
            { label: 'Happy Investors', value: '200+', icon: <FiUsers /> },
            { label: 'Security Guaranteed', value: '100%', icon: <FiShield /> }
        ]
    });

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'content', 'about'), (snap) => {
            if (snap.exists()) {
                setContent(prev => ({ ...prev, ...snap.data() }));
            }
        });
        return () => unsub();
    }, []);

    return (
        <div className="pt-32 pb-24">
            <div className="container-custom">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-accent font-bold tracking-widest uppercase mb-4"
                    >
                        {content.subtitle}
                    </motion.h2>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-8"
                    >
                        {content.title}
                    </motion.h1>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <p className="text-xl text-gray-600 leading-relaxed">
                            {content.description}
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            {content.stats.map((stat, index) => (
                                <div key={index} className="p-6 bg-white rounded-2xl shadow-luxury">
                                    <div className="text-accent text-3xl mb-4">{stat.icon}</div>
                                    <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                            alt="Elite Real Estate Office"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
