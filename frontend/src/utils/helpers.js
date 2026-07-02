// Score palette — muted, warm, non-neon
export const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-sage',   hex: '#4b7a53', muted: '#e6efe5', label: 'Excellent' };
    if (score >= 60) return { text: 'text-slate2', hex: '#4a6fa5', muted: '#e2ebf7', label: 'Good' };
    if (score >= 40) return { text: 'text-ochre',  hex: '#b8853d', muted: '#f4ead1', label: 'Average' };
    return { text: 'text-brick', hex: '#b8483c', muted: '#f6dfd8', label: 'Poor' };
};
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};
export const truncateCode = (code, maxLength = 120) => {
    if (!code) return '';
    if (code.length <= maxLength) return code;
    return code.slice(0, maxLength) + '…';
};
// Two-letter monogram badge instead of emoji flags — quieter, no AI-cliché
export const getLanguageIcon = (language) => {
    const map = {
        javascript: 'JS', typescript: 'TS', python: 'PY', java: 'JV',
        cpp: 'C+', c: 'C', csharp: 'C#', go: 'GO', rust: 'RS',
        php: 'PH', ruby: 'RB', swift: 'SW', kotlin: 'KT',
        html: 'HT', css: 'CS', sql: 'SQ', bash: 'SH', other: '··',
    };
    return map[language?.toLowerCase()] || '··';
};
