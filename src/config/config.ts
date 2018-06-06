import { createConfig } from '../create-config';
import { deepMerge } from '../utils/general';
import { exists, readFile } from '../utils/promises';
import { Args } from './args';
import { Circle } from './ci/circle.ci';
import { Travis } from './ci/travis.ci';

export interface Config {
  args: Args;
  git: {
    baseBranch?: string;
    repo?: string;
    pull?: string;
    commit?: string;
  };
  ci: {
    name: string;
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

  const config = deepMerge<Config>(
    {
      args,
      git: {
        baseBranch: 'master',
      },
      ci: {
        name: '',
        buildDir: process.cwd(),
      },
      message: {
        github: process.env.GITHUB_TOKEN,
      },
    },
    await Travis.config(),
    await Circle.config(),
    JSON.parse(file)
  );
  // Normalize actions
  config.actions = config.actions.map(action => typeof action === 'string' ? { name: action } : action);
  return config;
};
