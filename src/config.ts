import * as path from 'path';
import {readline} from 'readline';
import { exists, readdir, readFile } from './utils/promises';

type Args = {
  local?: string;
  init?: string;
  force?: string;
};

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

export const getConfig = async (configLocation: string = '.lemmy.json'): Promise<Config> => {
  const args: Args = {};
  process.argv
    .filter(arg => arg.startsWith('--'))
    .forEach((arg) => {
      const [key, value] = [...arg.split('='), ''];
      args[key.replace(/^--/, '')] = value;
    });
  if (args.init) {
    if (await exists(configLocation) && !args.force) {
      console.log('Configuration already exists.' +
        'Add --force parameter if you really want to override existing configuration.');
      process.exit(1);
    }
    createConfig(configLocation);
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

const createConfig = async (configLocation: string): Promise<void> => {
  const config = { actions: [] };

  const actions = (await readdir('./actions'))
    .filter(file => file.endsWith('.js'))
    .map(file => require(path.resolve(file)));

  let line = readline()
  while(readline){
  }

  actions.forEach((action) => {
    console.log('Do you want to perform ' + action.name);
  });
};
