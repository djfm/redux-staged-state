import { compose as composeAccessors, deserialize as deserializeAccessor } from './accessors';
import { SET_TYPE } from './constants';

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

export const stage = (rootAccessor, dispatch) => state => ({
  get: accessor => composeAccessors(
      deserializeAccessor(rootAccessor),
      deserializeAccessor(accessor)
    ).of(state).get(),
  set: dispatch ? makeSetter(rootAccessor, dispatch) : undefined,
});
