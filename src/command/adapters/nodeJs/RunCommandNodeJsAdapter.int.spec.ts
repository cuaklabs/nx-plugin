import { ChildProcess, exec, ExecException } from 'node:child_process';
import { Readable, Stream, Writable } from 'node:stream';

import { beforeAll, describe, expect, it } from '@jest/globals';

import { RunCommandOptions } from '../../models/domain/RunCommandOptions';
import { RunCommandResult } from '../../models/domain/RunCommandResult';
import { RunCommandNodeJsAdapter } from './RunCommandNodeJsAdapter';

interface RunCommandInChildProcessResult {
  childProcess: ChildProcess;
  execPromise: Promise<string>;
}

function runCommandInChildProcess(
  command: string,
  cwd?: string,
): RunCommandInChildProcessResult {
  const LARGE_BUFFER: number = 1024000000;

  let childProcess: ChildProcess | undefined = undefined;

  const execPromise: Promise<string> = new Promise(
    (
      resolve: (value: string | PromiseLike<string>) => void,
      reject: (reason?: unknown) => void,
    ): void => {
      childProcess = exec(
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
    },
  );

  return {
    childProcess: childProcess as unknown as ChildProcess,
    execPromise,
  };
}

describe(RunCommandNodeJsAdapter.name, () => {
  let runCommandNodeJsAdapter: RunCommandNodeJsAdapter;

  beforeAll(() => {
    runCommandNodeJsAdapter = new RunCommandNodeJsAdapter();
  });

  describe('.run', () => {
    describe('having RunCommandOptions with commands that writes stdout', () => {
      let expectedStdoutContent: string;
      let runCommandOptionsFixture: RunCommandOptions;

      beforeAll(() => {
        expectedStdoutContent = 'hello world\n';
        runCommandOptionsFixture = {
          command: `echo "${expectedStdoutContent}"`,
        };
      });

      describe('when called', () => {
        let result: RunCommandResult;

        beforeAll(async () => {
          result = await runCommandNodeJsAdapter.run(runCommandOptionsFixture);
        });

        it('should output expected content', () => {
          expect(result).toStrictEqual({
            stdout: expect.stringContaining(expectedStdoutContent),
          });
        });
      });
    });

    describe('having RunCommandOptions with commands that writes stderr', () => {
      let expectedStdoutContent: string;
      let command: string;

      beforeAll(() => {
        expectedStdoutContent = 'Hello world!';

        command = `printf '%s\n' \\"${expectedStdoutContent}\\" >&2
exit 1\n`;
      });

      describe('when called', () => {
        let stderrContent: string;
        let result: unknown;

        beforeAll(async () => {
          async function streamToString(stream: Readable): Promise<string> {
            const chunks: Buffer[] = [];
            return new Promise(
              (
                resolve: (value: string) => void,
                reject: (cause: unknown) => void,
              ) => {
                stream.on('data', (chunk: string | Buffer) =>
                  chunks.push(Buffer.from(chunk)),
                );
                stream.on('error', (err: Error) => reject(err));
                stream.on('end', () =>
                  resolve(Buffer.concat(chunks).toString('utf8')),
                );
              },
            );
          }

          const runCommandNodeJsAdapterIntTestModulePath: string =
            require.resolve('./RunCommandNodeJsAdapterIntTestModule');

          const runCommandResult: RunCommandInChildProcessResult =
            runCommandInChildProcess(
              `node -r ts-node/register ${runCommandNodeJsAdapterIntTestModulePath} "${command}"`,
            );

          const stderrOutputPromise: Promise<string> = streamToString(
            runCommandResult.childProcess.stderr as Readable,
          );

          try {
            await runCommandResult.execPromise;
          } catch (error: unknown) {
            result = error;
          }

          stderrContent = await stderrOutputPromise;
        });

        it('should return an error', () => {
          expect(result).toStrictEqual(
            expect.objectContaining({
              message: expect.stringContaining('Command failed'),
            }),
          );
        });

        it('should output expected content to stderr', () => {
          expect(stderrContent).toStrictEqual(
            expect.stringContaining(expectedStdoutContent),
          );
        });
      });
    });

    describe('having RunCommandOptions with commands that reads stdin and writes stdout based on stdin', () => {
      let expectedStdoutContent: string;
      let command: string;

      beforeAll(() => {
        expectedStdoutContent = 'hello world\n';
        command = `read line
echo readed \\$line`;
      });

      describe('when called', () => {
        let result: string;

        beforeAll(async () => {
          const runCommandNodeJsAdapterIntTestModulePath: string =
            require.resolve('./RunCommandNodeJsAdapterIntTestModule');

          const runCommandResult: RunCommandInChildProcessResult =
            runCommandInChildProcess(
              `node -r ts-node/register ${runCommandNodeJsAdapterIntTestModulePath} "${command}"`,
            );

          (runCommandResult.childProcess.stdin as Writable).write(
            expectedStdoutContent,
          );

          result = await runCommandResult.execPromise;
        });

        it('should output expected content', () => {
          expect(result).toStrictEqual(
            expect.stringContaining(expectedStdoutContent),
          );
        });
      });
    });
  });
});
