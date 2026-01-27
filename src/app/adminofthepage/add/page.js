'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiPlus, FiSave, FiAlertCircle, FiStar } from 'react-icons/fi';
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { compressImage } from '@/lib/utils';

export default function AddProperty() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);
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
        isHotDeal: false,
    });

    useEffect(() => {
        const metadataRef = doc(db, 'content', 'metadata');
        const unsubscribe = onSnapshot(metadataRef, (snapshot) => {
            if (snapshot.exists() && snapshot.data().propertyTypes) {
                setPropertyTypes(snapshot.data().propertyTypes);
            }
        });
        return () => unsubscribe();
    }, []);

    const statuses = ['Acquired', 'For Sale', 'Sold'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingImages(true);
        setError('');

        try {
            const uploadPromises = files.map(async (file) => {
                // Compress and convert to Base64
                const base64 = await compressImage(file);
                return base64;
            });

            const urls = await Promise.all(uploadPromises);
            setImages(prev => [...prev, ...urls]);
        } catch (err) {
            setError('Failed to upload images: ' + err.message);
        } finally {
            setUploadingImages(false);
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        const requiredFields = ['title', 'description', 'location', 'size', 'bedrooms', 'bathrooms', 'acquisitionPrice', 'sellingPrice'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setError(`Please fill in all mandatory fields: ${field}`);
                setLoading(false);
                return;
            }
        }

        if (images.length === 0) {
            setError('Please upload at least one image');
            setLoading(false);
            return;
        }

        try {
            const propertyData = {
                ...formData,
                images,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                profit: Number(formData.sellingPrice) - Number(formData.acquisitionPrice),
                roi: ((Number(formData.sellingPrice) - Number(formData.acquisitionPrice)) / Number(formData.acquisitionPrice) * 100).toFixed(2),
            };

            await addDoc(collection(db, 'properties'), propertyData);
            router.push('/adminofthepage/inventory');
        } catch (err) {
            setError('Failed to add property: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">Add New Property</h1>
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 hover:text-primary transition-colors"
                >
                    Cancel
                </button>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-center gap-3"
                >
                    <FiAlertCircle />
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 bg-accent/10 text-accent rounded-full flex items-center justify-center text-sm">1</span>
                        Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Property Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="e.g. Modern Penthouse with Ocean View"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="input-field min-h-[150px]"
                                placeholder="Describe the property's unique features, amenities, and investment potential..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Location *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="e.g. Downtown Dubai, UAE"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Property Type *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="input-field"
                            >
                                {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Specifications & Financials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-accent/10 text-accent rounded-full flex items-center justify-center text-sm">2</span>
                            Specifications
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Size (sqm) *</label>
                                <input
                                    type="number"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Bedrooms *</label>
                                    <input
                                        type="number"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Bathrooms *</label>
                                    <input
                                        type="number"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-accent/10 text-accent rounded-full flex items-center justify-center text-sm">3</span>
                            Financials
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Acquisition Price ($) *</label>
                                <input
                                    type="number"
                                    name="acquisitionPrice"
                                    value={formData.acquisitionPrice}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Selling Price ($) *</label>
                                <input
                                    type="number"
                                    name="sellingPrice"
                                    value={formData.sellingPrice}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Status *</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-3 pt-4">
                                <input
                                    type="checkbox"
                                    id="isHotDeal"
                                    name="isHotDeal"
                                    checked={formData.isHotDeal}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isHotDeal: e.target.checked }))}
                                    className="w-5 h-5 accent-accent rounded"
                                />
                                <label htmlFor="isHotDeal" className="text-sm font-bold text-gray-700 uppercase flex items-center gap-2 cursor-pointer">
                                    <FiStar className={formData.isHotDeal ? "fill-accent text-accent" : "text-gray-400"} />
                                    Mark as Hot Deal
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 bg-accent/10 text-accent rounded-full flex items-center justify-center text-sm">4</span>
                        Image Gallery
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {images.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FiX />
                                </button>
                            </div>
                        ))}
                        <label className={`aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all ${uploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {uploadingImages ? (
                                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <FiUpload className="text-3xl text-gray-300 mb-2" />
                                    <span className="text-xs font-bold text-gray-400 uppercase">Upload Image</span>
                                </>
                            )}
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploadingImages}
                            />
                        </label>
                    </div>
                    <p className="text-xs text-gray-400 italic">Note: Images are stored securely in the cloud. No size limit applies.</p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="btn-secondary"
                    >
                        Discard Changes
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center gap-2 min-w-[200px] justify-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <><FiSave /> Save Property</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
