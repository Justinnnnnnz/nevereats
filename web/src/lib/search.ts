/** Fold punctuation and spacing so brand searches work with or without typography. */
export function searchKey(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase('en').replace(/[^\p{L}\p{N}]/gu, '');
}
