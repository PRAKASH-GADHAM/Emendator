'use strict';

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { createError } = require('../../utils/response');
const logger = require('../../config/logger');
const problemService = require('./problem.service');
const sandbox = require('./execution.docker');

const EXECUTION_TIMEOUT_MS = 10000;
const MAX_OUTPUT_BYTES = 65536;

const TEMP_DIR = path.join(os.tmpdir(), 'emendator-exec');

const SAFE_EXEC_ENV = (() => {
    const allowList = [
        'PATH', 'PATHEXT', 'SystemRoot', 'SystemDrive', 'WINDIR', 'ComSpec',
        'TEMP', 'TMP', 'OS', 'PROCESSOR_ARCHITECTURE', 'NUMBER_OF_PROCESSORS',
        'ProgramFiles', 'ProgramFiles(x86)', 'USERPROFILE', 'HOMEDRIVE', 'HOMEPATH',
    ];
    const env = {};
    for (const k of allowList) {
        if (process.env[k] !== undefined) env[k] = process.env[k];
    }
    return env;
})();

const normalizeOutput = (str) => {
    if (!str) return '';
    return str.trim().replace(/\s*,\s*/g, ', ');
};

const parseNumericArray = (str) => {
    const cleaned = str.replace(/[\[\]{}]/g, '').trim();
    if (!cleaned) return [];
    return cleaned.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
};

const parseNestedArray = (str) => {
    const trimmed = str.trim();
    if (trimmed === '[]') return [];
    if (!trimmed.startsWith('[')) return [];
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    const result = [];
    let depth = 0;
    let start = -1;
    for (let i = 0; i < inner.length; i++) {
        const c = inner[i];
        if (c === '[') {
            if (depth === 0) start = i;
            depth++;
        } else if (c === ']') {
            depth--;
            if (depth === 0 && start >= 0) {
                const cleaned = inner.slice(start, i + 1).replace(/[\[\]{}]/g, '').trim();
                if (cleaned) {
                    result.push(cleaned.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)));
                } else {
                    result.push([]);
                }
                start = -1;
            }
        }
    }
    return result;
};

const canonicalizeNestedArray = (arr) => {
    return arr
        .map(inner => [...inner].sort((a, b) => a - b))
        .sort((a, b) => {
            const sa = JSON.stringify(a);
            const sb = JSON.stringify(b);
            if (sa < sb) return -1;
            if (sa > sb) return 1;
            return 0;
        });
};

const parseNestedIntegerList = (str) => {
    const trimmed = str.trim();
    if (trimmed === '[]') return [];
    try {
        const parsed = JSON.parse(trimmed);
        if (!Array.isArray(parsed)) return [];
        return parsed.map(item => Array.isArray(item) ? item.map(Number) : [Number(item)]);
    } catch {
        return [];
    }
};

const canonicalizeNestedIntegerList = (arr) => {
    return arr
        .map(inner => [...inner].sort((a, b) => a - b))
        .sort((a, b) => {
            const sa = JSON.stringify(a);
            const sb = JSON.stringify(b);
            if (sa < sb) return -1;
            if (sa > sb) return 1;
            return 0;
        });
};

const compareOutputs = (actual, expected, strategy) => {
    const normActual = normalizeOutput(actual);
    const normExpected = normalizeOutput(expected);

    if (strategy === 'unordered-array') {
        const a = parseNumericArray(normActual);
        const b = parseNumericArray(normExpected);
        if (a.length !== b.length) return false;
        a.sort((x, y) => x - y);
        b.sort((x, y) => x - y);
        return a.every((v, i) => v === b[i]);
    }

    if (strategy === 'unordered-nested-array') {
        const a = parseNestedArray(normActual);
        const b = parseNestedArray(normExpected);
        if (a.length !== b.length) return false;
        const ca = canonicalizeNestedArray(a);
        const cb = canonicalizeNestedArray(b);
        return JSON.stringify(ca) === JSON.stringify(cb);
    }

    if (strategy === 'unordered-nested-list') {
        const a = parseNestedIntegerList(normActual);
        const b = parseNestedIntegerList(normExpected);
        if (a.length !== b.length) return false;
        const ca = canonicalizeNestedIntegerList(a);
        const cb = canonicalizeNestedIntegerList(b);
        return JSON.stringify(ca) === JSON.stringify(cb);
    }

    if (strategy === 'unordered-nested-string-list') {
        const parseNestedStringList = (str) => {
            const trimmed = str.trim();
            if (trimmed === '[]') return [];
            try {
                const parsed = JSON.parse(trimmed);
                if (!Array.isArray(parsed)) return [];
                return parsed.map(item => Array.isArray(item) ? item.map(x => String(x)) : []);
            } catch { return []; }
        };
        const canonicalizeNestedStringList = (arr) => {
            return arr
                .map(inner => [...inner].sort())
                .sort((a, b) => {
                    const sa = JSON.stringify(a);
                    const sb = JSON.stringify(b);
                    return sa < sb ? -1 : sa > sb ? 1 : 0;
                });
        };
        const a = parseNestedStringList(normActual);
        const b = parseNestedStringList(normExpected);
        if (a.length !== b.length) return false;
        const ca = canonicalizeNestedStringList(a);
        const cb = canonicalizeNestedStringList(b);
        return JSON.stringify(ca) === JSON.stringify(cb);
    }

    if (strategy === 'float-epsilon') {
        const EPSILON = 1e-5;
        const parseDouble = (str) => {
            const trimmed = str.trim();
            if (trimmed === 'Infinity') return Infinity;
            if (trimmed === '-Infinity') return -Infinity;
            if (trimmed === 'NaN') return NaN;
            const cleaned = trimmed.replace(/[^0-9.\-eE+]/g, '');
            return parseFloat(cleaned);
        };
        const a = parseDouble(normActual);
        const b = parseDouble(normExpected);
        if (Number.isNaN(a) && Number.isNaN(b)) return true;
        if (Number.isNaN(a) || Number.isNaN(b)) return false;
        if (!isFinite(a) || !isFinite(b)) return a === b;
        if (a === b) return true;
        const diff = Math.abs(a - b);
        const magnitude = Math.max(1, Math.abs(a), Math.abs(b));
        return diff <= EPSILON * magnitude;
    }

    if (strategy === 'float-epsilon-array') {
        const EPSILON = 1e-5;
        const parseDoubleArray = (str) => {
            const trimmed = str.trim();
            if (trimmed === '[]') return [];
            if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return null;
            const inner = trimmed.slice(1, -1).trim();
            if (!inner) return [];
            return inner.split(',').map(s => {
                const t = s.trim();
                if (t === 'Infinity') return Infinity;
                if (t === '-Infinity') return -Infinity;
                if (t === 'NaN') return NaN;
                return parseFloat(t.replace(/[^0-9.\-eE+]/g, ''));
            });
        };
        const compareElement = (a, b) => {
            if (Number.isNaN(a) && Number.isNaN(b)) return true;
            if (Number.isNaN(a) || Number.isNaN(b)) return false;
            if (!isFinite(a) || !isFinite(b)) return a === b;
            if (a === b) return true;
            const diff = Math.abs(a - b);
            const magnitude = Math.max(1, Math.abs(a), Math.abs(b));
            return diff <= EPSILON * magnitude;
        };
        const a = parseDoubleArray(normActual);
        const b = parseDoubleArray(normExpected);
        if (a === null || b === null) return false;
        if (a.length !== b.length) return false;
        return a.every((v, i) => compareElement(v, b[i]));
    }

    if (strategy === 'float-epsilon-nested-array') {
        const EPSILON = 1e-5;
        const parseDouble = (s) => {
            const t = s.trim();
            if (t === 'Infinity') return Infinity;
            if (t === '-Infinity') return -Infinity;
            if (t === 'NaN') return NaN;
            return parseFloat(t.replace(/[^0-9.\-eE+]/g, ''));
        };
        const parseNestedDoubleArray = (str) => {
            const trimmed = str.trim();
            if (trimmed === '[]') return [];
            if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return null;
            const outer = trimmed.slice(1, -1).trim();
            if (!outer) return [];
            const rows = [];
            let depth = 0, start = -1;
            for (let i = 0; i < outer.length; i++) {
                const c = outer[i];
                if (c === '[') { if (depth === 0) start = i; depth++; }
                else if (c === ']') {
                    depth--;
                    if (depth === 0 && start >= 0) {
                        const rowStr = outer.slice(start, i + 1).trim();
                        const inner = rowStr.slice(1, -1).trim();
                        if (!inner) { rows.push([]); }
                        else { rows.push(inner.split(',').map(x => parseDouble(x))); }
                        start = -1;
                    }
                }
            }
            return rows;
        };
        const compareElement = (a, b) => {
            if (Number.isNaN(a) && Number.isNaN(b)) return true;
            if (Number.isNaN(a) || Number.isNaN(b)) return false;
            if (!isFinite(a) || !isFinite(b)) return a === b;
            if (a === b) return true;
            const diff = Math.abs(a - b);
            const magnitude = Math.max(1, Math.abs(a), Math.abs(b));
            return diff <= EPSILON * magnitude;
        };
        const a = parseNestedDoubleArray(normActual);
        const b = parseNestedDoubleArray(normExpected);
        if (a === null || b === null) return false;
        if (a.length !== b.length) return false;
        return a.every((row, i) => {
            if (row.length !== b[i].length) return false;
            return row.every((v, j) => compareElement(v, b[i][j]));
        });
    }

    return normActual === normExpected;
};

const ensureTempDir = () => {
    if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR, { recursive: true });
    }
};

const cleanupDir = (dir) => {
    try {
        fs.rmSync(dir, { recursive: true, force: true });
    } catch (e) {
        logger.warn(`[Execution] Cleanup failed for ${dir}: ${e.message}`);
    }
};

const JAVA_HARNESS = `
import java.lang.reflect.*;
import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
}

public class Main {
    public static void main(String[] args) throws Exception {
        Solution s = new Solution();
        List<Method> candidates = new ArrayList<>();
        for (Method m : s.getClass().getDeclaredMethods()) {
            if (Modifier.isPublic(m.getModifiers()) && !m.getName().equals("main")) {
                candidates.add(m);
            }
        }
        if (candidates.isEmpty()) { System.out.println("ERROR: No public method found"); return; }
        Method target = candidates.get(0);
        Class<?>[] ptypes = target.getParameterTypes();

        List<String> lines = new ArrayList<>();
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) lines.add(sc.nextLine());

        Object[] callArgs = new Object[ptypes.length];
        int lineIdx = 0;
        for (int i = 0; i < ptypes.length; i++) {
            String raw = lineIdx < lines.size() ? lines.get(lineIdx++) : "";
            callArgs[i] = parseArg(raw.trim(), ptypes[i]);
        }

        Object result = target.invoke(s, callArgs);
        System.out.println(formatResult(result, target));
    }

    private static Object parseArg(String raw, Class<?> type) {
        if (type == int[][].class) {
            return parseIntMatrix(raw);
        } else if (type == char[][].class) {
            return parseCharMatrix(raw);
        } else if (type == TreeNode[].class) {
            return parseTreeNodeArray(raw);
        } else if (type == TreeNode.class) {
            return parseTreeNode(raw);
        } else if (type == int[].class) {
            return parseIntArray(raw);
        } else if (type == int.class || type == Integer.class) {
            return Integer.parseInt(raw.replaceAll("[^\\\\-0-9]", ""));
        } else if (type == String.class) {
            if (raw.startsWith("\\\"") && raw.endsWith("\\\"")) return raw.substring(1, raw.length() - 1);
            return raw;
        } else if (type == boolean.class || type == Boolean.class) {
            return Boolean.parseBoolean(raw);
        } else if (type == double.class || type == Double.class) {
            return Double.parseDouble(raw.replaceAll("[^\\\\-0-9.]", ""));
        } else if (type == String[].class) {
            return parseStringArray(raw);
        } else if (type == char[].class) {
            if (raw.startsWith("\\"") && raw.endsWith("\\"")) return raw.substring(1, raw.length() - 1).toCharArray();
            return raw.toCharArray();
        } else if (type == int.class) {
            return Integer.parseInt(raw.replaceAll("[^\\\\-0-9]", ""));
        } else if (type == ListNode[].class) {
            return parseListNodeArray(raw);
        } else if (type == ListNode.class) {
            return parseListNode(raw);
        }
        return raw;
    }

    private static int[] parseIntArray(String raw) {
        String cleaned = raw.replaceAll("[\\\\[\\\\]{}]", "").trim();
        if (cleaned.isEmpty()) return new int[0];
        String[] parts = cleaned.split(",");
        int[] arr = new int[parts.length];
        for (int i = 0; i < parts.length; i++) arr[i] = Integer.parseInt(parts[i].trim().replaceAll("[^\\\\-0-9]", ""));
        return arr;
    }

    private static int[][] parseIntMatrix(String raw) {
        String trimmed = raw.trim();
        if (trimmed.equals("[]")) return new int[0][];
        if (!trimmed.startsWith("[")) return new int[0][];
        String inner = trimmed.substring(1, trimmed.length() - 1).trim();
        if (inner.isEmpty()) return new int[0][];
        java.util.List<int[]> rows = new java.util.ArrayList<>();
        int depth = 0;
        int start = -1;
        for (int i = 0; i < inner.length(); i++) {
            char c = inner.charAt(i);
            if (c == '[') {
                if (depth == 0) start = i;
                depth++;
            } else if (c == ']') {
                depth--;
                if (depth == 0 && start >= 0) {
                    rows.add(parseIntArray(inner.substring(start, i + 1)));
                    start = -1;
                }
            }
        }
        return rows.toArray(new int[0][]);
    }

    private static char[][] parseCharMatrix(String raw) {
        String trimmed = raw.trim();
        if (trimmed.equals("[]")) return new char[0][];
        if (!trimmed.startsWith("[")) return new char[0][];
        String inner = trimmed.substring(1, trimmed.length() - 1).trim();
        if (inner.isEmpty()) return new char[0][];
        java.util.List<char[]> rows = new java.util.ArrayList<>();
        int depth = 0;
        int start = -1;
        for (int i = 0; i < inner.length(); i++) {
            char c = inner.charAt(i);
            if (c == '[') {
                if (depth == 0) start = i;
                depth++;
            } else if (c == ']') {
                depth--;
                if (depth == 0 && start >= 0) {
                    rows.add(parseCharArray(inner.substring(start, i + 1)));
                    start = -1;
                }
            }
        }
        return rows.toArray(new char[0][]);
    }

    private static char[] parseCharArray(String raw) {
        String cleaned = raw.replaceAll("[\\\\[\\\\]{}]", "").trim();
        if (cleaned.isEmpty()) return new char[0];
        String[] parts = cleaned.split(",");
        char[] arr = new char[parts.length];
        for (int i = 0; i < parts.length; i++) {
            String p = parts[i].trim();
            if (p.startsWith("\\\"") && p.endsWith("\\\"")) p = p.substring(1, p.length() - 1);
            if (p.length() == 1) {
                arr[i] = p.charAt(0);
            } else if (p.length() > 1) {
                arr[i] = p.charAt(0);
            } else {
                arr[i] = ' ';
            }
        }
        return arr;
    }

    private static String[] parseStringArray(String raw) {
        String cleaned = raw.replaceAll("[\\\\[\\\\]{}]", "").trim();
        if (cleaned.isEmpty()) return new String[0];
        String[] parts = cleaned.split(",");
        String[] arr = new String[parts.length];
        for (int i = 0; i < parts.length; i++) {
            String p = parts[i].trim();
            if (p.startsWith("\\"") && p.endsWith("\\"")) p = p.substring(1, p.length() - 1);
            arr[i] = p;
        }
        return arr;
    }

    private static ListNode parseListNode(String raw) {
        String cleaned = raw.replaceAll("[\\\\[\\\\]{}]", "").trim();
        if (cleaned.isEmpty()) return null;
        String[] parts = cleaned.split(",");
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        for (String part : parts) {
            String trimmed = part.trim().replaceAll("[^\\\\-0-9]", "");
            if (!trimmed.isEmpty()) {
                current.next = new ListNode(Integer.parseInt(trimmed));
                current = current.next;
            }
        }
        return dummy.next;
    }

    private static ListNode[] parseListNodeArray(String raw) {
        String trimmed = raw.trim();
        if (trimmed.equals("[]")) return new ListNode[0];
        if (!trimmed.startsWith("[")) return new ListNode[0];
        String inner = trimmed.substring(1, trimmed.length() - 1).trim();
        if (inner.isEmpty()) return new ListNode[0];
        java.util.List<ListNode> nodes = new java.util.ArrayList<>();
        int depth = 0;
        int start = -1;
        for (int i = 0; i < inner.length(); i++) {
            char c = inner.charAt(i);
            if (c == '[') {
                if (depth == 0) start = i;
                depth++;
            } else if (c == ']') {
                depth--;
                if (depth == 0 && start >= 0) {
                    String sub = inner.substring(start, i + 1).trim();
                    if (sub.equals("[]")) {
                        nodes.add(null);
                    } else {
                        nodes.add(parseListNode(sub));
                    }
                    start = -1;
                }
            }
        }
        return nodes.toArray(new ListNode[0]);
    }

    private static String serializeListNode(ListNode head) {
        if (head == null) return "[]";
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        ListNode current = head;
        int count = 0;
        boolean first = true;
        while (current != null && count < 10000) {
            if (!first) sb.append(",");
            sb.append(current.val);
            first = false;
            current = current.next;
            count++;
        }
        if (current != null) sb.append(",CYCLE_DETECTED");
        sb.append("]");
        return sb.toString();
    }

    private static TreeNode[] parseTreeNodeArray(String raw) {
        String trimmed = raw.trim();
        if (trimmed.equals("[]")) return new TreeNode[0];
        if (!trimmed.startsWith("[")) return new TreeNode[0];
        String inner = trimmed.substring(1, trimmed.length() - 1).trim();
        if (inner.isEmpty()) return new TreeNode[0];
        java.util.List<TreeNode> nodes = new java.util.ArrayList<>();
        int depth = 0;
        int start = -1;
        for (int i = 0; i < inner.length(); i++) {
            char c = inner.charAt(i);
            if (c == '[') {
                if (depth == 0) start = i;
                depth++;
            } else if (c == ']') {
                depth--;
                if (depth == 0 && start >= 0) {
                    String sub = inner.substring(start, i + 1).trim();
                    if (sub.equals("[]")) {
                        nodes.add(null);
                    } else {
                        nodes.add(parseTreeNode(sub));
                    }
                    start = -1;
                }
            }
        }
        return nodes.toArray(new TreeNode[0]);
    }

    private static TreeNode parseTreeNode(String raw) {
        String cleaned = raw.replaceAll("[\\\\[\\\\]{}]", "").trim();
        if (cleaned.isEmpty()) return null;
        String[] parts = cleaned.split(",");
        if (parts.length == 0 || parts[0].trim().equals("null")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(parts[0].trim().replaceAll("[^\\\\-0-9]", "")));
        java.util.Queue<TreeNode> queue = new java.util.LinkedList<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < parts.length) {
            TreeNode current = queue.poll();
            if (i < parts.length) {
                String leftVal = parts[i].trim();
                if (!leftVal.equals("null")) {
                    current.left = new TreeNode(Integer.parseInt(leftVal.replaceAll("[^\\\\-0-9]", "")));
                    queue.add(current.left);
                }
                i++;
            }
            if (i < parts.length) {
                String rightVal = parts[i].trim();
                if (!rightVal.equals("null")) {
                    current.right = new TreeNode(Integer.parseInt(rightVal.replaceAll("[^\\\\-0-9]", "")));
                    queue.add(current.right);
                }
                i++;
            }
        }
        return root;
    }

    private static String serializeTreeNode(TreeNode root) {
        if (root == null) return "[]";
        java.util.Queue<TreeNode> queue = new java.util.LinkedList<>();
        java.util.List<String> result = new java.util.ArrayList<>();
        java.util.Set<TreeNode> visited = java.util.Collections.newSetFromMap(new java.util.IdentityHashMap<>());
        queue.add(root);
        visited.add(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node == null) {
                result.add("null");
            } else {
                result.add(String.valueOf(node.val));
                if (!visited.contains(node.left) && node.left != null) {
                    queue.add(node.left);
                    visited.add(node.left);
                } else {
                    queue.add(null);
                }
                if (!visited.contains(node.right) && node.right != null) {
                    queue.add(node.right);
                    visited.add(node.right);
                } else {
                    queue.add(null);
                }
            }
        }
        while (!result.isEmpty() && result.get(result.size() - 1).equals("null")) {
            result.remove(result.size() - 1);
        }
        return "[" + String.join(",", result) + "]";
    }

    private static String serializeIntMatrix(int[][] matrix) {
        if (matrix == null) return "null";
        if (matrix.length == 0) return "[]";
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < matrix.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(Arrays.toString(matrix[i]).replaceAll("\\\\s", ""));
        }
        sb.append("]");
        return sb.toString();
    }

    private static String serializeDoubleArray(double[] arr) {
        if (arr == null) return "null";
        if (arr.length == 0) return "[]";
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) sb.append(",");
            if (Double.isNaN(arr[i])) sb.append("NaN");
            else if (arr[i] == Double.POSITIVE_INFINITY) sb.append("Infinity");
            else if (arr[i] == Double.NEGATIVE_INFINITY) sb.append("-Infinity");
            else sb.append(arr[i]);
        }
        sb.append("]");
        return sb.toString();
    }

    private static String serializeDoubleMatrix(double[][] matrix) {
        if (matrix == null) return "null";
        if (matrix.length == 0) return "[]";
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < matrix.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(serializeDoubleArray(matrix[i]));
        }
        sb.append("]");
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private static String serializeNestedIntegerList(java.util.List<?> list) {
        if (list == null) return "null";
        if (list.isEmpty()) return "[]";
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            Object item = list.get(i);
            if (item instanceof java.util.List) {
                sb.append(serializeInnerIntegerList((java.util.List<?>) item));
            } else {
                sb.append(item != null ? item.toString() : "null");
            }
        }
        sb.append("]");
        return sb.toString();
    }

    private static String serializeInnerIntegerList(java.util.List<?> list) {
        if (list == null) return "null";
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(list.get(i) != null ? list.get(i).toString() : "null");
        }
        sb.append("]");
        return sb.toString();
    }

    private static boolean isNestedIntegerList(Method method) {
        java.lang.reflect.Type genericReturn = method.getGenericReturnType();
        if (genericReturn instanceof java.lang.reflect.ParameterizedType) {
            java.lang.reflect.ParameterizedType pt = (java.lang.reflect.ParameterizedType) genericReturn;
            java.lang.reflect.Type[] outerArgs = pt.getActualTypeArguments();
            if (outerArgs.length == 1 && outerArgs[0] instanceof java.lang.reflect.ParameterizedType) {
                java.lang.reflect.ParameterizedType innerPt = (java.lang.reflect.ParameterizedType) outerArgs[0];
                java.lang.reflect.Type[] innerArgs = innerPt.getActualTypeArguments();
                return innerArgs.length == 1 && innerArgs[0] == Integer.class;
            }
        }
        return false;
    }

    private static boolean isIntegerList(Method method) {
        java.lang.reflect.Type genericReturn = method.getGenericReturnType();
        if (genericReturn instanceof java.lang.reflect.ParameterizedType) {
            java.lang.reflect.ParameterizedType pt = (java.lang.reflect.ParameterizedType) genericReturn;
            java.lang.reflect.Type[] args = pt.getActualTypeArguments();
            return args.length == 1 && args[0] == Integer.class;
        }
        return false;
    }

    private static boolean isStringList(Method method) {
        java.lang.reflect.Type genericReturn = method.getGenericReturnType();
        if (genericReturn instanceof java.lang.reflect.ParameterizedType) {
            java.lang.reflect.ParameterizedType pt = (java.lang.reflect.ParameterizedType) genericReturn;
            java.lang.reflect.Type[] args = pt.getActualTypeArguments();
            return args.length == 1 && args[0] == String.class;
        }
        return false;
    }

    private static boolean isNestedStringList(Method method) {
        java.lang.reflect.Type genericReturn = method.getGenericReturnType();
        if (genericReturn instanceof java.lang.reflect.ParameterizedType) {
            java.lang.reflect.ParameterizedType pt = (java.lang.reflect.ParameterizedType) genericReturn;
            java.lang.reflect.Type[] outerArgs = pt.getActualTypeArguments();
            if (outerArgs.length == 1 && outerArgs[0] instanceof java.lang.reflect.ParameterizedType) {
                java.lang.reflect.ParameterizedType innerPt = (java.lang.reflect.ParameterizedType) outerArgs[0];
                java.lang.reflect.Type[] innerArgs = innerPt.getActualTypeArguments();
                return innerArgs.length == 1 && innerArgs[0] == String.class;
            }
        }
        return false;
    }

    private static String serializeIntegerList(java.util.List<?> list) {
        if (list == null) return "null";
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(list.get(i) != null ? list.get(i).toString() : "null");
        }
        sb.append("]");
        return sb.toString();
    }

    private static String serializeStringList(java.util.List<?> list) {
        if (list == null) return "null";
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            Object item = list.get(i);
            if (item == null) {
                sb.append("null");
            } else {
                String s = item.toString();
                s = s.replace("\\\\", "\\\\\\\\").replace("\\\"", "\\\\\\"");
                sb.append("\\\"").append(s).append("\\\"");
            }
        }
        sb.append("]");
        return sb.toString();
    }

    private static String serializeNestedStringList(java.util.List<?> list) {
        if (list == null) return "null";
        if (list.isEmpty()) return "[]";
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            Object item = list.get(i);
            if (item == null) {
                sb.append("null");
            } else if (item instanceof java.util.List) {
                sb.append(serializeStringList((java.util.List<?>) item));
            } else {
                sb.append(item.toString());
            }
        }
        sb.append("]");
        return sb.toString();
    }

    private static String formatResult(Object result, Method method) {
        Class<?> type = method.getReturnType();
        if (type == int[][].class) return serializeIntMatrix((int[][]) result);
        if (type == double[][].class) return serializeDoubleMatrix((double[][]) result);
        if (type == double[].class) return serializeDoubleArray((double[]) result);
        if (type == TreeNode.class) return serializeTreeNode((TreeNode) result);
        if (type == ListNode.class) return serializeListNode((ListNode) result);
        if (result == null) return "null";
        if (type == int[].class) return Arrays.toString((int[]) result).replaceAll("\\\\s", "");
        if (type == String[].class) return Arrays.toString((String[]) result);
        if (type == boolean.class || type == Boolean.class) return result.toString();
        if (type == int.class || type == Integer.class) return result.toString();
        if (type == double.class || type == Double.class) return result.toString();
        if (type == char[].class) return new String((char[]) result);
        if (java.util.List.class.isAssignableFrom(type)) {
            if (isNestedIntegerList(method)) return serializeNestedIntegerList((java.util.List<?>) result);
            if (isNestedStringList(method)) return serializeNestedStringList((java.util.List<?>) result);
            if (isIntegerList(method)) return serializeIntegerList((java.util.List<?>) result);
            if (isStringList(method)) return serializeStringList((java.util.List<?>) result);
        }
        return result.toString();
    }
}
`.trim();

const buildJavaFiles = (dir, code, className) => {
    const userFilePath = path.join(dir, `${className}.java`);
    fs.writeFileSync(userFilePath, code, 'utf-8');
    const harnessPath = path.join(dir, 'Main.java');
    fs.writeFileSync(harnessPath, JAVA_HARNESS, 'utf-8');
    return userFilePath;
};

const runJavaCompilation = (dir, className) => {
    if (sandbox.isEnabled()) {
        return sandbox.compileJavaInSandbox(dir, className);
    }
    try {
        execSync(`javac -d "${dir}" "${path.join(dir, className + '.java')}" "${path.join(dir, 'Main.java')}"`, {
            timeout: 15000,
            cwd: dir,
            stdio: 'pipe',
            windowsHide: true,
        });
        return { success: true };
    } catch (e) {
        const stderr = e.stderr ? e.stderr.toString() : '';
        return { success: false, error: stderr || 'Compilation failed' };
    }
};

const killProcessTree = (pid) => {
    if (!pid) return;
    if (process.platform === 'win32') {
        try {
            execSync(`taskkill /F /T /PID ${pid}`, { timeout: 5000, stdio: 'ignore' });
        } catch {}
    } else {
        try {
            process.kill(pid, 'SIGKILL');
        } catch {}
    }
};

const runJavaTest = (dir, className, input) => {
    if (sandbox.isEnabled()) {
        return sandbox.runJavaInSandbox(dir, className, input);
    }
    return new Promise((resolve) => {
        const startTime = Date.now();
        const proc = spawn('java', ['-cp', dir, 'Main'], {
            cwd: dir,
            stdio: ['pipe', 'pipe', 'pipe'],
            windowsHide: true,
            env: SAFE_EXEC_ENV,
        });

        let stdout = '';
        let stderr = '';
        let killed = false;
        let resolved = false;
        let safetyTimeoutId = null;

        const safeResolve = (result) => {
            if (resolved) return;
            resolved = true;
            clearTimeout(timeoutId);
            if (safetyTimeoutId) clearTimeout(safetyTimeoutId);
            resolve(result);
        };

        const timeoutId = setTimeout(() => {
            killed = true;
            killProcessTree(proc.pid);
            safetyTimeoutId = setTimeout(() => {
                safeResolve({ status: 'TIMEOUT', runtime: Date.now() - startTime, stdout: '', stderr: '' });
            }, 3000);
        }, EXECUTION_TIMEOUT_MS);

        proc.stdout.on('data', (data) => {
            stdout += data.toString();
            if (stdout.length > MAX_OUTPUT_BYTES && !killed) {
                killed = true;
                killProcessTree(proc.pid);
            }
        });

        proc.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        proc.on('close', (code) => {
            const runtime = Date.now() - startTime;

            if (killed && runtime >= EXECUTION_TIMEOUT_MS) {
                safeResolve({ status: 'TIMEOUT', runtime, stdout: '', stderr: '' });
                return;
            }

            if (code !== 0 && !stdout.trim()) {
                safeResolve({ status: 'RUNTIME_ERROR', runtime, stdout: '', stderr: stderr.slice(0, 2000) });
                return;
            }

            safeResolve({
                status: 'OK',
                runtime,
                stdout: stdout.trim(),
                stderr: stderr.slice(0, 2000),
            });
        });

        proc.on('error', () => {
            safeResolve({ status: 'RUNTIME_ERROR', runtime: Date.now() - startTime, stdout: '', stderr: 'Process error' });
        });

        if (input) {
            try {
                proc.stdin.write(input);
            } catch {}
        }
        proc.stdin.end();
    });
};

const runJavaScriptTest = (code, input) => {
    if (sandbox.isEnabled()) {
        return sandbox.runJavaScriptInSandbox(code, input);
    }
    return new Promise((resolve) => {
        const startTime = Date.now();
        const fullCode = input
            ? `${code}\n\n// __INPUT__\nconst __input = ${JSON.stringify(input)};\nif (typeof process !== 'undefined' && process.stdin) {\n  // Simulated input\n}`
            : code;

        const proc = spawn('node', ['-e', fullCode], {
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: EXECUTION_TIMEOUT_MS,
            windowsHide: true,
            env: SAFE_EXEC_ENV,
        });

        let stdout = '';
        let stderr = '';
        let killed = false;

        const timeoutId = setTimeout(() => {
            killed = true;
            proc.kill('SIGKILL');
        }, EXECUTION_TIMEOUT_MS);

        proc.stdout.on('data', (data) => {
            stdout += data.toString();
            if (stdout.length > MAX_OUTPUT_BYTES) {
                killed = true;
                proc.kill('SIGKILL');
            }
        });

        proc.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        proc.on('close', (code) => {
            clearTimeout(timeoutId);
            const runtime = Date.now() - startTime;

            if (killed && runtime >= EXECUTION_TIMEOUT_MS) {
                resolve({ status: 'TIMEOUT', runtime, stdout: '', stderr: '' });
                return;
            }

            if (code !== 0 && !stdout.trim()) {
                resolve({ status: 'RUNTIME_ERROR', runtime, stdout: '', stderr: stderr.slice(0, 2000) });
                return;
            }

            resolve({
                status: 'OK',
                runtime,
                stdout: stdout.trim(),
                stderr: stderr.slice(0, 2000),
            });
        });

        proc.on('error', () => {
            clearTimeout(timeoutId);
            resolve({ status: 'RUNTIME_ERROR', runtime: Date.now() - startTime, stdout: '', stderr: 'Process error' });
        });
    });
};

const runPythonTest = (code, input) => {
    if (sandbox.isEnabled()) {
        return sandbox.runPythonInSandbox(code, input);
    }
    return new Promise((resolve) => {
        const startTime = Date.now();
        const proc = spawn('python', ['-c', code], {
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: EXECUTION_TIMEOUT_MS,
            windowsHide: true,
            env: SAFE_EXEC_ENV,
        });

        let stdout = '';
        let stderr = '';
        let killed = false;

        const timeoutId = setTimeout(() => {
            killed = true;
            proc.kill('SIGKILL');
        }, EXECUTION_TIMEOUT_MS);

        proc.stdout.on('data', (data) => {
            stdout += data.toString();
            if (stdout.length > MAX_OUTPUT_BYTES) {
                killed = true;
                proc.kill('SIGKILL');
            }
        });

        proc.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        proc.on('close', (code) => {
            clearTimeout(timeoutId);
            const runtime = Date.now() - startTime;

            if (killed && runtime >= EXECUTION_TIMEOUT_MS) {
                resolve({ status: 'TIMEOUT', runtime, stdout: '', stderr: '' });
                return;
            }

            if (code !== 0 && !stdout.trim()) {
                resolve({ status: 'RUNTIME_ERROR', runtime, stdout: '', stderr: stderr.slice(0, 2000) });
                return;
            }

            resolve({
                status: 'OK',
                runtime,
                stdout: stdout.trim(),
                stderr: stderr.slice(0, 2000),
            });
        });

        proc.on('error', () => {
            clearTimeout(timeoutId);
            resolve({ status: 'RUNTIME_ERROR', runtime: Date.now() - startTime, stdout: '', stderr: 'Process error' });
        });

        if (input) {
            try {
                proc.stdin.write(input);
            } catch {}
        }
        proc.stdin.end();
    });
};

const runCppTest = (dir, code, input) => {
    const srcPath = path.join(dir, 'solution.cpp');
    const outPath = path.join(dir, 'solution.exe');

    fs.writeFileSync(srcPath, code, 'utf-8');

    if (sandbox.isEnabled()) {
        return sandbox.runCppInSandbox(dir, code, input);
    }

    try {
        execSync(`g++ -o "${outPath}" "${srcPath}" -std=c++17 -O2`, {
            timeout: 15000,
            cwd: dir,
            stdio: 'pipe',
            windowsHide: true,
        });
    } catch (e) {
        const stderr = e.stderr ? e.stderr.toString() : '';
        return Promise.resolve({ status: 'COMPILE_ERROR', runtime: 0, stdout: '', stderr: stderr.slice(0, 2000) });
    }

    return new Promise((resolve) => {
        const startTime = Date.now();
        const proc = spawn(outPath, [], {
            cwd: dir,
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: EXECUTION_TIMEOUT_MS,
            windowsHide: true,
            env: SAFE_EXEC_ENV,
        });

        let stdout = '';
        let stderr = '';
        let killed = false;

        const timeoutId = setTimeout(() => {
            killed = true;
            proc.kill('SIGKILL');
        }, EXECUTION_TIMEOUT_MS);

        proc.stdout.on('data', (data) => {
            stdout += data.toString();
            if (stdout.length > MAX_OUTPUT_BYTES) {
                killed = true;
                proc.kill('SIGKILL');
            }
        });

        proc.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        proc.on('close', () => {
            clearTimeout(timeoutId);
            const runtime = Date.now() - startTime;

            if (killed && runtime >= EXECUTION_TIMEOUT_MS) {
                resolve({ status: 'TIMEOUT', runtime, stdout: '', stderr: '' });
                return;
            }

            resolve({
                status: 'OK',
                runtime,
                stdout: stdout.trim(),
                stderr: stderr.slice(0, 2000),
            });
        });

        proc.on('error', () => {
            clearTimeout(timeoutId);
            resolve({ status: 'RUNTIME_ERROR', runtime: Date.now() - startTime, stdout: '', stderr: 'Process error' });
        });

        if (input) {
            try {
                proc.stdin.write(input);
            } catch {}
        }
        proc.stdin.end();
    });
};

const executeCode = async (problemId, language, code) => {
    const problem = await problemService.getProblemById(problemId);
    const testCases = await problemService.getTestCasesForExecution(problem.id);

    if (!testCases || testCases.length === 0) {
        throw createError('No test cases available for this problem', 400);
    }

    ensureTempDir();
    const runId = `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const runDir = path.join(TEMP_DIR, runId);

    try {
        fs.mkdirSync(runDir, { recursive: true });
        const results = [];

        let compileError = null;
        if (language === 'java') {
            buildJavaFiles(runDir, code, 'Solution');
            const compileResult = runJavaCompilation(runDir, 'Solution');
            if (!compileResult.success) compileError = compileResult.error;
        }

        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            let execResult;

            if (language === 'java') {
                if (compileError) {
                    results.push({
                        testCaseIndex: i,
                        passed: false,
                        status: 'COMPILE_ERROR',
                        expected: tc.expectedOutput,
                        actual: '',
                        error: compileError,
                        runtime: 0,
                    });
                    continue;
                }

                execResult = await runJavaTest(runDir, 'Solution', tc.input);
            } else if (language === 'javascript') {
                execResult = await runJavaScriptTest(code, tc.input);
            } else if (language === 'python') {
                execResult = await runPythonTest(code, tc.input);
            } else if (language === 'cpp') {
                execResult = await runCppTest(runDir, code, tc.input);
            } else {
                throw createError(`Language '${language}' is not supported for execution`, 400);
            }

            const actual = normalizeOutput(execResult.stdout);
            const expected = normalizeOutput(tc.expectedOutput);
            const strategy = problem.validationStrategy || 'exact';
            const passed = execResult.status === 'OK' && compareOutputs(execResult.stdout, tc.expectedOutput, strategy);

            results.push({
                testCaseIndex: i,
                passed,
                status: passed ? 'PASSED' : (execResult.status === 'OK' ? 'FAILED' : execResult.status),
                expected,
                actual: actual.slice(0, 2000),
                error: execResult.stderr || undefined,
                runtime: execResult.runtime,
            });
        }

        const allPassed = results.every((r) => r.passed);
        const anyCompileError = results.some((r) => r.status === 'COMPILE_ERROR');
        const anyTimeout = results.some((r) => r.status === 'TIMEOUT');
        const anyRuntimeError = results.some((r) => r.status === 'RUNTIME_ERROR');

        let overallStatus = 'PASSED';
        if (anyCompileError) overallStatus = 'COMPILE_ERROR';
        else if (anyTimeout) overallStatus = 'TIMEOUT';
        else if (anyRuntimeError) overallStatus = 'RUNTIME_ERROR';
        else if (!allPassed) overallStatus = 'FAILED';

        const totalRuntime = results.reduce((sum, r) => sum + (r.runtime || 0), 0);

        return {
            status: overallStatus,
            testResults: results,
            totalTests: results.length,
            passedTests: results.filter((r) => r.passed).length,
            totalRuntime,
        };
    } finally {
        cleanupDir(runDir);
    }
};

module.exports = { executeCode, JAVA_HARNESS };
