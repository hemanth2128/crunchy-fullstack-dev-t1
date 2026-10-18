
# Task 1: ES6+ and the Mental Model

## 1. Overview

The purpose of this task was to review a JavaScript implementation, identify the original bug, modernise the code using ES6+ features, and verify the behaviour with automated tests.

The function `getEvenNumbers()` is intended to return all even numbers from the `numbers` array.

## 2. Original Bug: Off-by-One Error

The original implementation used a loop condition similar to:

```javascript
for (var i = 0; i <= numbers.length; i++) {
    // Process numbers[i]
}
```

The condition `i <= numbers.length` is incorrect because array indexes range from `0` to `numbers.length - 1`.

When `i` equals `numbers.length`, the code accesses an index outside the array.

For example, if the array is:

```javascript
var numbers = [1, 2, 3, 4, 5];
```

The valid indexes are `0`, `1`, `2`, `3`, and `4`. Accessing `numbers[5]` returns `undefined`.

In this particular example, checking whether `undefined` is even does not add an incorrect value to the result. However, the loop still performs an unnecessary iteration and uses an incorrect boundary condition.

### Fix

The correct loop condition is:

```javascript
i < numbers.length
```

This ensures that the loop only processes valid array indexes.

## 3. Modernised Implementation

The updated `script.js` is:

```javascript
const numbers = [1, 2, 3, 4, 5];

function getEvenNumbers() {
    return numbers.filter((n) => n % 2 === 0);
}

export { getEvenNumbers };
```

The implementation uses `filter()` to select even numbers without manually managing an array index or mutating a result array.

## 4. ES6+ Improvements

### 4.1 Replacing `var` with `const`

The array is declared using `const` instead of `var`.

This prevents reassignment of the `numbers` variable and makes the declaration's intent clearer. Note that `const` does not make the array contents immutable.

### 4.2 Using an Arrow Function

The callback `(n) => n % 2 === 0` is an arrow function.

It provides concise syntax for the condition used by `filter()`.

### 4.3 Using `filter()`

The `filter()` method creates a new array containing elements that satisfy the supplied condition.

The expression `n % 2 === 0` checks whether a number is divisible by two without a remainder.

For the input `[1, 2, 3, 4, 5]`, the result is:

```javascript
[2, 4]
```

### 4.4 Avoiding Manual Result-Array Mutation

The modern implementation does not need to create an empty result array and push matching values into it.

Instead, `filter()` returns a new array, making the function simpler and easier to read.

### 4.5 Using ES Modules

The function is exported using:

```javascript
export { getEvenNumbers };
```

The test file imports it using:

```javascript
import { getEvenNumbers } from './script.js';
```

This keeps the implementation separate from the test code.

## 5. Automated Tests

The Jest test suite checks two behaviours:

1. The function returns `[2, 4]` for the current `numbers` array.
2. Each function call returns a fresh array object with the same values.

The second test uses `toEqual()` to compare array contents and `not.toBe()` to verify that the arrays are different objects.

## 6. Test Execution

Run the following commands in the project directory:

```bash
npm install
npm test
```

Record the actual result after running the tests.

- If all tests pass, report that the tests passed.
- If any test fails, investigate the failure before submitting the task.

## 7. Summary

The code was modernised using `const`, an arrow function, `filter()`, and ES module syntax. Automated tests were included to verify the expected output and fresh-array behaviour.

The off-by-one error is documented as a defect in the original loop-based implementation. The updated implementation avoids that manual loop and uses `filter()` instead.
