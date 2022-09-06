import { getJestJsProjectConfig } from './jest.config.base.mjs';

const jsUnitProject = getJestJsProjectConfig(
  'Unit',
  ['/node_modules', '.int.spec.js'],
  '.spec.js',
);

const jsIntegrationProject = getJestJsProjectConfig(
  'Integration',
  ['/node_modules'],
  '.int.spec.js',
);

/** @type {!import("@jest/types/build/Config").GlobalConfig} */
const globalConfig = {
  collectCoverageFrom: ['lib/**/*.js', '!lib/**/*.spec.js'],
  passWithNoTests: true,
  projects: [jsIntegrationProject, jsUnitProject],
};

export default globalConfig;
