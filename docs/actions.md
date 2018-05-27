## Actions

Actions are run exactly in order provided in `.lemmy.json`.

Action | Description | Params
--- | --- | ---
`changelog` | Checks if changes were performed in changelog file. | `file` *(string, optional)* - path to changelog file in repository; defaults to CHANGELOG.md
`coverage` | Prepares a report from Coverage JSON output. | `header` *(string, optional)* - a custom header; defaults to Coverage<br>`file` *(string, optional)* - path to a coverage report file in repository<br>`warnThreshold` *(number, optional)* - accepted level of coverage (in %); if total coverage is below specified level, it will cause a warning; defaults to 80<br>`errorThreshold` *(number, optional)* - minimal level of coverage (in %); an error will be thrown if total coverage is below specified threshold; defaults to 40<br>`skipCovered` *(boolean, optional)* - set to false if file summary should not skip files that are covered in 100%; defaults to true
`githubComment` | Sends a Markdown-formatted message as a GitHub Pull Request comment. PR number and repository name are inferred from CI's env vars, **however `GITHUB_TOKEN` env var has to be provided**. In case of Travis CI, it can be done either in `.travis.yml` (use secure mechanism) or in configuration section. | `oneCommentPerCommit` *(boolean, optional)* - set to true, if you want Lemmy to comment only once per build (useful for matrix builds)<br>`removalPolicy` *(string, optional)* - determines whether (and when) Lemmy should remove it's own previous comments - by default all comments are retained; defaults to never
`jest` | Prepares a report from Jest's JSON output. | `header` *(string, optional)* - a custom header; defaults to Jest<br>`file` *(string, optional)* - path to a test report file in repository
`lint` | Prepares a report from linter's JSON output. Tested with TSLint. | `header` *(string, optional)* - a custom header; defaults to Lint<br>`file` *(string, required)* - path to a lint report file in repository
`packageVersion` | Makes sure that version in `package.json` file has been changed | `file` *(string, optional)* - path to a lint report file in repository; defaults to package.json
`stdout` | Writes the Markdown-formatted message to a console | None

