import { Context } from './context';

export interface ActionArgument<Name extends string> {
  name: Name;
  description: string;
  type: 'string' | 'boolean' | 'number';
  default?: any;
  required?: boolean;
}

export interface Action<Params> {
  name: string;
  description: string;
  args: ActionArgument<keyof Params>[];
  execute: (ctx: Context, params: Params) => Promise<void>;
}
