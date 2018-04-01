import { Args } from './args';
import { createConfig } from './create-config';
import { exists, readFile } from './utils/promises';

export interface Config {
  args: Args;
  git: {
    baseBranch?: string;
    repo?: string;
    pull?: string;
    commit?: string;
  };
  ci: {
    os?: string;
    buildNumber?: string;
    jobNumber?: string;
    buildDir?: string;
  };
  message: {
    github?: string;
  };
  actions: any[];
}

const undefinedIfFalse = (value: string): string => value === 'false' ? undefined : value;

export const getConfig = async (args: Args, configLocation: string = '.lemmy.json'): Promise<Config> => {

  if (args.init) {
    if (await exists(configLocation) && !args.force) {
      console.log(
        'Configuration already exists. Add --force parameter if you really want to override existing configuration.'
      );
      process.exit(1);
    }
    await createConfig(configLocation);
  }
  const file = await readFile(configLocation, 'utf-8');
  const config: Config = {
    args,
    git: {
      baseBranch: process.env.TRAVIS_BRANCH || 'master',
      repo: process.env.TRAVIS_REPO_SLUG,
      pull: undefinedIfFalse(process.env.TRAVIS_PULL_REQUEST),
      commit: undefinedIfFalse(process.env.TRAVIS_COMMIT),
    },
    ci: {
      os: process.env.TRAVIS_OS_NAME,
      buildNumber: process.env.TRAVIS_BUILD_NUMBER,
      jobNumber: process.env.TRAVIS_JOB_NUMBER,
      buildDir: process.env.TRAVIS_BUILD_DIR || process.cwd(),
    },
    message: {
      github: process.env.GITHUB_TOKEN,
    },
    ...JSON.parse(file),
  };
  config.actions = config.actions.map(action => typeof action === 'string' ? { name: action } : action);
  return config;
};
