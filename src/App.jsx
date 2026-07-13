import { useState, useEffect, useMemo } from "react";

/* ==============================================================
   CODE QUEST — 22-Day DSA + React Challenge
   Basic → complex. Each day unlocks only after you pass the
   previous day's quiz. 2★ to pass, 3★ for a perfect run.
   Works inside Claude (window.storage) AND deployed (localStorage).
   ============================================================== */

const LC = (s) => `https://leetcode.com/problems/${s}/`;
const RD = (s) => `https://react.dev/learn/${s}`;

/* ---------- storage adapter: Claude artifact OR deployed app ---------- */
const store = {
  async get(key) {
    if (typeof window !== "undefined" && window.storage) {
      try {
        const r = await window.storage.get(key);
        return r ? r.value : null;
      } catch { return null; }
    }
    try { return localStorage.getItem(key); } catch { return null; }
  },
  async set(key, val) {
    if (typeof window !== "undefined" && window.storage) {
      try { await window.storage.set(key, val); return true; } catch { return false; }
    }
    try { localStorage.setItem(key, val); return true; } catch { return false; }
  },
  async remove(key) {
    if (typeof window !== "undefined" && window.storage) {
      try { await window.storage.delete(key); return true; } catch { return false; }
    }
    try { localStorage.removeItem(key); return true; } catch { return false; }
  },
};

/* ---------------------------- 22 DAYS ---------------------------- */
const CHAPTERS = [
  { title: "Chapter 1 · Foundations", from: 1, to: 5, emoji: "🌱" },
  { title: "Chapter 2 · Patterns", from: 6, to: 10, emoji: "🧩" },
  { title: "Chapter 3 · Structures", from: 11, to: 15, emoji: "🔗" },
  { title: "Chapter 4 · Boss Levels", from: 16, to: 22, emoji: "🏔️" },
];

const DAYS = [
  {
    d: 1, emoji: "🌱", name: "Wake-up Call",
    dsa: "Big-O & Arrays", react: "JSX & Components",
    tasks: [
      { t: "dsa", label: "Two Sum", url: LC("two-sum"), mins: 25 },
      { t: "dsa", label: "Contains Duplicate", url: LC("contains-duplicate"), mins: 15 },
      { t: "react", label: "Read: Your First Component + build a profile card", url: RD("your-first-component"), mins: 45 },
    ],
    quiz: [
      { q: "Accessing arr[i] in an array costs…", opts: ["O(n)", "O(1)", "O(log n)"], a: 1 },
      { q: "Optimal Two Sum uses…", opts: ["Nested loops", "A hash map in one pass", "Sorting only"], a: 1 },
      { q: "JSX is…", opts: ["A templating language sent to the server", "Syntax for describing UI inside JavaScript", "A CSS framework"], a: 1 },
    ],
  },
  {
    d: 2, emoji: "📈", name: "First Profits",
    dsa: "Arrays & Hashing", react: "Props & Rendering Lists",
    tasks: [
      { t: "dsa", label: "Best Time to Buy & Sell Stock", url: LC("best-time-to-buy-and-sell-stock"), mins: 25 },
      { t: "dsa", label: "Valid Anagram", url: LC("valid-anagram"), mins: 20 },
      { t: "react", label: "Read: Passing Props + render a card list from an array", url: RD("passing-props-to-a-component"), mins: 45 },
    ],
    quiz: [
      { q: "Buy/Sell Stock in one pass tracks…", opts: ["The max price so far", "The min price so far", "Every pair of days"], a: 1 },
      { q: "Cleanest anagram check:", opts: ["Regex", "Character frequency counts", "Compare all pairs"], a: 1 },
      { q: "Props are…", opts: ["Read-only inputs from the parent", "Mutable local state", "Global config"], a: 0 },
    ],
  },
  {
    d: 3, emoji: "🗂️", name: "Bucket Brigade",
    dsa: "Hash Maps II", react: "State & Events",
    tasks: [
      { t: "dsa", label: "Group Anagrams", url: LC("group-anagrams"), mins: 30 },
      { t: "dsa", label: "Top K Frequent Elements", url: LC("top-k-frequent-elements"), mins: 30 },
      { t: "react", label: "Read: State, a Component's Memory + build counter & toggle", url: RD("state-a-components-memory"), mins: 40 },
    ],
    quiz: [
      { q: "Group Anagrams groups words by…", opts: ["Length", "A canonical key (sorted word / char count)", "First letter"], a: 1 },
      { q: "Top K Frequent starts with…", opts: ["Sorting the raw array", "A frequency hash map", "Binary search"], a: 1 },
      { q: "A component re-renders when…", opts: ["Any variable changes", "Its state updates via the setter", "You call it twice"], a: 1 },
    ],
  },
  {
    d: 4, emoji: "🪞", name: "Mirror Check",
    dsa: "Prefix Tricks & Strings", react: "Conditional Rendering",
    tasks: [
      { t: "dsa", label: "Product of Array Except Self", url: LC("product-of-array-except-self"), mins: 35 },
      { t: "dsa", label: "Valid Palindrome", url: LC("valid-palindrome"), mins: 20 },
      { t: "react", label: "Read: Conditional Rendering + build a tabs component", url: RD("conditional-rendering"), mins: 40 },
    ],
    quiz: [
      { q: "Product Except Self without division uses…", opts: ["Prefix and suffix products", "Sorting", "A stack"], a: 0 },
      { q: "Valid Palindrome moves pointers…", opts: ["Both rightward", "From both ends toward the middle", "Randomly"], a: 1 },
      { q: "Show a component only when a condition is true:", opts: ["cond && <Comp />", "if inside JSX braces", "<Comp if={cond} />"], a: 0 },
    ],
  },
  {
    d: 5, emoji: "🤝", name: "Twin Pointers",
    dsa: "Two Pointers", react: "Forms & Controlled Inputs",
    tasks: [
      { t: "dsa", label: "Two Sum II (sorted input)", url: LC("two-sum-ii-input-array-is-sorted"), mins: 25 },
      { t: "dsa", label: "3Sum", url: LC("3sum"), mins: 40 },
      { t: "react", label: "Build: signup form with validation + disabled submit", url: RD("reacting-to-input-with-state"), mins: 45 },
    ],
    quiz: [
      { q: "Two pointers from both ends needs the array to be…", opts: ["Sorted", "Unique", "Short"], a: 0 },
      { q: "3Sum with sort + two pointers runs in…", opts: ["O(n)", "O(n²)", "O(n³)"], a: 1 },
      { q: "A controlled input's value comes from…", opts: ["The DOM", "React state", "A ref"], a: 1 },
    ],
  },
  {
    d: 6, emoji: "🪟", name: "Window Shopping",
    dsa: "Sliding Window I", react: "useEffect Basics",
    tasks: [
      { t: "dsa", label: "Longest Substring Without Repeating Characters", url: LC("longest-substring-without-repeating-characters"), mins: 35 },
      { t: "dsa", label: "Maximum Average Subarray I", url: LC("maximum-average-subarray-i"), mins: 20 },
      { t: "react", label: "Read: Synchronizing with Effects + build a document-title updater", url: RD("synchronizing-with-effects"), mins: 40 },
    ],
    quiz: [
      { q: "A variable-size window shrinks when…", opts: ["Every step", "The constraint is violated", "The array ends"], a: 1 },
      { q: "Track chars inside the window with…", opts: ["A Set / hash map", "A sorted list", "Recursion"], a: 0 },
      { q: "useEffect with [] runs…", opts: ["Every render", "Once after the first render", "Never"], a: 1 },
    ],
  },
  {
    d: 7, emoji: "📡", name: "Signal Found",
    dsa: "Sliding Window II", react: "Fetching Data",
    tasks: [
      { t: "dsa", label: "Minimum Size Subarray Sum", url: LC("minimum-size-subarray-sum"), mins: 30 },
      { t: "dsa", label: "Permutation in String", url: LC("permutation-in-string"), mins: 35 },
      { t: "react", label: "Build: fetch + render a list with loading, error & empty states", url: RD("you-might-not-need-an-effect"), mins: 45 },
    ],
    quiz: [
      { q: "Updating a fixed-size window sum per step costs…", opts: ["O(k)", "O(1)", "O(n)"], a: 1 },
      { q: "Minimum Size Subarray Sum shrinks while…", opts: ["sum ≥ target", "sum < target", "the window is empty"], a: 0 },
      { q: "A good fetch UI always models…", opts: ["Only the data", "Loading, error and empty states", "Just errors"], a: 1 },
    ],
  },
  {
    d: 8, emoji: "🥞", name: "Stack Attack",
    dsa: "Stacks I", react: "Lifting State Up",
    tasks: [
      { t: "dsa", label: "Valid Parentheses", url: LC("valid-parentheses"), mins: 20 },
      { t: "dsa", label: "Min Stack", url: LC("min-stack"), mins: 30 },
      { t: "react", label: "Read: Sharing State + refactor your Todo filter to the parent", url: RD("sharing-state-between-components"), mins: 45 },
    ],
    quiz: [
      { q: "A stack is…", opts: ["FIFO", "LIFO", "Sorted"], a: 1 },
      { q: "Valid Parentheses is solved with…", opts: ["A queue", "A stack", "Two pointers"], a: 1 },
      { q: "Shared state should live in…", opts: ["The first child", "The closest common parent", "localStorage"], a: 1 },
    ],
  },
  {
    d: 9, emoji: "🌡️", name: "Heat Map",
    dsa: "Stacks II — Monotonic", react: "useReducer",
    tasks: [
      { t: "dsa", label: "Daily Temperatures", url: LC("daily-temperatures"), mins: 35 },
      { t: "dsa", label: "Evaluate Reverse Polish Notation", url: LC("evaluate-reverse-polish-notation"), mins: 25 },
      { t: "react", label: "Read: Extracting State into a Reducer + refactor Todo to useReducer", url: RD("extracting-state-logic-into-a-reducer"), mins: 45 },
    ],
    quiz: [
      { q: "Daily Temperatures uses…", opts: ["Sliding window", "A monotonic stack", "DP"], a: 1 },
      { q: "Evaluating RPN pushes ___ onto the stack.", opts: ["Operators", "Operands (numbers)", "Parentheses"], a: 1 },
      { q: "useReducer returns…", opts: ["[state, dispatch]", "[dispatch, state]", "A promise"], a: 0 },
    ],
  },
  {
    d: 10, emoji: "🚉", name: "Queue Junction",
    dsa: "Queues & Monotonic II", react: "Context",
    tasks: [
      { t: "dsa", label: "Next Greater Element I", url: LC("next-greater-element-i"), mins: 30 },
      { t: "dsa", label: "Implement Queue using Stacks", url: LC("implement-queue-using-stacks"), mins: 30 },
      { t: "react", label: "Read: Passing Data Deeply with Context + add a theme switcher", url: RD("passing-data-deeply-with-context"), mins: 40 },
    ],
    quiz: [
      { q: "Next Greater Element combines a monotonic stack with…", opts: ["A hash map of answers", "Sorting", "Binary search"], a: 0 },
      { q: "A queue is…", opts: ["LIFO", "FIFO", "Random"], a: 1 },
      { q: "Context mainly eliminates…", opts: ["Re-renders", "Prop drilling", "Effects"], a: 1 },
    ],
  },
  {
    d: 11, emoji: "🔗", name: "Chain Reaction",
    dsa: "Linked Lists I", react: "Custom Hooks I",
    tasks: [
      { t: "dsa", label: "Reverse Linked List", url: LC("reverse-linked-list"), mins: 25 },
      { t: "dsa", label: "Merge Two Sorted Lists", url: LC("merge-two-sorted-lists"), mins: 25 },
      { t: "react", label: "Read: Reusing Logic with Custom Hooks + build useToggle & useDebounce", url: RD("reusing-logic-with-custom-hooks"), mins: 45 },
    ],
    quiz: [
      { q: "Iterative list reversal tracks…", opts: ["prev, curr, next", "head, tail", "left, right"], a: 0 },
      { q: "Merging two sorted lists is easiest with…", opts: ["Recursion only", "A dummy head node", "An array copy"], a: 1 },
      { q: "A custom hook must…", opts: ["Return JSX", "Start with 'use'", "Live in its own file"], a: 1 },
    ],
  },
  {
    d: 12, emoji: "🌀", name: "Cycle Breaker",
    dsa: "Linked Lists II", react: "Custom Hooks II — useFetch",
    tasks: [
      { t: "dsa", label: "Linked List Cycle", url: LC("linked-list-cycle"), mins: 20 },
      { t: "dsa", label: "Remove Nth Node From End of List", url: LC("remove-nth-node-from-end-of-list"), mins: 30 },
      { t: "react", label: "Build: a useFetch hook with loading/error + AbortController cleanup", url: RD("reusing-logic-with-custom-hooks"), mins: 50 },
    ],
    quiz: [
      { q: "Detect a cycle in O(1) space with…", opts: ["A hash set", "Fast & slow pointers", "Sorting"], a: 1 },
      { q: "Remove Nth from end in one pass uses…", opts: ["Two pointers with an n-node gap", "A stack", "Recursion only"], a: 0 },
      { q: "useFetch should cancel stale requests via…", opts: ["setTimeout", "AbortController in the effect cleanup", "try/catch"], a: 1 },
    ],
  },
  {
    d: 13, emoji: "🎯", name: "Halfway Point",
    dsa: "Binary Search I", react: "Debounced Search UI",
    tasks: [
      { t: "dsa", label: "Binary Search", url: LC("binary-search"), mins: 20 },
      { t: "dsa", label: "Search Insert Position", url: LC("search-insert-position"), mins: 20 },
      { t: "react", label: "Build: live search box combining useFetch + useDebounce", url: RD("reusing-logic-with-custom-hooks"), mins: 50 },
    ],
    quiz: [
      { q: "Binary search runs in…", opts: ["O(n)", "O(log n)", "O(1)"], a: 1 },
      { q: "Search Insert Position is really…", opts: ["A linear scan", "Binary search for the left boundary", "Sorting"], a: 1 },
      { q: "Debouncing a search input…", opts: ["Delays acting until typing pauses", "Blocks typing", "Caches results"], a: 0 },
    ],
  },
  {
    d: 14, emoji: "🍌", name: "Rotated Reality",
    dsa: "Binary Search II", react: "React Router Basics",
    tasks: [
      { t: "dsa", label: "Search in Rotated Sorted Array", url: LC("search-in-rotated-sorted-array"), mins: 35 },
      { t: "dsa", label: "Koko Eating Bananas", url: LC("koko-eating-bananas"), mins: 35 },
      { t: "react", label: "Read: React Router routing + set up a 2-page app", url: "https://reactrouter.com/start/framework/routing", mins: 45 },
    ],
    quiz: [
      { q: "Rotated array search first decides…", opts: ["Which half is sorted", "The pivot exactly", "The max element"], a: 0 },
      { q: "Koko Eating Bananas binary-searches over…", opts: ["The pile array", "The answer (eating speed)", "Indexes"], a: 1 },
      { q: "SPA routing changes the view without…", opts: ["JavaScript", "A full page reload", "URLs"], a: 1 },
    ],
  },
  {
    d: 15, emoji: "🌳", name: "Into the Woods",
    dsa: "Trees I — Recursion", react: "Router Params",
    tasks: [
      { t: "dsa", label: "Maximum Depth of Binary Tree", url: LC("maximum-depth-of-binary-tree"), mins: 20 },
      { t: "dsa", label: "Invert Binary Tree", url: LC("invert-binary-tree"), mins: 20 },
      { t: "react", label: "Build: notes list → /notes/:id detail page with useParams", url: "https://reactrouter.com/start/framework/url-values", mins: 50 },
    ],
    quiz: [
      { q: "Max depth =", opts: ["Number of leaves", "1 + max(depth left, depth right)", "Node count"], a: 1 },
      { q: "Inverting a binary tree means…", opts: ["Sorting it", "Swapping left/right children recursively", "Deleting leaves"], a: 1 },
      { q: "Read the :id from the URL with…", opts: ["useState", "useParams", "props.id"], a: 1 },
    ],
  },
  {
    d: 16, emoji: "🌲", name: "Level Up",
    dsa: "Trees II — BFS", react: "Performance: useMemo & memo",
    tasks: [
      { t: "dsa", label: "Binary Tree Level Order Traversal", url: LC("binary-tree-level-order-traversal"), mins: 30 },
      { t: "dsa", label: "Diameter of Binary Tree", url: LC("diameter-of-binary-tree"), mins: 30 },
      { t: "react", label: "Read: useMemo & memo docs + memoize an expensive filter", url: "https://react.dev/reference/react/useMemo", mins: 40 },
    ],
    quiz: [
      { q: "Level-order traversal uses…", opts: ["A stack", "A queue (BFS)", "Two pointers"], a: 1 },
      { q: "Diameter of a tree is computed from…", opts: ["Left + right depths at each node", "Node count", "BFS levels"], a: 0 },
      { q: "useMemo caches…", opts: ["Components", "A computed value between renders", "Network calls"], a: 1 },
    ],
  },
  {
    d: 17, emoji: "⚖️", name: "Order in the Court",
    dsa: "Trees III — BST", react: "Optimize a Big List",
    tasks: [
      { t: "dsa", label: "Validate Binary Search Tree", url: LC("validate-binary-search-tree"), mins: 35 },
      { t: "dsa", label: "Kth Smallest Element in a BST", url: LC("kth-smallest-element-in-a-bst"), mins: 30 },
      { t: "react", label: "Exercise: render a 1,000-row filterable list, then optimize with memo", url: "https://react.dev/reference/react/memo", mins: 45 },
    ],
    quiz: [
      { q: "Validating a BST correctly requires…", opts: ["Comparing each node to its parent only", "Passing min/max bounds down", "Counting nodes"], a: 1 },
      { q: "Kth smallest in a BST exploits…", opts: ["BFS", "Inorder traversal being sorted", "Hashing"], a: 1 },
      { q: "React.memo skips a re-render when…", opts: ["State changes", "Props are shallow-equal", "Keys change"], a: 1 },
    ],
  },
  {
    d: 18, emoji: "🏝️", name: "Island Hopper",
    dsa: "Graphs I — Grids", react: "Error Boundaries & Edge Cases",
    tasks: [
      { t: "dsa", label: "Number of Islands", url: LC("number-of-islands"), mins: 35 },
      { t: "dsa", label: "Max Area of Island", url: LC("max-area-of-island"), mins: 30 },
      { t: "react", label: "Harden a past app: add an error boundary + empty/edge states", url: "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary", mins: 45 },
    ],
    quiz: [
      { q: "Number of Islands is classic…", opts: ["DP", "Flood fill with DFS/BFS", "Greedy"], a: 1 },
      { q: "Max Area of Island's DFS returns…", opts: ["Nothing", "The size of the region it consumed", "The perimeter"], a: 1 },
      { q: "Error boundaries catch…", opts: ["Event handler errors", "Rendering errors in their child tree", "Network errors"], a: 1 },
    ],
  },
  {
    d: 19, emoji: "🕸️", name: "The Web",
    dsa: "Graphs II", react: "Testing Intro",
    tasks: [
      { t: "dsa", label: "Clone Graph", url: LC("clone-graph"), mins: 35 },
      { t: "dsa", label: "Course Schedule", url: LC("course-schedule"), mins: 40 },
      { t: "react", label: "Read: React Testing Library intro & guiding principles", url: "https://testing-library.com/docs/react-testing-library/intro/", mins: 35 },
    ],
    quiz: [
      { q: "Clone Graph avoids infinite loops with…", opts: ["A visited map old→new node", "Sorting", "A counter"], a: 0 },
      { q: "Course Schedule = detecting…", opts: ["A shortest path", "A cycle in a directed graph", "Duplicates"], a: 1 },
      { q: "Testing Library recommends querying by…", opts: ["CSS class", "Accessible roles/labels (getByRole)", "Component name"], a: 1 },
    ],
  },
  {
    d: 20, emoji: "🧗", name: "The Climb",
    dsa: "Dynamic Programming I", react: "Write Real Tests",
    tasks: [
      { t: "dsa", label: "Climbing Stairs", url: LC("climbing-stairs"), mins: 25 },
      { t: "dsa", label: "House Robber", url: LC("house-robber"), mins: 30 },
      { t: "react", label: "Write: 4 tests for your Todo app (render, add, toggle, delete)", url: "https://testing-library.com/docs/queries/about/", mins: 50 },
    ],
    quiz: [
      { q: "Climbing Stairs follows which pattern?", opts: ["Kadane's", "Fibonacci", "Dijkstra"], a: 1 },
      { q: "House Robber recurrence:", opts: ["dp[i] = dp[i-1] + nums[i]", "dp[i] = max(dp[i-1], dp[i-2] + nums[i])", "dp[i] = nums[i]"], a: 1 },
      { q: "Good tests assert…", opts: ["Implementation details", "User-visible behavior", "Console output"], a: 1 },
    ],
  },
  {
    d: 21, emoji: "🛠️", name: "Capstone Forge",
    dsa: "DP II & Kadane", react: "Capstone Build",
    tasks: [
      { t: "dsa", label: "Maximum Subarray (Kadane's)", url: LC("maximum-subarray"), mins: 30 },
      { t: "dsa", label: "Coin Change", url: LC("coin-change"), mins: 40 },
      { t: "react", label: "Capstone: dashboard app — router + useFetch + reducer + context theme", url: "https://vitejs.dev/guide/", mins: 90 },
    ],
    quiz: [
      { q: "Kadane's finds max subarray sum in…", opts: ["O(n²)", "O(n)", "O(n log n)"], a: 1 },
      { q: "Coin Change (fewest coins) is…", opts: ["Greedy always works", "Unbounded-knapsack-style DP minimization", "Backtracking only"], a: 1 },
      { q: "Complex multi-action state in the capstone is best handled with…", opts: ["Many useStates", "useReducer", "Global variables"], a: 1 },
    ],
  },
  {
    d: 22, emoji: "🏆", name: "Ship Day",
    dsa: "Mixed Review", react: "Deploy & Document",
    tasks: [
      { t: "dsa", label: "Timed set: redo Two Sum, Valid Parentheses, Reverse LL — 45 min total", url: "https://neetcode.io/practice", mins: 45 },
      { t: "dsa", label: "Write 1-line pattern notes for every topic from Days 1–21", url: "https://neetcode.io/roadmap", mins: 30 },
      { t: "react", label: "Ship the capstone: deploy to Vercel/Netlify + write the README", url: "https://vercel.com/docs/getting-started-with-vercel", mins: 45 },
    ],
    quiz: [
      { q: "'Sorted array + find target' should instantly trigger…", opts: ["Hash map", "Binary search", "Stack"], a: 1 },
      { q: "'Longest/shortest subarray with condition X' triggers…", opts: ["Sliding window", "Topological sort", "Heap"], a: 0 },
      { q: "Deploying a Vite app means…", opts: ["Uploading src/ directly", "Running the build, then hosting the static output", "You need a Node server"], a: 1 },
    ],
  },
];

/* ---------------------------- helpers ---------------------------- */
const STORAGE_KEY = "codequest22:state";
const todayStr = () => new Date().toISOString().slice(0, 10);
const yesterdayStr = () => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); };
const starsFor = (score) => (score === 3 ? 3 : score === 2 ? 2 : 0);
const EMPTY = { done: {}, results: {}, streak: { count: 0, last: null }, log: {} };

export default function CodeQuest() {
  const [data, setData] = useState(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState({ type: "map" });
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [picked, setPicked] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await store.get(STORAGE_KEY);
      if (raw) { try { setData({ ...EMPTY, ...JSON.parse(raw) }); } catch {} }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    store.set(STORAGE_KEY, JSON.stringify(data));
  }, [data, loaded]);

  const totalStars = useMemo(() => Object.values(data.results).reduce((s, r) => s + (r.stars || 0), 0), [data.results]);
  const passed = (d) => (data.results[d]?.stars || 0) >= 2;
  const unlockedDay = (d) => d === 1 || passed(d - 1);
  const currentDay = DAYS.find((x) => !passed(x.d)) || DAYS[DAYS.length - 1];
  const doneToday = data.log[todayStr()] || 0;
  const streakLive = data.streak.last === todayStr() || data.streak.last === yesterdayStr() ? data.streak.count : 0;

  const dayProgress = (day) => {
    const total = day.tasks.length;
    const done = day.tasks.filter((_, i) => data.done[`d${day.d}-t${i}`]).length;
    return { done, total };
  };

  const bumpStreak = (prev) => {
    const t = todayStr();
    if (prev.streak.last === t) return prev.streak;
    return { count: prev.streak.last === yesterdayStr() ? prev.streak.count + 1 : 1, last: t };
  };

  const toggleTask = (key) => {
    setData((prev) => {
      const checking = !prev.done[key];
      const done = { ...prev.done, [key]: checking };
      const t = todayStr();
      const log = checking ? { ...prev.log, [t]: (prev.log[t] || 0) + 1 } : prev.log;
      const streak = checking ? bumpStreak(prev) : prev.streak;
      return { ...prev, done, log, streak };
    });
  };

  const startQuiz = (d) => { setQIdx(0); setAnswers([]); setPicked(null); setView({ type: "quiz", d }); };

  const answerQuestion = (day, optIdx) => {
    if (picked !== null) return;
    setPicked(optIdx);
    setTimeout(() => {
      const next = [...answers, optIdx];
      setAnswers(next); setPicked(null);
      if (next.length === day.quiz.length) {
        const score = next.filter((a, i) => a === day.quiz[i].a).length;
        const stars = starsFor(score);
        setData((prev) => {
          const prevBest = prev.results[day.d] || { stars: 0, best: 0 };
          return {
            ...prev,
            results: { ...prev.results, [day.d]: { stars: Math.max(prevBest.stars, stars), best: Math.max(prevBest.best, score) } },
            streak: bumpStreak(prev),
          };
        });
        setView({ type: "result", d: day.d, score, stars });
      } else setQIdx(next.length);
    }, 600);
  };

  const resetAll = async () => {
    await store.remove(STORAGE_KEY);
    setData(EMPTY); setConfirmReset(false); setView({ type: "map" });
  };

  if (!loaded) {
    return <div style={{ minHeight: "100vh", background: "#0D0B1E", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B87B3", fontFamily: "ui-monospace, monospace" }}>loading your quest…</div>;
  }

  return (
    <div className="cq-root">
      <style>{CSS}</style>

      <header className="cq-header">
        <div>
          <div className="cq-logo">CODE<span>QUEST</span> <em>· 22-day challenge</em></div>
          <div className="cq-sub">DSA + React, basic → complex · pass today's quiz to unlock tomorrow</div>
        </div>
        <div className="cq-stats">
          <div className="cq-stat"><span className="cq-stat-num">{streakLive}</span><span className="cq-stat-lbl">🔥 streak</span></div>
          <div className="cq-stat"><span className="cq-stat-num gold">{totalStars}<small>/66</small></span><span className="cq-stat-lbl">⭐ stars</span></div>
          <div className="cq-stat"><span className="cq-stat-num">{doneToday}</span><span className="cq-stat-lbl">✅ today</span></div>
        </div>
      </header>

      {view.type === "map" && (
        <>
          {/* today's mission */}
          <section className="cq-mission">
            <div className="cq-mission-head">
              <h2>Day {currentDay.d} — {currentDay.name} {currentDay.emoji}</h2>
              <span className="cq-chip">🧠 {currentDay.dsa} · ⚛️ {currentDay.react} · ~{currentDay.tasks.reduce((s, t) => s + t.mins, 0)} min</span>
            </div>
            {(() => {
              const prog = dayProgress(currentDay);
              const allDone = prog.done === prog.total;
              return allDone && !passed(currentDay.d) ? (
                <div className="cq-mission-quiz">
                  <p>Tasks complete. One thing between you and Day {Math.min(currentDay.d + 1, 22)}:</p>
                  <button className="cq-btn primary" onClick={() => startQuiz(currentDay.d)}>Take today's quiz →</button>
                </div>
              ) : (
                <ul className="cq-tasklist">
                  {currentDay.tasks.map((t, i) => {
                    const key = `d${currentDay.d}-t${i}`;
                    return (
                      <li key={key} className={data.done[key] ? "done" : ""}>
                        <button className="cq-check" onClick={() => toggleTask(key)} aria-label="mark done">{data.done[key] ? "✓" : ""}</button>
                        <span className={`cq-tag ${t.t}`}>{t.t === "dsa" ? "DSA" : "React"}</span>
                        <a href={t.url} target="_blank" rel="noreferrer">{t.label}</a>
                        <span className="cq-mins">{t.mins}m</span>
                      </li>
                    );
                  })}
                </ul>
              );
            })()}
          </section>

          {/* 22-day map */}
          <section className="cq-map">
            {CHAPTERS.map((ch) => (
              <div key={ch.title}>
                <h3 className="cq-chapter">{ch.emoji} {ch.title}</h3>
                <div className="cq-grid">
                  {DAYS.filter((x) => x.d >= ch.from && x.d <= ch.to).map((day) => {
                    const isUnlocked = unlockedDay(day.d);
                    const stars = data.results[day.d]?.stars || 0;
                    const isCurrent = day.d === currentDay.d && isUnlocked && !passed(day.d);
                    const prog = dayProgress(day);
                    return (
                      <button
                        key={day.d}
                        className={`cq-day ${!isUnlocked ? "locked" : ""} ${isCurrent ? "current" : ""} ${passed(day.d) ? "passed" : ""}`}
                        disabled={!isUnlocked}
                        onClick={() => setView({ type: "day", d: day.d })}
                      >
                        <span className="cq-day-num">Day {day.d}</span>
                        <span className="cq-day-emoji">{isUnlocked ? day.emoji : "🔒"}</span>
                        <span className="cq-day-name">{day.name}</span>
                        <span className="cq-day-topics">{day.dsa}<br />{day.react}</span>
                        <span className="cq-stars">{[1, 2, 3].map((n) => <i key={n} className={n <= stars ? "on" : ""}>★</i>)}</span>
                        {isUnlocked && !passed(day.d) && <span className="cq-prog">{prog.done}/{prog.total}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {passed(22) && <div className="cq-finish">🏁 22 days done. {totalStars === 66 ? "Perfect 66/66 — outrageous." : `${totalStars}/66 stars — retake any day for the full set.`}</div>}
          </section>
        </>
      )}

      {/* day detail */}
      {view.type === "day" && (() => {
        const day = DAYS.find((x) => x.d === view.d);
        const prog = dayProgress(day);
        const allDone = prog.done === prog.total;
        const stars = data.results[day.d]?.stars || 0;
        return (
          <section className="cq-detail">
            <button className="cq-back" onClick={() => setView({ type: "map" })}>← back to map</button>
            <div className="cq-detail-head">
              <span className="cq-detail-emoji">{day.emoji}</span>
              <div>
                <h2>Day {day.d} — {day.name}</h2>
                <div className="cq-day-topics inline">🧠 {day.dsa} · ⚛️ {day.react}</div>
                <span className="cq-stars big">{[1, 2, 3].map((n) => <i key={n} className={n <= stars ? "on" : ""}>★</i>)}</span>
              </div>
            </div>
            <div className="cq-bar"><div style={{ width: `${(prog.done / prog.total) * 100}%` }} /></div>
            <ul className="cq-tasklist">
              {day.tasks.map((t, i) => {
                const key = `d${day.d}-t${i}`;
                return (
                  <li key={key} className={data.done[key] ? "done" : ""}>
                    <button className="cq-check" onClick={() => toggleTask(key)} aria-label="mark done">{data.done[key] ? "✓" : ""}</button>
                    <span className={`cq-tag ${t.t}`}>{t.t === "dsa" ? "DSA" : "React"}</span>
                    <a href={t.url} target="_blank" rel="noreferrer">{t.label}</a>
                    <span className="cq-mins">{t.mins}m</span>
                  </li>
                );
              })}
            </ul>
            <div className="cq-quizrow">
              <button className="cq-btn primary" disabled={!allDone && stars === 0} onClick={() => startQuiz(day.d)}>
                {stars > 0 ? "Retake quiz (improve stars)" : allDone ? `Take the quiz → unlock Day ${Math.min(day.d + 1, 22)}` : "Finish all tasks to unlock the quiz"}
              </button>
              <span className="cq-muted small">3 questions · 3✓ = ★★★ · 2✓ = ★★ (pass) · below 2 = retry</span>
            </div>
          </section>
        );
      })()}

      {/* quiz */}
      {view.type === "quiz" && (() => {
        const day = DAYS.find((x) => x.d === view.d);
        const q = day.quiz[qIdx];
        return (
          <section className="cq-detail">
            <div className="cq-quiz-head">
              <h2>{day.emoji} Day {day.d} quiz</h2>
              <span className="cq-chip">Question {qIdx + 1} / {day.quiz.length}</span>
            </div>
            <div className="cq-bar"><div style={{ width: `${(qIdx / day.quiz.length) * 100}%` }} /></div>
            <p className="cq-question">{q.q}</p>
            <div className="cq-opts">
              {q.opts.map((opt, i) => {
                let cls = "cq-opt";
                if (picked !== null) { if (i === q.a) cls += " correct"; else if (i === picked) cls += " wrong"; }
                return (
                  <button key={i} className={cls} disabled={picked !== null} onClick={() => answerQuestion(day, i)}>
                    <b>{String.fromCharCode(65 + i)}</b> {opt}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })()}

      {/* result */}
      {view.type === "result" && (() => {
        const day = DAYS.find((x) => x.d === view.d);
        const pass = view.stars >= 2;
        return (
          <section className="cq-detail result">
            <div className="cq-result-stars">
              {[1, 2, 3].map((n) => <span key={n} className={`cq-big-star ${n <= view.stars ? "on" : ""}`} style={{ animationDelay: `${n * 0.18}s` }}>★</span>)}
            </div>
            <h2>{pass ? (view.stars === 3 ? "Flawless!" : "Day cleared!") : "So close!"}</h2>
            <p className="cq-muted">You scored {view.score} / {day.quiz.length} on Day {day.d} — {day.name}.</p>
            {pass ? (
              <p>{day.d < 22 ? <>Day {day.d + 1} — <b>{DAYS[day.d].name}</b> — is unlocked. Same time tomorrow. 🔥</> : "That's the whole challenge. Seriously well done."}</p>
            ) : (
              <p>You need 2 of 3 to pass. The answers are in today's links — a 5-minute skim will do it.</p>
            )}
            <div className="cq-quizrow center">
              {!pass && <button className="cq-btn primary" onClick={() => startQuiz(day.d)}>Retry quiz</button>}
              {pass && view.stars < 3 && <button className="cq-btn" onClick={() => startQuiz(day.d)}>Retry for ★★★</button>}
              <button className={`cq-btn ${pass ? "primary" : ""}`} onClick={() => setView({ type: "map" })}>Back to map</button>
            </div>
          </section>
        );
      })()}

      <footer className="cq-foot">
        Progress saves automatically on this device · Consistency beats intensity.
        <br />
        {confirmReset ? (
          <span>
            Wipe all progress? <button className="cq-link danger" onClick={resetAll}>Yes, reset</button> · <button className="cq-link" onClick={() => setConfirmReset(false)}>Cancel</button>
          </span>
        ) : (
          <button className="cq-link" onClick={() => setConfirmReset(true)}>Reset progress</button>
        )}
      </footer>
    </div>
  );
}

/* ---------------------------- styles ---------------------------- */
const CSS = `
.cq-root{min-height:100vh;background:radial-gradient(1200px 600px at 70% -10%, #1D1440 0%, #0D0B1E 55%);color:#EDEBFF;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:860px;margin:0 auto;padding:28px 20px 60px}
.cq-header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:20px}
.cq-logo{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:26px;font-weight:800;letter-spacing:2px}
.cq-logo span{color:#FFB84D}
.cq-logo em{font-size:13px;font-style:normal;color:#8B87B3;letter-spacing:0;font-weight:500}
.cq-sub{color:#8B87B3;font-size:13px;margin-top:4px}
.cq-stats{display:flex;gap:10px}
.cq-stat{background:#17152E;border:1px solid #2A2750;border-radius:12px;padding:8px 14px;text-align:center;min-width:74px}
.cq-stat-num{font-family:ui-monospace,monospace;font-size:20px;font-weight:700;display:block}
.cq-stat-num.gold{color:#FFD25E}
.cq-stat-num small{font-size:11px;color:#8B87B3}
.cq-stat-lbl{font-size:11px;color:#8B87B3}
.cq-mission{background:#17152E;border:1px solid #FFB84D33;border-radius:16px;padding:18px 20px;margin-bottom:28px;box-shadow:0 8px 30px rgba(0,0,0,.35)}
.cq-mission-head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px}
.cq-mission h2{margin:0;font-size:18px}
.cq-chip{font-family:ui-monospace,monospace;font-size:12px;background:#221E45;border:1px solid #35306A;border-radius:999px;padding:4px 12px;color:#B9B4E8}
.cq-tasklist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.cq-tasklist li{display:flex;align-items:center;gap:10px;background:#1D1A38;border:1px solid #2A2750;border-radius:10px;padding:10px 12px;transition:opacity .2s}
.cq-tasklist li.done{opacity:.5}
.cq-tasklist li.done a{text-decoration:line-through}
.cq-check{width:24px;height:24px;flex:none;border-radius:7px;border:2px solid #4A4488;background:transparent;color:#55E0A0;font-weight:800;cursor:pointer;line-height:1}
.cq-tasklist li.done .cq-check{background:#1E3A2C;border-color:#55E0A0}
.cq-tag{font-family:ui-monospace,monospace;font-size:10px;font-weight:700;letter-spacing:1px;border-radius:5px;padding:3px 7px;flex:none}
.cq-tag.dsa{background:#3A2A10;color:#FFB84D}
.cq-tag.react{background:#0F2E38;color:#5AD7F5}
.cq-tasklist a{color:#EDEBFF;text-decoration:none;font-size:14px;flex:1;min-width:0}
.cq-tasklist a:hover{color:#FFD25E}
.cq-mins{font-family:ui-monospace,monospace;font-size:11px;color:#8B87B3;flex:none}
.cq-mission-quiz p{margin:0 0 10px;color:#B9B4E8}
.cq-chapter{font-family:ui-monospace,monospace;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:#8B87B3;border-bottom:1px dashed #35306A;padding-bottom:8px;margin:26px 0 14px}
.cq-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.cq-day{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;background:#17152E;border:2px solid #2A2750;border-radius:14px;padding:14px 10px 12px;cursor:pointer;color:#EDEBFF;text-align:center;transition:transform .15s,border-color .15s}
.cq-day:not(.locked):hover{transform:translateY(-3px);border-color:#4A4488}
.cq-day.locked{cursor:not-allowed;filter:grayscale(1);opacity:.5}
.cq-day.passed{border-color:#55E0A055}
.cq-day.current{border-color:#FFD25E;animation:cqpulse 1.8s ease-in-out infinite}
@keyframes cqpulse{0%,100%{box-shadow:0 0 8px rgba(255,210,94,.2)}50%{box-shadow:0 0 22px rgba(255,210,94,.5)}}
.cq-day-num{font-family:ui-monospace,monospace;font-size:10px;letter-spacing:1px;color:#8B87B3;text-transform:uppercase}
.cq-day-emoji{font-size:26px;line-height:1.2}
.cq-day-name{font-weight:700;font-size:13px}
.cq-day-topics{font-size:10.5px;color:#8B87B3;line-height:1.4}
.cq-day-topics.inline{font-size:12px;margin-top:2px}
.cq-stars i{color:#3A3760;font-style:normal;font-size:14px}
.cq-stars i.on{color:#FFD25E;text-shadow:0 0 8px rgba(255,210,94,.5)}
.cq-stars.big i{font-size:20px}
.cq-prog{position:absolute;top:8px;right:10px;font-family:ui-monospace,monospace;font-size:10px;color:#8B87B3}
.cq-finish{text-align:center;color:#B9B4E8;margin-top:24px;font-size:14px}
.cq-detail{background:#17152E;border:1px solid #2A2750;border-radius:16px;padding:22px}
.cq-back{background:none;border:none;color:#8B87B3;cursor:pointer;font-size:13px;padding:0;margin-bottom:14px}
.cq-back:hover{color:#EDEBFF}
.cq-detail-head{display:flex;gap:14px;align-items:flex-start;margin-bottom:6px}
.cq-detail-emoji{font-size:40px;line-height:1}
.cq-detail h2{margin:0 0 4px;font-size:20px}
.cq-bar{height:8px;background:#221E45;border-radius:999px;overflow:hidden;margin:14px 0}
.cq-bar div{height:100%;background:linear-gradient(90deg,#FFB84D,#FFD25E);border-radius:999px;transition:width .3s}
.cq-quizrow{margin-top:18px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.cq-quizrow.center{justify-content:center}
.cq-btn{background:#221E45;border:1px solid #35306A;color:#EDEBFF;border-radius:10px;padding:10px 18px;font-size:14px;font-weight:600;cursor:pointer}
.cq-btn.primary{background:linear-gradient(90deg,#FFB84D,#FFD25E);border:none;color:#241A05}
.cq-btn:disabled{opacity:.45;cursor:not-allowed}
.cq-muted{color:#8B87B3}
.cq-muted.small{font-size:12px}
.cq-quiz-head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.cq-quiz-head h2{margin:0;font-size:19px}
.cq-question{font-size:17px;font-weight:600;line-height:1.5;margin:18px 0}
.cq-opts{display:flex;flex-direction:column;gap:10px}
.cq-opt{text-align:left;background:#1D1A38;border:1px solid #35306A;color:#EDEBFF;border-radius:10px;padding:12px 14px;font-size:14px;cursor:pointer;transition:border-color .15s}
.cq-opt b{font-family:ui-monospace,monospace;color:#8B87B3;margin-right:8px}
.cq-opt:not(:disabled):hover{border-color:#FFD25E}
.cq-opt.correct{border-color:#55E0A0;background:#16301F}
.cq-opt.wrong{border-color:#FF7A7A;background:#341A1E}
.cq-detail.result{text-align:center}
.cq-result-stars{font-size:0;margin:8px 0 6px}
.cq-big-star{font-size:52px;color:#3A3760;display:inline-block;margin:0 4px}
.cq-big-star.on{color:#FFD25E;text-shadow:0 0 20px rgba(255,210,94,.6);animation:cqpop .5s cubic-bezier(.2,1.6,.4,1) both}
@keyframes cqpop{from{transform:scale(0) rotate(-30deg)}to{transform:scale(1) rotate(0)}}
.cq-foot{text-align:center;color:#5F5B8A;font-size:12px;margin-top:34px;line-height:2}
.cq-link{background:none;border:none;color:#5F5B8A;text-decoration:underline;cursor:pointer;font-size:12px;padding:0}
.cq-link:hover{color:#8B87B3}
.cq-link.danger{color:#FF7A7A}
@media (prefers-reduced-motion:reduce){.cq-day.current{animation:none}.cq-big-star.on{animation:none}}
`;
