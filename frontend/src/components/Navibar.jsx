import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Code2, LayoutDashboard, History, LogOut, Menu, X, Zap } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/review', label: 'Review Code', icon: Code2 },
        { to: '/history', label: 'History', icon: History },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className="sticky top-0 z-50 border-b"
            style={{
                background: 'rgba(5, 5, 8, 0.85)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255,255,255,0.06)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                                <Zap size={16} className="text-white" />
                            </div>
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ boxShadow: '0 0 20px rgba(0,212,255,0.5)' }} />
                        </div>
                        <span className="font-bold text-lg text-gradient hidden sm:block">
                            CodeReviewer AI
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ to, label, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to)
                                    ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={16} />
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* User + Logout */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                            style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-300">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                        >
                            <LogOut size={16} />
                            <span className="hidden lg:block">Logout</span>
                        </button>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t animate-slide-up"
                    style={{
                        background: 'rgba(5, 5, 8, 0.98)',
                        borderColor: 'rgba(255,255,255,0.06)',
                    }}>
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map(({ to, label, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to)
                                    ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={16} />
                                {label}
                            </Link>
                        ))}
                        <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-3 px-4 py-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                    style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                                    {user?.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setMobileOpen(false); handleLogout(); }}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-all duration-200"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}