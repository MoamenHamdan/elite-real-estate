'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout, isAdmin } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/properties', label: 'Properties' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ];

    const isActive = (path) => pathname === path;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-white shadow-luxury py-4'
                    : 'bg-transparent py-6'
                }`}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 className="text-2xl md:text-3xl font-bold font-serif">
                                <span className={isScrolled ? 'text-primary' : 'text-white'}>
                                    Elite
                                </span>
                                <span className="text-accent"> Estates</span>
                            </h1>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative font-medium transition-colors ${isScrolled
                                        ? isActive(link.href)
                                            ? 'text-accent'
                                            : 'text-primary hover:text-accent'
                                        : isActive(link.href)
                                            ? 'text-accent'
                                            : 'text-white hover:text-accent'
                                    }`}
                            >
                                {link.label}
                                {isActive(link.href) && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                                        initial={false}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </Link>
                        ))}

                        {/* Admin/User Section */}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                {isAdmin && (
                                    <Link href="/admin">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="btn-primary text-sm"
                                        >
                                            Admin Dashboard
                                        </motion.button>
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className={`flex items-center space-x-2 ${isScrolled ? 'text-primary' : 'text-white'
                                        } hover:text-accent transition-colors`}
                                >
                                    <FiLogOut />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${isScrolled
                                            ? 'bg-accent text-white hover:bg-accent-hover'
                                            : 'bg-white text-primary hover:bg-accent hover:text-white'
                                        }`}
                                >
                                    <FiUser />
                                    <span>Login</span>
                                </motion.button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`lg:hidden text-2xl ${isScrolled ? 'text-primary' : 'text-white'
                            }`}
                    >
                        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="lg:hidden mt-6 pb-6 border-t border-gray-200"
                        >
                            <div className="flex flex-col space-y-4 mt-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`text-lg font-medium transition-colors ${isActive(link.href)
                                                ? 'text-accent'
                                                : isScrolled
                                                    ? 'text-primary hover:text-accent'
                                                    : 'text-white hover:text-accent'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {user ? (
                                    <>
                                        {isAdmin && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <button className="w-full btn-primary">
                                                    Admin Dashboard
                                                </button>
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`flex items-center space-x-2 ${isScrolled ? 'text-primary' : 'text-white'
                                                }`}
                                        >
                                            <FiLogOut />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <button className="w-full btn-primary">Login</button>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;
