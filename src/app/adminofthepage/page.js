'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiDollarSign, FiTrendingUp, FiCheckCircle, FiClock, FiActivity } from 'react-icons/fi';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProperties: 0,
        activeListings: 0,
        soldProperties: 0,
        totalInvestment: 0,
        totalRevenue: 0,
        totalProfit: 0,
        avgROI: 0,
    });
    const [recentProperties, setRecentProperties] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const propertyList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || new Date(),
            }));

            const total = propertyList.length;
            const active = propertyList.filter(p => p.status === 'For Sale').length;
            const sold = propertyList.filter(p => p.status === 'Sold').length;

            const investment = propertyList.reduce((acc, p) => acc + (Number(p.acquisitionPrice) || 0), 0);
            const revenue = propertyList.filter(p => p.status === 'Sold').reduce((acc, p) => acc + (Number(p.sellingPrice) || 0), 0);
            const profit = propertyList.filter(p => p.status === 'Sold').reduce((acc, p) => acc + (Number(p.sellingPrice) - Number(p.acquisitionPrice) || 0), 0);

            const soldProps = propertyList.filter(p => p.status === 'Sold');
            const avgROI = soldProps.length > 0
                ? (soldProps.reduce((acc, p) => acc + ((Number(p.sellingPrice) - Number(p.acquisitionPrice)) / Number(p.acquisitionPrice) * 100), 0) / soldProps.length)
                : 0;

            setStats({
                totalProperties: total,
                activeListings: active,
                soldProperties: sold,
                totalInvestment: investment,
                totalRevenue: revenue,
                totalProfit: profit,
                avgROI: avgROI,
            });

            setRecentProperties(propertyList.slice(0, 5));
        });
        return () => unsubscribe();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const kpis = [
        { label: 'Total Portfolio', value: stats.totalProperties, icon: FiHome, color: 'bg-blue-500' },
        { label: 'Active Listings', value: stats.activeListings, icon: FiActivity, color: 'bg-green-500' },
        { label: 'Properties Sold', value: stats.soldProperties, icon: FiCheckCircle, color: 'bg-purple-500' },
        { label: 'Total Profit', value: formatCurrency(stats.totalProfit), icon: FiDollarSign, color: 'bg-accent' },
        { label: 'Average ROI', value: `${stats.avgROI.toFixed(1)}%`, icon: FiTrendingUp, color: 'bg-orange-500' },
        { label: 'Total Investment', value: formatCurrency(stats.totalInvestment), icon: FiClock, color: 'bg-gray-500' },
    ];

    return (
        <div className="space-y-8">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpis.map((kpi, index) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6"
                    >
                        <div className={`w-14 h-14 ${kpi.color} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                            <kpi.icon />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{kpi.label}</p>
                            <p className="text-2xl font-bold text-primary">{kpi.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-primary">Recent Acquisitions</h3>
                        <Link href="/adminofthepage/inventory" className="text-accent text-sm font-bold hover:underline">View All</Link>
                    </div>
                    <div className="space-y-6">
                        {recentProperties.length > 0 ? recentProperties.map((prop) => (
                            <div key={prop.id} className="flex items-center justify-between p-4 bg-light rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                        {prop.images?.[0] && (
                                            <img src={prop.images[0]} alt="" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary line-clamp-1">{prop.title}</p>
                                        <p className="text-xs text-gray-400">{prop.location}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-accent">{formatCurrency(prop.sellingPrice)}</p>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${prop.status === 'For Sale' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                                        }`}>
                                        {prop.status}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-400 py-12">No properties in inventory yet.</p>
                        )}
                    </div>
                </div>

                {/* Investment Performance Chart Placeholder */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                    <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                        <FiTrendingUp className="text-4xl text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">Investment Performance</h3>
                    <p className="text-gray-500 max-w-xs">
                        Detailed analytics and ROI projections will appear here as you add more properties to your portfolio.
                    </p>
                    <div className="mt-8 w-full h-48 bg-light rounded-xl flex items-end justify-around p-4 gap-2">
                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.1, duration: 1 }}
                                className="w-full bg-accent/20 rounded-t-lg hover:bg-accent transition-colors cursor-pointer"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
