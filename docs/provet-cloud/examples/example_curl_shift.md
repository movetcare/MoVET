# Example of Working with the Local Firebase Emulator

Please make sure that your platform repo is up to date, you have built your functions, ProVet Cloud users &their shifts are setup, & you have the Firebase emulator installed & running. Once this is in place, paste the following command in your terminal to populate your shifts collection with data from ProVet Cloud.

`curl -v -H 'Content-Type: application/json' -d '{"apiKey":"L9At3HGmvRDuyi7TTX","type":"shifts"}' -X POST http://localhost:5001/movet-care-staging/us-central1/incomingWebhook/app/config/`
