# Lemmy
Integrate Lemmy, and it will comment your PRs, answering a vital question "Lemmy know what's going on my CI server". It has no dependencies and (hopefully) will stay this way.

I made it, because
* there are no free, open-source solutions that allow to simply comment on Pull Requests, providing basic information on how are the things going on CI.
* it's tiring to open CI log whenever linter complains about missing comma.

### Features

* Github PR comment support
* Travis environment support
* Standard set of actions which compile into a report
* Humble emoji set to decorate messages (this one should be #1 feature)

### Setup

You'll obviously need Node.js and NPM or Yarn. Add a package as follows:

```bash
npm install lemmy --save-dev
```

Then add `.lemmy.json` configuration file and define some actions inside:

```json
{
  "actions": [
    "packageVersion",
    "changelog",
    {
      "name": "lint",
      "file": "reports/lint.json"
    },
    {
      "name": "jest",
      "file": "reports/test.json"
    },
    "stdout"
  ]
}
```

Next add lemmy to `package.json` scripts for simplicity:
```json
{
  "scripts": {
    "lemmy": "lemmy"
  }
}
```

And run it manually *after you run linter and tests* to check if everything works:
```bash
npm run lemmy
```

If you have included `stdout` action, you should see a Markdown output that is exactly the same as the one that is sent as a comment to your PR.

Then you should be ready to add the above command as a step in `.travis.yml` in script section, after running linter/tests.

## Actions

Actions are run exactly in order provided in `.lemmy.json`.

Action | Description | Params
--- | --- | ---
`changelog` | Checks if changes were performed in changelog file | `file` - path to changelog file in repository
`githubComment` | Sends a Markdown-formatted message as a GitHub Pull Request comment | `oneCommentPerCommit` - set to true, if you want Lemmy to comment only once per build (useful for matrix builds)<br>PR number and repository name are inferred from CI's env vars, **however `GITHUB_TOKEN` env var has to be provided**. In case of Travis CI, it can be done either in `.travis.yml` (use secure mechanism) or in configuration section.
`jest` | Prepares a report from Jest's json output | `file` - path to report file in repository
`lint` | Prepares a report from json linter output (tested with TSLint) | `file` - path to report file in repository
`packageVersion` | Makes sure that version of `package.json` file has been changed | `file` - path to `package.json` file in repository
`stdout` | Writes the Markdown-formatted message to a console | None
