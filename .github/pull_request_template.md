# Pull Request

**Please go through these steps before you submit a PR.**

1. Make sure that:

    a. You have done your changes in a separate branch. Branches MUST have descriptive names that start with either the `fix/` or `feature/` prefixes. Good examples are: `fix/signin-issue` or `feature/issue-templates`.

    b. You have a descriptive commit message with a short title (first line).

    c. All locally ran CI (via Husky) has passed.

2. **After** these steps, you're ready to open a pull request.

    a. Your pull request MUST NOT target the `main` branch on this repository. You will always want to target `development` instead.

    b. Give a descriptive title to your PR.

    c. Provide a description of your changes.

    d. Put `closes #XXXX` in your comment to auto-close the issue that your PR fixes (if such).

    e. Tag Alex as the reviewer of the PR.

## Pull Request Check List

- **Please check if the PR fulfills these requirements**

- [ ] My code follows the code style of this project.
- [ ] My changes generate no new warnings or errors.
- [ ] My change requires a change to the documentation.
- [ ] I have updated the documentation accordingly.
- [ ] I have added tests to cover my changes.
- [ ] All new and existing tests passed.
- [ ] I have performed a self-review of my own code
- [ ] I have manually performed ALL the test below and no error/issues exist

### Manual Testing Checklist

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

**Additional Helpful Information**:
