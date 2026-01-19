'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
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
        const propertiesRef = ref(database, 'properties');
        onValue(propertiesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const propertyList = Object.entries(data).map(([id, value]) => ({
                    id,
                    ...value,
                })).filter(p => p.status !== 'Acquired'); // Only show For Sale and Sold
                setProperties(propertyList);
            }
            setLoading(false);
        });
    }, []);

    // Dynamic filter options generated from data
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
        <div className="pt-32 pb-24 bg-light min-h-screen">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Our <span className="text-accent">Inventory</span></h1>
                    <p className="text-gray-500 text-lg">Discover exclusive investment opportunities in our curated portfolio.</p>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-6 rounded-2xl shadow-luxury mb-12">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Search Input */}
                        <div className="flex-grow relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                type="text"
                                placeholder="Search by title, location, or features..."
                                className="w-full pl-12 pr-4 py-4 bg-light border-none rounded-xl focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Desktop Filters */}
                        <div className="hidden lg:flex items-center gap-4">
                            <select
                                className="px-4 py-4 bg-light rounded-xl border-none focus:ring-2 focus:ring-accent/20 outline-none cursor-pointer"
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            >
                                <option value="All">All Types</option>
                                {filterOptions.types.filter(t => t !== 'All').map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>

                            <select
                                className="px-4 py-4 bg-light rounded-xl border-none focus:ring-2 focus:ring-accent/20 outline-none cursor-pointer"
                                value={filters.priceRange}
                                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                            >
                                <option value="All">Any Price</option>
                                <option value="Under 1M">Under $1M</option>
                                <option value="1M - 5M">$1M - $5M</option>
                                <option value="Over 5M">Over $5M</option>
                            </select>

                            <button
                                onClick={() => setShowMobileFilters(true)}
                                className="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-xl hover:bg-primary-light transition-all"
                            >
                                <FiFilter /> More Filters
                            </button>
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="lg:hidden flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-xl"
                        >
                            <FiFilter /> Filters
                        </button>
                    </div>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[500px] rounded-2xl skeleton"></div>
                        ))}
                    </div>
                ) : filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl shadow-luxury">
                        <div className="text-6xl text-gray-200 mb-6 flex justify-center">
                            <FiSearch />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No properties found</h3>
                        <p className="text-gray-500 mb-8">Try adjusting your search or filters to find what you're looking for.</p>
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
                            className="btn-primary"
                        >
                            Clear All Filters
                        </button>
                    </div>
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
                            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] p-8 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="text-2xl font-bold">Filters</h2>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 hover:bg-light rounded-full transition-all"
                                >
                                    <FiX className="text-2xl" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Property Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {filterOptions.types.map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setFilters({ ...filters, type: t })}
                                                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${filters.type === t
                                                        ? 'bg-accent text-white'
                                                        : 'bg-light text-primary hover:bg-gray-200'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Location</label>
                                    <select
                                        className="w-full px-4 py-4 bg-light rounded-xl border-none outline-none"
                                        value={filters.location}
                                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    >
                                        {filterOptions.locations.map(l => (
                                            <option key={l} value={l}>{l}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Price Range</label>
                                    <select
                                        className="w-full px-4 py-4 bg-light rounded-xl border-none outline-none"
                                        value={filters.priceRange}
                                        onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                                    >
                                        <option value="All">Any Price</option>
                                        <option value="Under 1M">Under $1M</option>
                                        <option value="1M - 5M">$1M - $5M</option>
                                        <option value="Over 5M">Over $5M</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Minimum Bedrooms</label>
                                    <div className="flex gap-3">
                                        {['All', '1', '2', '3', '4', '5+'].map(n => (
                                            <button
                                                key={n}
                                                onClick={() => setFilters({ ...filters, minBedrooms: n })}
                                                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${filters.minBedrooms === n
                                                        ? 'bg-accent text-white'
                                                        : 'bg-light text-primary hover:bg-gray-200'
                                                    }`}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Minimum Size (sqm)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 200"
                                        className="w-full px-4 py-4 bg-light rounded-xl border-none outline-none"
                                        value={filters.minSize}
                                        onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
                                    />
                                </div>

                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="w-full btn-primary py-5 mt-8"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
