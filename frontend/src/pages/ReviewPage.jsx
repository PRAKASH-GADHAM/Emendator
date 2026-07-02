import { useState, useCallback, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Play, ChevronDown, AlertTriangle, Lightbulb, Star,
    Loader2, GitCompare, Code2, RotateCcw, Shield, Zap,
    Wind, RefreshCw, BarChart2, BookOpen, CheckCircle2,
    ChevronUp, Cpu, TrendingUp, Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useReviewStore, REVIEW_PROGRESS_STEPS } from '../store/reviewStore';
import { getScoreColor, getLanguageIcon } from '../utils/helpers';
import ScoreRing from '../components/ScoreRing';

// Lazy load heavy Monaco components
const CodeEditor = lazy(() => import('../components/CodeEditor'));
const DiffEditor = lazy(() => import('../components/DiffEditor'));

const SUPPORTED_LANGUAGES = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
    'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin',
    'html', 'css', 'sql', 'bash', 'other',
];

const DEFAULT_CODE = {
    javascript: `// Paste your code here or start typing...\nfunction greet(name) {\n    console.log("Hello, " + name);\n}\n\ngreet("World");`,
    python: `# Paste your code here...\ndef greet(name):\n    print("Hello, " + name)\n\ngreet("World")`,
    typescript: `// Paste your code here...\nfunction greet(name: string): void {\n    console.log("Hello, " + name);\n}\n\ngreet("World");`,
};

const EditorSkeleton = () => (
    <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clay-500 mx-auto mb-3" />
            <p className="text-ink-400 text-[12.5px] font-mono">Loading editor…</p>
        </div>
    </div>
);

// ── Progress Indicator ────────────────────────────────────────────────────────

function ProgressIndicator({ progressStepIndex }) {
    const step = REVIEW_PROGRESS_STEPS[progressStepIndex] || REVIEW_PROGRESS_STEPS[0];
    const progressPct = ((progressStepIndex + 1) / REVIEW_PROGRESS_STEPS.length) * 100;

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6 bg-white px-8">
            {/* Animated rings */}
            <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-clay-200 animate-spin"
                    style={{ borderTopColor: '#c96442', animationDuration: '1s' }} />
                <div className="absolute w-12 h-12 rounded-full border-2 border-ink-100 animate-spin"
                    style={{ borderBottomColor: '#7a7370', animationDuration: '1.4s', animationDirection: 'reverse' }} />
                <Cpu size={14} className="absolute text-clay-500" />
            </div>

            {/* Step label */}
            <div className="text-center max-w-xs">
                <p className="text-ink-900 font-semibold text-[14px] mb-1">{step.label}</p>
                <p className="text-ink-400 text-[12px]">{step.description}</p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-[220px]">
                <div className="flex justify-between text-[10px] text-ink-400 mb-1.5 font-mono">
                    <span>Step {progressStepIndex + 1}/{REVIEW_PROGRESS_STEPS.length}</span>
                    <span>{Math.round(progressPct)}%</span>
                </div>
                <div className="h-1 bg-paper-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-clay-500 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            {/* Steps list */}
            <div className="flex flex-col gap-1.5 w-full max-w-[220px]">
                {REVIEW_PROGRESS_STEPS.map((s, i) => (
                    <div key={s.id} className={`flex items-center gap-2 text-[11.5px] transition-all ${i === progressStepIndex ? 'text-clay-600 font-medium' : i < progressStepIndex ? 'text-ink-400 line-through opacity-60' : 'text-ink-300'}`}>
                        {i < progressStepIndex ? (
                            <CheckCircle2 size={11} className="text-sage flex-shrink-0" />
                        ) : i === progressStepIndex ? (
                            <div className="w-2.5 h-2.5 rounded-full bg-clay-500 flex-shrink-0 animate-pulse" />
                        ) : (
                            <div className="w-2.5 h-2.5 rounded-full bg-ink-200 flex-shrink-0" />
                        )}
                        <span>{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Collapsible Section ───────────────────────────────────────────────────────

function CollapsibleSection({ title, icon: Icon, count, colorClass, bgClass, borderClass, children, defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className={`rounded-lg border overflow-hidden ${borderClass}`}>
            <button
                onClick={() => setOpen((o) => !o)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left ${bgClass} transition-colors hover:opacity-90`}
            >
                <Icon size={12} className={colorClass} />
                <span className={`text-[11px] font-semibold uppercase tracking-[0.13em] ${colorClass}`}>{title}</span>
                {count != null && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${bgClass} ${colorClass} border ${borderClass}`}>
                        {count}
                    </span>
                )}
                <div className="ml-auto">
                    {open ? <ChevronUp size={11} className={colorClass} /> : <ChevronDown size={11} className={colorClass} />}
                </div>
            </button>
            {open && <div className="px-3 py-2 space-y-1.5 bg-white">{children}</div>}
        </div>
    );
}

// ── Finding Item ──────────────────────────────────────────────────────────────

function FindingItem({ text, confidence, agreementCount, totalModels, accentColor }) {
    const showBadge = agreementCount != null && totalModels != null;
    return (
        <div className={`flex gap-2.5 p-2.5 rounded-md text-[12.5px] text-ink-700 bg-paper-50 border`}
            style={{ borderColor: `${accentColor}22` }}>
            <span className="flex-shrink-0 mt-0.5" style={{ color: accentColor }}>▸</span>
            <span className="flex-1 leading-relaxed">{text}</span>
            {showBadge && (
                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-1">
                    {agreementCount > 1 && (
                        <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-paper-200 text-ink-500">
                            {agreementCount}/{totalModels} models
                        </span>
                    )}
                    {confidence != null && (
                        <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded text-white"
                            style={{ background: confidence >= 80 ? '#b8483c' : confidence >= 60 ? '#c96442' : '#7a9a8a' }}>
                            {confidence}% confident
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Results Panel ─────────────────────────────────────────────────────────────

function ResultsPanel({ review, isAnalyzing, progressStepIndex, onNavigateHistory }) {
    if (isAnalyzing) {
        return <ProgressIndicator progressStepIndex={progressStepIndex} />;
    }

    if (!review) {
        return (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center bg-white">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-clay-50 border border-clay-100">
                    <Play size={22} className="text-clay-500 opacity-70" fill="currentColor" />
                </div>
                <p className="text-ink-700 font-medium text-[13.5px] mb-1">Ready to review</p>
                <p className="text-ink-400 text-[12.5px]">Write or paste your code on the left, then press <kbd>Run Review</kbd></p>
                <div className="mt-6 flex flex-col gap-2 text-left max-w-xs">
                    {[
                        { icon: Cpu, text: '3 AI models run simultaneously' },
                        { icon: TrendingUp, text: 'Consensus engine merges findings' },
                        { icon: Shield, text: 'Security, bugs & performance analysis' },
                        { icon: GitCompare, text: 'Diff view with improved code' },
                    ].map(({ icon: Icon, text }, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-[12px] text-ink-400 px-3 py-2 rounded-md bg-paper-50 border border-ink-100">
                            <Icon size={13} className="text-clay-400 flex-shrink-0" />
                            <span>{text}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const scoreColor = getScoreColor(review.score);
    const meta = review.metadata || {};

    // Support both new extended schema and legacy schema
    const bugs = meta.bugs || [];
    const performance = meta.performance || [];
    const security = meta.security || [];
    const codeSmells = meta.codeSmells || [];
    const refactoring = meta.refactoring || [];
    const complexity = meta.complexity || null;
    const executiveSummary = meta.executiveSummary || null;
    const modelsUsed = meta.modelsUsed || [];
    const overallConfidence = meta.overallConfidence ?? null;
    const reviewQualityScore = meta.reviewQualityScore ?? null;
    const issueConfidence = meta.issueConfidence || {};

    // Legacy fallback
    const legacyIssues = review.issues || [];
    const legacySuggestions = review.suggestions || [];
    const legacyLineFixes = review.lineFixes || [];
    const isLegacy = bugs.length === 0 && security.length === 0 && performance.length === 0;

    const totalFindings = bugs.length + performance.length + security.length + codeSmells.length + refactoring.length;
    const displayFindings = isLegacy ? (legacyIssues.length + legacySuggestions.length + legacyLineFixes.length) : totalFindings;

    return (
        <div className="h-full overflow-y-auto p-4 space-y-3 bg-white">

            {/* ── Score card ── */}
            <div className="flex items-center gap-4 p-4 surface rounded-lg">
                <ScoreRing score={review.score} size={68} strokeWidth={5} />
                <div className="flex-1 min-w-0">
                    <p className="text-ink-900 font-serif text-[17px]" style={{ letterSpacing: '-0.01em' }}>{scoreColor.label}</p>
                    <p className="text-ink-500 text-[11.5px] mt-0.5">
                        {displayFindings} finding{displayFindings !== 1 ? 's' : ''}
                        {modelsUsed.length > 0 && ` · ${modelsUsed.length} models`}
                    </p>
                    {overallConfidence != null && (
                        <div className="mt-1.5 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-paper-200 rounded-full overflow-hidden max-w-[100px]">
                                <div className="h-full rounded-full transition-all" style={{ width: `${overallConfidence}%`, background: overallConfidence >= 75 ? '#4b7a53' : overallConfidence >= 50 ? '#c96442' : '#b8483c' }} />
                            </div>
                            <span className="text-[10.5px] text-ink-400 font-mono">{overallConfidence}% confidence</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={onNavigateHistory}
                    className="text-[11.5px] text-clay-600 hover:text-clay-700 underline underline-offset-2 decoration-clay-200 flex-shrink-0"
                >
                    History →
                </button>
            </div>

            {/* ── Models used badge ── */}
            {modelsUsed.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-1">
                    {modelsUsed.map((m) => (
                        <span key={m} className="text-[10.5px] px-2 py-0.5 rounded-full bg-paper-100 text-ink-400 border border-ink-100 font-mono">
                            {m}
                        </span>
                    ))}
                    {reviewQualityScore != null && (
                        <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-clay-50 text-clay-600 border border-clay-100 font-mono ml-auto">
                            Quality: {reviewQualityScore}/100
                        </span>
                    )}
                </div>
            )}

            {/* ── Executive Summary ── */}
            {executiveSummary && (
                <CollapsibleSection
                    title="Executive Summary"
                    icon={BookOpen}
                    colorClass="text-ink-600"
                    bgClass="bg-paper-50"
                    borderClass="border-ink-100"
                >
                    <p className="text-[12.5px] text-ink-600 leading-relaxed italic px-1 py-1">
                        {executiveSummary}
                    </p>
                </CollapsibleSection>
            )}

            {/* ── New schema: extended sections ── */}
            {!isLegacy && (
                <>
                    {bugs.length > 0 && (
                        <CollapsibleSection
                            title={`Detected Bugs`}
                            icon={AlertTriangle}
                            count={bugs.length}
                            colorClass="text-brick"
                            bgClass="bg-brick-muted"
                            borderClass="border-brick/15"
                        >
                            {bugs.map((b, i) => (
                                <FindingItem
                                    key={i}
                                    text={b.text}
                                    confidence={issueConfidence?.bugs?.[i]?.confidence}
                                    agreementCount={b.agreementCount}
                                    totalModels={meta.modelCount}
                                    accentColor="#b8483c"
                                />
                            ))}
                        </CollapsibleSection>
                    )}

                    {security.length > 0 && (
                        <CollapsibleSection
                            title="Security Issues"
                            icon={Shield}
                            count={security.length}
                            colorClass="text-red-600"
                            bgClass="bg-red-50"
                            borderClass="border-red-200"
                        >
                            {security.map((s, i) => (
                                <FindingItem
                                    key={i}
                                    text={s.text}
                                    confidence={issueConfidence?.security?.[i]?.confidence}
                                    agreementCount={s.agreementCount}
                                    totalModels={meta.modelCount}
                                    accentColor="#dc2626"
                                />
                            ))}
                        </CollapsibleSection>
                    )}

                    {performance.length > 0 && (
                        <CollapsibleSection
                            title="Performance"
                            icon={Zap}
                            count={performance.length}
                            colorClass="text-amber-600"
                            bgClass="bg-amber-50"
                            borderClass="border-amber-200"
                        >
                            {performance.map((p, i) => (
                                <FindingItem
                                    key={i}
                                    text={p.text}
                                    confidence={issueConfidence?.performance?.[i]?.confidence}
                                    agreementCount={p.agreementCount}
                                    totalModels={meta.modelCount}
                                    accentColor="#d97706"
                                />
                            ))}
                        </CollapsibleSection>
                    )}

                    {codeSmells.length > 0 && (
                        <CollapsibleSection
                            title="Code Smells"
                            icon={Wind}
                            count={codeSmells.length}
                            colorClass="text-purple-600"
                            bgClass="bg-purple-50"
                            borderClass="border-purple-200"
                            defaultOpen={false}
                        >
                            {codeSmells.map((c, i) => (
                                <FindingItem
                                    key={i}
                                    text={c.text}
                                    confidence={issueConfidence?.codeSmells?.[i]?.confidence}
                                    agreementCount={c.agreementCount}
                                    totalModels={meta.modelCount}
                                    accentColor="#9333ea"
                                />
                            ))}
                        </CollapsibleSection>
                    )}

                    {refactoring.length > 0 && (
                        <CollapsibleSection
                            title="Refactoring Suggestions"
                            icon={RefreshCw}
                            count={refactoring.length}
                            colorClass="text-sage"
                            bgClass="bg-sage-muted"
                            borderClass="border-sage/15"
                            defaultOpen={false}
                        >
                            {refactoring.map((r, i) => (
                                <FindingItem
                                    key={i}
                                    text={r.text}
                                    confidence={issueConfidence?.refactoring?.[i]?.confidence}
                                    agreementCount={r.agreementCount}
                                    totalModels={meta.modelCount}
                                    accentColor="#4b7a53"
                                />
                            ))}
                        </CollapsibleSection>
                    )}

                    {complexity && (
                        <CollapsibleSection
                            title="Complexity Analysis"
                            icon={BarChart2}
                            colorClass="text-blue-600"
                            bgClass="bg-blue-50"
                            borderClass="border-blue-200"
                            defaultOpen={false}
                        >
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2.5 rounded-md bg-paper-50 border border-ink-100">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Clock size={10} className="text-ink-400" />
                                        <span className="text-[10px] font-semibold text-ink-500 uppercase tracking-wide">Time</span>
                                    </div>
                                    <code className="text-[13px] font-mono text-blue-700">{complexity.time}</code>
                                </div>
                                <div className="p-2.5 rounded-md bg-paper-50 border border-ink-100">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <BarChart2 size={10} className="text-ink-400" />
                                        <span className="text-[10px] font-semibold text-ink-500 uppercase tracking-wide">Space</span>
                                    </div>
                                    <code className="text-[13px] font-mono text-blue-700">{complexity.space}</code>
                                </div>
                            </div>
                            {complexity.explanation && (
                                <p className="text-[12px] text-ink-500 mt-2 px-1 leading-relaxed">{complexity.explanation}</p>
                            )}
                        </CollapsibleSection>
                    )}
                </>
            )}

            {/* ── Legacy schema fallback ── */}
            {isLegacy && (
                <>
                    {legacyIssues.length > 0 && (
                        <CollapsibleSection
                            title={`Issues`}
                            icon={AlertTriangle}
                            count={legacyIssues.length}
                            colorClass="text-brick"
                            bgClass="bg-brick-muted"
                            borderClass="border-brick/15"
                        >
                            {legacyIssues.map((issue, i) => (
                                <FindingItem key={i} text={issue} accentColor="#b8483c" />
                            ))}
                        </CollapsibleSection>
                    )}
                    {legacySuggestions.length > 0 && (
                        <CollapsibleSection
                            title="Suggestions"
                            icon={Lightbulb}
                            count={legacySuggestions.length}
                            colorClass="text-sage"
                            bgClass="bg-sage-muted"
                            borderClass="border-sage/15"
                        >
                            {legacySuggestions.map((s, i) => (
                                <FindingItem key={i} text={s} accentColor="#4b7a53" />
                            ))}
                        </CollapsibleSection>
                    )}
                    {legacyLineFixes.length > 0 && (
                        <div>
                            <h3 className="flex items-center gap-2 text-[11px] font-semibold text-clay-600 uppercase tracking-[0.14em] mb-2">
                                <Code2 size={11} />
                                Inline fixes — press Tab in editor to apply
                            </h3>
                            <div className="space-y-2">
                                {legacyLineFixes.map((fix, i) => (
                                    <div key={i} className="rounded-md overflow-hidden text-[11.5px] font-mono border"
                                        style={{ borderColor: fix.type === 'error' ? 'rgba(184,72,60,0.25)' : 'rgba(75,122,83,0.2)' }}>
                                        <div className="flex items-center gap-2 px-3 py-1.5"
                                            style={{ background: fix.type === 'error' ? '#f6dfd8' : '#e6efe5' }}>
                                            <span className={fix.type === 'error' ? 'text-brick' : 'text-sage'}>
                                                {fix.type === 'error' ? 'Error' : 'Improvement'}
                                            </span>
                                        </div>
                                        <div className="px-3 py-2 text-brick/80 bg-paper-100 line-through">
                                            {fix.matchSnippet?.slice(0, 100)}{fix.matchSnippet?.length > 100 ? '…' : ''}
                                        </div>
                                        <div className="px-3 py-2 text-sage bg-paper-100">
                                            {fix.fix?.slice(0, 100)}{fix.fix?.length > 100 ? '…' : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ReviewPage() {
    const navigate = useNavigate();
    const { submitReview, isAnalyzing, progressStepIndex } = useReviewStore();

    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState(DEFAULT_CODE.javascript);
    const [review, setReview] = useState(null);
    const [rightPanel, setRightPanel] = useState('results'); // 'results' | 'diff'
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    const originalCodeRef = useRef(code);

    const handleLanguageChange = (lang) => {
        const defaultCode = DEFAULT_CODE[lang] || '// Paste your code here...';
        setLanguage(lang);
        setCode(defaultCode);
        setLangDropdownOpen(false);
        setReview(null);
        originalCodeRef.current = defaultCode;
    };

    const handleCodeChange = useCallback((val) => {
        setCode(val || '');
    }, []);

    const handleSubmit = async () => {
        if (!code.trim() || code.trim().length < 10) {
            toast.error('Please enter at least 10 characters of code.');
            return;
        }
        originalCodeRef.current = code;
        setReview(null);

        try {
            const result = await submitReview({ code, language });
            setReview(result);
            setRightPanel('results');
        } catch {
            // Error handled in store
        }
    };

    const handleReset = () => {
        const defaultCode = DEFAULT_CODE[language] || '';
        setCode(defaultCode);
        setReview(null);
        originalCodeRef.current = defaultCode;
    };

    const scoreColor = review ? getScoreColor(review.score) : null;
    // For diff: use improvedCode from review if available, else original
    const diffModified = review?.improvedCode || code;

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen bg-paper-100 overflow-hidden">

            {/* ── Top Toolbar ── */}
            <div className="flex items-center gap-3 px-4 h-12 bg-paper-50 border-b border-ink-100 flex-shrink-0">

                {/* Language selector */}
                <div className="relative">
                    <button
                        onClick={() => setLangDropdownOpen((o) => !o)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-mono text-ink-700 transition-all hover:text-ink-900 hover:bg-paper-200 border border-ink-100"
                    >
                        <span className="text-ink-400">{getLanguageIcon(language)}</span>
                        <span className="capitalize">{language}</span>
                        <ChevronDown size={13} className="text-ink-400" />
                    </button>

                    {langDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 z-50 w-44 rounded-lg overflow-hidden surface shadow-lift">
                            <div className="max-h-60 overflow-y-auto py-1">
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => handleLanguageChange(lang)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] text-left transition-colors hover:bg-paper-100 ${language === lang ? 'text-clay-600 font-medium' : 'text-ink-700'}`}
                                    >
                                        <span className="text-ink-400 font-mono text-[11px]">{getLanguageIcon(lang)}</span>
                                        <span className="capitalize">{lang}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1" />

                {/* Score badge */}
                {review && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-md text-[13px] surface">
                        <Star size={13} className={scoreColor.text} />
                        <span className={`font-semibold ${scoreColor.text}`}>{review.score}</span>
                        <span className="text-ink-400">/100</span>
                        <span className="text-ink-400 text-[11.5px]">— {scoreColor.label}</span>
                        {review.metadata?.overallConfidence != null && (
                            <span className="text-[10.5px] font-mono text-ink-400 ml-1 border-l border-ink-200 pl-2">
                                {review.metadata.overallConfidence}% conf.
                            </span>
                        )}
                    </div>
                )}

                {/* Reset */}
                <button
                    onClick={handleReset}
                    disabled={isAnalyzing}
                    className="p-2 rounded-md text-ink-400 hover:text-ink-700 transition-colors hover:bg-paper-200 disabled:opacity-40"
                    title="Reset editor"
                >
                    <RotateCcw size={15} />
                </button>

                {/* Run Review button */}
                <button
                    onClick={handleSubmit}
                    disabled={isAnalyzing}
                    className="btn btn-clay !px-4 !py-2 !text-[13px]"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Reviewing…
                        </>
                    ) : (
                        <>
                            <Play size={14} fill="currentColor" />
                            Run Review
                        </>
                    )}
                </button>
            </div>

            {/* ── Main Split Layout ── */}
            <div className="flex flex-1 overflow-hidden">

                {/* LEFT — Code Editor */}
                <div className="flex flex-col w-1/2 border-r border-ink-100 min-w-0">
                    <div className="flex items-center gap-2 px-4 py-2 bg-paper-50 border-b border-ink-100 flex-shrink-0">
                        <Code2 size={13} className="text-ink-400" />
                        <span className="text-[12px] text-ink-500 font-mono">Your code</span>
                        {isAnalyzing && (
                            <span className="ml-auto text-[11px] text-clay-500 font-mono animate-pulse">
                                3 AI models analyzing…
                            </span>
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <Suspense fallback={<EditorSkeleton />}>
                            <CodeEditor
                                value={code}
                                onChange={handleCodeChange}
                                language={language}
                                readOnly={isAnalyzing}
                                lineFixes={[]}
                                onFixApplied={() => {}}
                            />
                        </Suspense>
                    </div>
                </div>

                {/* RIGHT — Results / Diff */}
                <div className="flex flex-col w-1/2 min-w-0">

                    {/* Tab bar */}
                    <div className="flex items-center border-b border-ink-100 bg-paper-50 flex-shrink-0">
                        <button
                            onClick={() => setRightPanel('results')}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium transition-all border-b-2 ${rightPanel === 'results'
                                ? 'text-clay-600 border-clay-500'
                                : 'text-ink-400 border-transparent hover:text-ink-700'
                                }`}
                        >
                            <Lightbulb size={12} />
                            Results
                            {review && (
                                <span className="ml-1 px-1.5 py-0.5 rounded text-[11px] bg-clay-50 text-clay-700">
                                    {review.metadata
                                        ? (review.metadata.bugs?.length || 0) + (review.metadata.security?.length || 0) + (review.metadata.performance?.length || 0) + (review.metadata.codeSmells?.length || 0) + (review.metadata.refactoring?.length || 0)
                                        : (review.issues?.length || 0) + (review.suggestions?.length || 0)}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setRightPanel('diff')}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium transition-all border-b-2 ${rightPanel === 'diff'
                                ? 'text-clay-600 border-clay-500'
                                : 'text-ink-400 border-transparent hover:text-ink-700'
                                }`}
                        >
                            <GitCompare size={12} />
                            Diff view
                            {review?.improvedCode && (
                                <span className="ml-1 px-1.5 py-0.5 rounded text-[11px] bg-sage-muted text-sage">
                                    improved
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        {rightPanel === 'diff' ? (
                            <Suspense fallback={<EditorSkeleton />}>
                                <DiffEditor
                                    original={originalCodeRef.current}
                                    modified={diffModified}
                                    language={language}
                                />
                            </Suspense>
                        ) : (
                            <ResultsPanel
                                review={review}
                                isAnalyzing={isAnalyzing}
                                progressStepIndex={progressStepIndex}
                                onNavigateHistory={() => navigate('/history')}
                            />
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
