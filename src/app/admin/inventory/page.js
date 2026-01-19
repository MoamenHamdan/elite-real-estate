'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiEye, FiSearch, FiPlus, FiAlertCircle } from 'react-icons/fi';
import { ref, onValue, remove, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import Link from 'next/link';

export default function InventoryPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        const propertiesRef = ref(database, 'properties');
        onValue(propertiesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const propertyList = Object.entries(data).map(([id, value]) => ({
                    id,
                    ...value,
                }));
                setProperties(propertyList);
            } else {
                setProperties([]);
            }
            setLoading(false);
        });
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await remove(ref(database, `properties/${deleteId}`));
            setDeleteId(null);
        } catch (err) {
            alert('Failed to delete property: ' + err.message);
        }
    };

    const toggleVisibility = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Acquired' ? 'For Sale' : 'Acquired';
        try {
            await update(ref(database, `properties/${id}`), { status: newStatus });
        } catch (err) {
            alert('Failed to update status: ' + err.message);
        }
    };

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Property Inventory</h1>
                    <p className="text-gray-500">Manage your real estate portfolio and visibility.</p>
                </div>
                <Link href="/admin/add">
                    <button className="btn-primary flex items-center gap-2">
                        <FiPlus /> Add New Property
                    </button>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative">
                <FiSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                    type="text"
                    placeholder="Search inventory by title or location..."
                    className="w-full pl-14 pr-4 py-3 bg-light border-none rounded-xl outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-light border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Property</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Financials</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Performance</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-8"><div className="h-12 bg-gray-100 rounded-xl w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredProperties.length > 0 ? (
                                filteredProperties.map((prop) => (
                                    <tr key={prop.id} className="hover:bg-light/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                                    {prop.images?.[0] && <img src={prop.images[0]} alt="" className="w-full h-full object-cover" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-primary line-clamp-1">{prop.title}</p>
                                                    <p className="text-xs text-gray-400">{prop.location}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-primary">Sell: {formatCurrency(prop.sellingPrice)}</p>
                                            <p className="text-xs text-gray-400">Buy: {formatCurrency(prop.acquisitionPrice)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleVisibility(prop.id, prop.status)}
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${prop.status === 'For Sale' ? 'bg-success/10 text-success' :
                                                        prop.status === 'Sold' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                                                    }`}
                                            >
                                                {prop.status}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-accent">+{formatCurrency(prop.profit)}</p>
                                            <p className="text-xs text-gray-400">{prop.roi}% ROI</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/properties/${prop.id}`}>
                                                    <button className="p-2 hover:bg-accent/10 text-gray-400 hover:text-accent rounded-lg transition-all" title="View Public Page">
                                                        <FiEye />
                                                    </button>
                                                </Link>
                                                <Link href={`/admin/edit/${prop.id}`}>
                                                    <button className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg transition-all" title="Edit Property">
                                                        <FiEdit2 />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(prop.id)}
                                                    className="p-2 hover:bg-error/10 text-gray-400 hover:text-error rounded-lg transition-all"
                                                    title="Delete Property"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-24 text-center">
                                        <p className="text-gray-400">No properties found in inventory.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteId && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
                            onClick={() => setDeleteId(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl p-8 z-[101] shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                                <FiAlertCircle />
                            </div>
                            <h3 className="text-2xl font-bold text-center mb-2">Delete Property?</h3>
                            <p className="text-gray-500 text-center mb-8">
                                This action cannot be undone. All property data and images will be permanently removed.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="flex-1 py-4 bg-light text-primary font-bold rounded-xl hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-4 bg-error text-white font-bold rounded-xl hover:bg-error/90 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
