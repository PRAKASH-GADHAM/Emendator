import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Play, Loader2, RotateCcw, ChevronDown, Lightbulb,
    FileCode2, CheckCircle2, XCircle, Clock, Cpu,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLeetCodeStore } from '../store/leetcodeStore';
import { getScoreColor, getLanguageIcon } from '../../../utils/helpers';
import ScoreRing from '../../../components/ScoreRing';
import ProblemStatement from '../components/ProblemStatement';
import TestCasePanel from '../components/TestCasePanel';
import LeetCodeAIReview, { ReviewLoading } from '../components/LeetCodeAIReview';

const LeetCodeEditor = lazy(() => import('../components/LeetCodeEditor'));

const SUPPORTED_LANGUAGES = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
    'go', 'rust', 'swift', 'kotlin', 'csharp', 'ruby',
];

const TABS = [
    { id: 'editor',   label: 'Editor',        icon: FileCode2 },
    { id: 'results',  label: 'Test Results',  icon: CheckCircle2 },
    { id: 'review',   label: 'AI Review',     icon: Lightbulb },
];

const EditorSkeleton = () => (
    <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clay-500 mx-auto mb-3" />
            <p className="text-ink-400 text-[12.5px] font-mono">Loading editor…</p>
        </div>
    </div>
);

function ProgressIndicator() {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-6 bg-white px-8">
            <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-clay-200 animate-spin"
                    style={{ borderTopColor: '#c96442', animationDuration: '1s' }} />
                <div className="absolute w-12 h-12 rounded-full border-2 border-ink-100 animate-spin"
                    style={{ borderBottomColor: '#7a7370', animationDuration: '1.4s', animationDirection: 'reverse' }} />
                <Cpu size={14} className="absolute text-clay-500" />
            </div>
            <div className="text-center max-w-xs">
                <p className="text-ink-900 font-semibold text-[14px] mb-1">Consulting 3 AI Models…</p>
                <p className="text-ink-400 text-[12px]">Running your solution, then generating the consensus review</p>
            </div>
        </div>
    );
}

export default function LeetCodeProblemPage() {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const {
        currentProblem, isSearching, isRunning, isReviewing,
        executionResult, executionError, reviewResult, reviewError, reviewedCode,
        selectedLanguage, code,
        fetchProblem, runCode, submitCode, reviewCode, setLanguage, setCode,
        resetExecution, resetReview,
    } = useLeetCodeStore();

    const [activeTab, setActiveTab] = useState('editor');
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [splitRatio, setSplitRatio] = useState(50);

    useEffect(() => {
        if (problemId) {
            fetchProblem(problemId);
        }
    }, [problemId, fetchProblem]);

    useEffect(() => {
        if (isRunning) setActiveTab('results');
    }, [isRunning]);

    useEffect(() => {
        if (isReviewing) setActiveTab('review');
    }, [isReviewing]);

    useEffect(() => {
        if (executionResult && !isRunning) setActiveTab('results');
    }, [executionResult, isRunning]);

    useEffect(() => {
        if (executionError && !isRunning) setActiveTab('results');
    }, [executionError, isRunning]);

    useEffect(() => {
        if (reviewResult && !isReviewing) setActiveTab('review');
    }, [reviewResult, isReviewing]);

    useEffect(() => {
        if (reviewError && !reviewResult && !isReviewing) setActiveTab('review');
    }, [reviewError, reviewResult, isReviewing]);

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setLangDropdownOpen(false);
    };

    const handleCodeChange = useCallback((val) => {
        setCode(val || '');
    }, [setCode]);

    const handleResetCode = () => {
        const starterCode = currentProblem?.starterCode?.[selectedLanguage] || '';
        setCode(starterCode);
        resetExecution();
        resetReview();
    };

    const handleRun = () => {
        if (!code.trim()) {
            toast.error('Please write some code first');
            return;
        }
        runCode();
    };

    const handleSubmit = () => {
        if (!code.trim()) {
            toast.error('Please write some code first');
            return;
        }
        submitCode();
    };

    const handleReview = () => {
        if (!code.trim()) {
            toast.error('Please write some code first');
            return;
        }
        reviewCode();
    };

    const handleRetryReview = () => {
        if (!code.trim()) {
            toast.error('Please write some code first');
            return;
        }
        reviewCode();
    };

    const isReviewStale = !!reviewResult && reviewedCode != null && code !== reviewedCode;

    if (isSearching && !currentProblem) {
        return (
            <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen bg-paper-100">
                <div className="flex items-center gap-3 px-4 h-12 bg-paper-50 border-b border-ink-100 flex-shrink-0">
                    <button onClick={() => navigate('/leetcode')} className="btn btn-ghost !px-2 !py-1.5 !text-[12px]">
                        <ArrowLeft size={14} />
                    </button>
                    <div className="h-4 w-48 shimmer rounded" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clay-500 mx-auto mb-3" />
                        <p className="text-ink-400 text-[13px]">Loading problem…</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentProblem) {
        return (
            <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen bg-paper-100">
                <div className="flex items-center gap-3 px-4 h-12 bg-paper-50 border-b border-ink-100 flex-shrink-0">
                    <button onClick={() => navigate('/leetcode')} className="btn btn-ghost !px-2 !py-1.5 !text-[12px]">
                        <ArrowLeft size={14} />
                    </button>
                </div>
                <div className="flex-1 flex items-center justify-center text-center">
                    <p className="text-ink-500">Problem not found</p>
                </div>
            </div>
        );
    }

    const diffColor = {
        Easy: 'text-sage bg-sage-muted border-sage/15',
        Medium: 'text-ochre bg-ochre-muted border-ochre/15',
        Hard: 'text-brick bg-brick-muted border-brick/15',
    }[currentProblem.difficulty] || 'text-ink-500 bg-paper-200 border-ink-200';

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen bg-paper-100 overflow-hidden">

            {/* ── Top Toolbar ── */}
            <div className="flex items-center gap-3 px-4 h-12 bg-paper-50 border-b border-ink-100 flex-shrink-0">
                <button
                    onClick={() => navigate('/leetcode')}
                    className="p-1.5 rounded-md text-ink-400 hover:text-ink-700 transition-colors hover:bg-paper-200"
                >
                    <ArrowLeft size={16} />
                </button>

                <span className="text-ink-400 text-[12px] font-mono">#{currentProblem.number}</span>
                <span className="text-ink-800 text-[13px] font-medium truncate max-w-[200px]">{currentProblem.title}</span>
                <span className={`chip text-[10px] border ${diffColor}`}>{currentProblem.difficulty}</span>

                <div className="flex-1" />

                {/* Language selector */}
                <div className="relative">
                    <button
                        onClick={() => setLangDropdownOpen((o) => !o)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-mono text-ink-700 transition-all hover:text-ink-900 hover:bg-paper-200 border border-ink-100"
                    >
                        <span className="text-ink-400">{getLanguageIcon(selectedLanguage)}</span>
                        <span className="capitalize">{selectedLanguage}</span>
                        <ChevronDown size={13} className="text-ink-400" />
                    </button>

                    {langDropdownOpen && (
                        <div className="absolute top-full right-0 mt-1 z-50 w-40 rounded-lg overflow-hidden surface shadow-lift">
                            <div className="max-h-60 overflow-y-auto py-1">
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => handleLanguageChange(lang)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] text-left transition-colors hover:bg-paper-100 ${
                                            selectedLanguage === lang ? 'text-clay-600 font-medium' : 'text-ink-700'
                                        }`}
                                    >
                                        <span className="text-ink-400 font-mono text-[11px]">{getLanguageIcon(lang)}</span>
                                        <span className="capitalize">{lang}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Reset */}
                <button
                    onClick={handleResetCode}
                    disabled={isRunning || isReviewing}
                    className="p-2 rounded-md text-ink-400 hover:text-ink-700 transition-colors hover:bg-paper-200 disabled:opacity-40"
                    title="Reset to starter code"
                >
                    <RotateCcw size={15} />
                </button>

                {/* Run button */}
                <button
                    onClick={handleRun}
                    disabled={isRunning || isReviewing}
                    className="btn btn-ghost !px-3 !py-1.5 !text-[13px]"
                    title="Run against the problem's test cases"
                >
                    {isRunning ? (
                        <>
                            <Loader2 size={13} className="animate-spin" />
                            Running…
                        </>
                    ) : (
                        <>
                            <Play size={13} fill="currentColor" />
                            Run
                        </>
                    )}
                </button>

                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    disabled={isRunning || isReviewing}
                    className="btn btn-primary !px-3 !py-1.5 !text-[13px]"
                    title="Submit your final solution against the full test suite"
                >
                    {isRunning ? (
                        <>
                            <Loader2 size={13} className="animate-spin" />
                            Submitting…
                        </>
                    ) : (
                        <>
                            <CheckCircle2 size={13} />
                            Submit
                        </>
                    )}
                </button>

                {/* Review button */}
                <button
                    onClick={handleReview}
                    disabled={isRunning || isReviewing}
                    className="btn btn-clay !px-3 !py-1.5 !text-[13px]"
                >
                    {isReviewing ? (
                        <>
                            <Loader2 size={13} className="animate-spin" />
                            Reviewing…
                        </>
                    ) : (
                        <>
                            <Lightbulb size={13} />
                            Review
                        </>
                    )}
                </button>
            </div>

            {/* ── Main Split Layout ── */}
            <div className="flex flex-1 overflow-hidden">

                {/* LEFT — Problem Statement */}
                <div
                    className="flex flex-col border-r border-ink-100 min-w-0 overflow-y-auto"
                    style={{ width: `${splitRatio}%` }}
                >
                    <ProblemStatement problem={currentProblem} />
                </div>

                {/* Resize handle */}
                <div
                    className="w-1 cursor-col-resize bg-ink-100 hover:bg-clay-400 transition-colors flex-shrink-0"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        const startX = e.clientX;
                        const containerWidth = e.target.parentElement.offsetWidth;
                        const startRatio = splitRatio;

                        const onMove = (ev) => {
                            const delta = ev.clientX - startX;
                            const newRatio = Math.min(75, Math.max(25, startRatio + (delta / containerWidth) * 100));
                            setSplitRatio(newRatio);
                        };
                        const onUp = () => {
                            document.removeEventListener('mousemove', onMove);
                            document.removeEventListener('mouseup', onUp);
                        };
                        document.addEventListener('mousemove', onMove);
                        document.addEventListener('mouseup', onUp);
                    }}
                />

                {/* RIGHT — Editor / Results / Review */}
                <div
                    className="flex flex-col min-w-0"
                    style={{ width: `${100 - splitRatio}%` }}
                >
                    {/* Tab bar */}
                    <div className="flex items-center border-b border-ink-100 bg-paper-50 flex-shrink-0">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            const badge = tab.id === 'results' && executionResult
                                ? (executionResult.passed ? executionResult.testCases?.length : '!')
                                : tab.id === 'review' && reviewResult
                                    ? getScoreColor(reviewResult.score).label
                                    : null;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium transition-all border-b-2 ${
                                        isActive
                                            ? 'text-clay-600 border-clay-500'
                                            : 'text-ink-400 border-transparent hover:text-ink-700'
                                    }`}
                                >
                                    <Icon size={12} />
                                    {tab.label}
                                    {badge != null && (
                                        <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                                            tab.id === 'results'
                                                ? 'bg-sage-muted text-sage'
                                                : 'bg-clay-50 text-clay-600'
                                        }`}>
                                            {badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab content */}
                    <div className="flex-1 overflow-hidden">
                        {activeTab === 'editor' && (
                            <Suspense fallback={<EditorSkeleton />}>
                                <LeetCodeEditor
                                    value={code}
                                    onChange={handleCodeChange}
                                    language={selectedLanguage}
                                    readOnly={isRunning || isReviewing}
                                />
                            </Suspense>
                        )}

                        {activeTab === 'results' && (
                            <TestCasePanel result={executionResult} isRunning={isRunning} error={executionError} />
                        )}

                        {activeTab === 'review' && (
                            isReviewing ? (
                                <ReviewLoading />
                            ) : (
                                <LeetCodeAIReview
                                    review={reviewResult}
                                    error={reviewError}
                                    isStale={isReviewStale}
                                    onRetry={handleRetryReview}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Close dropdown on outside click */}
            {langDropdownOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
            )}
        </div>
    );
}
