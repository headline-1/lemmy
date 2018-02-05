import 'babel-polyfill';
import { getConfig } from './config';
import { Context } from './context';
import { Message } from './utils/message';

const run = async () => {
  const config = await getConfig();
  const message = new Message();

  const context: Context = { config, message };

  for (const action of config.actions) {
    let module;
    try {
      module = await require('./actions/' + action.name);
    } catch (err) {
      throw new Error(`Can not find an action "${action.name}"`);
    }
    if (!module.default) {
      throw new Error(`An action "${action.name}" does not have a valid entry point (export default function).`);
    }
    console.log(`Running action: ${action.name}`);
    await module.default(context, action);
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
