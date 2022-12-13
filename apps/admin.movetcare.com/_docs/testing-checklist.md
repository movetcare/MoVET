---
title: 'Testing Checklist'
excerpt: 'Tasks to perform after every deployment!'
---

### Core Feature & Functionality Testing Check List

Currently ALL these items must be MANUALLY tested after each deployment. 
BEFORE you start your testing, be sure to log into Firebase, ProVet and Stripe and manaully delete all the test user data within each service.
As you work on various setions of the app, please ensure you wrtie new Cypress e2e tests to test as much of the core functionality as possible!

#### iOS & Android App

Test Email Addresses to Use: 
- support+test_ios@movetcare.com
- support+test_android@movetcare.com

Esstential UX Flows to Test (on BOTH iOS & Android)
- [ ] 1st Time Client Sign Up w/ NO Existing Records in ProVet and Stripe
- [ ] Existing Client w/ ONE Patient REQUIRING VCPR AND Existing Records in ProVet and Stripe (BUT WITHOUT VALID CC ON FILE)
- [ ] Existing Client w/ THREE Patients REQUIRING VCPR AND Existing Records in ProVet and Stripe
- [ ] Existing Client w/ ONE Patient NOT REQUIRING VCPR AND Existing Records in ProVet and Stripe
- [ ] Existing Client w/ THREE Patients NOT REQUIRING VCPR AND Existing Records in ProVet and Stripe (BUT WITHOUT VALID CC ON FILE)

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

Test Email Addresses to Use: 
- support+test_web@movetcare.com

Esstential UX Flows to Test
- [ ] 1st Time Client Sign Up w/ NO Existing Records in ProVet and Stripe
- [ ] Existing Client w/ ONE Patient REQUIRING VCPR AND Existing Records in ProVet and Stripe (BUT WITHOUT VALID CC ON FILE)
- [ ] Existing Client w/ THREE Patients REQUIRING VCPR AND Existing Records in ProVet and Stripe
- [ ] Existing Client w/ ONE Patient NOT REQUIRING VCPR AND Existing Records in ProVet and Stripe
- [ ] Existing Client w/ THREE Patients NOT REQUIRING VCPR AND Existing Records in ProVet and Stripe (BUT WITHOUT VALID CC ON FILE)

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

Test STAFF Email Addresses to Use: 
- support@movetcare.com

Esstential UX Flows to Test
- [ ] Can Recieve New Client Check Ins
- [ ] Can Chat w/ Existing Clients
- [ ] Can Update Website Announcement Banner
- [ ] Can Report a Bug & Request a New Feature
- [ ] Can Toggle All BOOKING Settings Without Error
- [ ] Can Perform ALL "Billing" Functions Without Error

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
