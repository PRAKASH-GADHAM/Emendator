import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutGrid, PenLine, Clock, LogOut, Menu, X } from 'lucide-react';

// Small serif-mark logo — no gradient, no zap icon
function Mark({ size = 28 }) {
    return (
        <div
            className="flex items-center justify-center font-serif font-semibold text-ink-900"
            style={{
                width: size, height: size,
                background: '#f5f2ec',
                border: '1px solid #e5e0d8',
                borderRadius: 6,
                fontSize: size * 0.5,
                letterSpacing: '-0.03em',
            }}
            data-testid="brand-mark"
        >
            E
        </div>
    );
}

export default function Navigation() {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navLinks = [
        { to: '/dashboard', label: 'Overview',    icon: LayoutGrid,  testid: 'nav-dashboard' },
        { to: '/review',    label: 'New review',  icon: PenLine,     testid: 'nav-review'    },
        { to: '/history',   label: 'History',     icon: Clock,       testid: 'nav-history'   },
    ];

    const handleLogout = async () => { await logout(); navigate('/login'); };

    const isActive = (path) =>
        path === '/dashboard'
            ? location.pathname === '/dashboard'
            : location.pathname.startsWith(path);

    const links = (onNav) => navLinks.map(({ to, label, icon: Icon, testid }) => {
        const active = isActive(to);
        return (
            <Link
                key={to}
                to={to}
                onClick={onNav}
                data-testid={testid}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] transition-colors ${
                    active
                        ? 'bg-paper-200 text-ink-900 font-medium'
                        : 'text-ink-600 hover:text-ink-900 hover:bg-paper-200/70'
                }`}
            >
                <Icon size={15} strokeWidth={active ? 2.2 : 1.7} />
                <span>{label}</span>
                {active && <span className="ml-auto w-1 h-1 rounded-full bg-clay-500" />}
            </Link>
        );
    });

    return (
        <>
            {/* Desktop sidebar */}
            <aside
                data-testid="sidebar"
                className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 border-r border-ink-100 bg-paper-50 z-40"
            >
                <div className="h-14 flex items-center px-5 border-b border-ink-100">
                    <Link to="/dashboard" className="flex items-center gap-2.5 group" data-testid="brand-link">
                        <Mark size={26} />
                        <span className="font-serif text-[17px] text-ink-900 tracking-tight">Emendator</span>
                    </Link>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-0.5">{links()}</nav>

                <div className="p-3 border-t border-ink-100">
                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-md">
                        <div className="w-7 h-7 rounded-full bg-clay-100 text-clay-700 text-[11px] font-medium flex items-center justify-center shrink-0 font-mono">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[12px] font-medium text-ink-900 truncate">{user?.name || 'User'}</p>
                            <p className="text-[10.5px] text-ink-500 truncate">{user?.email || '—'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        data-testid="logout-btn"
                        className="mt-1 w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-ink-600 hover:text-brick hover:bg-brick-muted/50 transition-colors"
                    >
                        <LogOut size={14} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Mobile topbar */}
            <header className="md:hidden h-14 fixed top-0 inset-x-0 border-b border-ink-100 bg-paper-50/90 backdrop-blur flex items-center justify-between px-4 z-40">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <Mark size={24} />
                    <span className="font-serif text-[15px] text-ink-900">Emendator</span>
                </Link>
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="btn-plain"
                    data-testid="mobile-menu-open"
                >
                    <Menu size={18} />
                </button>
            </header>

            {/* Mobile drawer */}
            {drawerOpen && (
                <>
                    <div
                        className="md:hidden fixed inset-0 bg-ink-900/20 backdrop-blur-[2px] z-50"
                        onClick={() => setDrawerOpen(false)}
                    />
                    <div className="md:hidden fixed top-0 bottom-0 right-0 w-72 max-w-[82vw] bg-paper-50 border-l border-ink-100 z-50 flex flex-col p-4 animate-rise">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-serif text-[16px] text-ink-900">Emendator</span>
                            <button onClick={() => setDrawerOpen(false)} className="btn-plain">
                                <X size={18} />
                            </button>
                        </div>
                        <nav className="flex-1 space-y-1">{links(() => setDrawerOpen(false))}</nav>
                        <div className="pt-3 border-t border-ink-100">
                            <div className="flex items-center gap-2.5 px-2 py-2">
                                <div className="w-8 h-8 rounded-full bg-clay-100 text-clay-700 text-xs font-medium flex items-center justify-center font-mono">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] font-medium text-ink-900 truncate">{user?.name}</p>
                                    <p className="text-[11px] text-ink-500 truncate">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setDrawerOpen(false); handleLogout(); }}
                                className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-ink-600 hover:text-brick hover:bg-brick-muted/50"
                            >
                                <LogOut size={14} /> Sign out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
