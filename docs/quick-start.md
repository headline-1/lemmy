![Lemmy Logo](lemmy.svg)

# Lemmy
Integrate Lemmy, and it will comment your PRs, answering a vital question "Lemme know what's going on my CI server".

### Motivation
There were no free, open-source solutions (besides [Danger.js](https://github.com/danger/danger-js), which didn't work well for me) that allow to simply comment on Pull Requests, providing basic information on how are the things going on CI.

### Features

* Github PR comment support
* Travis environment support
* Standard set of actions which compile into a report
* Humble emoji set to decorate messages (this one should be #1 feature)

### Setup

You'll obviously need Node.js and NPM or Yarn. Add a package as follows:

```bash
npm install lemmy --save-dev
# or
yarn install lemmy -D
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

You can also use `lemmy --init` command to add actions step by step. Remember about execution order!

Next, add Lemmy to `package.json` scripts for simplicity:
```json
{
  "scripts": {
    "lemmy": "lemmy"
  }
}
```

And run it manually *after you run linter and tests* to check if everything works:
```bash
npm run lemmy --local
# or
yarn lemmy --local
```

If you have included `stdout` action, you should see a Markdown output that is exactly the same as the one that is sent as a comment to your PR.

##### GitHub

To configure GitHub integration and obtain the token, follow the instructions in [docs](./docs/github.md).

##### Travis
You should be ready to add the above command as a step in `.travis.yml` in script section, after running linter/tests.

## Actions

For complete list of actions, see [Action Docs](./docs/actions.md).

## Changelog

See [Changelog](./CHANGELOG.md).
