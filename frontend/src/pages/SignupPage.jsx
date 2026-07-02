import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useForm } from '../hooks/useForm';

const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = 'Required';
    else if (values.name.length < 2) errors.name = 'At least 2 characters';
    if (!values.email) errors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Invalid email';
    if (!values.password) errors.password = 'Required';
    else if (values.password.length < 8) errors.password = 'Minimum 8 characters';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password))
        errors.password = 'Include upper, lower & a number';
    return errors;
};

export default function SignupPage() {
    const { register } = useAuthStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
        { name: '', email: '', password: '' }, validate
    );

    const onSubmit = handleSubmit(async (data) => {
        setServerError('');
        try { await register(data); navigate('/dashboard'); }
        catch (error) { setServerError(error.response?.data?.message || 'Registration failed.'); }
    });

    return (
        <div className="min-h-screen bg-paper-100 flex items-center justify-center px-4 paper-grain">
            <div className="w-full max-w-[380px] animate-rise">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 bg-paper-50 border border-ink-100">
                        <span className="font-serif text-[26px] text-ink-900" style={{ letterSpacing: '-0.04em' }}>E</span>
                    </div>
                    <h1 className="font-serif text-[26px] text-ink-900" style={{ letterSpacing: '-0.02em' }}>
                        Create your account
                    </h1>
                    <p className="text-ink-500 text-[13px] mt-1">A quiet place to review code.</p>
                </div>

                <div className="surface p-6 shadow-paper">
                    {serverError && (
                        <div className="mb-4 p-3 rounded-md text-[13px] text-brick flex items-center gap-2 bg-brick-muted border border-brick/20">
                            <AlertCircle size={13} /> {serverError}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-3.5" noValidate>
                        <div>
                            <label className="block text-[11.5px] text-ink-600 mb-1.5 font-medium">Name</label>
                            <input
                                name="name" type="text"
                                value={values.name} onChange={handleChange} onBlur={handleBlur}
                                placeholder="Jane Doe" autoComplete="name"
                                data-testid="signup-name"
                                className={`input ${touched.name && errors.name ? 'input-error' : ''}`}
                            />
                            {touched.name && errors.name && (
                                <p className="mt-1 text-[11.5px] text-brick">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-[11.5px] text-ink-600 mb-1.5 font-medium">Email</label>
                            <input
                                name="email" type="email"
                                value={values.email} onChange={handleChange} onBlur={handleBlur}
                                placeholder="you@example.com" autoComplete="email"
                                data-testid="signup-email"
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
                                    placeholder="Min 8 chars, mixed case & a number"
                                    autoComplete="new-password"
                                    data-testid="signup-password"
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
                            data-testid="signup-submit"
                            className="btn btn-primary w-full !py-2.5 mt-2"
                        >
                            {isSubmitting ? (<><Loader2 size={13} className="animate-spin" /> Creating…</>) : 'Create account'}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-[13px] text-ink-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-clay-600 hover:text-clay-700 underline underline-offset-2 decoration-clay-200 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
