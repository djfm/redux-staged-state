export const prop = propertyName => ({
  serialized: propertyName,
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
  serialized: `[${pos}]`,
  of: array => ({
    get: () => array[pos],
    set: value => [].concat(array.slice(0, pos), value, array.slice(pos + 1)),
    delete: () => [].concat(array.slice(0, pos), array.slice(pos + 1)),
  }),
});

export const beforeFirst = () => ({
  serialized: '[beforeFirst]',
  of: array => ({
    get: () => undefined,
    set: value => [].concat(value, array),
    delete: () => array,
  }),
});

export const afterLast = () => ({
  serialized: '[afterLast]',
  of: array => ({
    get: () => undefined,
    set: value => [].concat(array, value),
    delete: () => array,
  }),
});

export const beforeNth = n => ({
  serialized: `[beforeNth(${n})]`,
  of: array => ({
    get: () => array[n - 1],
    set: value => [].concat(array.slice(0, n), value, array.slice(n)),
    delete: () => [].concat(array.slice(0, n - 1), array.slice(n)),
  }),
});

export const afterNth = n => ({
  serialized: `[afterNth(${n})]`,
  of: array => ({
    get: () => array[n + 1],
    set: value => [].concat(array.slice(0, n + 1), value, array.slice(n + 1)),
    delete: () => [].concat(array.slice(0, n + 1), array.slice(n + 2)),
  }),
});

export const first = () => Object.assign(
  {},
  nth(0)
);

export const last = () => ({
  serialized: '[last]',
  of: array => nth(array.length - 1).of(array),
});

const composeSerializedAccessors = (a, b) => (b[0] === '[') ? (a + b) : `${a}.${b}`;

const compose2 = (a, b) => ({
  serialized: composeSerializedAccessors(a.serialized, b.serialized),
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

const deserializeAtomicAccessor = accessor => {
  if (accessor === '[last]') {
    return last();
  }

  if (accessor === '[beforeFirst]') {
    return beforeFirst();
  }

  if (accessor === '[afterLast]') {
    return afterLast();
  }

  const matchesNth = /^\[(\d+)\]$/.exec(accessor);
  if (matchesNth) {
    return nth(+matchesNth[1]);
  }

  const matchesFuncWithArgs = /^\[(\w+)\((.*?)\)\]$/.exec(accessor);
  if (matchesFuncWithArgs) {
    const func = matchesFuncWithArgs[1];
    const args = matchesFuncWithArgs[2].split(',').map(n => +n);
    const funcs = {
      beforeNth,
      afterNth,
    };
    if (!(func in funcs)) {
      throw new Error(`Unknown array accessor "${func}".`);
    }
    return funcs[func](...args);
  }

  if (accessor[0] !== '[') {
    return prop(accessor);
  }

  throw new Error(`Could not deserialize atomic accessor "${accessor}".`);
};

export const deserialize = serializedAccessor =>
  compose(...serializedAccessor.replace(/([^.])\[/g, '$1.[').split('.').map(
    part => deserializeAtomicAccessor(part)
  ))
;
