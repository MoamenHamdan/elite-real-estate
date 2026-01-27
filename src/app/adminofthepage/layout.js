'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiPlus, FiGrid, FiTrendingUp, FiSettings, FiLogOut, FiHome, FiDollarSign, FiPieChart, FiList, FiUsers } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminLayout({ children }) {
    const { user, isAdmin, loading, logout } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.push('/login');
        }
    }, [user, isAdmin, loading, router]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-light">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user || !isAdmin) return null;

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FiPieChart, href: '/adminofthepage' },
        { id: 'inventory', label: 'Inventory', icon: FiList, href: '/adminofthepage/inventory' },
        { id: 'add', label: 'Add Property', icon: FiPlus, href: '/adminofthepage/add' },
        { id: 'team', label: 'Manage Team', icon: FiUsers, href: '/adminofthepage/team' },
        { id: 'settings', label: 'Platform Settings', icon: FiSettings, href: '/adminofthepage/settings' },
    ];

    return (
        <div className="min-h-screen bg-light flex">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-primary text-white flex flex-col fixed h-full z-50"
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen && (
                        <h1 className="text-xl font-bold font-serif">
                            Lebanon <span className="text-accent">Buyers</span>
                        </h1>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                        {isSidebarOpen ? '←' : '→'}
                    </button>
                </div>

                <nav className="flex-grow mt-8 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link key={item.label} href={item.href}>
                            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-all cursor-pointer group">
                                <item.icon className="text-xl text-accent" />
                                {isSidebarOpen && (
                                    <span className="font-medium group-hover:translate-x-1 transition-transform">
                                        {item.label}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-error/20 text-error transition-all"
                    >
                        <FiLogOut className="text-xl" />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main
                className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'
                    }`}
            >
                <header className="bg-white shadow-sm p-6 flex justify-between items-center sticky top-0 z-40">
                    <h2 className="text-xl font-bold text-primary">Admin Control Panel</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-primary">{user.email}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Super Admin</p>
                        </div>
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                            {user.email[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
