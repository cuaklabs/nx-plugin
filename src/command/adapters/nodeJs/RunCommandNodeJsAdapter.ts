import { ChildProcess, exec, ExecException } from 'node:child_process';
import { Readable, Writable } from 'node:stream';

import { RunCommandOptions } from '../../models/domain/RunCommandOptions';
import { RunCommandResult } from '../../models/domain/RunCommandResult';
import { RunCommandPort } from '../../ports/RunCommandPort';

const LARGE_BUFFER: number = 1024000000;

export class RunCommandNodeJsAdapter implements RunCommandPort {
  public async run(options: RunCommandOptions): Promise<RunCommandResult> {
    const stdout: string = await this.#promisifiedExec(
      options.command,
      options.cwd,
    );

    return {
      stdout,
    };
  }

  async #promisifiedExec(
    command: string,
    cwd: string | undefined,
  ): Promise<string> {
    return new Promise(
      (
        resolve: (value: string | PromiseLike<string>) => void,
        reject: (reason?: unknown) => void,
      ) => {
        const childProcess: ChildProcess = exec(
          command,
          { cwd, maxBuffer: LARGE_BUFFER },
          (error: ExecException | null, stdout: string) => {
            if (error === null) {
              resolve(stdout);
            } else {
              reject(error);
            }
          },
        );

        (childProcess.stdout as Readable).pipe(process.stdout);
        (childProcess.stderr as Readable).pipe(process.stderr);

        process.stdin.pipe(childProcess.stdin as Writable);
      },
    );
  }
}
