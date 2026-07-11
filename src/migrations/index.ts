import * as migration_20260408_145216_init from './20260408_145216_init';
import * as migration_20260409_130703_new_collections from './20260409_130703_new_collections';
import * as migration_20260413_031809_nested_doc from './20260413_031809_nested_doc';
import * as migration_20260415_085930_cleanup_site_settings from './20260415_085930_cleanup_site_settings';
import * as migration_20260415_152253_add_placeholder_fields_to_forms from './20260415_152253_add_placeholder_fields_to_forms';
import * as migration_20260416_162815_package_fields_update from './20260416_162815_package_fields_update';
import * as migration_20260417_170145_changedTabsPackages from './20260417_170145_changedTabsPackages';
import * as migration_20260419_125017_changedMapEmbedding from './20260419_125017_changedMapEmbedding';
import * as migration_20260421_183034_addedNewBlocks from './20260421_183034_addedNewBlocks';
import * as migration_20260511_104807_packgCollChange from './20260511_104807_packgCollChange';
import * as migration_20260621_073000_repair_users_name from './20260621_073000_repair_users_name';
import * as migration_20260621_081500_repair_locked_document_relations from './20260621_081500_repair_locked_document_relations';
import * as migration_20260621_083000_reconcile_database_schema from './20260621_083000_reconcile_database_schema';
import * as migration_20260622_103515_add_date_field_to_forms from './20260622_103515_add_date_field_to_forms';
import * as migration_20260629_161323_add_activity_hero from './20260629_161323_add_activity_hero';
import * as migration_20260629_164516_add_all_year_round_best_season from './20260629_164516_add_all_year_round_best_season';
import * as migration_20260629_170149_add_contact_messaging_flags from './20260629_170149_add_contact_messaging_flags';
import * as migration_20260709_023343_add_package_to_form_submissions from './20260709_023343_add_package_to_form_submissions';
import * as migration_20260709_120000_add_form_submission_status from './20260709_120000_add_form_submission_status';
import * as migration_20260711_054759_add_high_impact_mobile_poster from './20260711_054759_add_high_impact_mobile_poster';
import * as migration_20260711_061050_add_tawk_chat_settings from './20260711_061050_add_tawk_chat_settings';

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
    name: '20260415_152253_add_placeholder_fields_to_forms',
  },
  {
    up: migration_20260416_162815_package_fields_update.up,
    down: migration_20260416_162815_package_fields_update.down,
    name: '20260416_162815_package_fields_update',
  },
  {
    up: migration_20260417_170145_changedTabsPackages.up,
    down: migration_20260417_170145_changedTabsPackages.down,
    name: '20260417_170145_changedTabsPackages',
  },
  {
    up: migration_20260419_125017_changedMapEmbedding.up,
    down: migration_20260419_125017_changedMapEmbedding.down,
    name: '20260419_125017_changedMapEmbedding',
  },
  {
    up: migration_20260421_183034_addedNewBlocks.up,
    down: migration_20260421_183034_addedNewBlocks.down,
    name: '20260421_183034_addedNewBlocks',
  },
  {
    up: migration_20260511_104807_packgCollChange.up,
    down: migration_20260511_104807_packgCollChange.down,
    name: '20260511_104807_packgCollChange',
  },
  {
    up: migration_20260621_073000_repair_users_name.up,
    down: migration_20260621_073000_repair_users_name.down,
    name: '20260621_073000_repair_users_name',
  },
  {
    up: migration_20260621_081500_repair_locked_document_relations.up,
    down: migration_20260621_081500_repair_locked_document_relations.down,
    name: '20260621_081500_repair_locked_document_relations',
  },
  {
    up: migration_20260621_083000_reconcile_database_schema.up,
    down: migration_20260621_083000_reconcile_database_schema.down,
    name: '20260621_083000_reconcile_database_schema',
  },
  {
    up: migration_20260622_103515_add_date_field_to_forms.up,
    down: migration_20260622_103515_add_date_field_to_forms.down,
    name: '20260622_103515_add_date_field_to_forms',
  },
  {
    up: migration_20260629_161323_add_activity_hero.up,
    down: migration_20260629_161323_add_activity_hero.down,
    name: '20260629_161323_add_activity_hero',
  },
  {
    up: migration_20260629_164516_add_all_year_round_best_season.up,
    down: migration_20260629_164516_add_all_year_round_best_season.down,
    name: '20260629_164516_add_all_year_round_best_season',
  },
  {
    up: migration_20260629_170149_add_contact_messaging_flags.up,
    down: migration_20260629_170149_add_contact_messaging_flags.down,
    name: '20260629_170149_add_contact_messaging_flags',
  },
  {
    up: migration_20260709_023343_add_package_to_form_submissions.up,
    down: migration_20260709_023343_add_package_to_form_submissions.down,
    name: '20260709_023343_add_package_to_form_submissions',
  },
  {
    up: migration_20260709_120000_add_form_submission_status.up,
    down: migration_20260709_120000_add_form_submission_status.down,
    name: '20260709_120000_add_form_submission_status',
  },
  {
    up: migration_20260711_054759_add_high_impact_mobile_poster.up,
    down: migration_20260711_054759_add_high_impact_mobile_poster.down,
    name: '20260711_054759_add_high_impact_mobile_poster',
  },
  {
    up: migration_20260711_061050_add_tawk_chat_settings.up,
    down: migration_20260711_061050_add_tawk_chat_settings.down,
    name: '20260711_061050_add_tawk_chat_settings',
  },
]
