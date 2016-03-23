import { compose as composeAccessors, deserialize as deserializeAccessor } from './accessors';
import { SET_TYPE, DELETE_TYPE } from './constants';

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

const makeBindings = (rootAccessor, dispatch) =>
  accessor => ({
    onChange: event => makeSetter(rootAccessor, dispatch)(accessor, event.target.value),
  })
;

export const stage = (rootAccessor, dispatch) => state => ({
  get: accessor => composeAccessors(
      deserializeAccessor(rootAccessor),
      deserializeAccessor(accessor)
    ).of(state).get(),
  set: dispatch ? makeSetter(rootAccessor, dispatch) : undefined,
  delete: dispatch ? makeDeleter(rootAccessor, dispatch) : undefined,
  bindings: dispatch ? makeBindings(rootAccessor, dispatch) : undefined,
});
