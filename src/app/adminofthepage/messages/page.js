'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiPhone, FiMessageSquare, FiCheck, FiTrash2, FiClock } from 'react-icons/fi';
import { collection, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MessagesPage() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messageList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || new Date(),
            }));
            setMessages(messageList);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const markAsRead = async (messageId) => {
        try {
            await updateDoc(doc(db, 'messages', messageId), { read: true });
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const deleteMessage = async (messageId) => {
        if (confirm('Are you sure you want to delete this message?')) {
            try {
                await deleteDoc(doc(db, 'messages', messageId));
                setSelectedMessage(null);
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    const handleMessageClick = (message) => {
        setSelectedMessage(message);
        if (!message.read) {
            markAsRead(message.id);
        }
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const unreadCount = messages.filter(m => !m.read).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Messages</h1>
                    <p className="text-gray-500 mt-2">
                        {unreadCount > 0 ? (
                            <span className="text-accent font-bold">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</span>
                        ) : (
                            'All caught up!'
                        )}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Messages List */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="font-bold text-primary">Inbox ({messages.length})</h2>
                    </div>
                    <div className="max-h-[600px] overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <FiMail className="text-4xl mx-auto mb-4 opacity-20" />
                                <p>No messages yet</p>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleMessageClick(message)}
                                    className={`p-6 border-b border-gray-100 cursor-pointer transition-all hover:bg-light ${selectedMessage?.id === message.id ? 'bg-accent/5 border-l-4 border-l-accent' : ''
                                        } ${!message.read ? 'bg-blue-50/50' : ''}`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                                                <FiUser className="text-accent" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-primary text-sm">{message.name}</p>
                                                {!message.read && (
                                                    <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">New</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                        <FiClock className="text-xs" />
                                        {formatDate(message.createdAt)}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{message.message}</p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    {selectedMessage ? (
                        <div>
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-primary mb-2">{selectedMessage.name}</h2>
                                    <p className="text-gray-400 text-sm">{formatDate(selectedMessage.createdAt)}</p>
                                </div>
                                <button
                                    onClick={() => deleteMessage(selectedMessage.id)}
                                    className="p-3 text-error hover:bg-error/10 rounded-xl transition-all"
                                    title="Delete message"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3 p-4 bg-light rounded-xl">
                                    <FiMail className="text-accent" />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                                        <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:text-accent transition-colors">
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-light rounded-xl">
                                    <FiPhone className="text-accent" />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold">Phone</p>
                                        <a href={`tel:${selectedMessage.phone}`} className="text-primary hover:text-accent transition-colors">
                                            {selectedMessage.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="p-6 bg-light rounded-xl">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FiMessageSquare className="text-accent" />
                                        <p className="text-xs text-gray-400 uppercase font-bold">Message</p>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>

                                <div className="flex gap-4">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: Your Inquiry`}
                                        className="btn-primary flex-1"
                                    >
                                        <FiMail /> Reply via Email
                                    </a>
                                    <button
                                        onClick={() => markAsRead(selectedMessage.id)}
                                        disabled={selectedMessage.read}
                                        className={`btn-secondary flex-1 ${selectedMessage.read ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <FiCheck /> {selectedMessage.read ? 'Marked as Read' : 'Mark as Read'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-20">
                            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                                <FiMessageSquare className="text-4xl text-accent" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-2">No Message Selected</h3>
                            <p className="text-gray-400">Select a message from the list to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
