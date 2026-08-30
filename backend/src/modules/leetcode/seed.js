'use strict';

const prisma = require('../../config/database');
const logger = require('../../config/logger');

const PROBLEMS = [
    {
        number: 1,
        slug: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        validationStrategy: 'unordered-array',
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

**Example 1:**
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

**Example 2:**
Input: nums = [3,2,4], target = 6
Output: [1,2]

**Example 3:**
Input: nums = [3,3], target = 6
Output: [0,1]`,
        constraints: [
            '2 <= nums.length <= 10^4',
            '-10^9 <= nums[i] <= 10^9',
            '-10^9 <= target <= 10^9',
            'Only one valid answer exists.',
        ],
        examples: [
            { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
            { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: '' },
            { input: 'nums = [3,3], target = 6', output: '[0,1]', explanation: '' },
        ],
        topics: ['Array', 'Hash Table'],
        starterCode: {
            java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}',
            javascript: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    \n}',
            python: 'class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        ',
            cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};',
        },
        testCases: [
            { input: '[2,7,11,15]\n9', expectedOutput: '[0, 1]', isSample: true, explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
            { input: '[3,2,4]\n6', expectedOutput: '[1, 2]', isSample: true, explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
            { input: '[3,3]\n6', expectedOutput: '[0, 1]', isSample: true, explanation: 'nums[0] + nums[1] = 3 + 3 = 6' },
            { input: '[1,5,3,7]\n8', expectedOutput: '[0, 3]', isSample: false },
            { input: '[-1,-2,-3,-4,-5]\n-8', expectedOutput: '[2, 4]', isSample: false },
        ],
    },
    {
        number: 20,
        slug: 'valid-parentheses',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Example 1:**
Input: s = "()"
Output: true

**Example 2:**
Input: s = "()[]{}"
Output: true

**Example 3:**
Input: s = "(]"
Output: false`,
        constraints: [
            '1 <= s.length <= 10^4',
            's consists of parentheses only \'()[]{}\'',
        ],
        examples: [
            { input: 's = "()"', output: 'true', explanation: '' },
            { input: 's = "()[]{}"', output: 'true', explanation: '' },
            { input: 's = "(]"', output: 'false', explanation: '' },
        ],
        topics: ['String', 'Stack'],
        starterCode: {
            java: 'class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}',
            javascript: '/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n    \n}',
            python: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        ',
            cpp: 'class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};',
        },
        testCases: [
            { input: '()', expectedOutput: 'true', isSample: true },
            { input: '()[]{}', expectedOutput: 'true', isSample: true },
            { input: '(]', expectedOutput: 'false', isSample: true },
            { input: '([)]', expectedOutput: 'false', isSample: false },
            { input: '{[]}', expectedOutput: 'true', isSample: false },
            { input: '(', expectedOutput: 'false', isSample: false },
        ],
    },
    {
        number: 121,
        slug: 'best-time-to-buy-and-sell-stock',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`ith\` day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

**Example 1:**
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.

**Example 2:**
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.`,
        constraints: [
            '1 <= prices.length <= 10^5',
            '0 <= prices[i] <= 10^4',
        ],
        examples: [
            { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.' },
            { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No transactions are done and the max profit = 0.' },
        ],
        topics: ['Array', 'Dynamic Programming'],
        starterCode: {
            java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}',
            javascript: '/**\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(prices) {\n    \n}',
            python: 'class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        ',
            cpp: 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};',
        },
        testCases: [
            { input: '[7,1,5,3,6,4]', expectedOutput: '5', isSample: true },
            { input: '[7,6,4,3,1]', expectedOutput: '0', isSample: true },
            { input: '[2,4,1]', expectedOutput: '2', isSample: false },
            { input: '[1]', expectedOutput: '0', isSample: false },
        ],
    },
    {
        number: 125,
        slug: 'valid-palindrome',
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return true if it is a palindrome, or false otherwise.

**Example 1:**
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.

**Example 2:**
Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.

**Example 3:**
Input: s = " "
Output: true
Explanation: s is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.`,
        constraints: [
            '1 <= s.length <= 2 * 10^5',
            's consists only of printable ASCII characters.',
        ],
        examples: [
            { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
            { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' },
            { input: 's = " "', output: 'true', explanation: 'Empty string after removing non-alphanumeric characters.' },
        ],
        topics: ['Two Pointers', 'String'],
        starterCode: {
            java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        \n    }\n}',
            javascript: '/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isPalindrome(s) {\n    \n}',
            python: 'class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        ',
            cpp: 'class Solution {\npublic:\n    bool isPalindrome(string s) {\n        \n    }\n};',
        },
        testCases: [
            { input: 'A man, a plan, a canal: Panama', expectedOutput: 'true', isSample: true },
            { input: 'race a car', expectedOutput: 'false', isSample: true },
            { input: ' ', expectedOutput: 'true', isSample: true },
            { input: '0P', expectedOutput: 'false', isSample: false },
        ],
    },
    {
        number: 206,
        slug: 'reverse-linked-list',
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.

**Example 1:**
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

**Example 2:**
Input: head = [1,2]
Output: [2,1]

**Example 3:**
Input: head = []
Output: []`,
        constraints: [
            'The number of nodes in the list is the range [0, 5000].',
            '-5000 <= Node.val <= 5000',
        ],
        examples: [
            { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: '' },
            { input: 'head = [1,2]', output: '[2,1]', explanation: '' },
            { input: 'head = []', output: '[]', explanation: '' },
        ],
        topics: ['Linked List', 'Recursion'],
        starterCode: {
            java: '/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}',
            javascript: '/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nfunction reverseList(head) {\n    \n}',
            python: '# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        ',
            cpp: '/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode() : val(0), next(nullptr) {}\n *     ListNode(int x) : val(x), next(nullptr) {}\n *     ListNode(int x, ListNode *next) : val(x), next(next) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        \n    }\n};',
        },
        testCases: [
            { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', isSample: true },
            { input: '[1,2]', expectedOutput: '[2,1]', isSample: true },
            { input: '[]', expectedOutput: '[]', isSample: true },
            { input: '[1]', expectedOutput: '[1]', isSample: false },
        ],
    },
    {
        number: 704,
        slug: 'binary-search',
        title: 'Binary Search',
        difficulty: 'Easy',
        description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.

**Example 1:**
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4

**Example 2:**
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1`,
        constraints: [
            '1 <= nums.length <= 10^4',
            '-10^4 < nums[i], target < 10^4',
            'All the integers in nums are unique.',
            'nums is sorted in ascending order.',
        ],
        examples: [
            { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' },
            { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1' },
        ],
        topics: ['Array', 'Binary Search'],
        starterCode: {
            java: 'class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}',
            javascript: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction search(nums, target) {\n    \n}',
            python: 'class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        ',
            cpp: 'class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};',
        },
        testCases: [
            { input: '[-1,0,3,5,9,12]\n9', expectedOutput: '4', isSample: true },
            { input: '[-1,0,3,5,9,12]\n2', expectedOutput: '-1', isSample: true },
            { input: '[5]\n5', expectedOutput: '0', isSample: false },
            { input: '[-1,0,2,4,6,8]\n3', expectedOutput: '-1', isSample: false },
        ],
    },
    {
        number: 15,
        slug: '3sum',
        title: '3Sum',
        difficulty: 'Medium',
        validationStrategy: 'unordered-nested-list',
        description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.

**Example 1:**
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]

**Example 2:**
Input: nums = [0,1,1]
Output: []

**Example 3:**
Input: nums = [0,0,0]
Output: [[0,0,0]]`,
        constraints: [
            '3 <= nums.length <= 3000',
            '-10^5 <= nums[i] <= 10^5',
        ],
        examples: [
            { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: '' },
            { input: 'nums = [0,1,1]', output: '[]', explanation: '' },
            { input: 'nums = [0,0,0]', output: '[[0,0,0]]', explanation: '' },
        ],
        topics: ['Array', 'Two Pointers', 'Sorting'],
        starterCode: {
            java: 'import java.util.*;\nclass Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        \n    }\n}',
            javascript: '/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction threeSum(nums) {\n    \n}',
            python: 'class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        ',
            cpp: 'class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        \n    }\n};',
        },
        testCases: [
            { input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]', isSample: true, explanation: 'nums[0] + nums[1] + nums[4] = (-1) + 0 + 1 = 0. nums[0] + nums[2] + nums[3] = (-1) + 1 + 2 = 0. The distinct triplets are [-1,0,1] and [-1,-1,2].' },
            { input: '[0,1,1]', expectedOutput: '[]', isSample: true, explanation: 'The only possible triplet does not sum up to 0.' },
            { input: '[0,0,0]', expectedOutput: '[[0,0,0]]', isSample: true, explanation: 'The only possible triplet sums up to 0.' },
            { input: '[-2,0,1,1,2]', expectedOutput: '[[-2,0,2],[-2,1,1]]', isSample: false },
        ],
    },
    {
        number: 46,
        slug: 'permutations',
        title: 'Permutations',
        difficulty: 'Medium',
        validationStrategy: 'unordered-nested-list',
        description: `Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.

**Example 1:**
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

**Example 2:**
Input: nums = [0,1]
Output: [[0,1],[1,0]]

**Example 3:**
Input: nums = [1]
Output: [[1]]`,
        constraints: [
            '1 <= nums.length <= 6',
            '-10 <= nums[i] <= 10',
            'All the integers of nums are unique.',
        ],
        examples: [
            { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', explanation: '' },
            { input: 'nums = [0,1]', output: '[[0,1],[1,0]]', explanation: '' },
            { input: 'nums = [1]', output: '[[1]]', explanation: '' },
        ],
        topics: ['Array', 'Backtracking'],
        starterCode: {
            java: 'import java.util.*;\nclass Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        \n    }\n}',
            javascript: '/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction permute(nums) {\n    \n}',
            python: 'class Solution:\n    def permute(self, nums: list[int]) -> list[list[int]]:\n        ',
            cpp: 'class Solution {\npublic:\n    vector<vector<int>> permute(vector<int>& nums) {\n        \n    }\n};',
        },
        testCases: [
            { input: '[1,2,3]', expectedOutput: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', isSample: true, explanation: 'All permutations of [1,2,3] are listed.' },
            { input: '[0,1]', expectedOutput: '[[0,1],[1,0]]', isSample: true, explanation: '' },
            { input: '[1]', expectedOutput: '[[1]]', isSample: true, explanation: '' },
        ],
    },
    {
        number: 78,
        slug: 'subsets',
        title: 'Subsets',
        difficulty: 'Medium',
        validationStrategy: 'unordered-nested-list',
        description: `Given an integer array nums of unique elements, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in any order.

**Example 1:**
Input: nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]

**Example 2:**
Input: nums = [0]
Output: [[],[0]]`,
        constraints: [
            '1 <= nums.length <= 10',
            '-10 <= nums[i] <= 10',
            'All the numbers of nums are unique.',
        ],
        examples: [
            { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]', explanation: '' },
            { input: 'nums = [0]', output: '[[],[0]]', explanation: '' },
        ],
        topics: ['Array', 'Backtracking', 'Bit Manipulation'],
        starterCode: {
            java: 'import java.util.*;\nclass Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        \n    }\n}',
            javascript: '/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction subsets(nums) {\n    \n}',
            python: 'class Solution:\n    def subsets(self, nums: list[int]) -> list[list[int]]:\n        ',
            cpp: 'class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        \n    }\n};',
        },
        testCases: [
            { input: '[1,2,3]', expectedOutput: '[[1,2,3],[1,2],[1,3],[1],[2,3],[2],[3],[]]', isSample: true, explanation: 'The power set of [1,2,3] contains 2^3 = 8 subsets.' },
            { input: '[0]', expectedOutput: '[[0],[]]', isSample: true, explanation: '' },
        ],
    },
    {
        number: 56,
        slug: 'merge-intervals',
        title: 'Merge Intervals',
        difficulty: 'Medium',
        validationStrategy: 'exact',
        description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

**Example 1:**
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]

**Example 2:**
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]`,
        constraints: [
            '1 <= intervals.length <= 10^4',
            'intervals[i].length == 2',
            '0 <= starti <= endi <= 10^4',
        ],
        examples: [
            { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: '' },
            { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: '' },
        ],
        topics: ['Array', 'Sorting'],
        starterCode: {
            java: 'import java.util.*;\nclass Solution {\n    public int[][] merge(int[][] intervals) {\n        \n    }\n}',
            javascript: '/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction merge(intervals) {\n    \n}',
            python: 'class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        ',
            cpp: 'class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        \n    }\n};',
        },
        testCases: [
            { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]', isSample: true },
            { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]', isSample: true },
            { input: '[[1,4],[0,4]]', expectedOutput: '[[0,4]]', isSample: false },
            { input: '[[1,10],[2,3],[4,5]]', expectedOutput: '[[1,10]]', isSample: false },
        ],
    },
    {
        number: 200,
        slug: 'number-of-islands',
        title: 'Number of Islands',
        difficulty: 'Medium',
        validationStrategy: 'exact',
        description: `Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.

**Example 1:**
Input: grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]
Output: 1

**Example 2:**
Input: grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]
Output: 3`,
        constraints: [
            'm == grid.length',
            'n == grid[i].length',
            '1 <= m, n <= 300',
            "grid[i][j] is '0' or '1'.",
        ],
        examples: [
            { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1', explanation: '' },
            { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3', explanation: '' },
        ],
        topics: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
        starterCode: {
            java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        \n    }\n}',
            javascript: '/**\n * @param {character[][]} grid\n * @return {number}\n */\nfunction numIslands(grid) {\n    \n}',
            python: 'class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        ',
            cpp: 'class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        \n    }\n};',
        },
        testCases: [
            { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1', isSample: true },
            { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3', isSample: true },
            { input: '[["0"]]', expectedOutput: '0', isSample: false },
            { input: '[["1"]]', expectedOutput: '1', isSample: false },
        ],
    },
    {
        number: 49,
        slug: 'group-anagrams',
        title: 'Group Anagrams',
        difficulty: 'Medium',
        validationStrategy: 'unordered-nested-string-list',
        description: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

**Example 1:**
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]

**Example 2:**
Input: strs = [""]
Output: [[""]]

**Example 3:**
Input: strs = ["a"]
Output: [["a"]]`,
        constraints: [
            '1 <= strs.length <= 10^4',
            '0 <= strs[i].length <= 100',
            'strs[i] consists of lowercase English letters.',
        ],
        examples: [
            { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: '' },
            { input: 'strs = [""]', output: '[[""]]', explanation: '' },
            { input: 'strs = ["a"]', output: '[["a"]]', explanation: '' },
        ],
        topics: ['Hash Table', 'String', 'Sorting'],
        starterCode: {
            java: 'import java.util.*;\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        \n    }\n}',
            javascript: '/**\n * @param {string[]} strs\n * @return {string[][]}\n */\nfunction groupAnagrams(strs) {\n    \n}',
            python: 'class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        ',
            cpp: 'class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        \n    }\n};',
        },
        testCases: [
            { input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["eat","tea","ate"],["tan","nat"],["bat"]]', isSample: true, explanation: '' },
            { input: '[""]', expectedOutput: '[[""]]', isSample: true, explanation: '' },
            { input: '["a"]', expectedOutput: '[["a"]]', isSample: true, explanation: '' },
            { input: '["abc","bca","cab","foo","oof","bar"]', expectedOutput: '[["abc","bca","cab"],["foo","oof"],["bar"]]', isSample: false },
        ],
    },
    {
        number: 1491,
        slug: 'average-salary-excluding-the-minimum-and-maximum-salary',
        title: 'Average Salary Excluding the Minimum and Maximum Salary',
        difficulty: 'Easy',
        validationStrategy: 'float-epsilon',
        description: `You are given an integer array \`salary\` of length \`3\` where each element represents the salary of an employee. Return the average salary of employees excluding the minimum and maximum salaries.

**Example 1:**
Input: salary = [4000,3000,1000,2000]
Output: 2500.00000
Explanation: Minimum salary and maximum salary are 1000 and 4000 respectively.
Average salary excluding minimum and maximum salary is (3000 + 2000) / 2 = 2500

**Example 2:**
Input: salary = [1000,2000,3000]
Output: 2000.00000
Explanation: Minimum salary and maximum salary are 1000 and 3000 respectively.
Average salary excluding minimum and maximum salary is (2000) / 1 = 2000`,
        constraints: [
            'salary.length == 3',
            '1000 <= salary[i] <= 10^6',
            'All the integers of salary are unique.',
        ],
        examples: [
            { input: 'salary = [4000,3000,1000,2000]', output: '2500.00000', explanation: '' },
            { input: 'salary = [1000,2000,3000]', output: '2000.00000', explanation: '' },
        ],
        topics: ['Array', 'Sorting'],
        starterCode: {
            java: 'class Solution {\n    public double average(int[] salary) {\n        \n    }\n}',
            javascript: '/**\n * @param {number[]} salary\n * @return {number}\n */\nfunction average(salary) {\n    \n}',
            python: 'class Solution:\n    def average(self, salary: list[int]) -> float:\n        ',
            cpp: 'class Solution {\npublic:\n    double average(vector<int>& salary) {\n        \n    }\n};',
        },
        testCases: [
            { input: '[4000,3000,1000,2000]', expectedOutput: '2500.0', isSample: true },
            { input: '[1000,2000,3000]', expectedOutput: '2000.0', isSample: true },
            { input: '[6000,5000,4000]', expectedOutput: '5000.0', isSample: false },
            { input: '[8000,9000,2000,3000]', expectedOutput: '5500.0', isSample: false },
            { input: '[3000,1000,2000,4000,5000]', expectedOutput: '3000.0', isSample: false },
        ],
    },
    {
        number: 2469,
        slug: 'convert-the-temperature',
        title: 'Convert the Temperature',
        difficulty: 'Easy',
        validationStrategy: 'float-epsilon-array',
        description: `You are given a non-negative floating point number celsius, representing the temperature in Celsius. It should be converted to Kelvin and Fahrenheit using these formulas:

kelvin = celsius + 273.15
fahrenheit = celsius * 1.8 + 32

Return an array of elements [kelvin, fahrenheit].

**Example 1:**
Input: celsius = 36.50
Output: [309.65000,97.70000]
Explanation: Temperature at 36.50 Celsius is converted to 309.65 Kelvin and 97.70 Fahrenheit.

**Example 2:**
Input: celsius = 122.11
Output: [395.26000,251.79800]
Explanation: Temperature at 122.11 Celsius is converted to 395.26 Kelvin and 251.798 Fahrenheit.`,
        constraints: [
            '0 <= celsius <= 1000',
        ],
        examples: [
            { input: 'celsius = 36.50', output: '[309.65000,97.70000]', explanation: '' },
            { input: 'celsius = 122.11', output: '[395.26000,251.79800]', explanation: '' },
        ],
        topics: ['Math'],
        starterCode: {
            java: 'class Solution {\n    public double[] convertTemperature(double celsius) {\n        \n    }\n}',
            javascript: '/**\n * @param {number} celsius\n * @return {number[]}\n */\nfunction convertTemperature(celsius) {\n    \n}',
            python: 'class Solution:\n    def convertTemperature(self, celsius: float) -> list[float]:\n        ',
            cpp: 'class Solution {\npublic:\n    vector<double> convertTemperature(double celsius) {\n        \n    }\n};',
        },
        testCases: [
            { input: '36.50', expectedOutput: '[309.65,97.7]', isSample: true },
            { input: '122.11', expectedOutput: '[395.26,251.798]', isSample: true },
            { input: '0.0', expectedOutput: '[273.15,32.0]', isSample: false },
            { input: '100.0', expectedOutput: '[373.15,212.0]', isSample: false },
            { input: '32.33', expectedOutput: '[305.48,90.194]', isSample: false },
        ],
    },
];

const seedProblems = async () => {
    logger.info('[Seed] Starting LeetCode problem seed...');

    let created = 0;
    let updated = 0;

    for (const problemData of PROBLEMS) {
        const { testCases, ...problemFields } = problemData;

        const existing = await prisma.leetCodeProblem.findUnique({
            where: { number: problemFields.number },
        });

        let problem;
        if (existing) {
            problem = await prisma.leetCodeProblem.update({
                where: { id: existing.id },
                data: problemFields,
            });
            updated++;
        } else {
            problem = await prisma.leetCodeProblem.create({
                data: problemFields,
            });
            created++;
        }

        const existingTestCount = await prisma.leetCodeTestCase.count({
            where: { problemId: problem.id },
        });

        if (existingTestCount === 0) {
            await prisma.leetCodeTestCase.createMany({
                data: testCases.map((tc) => ({
                    problemId: problem.id,
                    input: tc.input,
                    expectedOutput: tc.expectedOutput,
                    isSample: tc.isSample,
                    explanation: tc.explanation || null,
                })),
            });
        }

        logger.info(`[Seed] Problem #${problem.number}: ${problem.title} (${problem.difficulty}) - ${testCases.length} test cases`);
    }

    logger.info(`[Seed] Completed: ${created} created, ${updated} updated`);
    return { created, updated, total: PROBLEMS.length };
};

module.exports = { seedProblems, PROBLEMS };
