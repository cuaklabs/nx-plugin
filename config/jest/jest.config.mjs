import { getJestTsProjectConfig } from './jest.config.base.mjs';

const tsUnitProject = getJestTsProjectConfig(
  'Unit',
  ['/node_modules', '.int.spec.ts'],
  '.spec.ts',
);

const tsIntegrationProject = getJestTsProjectConfig(
  'Integration',
  ['/node_modules'],
  '.int.spec.ts',
);

/** @type {!import("@jest/types/build/Config").GlobalConfig} */
const globalConfig = {
  passWithNoTests: true,
  projects: [tsIntegrationProject, tsUnitProject],
};

export default globalConfig;
