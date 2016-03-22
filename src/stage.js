import { compose as composeAccessors, deserialize as deserializeAccessor } from './accessors';

export const stage = rootAccessor => state => ({
  get: accessor => composeAccessors(
      deserializeAccessor(rootAccessor),
      deserializeAccessor(accessor)
    ).of(state).get(),
});
