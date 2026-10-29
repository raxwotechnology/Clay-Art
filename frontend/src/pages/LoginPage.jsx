import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
    Eye,
    EyeOff,
    User,
    Mail,
    Lock,
    ArrowRight,
    ShoppingCart,
    Boxes,
    BarChart3,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

import { authApi } from '../features/auth/authApi';
import { useAuthStore } from '../store/authStore';
import { useCompanySettings } from '../features/settings/useSettings';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuthStore();
    const { data: settingsRes } = useCompanySettings();

    const companySettings = settingsRes?.data || {};
    const companyName = companySettings.companyName || 'Asipbook';
    const tagline = companySettings.tagline || 'BUSINESS MANAGEMENT SYSTEM';
    const subtitle = companySettings.systemSubtitle || 'Smart wholesale inventory, POS, and financial management.';
    const logoUrl = companySettings.logoUrl;

    // Tab state: 'login' or 'register'
    const [activeTab, setActiveTab] = useState('register');

    // Password visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form inputs
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // Update browser title
    useEffect(() => {
        if (companyName) {
            document.title = `${companyName} ERP System`;
        }
    }, [companyName]);

    // Login Mutation
    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (response) => {
            const { token, ...user } = response.data;
            login(user, token);
            toast.success(`Welcome back, ${user.firstName || user.fullName || 'User'}!`);
            if (user.role === 'customer') {
                navigate('/price-checker');
            } else {
                navigate('/dashboard');
            }
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(message);
        },
    });

    // Register Mutation
    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: (response) => {
            const data = response.data;
            if (data?.token) {
                const { token, ...user } = data;
                login(user, token);
                toast.success(response.message || 'Account created successfully!');
                navigate(user.role === 'customer' ? '/price-checker' : '/dashboard');
            } else {
                toast.success('Account created successfully! Please sign in.');
                setActiveTab('login');
                setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            }
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Registration failed. Please check your information.';
            toast.error(message);
        },
    });

    // If already logged in, redirect
    if (isAuthenticated) {
        const user = useAuthStore.getState().user;
        return <Navigate to={user?.role === 'customer' ? '/price-checker' : '/dashboard'} replace />;
    }

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Please enter both email and password');
            return;
        }
        loginMutation.mutate({
            email: formData.email.trim(),
            password: formData.password,
        });
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (!formData.fullName.trim()) {
            toast.error('Please enter your full name');
            return;
        }
        if (!formData.email.trim()) {
            toast.error('Please enter your email address');
            return;
        }
        if (!formData.password) {
            toast.error('Please enter a password');
            return;
        }
        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters with upper, lower, & numbers');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const nameParts = formData.fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || firstName;

        registerMutation.mutate({
            firstName,
            lastName,
            email: formData.email.trim(),
            password: formData.password,
        });
    };

    const companyDomain = companyName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company';

    return (
        <div className="relative min-h-screen w-full bg-[#f8f9ff] text-gray-800 flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden selection:bg-purple-500 selection:text-white">
            {/* Background Ambient Glow & Organic Blobs matching sample */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-200/40 via-indigo-200/30 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-fuchsia-200/40 via-pink-100/30 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-[5%] left-[20%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-blue-100/40 via-purple-100/20 to-transparent blur-2xl pointer-events-none" />

            {/* Subtle floating background curve circles like the sample */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
                <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="200" cy="450" r="320" stroke="url(#paint0_radial)" strokeWidth="1.5" strokeDasharray="6 6" />
                    <circle cx="200" cy="450" r="480" stroke="url(#paint1_radial)" strokeWidth="1" />
                    <circle cx="1200" cy="700" r="400" stroke="url(#paint2_radial)" strokeWidth="1.5" />
                    <defs>
                        <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 450) scale(320)">
                            <stop stopColor="#a855f7" stopOpacity="0.4" />
                            <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 450) scale(480)">
                            <stop stopColor="#c084fc" stopOpacity="0.25" />
                            <stop offset="1" stopColor="#ec4899" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1200 700) scale(400)">
                            <stop stopColor="#818cf8" stopOpacity="0.3" />
                            <stop offset="1" stopColor="#d946ef" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                
                {/* ── LEFT HERO COLUMN ── */}
                <div className="lg:col-span-6 flex flex-col justify-center space-y-8 pr-0 lg:pr-6 text-left">
                    
                    {/* Brand Lockup */}
                    <div className="flex items-center gap-3.5">
                        {logoUrl ? (
                            <div className="h-14 max-w-[220px] flex items-center justify-start">
                                <img
                                    src={logoUrl}
                                    alt={companyName}
                                    className="max-h-14 max-w-full object-contain filter drop-shadow-sm"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                {/* Sample-style circular ribbon logo */}
                                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-600 to-fuchsia-500 p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center">
                                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                        <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-fuchsia-600 bg-clip-text text-transparent">
                                            {companyName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
                                        {companyName}
                                    </h2>
                                    <p className="text-[10px] font-bold text-fuchsia-600 tracking-widest uppercase mt-1">
                                        {tagline}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ERP Heading & Tagline */}
                    <div className="space-y-3">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.1]">
                            <span>{companyName} </span>
                            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                                ERP System
                            </span>
                        </h1>
                        <p className="text-gray-500 text-base md:text-lg max-w-md font-normal leading-relaxed">
                            {subtitle}
                        </p>
                    </div>

                    {/* 3 Core Feature Pills (Matching Sample UI) */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4 pt-2">
                        {/* 1. Real-Time POS */}
                        <div className="flex flex-col items-center text-center group cursor-default">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-fuchsia-50 border border-fuchsia-100/80 flex items-center justify-center text-fuchsia-600 shadow-sm transition transform group-hover:scale-105 group-hover:shadow-md mb-2">
                                <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 stroke-[2.2]" />
                            </div>
                            <span className="text-xs md:text-sm font-bold text-gray-800 leading-tight">
                                Real-Time POS
                            </span>
                        </div>

                        {/* 2. Multi-Warehouse Stock */}
                        <div className="flex flex-col items-center text-center group cursor-default">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shadow-sm transition transform group-hover:scale-105 group-hover:shadow-md mb-2">
                                <Boxes className="w-6 h-6 md:w-7 md:h-7 stroke-[2.2]" />
                            </div>
                            <span className="text-xs md:text-sm font-bold text-gray-800 leading-tight">
                                Multi-Warehouse<br className="hidden md:inline" /> Stock
                            </span>
                        </div>

                        {/* 3. Integrated Finance */}
                        <div className="flex flex-col items-center text-center group cursor-default">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-purple-50 border border-purple-100/80 flex items-center justify-center text-purple-600 shadow-sm transition transform group-hover:scale-105 group-hover:shadow-md mb-2">
                                <BarChart3 className="w-6 h-6 md:w-7 md:h-7 stroke-[2.2]" />
                            </div>
                            <span className="text-xs md:text-sm font-bold text-gray-800 leading-tight">
                                Integrated Finance
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT AUTH CARD COLUMN (Matching Sample UI) ── */}
                <div className="lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none">
                    <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] border border-purple-100/80 shadow-[0_20px_50px_rgba(147,51,234,0.08)] p-6 md:p-10 transition-all">
                        
                        {/* Segmented Top Toggle Switch */}
                        <div className="bg-gray-100/80 p-1.5 rounded-2xl flex items-center mb-8 border border-gray-200/50">
                            <button
                                type="button"
                                onClick={() => setActiveTab('login')}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                    activeTab === 'login'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('register')}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                    activeTab === 'register'
                                        ? 'bg-gradient-to-r from-purple-50 to-fuchsia-50 text-purple-700 font-bold border border-purple-200/60 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Title and Subtitle */}
                        <div className="mb-6">
                            {activeTab === 'register' ? (
                                <>
                                    <h2 className="text-2xl font-black text-gray-950 tracking-tight">
                                        Create your account
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Join {companyName} and streamline your business.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-black text-gray-950 tracking-tight">
                                        Welcome back
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Sign in to access your {companyName} dashboard.
                                    </p>
                                </>
                            )}
                        </div>

                        {/* ── SIGN UP FORM ── */}
                        {activeTab === 'register' && (
                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition text-gray-900 placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder={`you@${companyDomain}.com`}
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition text-gray-900 placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Create a password"
                                            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition text-gray-900 placeholder-gray-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm your password"
                                            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition text-gray-900 placeholder-gray-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={registerMutation.isPending}
                                    className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-500/30 hover:opacity-95 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {registerMutation.isPending ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Create Account</span>
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>

                                <div className="text-center pt-2">
                                    <p className="text-xs text-gray-500">
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('login')}
                                            className="font-bold text-purple-600 hover:text-purple-700 underline transition cursor-pointer"
                                        >
                                            Sign in
                                        </button>
                                    </p>
                                </div>
                            </form>
                        )}

                        {/* ── SIGN IN FORM ── */}
                        {activeTab === 'login' && (
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder={`you@${companyDomain}.com`}
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition text-gray-900 placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Password
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition text-gray-900 placeholder-gray-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loginMutation.isPending}
                                    className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-500/30 hover:opacity-95 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {loginMutation.isPending ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>

                                <div className="text-center pt-2">
                                    <p className="text-xs text-gray-500">
                                        Don't have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('register')}
                                            className="font-bold text-purple-600 hover:text-purple-700 underline transition cursor-pointer"
                                        >
                                            Sign Up
                                        </button>
                                    </p>
                                </div>
                            </form>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}
