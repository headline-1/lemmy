import { CoreOptions } from 'request';
import packageJson from '../../package.json';
import { Action } from '../action.interface';
import { Context } from '../context';
import { del, get, post } from '../utils/request.util';

const BASE_URL = 'https://api.github.com/';

interface GithubComment {
  id: number;
  url: string;
  body: string;
  user: {
    id: string;
    login: string;
  };
  created_at: string;
  updated_at: string;
}

const githubCommentCreatedAtComparator = (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

interface Params {
  oneCommentPerCommit?: boolean;
  removalPolicy?: 'always' | 'never' | 'onlyLastComment';
}

const getComments = async (issueCommentsUrl: string, requestOptions: CoreOptions, userId: string) => {
  const comments: GithubComment[] = (await get(issueCommentsUrl, requestOptions)).body;
  const myComments = comments.filter(comment => comment.user.id === userId);
  return { comments, myComments };
};

const shouldSkipComment = (commit: string, oneCommentPerCommit: boolean, myComments: GithubComment[]) => {
  let skipComment = false;
  myComments.forEach((comment) => {
    const commitMatch = comment.body.match(/:octocat: Commit\s*\|\s*(.+?)\s*\|/);
    if (commitMatch && commitMatch[1] === commit) {
      skipComment = skipComment || oneCommentPerCommit;
    }
  });
  return skipComment;
};

const removeComments = async (ctx: Context, myComments: GithubComment[], removalPolicy: string) => {
  const deleteRequestOptions = {
    headers: {
      Authorization: `token ${ctx.config.message.github}`,
    },
  };
  switch (removalPolicy) {
    case 'always':
      console.log(`Removing all my previous comments...`);
      for (const comment of myComments) {
        await del(comment.url, deleteRequestOptions);
      }
      console.log(`Successfully removed ${myComments.length} comments.`);
      break;
    case 'onlyLastComment':
      console.log(`Removing my last comment...`);

      const lastComment = myComments.length > 0 && myComments.sort(githubCommentCreatedAtComparator)[0];
      if (lastComment) {
        await del(lastComment.url, deleteRequestOptions);
        console.log(`Successfully removed my last comment.`);
      }
      break;
    default:
      break;
  }
};

export const action: Action<Params> = {
  name: 'githubComment',
  description: 'Sends a Markdown-formatted message as a GitHub Pull Request comment. ' +
  'PR number and repository name are inferred from CI\'s env vars,' +
  ' **however `GITHUB_TOKEN` env var has to be provided**.' +
  ' In case of Travis CI, it can be done either in `.travis.yml` (use secure mechanism) or in configuration section.',
  args: [
    {
      name: 'oneCommentPerCommit',
      description: 'set to true, if you want Lemmy to comment only once per build (useful for matrix builds)',
      type: 'boolean',
    },
    {
      name: 'removalPolicy',
      description: 'determines whether (and when) Lemmy should remove it\'s own previous comments' +
      ' - by default all comments are retained',
      type: 'string',
      default: 'never',
    },
  ],
  execute: async (ctx: Context, params: Params) => {
    if (ctx.config.args.local) {
      console.log('Skipping githubComment action for a local run.');
      return;
    }
    if (!ctx.config.message.github) {
      throw new Error(`Github token is missing. \
Please add environmental variable GITHUB_TOKEN to your CI or a local machine.`);
    }

    const {
      git: { repo, pull, commit, baseBranch },
      ci: { name: ciName, buildNumber, jobNumber, os },
    } = ctx.config;

    if (!pull || !repo) {
      console.log(`Not a pull request or repository info is missing. Skipping githubComment action.`);
      return;
    }

    ctx.message
      .collapsibleSection('Build information')
      .table([
        ['Summary', 'Value'],
        [':octocat: Commit', commit],
        ['Comparing against', `\`${baseBranch}\` branch`],
        ['Build number (job)', `${buildNumber} (${jobNumber})`],
        ['Lemmy', packageJson.version],
        ['System', `${ciName} running ${os}`],
      ])
      .collapsibleSectionEnd();

    const issueCommentsUrl = `/repos/${repo}/issues/${pull}/comments`;
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
    const { myComments } = await getComments(issueCommentsUrl, requestOptions, userId);
    const skipComment = shouldSkipComment(commit, params.oneCommentPerCommit, myComments);

    if (!skipComment) {
      // Remove previous comments
      await removeComments(ctx, myComments, params.removalPolicy);
      // Post a comment!
      const response = await post(issueCommentsUrl, {
        ...requestOptions,
        body: { body: ctx.message.get() },
      });
      console.log(`Comment can be accessed at: ${response.body.url}`);
    } else {
      console.log('Already commented on this commit. Skipping.');
    }
  },
};
