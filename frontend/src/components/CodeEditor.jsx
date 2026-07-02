import { useRef, useEffect, useCallback, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

// Map app language names to Monaco language IDs
const MONACO_LANGUAGE_MAP = {
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    csharp: 'csharp',
    go: 'go',
    rust: 'rust',
    php: 'php',
    ruby: 'ruby',
    swift: 'swift',
    kotlin: 'kotlin',
    html: 'html',
    css: 'css',
    sql: 'sql',
    bash: 'shell',
    other: 'plaintext',
};

loader.config({
    paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs',
    },
});

export default function CodeEditor({
    value = '',
    onChange,
    language = 'javascript',
    readOnly = false,
    lineFixes = [],
    onFixApplied,
    height = '100%',
    showFixBadge = true,
}) {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const decorationsRef = useRef([]);
    const [pendingFix, setPendingFix] = useState(null);
    const [appliedCount, setAppliedCount] = useState(0);

    const monacoLang = MONACO_LANGUAGE_MAP[language?.toLowerCase()] || 'plaintext';

    // Apply decorations for lineFixes
    const applyDecorations = useCallback(() => {
        const editor = editorRef.current;
        const monaco = monacoRef.current;
        if (!editor || !monaco || !lineFixes.length) return;

        const model = editor.getModel();
        if (!model) return;

        const newDecorations = [];

        lineFixes.forEach((fix) => {
            if (!fix.matchSnippet) return;

            const fullText = model.getValue();
            const idx = fullText.indexOf(fix.matchSnippet);
            if (idx === -1) return;

            const startPos = model.getPositionAt(idx);
            const endPos = model.getPositionAt(idx + fix.matchSnippet.length);

            const isError = fix.type === 'error';

            newDecorations.push({
                range: new monaco.Range(
                    startPos.lineNumber,
                    startPos.column,
                    endPos.lineNumber,
                    endPos.column
                ),
                options: {
                    className: isError ? 'fix-highlight-error' : 'fix-highlight-improvement',
                    glyphMarginClassName: isError ? 'fix-glyph-error' : 'fix-glyph-improvement',
                    hoverMessage: {
                        value: `**${isError ? 'Issue' : 'Suggestion'}** — Press \`Tab\` to apply fix\n\n\`\`\`\n${fix.fix}\n\`\`\``,
                    },
                    stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                },
            });
        });

        decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
    }, [lineFixes]);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        // Inject custom CSS for highlights — warm paper palette instead of neon
        const styleId = 'linefix-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                .fix-highlight-error {
                    background: rgba(184, 72, 60, 0.10) !important;
                    border-bottom: 2px solid rgba(184, 72, 60, 0.55) !important;
                }
                .fix-highlight-improvement {
                    background: rgba(75, 122, 83, 0.08) !important;
                    border-bottom: 2px solid rgba(75, 122, 83, 0.5) !important;
                }
                .fix-glyph-error::before {
                    content: '●';
                    color: #b8483c;
                    font-size: 12px;
                }
                .fix-glyph-improvement::before {
                    content: '●';
                    color: #4b7a53;
                    font-size: 12px;
                }
            `;
            document.head.appendChild(style);
        }

        // TAB key handler — apply nearest fix to cursor position
        editor.addCommand(monaco.KeyCode.Tab, () => {
            if (readOnly) return;
            const position = editor.getPosition();
            if (!position) return;

            const model = editor.getModel();
            if (!model) return;

            const fullText = model.getValue();

            // Find the closest fix whose matchSnippet is near cursor
            let bestFix = null;
            let bestDistance = Infinity;

            lineFixes.forEach((fix) => {
                if (!fix.matchSnippet) return;
                const idx = fullText.indexOf(fix.matchSnippet);
                if (idx === -1) return;

                const fixPos = model.getPositionAt(idx);
                const distance = Math.abs(fixPos.lineNumber - position.lineNumber);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestFix = { ...fix, idx };
                }
            });

            if (bestFix && bestDistance <= 10) {
                const startPos = model.getPositionAt(bestFix.idx);
                const endPos = model.getPositionAt(bestFix.idx + bestFix.matchSnippet.length);

                editor.executeEdits('linefix', [{
                    range: new monaco.Range(
                        startPos.lineNumber,
                        startPos.column,
                        endPos.lineNumber,
                        endPos.column
                    ),
                    text: bestFix.fix,
                }]);

                const newValue = model.getValue();

                toast.success(`${bestFix.type === 'error' ? 'Fix' : 'Improvement'} applied`, {
                    style: {
                        background: '#ffffff',
                        color: '#1a1815',
                        border: '1px solid #e5e0d8',
                    },
                });

                setPendingFix(bestFix);
                setAppliedCount((c) => c + 1);
                if (onFixApplied) onFixApplied(bestFix, newValue);

                // Re-apply decorations after edit
                setTimeout(applyDecorations, 100);
            } else {
                // Default tab behavior
                editor.trigger('keyboard', 'type', { text: '    ' });
            }
        });

        applyDecorations();
    };

    // Re-apply decorations when lineFixes change
    useEffect(() => {
        applyDecorations();
    }, [applyDecorations]);

    // Clear pending fix notification
    useEffect(() => {
        if (pendingFix) {
            const t = setTimeout(() => setPendingFix(null), 3000);
            return () => clearTimeout(t);
        }
    }, [pendingFix]);

    const errorFixes = lineFixes.filter((f) => f.type === 'error');
    const improvementFixes = lineFixes.filter((f) => f.type === 'improvement');

    return (
        <div className="relative flex flex-col h-full">
            {/* Fix stats bar */}
            {showFixBadge && lineFixes.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-2 bg-paper-100 border-b border-ink-100 text-[11.5px]">
                    {errorFixes.length > 0 && (
                        <span className="flex items-center gap-1.5 text-brick">
                            <AlertCircle size={12} />
                            {errorFixes.length} error{errorFixes.length !== 1 ? 's' : ''}
                        </span>
                    )}
                    {improvementFixes.length > 0 && (
                        <span className="flex items-center gap-1.5 text-sage">
                            <Sparkles size={12} />
                            {improvementFixes.length} improvement{improvementFixes.length !== 1 ? 's' : ''}
                        </span>
                    )}
                    {appliedCount > 0 && (
                        <span className="flex items-center gap-1.5 text-ink-500">
                            <CheckCircle size={12} className="text-sage" />
                            {appliedCount} fix{appliedCount !== 1 ? 'es' : ''} applied
                        </span>
                    )}
                    <span className="ml-auto text-ink-400 font-mono">Press Tab near highlighted code to apply fix</span>
                </div>
            )}

            {/* Fix applied toast */}
            {pendingFix && (
                <div className="absolute top-12 right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-lg text-[11.5px] font-medium animate-rise"
                    style={{
                        background: pendingFix.type === 'error' ? '#f6dfd8' : '#e6efe5',
                        border: `1px solid ${pendingFix.type === 'error' ? 'rgba(184,72,60,0.3)' : 'rgba(75,122,83,0.3)'}`,
                        color: pendingFix.type === 'error' ? '#b8483c' : '#4b7a53',
                    }}>
                    <CheckCircle size={12} />
                    <span>Fix applied</span>
                </div>
            )}

            <div className="flex-1 overflow-hidden monaco-cream">
                <Editor
                    height={height === '100%' ? undefined : height}
                    defaultLanguage={monacoLang}
                    language={monacoLang}
                    value={value}
                    onChange={onChange}
                    onMount={handleEditorDidMount}
                    loading={
                        <div className="flex items-center justify-center h-full bg-white">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clay-500 mx-auto mb-2" />
                                <p className="text-ink-400 text-[12.5px] font-mono">Loading editor…</p>
                            </div>
                        </div>
                    }
                    options={{
                        readOnly,
                        fontSize: 13,
                        fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                        fontLigatures: true,
                        lineHeight: 1.7,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        padding: { top: 12, bottom: 12 },
                        glyphMargin: lineFixes.length > 0,
                        lineNumbers: 'on',
                        renderLineHighlight: 'gutter',
                        cursorBlinking: 'smooth',
                        smoothScrolling: true,
                        contextmenu: true,
                        automaticLayout: true,
                        tabSize: 4,
                        insertSpaces: true,
                        folding: true,
                        bracketPairColorization: { enabled: true },
                        'semanticHighlighting.enabled': true,
                    }}
                    theme="vs"
                />
            </div>
        </div>
    );
}
