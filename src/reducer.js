import { SET_TYPE, DELETE_TYPE } from './constants';
import { deserialize as deserializeAccessor } from './accessors';

export const reducer = (state = {}, action) => {
  if (action.type === SET_TYPE) {
    return deserializeAccessor(action.accessor).of(state).set(action.value);
  }

  if (action.type === DELETE_TYPE) {
    return deserializeAccessor(action.accessor).of(state).delete();
  }

  return state;
};
