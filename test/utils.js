/* global describe, it */

import { deepIncludes } from '../src/utils';

describe('The deepIncludes util', () => {
  const examples = [
    [1, '1', false],
    [{ a: 1 }, { a: 1 }, true],
    [{ a: 1 }, { a: '1' }, false],
    [{ a: { b: 'b', c: 'c' } }, { a: { b: 'b' } }, true],
    [[1, 2], [1], false],
    [[1, 2], [1, 2], true],
  ];

  examples.forEach(([parent, child, expected]) =>
    it(`${JSON.stringify(parent)} includes ${JSON.stringify(child)} should be ${expected}`, () =>
      deepIncludes(parent)(child).should.equal(expected)
    )
  );
});
