import { readFile } from './utils/promises';

export interface Config {
  git: {
    baseBranch?: string;
    repo?: string;
    pull?: string;
  };
  message: {
    github?: string;
  };
  actions: any[];
}

export const getConfig = async (configLocation: string = '.lemmy.json'): Promise<Config> => {
  const file = await readFile(configLocation, 'utf-8');
  const config: Config = {
    git: {
      baseBranch: process.env.TRAVIS_PULL_REQUEST_BRANCH || 'master',
      repo: process.env.TRAVIS_REPO_SLUG,
      pull: process.env.TRAVIS_PULL_REQUEST,
    },
    message: {
      github: process.env.GITHUB_TOKEN,
    },
    ...JSON.parse(file),
  };
  config.actions = config.actions.map(action => typeof action === 'string' ? { name: action } : action);
  console.log(config);
  return config;
};
