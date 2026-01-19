'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp, FiHome, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import PropertyCard from '@/components/PropertyCard';

export default function Home() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    soldProperties: 0,
    portfolioValue: 0,
  });
  const [featuredProperties, setFeaturedProperties] = useState([]);

  useEffect(() => {
    const propertiesRef = ref(database, 'properties');
    onValue(propertiesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const properties = Object.values(data);
        const total = properties.length;
        const sold = properties.filter(p => p.status === 'Sold').length;
        const value = properties.reduce((acc, p) => acc + (Number(p.sellingPrice) || 0), 0);

        setStats({
          totalProperties: total,
          soldProperties: sold,
          portfolioValue: value,
        });

        setFeaturedProperties(properties.filter(p => p.status === 'For Sale').slice(0, 3));
      }
    });
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Real Estate"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="container-custom relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-accent font-medium tracking-widest uppercase mb-4">
              Exclusive Investment Opportunities
            </h2>
            <h1 className="mb-8 leading-tight">
              Invest in the Future of <br />
              <span className="text-gradient">Luxury Living</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
              Elite Estates acquires premium properties globally, offering our clients
              unparalleled investment assets with high ROI potential.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/properties">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center gap-2"
                >
                  View Inventory <FiArrowRight />
                </motion.button>
              </Link>
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all"
                >
                  Our Strategy
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-2xl"
        >
          ↓
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-8 rounded-2xl bg-light shadow-luxury"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiHome className="text-3xl text-accent" />
              </div>
              <h3 className="text-4xl font-bold mb-2">
                {stats.totalProperties || '12'}
              </h3>
              <p className="text-gray-500 font-medium uppercase tracking-wider">Properties Managed</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-8 rounded-2xl bg-primary text-white shadow-luxury"
            >
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="text-3xl text-accent" />
              </div>
              <h3 className="text-4xl font-bold mb-2">
                {stats.soldProperties || '45'}
              </h3>
              <p className="text-gray-300 font-medium uppercase tracking-wider">Successfully Resold</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center p-8 rounded-2xl bg-light shadow-luxury"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiTrendingUp className="text-3xl text-accent" />
              </div>
              <h3 className="text-4xl font-bold mb-2">
                {stats.portfolioValue ? formatCurrency(stats.portfolioValue) : '$12.5M'}
              </h3>
              <p className="text-gray-500 font-medium uppercase tracking-wider">Portfolio Value</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Investment Philosophy Section */}
      <section className="section-padding bg-light">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-6">The Elite <span className="text-accent">Advantage</span></h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Unlike traditional marketplaces, we are the sole owners of every property in our portfolio.
                  We identify undervalued luxury assets, acquire them through our private networks,
                  and perform high-end renovations to maximize value.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    'Direct ownership - no middleman fees',
                    'Rigorous 150-point inspection process',
                    'Exclusive off-market opportunities',
                    'Transparent investment performance data'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-primary font-medium">
                      <FiCheckCircle className="text-accent text-xl" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/about">
                  <button className="btn-secondary">Learn Our Process</button>
                </Link>
              </motion.div>
            </div>
            <div className="flex-1 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
                  alt="Luxury Villa"
                  width={800}
                  height={600}
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-0"></div>
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Preview */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="mb-4">Featured <span className="text-accent">Listings</span></h2>
              <p className="text-gray-500 max-w-xl">
                Explore a selection of our most prestigious properties currently available for acquisition.
              </p>
            </div>
            <Link href="/properties" className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors">
              View All Properties <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-light rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400">Our latest acquisitions are being processed. Check back soon for new opportunities.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
