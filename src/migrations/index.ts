import * as migration_20260408_145216_init from './20260408_145216_init';
import * as migration_20260409_130703_new_collections from './20260409_130703_new_collections';

export const migrations = [
  {
    up: migration_20260408_145216_init.up,
    down: migration_20260408_145216_init.down,
    name: '20260408_145216_init',
  },
  {
    up: migration_20260409_130703_new_collections.up,
    down: migration_20260409_130703_new_collections.down,
    name: '20260409_130703_new_collections'
  },
];
