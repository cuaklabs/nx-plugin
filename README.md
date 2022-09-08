[![Build status](https://github.com/cuaklabs/iocuak/workflows/ci/badge.svg)](https://github.com/cuaklabs/iocuak/workflows/ci/badge.svg)

# Cuaklabs Nx plugin

Nx plugin with custom nx executors

## Documentation

### Executors

#### run-commands-interactive

Runs multiple commands in child processes piping stdin to the current process.

**Options**

- commands (string[]): array of commands to run
- cwd (optional, string): working directory. The workspace root folder is used by default.
- parallel (optional, boolean): true to run commands in parallel. False by default.
