import * as path from 'path';
import { Action } from './action.interface';
import { Context } from './context';
import { readdir, writeFile } from './utils/promises.util';

const missingPropertyError = (path: string, property: string): Error =>
  new Error(`An action at "${path} is missing a "${property} property.`);

export const getActions = async (): Promise<Action<any>[]> => {
  const actionsDirectory = path.resolve(__dirname, './actions');
  const paths = (await readdir(actionsDirectory))
    .filter(file => file.endsWith('.js'))
    .map(file => path.resolve(path.resolve(__dirname, './actions'), file));

  return paths.map((path: string) => {
    const module = require(path);
    const action: Action<any> = module.action;
    if (!action) {
      throw new Error(`An action at "${path}" does not have a valid entry point (missing "action" export).`);
    }
    if (!action.name) {
      throw missingPropertyError(path, 'name');
    }
    if (!action.description) {
      throw missingPropertyError(path, 'description');
    }
    if (!action.args) {
      throw missingPropertyError(path, 'args');
    }
    if (!action.execute) {
      throw missingPropertyError(path, 'execute');
    }

    return action;
  });
};

export const executeAction = async <Params>(
  action: Action<Params>, context: Context, params: Params
): Promise<void> => {
  const executionParams: any = {};
  action.args.forEach((arg) => {
    let value = params[arg.name];
    if (value === null || value === undefined) {
      value = arg.default;
    }
    if ((arg.required && (value === null || value === undefined)) || typeof value !== arg.type) {
      throw new Error(`${action.name} requires an argument "${arg.name}" of type ${arg.type}.
Got "${value}" of type "${typeof value}".
Argument purpose: ${arg.description}
`);
    }
    executionParams[arg.name] = value;
  });
  return action.execute(context, executionParams);
};

export const generateActionsDocument = async (outputPath: string) => {
  let document = '## Actions\n\nActions are run exactly in order provided in `.lemmy.json`.\n\n';

  document += 'Action | Description | Params\n--- | --- | ---\n';

  const actions = await getActions();
  document += actions.map((action) => {
    const args = action.args
      .map(arg => `\`${arg.name}\` \
*(${arg.type}, ${arg.required ? 'required' : 'optional'})* - ${arg.description}\
${arg.default !== undefined ? `; defaults to ${arg.default}` : '' }`)
      .join('<br>') || 'None';
    return `\`${action.name}\` | ${action.description} | ${args}`;
  }).join('\n');

  document += '\n\n';

  await writeFile(outputPath, document, 'utf-8');
};
