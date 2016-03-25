export const deepIncludes = parent => child => {
  if (child === undefined) {
    return true;
  }

  if ((typeof parent) !== (typeof child)) {
    return false;
  }

  if (!(parent instanceof Object) || !(child instanceof Object)) {
    return parent === child;
  }

  if (parent instanceof Array && parent.length !== child.length) {
    return false;
  }

  for (const key in child) {
    if (!(key in parent)) {
      return false;
    }

    if (!deepIncludes(parent[key])(child[key])) {
      return false;
    }
  }

  return true;
};

export const sequenceCommonFunctions = (first, then) => {
  const newThen = {};

  for (const k in then) {
    if (k in first) {
      newThen[k] = (...args) => {
        first[k](...args);
        return then[k](...args);
      };
    } else {
      newThen[k] = then[k];
    }
  }

  return Object.assign({}, first, newThen);
};

export const merge = (parent, child) => {
  if (parent instanceof Array && child instanceof Array) {
    return child;
  }

  if (parent instanceof Object && child instanceof Object) {
    return Object.assign({}, parent, child);
  }

  return child;
};
