---
id: react-performance-2026
title: React Performance in 2026
excerpt: Modern React is fast by default, but you still need to understand the rules.
slug: react-performance-2026
tags: React, Performance, Frontend
order: 3
---

## React Performance in 2026

The React team has done incredible work. Server Components, automatic batching, transitions - the framework is optimizing itself. But misunderstanding the mental model still causes problems.

### What You Need to Know

Re-renders are not the enemy.

React is designed to re-render. The cost of reconciliation is often less than the cost of premature optimization. Measure before you memo.

**useMemo vs useCallback**

- useMemo: Memoize the value (expensive calculation result)
- useCallback: Memoize the function (for stable props to child components)

90% of useMemo calls I see are unnecessary. Profile first.

**The Real Bottlenecks in 2024**

In modern apps, the slow parts are:
- Large bundle sizes (code splitting, lazy loading)
- Unoptimized images (use next/image or similar)
- Blocking network requests (use Suspense, streaming)
- Layout thrashing (CSS containment, proper sizing)

React rendering is rarely the issue.

### Quick Wins

Bad approach: recomputes on every render
const sorted = expensiveSort(data);

Good approach: only when data changes
const sorted = useMemo(() => expensiveSort(data), [data]);

Better approach: often not needed at all
const [sortConfig, setSortConfig] = useState(null);
const sorted = sortConfig ? [...data].sort(...) : data;

### Recommendation

Spend your optimization time on:
1. Bundle analysis (webpack-bundle-analyzer)
2. Image optimization
3. Data fetching patterns
4. CSS performance (avoid layout shifts)

Let React handle the re-renders.
