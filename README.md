![Lemmy Logo](docs/lemmy.svg)

# What's this?

Lemmy is a tool that comments your Pull Requests. You don't have to browse logs on your CI/CD system anymore to get some valuable information about the build.

### [See the docs on GitBook](https://h-1.gitbook.io/lemmy/)

# Sample output

> ### Version
> :tada: Package version has been updated properly.
> 
> ### Changelog
> :tada: Changelog has been updated properly.
> 
> ### Lint
> :tada: No lint warnings were reported!
> 
> ### Tests
> :tada: All tests passed!
> 
> | Stats | Test Suites | Tests |
> :--- | ---: | ---:
> | :green_heart: Passed | 1 | 3 |
> | :anger: Failed | 0 | 0 |
> | :grey_exclamation: Pending | 0 | 0 |
> | :raised_hands: **Total** | **1** | **3** |
> 
> 
> ### Coverage
> 
> | <bold>Summary</bold> | <bold>%</bold> |  |  |
> :--- | ---: | ---: | :---:
> | Statements | 3.86 | 18/466 | :warning: |
> | Branches | 9.14 | 18/197 | :warning: |
> | Functions | 3.67 | 4/109 | :warning: |
> 
> 
> <details><summary>Coverage by file</summary><p>
> 
> |  | File | Statements |  | Branches |  | Functions |  |
> :---: | :--- | ---: | ---: | ---: | ---: | ---: | ---:
> | :warning: | <details><summary>actions.ts</summary><code>/src/actions.ts</code></details> | 0.00 | 0/42 | 0.00 | 0/26 | 0.00 | 0/10 |
> | :warning: | <details><summary>create-config.ts</summary><code>/src/create-config.ts</code></details> | 0.00 | 0/32 | 0.00 | 0/11 | 0.00 | 0/7 |
> | :warning: | <details><summary>index.ts</summary><code>/src/index.ts</code></details> | 0.00 | 0/40 | 0.00 | 0/12 | 0.00 | 0/4 |
> | :warning: | <details><summary>changelog.ts</summary><code>/src/actions/changelog.ts</code></details> | 0.00 | 0/8 | 0.00 | 0/5 | 0.00 | 0/1 |
> | :warning: | <details><summary>coverage.ts</summary><code>/src/actions/coverage.ts</code></details> | 0.00 | 0/53 | 0.00 | 0/27 | 0.00 | 0/25 |
> | :warning: | <details><summary>githubComment.ts</summary><code>/src/actions/githubComment.ts</code></details> | 0.00 | 0/53 | 0.00 | 0/23 | 0.00 | 0/7 |
> | :warning: | <details><summary>jest.ts</summary><code>/src/actions/jest.ts</code></details> | 0.00 | 0/25 | 0.00 | 0/16 | 0.00 | 0/3 |
> | :warning: | <details><summary>lint.ts</summary><code>/src/actions/lint.ts</code></details> | 0.00 | 0/14 | 0.00 | 0/2 | 0.00 | 0/2 |
> | :warning: | <details><summary>packageVersion.ts</summary><code>/src/actions/packageVersion.ts</code></details> | 0.00 | 0/7 | 0.00 | 0/2 | 0.00 | 0/1 |
> | :warning: | <details><summary>stdout.ts</summary><code>/src/actions/stdout.ts</code></details> | 0.00 | 0/3 | 100.00 | 0/0 | 0.00 | 0/1 |
> | :warning: | <details><summary>args.ts</summary><code>/src/config/args.ts</code></details> | 0.00 | 0/8 | 100.00 | 0/0 | 0.00 | 0/3 |
> | :warning: | <details><summary>config.ts</summary><code>/src/config/config.ts</code></details> | 0.00 | 0/15 | 0.00 | 0/9 | 0.00 | 0/2 |
> | :warning: | <details><summary>circle.ci.ts</summary><code>/src/config/ci/circle.ci.ts</code></details> | 0.00 | 0/17 | 0.00 | 0/8 | 0.00 | 0/4 |
> | :warning: | <details><summary>travis.ci.ts</summary><code>/src/config/ci/travis.ci.ts</code></details> | 0.00 | 0/6 | 0.00 | 0/4 | 0.00 | 0/2 |
> | :warning: | <details><summary>git.util.ts</summary><code>/src/utils/git.util.ts</code></details> | 0.00 | 0/43 | 0.00 | 0/14 | 0.00 | 0/8 |
> | :warning: | <details><summary>message.util.ts</summary><code>/src/utils/message.util.ts</code></details> | 0.00 | 0/40 | 0.00 | 0/10 | 0.00 | 0/17 |
> | :warning: | <details><summary>promises.util.ts</summary><code>/src/utils/promises.util.ts</code></details> | 0.00 | 0/18 | 0.00 | 0/8 | 0.00 | 0/1 |
> | :warning: | <details><summary>request.util.ts</summary><code>/src/utils/request.util.ts</code></details> | 0.00 | 0/24 | 0.00 | 0/2 | 0.00 | 0/7 |
> 
> 
> </p></details>
> 
> <details><summary>Build information</summary><p>
> 
> | Summary | Value |
> --- | ---
> | :octocat: Commit | c59251d522f6eea3adedc8fa22c060dd6f17730a |
> | Comparing against | `master` branch |
> | Build number (job) | 23 (23.1) |
> | Lemmy | 0.3.2 |
> | System | Travis running linux |
> 
> 
> </p></details>
