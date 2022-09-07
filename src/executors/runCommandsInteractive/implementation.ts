import { isAbsolute, join } from 'node:path';

import { ExecutorContext, Executor } from '@nrwl/devkit';

import { RunCommandNodeJsAdapter } from '../../command/adapters/nodeJs/RunCommandNodeJsAdapter';
import { RunCommandResult } from '../../command/models/domain/RunCommandResult';
import { RunCommandPort } from '../../command/ports/RunCommandPort';

export interface RunCommandsInteractiveOptions {
  commands?: string[];
  cwd?: string;
  parallel?: boolean;
}

function calculateCwd(
  cwd: string | undefined,
  context: ExecutorContext,
): string {
  let result: string;

  if (cwd === undefined) {
    result = context.root;
  } else {
    if (isAbsolute(cwd)) {
      result = cwd;
    } else {
      result = join(context.root, cwd);
    }
  }

  return result;
}

const runCommandsInteractiveExecutor: Executor<
  RunCommandsInteractiveOptions
> = async (
  options: RunCommandsInteractiveOptions,
  context: ExecutorContext,
): Promise<{ success: boolean }> => {
  const runCommandPort: RunCommandPort = new RunCommandNodeJsAdapter();
  const commands: string[] = options.commands ?? [];
  const cwd: string = calculateCwd(options.cwd, context);

  if (options.parallel === true) {
    const executions: Promise<RunCommandResult>[] = [];

    for (const command of commands) {
      executions.push(runCommandPort.run({ command, cwd }));
    }

    await Promise.all(executions);
  } else {
    for (const command of commands) {
      await runCommandPort.run({ command, cwd });
    }
  }

  return { success: true };
};

export default runCommandsInteractiveExecutor;
