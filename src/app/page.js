'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PropertyCard from '@/components/PropertyCard';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Testimonials from '@/components/Testimonials';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Award, ShieldCheck, Globe2 } from 'lucide-react';

// Dynamically import heavy 3D component
const House3D = dynamic(() => import('@/components/House3D'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] md:h-[600px] bg-gray-50 animate-pulse rounded-3xl" />
});

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);

  const [content, setContent] = useState({
    hero: {
      title: "Investing in the Future of Lebanon Real Estate",
      subtitle: "Buyers-lb specializes in the acquisition, renovation, and strategic resale of premium properties. We turn architectural potential into high-yield investment opportunities."
    },
    advantages: [
      { title: "Strategic Acquisition", desc: "We identify undervalued assets in prime locations with high growth potential.", icon: <Globe2 className="text-accent" /> },
      { title: "Premium Renovation", desc: "Our design team transforms properties into luxury masterpieces that command top market value.", icon: <Award className="text-accent" /> },
      { title: "Market Excellence", desc: "Strategic exit strategies designed to maximize return on investment for our clients.", icon: <ShieldCheck className="text-accent" /> }
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
          advantages: data.advantages ? data.advantages.map((adv, i) => ({ ...adv, icon: prev.advantages[i]?.icon || <CheckCircle2 className="text-accent" /> })) : prev.advantages
        }));
      }
    });

    // Fetch Properties
    const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const propertyList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(propertyList);
      setFeaturedProperties(propertyList.filter(p => p.status === 'For Sale' && !p.isHotDeal).slice(0, 3));
      setHotDeals(propertyList.filter(p => p.isHotDeal).slice(0, 3));
    });

    return () => {
      unsubscribe();
      unsubContent();
    };
  }, []);

  return (
    <main className="overflow-hidden bg-white">
      {/* Hero Section */}
      <Hero content={content} />

      {/* Stats Section */}
      <Stats />

      {/* Philosophy / About Section */}
      <section className="section-padding relative overflow-hidden bg-white">
        {/* Interactive Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-navy/5 -z-10 rounded-l-[10rem] hidden lg:block overflow-hidden">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -right-1/4 w-full h-full border-[1px] border-accent/10 rounded-full"
          />
        </div>

        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10">
                <House3D />
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-10 -right-10 glass p-8 rounded-[2rem] shadow-2xl max-w-xs hidden md:block z-20 border border-white/20"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Award size={24} />
                  </div>
                  <h4 className="font-bold text-lg">Excellence Award</h4>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Recognized as the #1 Luxury Real Estate Agency in Lebanon for 2024.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-bold uppercase tracking-[0.3em] text-sm mb-6 block">Our Philosophy</span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
                Redefining the Art of <span className="text-accent italic">Property</span> Investment
              </h2>
              <p className="text-xl text-gray-500 mb-12 leading-relaxed font-light">
                We don't just sell houses; we curate high-yield assets. Our team of experts meticulously selects properties with untapped potential, applying world-class design and engineering to create unparalleled value.
              </p>

              <div className="space-y-8">
                {content.advantages.map((adv, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-accent/5 text-accent flex items-center justify-center text-2xl group-hover:bg-accent group-hover:text-white transition-all duration-500 flex-shrink-0 border border-accent/10">
                      {adv.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{adv.title}</h4>
                      <p className="text-gray-500 leading-relaxed">{adv.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12">
                <Link href="/about">
                  <button className="btn-secondary group !px-10">
                    Learn More About Us <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hot Deals Section */}
      {hotDeals.length > 0 && (
        <section className="section-padding bg-navy relative overflow-hidden">
          {/* Interactive Background Text */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <motion.span
              animate={{
                x: [0, -100, 0],
                opacity: [0.02, 0.05, 0.02]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-[20vw] font-serif font-bold text-white whitespace-nowrap"
            >
              EXCLUSIVE DEALS
            </motion.span>
          </div>

          <div className="container-custom relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div>
                <span className="inline-block px-4 py-1 bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6 border border-accent/20">Limited Time Offers</span>
                <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">Hot <span className="text-accent italic">Deals</span></h2>
                <p className="text-xl text-gray-400 max-w-2xl font-light">Exclusive high-yield opportunities with exceptional value. Act fast before they're gone.</p>
              </div>
              <Link href="/properties?filter=hot-deals">
                <button className="btn-primary !bg-white !text-primary hover:!bg-accent hover:!text-white transition-all duration-500">
                  View All Deals <ArrowRight />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {hotDeals.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-white relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-full bg-accent/5 rounded-full blur-[120px] -z-10"></div>
        <motion.div
          animate={{
            y: [0, 50, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-64 h-64 bg-navy/5 rounded-full blur-[80px] -z-10"
        />

        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <span className="text-accent font-bold uppercase tracking-[0.3em] text-sm mb-6 block">Our Portfolio</span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-4">Featured <span className="text-accent italic">Acquisitions</span></h2>
              <p className="text-xl text-gray-500 max-w-2xl font-light">A curated selection of our most prestigious investment opportunities currently available.</p>
            </div>
            <Link href="/properties">
              <button className="btn-secondary group !px-10">
                Explore Inventory <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="container-custom">
          <div className="relative rounded-[4rem] overflow-hidden bg-primary p-12 md:p-32 text-center shadow-2xl">
            <div className="absolute inset-0 opacity-30">
              <Image
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Luxury Estate"
                fill
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/80 to-primary"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-8xl font-serif font-bold text-white mb-10 leading-tight">
                  Ready to Elevate Your <span className="text-accent italic">Portfolio?</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-400 mb-16 font-light leading-relaxed">
                  Join an elite group of investors and gain access to off-market opportunities and premium real estate assets in Lebanon.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link href="/contact">
                    <button className="btn-primary !px-12 !py-6 text-xl shadow-2xl shadow-accent/20">
                      Schedule a Consultation <ArrowRight className="ml-2" />
                    </button>
                  </Link>
                  <Link href="/properties">
                    <button className="btn-secondary !bg-white/5 !text-white !border-white/20 hover:!bg-white/10 hover:!border-white/40 !px-12 !py-6 text-xl backdrop-blur-xl transition-all duration-500">
                      View Properties
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

