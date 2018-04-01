import packageJson from '../../package.json';
import { Action } from '../action.interface';
import { Context } from '../context';
import { get, post } from '../utils/request';

const BASE_URL = 'https://api.github.com/';

interface Params {
  oneCommentPerCommit?: boolean;
}

export const action: Action<Params> = {
  name: 'githubComment',
  description: 'Sends a Markdown-formatted message as a GitHub Pull Request comment. ' +
  'PR number and repository name are inferred from CI\'s env vars,' +
  ' **however `GITHUB_TOKEN` env var has to be provided**.\n' +
  'In case of Travis CI, it can be done either in `.travis.yml` (use secure mechanism) or in configuration section.',
  args: [
    {
      name: 'oneCommentPerCommit',
      description: 'set to true, if you want Lemmy to comment only once per build (useful for matrix builds)',
      type: 'boolean',
    },
  ],
  execute: async (ctx: Context, params: Params) => {
    if (!ctx.config.message.github) {
      throw new Error(`Github token is missing. \
Please add environmental variable GITHUB_TOKEN to your CI or a local machine.`);
    }

    const {
      git: { repo, pull, commit, baseBranch },
      ci: { buildNumber, jobNumber, os },
    } = ctx.config;

    if (!pull || !repo) {
      console.log(`Not a pull request or repository info is missing. Skipping githubComment action.`);
      return;
    }

    ctx.message.table([
      ['Summary', 'Value'],
      [':octocat: Commit', commit],
      ['Comparing against', `\`${baseBranch}\` branch`],
      ['Build number (job)', `${buildNumber} (${jobNumber})`],
      ['Lemmy', packageJson.version],
      ['System', os],
    ]);

    const commentsUrl = `/repos/${repo}/issues/${pull}/comments`;
    const requestOptions = {
      baseUrl: BASE_URL,
      json: true,
      headers: {
        Authorization: `token ${ctx.config.message.github}`,
      },
    };

    // Who am I?
    const user = await get('/user', requestOptions);
    const userId = user.body.id;

    // Have I posted earlier on the same commit?
    const comments = await get(commentsUrl, requestOptions);
    const myComments = comments.body.filter(comment => comment.user.id === userId);
    let skipComment = false;
    if (myComments.length > 0) {
      const commentBody = myComments[myComments.length - 1].body;
      const commitMatch = commentBody.match(/^:octocat: Commit\s*\|\s*(.+)\s*$/m);
      if (commitMatch && commitMatch[1] === commit) {
        skipComment = params.oneCommentPerCommit;
      }
    }

    // Post comment!
    if (!skipComment) {
      const response = await post(commentsUrl, {
        ...requestOptions,
        body: { body: ctx.message.get() },
      });
      console.log(`Comment can be accessed at: ${response.body.url}`);
    } else {
      console.log('Already commented on this commit. Skipping.');
    }
  },
};
