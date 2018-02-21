import 'babel-polyfill';
import { getConfig } from './config';
import { Context } from './context';
import { Message } from './utils/message';

const run = async () => {
  const config = await getConfig();
  const message = new Message();

  const context: Context = { config, message };
  const errors: string[] = [];

  if (config.args.local === undefined && !config.git.pull) {
    console.log('Skipping Lemmy actions, because PR identifier hasn\'t been found.' +
      'Add `--local` flag in order to run Lemmy locally.');
    process.exit(0);
    return;
  }

  for (const action of config.actions) {
    let module;
    try {
      module = await require('./actions/' + action.name);
    } catch (ignored) {
      throw new Error(`Can not find an action "${action.name}"`);
    }
    if (!module.default) {
      throw new Error(`An action "${action.name}" does not have a valid entry point (export default function).`);
    }
    console.log(`Running action: ${action.name}`);
    try {
      await module.default(context, action);
    } catch (err) {
      message.error(err.message);
      errors.push(action.name + ': ' + err.message);
    }
  }
  if (errors.length) {
    console.log(errors.join('\n'));
    process.exit(1);
  }
};

run()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('An error occurred while running Lemmy.\n', err);
    process.exit(1);
  });
