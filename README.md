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

### Install System Tools & 3rd Party Dependencies

Follow the installation guide for each.

- [VS Code](https://code.visualstudio.com/docs/setup/mac)
- [Brew](https://brew.sh/) `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- [1Password CLI](https://developer.1password.com/docs/cli) `brew install --cask 1password/tap/1password-cli`
- [OpenJDK](https://formulae.brew.sh/formula/openjdk) `brew install openjdk`
- [NodeJS](https://formulae.brew.sh/formula/node) `brew install node`
- [PNPM](https://formulae.brew.sh/formula/pnpm) `brew install pnpm`
- [Firebase CLI](https://firebase.google.com/docs/cli#mac-linux-npm) `pnpm i -g firebase-tools`
- [Gitmoji CLI](https://www.npmjs.com/package/gitmoji-cli) `pnpm i -g gitmoji-cli`
- [NPM Check Updates](https://www.npmjs.com/package/npm-check-updates) `pnpm i -g npm-check-updates`
- [Kill Port](https://www.npmjs.com/package/kill-port) `pnpm i -g kill-port`

### Clone Git Repository

```sh
git clone https://github.com/movetcare/movet.git
```

### Setup Environment Variables

Read access to the "Developer" vault in 1Password is required in order to use any/all of the platforms private environemnt variables. Be sure to [sign in](https://developer.1password.com/docs/cli/get-started#sign-in) before you start up the devlopment environment for the first time.

### Install Mono Repo Dependencies

```sh
pnpm i
```

### Log into Firebase CLI with your authorized account

"Developer" access to the [staging](https://console.firebase.google.com/u/0/project/movet-care-staging/overview) and [production](https://console.firebase.google.com/u/0/project/movet-care/overview) environments in Firebase is required. Once authorized, run:

```sh 
firebase login
```

## Start Local Development Environment

```sh
pnpm start
```

### Local App URLs
- [movetcare.com](http://localhost:3000)
- [api.movetcare.com](http://localhost:4000)
- [app.movetcare.com](http://localhost:3001)
- [admin.movetcare.com](http://localhost:3002)

### Staging App URLs
- [stage.movetcare.com](https://stage.movetcare.com/)
- [stage.api.movetcare.com](https://console.firebase.google.com/u/0/project/movet-care-staging/overview)
- [stage.app.movetcare.com](https://stage.app.movetcare.com/)
- [stage.admin.movetcare.com](https://stage.admin.movetcare.com/)

## Testing

Tests are run automagically when you commit and push code via [Husky](https://github.com/typicode/husky).

- End to end client application testing is performed via the [Cypress](https://cypress.io) library. Tests can be found inside of `cypress/e2e`.
- Security rules are tested using [Jest](https://jestjs.io/). Tests can be found inside of `cypress/rules`.

### Core Feature & Functionality Testing Check List

Currently ALL these items must be MANUALLY tested after each deployment. As you work on various setions of the app, please ensure you wrtie new Cypress e2e tests to test as much of the core functionality as possible!

#### iOS/Android App
- Non-Authuthenticated
- - [ ] Create New Client via Sign Up Screen
- - [ ] Reset Password to Existing Account via Password Reset Screen
- - [ ] Sign In as a Client
- - [ ] Verify New Account (via Email)
- Autheiticated
- - Dashboard
- - - Book an Appointment (w/ 1 & 3 Patients)
- - - - [ ] Add Contact Info (1st Time Only)
- - - - [ ] Add a Pet (1st Time Only)
- - - - [ ] Select a Pet
- - - - [ ] Wellness Selection
- - - - [ ] Illness Details
- - - - [ ] Location Selection
- - - - [ ] Date / Time Selection
- - - - [ ] Add Payment Source (If Not Already On File)
- - - - [ ] Confirm Details
- - - - [ ] Booking Success
- - - [ ] View Upcoming Apopintment(s)
- - - [ ] View Past Appointments
- - - [ ] Delete Existing Appointment(s)
- - Telehealth
- - - [ ] Start / End Chat
- - - Schedule Telehealth Appointment (w/ 1 & 3 Patients)
- - - - [ ] Client Info (1st Time Only)
- - - - [ ] Add a Pet (1st Time Only)
- - - - [ ] Select a Pet
- - - - [ ] Wellness Selection
- - - - [ ] Illness Details
- - - - [ ] Date / Time Selection
- - - - [ ] Add Payment Source (If Not Already On File)
- - - - [ ] Confirm Details
- - - - [ ] Booking Success
- - - [ ] List Upcoming Appointment(s)
- - - [ ] Delete Appoitment
- - Settings
- - - [ ] Change Contact Info
- - - [ ] Add/Edit Pet(s)
- - - [ ] Add New Payment Source
- - - [ ] Toggle Dark Mode
- - - [ ] Toggle Email & SMS Notifications
- - - [ ] Sign Out
- - - [ ] Contact Support
- - - [ ] Report a Bug
- - - [ ] Delete My Account

#### Web App
- Non-Authenticated
- - [ ] Start Appointment Booking Request via Email Address
- - [ ] Emails Auth Link to Clients Email
- - [ ] Email Auth Link Redirects w/ Sign In Success
- - [ ] Appointment Check In
- - [ ] Update Payment Source
- - [ ] Reset Account Password
- - [ ] Verify Account via Email Link
- Authenticated
- - Book an Appointment (w/ 1 & 3 Patients)
- - - [ ] Add Contact Info (1st Time Only)
- - - [ ] Add a Pet (1st Time Only)
- - - [ ] Select a Pet
- - - [ ] Wellness Selection (VCPR Required Only)
- - - [ ] Illness Details (VCPR Required Only)
- - - [ ] Location Selection
- - - [ ] Service Selection (Established Patients Only)
- - - [ ] Date / Time Selection
- - - [ ] Add Payment Source (If Not Already On File)
- - - [ ] Submission Success

#### Admin App
- Non-Authenticated
- [ ] Sign In via Google O-Auth
- [ ] Block Non-Approved Sign Up/In Requests
- Authenticated
- - Dashboard
- - - [ ] Update Announcement Banner
- - - [ ] Client Check In List
- - - [ ] Active Chat List
- - Billing
- - - [ ] Create / Sync an Invoice w/ Counter Sale
- - - [ ] Create / Sync an Invoice w/ Existing Client
- - - [ ] View Previously Paid Counter Sale Invoices
- - - [ ] View Previously Paid Client Invoices
- - - [ ] Pay Inovice via Credit Card Reader
- - - [ ] Pay Inovice via Card on File
- - - [ ] Fully Refund a Paid Invoice
- - Telehealth 
- - - [ ] View Chat List (Active & Archived)
- - - [ ] Send / Receive Chats
- - Settings
- - - [ ] Sign Out
- - - [ ] Report a Bug
- - - [ ] Request a Feature
- - - [ ] View Dopcumentation
- - - Platform Settings
- - - - [ ] Manage Users
- - - - [ ] Platform Tools
- - - - Manage Booking
- - - - - [ ] Manage Services
- - - - - [ ] Manage Clinic
- - - - - [ ] Manage Housecalls
- - - - - [ ] Manage Telehealth

## Deployment

Production and staging deployments happen automatically from the `main` and `development` branches respectively, via [Husky](https://github.com/typicode/husky).

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
