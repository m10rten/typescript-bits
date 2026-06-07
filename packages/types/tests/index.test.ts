// Type-level tests — these verify the types compile correctly.
// At runtime they're no-ops.

import type { Enumerate, Range } from "../src/index.js";
import type { Equal, Expect } from "./type-utils.js";

// Enumerate
type _enum0 = Expect<Equal<Enumerate<0>, never>>;
type _enum1 = Expect<Equal<Enumerate<1>, 0>>;
type _enum3 = Expect<Equal<Enumerate<3>, 0 | 1 | 2>>;

// Range
type _range1_4 = Expect<Equal<Range<1, 4>, 1 | 2 | 3>>;
type _range0_1 = Expect<Equal<Range<0, 1>, 0>>;
type _range2_2 = Expect<Equal<Range<2, 2>, never>>;

// Make sure variables exist so the imports are used at runtime
const _: unknown[] = [0 as Enumerate<1>, 1 as Range<1, 3>];
void _;
