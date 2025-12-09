# Assignment 01: Deep Clone

## Difficulty: Medium

## Learning Objectives

- Understand the difference between shallow and deep copying
- Handle different JavaScript data types during cloning
- Work with recursion for nested structures
- Handle edge cases like circular references

## The Problem

JavaScript's spread operator (`...`) and `Object.assign()` only create shallow copies. When you have nested objects or arrays, the inner references are shared, not copied.

```javascript
const original = { a: 1, nested: { b: 2 } };
const shallow = { ...original };
shallow.nested.b = 999;
console.log(original.nested.b); // 999 - Original was modified!
```

Your task is to implement a `deepClone` function that creates a completely independent copy of any value.

## Requirements

Implement the `deepClone(value)` function that:

1. **Primitives**: Return primitives as-is (string, number, boolean, null, undefined, symbol, bigint)
2. **Arrays**: Create a new array with all elements deep cloned
3. **Objects**: Create a new object with all properties deep cloned
4. **Dates**: Create a new Date object with the same time value
5. **RegExp**: Create a new RegExp with the same pattern and flags
6. **Maps**: Create a new Map with deep cloned keys and values
7. **Sets**: Create a new Set with deep cloned values
8. **Circular References** (Bonus): Handle objects that reference themselves

## Examples

```javascript
// Basic object
const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj);
cloned.b.c = 999;
console.log(obj.b.c); // 2 - Original unchanged

// Array with nested objects
const arr = [1, { x: 2 }, [3, 4]];
const clonedArr = deepClone(arr);

// Date
const date = new Date("2024-01-01");
const clonedDate = deepClone(date);
clonedDate.setFullYear(2000);
console.log(date.getFullYear()); // 2024

// Circular reference (bonus)
const circular = { name: "circular" };
circular.self = circular;
const clonedCircular = deepClone(circular);
console.log(clonedCircular.self === clonedCircular); // true
```

## Hints

1. Use `typeof` and `instanceof` to check value types
2. Use `Array.isArray()` to distinguish arrays from objects
3. For circular references, use a `WeakMap` to track visited objects
4. Recursion is your friend for nested structures

## Resources

- [MDN: Structured Clone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN: WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
