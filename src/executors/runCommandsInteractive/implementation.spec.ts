import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('../../command/adapters/nodeJs/RunCommandNodeJsAdapter');

import { ExecutorContext } from '@nrwl/devkit';

import { RunCommandNodeJsAdapter } from '../../command/adapters/nodeJs/RunCommandNodeJsAdapter';
import { RunCommandOptions } from '../../command/models/domain/RunCommandOptions';
import { RunCommandResult } from '../../command/models/domain/RunCommandResult';
import runCommandsInteractiveExecutor, {
  RunCommandsInteractiveOptions,
} from './implementation';

describe(runCommandsInteractiveExecutor.name, () => {
  describe('having an ExecutorContext', () => {
    let executorContextFixture: ExecutorContext;

    beforeAll(() => {
      executorContextFixture = {
        root: 'root',
      } as Partial<ExecutorContext> as ExecutorContext;
    });

    describe('having a RunCommandsInteractiveOptions with a single command', () => {
      let commandFixture: string;
      let runCommandsInteractiveOptions: RunCommandsInteractiveOptions;

      beforeAll(() => {
        commandFixture = 'command fixture';

        runCommandsInteractiveOptions = {
          commands: [commandFixture],
        };
      });

      describe('when called', () => {
        let runCommandNodeJsAdapterMock: RunCommandNodeJsAdapter;
        let result: unknown;

        beforeAll(async () => {
          runCommandNodeJsAdapterMock = {
            run: jest.fn<
              (options: RunCommandOptions) => Promise<RunCommandResult>
            >(),
          } as Partial<RunCommandNodeJsAdapter> as RunCommandNodeJsAdapter;
          (
            RunCommandNodeJsAdapter as jestMock.Mock<
              () => RunCommandNodeJsAdapter
            >
          ).mockReturnValueOnce(runCommandNodeJsAdapterMock);

          result = await runCommandsInteractiveExecutor(
            runCommandsInteractiveOptions,
            executorContextFixture,
          );
        });

        it('should call RunCommandNodeJsAdapter()', () => {
          expect(RunCommandNodeJsAdapter).toHaveBeenCalledTimes(1);
          expect(RunCommandNodeJsAdapter).toHaveBeenCalledWith();
        });

        it('should call runCommandNodeJsAdapter.run()', () => {
          const expectedRunCommandOptions: RunCommandOptions = {
            command: commandFixture,
            cwd: executorContextFixture.root,
          };

          expect(runCommandNodeJsAdapterMock.run).toHaveBeenCalledTimes(1);
          expect(runCommandNodeJsAdapterMock.run).toHaveBeenCalledWith(
            expectedRunCommandOptions,
          );
        });

        it('should return a sucess response', () => {
          expect(result).toStrictEqual({ success: true });
        });
      });
    });
  });
});
