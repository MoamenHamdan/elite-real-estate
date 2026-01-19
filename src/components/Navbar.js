'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [navLinks, setNavLinks] = useState([
        { href: '/', label: 'Home' },
        { href: '/properties', label: 'Properties' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ]);
    const pathname = usePathname();
    const { user, logout, isAdmin } = useAuth();

    // Pages that have a white background and need dark text even when not scrolled
    const isWhiteBgPage = pathname === '/properties' || pathname === '/about' || pathname === '/contact';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);

        const navRef = doc(db, 'content', 'navbar');
        const unsubscribe = onSnapshot(navRef, (snapshot) => {
            if (snapshot.exists() && snapshot.data().links) {
                setNavLinks(snapshot.data().links);
            }
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            unsubscribe();
        };
    }, []);

    const isActive = (path) => pathname === path;

    // Determine text color based on scroll and page background
    const getTextColor = (active = false) => {
        if (active) return 'text-accent';
        if (isScrolled || isWhiteBgPage) return 'text-primary';
        return 'text-white';
    };

    const getIconColor = () => {
        if (isScrolled || isWhiteBgPage) return 'text-primary';
        return 'text-white';
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-500">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`container-custom mx-auto rounded-full transition-all duration-500 ${isScrolled || isWhiteBgPage ? 'glass py-3 px-8' : 'bg-transparent py-4 px-4'
                    }`}
            >
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-serif text-xl font-bold group-hover:rotate-12 transition-transform duration-500">
                            L
                        </div>
                        <h1 className="text-2xl font-bold font-serif tracking-tight">
                            <span className={isScrolled || isWhiteBgPage ? 'text-primary' : 'text-white'}>Lebanon</span>
                            <span className="text-accent"> Buyers</span>
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:text-accent ${getTextColor(isActive(link.href))}`}
                            >
                                {link.label}
                                {isActive(link.href) && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Action Section */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                {isAdmin && (
                                    <Link href="/adminofthepage">
                                        <button className="text-sm font-bold uppercase tracking-widest text-accent hover:underline flex items-center gap-2">
                                            Admin <FiArrowRight />
                                        </button>
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className={`p-2 rounded-full transition-colors ${getIconColor()} hover:bg-accent/10`}
                                >
                                    <FiLogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <button className={`btn-primary !py-3 !px-6 !text-sm tracking-widest uppercase`}>
                                    Client Portal
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`lg:hidden p-2 rounded-full transition-colors ${getIconColor()} hover:bg-accent/10`}
                    >
                        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="absolute top-full left-0 right-0 mt-4 mx-6 glass rounded-[2rem] p-8 lg:hidden"
                        >
                            <div className="flex flex-col space-y-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`text-2xl font-serif font-bold ${isActive(link.href) ? 'text-accent' : 'text-primary'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="pt-6 border-t border-gray-100">
                                    {user ? (
                                        <div className="space-y-4">
                                            {isAdmin && (
                                                <Link href="/adminofthepage" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <button className="btn-primary w-full">Admin Dashboard</button>
                                                </Link>
                                            )}
                                            <button onClick={logout} className="btn-secondary w-full">Logout</button>
                                        </div>
                                    ) : (
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <button className="btn-primary w-full">Login to Portal</button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
}
