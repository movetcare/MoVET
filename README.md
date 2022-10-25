# MoVET

- [MoVET](#movet-care)
  - [Project Onboarding, Process & Workflows](#project-onboarding-process--workflows)
    - [Software Tools & Access](#software-tools--access)
    - [Weekly Sprint Planning](#weekly-sprint-planning)
    - [Project & Task Management](#project--task-management)
    - [Daily Standup](#daily-standup)
  - [Developer Onboarding, Process & Workflows](#developer-onboarding-process--workflows)
    - [Install Dependencies](#install-dependencies)
    - [Clone Git Repository](#clone-git-repository)
    - [Setup Environment Variables](#setup-environment-variables)
    - [Install 3rd Party Packages](#install-3rd-party-packages)
    - [Log into Firebase CLI with your authorized account](#log-into-firebase-cli-with-your-authorized-account)
  - [Local Development](#local-development)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [Built With](#built-with)

## Project Onboarding, Process & Workflows

### Software Tools & Access

### Weekly Sprint Planning

### Project & Task Management

### Daily Standup

## Developer Onboarding, Process & Workflows

### Install Dependencies

Follow the installation guide for each.

- [Firebase CLI](https://firebase.google.com/docs/cli#install-cli-windows)

### Clone Git Repository

```sh
git clone https://github.com/movetcare/movet.git
```

### Setup Environment Variables

Reach out to Alex for the environment files and move them to the corresponding directories:

- `.env`
- `apps/api.movetcare.com/.runtimeconfig.json`

### Install Mono Repo Dependencies

```sh
npm install -g pnpm
pnpm add firebase-tools gitmoji-cli 
pnpm i
```

### Log into Firebase CLI with your authorized account

```sh
firebase login --interactive
```

## Local Development

Run the development server from the root directory

```sh
pnpm start
```

### Local App URLs
- [movetcare.com](http://localhost:3000)
- [api.movetcare.com](http://localhost:4000)
- [app.movetcare.com](http://localhost:3001)
- [admin.movetcare.com](http://localhost:3002)

## Testing

Tests are run automagically when you commit and push code via [Husky](https://github.com/typicode/husky).

- End to end client application testing is performed via the [Cypress](https://cypress.io) library. Tests can be found inside of `__TESTS__/e2e`.
- Security rules are tested using [Jest](https://jestjs.io/). Tests can be found inside of `__TESTS__/rules`.

## Deployment

Production and staging deployments happen automatically from the `production` and `development` branches respectively, via [GitHub Actions](https://github.com/movetcare/movet-platform/actions).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what makes the project such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please make a feature branch and open a pull request to the `development` branch.

## Built With
- [PNPM](https://pnpm.io/)
- [Next.js](https://nextjs.org)
- [Vercel](https://vercel.com)
- [TurboRepo](https://turborepo.org/)
- [Google Cloud Platform](https://cloud.google.com/docs)
- [Firebase Emulators](https://firebase.google.com/docs/emulator-suite)
- [Firebase Authentication](https://firebase.google.com/docs/firestore)
- [Cloud Firestore](https://firebase.google.com/docs/auth)
- [Cloud Functions](https://firebase.google.com/docs/functions)
- [Cloud Storage](https://firebase.google.com/docs/storage)
- [Security Rules](https://firebase.google.com/docs/rules)
- [GitHub Actions](https://github.com/movetcare/movet-platform/actions)
- [Cypress](https://cypress.io)
- [Jest](https://jestjs.io/)
- [Husky](https://github.com/typicode/husky)
- [Figma - Wireframes & Design](https://figma.com)
