# GitHub Token Setup

1. Go to [GitHub Token Settings](https://github.com/settings/tokens) 
2. Click on "Generate new token" button or edit an existing token you'd like to use.
3. Select all `repo` permissions, so that Lemmy can access PRs in your repository.
4. Copy the token and set it as `GITHUB_TOKEN` environment variable in your Continuous Integration configuration.
