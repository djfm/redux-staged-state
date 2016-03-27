import { compose as composeAccessors } from './accessors';
import { SET_TYPE, DELETE_TYPE } from './constants';
import { deepIncludes, sequenceCommonFunctions, merge } from './utils';


const ifUndefined = (candidate, replacement) => candidate === undefined ? replacement : candidate;

const makeGetter = (rootAccessor, state, config = {}) => (accessor, defaultValue) => {
  const accessorObj = composeAccessors(rootAccessor, accessor);
  const originalValue = ifUndefined(accessorObj.of(state).get(), defaultValue);
  const stagedValue = composeAccessors(config.stagedMountPoint, accessorObj).of(state).get();

  if (stagedValue === undefined) {
    return originalValue;
  }

  return merge(originalValue, stagedValue);
};

const makePristine = (rootAccessor, state, config = {}) => accessor => {
  const accessorObj = composeAccessors(rootAccessor, accessor);

  const originalValue = accessorObj.of(state).get();
  const stagedValue = composeAccessors(config.stagedMountPoint, accessorObj).of(state).get();

  return deepIncludes(originalValue)(stagedValue);
};

const makeSetter = (rootAccessor, dispatch) =>
  (accessor, value) => dispatch({
    type: SET_TYPE,
    accessor: composeAccessors(
        rootAccessor,
        accessor
      ).serialized,
    value,
  })
;

const makeResetter = (rootAccessor, dispatch) =>
  accessor => dispatch({
    type: DELETE_TYPE,
    accessor: composeAccessors(
        rootAccessor,
        accessor
      ).serialized,
  })
;

const makeBindings = (rootAccessor, dispatch, state, config = {}) =>
  (accessor, additionalHandlers = {}) => sequenceCommonFunctions(
    additionalHandlers,
    {
      onChange: event => makeSetter(rootAccessor, dispatch)(accessor, event.target.value),
      value: makeGetter(rootAccessor, state, config)(accessor),
    }
  )
;

export const stage = (rootAccessor, dispatch, config) => state => ({
  get: makeGetter(rootAccessor, state, config),
  pristine: makePristine(rootAccessor, state, config),
  set: dispatch ? makeSetter(rootAccessor, dispatch) : undefined,
  reset: dispatch ? makeResetter(rootAccessor, dispatch) : undefined,
  bindings: dispatch ? makeBindings(rootAccessor, dispatch, state, config) : undefined,
  rootAccessor,
  stage: accessor => stage(composeAccessors(rootAccessor, accessor), dispatch, config)(state),
});
