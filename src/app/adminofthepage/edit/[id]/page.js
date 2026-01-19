'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiSave, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { doc, getDoc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function EditProperty() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState(['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Commercial', 'Land']);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        type: 'Apartment',
        size: '',
        bedrooms: '',
        bathrooms: '',
        acquisitionPrice: '',
        sellingPrice: '',
        status: 'Acquired',
    });

    const statuses = ['Acquired', 'For Sale', 'Sold'];

    useEffect(() => {
        // Fetch Property Types
        const metadataRef = doc(db, 'content', 'metadata');
        const unsubscribeTypes = onSnapshot(metadataRef, (snapshot) => {
            if (snapshot.exists() && snapshot.data().propertyTypes) {
                setPropertyTypes(snapshot.data().propertyTypes);
            }
        });

        // Fetch Property Data
        const fetchProperty = async () => {
            try {
                const docRef = doc(db, 'properties', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        title: data.title || '',
                        description: data.description || '',
                        location: data.location || '',
                        type: data.type || 'Apartment',
                        size: data.size || '',
                        bedrooms: data.bedrooms || '',
                        bathrooms: data.bathrooms || '',
                        acquisitionPrice: data.acquisitionPrice || '',
                        sellingPrice: data.sellingPrice || '',
                        status: data.status || 'Acquired',
                    });
                    setImages(data.images || []);
                }
            } catch (err) {
                setError('Failed to fetch property details');
            } finally {
                setFetching(false);
            }
        };
        fetchProperty();

        return () => unsubscribeTypes();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.size > 2 * 1024 * 1024) {
                setError('Each image must be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const propertyRef = doc(db, 'properties', id);
            const propertyData = {
                ...formData,
                images,
                updatedAt: serverTimestamp(),
                profit: Number(formData.sellingPrice) - Number(formData.acquisitionPrice),
                roi: ((Number(formData.sellingPrice) - Number(formData.acquisitionPrice)) / Number(formData.acquisitionPrice) * 100).toFixed(2),
            };

            await updateDoc(propertyRef, propertyData);
            router.push('/adminofthepage/inventory');
        } catch (err) {
            setError('Failed to update property: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition-all">
                        <FiArrowLeft className="text-xl" />
                    </button>
                    <h1 className="text-3xl font-bold text-primary">Edit Property</h1>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-center gap-3">
                    <FiAlertCircle />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Property Title *</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="input-field" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Description *</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field min-h-[150px]" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Location *</label>
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Property Type *</label>
                            <select name="type" value={formData.type} onChange={handleInputChange} className="input-field">
                                {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Specifications & Financials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6">Specifications</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Size (sqm) *</label>
                                <input type="number" name="size" value={formData.size} onChange={handleInputChange} className="input-field" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Bedrooms *</label>
                                    <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="input-field" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Bathrooms *</label>
                                    <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="input-field" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6">Financials</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Acquisition Price ($) *</label>
                                <input type="number" name="acquisitionPrice" value={formData.acquisitionPrice} onChange={handleInputChange} className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Selling Price ($) *</label>
                                <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleInputChange} className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Status *</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="input-field">
                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6">Image Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {images.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FiX />
                                </button>
                            </div>
                        ))}
                        <label className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
                            <FiUpload className="text-3xl text-gray-300 mb-2" />
                            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 min-w-[200px] justify-center">
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><FiSave /> Update Property</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
