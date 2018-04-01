import prompts from 'prompts';
import { Action, ActionArgument } from './action.interface';
import { getActions } from './actions';
import { writeFile } from './utils/promises';

const JSON_SPACES = 2;

export const createConfig = async (configLocation: string): Promise<void> => {
  const config = { actions: [] };

  const actions = await getActions();

  let response: Action<any> | null | undefined = undefined;
  do {
    console.log('Actions: ' + (config.actions.map(action => action.name).join(' > ') || '(none)'));
    response = (await prompts([
      {
        type: 'select',
        name: 'action',
        message: 'Pick an action to perform',
        choices: [
          {
            title: '✔ I\'m done',
            value: null,
          },
          ...actions.filter((action) => {
            return !config.actions.find(addedAction => addedAction.name === action.name);
          }).map(action => ({ title: action.name, value: action })),
        ],
        initial: 1,
      },
    ])).action;
    const toPrompt = (argument: ActionArgument<any>) => {
      switch (argument.type) {
        case 'string':
          return { type: 'text' };
        case 'boolean':
          return { type: 'toggle', active: 'true', inactive: 'false' };
        default:
          return { type: argument.type };
      }
    };
    if (response) {
      const actionResponse = await prompts(response.args.map(arg => ({
        name: arg.name,
        initial: arg.default,
        ...toPrompt(arg),
        message: `Set an argument value for ${arg.name} (${arg.description})`,
      })));
      if (Object.keys(actionResponse).length === 0) {
        console.log('Action creation canceled.');
        continue;
      }
      config.actions.push({
        name: response.name,
        ...actionResponse,
      });
    } else if (response === undefined) {
      console.log('Initialization canceled.');
      process.exit(1);
    }
  } while (response);
  await writeFile(configLocation, JSON.stringify(config, null, JSON_SPACES), 'utf-8');
  console.log('Configuration has been successfully saved!');
  process.exit(0);
};
