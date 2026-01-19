'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ContactPage() {
    const [content, setContent] = useState({
        title: 'Get in Touch',
        subtitle: 'Our investment experts are ready to assist you.',
        email: 'info@lebanonbuyers.com',
        phone: '+961 00 000 000',
        address: 'Beirut, Lebanon'
    });

    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'content', 'contact'), (snap) => {
            if (snap.exists()) {
                setContent(prev => ({ ...prev, ...snap.data() }));
            }
        });
        return () => unsub();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you'd send this to an API or Firestore
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormState({ name: '', email: '', message: '' });
    };

    return (
        <div className="pt-32 pb-24">
            <div className="container-custom">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-accent font-bold tracking-widest uppercase mb-4"
                    >
                        Contact Us
                    </motion.h2>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-8"
                    >
                        {content.title}
                    </motion.h1>
                    <p className="text-xl text-gray-500">{content.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="p-8 bg-white rounded-3xl shadow-luxury border border-gray-50">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center text-2xl">
                                    <FiMail />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Us</p>
                                    <p className="text-lg font-bold text-primary">{content.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center text-2xl">
                                    <FiPhone />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Call Us</p>
                                    <p className="text-lg font-bold text-primary">{content.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center text-2xl">
                                    <FiMapPin />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Visit Us</p>
                                    <p className="text-lg font-bold text-primary">{content.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="p-10 bg-white rounded-3xl shadow-luxury border border-gray-50">
                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
                                        <FiCheckCircle />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">Message Sent!</h3>
                                    <p className="text-gray-500">Thank you for your inquiry. Our team will contact you shortly.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="input-field"
                                                placeholder="John Doe"
                                                value={formState.name}
                                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                className="input-field"
                                                placeholder="john@example.com"
                                                value={formState.email}
                                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Message</label>
                                        <textarea
                                            required
                                            rows="6"
                                            className="input-field"
                                            placeholder="How can we help you?"
                                            value={formState.message}
                                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-3">
                                        <FiSend /> Send Message
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
