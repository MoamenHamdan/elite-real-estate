'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiHome, FiDollarSign, FiArrowRight, FiCheckCircle, FiShield, FiGlobe, FiAward } from 'react-icons/fi';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [stats, setStats] = useState({
    totalValue: 0,
    activeListings: 0,
    avgRoi: 0,
    totalProfit: 0
  });

  const [content, setContent] = useState({
    hero: {
      title: "Investing in the Future of Lebanon Real Estate",
      subtitle: "Lebanon Buyers specializes in the acquisition, renovation, and strategic resale of premium properties. We turn architectural potential into high-yield investment opportunities."
    },
    advantages: [
      { title: "Strategic Acquisition", desc: "We identify undervalued assets in prime locations with high growth potential.", icon: <FiTrendingUp /> },
      { title: "Premium Renovation", desc: "Our design team transforms properties into luxury masterpieces that command top market value.", icon: <FiHome /> },
      { title: "Market Excellence", desc: "Strategic exit strategies designed to maximize return on investment for our clients.", icon: <FiDollarSign /> }
    ]
  });

  useEffect(() => {
    // Fetch Homepage Content
    const unsubContent = onSnapshot(doc(db, 'content', 'homepage'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setContent(prev => ({
          ...prev,
          hero: data.hero || prev.hero,
          advantages: data.advantages ? data.advantages.map((adv, i) => ({ ...adv, icon: prev.advantages[i]?.icon || <FiCheckCircle /> })) : prev.advantages
        }));
      }
    });

    // Fetch Properties for Stats & Featured
    const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const propertyList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(propertyList);
      setFeaturedProperties(propertyList.filter(p => p.status === 'For Sale').slice(0, 3));

      // Calculate Stats
      const totalValue = propertyList.reduce((acc, curr) => acc + Number(curr.sellingPrice || 0), 0);
      const activeListings = propertyList.filter(p => p.status === 'For Sale').length;
      const totalProfit = propertyList.reduce((acc, curr) => acc + Number(curr.profit || 0), 0);
      const avgRoi = propertyList.length > 0
        ? (propertyList.reduce((acc, curr) => acc + Number(curr.roi || 0), 0) / propertyList.length).toFixed(1)
        : 0;

      setStats({ totalValue, activeListings, avgRoi, totalProfit });
    });

    return () => {
      unsubscribe();
      unsubContent();
    };
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover brightness-[0.4]"
            alt="Luxury Home"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-light"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-6 py-2 glass-dark text-accent text-sm font-bold uppercase tracking-[0.3em] rounded-full mb-8">
                Lebanon Buyers • Premium Real Estate
              </span>
              <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-8 leading-[1.1]">
                {content.hero.title.split(' ').map((word, i) => (
                  <span key={i} className={word.toLowerCase() === 'lebanon' ? 'text-accent' : ''}>{word} </span>
                ))}
              </h1>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl">
                {content.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/properties">
                  <button className="btn-primary !px-10 !py-5 text-lg">
                    Explore Inventory <FiArrowRight />
                  </button>
                </Link>
                <Link href="/about">
                  <button className="btn-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white/20 !px-10 !py-5 text-lg backdrop-blur-md">
                    Our Philosophy
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Philosophy Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight">
                Redefining the Art of <span className="text-accent">Property Investment</span>
              </h2>
              <p className="text-xl text-gray-500 mb-12 leading-relaxed">
                We don't just sell houses; we curate high-yield assets. Our team of experts meticulously selects properties with untapped potential, applying world-class design and engineering to create unparalleled value.
              </p>
              <div className="space-y-6">
                {content.advantages.map((adv, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center text-2xl group-hover:bg-accent group-hover:text-white transition-all duration-500 flex-shrink-0">
                      {adv.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{adv.title}</h4>
                      <p className="text-gray-500 leading-relaxed">{adv.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-luxury">
                <img
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop"
                  className="w-full h-full object-cover"
                  alt="Modern Interior"
                />
              </div>
              <div className="absolute -bottom-12 -left-12 glass p-10 rounded-[2rem] hidden md:block max-w-xs">
                <div className="text-accent text-4xl mb-4"><FiAward /></div>
                <h4 className="text-xl font-bold mb-2">Award Winning Design</h4>
                <p className="text-sm text-gray-500">Recognized globally for architectural excellence and innovation.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-padding bg-light">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4">Featured <span className="text-accent">Acquisitions</span></h2>
              <p className="text-xl text-gray-500 max-w-2xl">A curated selection of our most prestigious investment opportunities currently available.</p>
            </div>
            <Link href="/properties">
              <button className="btn-secondary group">
                View All Properties <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container-custom">
          <div className="relative rounded-[4rem] overflow-hidden bg-primary p-12 md:p-24 text-center">
            <div className="absolute inset-0 opacity-20">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Luxury Estate"
              />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8">Ready to Elevate Your Portfolio?</h2>
              <p className="text-xl text-gray-400 mb-12">Join an elite group of investors and gain access to off-market opportunities and premium real estate assets.</p>
              <Link href="/contact">
                <button className="btn-primary !px-12 !py-6 text-xl mx-auto">
                  Schedule a Consultation <FiArrowRight />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
