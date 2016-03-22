export const deepIncludes = parent => child => {
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
