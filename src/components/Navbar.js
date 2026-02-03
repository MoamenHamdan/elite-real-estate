'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, ArrowRight, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [navLinks, setNavLinks] = useState([
        { href: '/', label: 'Home' },
        { href: '/properties', label: 'Properties' },
        { href: '/rent', label: 'Rent' },
        { href: '/properties?filter=hot-deals', label: 'Hot Deals' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ]);
    const pathname = usePathname();
    const { user, logout, isAdmin } = useAuth();

    // Pages that have a white background and need dark text even when not scrolled
    const isWhiteBgPage = pathname === '/properties' || pathname === '/rent' || pathname === '/about' || pathname === '/contact' || pathname.includes('hot-deals');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);

        const navRef = doc(db, 'content', 'navbar');
        const unsubscribe = onSnapshot(navRef, (snapshot) => {
            if (snapshot.exists() && snapshot.data().links) {
                // Merge default links with Firestore links if needed, or just use Firestore
                // For now, let's ensure Hot Deals is always there if not in Firestore
                const firestoreLinks = snapshot.data().links;
                const hasHotDeals = firestoreLinks.some(l => l.label === 'Hot Deals');
                if (!hasHotDeals) {
                    setNavLinks([
                        { href: '/', label: 'Home' },
                        { href: '/properties', label: 'Properties' },
                        { href: '/rent', label: 'Rent' },
                        { href: '/properties?filter=hot-deals', label: 'Hot Deals' },
                        ...firestoreLinks.filter(l => l.label !== 'Home' && l.label !== 'Properties' && l.label !== 'Rent')
                    ]);
                } else {
                    setNavLinks(firestoreLinks);
                }
            }
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            unsubscribe();
        };
    }, []);

    const isActive = (path) => {
        if (typeof window === 'undefined') return pathname === path;
        return pathname === path || (path.includes('hot-deals') && pathname === '/properties' && window.location.search.includes('hot-deals'));
    };

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
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <img src="/logo.png" alt="Buyers-lb Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold font-serif tracking-tight leading-none">
                                <span className={isScrolled || isWhiteBgPage ? 'text-primary' : 'text-white'}>Buyers-lb</span>
                            </h1>
                            <span className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase">Real Estate</span>
                        </div>
                    </Link>


                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-accent flex items-center gap-1 ${getTextColor(isActive(link.href))}`}
                            >
                                {link.label} {link.label === 'Hot Deals' && '🔥'}
                                {isActive(link.href) && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute -bottom-2 left-0 w-full h-0.5 bg-accent"
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
                                        <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:underline flex items-center gap-2">
                                            Admin <ArrowRight size={14} />
                                        </button>
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className={`p-2 rounded-full transition-colors ${getIconColor()} hover:bg-accent/10`}
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <button className={`btn-primary !py-3 !px-8 !text-[10px] tracking-[0.2em] uppercase`}>
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
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="absolute top-full left-0 right-0 mt-4 mx-6 glass rounded-[2.5rem] p-10 lg:hidden shadow-2xl"
                        >
                            <div className="flex flex-col space-y-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`text-3xl font-serif font-bold flex items-center gap-2 ${isActive(link.href) ? 'text-accent' : 'text-primary'
                                            }`}
                                    >
                                        {link.label} {link.label === 'Hot Deals' && '🔥'}
                                    </Link>
                                ))}
                                <div className="pt-8 border-t border-gray-100">
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

