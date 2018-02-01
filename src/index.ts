import { getConfig } from './config';
import { Context } from './context';
import { Message } from './utils/message';

const run = async () => {
  const config = await getConfig();
  const message = new Message();

  const context: Context = { config, message };

  for (const action of config.actions) {
    await require('./actions/' + action.name)(context, action);
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
