import * as migration_20260408_145216_init from './20260408_145216_init';

export const migrations = [
  {
    up: migration_20260408_145216_init.up,
    down: migration_20260408_145216_init.down,
    name: '20260408_145216_init'
  },
];
