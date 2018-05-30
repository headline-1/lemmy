![Lemmy Logo](docs/lemmy.svg)

# What's this?

Lemmy is a tool that comments your Pull Requests. You don't have to browse logs on your CI/CD system anymore to get some valuable information about the build.

### [See the docs on GitBook](https://h-1.gitbook.io/lemmy/)

# Sample output

> ### Changelog
> :tada: Changelog has been updated properly.
>
> ### Jest
> :exclamation: **Could not read report file at "./reports/test.json". It may not exist or it's not in JSON format.**
> 
> ### Lint
> :exclamation: **Linter reported errors.**
> 
> Location | Line | Failure | Rule
> --- | --- | --- | ---
> `/src/config.ts` | `39:10` | variable 'createConfig' used before declaration | no-use-before-declare
> 
> 
> ### Version
> :tada: Package version has been updated properly.
> 
> Summary | Value
> --- | ---
> :octocat: Commit | b4404a9728a00cab771c7d29afc668db37a45f46
> Comparing against | `master` branch
> Build number (job) | 54 (54.1)
> Lemmy | 0.0.10
> System | linux
> 
