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

    const [formState, setFormState] = useState({ name: '', email: '', phone: '', message: '' });
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
        setFormState({ name: '', email: '', phone: '', message: '' });
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
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
                                    <a href={`tel:${content.phone}`} className="text-lg font-bold text-primary hover:text-accent transition-colors">{content.phone}</a>
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
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            className="input-field"
                                            placeholder="+961 70 000 000"
                                            value={formState.phone}
                                            onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                                        />
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

                {/* Google Map */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full h-[500px] rounded-[3rem] overflow-hidden shadow-luxury border border-white"
                >
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106014.10189495115!2d35.43398935406734!3d33.88921101931341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f17215882853f%3A0x7a3b84838c674063!2sBeirut%2C%20Lebanon!5e0!3m2!1sen!2slb!4v1705850000000!5m2!1sen!2slb"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </motion.div>
            </div>
        </div>
    );
}
