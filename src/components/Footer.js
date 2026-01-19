'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { label: 'About Us', href: '/about' },
            { label: 'Properties', href: '/properties' },
            { label: 'Contact', href: '/contact' },
        ],
        legal: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' },
        ],
    };

    const socialLinks = [
        { icon: FiFacebook, href: '#', label: 'Facebook' },
        { icon: FiInstagram, href: '#', label: 'Instagram' },
        { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
        { icon: FiTwitter, href: '#', label: 'Twitter' },
    ];

    const contactInfo = [
        { icon: FiMail, text: 'contact@eliteestates.com' },
        { icon: FiPhone, text: '+1 (555) 123-4567' },
        { icon: FiMapPin, text: '123 Luxury Ave, Premium District' },
    ];

    return (
        <footer className="bg-primary text-white">
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <h3 className="text-3xl font-serif font-bold">
                            Elite <span className="text-accent">Estates</span>
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                            Your trusted partner in premium real estate investments.
                            We acquire exceptional properties and offer them at competitive prices.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="text-lg" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-xl font-semibold mb-6">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-accent transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-xl font-semibold mb-6">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-accent transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-xl font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            {contactInfo.map((info, index) => (
                                <li key={index} className="flex items-start space-x-3 text-gray-300">
                                    <info.icon className="text-accent mt-1 flex-shrink-0" />
                                    <span>{info.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} Elite Estates. All rights reserved.
                    </p>
                    <p className="text-gray-400 text-sm">
                        Crafted with excellence for premium real estate
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
