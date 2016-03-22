export const prop = propertyName => ({
  serialized: [{ accessor: 'prop', args: [propertyName] }],
  of: object => ({
    get: () => object ? object[propertyName] : undefined,
    set: value => Object.assign({}, object, { [propertyName]: value }),
    delete: () => {
      const copy = Object.assign({}, object);
      delete copy[propertyName];
      return copy;
    },
  }),
});

export const nth = pos => ({
  serialized: [{ accessor: 'nth', args: [pos] }],
  of: array => ({
    get: () => array[pos],
    set: value => [].concat(array.slice(0, pos), value, array.slice(pos + 1)),
    delete: () => [].concat(array.slice(0, pos), array.slice(pos + 1)),
  }),
});

export const beforeFirst = () => ({
  serialized: [{ accessor: 'beforeFirst', args: [] }],
  of: array => ({
    get: () => undefined,
    set: value => [].concat(value, array),
    delete: () => array,
  }),
});

export const afterLast = () => ({
  serialized: [{ accessor: 'afterLast', args: [] }],
  of: array => ({
    get: () => undefined,
    set: value => [].concat(array, value),
    delete: () => array,
  }),
});

export const beforeNth = n => ({
  serialized: [{ accessor: 'beforeNth', args: [n] }],
  of: array => ({
    get: () => array[n - 1],
    set: value => [].concat(array.slice(0, n), value, array.slice(n)),
    delete: () => [].concat(array.slice(0, n - 1), array.slice(n)),
  }),
});

export const afterNth = n => ({
  serialized: [{ accessor: 'afterNth', args: [n] }],
  of: array => ({
    get: () => array[n + 1],
    set: value => [].concat(array.slice(0, n + 1), value, array.slice(n + 1)),
    delete: () => [].concat(array.slice(0, n + 1), array.slice(n + 2)),
  }),
});

export const first = () => Object.assign(
  {},
  nth(0),
  { serialized: [{ accessor: 'first', args: [] }] }
);

export const last = () => ({
  serialized: [{ accessor: 'last', args: [] }],
  of: array => nth(array.length - 1).of(array),
});

const compose2 = (a, b) => ({
  serialized: [].concat(a.serialized, b.serialized),
  of: object => ({
    get: b.of(a.of(object).get()).get,
    set: value => a.of(object).set(
      b.of(a.of(object).get()).set(value)
    ),
    delete: () => a.of(object).set(b.of(a.of(object).get()).delete()),
  }),
});

export const compose = (a, b, ...rest) => {
  if (rest.length === 0) {
    if (b) {
      return compose2(a, b);
    }
    return a;
  }
  return compose(compose2(a, b), ...rest);
};

export const deserialize = serializedAccessor =>
  compose(...serializedAccessor.map(
    ({ accessor, args }) => module.exports[accessor](...args)
  ))
;
