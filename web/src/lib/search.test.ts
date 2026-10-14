import { expect, it } from 'vitest';
import { searchKey } from './search';

it('normalizes punctuation and spacing in brand names', () => {
  expect(searchKey('Chick-fil-A')).toBe(searchKey('chickfila'));
  expect(searchKey("McDonald's")).toBe(searchKey('mcdonalds'));
});
