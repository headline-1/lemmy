import { Context } from '../context';

interface Params {
  name: 'stdout';
}

export default async (ctx: Context, _: Params) => {
  console.log(ctx.message.get());
};
