'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiAward, FiUsers, FiShield, FiArrowRight, FiExternalLink, FiMail, FiPhone, FiCheckCircle } from 'react-icons/fi';
import { doc, onSnapshot, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import ChromaGrid from '@/components/ChromaGrid';

export default function AboutPage() {
    const [content, setContent] = useState({
        title: 'Our Story',
        subtitle: 'Excellence in Real Estate Investment',
        description: 'Buyers-lb was founded on the principle that real estate is more than just property—it is a vehicle for wealth creation and architectural preservation. We specialize in identifying undervalued assets in prime locations across Lebanon, transforming them through premium renovation, and offering them to discerning investors.',
        stats: [
            { label: 'Years Experience', value: '15+', icon: <FiAward /> },
            { label: 'Properties Sold', value: '500+', icon: <FiTrendingUp /> },
            { label: 'Happy Investors', value: '200+', icon: <FiUsers /> },
            { label: 'Security Guaranteed', value: '100%', icon: <FiShield /> }
        ]
    });

    const [team, setTeam] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'content', 'about'), (snap) => {
            if (snap.exists()) {
                setContent(prev => ({ ...prev, ...snap.data() }));
            }
        });

        const unsubTeam = onSnapshot(collection(db, 'team'), (snap) => {
            const teamList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTeam(teamList);
        });

        return () => {
            unsub();
            unsubTeam();
        };
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

                {/* Team Section */}
                {team.length > 0 && (
                    <div className="mt-32">
                        <div className="text-center mb-20">
                            <h2 className="text-accent font-bold tracking-widest uppercase mb-4">Our Team</h2>
                            <h3 className="text-4xl md:text-6xl font-bold text-primary mb-6">The Minds Behind Buyers-lb</h3>
                            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-light">
                                Our team of dedicated professionals combines decades of experience in Lebanese real estate, architecture, and investment strategy.
                            </p>
                        </div>

                        <div style={{ minHeight: '800px', position: 'relative' }}>
                            <ChromaGrid
                                items={team.map(member => ({
                                    image: member.photo,
                                    title: member.name,
                                    subtitle: member.position,
                                    handle: member.email ? `@${member.email.split('@')[0]}` : '',
                                    borderColor: "#c9a961",
                                    gradient: "linear-gradient(145deg, #c9a961, #0f172a)",
                                    url: member.portfolio || '#'
                                }))}
                                radius={350}
                                damping={0.45}
                                fadeOut={0.6}
                                ease="power3.out"
                            />
                        </div>
                    </div>
                )}

                {/* Feedback Form Section */}
                <div className="mt-32 max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-accent font-bold tracking-widest uppercase mb-4">Client Feedback</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-primary">Share Your Experience</h3>
                        <p className="text-gray-500 mt-4">Your feedback helps us maintain our elite standards.</p>
                    </div>

                    <FeedbackForm />
                </div>
            </div>
        </div>
    );
}

function FeedbackForm() {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        content: '',
        rating: 5
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'feedback'), {
                ...formData,
                createdAt: serverTimestamp(),
                approved: true
            });
            setSubmitted(true);
        } catch (error) {
            console.error("Error adding feedback: ", error);
            alert("Failed to submit feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-success/10 border border-success/20 p-12 rounded-[2.5rem] text-center"
            >
                <div className="w-20 h-20 bg-success text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle size={40} />
                </div>
                <h4 className="text-2xl font-bold text-primary mb-2">Thank You!</h4>
                <p className="text-gray-600">Your feedback has been submitted successfully and will appear on our homepage.</p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-accent font-bold hover:underline"
                >
                    Submit another review
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-10 md:p-16 rounded-[3rem] shadow-luxury border border-gray-50 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Full Name</label>
                    <input
                        type="text"
                        required
                        className="input-field"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Role / Position</label>
                    <input
                        type="text"
                        required
                        className="input-field"
                        placeholder="e.g. Property Owner"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Your Review</label>
                <textarea
                    required
                    className="input-field min-h-[150px] py-6"
                    placeholder="Tell us about your experience with Buyers-lb..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rating</span>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setFormData({ ...formData, rating: star })}
                                className={`text-2xl transition-colors ${star <= formData.rating ? 'text-accent' : 'text-gray-200'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary !px-12 w-full md:w-auto"
                >
                    {loading ? "Submitting..." : "Submit Feedback"}
                </button>
            </div>
        </form>
    );
}

