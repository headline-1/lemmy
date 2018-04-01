export type Args = {
  local?: string;
  init?: boolean;
  force?: boolean;
  'actions-doc'?: string;
};

export const getArgs = () => {
  const args: Args = {};
  process.argv
    .filter(arg => arg.startsWith('--'))
    .forEach((arg) => {
      const [key, value] = [...arg.split('='), true] as any;
      args[key.replace(/^--/, '')] = value;
    });
  return args;
};
