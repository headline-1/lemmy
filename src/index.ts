import 'babel-polyfill';
import { executeAction, generateActionsDocument, getActions } from './actions';
import { getArgs } from './args';
import { getConfig } from './config';
import { Context } from './context';
import { Message } from './utils/message';

const run = async () => {
  let config;
  try {
    config = await getConfig(getArgs());
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Could not read configuration file. You can initialize lemmy by running `lemmy --init`.');
    } else {
      console.error(error);
    }
    return;
  }
  const message = new Message();

  const context: Context = { config, message };

  if (config.args['actions-doc']) {
    await generateActionsDocument(config.args['actions-doc']);
    process.exit(0);
    return;
  }

  if (config.args.local === undefined && !config.git.pull) {
    console.log('Skipping Lemmy actions, because PR identifier hasn\'t been found.' +
      ' Add `--local` flag in order to run Lemmy locally.');
    process.exit(0);
    return;
  }

  let errorsOccurred = false;
  const actions = await getActions();

  for (const actionEntry of config.actions) {
    const action = actions.find(action => action.name === actionEntry.name);
    if (!action) {
      throw new Error(`Can not find an action "${actionEntry.name}"`);
    }
    console.log(` ➡ ${action.name}`);
    try {
      await executeAction(action, context, actionEntry);
    } catch (err) {
      errorsOccurred = true;
      console.log(` ✖ ${err.message}`);
      message.error(err.message);
    }
  }
  if (errorsOccurred) {
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
