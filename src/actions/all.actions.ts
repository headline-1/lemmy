import { changelog } from './changelog.action';
import { coverage } from './coverage.action';
import { githubComment } from './github-comment.action';
import { jest } from './jest.action';
import { lint } from './lint.action';
import { packageVersion } from './package-version.action';
import { stdout } from './stdout.action';

export const Actions = {
  changelog,
  coverage,
  githubComment,
  jest,
  lint,
  packageVersion,
  stdout,
};
