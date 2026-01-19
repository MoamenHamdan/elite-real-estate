'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiLinkedin, FiTwitter, FiArrowUpRight } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Footer() {
    const [content, setContent] = useState({
        company: {
            description: "Lebanon Buyers is redefining real estate investment through strategic acquisition and premium renovation. We turn architectural potential into high-yield assets across Lebanon.",
            address: "Beirut, Lebanon",
            phone: "+961 00 000 000",
            email: "info@lebanonbuyers.com"
        },
        socials: [
            { platform: 'Instagram', url: '#', icon: <FiInstagram /> },
            { platform: 'Twitter', url: '#', icon: <FiTwitter /> },
            { platform: 'LinkedIn', url: '#', icon: <FiLinkedin /> },
            { platform: 'Facebook', url: '#', icon: <FiFacebook /> }
        ]
    });

    useEffect(() => {
        const footerRef = doc(db, 'content', 'footer');
        const unsubscribe = onSnapshot(footerRef, (snapshot) => {
            if (snapshot.exists()) {
                setContent(prevContent => ({
                    ...prevContent,
                    ...snapshot.data()
                }));
            }
        });
        return () => unsubscribe();
    }, []);

    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { label: 'About Us', href: '/about' },
            { label: 'Properties', href: '/properties' },
            { label: 'Contact', href: '/contact' },
            { label: 'Investment Philosophy', href: '/about' },
        ],
        legal: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' },
            { label: 'Investor Relations', href: '/login' },
        ],
    };

    return (
        <footer className="bg-primary text-white pt-24 pb-12 overflow-hidden relative">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 translate-x-1/2"></div>

            <div className="container-custom relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-5 space-y-8">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-serif text-2xl font-bold group-hover:rotate-12 transition-transform duration-500">
                                L
                            </div>
                            <h3 className="text-3xl font-serif font-bold tracking-tight">
                                Lebanon <span className="text-accent">Buyers</span>
                            </h3>
                        </Link>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                            {content.company.description}
                        </p>
                        <div className="flex gap-4">
                            {content.socials.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-accent hover:text-white hover:border-accent hover:-translate-y-1 transition-all duration-300"
                                >
                                    {index === 0 ? <FiInstagram size={20} /> : index === 1 ? <FiTwitter size={20} /> : index === 2 ? <FiLinkedin size={20} /> : <FiFacebook size={20} />}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Company</h4>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                                    >
                                        {link.label}
                                        <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Resources</h4>
                        <ul className="space-y-4">
                            {footerLinks.legal.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                                    >
                                        {link.label}
                                        <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="lg:col-span-3 space-y-8">
                        <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Inquiries</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 text-gray-400 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                                    <FiMapPin />
                                </div>
                                <span className="flex-1 text-sm leading-relaxed">{content.company.address}</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                                    <FiPhone />
                                </div>
                                <span className="text-sm font-bold">{content.company.phone}</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                                    <FiMail />
                                </div>
                                <span className="text-sm font-bold">{content.company.email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-sm font-medium">
                        © {currentYear} Lebanon Buyers. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <p className="text-gray-500 text-sm font-medium">
                            Designed with Excellence
                        </p>
                        <div className="h-4 w-px bg-white/10"></div>
                        <p className="text-gray-500 text-sm font-medium">
                            Beirut, Lebanon
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
