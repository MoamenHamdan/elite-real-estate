'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiUpload, FiX, FiSave, FiAlertCircle, FiUser, FiBriefcase, FiFileText, FiLink, FiUsers } from 'react-icons/fi';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { compressImage } from '@/lib/utils';

export default function ManageTeam() {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        position: '',
        description: '',
        portfolio: '',
        photo: '',
        email: '',
        phone: '',
        proofOfWork: ''
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'team'), (snapshot) => {
            const teamList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTeam(teamList);
            setFetching(false);
        });
        return () => unsubscribe();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        setError('');

        try {
            // Compress and convert to Base64
            const base64 = await compressImage(file);
            setFormData(prev => ({ ...prev, photo: base64 }));
        } catch (err) {
            setError('Failed to upload photo: ' + err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.name || !formData.position || !formData.photo) {
            setError('Please fill in all mandatory fields (Name, Position, Photo)');
            setLoading(false);
            return;
        }

        try {
            if (isEditing) {
                const memberRef = doc(db, 'team', currentMember.id);
                await updateDoc(memberRef, {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'team'), {
                    ...formData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            }
            resetForm();
        } catch (err) {
            setError('Failed to save team member: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (member) => {
        setIsEditing(true);
        setCurrentMember(member);
        setFormData({
            name: member.name,
            position: member.position,
            description: member.description || '',
            portfolio: member.portfolio || '',
            photo: member.photo,
            email: member.email || '',
            phone: member.phone || '',
            proofOfWork: member.proofOfWork || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (member) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;

        try {
            await deleteDoc(doc(db, 'team', member.id));
        } catch (err) {
            setError('Failed to delete team member: ' + err.message);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', position: '', description: '', portfolio: '', photo: '', email: '', phone: '', proofOfWork: '' });
        setIsEditing(false);
        setCurrentMember(null);
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">Manage Team Members</h1>
                {isEditing && (
                    <button onClick={resetForm} className="text-gray-500 hover:text-primary transition-colors">
                        Cancel Editing
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-center gap-3">
                    <FiAlertCircle />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            {isEditing ? <><FiEdit2 className="text-accent" /> Edit Member</> : <><FiPlus className="text-accent" /> Add New Member</>}
                        </h2>

                        <div className="space-y-6">
                            {/* Photo Upload */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-light border-2 border-dashed border-gray-200 flex items-center justify-center group">
                                    {formData.photo ? (
                                        <>
                                            <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                                                className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                            >
                                                <FiX size={24} />
                                            </button>
                                        </>
                                    ) : (
                                        <FiUser size={40} className="text-gray-300" />
                                    )}
                                    {uploadingImage && (
                                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <label className="cursor-pointer bg-accent/10 text-accent px-4 py-2 rounded-lg text-sm font-bold hover:bg-accent hover:text-white transition-all flex items-center gap-2">
                                    <FiUpload /> {formData.photo ? 'Change Photo' : 'Upload Photo'}
                                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploadingImage} />
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name *</label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="input-field !pl-12"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Position *</label>
                                <div className="relative">
                                    <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        className="input-field !pl-12"
                                        placeholder="e.g. Senior Investment Advisor"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                                <div className="relative">
                                    <FiFileText className="absolute left-4 top-4 text-gray-400" />
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="input-field !pl-12 min-h-[100px]"
                                        placeholder="Brief bio about the team member..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="+961 ..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Track Record / Proof of Work</label>
                                <input
                                    type="text"
                                    name="proofOfWork"
                                    value={formData.proofOfWork}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    placeholder="e.g. 50+ successful deals"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Portfolio URL</label>
                                <div className="relative">
                                    <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="url"
                                        name="portfolio"
                                        value={formData.portfolio}
                                        onChange={handleInputChange}
                                        className="input-field !pl-12"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || uploadingImage}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <><FiSave /> {isEditing ? 'Update Member' : 'Add Member'}</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold mb-6">Team Members ({team.length})</h2>
                    {team.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-gray-200">
                            <FiUsers size={48} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-400">No team members added yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {team.map((member) => (
                                <div key={member.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-primary text-lg">{member.name}</h3>
                                            <p className="text-accent text-sm font-medium mb-2">{member.position}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(member)}
                                                    className="p-2 bg-light text-gray-500 hover:bg-accent/10 hover:text-accent rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(member)}
                                                    className="p-2 bg-light text-gray-500 hover:bg-error/10 hover:text-error rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {member.description && (
                                        <p className="mt-4 text-sm text-gray-500 line-clamp-2 italic">&quot;{member.description}&quot;</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
