import { create } from 'zustand';
import { leetcodeApi } from '../api/leetcode.api';
import toast from 'react-hot-toast';

const STARTER_CODE = {
    javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    // Write your solution here\n    \n}`,
    python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your solution here\n        pass`,
    java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}`,
    cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};`,
    go: `func twoSum(nums []int, target int) []int {\n    // Write your solution here\n    return nil\n}`,
    typescript: `function twoSum(nums: number[], target: number): number[] {\n    // Write your solution here\n    \n}`,
    rust: `impl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        // Write your solution here\n        vec![]\n    }\n}`,
    c: `/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your solution here\n    *returnSize = 0;\n    return NULL;\n}`,
    swift: `class Solution {\n    func twoSum(_ nums: [Int], _ target: Int) -> [Int] {\n        // Write your solution here\n        return []\n    }\n}`,
    kotlin: `class Solution {\n    fun twoSum(nums: IntArray, target: Int): IntArray {\n        // Write your solution here\n        return intArrayOf()\n    }\n}`,
};

export const useLeetCodeStore = create((set, get) => ({
    problems: [],
    currentProblem: null,
    pagination: null,
    isSearching: false,
    isRunning: false,
    isReviewing: false,
    executionResult: null,
    executionError: null,
    reviewResult: null,
    reviewError: null,
    reviewedCode: null,
    selectedLanguage: 'java',
    code: STARTER_CODE.java,

    fetchProblems: async (params = {}) => {
        set({ isSearching: true });
        try {
            const data = await leetcodeApi.getProblems(params);
            set({
                problems: data.data.problems,
                pagination: data.data.pagination,
                isSearching: false,
            });
        } catch (error) {
            set({ isSearching: false });
            const message = error.response?.data?.message || 'Failed to load problems';
            toast.error(message);
        }
    },

    fetchProblem: async (problemId) => {
        set({ isSearching: true });
        try {
            const data = await leetcodeApi.getProblem(problemId);
            const problem = data.data.problem;
            const { selectedLanguage } = get();
            const starterCode = problem.starterCode?.[selectedLanguage] || STARTER_CODE[selectedLanguage] || '';
            set({
                currentProblem: problem,
                code: starterCode,
                isSearching: false,
                executionResult: null,
                executionError: null,
                reviewResult: null,
                reviewError: null,
                reviewedCode: null,
            });
        } catch (error) {
            set({ isSearching: false });
            const message = error.response?.data?.message || 'Failed to load problem';
            toast.error(message);
        }
    },

    runCode: async () => {
        const { currentProblem, selectedLanguage, code } = get();
        if (!currentProblem) return;
        set({ isRunning: true, executionResult: null, executionError: null });
        try {
            const data = await leetcodeApi.runCode(currentProblem.id, {
                language: selectedLanguage,
                code,
            });
            set({ executionResult: data.data.result, isRunning: false });
        } catch (error) {
            set({ isRunning: false, executionError: error, executionResult: null });
        }
    },

    submitCode: async () => {
        const { currentProblem, selectedLanguage, code } = get();
        if (!currentProblem) return;
        set({ isRunning: true, executionResult: null, executionError: null });
        try {
            const data = await leetcodeApi.runCode(currentProblem.id, {
                language: selectedLanguage,
                code,
            });
            set({ executionResult: data.data.result, isRunning: false });
        } catch (error) {
            set({ isRunning: false, executionError: error, executionResult: null });
        }
    },

    reviewCode: async () => {
        const { currentProblem, selectedLanguage, code } = get();
        if (!currentProblem) return;
        set({ isReviewing: true, reviewResult: null, reviewError: null });
        try {
            const data = await leetcodeApi.reviewCode(currentProblem.id, {
                language: selectedLanguage,
                code,
            });
            set({
                reviewResult: data.data.review,
                reviewedCode: code,
                isReviewing: false,
                reviewError: null,
            });
            toast.success('AI review complete');
        } catch (error) {
            set({ isReviewing: false, reviewError: error });
            const message = error.response?.data?.message || 'Failed to review code';
            toast.error(message);
        }
    },

    setLanguage: (lang) => {
        const { currentProblem } = get();
        const starterCode = currentProblem?.starterCode?.[lang] || STARTER_CODE[lang] || '';
        set({ selectedLanguage: lang, code: starterCode, executionResult: null, executionError: null, reviewResult: null, reviewError: null, reviewedCode: null });
    },

    setCode: (code) => set({ code }),

    resetExecution: () => set({ executionResult: null, executionError: null }),

    resetReview: () => set({ reviewResult: null, reviewError: null, reviewedCode: null }),
}));
