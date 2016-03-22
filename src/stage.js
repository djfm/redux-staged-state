import { compose as composeAccessors } from './accessors';

export const stage = config => state => ({
  get: accessor => composeAccessors(config.accessor, accessor).of(state).get(),
});
