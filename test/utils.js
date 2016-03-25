/* global describe, it */
import chai from 'chai';
import { deepIncludes, sequenceCommonFunctions } from '../src/utils';

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

describe('The sequenceCommonFunctions util', () => {
  it('should sequence functions that are present in both objects, ' +
      'making a new function that calls the original versions and returns ' +
      'the value of the last function in the list', () => {
    const first = { a: chai.spy(() => 1) };
    const then = { a: chai.spy(() => 2) };

    const result = sequenceCommonFunctions(first, then).a();

    result.should.equal(2);
    first.a.should.have.been.called();
    then.a.should.have.been.called();
  });

  it('should keep unique functions unchanged', () => {
    const first = { a: chai.spy(() => 1) };
    const then = { b: chai.spy(() => 2) };

    const sequenced = sequenceCommonFunctions(first, then);

    sequenced.a().should.equal(1);
    sequenced.b().should.equal(2);

    first.a.should.have.been.called();
    then.b.should.have.been.called();
  });
});
