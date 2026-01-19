'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiPlus, FiTrash2, FiSettings, FiLayout, FiInfo, FiLink } from 'react-icons/fi';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminSettings() {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('homepage');
    const [message, setMessage] = useState({ type: '', text: '' });

    // Homepage Content State
    const [homeContent, setHomeContent] = useState({
        hero: { title: '', subtitle: '' },
        advantages: []
    });

    // Metadata State (Types, Amenities)
    const [metadata, setMetadata] = useState({
        propertyTypes: [],
        amenities: []
    });

    // Footer State
    const [footerContent, setFooterContent] = useState({
        company: { description: '', address: '', phone: '', email: '' },
        socials: []
    });

    // About Content State
    const [aboutContent, setAboutContent] = useState({
        title: 'Our Story',
        subtitle: 'Excellence in Real Estate Investment',
        description: '',
        stats: [
            { label: 'Years Experience', value: '15+' },
            { label: 'Properties Sold', value: '500+' },
            { label: 'Total Investment', value: '$2B+' }
        ]
    });

    // Contact Content State
    const [contactContent, setContactContent] = useState({
        title: 'Get in Touch',
        subtitle: 'Our investment experts are ready to assist you.',
        email: '',
        phone: '',
        address: '',
        mapUrl: ''
    });

    useEffect(() => {
        // Fetch Homepage
        const unsubHome = onSnapshot(doc(db, 'content', 'homepage'), (snap) => {
            if (snap.exists()) setHomeContent(snap.data());
        });

        // Fetch Metadata
        const unsubMeta = onSnapshot(doc(db, 'content', 'metadata'), (snap) => {
            if (snap.exists()) setMetadata(snap.data());
        });

        // Fetch Footer
        const unsubFooter = onSnapshot(doc(db, 'content', 'footer'), (snap) => {
            if (snap.exists()) setFooterContent(snap.data());
        });

        // Fetch About
        const unsubAbout = onSnapshot(doc(db, 'content', 'about'), (snap) => {
            if (snap.exists()) setAboutContent(snap.data());
        });

        // Fetch Contact
        const unsubContact = onSnapshot(doc(db, 'content', 'contact'), (snap) => {
            if (snap.exists()) setContactContent(snap.data());
        });

        return () => {
            unsubHome();
            unsubMeta();
            unsubFooter();
            unsubAbout();
            unsubContact();
        };
    }, []);

    const handleSave = async (collection, docId, data) => {
        setLoading(true);
        try {
            await setDoc(doc(db, collection, docId), data);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update settings: ' + err.message });
        } finally {
            setLoading(false);
        }
    };

    const addItem = (state, setState, field) => {
        setState({ ...state, [field]: [...state[field], ''] });
    };

    const removeItem = (state, setState, field, index) => {
        const newList = state[field].filter((_, i) => i !== index);
        setState({ ...state, [field]: newList });
    };

    const updateItem = (state, setState, field, index, value) => {
        const newList = [...state[field]];
        newList[index] = value;
        setState({ ...state, [field]: newList });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Platform Settings</h1>
                    <p className="text-gray-500">Manage global content, lists, and metadata.</p>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-success/10 border-success/20 text-success' : 'bg-error/10 border-error/20 text-error'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-100 pb-4">
                {[
                    { id: 'homepage', label: 'Homepage', icon: <FiLayout /> },
                    { id: 'about', label: 'About Page', icon: <FiInfo /> },
                    { id: 'contact', label: 'Contact Page', icon: <FiLink /> },
                    { id: 'metadata', label: 'Lists & Types', icon: <FiSettings /> },
                    { id: 'footer', label: 'Footer & Contact', icon: <FiInfo /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:bg-light'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Homepage Tab */}
            {activeTab === 'homepage' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6">Hero Section</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Hero Title</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={homeContent.hero.title}
                                    onChange={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, title: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Hero Subtitle</label>
                                <textarea
                                    className="input-field min-h-[100px]"
                                    value={homeContent.hero.subtitle}
                                    onChange={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, subtitle: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6">Elite Advantages</h2>
                        <div className="space-y-6">
                            {homeContent.advantages.map((adv, index) => (
                                <div key={index} className="p-6 bg-light rounded-2xl relative">
                                    <button
                                        onClick={() => {
                                            const newAdvs = homeContent.advantages.filter((_, i) => i !== index);
                                            setHomeContent({ ...homeContent, advantages: newAdvs });
                                        }}
                                        className="absolute top-4 right-4 text-error hover:scale-110 transition-all"
                                    >
                                        <FiTrash2 />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                value={adv.title}
                                                onChange={(e) => {
                                                    const newAdvs = [...homeContent.advantages];
                                                    newAdvs[index].title = e.target.value;
                                                    setHomeContent({ ...homeContent, advantages: newAdvs });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                value={adv.desc}
                                                onChange={(e) => {
                                                    const newAdvs = [...homeContent.advantages];
                                                    newAdvs[index].desc = e.target.value;
                                                    setHomeContent({ ...homeContent, advantages: newAdvs });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setHomeContent({ ...homeContent, advantages: [...homeContent.advantages, { title: '', desc: '' }] })}
                                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
                            >
                                <FiPlus /> Add Advantage Card
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => handleSave('content', 'homepage', homeContent)}
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        <FiSave /> {loading ? 'Saving...' : 'Save Homepage Settings'}
                    </button>
                </motion.div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6">About Page Content</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={aboutContent.title}
                                    onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Subtitle</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={aboutContent.subtitle}
                                    onChange={(e) => setAboutContent({ ...aboutContent, subtitle: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                                <textarea
                                    className="input-field min-h-[200px]"
                                    value={aboutContent.description}
                                    onChange={(e) => setAboutContent({ ...aboutContent, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleSave('content', 'about', aboutContent)}
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        <FiSave /> {loading ? 'Saving...' : 'Save About Settings'}
                    </button>
                </motion.div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6">Contact Page Content</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={contactContent.title}
                                    onChange={(e) => setContactContent({ ...contactContent, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Subtitle</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={contactContent.subtitle}
                                    onChange={(e) => setContactContent({ ...contactContent, subtitle: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={contactContent.email}
                                    onChange={(e) => setContactContent({ ...contactContent, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={contactContent.phone}
                                    onChange={(e) => setContactContent({ ...contactContent, phone: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Address</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={contactContent.address}
                                    onChange={(e) => setContactContent({ ...contactContent, address: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleSave('content', 'contact', contactContent)}
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        <FiSave /> {loading ? 'Saving...' : 'Save Contact Settings'}
                    </button>
                </motion.div>
            )}
            {activeTab === 'metadata' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Property Types */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6">Property Types</h2>
                            <div className="space-y-3">
                                {metadata.propertyTypes.map((type, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input-field py-2"
                                            value={type}
                                            onChange={(e) => updateItem(metadata, setMetadata, 'propertyTypes', index, e.target.value)}
                                        />
                                        <button onClick={() => removeItem(metadata, setMetadata, 'propertyTypes', index)} className="p-2 text-error"><FiTrash2 /></button>
                                    </div>
                                ))}
                                <button onClick={() => addItem(metadata, setMetadata, 'propertyTypes')} className="text-accent font-bold text-sm flex items-center gap-1"><FiPlus /> Add Type</button>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6">Global Amenities</h2>
                            <div className="space-y-3">
                                {metadata.amenities.map((amenity, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input-field py-2"
                                            value={amenity}
                                            onChange={(e) => updateItem(metadata, setMetadata, 'amenities', index, e.target.value)}
                                        />
                                        <button onClick={() => removeItem(metadata, setMetadata, 'amenities', index)} className="p-2 text-error"><FiTrash2 /></button>
                                    </div>
                                ))}
                                <button onClick={() => addItem(metadata, setMetadata, 'amenities')} className="text-accent font-bold text-sm flex items-center gap-1"><FiPlus /> Add Amenity</button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => handleSave('content', 'metadata', metadata)}
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        <FiSave /> {loading ? 'Saving...' : 'Save Global Lists'}
                    </button>
                </motion.div>
            )}

            {/* Footer Tab */}
            {activeTab === 'footer' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6">Company Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Company Description</label>
                                <textarea
                                    className="input-field"
                                    value={footerContent.company.description}
                                    onChange={(e) => setFooterContent({ ...footerContent, company: { ...footerContent.company, description: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Address</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={footerContent.company.address}
                                    onChange={(e) => setFooterContent({ ...footerContent, company: { ...footerContent.company, address: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={footerContent.company.phone}
                                    onChange={(e) => setFooterContent({ ...footerContent, company: { ...footerContent.company, phone: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={footerContent.company.email}
                                    onChange={(e) => setFooterContent({ ...footerContent, company: { ...footerContent.company, email: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => handleSave('content', 'footer', footerContent)}
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        <FiSave /> {loading ? 'Saving...' : 'Save Footer Settings'}
                    </button>
                </motion.div>
            )}
        </div>
    );
}
