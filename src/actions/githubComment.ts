import { Context } from '../context';
import { request } from '../utils/request';

interface Params {
  name: 'githubComment';
}

export default async (ctx: Context, _: Params) => {
  if (!ctx.config.message.github) {
    throw new Error('Github token is missing.' +
      'Please add environmental variable GITHUB_TOKEN to your CI or a local machine.');
  }
  const url = `https://api.github.com/repos/${ctx.config.git.repo}/issues/${ctx.config.git.pull}/comments`;
  return await request(
    'POST', url,
    { body: ctx.message.get() },
    { Authorization: `token ${ctx.config.message.github}` }
  );
};
