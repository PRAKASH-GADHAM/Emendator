import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useForm } from '../hooks/useForm';
import { getGoogleAuthUrl, getGithubAuthUrl } from '../api/auth.api';

const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Invalid email';
    if (!values.password) errors.password = 'Required';
    return errors;
};

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [oauthLoading, setOAuthLoading] = useState(null);

    const oauthError = searchParams.get('error');
    const oauthErrorMessages = {
        oauth_denied: 'Sign-in was cancelled.',
        oauth_state_invalid: 'Security error. Please try again.',
        oauth_no_email: 'Could not get email from provider.',
        oauth_failed: 'OAuth sign-in failed. Please try again.',
    };

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
        { email: '', password: '' }, validate
    );

    const onSubmit = handleSubmit(async (formValues) => {
        try { await login(formValues); navigate('/dashboard'); } catch (e) {}
    });

    return (
        <div className="min-h-screen bg-paper-100 flex items-center justify-center px-4 paper-grain">
            <div className="w-full max-w-[380px] animate-rise">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 bg-paper-50 border border-ink-100">
                        <span className="font-serif text-[26px] text-ink-900" style={{ letterSpacing: '-0.04em' }}>E</span>
                    </div>
                    <h1 className="font-serif text-[26px] text-ink-900" style={{ letterSpacing: '-0.02em' }}>
                        Welcome back
                    </h1>
                    <p className="text-ink-500 text-[13px] mt-1">Sign in to Emendator</p>
                </div>

                {oauthError && oauthErrorMessages[oauthError] && (
                    <div className="mb-4 p-3 rounded-md text-[13px] text-brick flex items-center gap-2 bg-brick-muted border border-brick/20">
                        <AlertCircle size={13} /> {oauthErrorMessages[oauthError]}
                    </div>
                )}

                <div className="surface p-6 shadow-paper">
                    <div className="grid grid-cols-2 gap-2.5 mb-5">
                        <button
                            onClick={() => { setOAuthLoading('google'); window.location.href = getGoogleAuthUrl(); }}
                            disabled={!!oauthLoading}
                            data-testid="google-signin-btn"
                            className="btn btn-ghost !py-2.5 !text-[13px]"
                        >
                            {oauthLoading === 'google' ? (
                                <Loader2 size={13} className="animate-spin" />
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                            )}
                            Google
                        </button>
                        <button
                            onClick={() => { setOAuthLoading('github'); window.location.href = getGithubAuthUrl(); }}
                            disabled={!!oauthLoading}
                            data-testid="github-signin-btn"
                            className="btn btn-ghost !py-2.5 !text-[13px]"
                        >
                            {oauthLoading === 'github' ? (
                                <Loader2 size={13} className="animate-spin" />
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#1a1815">
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                </svg>
                            )}
                            GitHub
                        </button>
                    </div>

                    <div className="relative flex items-center justify-center mb-5">
                        <div className="absolute inset-x-0 h-px bg-ink-100" />
                        <span className="relative bg-white px-3 text-[11px] uppercase tracking-[0.14em] text-ink-400">
                            or with email
                        </span>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-3.5" noValidate>
                        <div>
                            <label className="block text-[11.5px] text-ink-600 mb-1.5 font-medium">Email</label>
                            <input
                                name="email" type="email"
                                value={values.email} onChange={handleChange} onBlur={handleBlur}
                                placeholder="you@example.com" autoComplete="email"
                                data-testid="login-email"
                                className={`input ${touched.email && errors.email ? 'input-error' : ''}`}
                            />
                            {touched.email && errors.email && (
                                <p className="mt-1 text-[11.5px] text-brick">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-[11.5px] text-ink-600 mb-1.5 font-medium">Password</label>
                            <div className="relative">
                                <input
                                    name="password" type={showPassword ? 'text' : 'password'}
                                    value={values.password} onChange={handleChange} onBlur={handleBlur}
                                    placeholder="••••••••" autoComplete="current-password"
                                    data-testid="login-password"
                                    className={`input pr-10 ${touched.password && errors.password ? 'input-error' : ''}`}
                                />
                                <button
                                    type="button" onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
                                >
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <p className="mt-1 text-[11.5px] text-brick">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit" disabled={isSubmitting}
                            data-testid="login-submit"
                            className="btn btn-primary w-full !py-2.5 mt-2"
                        >
                            {isSubmitting ? (<><Loader2 size={13} className="animate-spin" /> Signing in…</>) : 'Sign in'}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-[13px] text-ink-500">
                    New to Emendator?{' '}
                    <Link to="/signup" className="text-clay-600 hover:text-clay-700 underline underline-offset-2 decoration-clay-200 font-medium">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
