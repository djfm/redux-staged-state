import { compose as composeAccessors, deserialize as deserializeAccessor } from './accessors';
import { SET_TYPE, DELETE_TYPE } from './constants';

const makeGetter = (rootAccessor, state, config = {}) => accessor => {
  const accessorObj = composeAccessors(
   deserializeAccessor(rootAccessor),
   deserializeAccessor(accessor)
 );

  const originalValue = accessorObj.of(state).get();
  const stagedValue = (config.stagedMountPoint ? composeAccessors(
   deserializeAccessor(config.stagedMountPoint), accessorObj
  ) : accessorObj).of(state).get();

  if (stagedValue === undefined) {
    return originalValue;
  }

  return stagedValue;
};

const makeSetter = (rootAccessor, dispatch, config = {}) =>
  (accessor, value) => dispatch({
    type: SET_TYPE,
    accessor: composeAccessors(
        deserializeAccessor(config.stagedMountPoint),
        deserializeAccessor(rootAccessor),
        deserializeAccessor(accessor)
      ).serialized,
    value,
  })
;

const makeDeleter = (rootAccessor, dispatch) =>
  accessor => dispatch({
    type: DELETE_TYPE,
    accessor: composeAccessors(
        deserializeAccessor(rootAccessor),
        deserializeAccessor(accessor)
      ).serialized,
  })
;

const makeBindings = (rootAccessor, dispatch, state) =>
  accessor => ({
    onChange: event => makeSetter(rootAccessor, dispatch)(accessor, event.target.value),
    value: makeGetter(rootAccessor, state)(accessor),
  })
;

export const stage = (rootAccessor, dispatch, config) => state => ({
  get: makeGetter(rootAccessor, state, config),
  set: dispatch ? makeSetter(rootAccessor, dispatch, config) : undefined,
  delete: dispatch ? makeDeleter(rootAccessor, dispatch) : undefined,
  bindings: dispatch ? makeBindings(rootAccessor, dispatch, state) : undefined,
});
