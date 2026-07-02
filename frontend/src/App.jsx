import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy-loaded Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const OAuthCallbackPage = lazy(() => import('./pages/OAuthCallbackPage'));
const EditReviewPage = lazy(() => import('./pages/EditReviewPage'));

function PageLoader() {
    return (
        <div className="min-h-screen bg-paper-100 flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading…" />
        </div>
    );
}

// Shell Layout for authenticated pages
function AppLayout() {
    return (
        <div className="min-h-screen bg-paper-100 text-ink-900 flex flex-col">
            <Navigation />
            {/*
              On desktop: padding-left matching sidebar width (pl-60).
              On mobile/tablet: padding-top matching topbar height (pt-14).
            */}
            <div className="flex-1 flex flex-col md:pl-60 pt-14 md:pt-0 min-h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default function App() {
    const { checkAuth, isLoading } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#ffffff',
                        color: '#1a1815',
                        border: '1px solid #e5e0d8',
                        borderRadius: '8px',
                        boxShadow: '0 2px 12px rgba(60,50,40,0.08), 0 1px 3px rgba(60,50,40,0.05)',
                        fontSize: '13.5px',
                        fontFamily: "'Instrument Sans', sans-serif",
                    },
                    success: {
                        iconTheme: { primary: '#4b7a53', secondary: '#ffffff' },
                    },
                    error: {
                        iconTheme: { primary: '#b8483c', secondary: '#ffffff' },
                    },
                }}
            />

            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* ── Public routes ──────────────────────────────── */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* OAuth callback — public, no Navigation */}
                    <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

                    {/* ── Protected routes (with Navigation Layout) ──── */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppLayout />}>
                            {/* Dashboard */}
                            <Route path="/dashboard" element={<DashboardPage />} />

                            {/* Review */}
                            <Route path="/review" element={<ReviewPage />} />

                            {/* Edit review */}
                            <Route path="/review/:id/edit" element={<EditReviewPage />} />

                            {/* History */}
                            <Route path="/history" element={<HistoryPage />} />
                        </Route>
                    </Route>

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Suspense>
        </>
    );
}
