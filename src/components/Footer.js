'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowUpRight, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Footer() {
    const [content, setContent] = useState({
        company: {
            description: "Buyers-lb is redefining real estate investment through strategic acquisition and premium renovation. We turn architectural potential into high-yield assets across Lebanon.",
            address: "Beirut, Lebanon",
            phone: "+961 00 000 000",
            email: "info@buyers-lb.com"
        },
        socials: [
            { platform: 'Instagram', url: '#', icon: <Instagram /> },
            { platform: 'Twitter', url: '#', icon: <Twitter /> },
            { platform: 'LinkedIn', url: '#', icon: <Linkedin /> },
            { platform: 'Facebook', url: '#', icon: <Facebook /> }
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
        <footer className="bg-primary text-white pt-32 pb-12 overflow-hidden relative">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 translate-x-1/2"></div>

            <div className="container-custom relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-24">
                    {/* Brand Section */}
                    <div className="lg:col-span-5 space-y-10">
                        <Link href="/" className="flex items-center space-x-4 group">
                            <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform duration-500">
                                <Building2 size={28} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-serif font-bold tracking-tight leading-none">Buyers-lb</h3>
                                <span className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase">Real Estate</span>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-md font-light">
                            {content.company.description}
                        </p>
                        <div className="flex gap-4">
                            {content.socials.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-accent hover:text-white hover:border-accent hover:-translate-y-1 transition-all duration-500"
                                >
                                    {index === 0 ? <Instagram size={20} /> : index === 1 ? <Twitter size={20} /> : index === 2 ? <Linkedin size={20} /> : <Facebook size={20} />}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Company</h4>
                        <ul className="space-y-5">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group text-sm font-medium"
                                    >
                                        {link.label}
                                        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Resources</h4>
                        <ul className="space-y-5">
                            {footerLinks.legal.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group text-sm font-medium"
                                    >
                                        {link.label}
                                        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="lg:col-span-3 space-y-8">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Inquiries</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 text-gray-400 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 flex-shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <span className="flex-1 text-sm leading-relaxed font-light">{content.company.address}</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 flex-shrink-0">
                                    <Phone size={18} />
                                </div>
                                <span className="text-sm font-bold">{content.company.phone}</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 flex-shrink-0">
                                    <Mail size={18} />
                                </div>
                                <span className="text-sm font-bold">{content.company.email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">
                        © {currentYear} Buyers-lb. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">
                            Designed with Excellence
                        </p>
                        <div className="h-4 w-px bg-white/10"></div>
                        <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">
                            Beirut, Lebanon
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
