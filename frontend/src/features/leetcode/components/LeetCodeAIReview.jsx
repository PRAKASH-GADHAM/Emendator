import { useState } from 'react';
import {
    Lightbulb, AlertTriangle, Shield, Zap, Wind, RefreshCw,
    BarChart2, BookOpen, ChevronDown, ChevronUp, Clock, Code2,
    Cpu, TrendingUp, GitCompare, CheckCircle2, XCircle, Loader2,
    Ban,
} from 'lucide-react';
import { getScoreColor } from '../../../utils/helpers';
import ScoreRing from '../../../components/ScoreRing';

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

function FindingItem({ text, confidence, agreementCount, totalModels, accentColor }) {
    const showBadge = agreementCount != null && totalModels != null;
    return (
        <div
            className="flex gap-2.5 p-2.5 rounded-md text-[12.5px] text-ink-700 bg-paper-50 border"
            style={{ borderColor: `${accentColor}22` }}
        >
            <span className="flex-shrink-0 mt-0.5" style={{ color: accentColor }}>&#9656;</span>
            <span className="flex-1 leading-relaxed">{text}</span>
            {showBadge && (
                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-1">
                    {agreementCount > 1 && (
                        <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-paper-200 text-ink-500">
                            {agreementCount}/{totalModels} models
                        </span>
                    )}
                    {confidence != null && (
                        <span
                            className="text-[9.5px] font-mono px-1.5 py-0.5 rounded text-white"
                            style={{
                                background: confidence >= 80 ? '#b8483c' : confidence >= 60 ? '#c96442' : '#7a9a8a',
                            }}
                        >
                            {confidence}% confident
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

function ConfidenceBar({ value }) {
    if (value == null) return null;
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-paper-200 rounded-full overflow-hidden max-w-[100px]">
                <div
                    className="h-full rounded-full transition-all"
                    style={{
                        width: `${value}%`,
                        background: value >= 75 ? '#4b7a53' : value >= 50 ? '#c96442' : '#b8483c',
                    }}
                />
            </div>
            <span className="text-[10.5px] text-ink-400 font-mono">{value}% confidence</span>
        </div>
    );
}

function deriveExecutionSummary(review) {
    const results = Array.isArray(review?.testResults) ? review.testResults : null;
    if (!results || results.length === 0) return null;
    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;
    if (failed === 0) {
        return {
            passed: true,
            title: `[Execution] Passed all ${passed} test case${passed !== 1 ? 's' : ''}`,
        };
    }
    return {
        passed: false,
        title: `[Execution] Failed ${failed} of ${results.length} test case${results.length !== 1 ? 's' : ''}`,
    };
}

function ReviewLoading() {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center bg-white">
            <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-2 border-clay-200 animate-spin"
                    style={{ borderTopColor: '#c96442', animationDuration: '1s' }} />
                <div className="absolute w-10 h-10 rounded-full border-2 border-ink-100 animate-spin"
                    style={{ borderBottomColor: '#7a7370', animationDuration: '1.4s', animationDirection: 'reverse' }} />
                <Cpu size={12} className="absolute text-clay-500" />
            </div>
            <div>
                <p className="text-ink-700 font-medium text-[13.5px] mb-1">Consulting 3 AI models…</p>
                <p className="text-ink-400 text-[12px]">Running your solution, then generating the consensus review</p>
            </div>
        </div>
    );
}

function ReviewErrorState({ error, onRetry }) {
    const message = error?.response?.data?.message || error?.message || 'AI review failed. Please try again.';
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center bg-white">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-brick-muted border border-brick/15">
                <Ban size={22} className="text-brick" />
            </div>
            <div>
                <p className="text-ink-700 font-medium text-[13.5px] mb-1">AI Review Failed</p>
                <p className="text-ink-400 text-[12.5px] max-w-sm">{message}</p>
            </div>
            {onRetry && (
                <button onClick={onRetry} className="btn btn-clay !px-4 !py-2 !text-[12.5px]">
                    <RefreshCw size={13} />
                    Retry Review
                </button>
            )}
        </div>
    );
}

export default function LeetCodeAIReview({ review, error, isStale, onRetry }) {
    if (error && !review) {
        return <ReviewErrorState error={error} onRetry={onRetry} />;
    }

    if (!review) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center bg-white">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-clay-50 border border-clay-100">
                    <Lightbulb size={22} className="text-clay-500 opacity-70" />
                </div>
                <div>
                    <p className="text-ink-700 font-medium text-[13.5px] mb-1">Ready for AI review</p>
                    <p className="text-ink-400 text-[12.5px]">Write your solution, then press <kbd>Review</kbd></p>
                </div>
                <div className="flex flex-col gap-2 text-left max-w-xs">
                    {[
                        { icon: Cpu, text: '3 AI models analyze your solution' },
                        { icon: TrendingUp, text: 'Consensus engine merges findings' },
                        { icon: Shield, text: 'Bugs, performance & correctness' },
                        { icon: GitCompare, text: 'Improved code with diff view' },
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
    const bugs = Array.isArray(review.bugs) ? review.bugs : [];
    const performance = Array.isArray(review.performance) ? review.performance : [];
    const security = Array.isArray(review.security) ? review.security : [];
    const codeSmells = Array.isArray(review.codeSmells) ? review.codeSmells : [];
    const refactoring = Array.isArray(review.refactoring) ? review.refactoring : [];
    const complexity = review.complexity || null;
    const executiveSummary = review.executiveSummary || null;
    const modelsUsed = Array.isArray(review.modelsUsed) ? review.modelsUsed : [];
    const modelCount = review.modelCount ?? modelsUsed.length;
    const overallConfidence = review.overallConfidence ?? null;
    const reviewQualityScore = review.reviewQualityScore ?? null;
    const issueConfidence = review.issueConfidence || {};
    const improvedCode = review.improvedCode;
    const execution = deriveExecutionSummary(review);

    const totalFindings = bugs.length + performance.length + security.length + codeSmells.length + refactoring.length;

    return (
        <div className="h-full overflow-y-auto p-4 space-y-3 bg-white">

            {isStale && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-ochre-muted border border-ochre/25 text-[12px] text-ochre">
                    <AlertTriangle size={13} className="flex-shrink-0" />
                    <span>Your code has changed since this review was generated. Request a new review for updated feedback.</span>
                </div>
            )}

            {/* Score card */}
            <div className="flex items-center gap-4 p-4 surface rounded-lg">
                <ScoreRing score={review.score} size={68} strokeWidth={5} />
                <div className="flex-1 min-w-0">
                    <p className="text-ink-900 font-serif text-[17px]" style={{ letterSpacing: '-0.01em' }}>{scoreColor.label}</p>
                    <p className="text-ink-500 text-[11.5px] mt-0.5">
                        {totalFindings} finding{totalFindings !== 1 ? 's' : ''}
                        {modelsUsed.length > 0 && ` · ${modelsUsed.length} models`}
                    </p>
                    <ConfidenceBar value={overallConfidence} />
                </div>
            </div>

            {/* Models used */}
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

            {/* Execution summary (from actual execution contract) */}
            {execution && (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-paper-50 border border-ink-100">
                    {execution.passed ? (
                        <CheckCircle2 size={14} className="text-sage flex-shrink-0" />
                    ) : (
                        <XCircle size={14} className="text-brick flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                        <span className="text-[12.5px] font-medium text-ink-700">{execution.title}</span>
                    </div>
                </div>
            )}

            {/* Executive Summary */}
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

            {/* Bugs */}
            {bugs.length > 0 && (
                <CollapsibleSection
                    title="Detected Bugs"
                    icon={AlertTriangle}
                    count={bugs.length}
                    colorClass="text-brick"
                    bgClass="bg-brick-muted"
                    borderClass="border-brick/15"
                >
                    {bugs.map((b, i) => (
                        <FindingItem
                            key={i}
                            text={b.text || b}
                            confidence={issueConfidence?.bugs?.[i]?.confidence}
                            agreementCount={b.agreementCount}
                            totalModels={modelCount}
                            accentColor="#b8483c"
                        />
                    ))}
                </CollapsibleSection>
            )}

            {/* Security */}
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
                            text={s.text || s}
                            confidence={issueConfidence?.security?.[i]?.confidence}
                            agreementCount={s.agreementCount}
                            totalModels={modelCount}
                            accentColor="#dc2626"
                        />
                    ))}
                </CollapsibleSection>
            )}

            {/* Performance */}
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
                            text={p.text || p}
                            confidence={issueConfidence?.performance?.[i]?.confidence}
                            agreementCount={p.agreementCount}
                            totalModels={modelCount}
                            accentColor="#d97706"
                        />
                    ))}
                </CollapsibleSection>
            )}

            {/* Code Smells */}
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
                            text={c.text || c}
                            confidence={issueConfidence?.codeSmells?.[i]?.confidence}
                            agreementCount={c.agreementCount}
                            totalModels={modelCount}
                            accentColor="#9333ea"
                        />
                    ))}
                </CollapsibleSection>
            )}

            {/* Refactoring */}
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
                            text={r.text || r}
                            confidence={issueConfidence?.refactoring?.[i]?.confidence}
                            agreementCount={r.agreementCount}
                            totalModels={modelCount}
                            accentColor="#4b7a53"
                        />
                    ))}
                </CollapsibleSection>
            )}

            {/* Complexity Analysis */}
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

            {/* Improved Code */}
            {improvedCode && (
                <CollapsibleSection
                    title="Improved Code"
                    icon={Code2}
                    colorClass="text-sage"
                    bgClass="bg-sage-muted"
                    borderClass="border-sage/15"
                    defaultOpen={false}
                >
                    <pre className="text-[11.5px] font-mono text-ink-700 bg-paper-50 border border-ink-100 rounded-md p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {improvedCode}
                    </pre>
                </CollapsibleSection>
            )}
        </div>
    );
}

export { ReviewLoading };
