import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AlertCircle } from 'lucide-react';

const ERROR_MESSAGES = {
    oauth_denied: 'You cancelled the sign-in. Please try again.',
    oauth_state_invalid: 'Security validation failed. Please try signing in again.',
    oauth_no_code: 'OAuth sign-in was incomplete. Please try again.',
    oauth_no_email: 'Could not retrieve your email from the OAuth provider.',
    oauth_failed: 'OAuth sign-in failed. Please try again or use email/password.',
    no_token: 'No authentication token received. Please try again.',
};

export default function OAuthCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuthStore();
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            const msg = ERROR_MESSAGES[error] || 'Sign-in failed. Please try again.';
            setErrorMsg(msg);
            const t = setTimeout(() => navigate('/login'), 3500);
            return () => clearTimeout(t);
        }

        if (!token) {
            setErrorMsg(ERROR_MESSAGES.no_token);
            const t = setTimeout(() => navigate('/login'), 3500);
            return () => clearTimeout(t);
        }

        loginWithToken(token)
            .then(() => navigate('/dashboard'))
            .catch(() => {
                setErrorMsg(ERROR_MESSAGES.oauth_failed);
                setTimeout(() => navigate('/login'), 3500);
            });
    }, []); // eslint-disable-line

    if (errorMsg) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-paper-100 px-6 paper-grain">
                <div className="text-center max-w-sm animate-rise">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 bg-brick-muted border border-brick/20">
                        <AlertCircle size={22} className="text-brick" />
                    </div>
                    <h2 className="font-serif text-[19px] text-ink-900 mb-2" style={{ letterSpacing: '-0.015em' }}>
                        Sign-in failed
                    </h2>
                    <p className="text-ink-500 text-[13px] mb-4">{errorMsg}</p>
                    <p className="text-ink-400 text-[11.5px] font-mono">Redirecting to login…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-paper-100 paper-grain">
            <div className="text-center animate-rise">
                <div className="relative w-14 h-14 mx-auto mb-5">
                    <div className="absolute inset-0 rounded-full border-2 border-clay-200 animate-spin"
                        style={{ borderTopColor: '#c96442' }} />
                    <div className="absolute inset-1 rounded-full border-2 border-ink-100 animate-spin"
                        style={{ borderBottomColor: '#7a7370', animationDuration: '1.3s', animationDirection: 'reverse' }} />
                </div>
                <p className="text-ink-900 font-medium text-[14px]">Completing sign-in…</p>
                <p className="text-ink-500 text-[12.5px] mt-1">You'll be redirected automatically</p>
            </div>
        </div>
    );
}
