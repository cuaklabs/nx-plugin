import { RunCommandOptions } from '../models/domain/RunCommandOptions';
import { RunCommandResult } from '../models/domain/RunCommandResult';

export interface RunCommandPort {
  run(options: RunCommandOptions): Promise<RunCommandResult>;
}
