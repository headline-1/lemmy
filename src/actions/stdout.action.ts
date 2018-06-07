import { Action } from '../action.interface';
import { Context } from '../context';

export const stdout: Action<{}> = {
  name: 'stdout',
  description: 'Writes the Markdown-formatted message to a console',
  args: [],
  execute: async (ctx: Context) => {
    console.log(ctx.message.get());
  },
};
