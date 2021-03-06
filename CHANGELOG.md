# 0.3.2

* CircleCI support - now you can also use Lemmy on both Travis and CircleCI!

# 0.3.0

* Lemmy moved to @headline-1 organization
* Documentation improvements (work in progress)

# 0.2.2

* [FIX] Don't post twice on same commit (check fix 2 - as previous didn't work)

# 0.2.1

* [FIX] Don't post twice on same commit (check fix)

# 0.2.0

* [NEW] Coverage action
* [NEW] Collapsible sections in comments
* [FIX] Broken newline in actions fix
* [IMP] Improved formatting
* [DEV] Updated dependencies

# 0.1.0

* [NEW] Automatically remove old comments, with three policies to fit users' needs.

# 0.0.13

* [FIX] Do not comment the same commit twice when the last Lemmy comment isn't about the commit.

# 0.0.12

* [FIX] Fixed issues with env vars not passed to git properly

# 0.0.11

* [FIX] Improved git reliability and fixed stash bug
* [NEW] Action typings and reworked action structure
* [NEW] `init` command

# 0.0.9

* [FIX] Git pull fix.

# 0.0.8

* [FIX] Network errors fix.

# 0.0.7

* [IMP] Network errors are more verbose.

# 0.0.6

* [FIX] Missing library dependency fix.
* [IMP] Added optional `--local` flag. Lemmy won't run in non-PR builds by default.

# 0.0.5

* [FIX] Travis build fix

# 0.0.4

* [FIX] Missing binary link

# 0.0.3

* [FIX] False env vars fix

# 0.0.2

* [NEW] `lint`, `changelog`, `githubComment`, `packageVersion`, `jest` and `stdout` actions.
* [DEV] Basic architecture, allowing to add actions independently

# 0.0.1

* [NEW] A library, kept as small as possible. It allows to check stuff that usually can be seen in CI logs and add a comment with some checks to Pull Request. In the end it I hope it will be as functional as codecov, but free.
