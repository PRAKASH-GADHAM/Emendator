import { Hash, Tag, AlertTriangle, Info } from 'lucide-react';

const DIFFICULTY_STYLES = {
    Easy:   'text-sage bg-sage-muted border-sage/15',
    Medium: 'text-ochre bg-ochre-muted border-ochre/15',
    Hard:   'text-brick bg-brick-muted border-brick/15',
};

export default function ProblemStatement({ problem }) {
    if (!problem) return null;

    const diffStyle = DIFFICULTY_STYLES[problem.difficulty] || 'text-ink-500 bg-paper-200 border-ink-200';
    const examples = problem.examples || [];
    const constraints = problem.constraints || [];

    return (
        <div className="p-6 space-y-6 bg-white h-full overflow-y-auto">

            {/* Header */}
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <span className="text-ink-400 font-mono text-[13px] mt-0.5">#{problem.number}</span>
                    <div className="flex-1">
                        <h2 className="font-serif text-[20px] text-ink-900" style={{ letterSpacing: '-0.02em' }}>
                            {problem.title}
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`chip text-[10.5px] border font-medium ${diffStyle}`}>
                        {problem.difficulty}
                    </span>
                    {(problem.topics || []).map((topic) => (
                        <span
                            key={topic}
                            className="inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full bg-paper-200 text-ink-500 border border-ink-100"
                        >
                            <Tag size={8} />
                            {topic}
                        </span>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <div className="text-[13.5px] text-ink-700 leading-relaxed whitespace-pre-wrap">
                    {problem.description}
                </div>
            </div>

            {/* Examples */}
            {examples.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-[11px] font-semibold text-ink-500 uppercase tracking-[0.14em]">Examples</h3>
                    {examples.map((example, idx) => (
                        <div key={idx} className="rounded-lg border border-ink-100 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2 bg-paper-50 border-b border-ink-100">
                                <span className="text-[10.5px] font-semibold text-ink-500">Example {idx + 1}</span>
                            </div>
                            <div className="px-4 py-3 space-y-2.5">
                                {example.input != null && (
                                    <div>
                                        <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-wide mb-1 block">Input</span>
                                        <code className="text-[12.5px] font-mono text-ink-800 bg-paper-100 px-2 py-1 rounded block whitespace-pre-wrap">
                                            {example.input}
                                        </code>
                                    </div>
                                )}
                                {example.output != null && (
                                    <div>
                                        <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-wide mb-1 block">Output</span>
                                        <code className="text-[12.5px] font-mono text-ink-800 bg-paper-100 px-2 py-1 rounded block whitespace-pre-wrap">
                                            {example.output}
                                        </code>
                                    </div>
                                )}
                                {example.explanation && (
                                    <div className="flex items-start gap-2 mt-1">
                                        <Info size={12} className="text-slate2 mt-0.5 flex-shrink-0" />
                                        <p className="text-[12px] text-ink-500 leading-relaxed italic">
                                            {example.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Constraints */}
            {constraints.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-[11px] font-semibold text-ink-500 uppercase tracking-[0.14em]">Constraints</h3>
                    <ul className="space-y-1.5">
                        {constraints.map((constraint, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[12.5px] text-ink-600">
                                <span className="text-clay-500 mt-1 flex-shrink-0">•</span>
                                <code className="font-mono text-[12px]">{constraint}</code>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Follow-up */}
            {problem.followUp && (
                <div className="rounded-lg border border-ink-100 bg-paper-50 px-4 py-3">
                    <div className="flex items-center gap-2 mb-1.5">
                        <AlertTriangle size={12} className="text-ochre" />
                        <span className="text-[10.5px] font-semibold text-ink-500 uppercase tracking-wide">Follow up</span>
                    </div>
                    <p className="text-[12.5px] text-ink-600 leading-relaxed">{problem.followUp}</p>
                </div>
            )}
        </div>
    );
}
