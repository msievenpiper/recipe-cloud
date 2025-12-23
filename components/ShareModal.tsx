"use client";

import { useState, useEffect } from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';

interface User {
    id: string;
    email: string;
}

interface ShareModalProps {
    recipeId: number;
    onClose: () => void;
}

export default function ShareModal({ recipeId, onClose }: ShareModalProps) {
    const [email, setEmail] = useState('');
    const [sharedWith, setSharedWith] = useState<User[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetch(`/api/recipes/${recipeId}/share`)
            .then(res => res.json())
            .then(data => setSharedWith(data));
    }, [recipeId]);

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const res = await fetch(`/api/recipes/${recipeId}/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (res.ok) {
            const newUser = await res.json();
            setSharedWith([...sharedWith, { id: newUser.sharedWithId, email }]);
            setEmail('');
            setSuccess(`Recipe shared with ${email}!`);
        } else {
            const errorData = await res.text();
            setError(errorData || 'Failed to share recipe.');
        }
    };

    const handleRevoke = async (userId: string) => {
        const res = await fetch(`/api/recipes/${recipeId}/share`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        if (res.ok) {
            setSharedWith(sharedWith.filter(user => user.id !== userId));
        } else {
            setError('Failed to revoke access.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-primary-800">Share Recipe</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleShare} className="mb-6">
                    <label htmlFor="share-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Share with another user by email:
                    </label>
                    <div className="flex space-x-2">
                        <input
                            id="share-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md">
                            Share
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
                </form>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Shared with:</h3>
                    {sharedWith.length > 0 ? (
                        <ul className="space-y-2">
                            {sharedWith.map(user => (
                                <li key={user.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                                    <span>{user.email}</span>
                                    <button onClick={() => handleRevoke(user.id)} className="text-red-500 hover:text-red-700">
                                        <FaTrash />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">This recipe has not been shared with anyone.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
