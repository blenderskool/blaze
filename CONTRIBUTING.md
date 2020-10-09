# Contributing to Blaze
Thanks for contributing to Blaze :zap:! Make sure to **Fork** this repository into your account before making any commits.

## Project setup
Run the following commands to set up Blaze on your system
```bash
git clone https://github.com/<your-github-username>/blaze
cd blaze
git remote add upstream https://github.com/blenderskool/blaze.git
npm install
```

## Creating a feature branch
All development happens on the `next` branch. The `master` branch contains the known stable version of Blaze. To make your contributions, create a new branch from `next`.
```bash
git checkout next
git checkout -b my-branch next
```

## Development server
In most cases you would want to run the dev server for both frontend and backend to test your changes. Hence start the dev server by running the following command at the root of the project. This would start two servers:
- The backend server at port `3030`.
- The frontend live server at port `8080`.

```bash
npm run dev
```

## Commiting your changes and creating a PR
Now you can make your changes, and commit them. We don't have any specific convention as of now, but try to have a clear and summarized message for your commits. Refer https://chris.beams.io/posts/git-commit/#seven-rules for guidelines.

```bash
git add .
git commit -m "My fixes"
```

Sync your forked repository with the changes in this(upstream) repository
```bash
git fetch upstream
git rebase upstream/next
```

Push the changes to your fork.
```bash
git push origin my-branch
```

This is a good time, to open a pull request in this repository with the changes you have made. Make sure you open a pull request to merge to `next` branch and not the `master` branch directly.
