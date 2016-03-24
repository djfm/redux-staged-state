/* global describe, it */

import deepFreeze from 'deep-freeze';
import chai from 'chai';

import {
  compose,
  deserialize,
  prop,
  nth,
  first,
  last,
  beforeFirst,
  afterLast,
  beforeNth,
  afterNth,
} from '../src/accessors';

describe('Object property accessors', () => {
  it('should retrieve the value of a property', () =>
    prop('hello').of({ hello: 'world' }).get().should.deep.equal('world')
  );

  it('should change the value of a property without affecting the object', () =>
    prop('hello').of(deepFreeze({ hello: 'world' })).set('WORLD').should.deep.equal(
      { hello: 'WORLD' }
    )
  );

  it('should remove a key without affecting the object', () =>
    prop('hello').of(deepFreeze({ hello: 'world' })).delete().should.deep.equal({})
  );

  it('should be serialized', () =>
    prop('hello').serialized.should.equal('hello')
  );

  it('should returned undefined when called on undefined', () =>
    chai.expect(prop('hello').of(undefined).get()).to.be.undefined
  );
});

describe('Array accessors', () => {
  describe('nth', () => {
    it('should retrieve the 0-th value of an array', () =>
      nth(0).of([5, 4, 3, 2, 1]).get().should.equal(5)
    );

    it('should set the 0-th value of an array', () =>
      nth(0).of(deepFreeze([5, 4, 3, 2, 1])).set('hey').should.deep.equal(['hey', 4, 3, 2, 1])
    );

    it('should delete 0-th value of an array', () =>
      nth(0).of(deepFreeze([5, 4, 3, 2, 1])).delete().should.deep.equal([4, 3, 2, 1])
    );

    it('should retrieve the 1-th value of an array', () =>
      nth(1).of([5, 4, 3, 2, 1]).get().should.equal(4)
    );

    it('should set the 1-th value of an array', () =>
      nth(1).of(deepFreeze([5, 4, 3, 2, 1])).set('hey').should.deep.equal([5, 'hey', 3, 2, 1])
    );

    it('should delete 1-th value of an array', () =>
      nth(1).of(deepFreeze([5, 4, 3, 2, 1])).delete().should.deep.equal([5, 3, 2, 1])
    );

    it('should retrieve the 5-th (which happens to be the last) value of an array', () =>
      nth(4).of([5, 4, 3, 2, 1]).get().should.equal(1)
    );

    it('should set the 5-th (which happens to be the last) value of an array', () =>
      nth(4).of(deepFreeze([5, 4, 3, 2, 1])).set('hey').should.deep.equal([5, 4, 3, 2, 'hey'])
    );

    it('should delete 5-th value of an array', () =>
      nth(4).of(deepFreeze([5, 4, 3, 2, 1])).delete().should.deep.equal([5, 4, 3, 2])
    );

    it('should be serialized', () =>
      nth(4).serialized.should.equal('[4]')
    );
  });

  describe('first', () => {
    it('should retrieve the first value of an array', () =>
      first().of([5, 4, 3, 2, 1]).get().should.equal(5)
    );

    it('should be serialized', () =>
      first().serialized.should.equal('[0]')
    );
  });

  describe('last', () => {
    it('should retrieve the last value of an array', () =>
      last().of([5, 4, 3, 2, 1]).get().should.equal(1)
    );

    it('should be serialized', () =>
      last().serialized.should.equal('[last]')
    );
  });

  describe('beforeFirst', () => {
    it('should return undefined on get', () =>
      chai.expect(beforeFirst().of([5, 4, 3, 2, 1]).get()).to.be.undefined
    );

    it('should prepend to the array on set', () =>
      beforeFirst().of(deepFreeze([5, 4, 3, 2, 1])).set(6).should.deep.equal([6, 5, 4, 3, 2, 1])
    );

    it('should do nothing to the array on delete', () =>
      beforeFirst().of(deepFreeze([5, 4, 3, 2, 1])).delete().should.deep.equal([5, 4, 3, 2, 1])
    );

    it('should be serialized', () =>
      beforeFirst().serialized.should.equal('[beforeFirst]')
    );
  });

  describe('afterLast', () => {
    it('should return undefined on get', () =>
      chai.expect(afterLast().of([5, 4, 3, 2, 1]).get()).to.be.undefined
    );

    it('should append to the array on set', () =>
      afterLast().of(deepFreeze([5, 4, 3, 2, 1])).set(0).should.deep.equal([5, 4, 3, 2, 1, 0])
    );

    it('should do nothing to the array on delete', () =>
      afterLast().of(deepFreeze([5, 4, 3, 2, 1])).delete().should.deep.equal([5, 4, 3, 2, 1])
    );

    it('should be serialized', () =>
      afterLast().serialized.should.equal('[afterLast]')
    );
  });

  describe('beforeNth', () => {
    it('should get the value before the specified index on get', () =>
      beforeNth(1).of([5, 4, 3, 2, 1]).get().should.equal(5)
    );

    it('should insert the value before the specified index on set', () =>
      beforeNth(1).of(deepFreeze([5, 4, 3, 2, 1]))
        .set('yo')
        .should.deep.equal([5, 'yo', 4, 3, 2, 1])
    );

    it('should delete the value before the specified index on delete', () =>
      beforeNth(1).of(deepFreeze([5, 4, 3, 2, 1]))
        .delete()
        .should.deep.equal([4, 3, 2, 1])
    );

    it('should be serialized', () =>
      beforeNth(1).serialized.should.equal('[beforeNth(1)]')
    );
  });

  describe('afterNth', () => {
    it('should get the value after the specified index on get', () =>
      afterNth(1).of([5, 4, 3, 2, 1]).get().should.equal(3)
    );

    it('should insert the value after the specified index on set', () =>
      afterNth(1).of(deepFreeze([5, 4, 3, 2, 1])).set('yo').should.deep.equal([5, 4, 'yo', 3, 2, 1])
    );

    it('should delete the value after the specified index on delete', () =>
      afterNth(1).of(deepFreeze([5, 4, 3, 2, 1])).delete().should.deep.equal([5, 4, 2, 1])
    );

    it('should be serialized', () =>
      afterNth(1).serialized.should.equal('[afterNth(1)]')
    );
  });
});

describe('Accessors can be composed', () => {
  it('composing an accessor with nothing should not be an error', () =>
    compose(prop('hello'))
  );

  it('composing an accessor with falsey things should not be an error', () =>
    compose(prop('hello'), false, prop('world')).serialized.should.equal('hello.world')
  );

  it('two property getters composed should fetch a deep property', () =>
    compose(prop('hello'), prop('world')).of({
      hello: {
        world: 'is mine',
      },
    }).get().should.deep.equal('is mine')
  );

  it('two property setters composed should set a deep property', () =>
    compose(prop('hello'), prop('world')).of(deepFreeze({
      hello: {
        world: 'is mine',
      },
    })).set('IS MINE').should.deep.equal({
      hello: {
        world: 'IS MINE',
      },
    })
  );

  it('two property setters composed should delete a deep property', () =>
    compose(prop('hello'), prop('world')).of(deepFreeze({
      hello: {
        world: 'is mine',
      },
    })).delete().should.deep.equal({
      hello: {},
    })
  );

  it('accessor composition should work with strings to', () =>
    compose(prop('hello'), 'world').serialized.should.equal('hello.world')
  );

  it('two property setters composed should be serialized', () =>
    compose(prop('hello'), prop('world')).serialized.should.equal('hello.world')
  );

  it('three property setters composed should set a deep property', () =>
    compose(prop('a'), prop('b'), prop('c')).of(deepFreeze({
      a: {
        b: {
          c: 'deep',
        },
      },
    })).set('DEEP').should.deep.equal({
      a: {
        b: {
          c: 'DEEP',
        },
      },
    })
  );

  it('three property setters composed should delete a deep property', () =>
    compose(prop('a'), prop('b'), prop('c')).of(deepFreeze({
      a: {
        b: {
          c: 'deep',
        },
      },
    })).delete().should.deep.equal({
      a: {
        b: {},
      },
    })
  );

  describe('a prop composed with an nth', () => {
    const obj = deepFreeze({
      a: ['a', 'b', 'c'],
    });
    const accessor = compose(prop('a'), nth(1));

    it('should fetch a value inside an array', () =>
      accessor.of(obj).get().should.equal('b')
    );

    it('should set a value inside an array', () =>
      accessor.of(obj).set('B').should.deep.equal({
        a: ['a', 'B', 'c'],
      })
    );

    it('should be serialized', () =>
      accessor.serialized.should.deep.equal('a[1]')
    );
  });

  describe('Accessor deserialization', () => {
    const serializedAccessors = [
      ['a', { a: 1 }, 1],
      ['a.b', { a: { b: 1 } }, 1],
      ['[1]', [0, 1], 1],
      ['a[1]', { a: [0, 1] }, 1],
      ['[last]', [0, 1, 2], 2],
      ['[beforeFirst]', [0, 1, 2], undefined],
      ['[afterLast]', [0, 1, 2], undefined],
      ['[beforeNth(1)]', [0, 1, 2], 0],
      ['[afterNth(1)]', [0, 1, 2], 2],
      ['a[afterNth(1)].b.c', { a: [0, 1, { b: { c: 2 } }] }, 2],
    ];

    serializedAccessors.forEach(([serializedAccessor, tree, expectedValue]) =>
      it(
          `should deserialize '${serializedAccessor}'` +
          ` and get '${JSON.stringify(expectedValue)}'` +
          ` from '${JSON.stringify(tree)}'`,
          () => {
            const accessor = deserialize(serializedAccessor);
            accessor.serialized.should.equal(serializedAccessor);
            chai.expect(accessor.of(tree).get()).to.deep.equal(expectedValue);
          }
      )
    );
  });
});
