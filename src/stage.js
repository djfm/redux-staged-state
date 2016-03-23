import { compose as composeAccessors, deserialize as deserializeAccessor } from './accessors';
import { SET_TYPE, DELETE_TYPE } from './constants';

const makeGetter = (rootAccessor, state) =>
  accessor => composeAccessors(
    deserializeAccessor(rootAccessor),
    deserializeAccessor(accessor)
  ).of(state).get()
;

const makeSetter = (rootAccessor, dispatch) =>
  (accessor, value) => dispatch({
    type: SET_TYPE,
    accessor: composeAccessors(
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

export const stage = (rootAccessor, dispatch) => state => ({
  get: makeGetter(rootAccessor, state),
  set: dispatch ? makeSetter(rootAccessor, dispatch) : undefined,
  delete: dispatch ? makeDeleter(rootAccessor, dispatch) : undefined,
  bindings: dispatch ? makeBindings(rootAccessor, dispatch, state) : undefined,
});
