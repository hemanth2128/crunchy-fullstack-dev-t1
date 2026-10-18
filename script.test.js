
import { getEvenNumbers } from './script.js';

describe('getEvenNumbers', () => {
    test('returns the even numbers from the numbers array', () => {
        expect(getEvenNumbers()).toEqual([2, 4]);
    });

    test('returns a fresh array on each call (no shared mutable state)', () => {
        const first = getEvenNumbers();
        const second = getEvenNumbers();

        expect(first).toEqual(second);
        expect(first).not.toBe(second);
    });
});
