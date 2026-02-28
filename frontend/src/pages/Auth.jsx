import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { LogIn, UserPlus, Brain } from 'lucide-react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const { data } = await authService.login(formData);
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('username', formData.username);
            } else {
                await authService.register(formData);
                // Auto-login after registration
                const { data } = await authService.login({
                    username: formData.username,
                    password: formData.password
                });
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('username', formData.username);
            }
            navigate('/dashboard');
        } catch (err) {
            if (!err.response) {
                setError('Cannot connect to server. Please ensure the backend is running.');
            } else {
                setError(err.response?.data?.detail || 'An error occurred');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-indigo-600 p-3 rounded-2xl mb-4">
                        <Brain size={32} />
                    </div>
                    <h1 className="text-2xl font-bold">AI Learning Twin</h1>
                    <p className="text-slate-400">{isLogin ? 'Welcome back!' : 'Create your account'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                className="input-field"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                        {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                        {isLogin ? 'Sign In' : 'Register'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-400 hover:underline"
                    >
                        {isLogin ? 'Register' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;
