#! /usr/bin/env node

import { program, Option } from 'commander';
import Upload from './commands/upload';
import ServerInfo from './commands/server-info';
import LoginKey from './commands/login/key';
import Logout from './commands/logout';

program.name('immich').description('Immich command line interface');

program
  .command('upload')
  .description('Upload assets')
  .usage('[options] [paths...]')
  .addOption(new Option('-r, --recursive', 'Recursive').env('IMMICH_RECURSIVE').default(false))
  .addOption(new Option('-i, --ignore [paths...]', 'Paths to ignore').env('IMMICH_IGNORE_PATHS'))
  .addOption(new Option('-h, --skip-hash', "Don't hash files before upload").env('IMMICH_SKIP_HASH').default(false))
  .addOption(
    new Option('-n, --dry-run', "Don't perform any actions, just show what will be done")
      .env('IMMICH_DRY_RUN')
      .default(false),
  )
  .addOption(new Option('--delete', 'Delete local assets after upload').env('IMMICH_DELETE_ASSETS'))
  .argument('[paths...]', 'One or more paths to assets to be uploaded')
  .action(async (paths, options) => {
    options.excludePatterns = options.ignore;
    await new Upload().run(paths, options);
  });

program
  .command('server-info')
  .description('Display server information')

  .action(async () => {
    await new ServerInfo().run();
  });

program
  .command('login-key')
  .description('Login using an API key')
  .argument('[instanceUrl]')
  .argument('[apiKey]')
  .action(async (paths, options) => {
    await new LoginKey().run(paths, options);
  });

program
  .command('logout')
  .description('Remove stored credentials')
  .action(async (paths, options) => {
    await new Logout().run();
  });

program.parse(process.argv);
