'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiGrid, FiList } from 'react-icons/fi';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PropertyCard from '@/components/PropertyCard';

export default function PropertiesPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        type: 'All',
        location: 'All',
        priceRange: 'All',
        minSize: '',
        minBedrooms: 'All',
    });
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        const q = query(
            collection(db, 'properties'),
            where('status', 'in', ['For Sale', 'Sold']),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const propertyList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProperties(propertyList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filterOptions = useMemo(() => {
        const types = ['All', ...new Set(properties.map(p => p.type))];
        const locations = ['All', ...new Set(properties.map(p => p.location))];
        return { types, locations };
    }, [properties]);

    const filteredProperties = useMemo(() => {
        return properties.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = filters.type === 'All' || p.type === filters.type;
            const matchesLocation = filters.location === 'All' || p.location === filters.location;
            const matchesBedrooms = filters.minBedrooms === 'All' || Number(p.bedrooms) >= Number(filters.minBedrooms);
            const matchesSize = !filters.minSize || Number(p.size) >= Number(filters.minSize);

            let matchesPrice = true;
            if (filters.priceRange !== 'All') {
                const price = Number(p.sellingPrice);
                if (filters.priceRange === 'Under 1M') matchesPrice = price < 1000000;
                else if (filters.priceRange === '1M - 5M') matchesPrice = price >= 1000000 && price <= 5000000;
                else if (filters.priceRange === 'Over 5M') matchesPrice = price > 5000000;
            }

            return matchesSearch && matchesType && matchesLocation && matchesBedrooms && matchesSize && matchesPrice;
        });
    }, [properties, searchQuery, filters]);

    return (
        <div className="pt-40 pb-24 bg-light min-h-screen">
            <div className="container-custom">
                {/* Header */}
                <div className="max-w-4xl mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-accent font-bold tracking-[0.3em] uppercase mb-4 block"
                    >
                        Exclusive Inventory
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif font-bold mb-6"
                    >
                        Curated <span className="text-accent">Investments</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-500 leading-relaxed"
                    >
                        Explore our elite portfolio of high-yield real estate assets, meticulously selected for their architectural excellence and strategic potential.
                    </motion.p>
                </div>

                {/* Search & Filter Bar */}
                <div className="mb-16">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Search Input */}
                        <div className="flex-grow relative group">
                            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by title, location, or features..."
                                className="w-full pl-16 pr-6 py-6 bg-white rounded-[2rem] shadow-luxury border border-transparent focus:border-accent/20 outline-none transition-all text-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Desktop Filters */}
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="flex bg-white p-2 rounded-full shadow-luxury border border-gray-50">
                                {['All', 'Under 1M', '1M - 5M', 'Over 5M'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setFilters({ ...filters, priceRange: range })}
                                        className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${filters.priceRange === range
                                                ? 'bg-primary text-white shadow-lg'
                                                : 'text-gray-400 hover:text-primary'
                                            }`}
                                    >
                                        {range === 'All' ? 'Any Price' : range}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowMobileFilters(true)}
                                className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-full font-bold hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
                            >
                                <FiFilter /> Advanced Filters
                            </button>
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="lg:hidden flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-2xl font-bold"
                        >
                            <FiFilter /> Filters
                        </button>
                    </div>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[600px] rounded-[2rem] bg-white animate-pulse border border-gray-100"></div>
                        ))}
                    </div>
                ) : filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence mode="popLayout">
                            {filteredProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 bg-white rounded-[3rem] shadow-luxury border border-gray-50"
                    >
                        <div className="w-24 h-24 bg-light rounded-full flex items-center justify-center text-gray-300 text-5xl mx-auto mb-8">
                            <FiSearch />
                        </div>
                        <h3 className="text-3xl font-serif font-bold mb-4">No matching investments</h3>
                        <p className="text-xl text-gray-500 mb-12 max-w-md mx-auto">Try adjusting your criteria to discover other premium opportunities in our portfolio.</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setFilters({
                                    type: 'All',
                                    location: 'All',
                                    priceRange: 'All',
                                    minSize: '',
                                    minBedrooms: 'All',
                                });
                            }}
                            className="btn-primary !px-12"
                        >
                            Reset All Filters
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Mobile Filters Sidebar */}
            <AnimatePresence>
                {showMobileFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileFilters(false)}
                            className="fixed inset-0 bg-primary/40 z-[60] backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white z-[70] p-12 overflow-y-auto rounded-l-[3rem] shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-16">
                                <h2 className="text-4xl font-serif font-bold">Refine <span className="text-accent">Search</span></h2>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="w-12 h-12 flex items-center justify-center bg-light rounded-full hover:bg-gray-200 transition-all"
                                >
                                    <FiX className="text-2xl" />
                                </button>
                            </div>

                            <div className="space-y-12">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Property Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {filterOptions.types.map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setFilters({ ...filters, type: t })}
                                                className={`px-6 py-4 rounded-2xl text-sm font-bold transition-all ${filters.type === t
                                                    ? 'bg-primary text-white shadow-xl'
                                                    : 'bg-light text-primary hover:bg-gray-200'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Location</label>
                                    <select
                                        className="input-field !bg-light !border-transparent"
                                        value={filters.location}
                                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    >
                                        {filterOptions.locations.map(l => (
                                            <option key={l} value={l}>{l}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Price Range</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['All', 'Under 1M', '1M - 5M', 'Over 5M'].map(range => (
                                            <button
                                                key={range}
                                                onClick={() => setFilters({ ...filters, priceRange: range })}
                                                className={`px-6 py-4 rounded-2xl text-sm font-bold transition-all ${filters.priceRange === range
                                                    ? 'bg-primary text-white shadow-xl'
                                                    : 'bg-light text-primary hover:bg-gray-200'
                                                    }`}
                                            >
                                                {range}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Minimum Bedrooms</label>
                                    <div className="flex gap-3">
                                        {['All', '1', '2', '3', '4', '5+'].map(n => (
                                            <button
                                                key={n}
                                                onClick={() => setFilters({ ...filters, minBedrooms: n })}
                                                className={`flex-1 py-4 rounded-2xl text-sm font-bold transition-all ${filters.minBedrooms === n
                                                    ? 'bg-primary text-white shadow-xl'
                                                    : 'bg-light text-primary hover:bg-gray-200'
                                                    }`}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="w-full btn-primary !py-6 !text-lg"
                                    >
                                        Show {filteredProperties.length} Results
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilters({
                                                type: 'All',
                                                location: 'All',
                                                priceRange: 'All',
                                                minSize: '',
                                                minBedrooms: 'All',
                                            });
                                        }}
                                        className="w-full mt-4 text-sm font-bold text-gray-400 hover:text-accent transition-colors"
                                    >
                                        Reset All Filters
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
