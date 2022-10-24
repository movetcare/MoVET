# Pull Request

**Please go through these steps before you submit a PR.**

1. Make sure that:

    a. You have done your changes in a separate branch. Branches MUST have descriptive names that start with either the `fix/` or `feature/` prefixes. Good examples are: `fix/signin-issue` or `feature/issue-templates`.

    b. You have a descriptive commit message with a short title (first line).

    c. You have only one commit (if not, squash them into one commit).

    d. `npm run lint` doesn't throw any error. If it does, fix them first and amend your commit (`git commit --amend`).

    e. `npm run test` doesn't throw any error. If it does, fix them first and amend your commit (`git commit --amend`).

2. **After** these steps, you're ready to open a pull request.

    a. Your pull request MUST NOT target the `production` branch on this repository. You will always want to target `development` instead.

    b. Give a descriptive title to your PR.

    c. Provide a description of your changes.

    d. Put `closes #XXXX` in your comment to auto-close the issue that your PR fixes (if such).

    e. Tag @alpinealex as the reviewer of the PR.

## Pull Request Check List

- **Please check if the PR fulfills these requirements**

- [ ] My code follows the code style of this project.
- [ ] My changes generate no new warnings or errors.
- [ ] My change requires a change to the documentation.
- [ ] I have updated the documentation accordingly.
- [ ] I have added tests to cover my changes.
- [ ] All new and existing tests passed.
- [ ] I have performed a self-review of my own code

**Additional Helpful Information**:
