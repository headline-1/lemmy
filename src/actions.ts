import { Action } from './action.interface';
import { Actions } from './actions/all.actions';
import { Context } from './context';
import { writeFile } from './utils/promises.util';

const missingPropertyError = (path: string, property: string): Error =>
  new Error(`An action "${path}" is missing a "${property}" property.`);

export const getActions = async (): Promise<Action<any>[]> => Object.entries(Actions)
  .map(([name, action]: [string, Action<any>]) => {
    if (!action) {
      throw new Error(`An action "${name}" does not have a valid entry point (missing "action" export).`);
    }
    if (!action.name) {
      throw missingPropertyError(name, 'name');
    }
    if (!action.description) {
      throw missingPropertyError(name, 'description');
    }
    if (!action.args) {
      throw missingPropertyError(name, 'args');
    }
    if (!action.execute) {
      throw missingPropertyError(name, 'execute');
    }

    return action;
  });

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
