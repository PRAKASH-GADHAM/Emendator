import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, Clock, TrendingUp, FileText, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useReviewStore } from '../store/reviewStore';
import StatsCard from '../components/StatsCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { getScoreColor, formatDate, getLanguageIcon } from '../utils/helpers';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const {
        history = [], pagination = {}, isLoadingHistory = false, fetchHistory,
    } = useReviewStore();

    useEffect(() => { fetchHistory({ page: 1, limit: 10 }); }, [fetchHistory]);

    const avgScore = history.length > 0
        ? Math.round(history.reduce((sum, r) => sum + r.score, 0) / history.length)
        : 0;

    const recentReviews = history.slice(0, 5);

    return (
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
            <div className="mb-10 animate-fade-in">
                <p className="prompt-line mb-1.5" data-testid="dashboard-greeting">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <h1 className="font-serif text-[34px] leading-[1.1] text-ink-900" style={{ letterSpacing: '-0.025em' }}>
                    Good to see you, {user?.name?.split(' ')[0] || 'friend'}.
                </h1>
                <p className="text-ink-500 text-[14px] mt-2 max-w-lg">
                    Pick up where you left off, or start a new review.
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
                <StatsCard icon={FileText}    label="Reviews"    value={pagination?.total ?? '—'} trend="All time" />
                <StatsCard icon={TrendingUp}  label="Avg score"  value={avgScore > 0 ? avgScore : '—'}
                    color={avgScore > 0 ? getScoreColor(avgScore).hex : '#c96442'}
                    trend={history.length > 0 ? getScoreColor(avgScore).label : 'Not enough data'}
                />
                <StatsCard icon={PenLine}     label="Last language"
                    value={history[0]?.language ? <span className="capitalize font-mono text-[22px]">{history[0].language}</span> : '—'}
                    trend={history[0]?.language ? 'From last review' : 'No reviews yet'}
                />
                <StatsCard icon={Clock}       label="Analyses"   value={pagination?.total ?? '—'} trend="Local model" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
                <Link to="/review" className="surface surface-hover p-5 group flex items-start justify-between" data-testid="quick-new-review">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <PenLine size={14} className="text-clay-500" strokeWidth={1.8} />
                            <span className="font-medium text-[14px] text-ink-900">New review</span>
                        </div>
                        <p className="text-[12.5px] text-ink-500">Paste code and get grounded feedback.</p>
                    </div>
                    <ArrowUpRight size={16} className="text-ink-400 group-hover:text-clay-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </Link>
                <Link to="/history" className="surface surface-hover p-5 group flex items-start justify-between" data-testid="quick-history">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <Clock size={14} className="text-ink-600" strokeWidth={1.8} />
                            <span className="font-medium text-[14px] text-ink-900">Browse history</span>
                        </div>
                        <p className="text-[12.5px] text-ink-500">Everything you've reviewed, in one place.</p>
                    </div>
                    <ArrowUpRight size={16} className="text-ink-400 group-hover:text-ink-700 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </Link>
            </div>

            <div>
                <div className="flex items-baseline justify-between mb-4">
                    <h2 className="font-serif text-[20px] text-ink-900" style={{ letterSpacing: '-0.02em' }}>
                        Recent reviews
                    </h2>
                    {history.length > 0 && (
                        <Link to="/history" className="text-[12.5px] text-clay-600 hover:text-clay-700 underline underline-offset-2 decoration-clay-200">
                            View all
                        </Link>
                    )}
                </div>

                {isLoadingHistory ? (
                    <div className="space-y-2.5">{[1, 2, 3].map((i) => <SkeletonCard key={i} lines={2} />)}</div>
                ) : recentReviews.length === 0 ? (
                    <div className="surface p-12 text-center">
                        <p className="prompt-line inline-block mb-3">no reviews yet<span className="cursor" /></p>
                        <h3 className="font-serif text-[19px] text-ink-900 mb-1">A blank page.</h3>
                        <p className="text-ink-500 text-[13px] mb-5">Paste your first snippet to see it here.</p>
                        <Link to="/review" className="btn btn-clay">Start a review</Link>
                    </div>
                ) : (
                    <div className="surface divide-y divide-ink-100">
                        {recentReviews.map((review) => {
                            const { hex, label } = getScoreColor(review.score);
                            return (
                                <div key={review.id} className="p-4 flex items-center gap-4 hover:bg-paper-100/70 transition-colors">
                                    <div className="w-11 h-11 rounded-md flex items-center justify-center shrink-0 font-serif text-[16px]"
                                        style={{ background: `${hex}14`, border: `1px solid ${hex}30`, color: hex }}>
                                        {review.score}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5 text-[12.5px]">
                                            <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded bg-paper-200 text-ink-700">
                                                {getLanguageIcon(review.language)}
                                            </span>
                                            <span className="text-ink-700 capitalize">{review.language}</span>
                                            <span className="chip" style={{ background: `${hex}14`, color: hex }}>
                                                {label}
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-ink-500 font-mono truncate">
                                            {review.code.trim().slice(0, 80)}…
                                        </p>
                                    </div>
                                    <span className="text-[11.5px] text-ink-400 shrink-0 hidden sm:block">
                                        {formatDate(review.createdAt)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
