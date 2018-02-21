import { readFile } from './utils/promises';

export interface Config {
  args: {
    local?: string;
  };
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

export const getConfig = async (configLocation: string = '.lemmy.json'): Promise<Config> => {
  const file = await readFile(configLocation, 'utf-8');
  const args = {};
  process.argv
    .filter(arg => arg.startsWith('--'))
    .forEach((arg) => {
      const [key, value] = [...arg.split('='), ''];
      args[key.replace(/^--/, '')] = value;
    });
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
