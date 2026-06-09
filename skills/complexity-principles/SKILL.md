---
name: complexity-principles
description: Big O notation, asymptotic analysis, time and space complexity, and algorithmic efficiency principles for reasoning about performance at scale
---

# Complexity Principles

Mathematical framework for analyzing how time and memory usage scale with input size. Use these when choosing algorithms, reviewing performance, designing for scale, or debugging bottlenecks.

## Asymptotic Notation

| Notation  | Name        | Meaning                         | When to Use                                  |
| --------- | ----------- | ------------------------------- | -------------------------------------------- |
| **Big O** | Upper bound | `f(n) ≤ c·g(n)` for all large n | Default — what matters for production        |
| **Big Ω** | Lower bound | `f(n) ≥ c·g(n)` for all large n | Adversarial contexts (crypto, rate limiting) |
| **Big Θ** | Tight bound | `c₁·g(n) ≤ f(n) ≤ c₂·g(n)`      | Uniform input, worst=best case               |

Big O is the default. Ω and Θ are rarely needed in day-to-day engineering.

## Common Time Complexities

| Complexity | Name         | Feasible n             | Example                           |
| ---------- | ------------ | ---------------------- | --------------------------------- |
| O(1)       | Constant     | Any                    | Hash lookup, array index          |
| O(log n)   | Logarithmic  | Any (10⁹ is ~30 steps) | Binary search, balanced tree      |
| O(n)       | Linear       | ~10⁸                   | Single pass iteration             |
| O(n log n) | Linearithmic | ~10⁷                   | Merge sort, heap sort             |
| O(n²)      | Quadratic    | ~10⁴                   | Nested loops over same data       |
| O(n³)      | Cubic        | ~500                   | Naive matrix multiplication       |
| O(2ⁿ)      | Exponential  | ~20-30                 | Recursive Fibonacci, subsets      |
| O(n!)      | Factorial    | ~10-12                 | All permutations, TSP brute force |

### O(1) — Constant

Execution time does not depend on input size. Array index access, hash map lookup, arithmetic operations. The constant factor still matters — a 10ms O(1) operation is slow.

### O(log n) — Logarithmic

Time grows slowly. Doubling `n` adds one more step — `log₂(1,000)` ≈ 10, `log₂(1,000,000)` ≈ 20. Binary search, balanced tree ops, heap insert/extract.

### O(n) — Linear

Time grows proportionally to input.

```ts
function findMax(arr: number[]): number {
  let max = -Infinity;
  for (const val of arr) {
    if (val > max) max = val;
  }
  return max;
}
```

Single pass iteration, linear search. Cannot be improved without structural changes — you must see every element to find the max.

### O(n log n) — Linearithmic

Divide-and-conquer efficiency.

```ts
function mergeSort<T>(arr: T[]): T[] {
  if (arr.length <= 1) return arr;
  const mid = arr.length >>> 1;
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}
```

Merge sort, heap sort. Optimal comparison-based sorting cannot beat this bound.

### O(n²) — Quadratic

Double input, 4× time. Acceptable only for small inputs (n < 1000) or bounded n.

```ts
function bubbleSort(arr: number[]): number[] {
  const result = [...arr];
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result.length - i - 1; j++) {
      if (result[j]! > result[j + 1]!) {
        [result[j], result[j + 1]] = [result[j + 1]!, result[j]!];
      }
    }
  }
  return result;
}
```

Nested loops, naive sorting, all-pairs operations.

### O(2ⁿ) — Exponential

Time doubles with each added element. n=20 → ~1M ops, n=30 → ~1B, n=50 → infeasible.

```ts
function fib(n: number): number {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
```

Fix with memoization, dynamic programming, or branch-and-bound pruning.

### O(n!) — Factorial

Worst for practical algorithms. n=10 → 3.6M ops, n=15 → 1.3T, n=20 → 2.4×10¹⁸.

```ts
function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = permutations(arr.toSpliced(i, 1));
    for (const perm of rest) result.push([arr[i]!, ...perm]);
  }
  return result;
}
```

TSP brute force, all permutations. Always needs approximation or heuristics at any non-trivial n.

## Space Complexity

Memory measured the same way — as a function of input size.

### O(1) — In-Place

Constant extra memory regardless of input size.

```ts
function reverseInPlace<T>(arr: T[]): void {
  let i = 0;
  let j = arr.length - 1;
  while (i < j) {
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    i++;
    j--;
  }
}
```

### O(n) — Linear Space

Allocates proportional to input.

```ts
function clone<T>(arr: T[]): T[] {
  return [...arr]; // O(n) space
}
```

### Recursion Stack Space

Recursive calls consume call stack memory proportional to recursion depth.

```ts
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // O(n) stack — one call per level
}
```

Recursion depth determines space: O(n) for linear recursion (factorial), O(log n) for divide-and-conquer (binary search). Deep recursion risks stack overflow — convert to iteration or an explicit stack when depth is unbounded.

### Time-Space Trade-offs

| Strategy                       | Space | Time                     |
| ------------------------------ | ----- | ------------------------ |
| Hash map caching / memoization | O(n)  | O(1) per lookup          |
| Incremental recomputation      | O(1)  | O(n) redo work           |
| Database index                 | O(n)  | O(1) lookup vs O(n) scan |
| Lazy evaluation                | O(1)  | O(n) first access        |

Memory is cheap but latency is not — prefer trading space for time unless on constrained devices (mobile, embedded).

## Analyzing Algorithms

### Loop Patterns

```ts
// Single loop → O(n)
for (let i = 0; i < n; i++) { ... }

// Nested loops over same data → O(n²)
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) { ... }
}

// Nested independent loops → O(n·m)
for (let i = 0; i < n; i++) {
  for (let j = 0; j < m; j++) { ... }
}

// Loop halves each iteration → O(log n)
for (let i = n; i > 0; i = Math.floor(i / 2)) { ... }

// Multiple sequential loops → dominated by largest
for (let i = 0; i < n; i++) { ... }  // O(n)
for (let i = 0; i < n; i++) { ... }  // O(n) — total O(n), not O(2n)
```

### Recursion — Master Theorem

For recurrences `T(n) = a·T(n/b) + f(n)`:

| Condition                    | Complexity                       |
| ---------------------------- | -------------------------------- |
| `f(n) = O(n^(log_b(a) - ε))` | `T(n) = Θ(n^(log_b(a)))`         |
| `f(n) = Θ(n^(log_b(a)))`     | `T(n) = Θ(n^(log_b(a)) · log n)` |
| `f(n) = Ω(n^(log_b(a) + ε))` | `T(n) = Θ(f(n))`                 |

Common recurrences:

| Recurrence               | Algorithm        | Complexity |
| ------------------------ | ---------------- | ---------- |
| `T(n) = T(n/2) + O(1)`   | Binary search    | O(log n)   |
| `T(n) = 2·T(n/2) + O(n)` | Merge sort       | O(n log n) |
| `T(n) = 2·T(n-1) + O(1)` | Naive Fibonacci  | O(2ⁿ)      |
| `T(n) = T(n-1) + O(n)`   | Quick sort worst | O(n²)      |

### Drop Constants and Lower-Order Terms

Big O drops everything that doesn't dominate growth:

```
O(3n² + 5n + 10) → O(n²)
O(n + n²) → O(n²)
O(n/2) → O(n)
```

An O(n) algorithm with a 10ms constant beats O(n²) with a 1µs constant at scale — but loses at small n. Prefer simpler code with worse constants when input size is bounded and small.

### Best, Average, Worst

| Algorithm     | Best       | Average    | Worst |
| ------------- | ---------- | ---------- | ----- |
| Quick sort    | O(n log n) | O(n log n) | O(n²) |
| Hash map find | O(1)       | O(1)       | O(n)  |
| BST find      | O(1)       | O(log n)   | O(n)  |

Default to worst case when no qualifier is given. Amortized describes worst-case cost over a sequence — ArrayList push is O(1) amortized, O(n) on resize.

## Key Principles

### Dominant Term Wins — Optimize Hot Paths

Only the fastest-growing term matters. `O(n² + n)` is `O(n²)`. Optimizing an O(1) section that runs once improves nothing. Profile before optimizing — O(n²) inside a rare error path is fine; O(n) on every request is not.

### Amortized Analysis

Some ops are expensive individually but cheap on average. Dynamic array push: O(1) amortized (O(n) on resize). Hash map resize: O(n) once, then O(1) for many inserts. Don't reject a structure for its worst case if amortized behavior beats alternatives.

### I/O Dominates CPU

Database queries, network calls, and disk reads are orders of magnitude slower than in-memory ops. An in-memory O(n²) is often cheaper than a single network round trip.

```ts
// ❌ N+1 — O(n) database calls
for (const user of users) {
  const posts = await db.query("SELECT * FROM posts WHERE user_id = $1", [user.id]);
}

// ✅ Batch — O(1) calls
const posts = await db.query("SELECT * FROM posts WHERE user_id = ANY($1)", [userIds]);
```

Optimize I/O patterns before optimizing in-memory operations.

## Common Analysis Traps

### Trap: Assuming Built-ins Are O(1)

| Operation                 | Actual Cost      | Why                                               |
| ------------------------- | ---------------- | ------------------------------------------------- |
| `arr.shift()` / `unshift` | O(n)             | Re-indexes all elements                           |
| `arr.splice(0, 1)`        | O(n)             | Same as shift                                     |
| `str += char` (in loop)   | O(n²) cumulative | Strings immutable, each `+=` copies entire string |
| `[...arr]`                | O(n)             | Full copy                                         |
| `Object.keys(obj)`        | O(n)             | Enumerates all keys                               |

**Fix**: `push`/`pop` for stacks, build strings with array + `join("")`, use `ArrayBuffer` for large concatenations.

### Trap: Hidden Map/Set Iteration

Iterating a Map or Set is O(m) where m is internal capacity, not O(n) where n is entries. Maintain a secondary index if you need both direct lookup and predicate search.

### Trap: Early Return Hides Real Worst Case

```ts
// Best O(1), worst O(n²) — don't claim O(1)
function findFirstAndLast(arr: number[], t: number): [number, number] {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === t) {
      for (let j = arr.length - 1; j >= 0; j--) {
        if (arr[j] === t) return [i, j];
      }
    }
  }
  return [-1, -1];
}
```

Document worst case unless average case is proven and happy path dominates.

### Trap: Algorithmic vs Code Complexity

An asymptotically optimal algorithm can be so complex that constants or bugs negate the benefit.

```ts
// O(n log n) tree sort — but O(n²) bubble sort wins for n < 50
// Pick the simpler algorithm when n is bounded or small
```

Use asymptotic analysis when n is unbounded; use empirical profiling when n is bounded. For small or fixed-size inputs, code clarity and maintainability almost always matter more than asymptotic efficiency.

### Constant Factor Optimization

When the asymptotic complexity is already optimal, the next level is constant factors:

- **Reduce allocations**: reuse buffers, pool objects, avoid creating intermediate arrays
- **Minimize indirection**: prefer flat arrays over linked structures, avoid proxy layers
- **Use native methods**: `Array.prototype.sort` (V8 Timsort) is faster than a handwritten sort
- **Batch work**: fewer larger operations beat many tiny ones (I/O, DOM updates, SQL queries)

Profile first. A blind optimization often targets the wrong bottleneck.

Reach for `node --prof` + `clinic.js` (Node) or Chrome DevTools (browser). Focus on the p99 hot path — optimizing a cold path that runs once per request is noise. When a profiler trace shows 80% of time in a single function, you've found the real bottleneck regardless of Big O.

### Cache Locality

Memory access patterns often dominate more than Big O suggests. CPU cache hierarchy (approximate latencies):

| Level | Latency | Size     |
| ----- | ------- | -------- |
| L1    | ~0.5 ns | ~32 KB   |
| L2    | ~7 ns   | ~256 KB  |
| L3    | ~10 ns  | ~8-32 MB |
| RAM   | ~100 ns | Up to TB |
| Disk  | ~10⁷ ns | Up to PB |

Contiguous arrays iterate at RAM speed (~10 GB/s) because CPUs prefetch adjacent cache lines. Linked lists and hash maps with pointer-chasing stall on cache misses (~100 ns each). An O(n) sequential scan often outperforms an O(log n) tree traversal for cache-fitting data.

## Practical Decision Guide

### Choosing Data Structures

| Operation           | Array          | Linked List | Hash Map | Balanced BST | Heap       |
| ------------------- | -------------- | ----------- | -------- | ------------ | ---------- |
| Access by index     | O(1)           | O(n)        | —        | —            | —          |
| Search by value     | O(n)           | O(n)        | O(1) avg | O(log n)     | O(n)       |
| Insert at end       | O(1) amortized | O(1)        | O(1) avg | O(log n)     | O(log n)   |
| Insert at beginning | O(n)           | O(1)        | —        | —            | —          |
| Delete by value     | O(n)           | O(n)        | O(1) avg | O(log n)     | —          |
| Min/Max             | O(n)           | O(n)        | O(n)     | O(log n)     | O(1)       |
| Ordered iteration   | O(n) sorted    | O(n)        | —        | O(n)         | O(n log n) |

### When Complexity Matters

| Scenario                         | Why                                         |
| -------------------------------- | ------------------------------------------- |
| API handling user-per-row growth | O(n) per-user queries → O(n²) as users grow |
| Real-time rendering (60fps)      | Any op > 16ms causes dropped frames         |
| Mobile — limited memory          | O(n) space on large datasets may crash      |
| Batch processing (millions)      | O(n²) vs O(n log n) is hours vs minutes     |
| Database query patterns          | Each query is I/O — N+1 is catastrophic     |

### When Complexity Does Not Matter

| Scenario                           | Reach for                                 |
| ---------------------------------- | ----------------------------------------- |
| n < 100 and bounded                | Readability, maintainability              |
| Startup initialization             | Run once, O(n²) is fine                   |
| Cold path (error handling)         | Correctness over performance              |
| Script with short expected runtime | Developer time > CPU time                 |
| External API is bottleneck         | Optimize the call, not the in-memory work |

## Complexity Cheat Sheet

### Array

| Method                      | Complexity     | Notes                   |
| --------------------------- | -------------- | ----------------------- |
| `push` / `pop`              | O(1) amortized |                         |
| `shift` / `unshift`         | O(n)           | Re-indexes all elements |
| `splice`                    | O(n)           | Worst case shifts half  |
| `slice`                     | O(n)           | Copy                    |
| `concat`                    | O(n+m)         |                         |
| `indexOf` / `includes`      | O(n)           | Linear search           |
| `sort`                      | O(n log n)     | Timsort (V8), stable    |
| `filter` / `map` / `reduce` | O(n)           | Creates new array       |
| `flat`                      | O(n)           |                         |

### Set / Map

| Operation                                | Complexity                         |
| ---------------------------------------- | ---------------------------------- |
| `has` / `get` / `set` / `add` / `delete` | O(1) avg (O(n) worst on collision) |
| Iteration                                | O(n)                               |
| `size`                                   | O(1)                               |

### String

| Operation                         | Complexity    | Notes                                                                                                    |
| --------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------- |
| Access by index                   | O(1)          |                                                                                                          |
| Concatenation `+` / `+=`          | O(n+m) per op | Cumulative O(n²) in loops                                                                                |
| `slice` / `substring`             | O(1)          | Copy on write — retains parent buffer in V8; use spread or `Buffer.from` to sever if memory is a concern |
| `split`                           | O(n)          |                                                                                                          |
| `replace` (single) / `replaceAll` | O(n)          | Regex may be slower                                                                                      |
| `indexOf` / `includes`            | O(n)          |                                                                                                          |
| `localeCompare` / `toLowerCase`   | O(n)          | Unicode normalization adds cost                                                                          |

### Graph

| Algorithm                  | Time             | Space |
| -------------------------- | ---------------- | ----- |
| DFS / BFS (adjacency list) | O(V + E)         | O(V)  |
| Dijkstra (binary heap)     | O((V + E) log V) | O(V)  |
| A\*                        | O(E) typically   | O(V)  |
| Floyd-Warshall             | O(V³)            | O(V²) |
| Topological sort (Kahn's)  | O(V + E)         | O(V)  |

---

Use this skill when designing algorithms, reviewing pull requests for performance, choosing data structures, or debugging production bottlenecks. Asymptotic analysis guides direction; empirical profiling confirms reality.
