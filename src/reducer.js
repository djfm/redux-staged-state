import { SET_TYPE } from './constants';
import { deserialize as deserializeAccessor } from './accessors';

export const reducer = (state = {}, action) => {
  if (action.type === SET_TYPE) {
    return deserializeAccessor(action.accessor).of(state).set(action.value);
  }

  return state;
};
