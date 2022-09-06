const tsProjectRoot = '<rootDir>/src';
const jsProjectRoot = '<rootDir>/lib';

/**
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } collectCoverageFrom expressions to match to a file covered by IstambulJs
 * @param { !Array<string> } roots Jest roots
 * @param { !Array<string> } testMatch Expressions to match to test file paths
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @returns { !import("@jest/types/build/Config").GlobalConfig } Jest config
 */
function getJestProjectConfig(
  projectName,
  roots,
  testMatch,
  testPathIgnorePatterns,
) {
  /** @type { !import("@jest/types/build/Config").GlobalConfig } */
  const projectConfig = {
    displayName: projectName,
    collectCoverageFrom: [],
    coveragePathIgnorePatterns: ['/node_modules/'],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: '.',
    roots: roots,
    testEnvironment: 'node',
    testMatch: testMatch,
    testPathIgnorePatterns: testPathIgnorePatterns,
  };

  return projectConfig;
}

/**
 * @param { !string } projectName Jest project's name
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @param { ?string } packageName Project package
 * @param { ?string } extension Test extension to match
 * @returns { !import("@jest/types/build/Config").GlobalConfig } Jest config
 */
function getJestJsProjectConfig(
  projectName,
  testPathIgnorePatterns,
  extension,
) {
  const testMatch = [getJsTestMatch(extension)];

  return getJestProjectConfig(
    projectName,
    [jsProjectRoot],
    testMatch,
    testPathIgnorePatterns,
  );
}

/**
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @param { ?string } package Project package
 * @param { ?string } extension Test extension to match
 * @returns @returns { !import("@jest/types/build/Config").GlobalConfig } Jest config
 */
function getJestTsProjectConfig(
  projectName,
  testPathIgnorePatterns,
  extension,
) {
  const testMatch = [getTsTestMatch(extension)];

  return {
    ...getJestProjectConfig(
      projectName,
      [tsProjectRoot],
      testMatch,
      testPathIgnorePatterns,
    ),
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
  };
}

/**
 * @param { !string } root Project root
 * @param { !string } testExtension Test extension files
 * @returns { !string }
 */
function getSubmoduleTestMatch(root, testExtension) {
  return `${root}/**/*${testExtension}`;
}

/**
 * @param { !string } testExtension Test extension files
 * @returns { !string }
 */
function getTsTestMatch(testExtension) {
  return getSubmoduleTestMatch(tsProjectRoot, testExtension);
}

/**
 * @param { !string } testExtension Test extension files
 * @returns { !string }
 */
function getJsTestMatch(testExtension) {
  return getSubmoduleTestMatch(jsProjectRoot, testExtension);
}

export { getJestJsProjectConfig, getJestTsProjectConfig };
