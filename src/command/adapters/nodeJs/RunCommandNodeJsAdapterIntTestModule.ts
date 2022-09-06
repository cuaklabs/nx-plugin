#!/usr/bin/env node

import { argv } from 'node:process';

import { RunCommandOptions } from '../../models/domain/RunCommandOptions';
import { RunCommandNodeJsAdapter } from './RunCommandNodeJsAdapter';

void (async () => {
  const command: string | undefined = argv[2];

  if (command === undefined) {
    throw new Error('Command expected!');
  }

  const runCommandNodeJsAdapter: RunCommandNodeJsAdapter =
    new RunCommandNodeJsAdapter();

  const runCommandOptions: RunCommandOptions = {
    command,
  };

  await runCommandNodeJsAdapter.run(runCommandOptions);
})();
