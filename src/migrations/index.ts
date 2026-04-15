import * as migration_20260408_145216_init from './20260408_145216_init';
import * as migration_20260409_130703_new_collections from './20260409_130703_new_collections';
import * as migration_20260413_031809_nested_doc from './20260413_031809_nested_doc';
import * as migration_20260415_085930_cleanup_site_settings from './20260415_085930_cleanup_site_settings';
import * as migration_20260415_152253_add_placeholder_fields_to_forms from './20260415_152253_add_placeholder_fields_to_forms';

export const migrations = [
  {
    up: migration_20260408_145216_init.up,
    down: migration_20260408_145216_init.down,
    name: '20260408_145216_init',
  },
  {
    up: migration_20260409_130703_new_collections.up,
    down: migration_20260409_130703_new_collections.down,
    name: '20260409_130703_new_collections',
  },
  {
    up: migration_20260413_031809_nested_doc.up,
    down: migration_20260413_031809_nested_doc.down,
    name: '20260413_031809_nested_doc',
  },
  {
    up: migration_20260415_085930_cleanup_site_settings.up,
    down: migration_20260415_085930_cleanup_site_settings.down,
    name: '20260415_085930_cleanup_site_settings',
  },
  {
    up: migration_20260415_152253_add_placeholder_fields_to_forms.up,
    down: migration_20260415_152253_add_placeholder_fields_to_forms.down,
    name: '20260415_152253_add_placeholder_fields_to_forms'
  },
];
