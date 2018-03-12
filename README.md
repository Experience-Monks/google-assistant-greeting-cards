# Greeting Cards for Google Assistant

Greeting Cards Actions is a [Voice Experiment](https://experiments.withgoogle.com/voice) that lets you create customized shareable greeting cards from Google Assistant.

![Greeting Cards](https://storage.googleapis.com/prj-greeting-cards-prod.appspot.com/previews/hero.png)

Try it on a Google Assistant or Google Home by saying “Hey Google, talk to Greeting Cards”.

This is an experiment, not an official Google product. We will do our best to support and maintain this experiment but your mileage may vary.

## Technology

Greeting Cards is built on [Actions on Google](https://developers.google.com/actions/), the platform that allows you to make things for the Google Assistant and the Google Home. It uses [Dialogflow](https://dialogflow.com/) to handle understanding what the user says, [Firebase Cloud Functions](https://firebase.google.com/docs/functions/) for backend code, [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore/) to save data, [Cloud Storage for Firebase](https://firebase.google.com/products/storage/) to store the templates and generated cards, and [Firebase Hosting](https://firebase.google.com/docs/hosting/) to host the shareable page. The project is written in JavaScript, using Actions on Google’s [Node.js client library](https://developers.google.com/actions/nodejs-client-library-release-notes).

This repo contains a pre-built Dialogflow Agent you can import into your own project. It contains all the Intents and Entities for Greeting Cards. This is all in the `dialogflow_agent` folder.

Everything in the `functions` folder is used in Firebase Cloud Functions, which hosts the webhook code for Dialogflow as well as the share page entrypoint. The webhook handles all the response logic for Greeting Cards.

The `public` folder contains all the assets that will be hosted by Firebase Hosting once the project is deployed.

The `storage` folder contains all the template files (and font) that are used to render the final cards. The contents of the folder needs to be uploaded to [Cloud Storage for Firebase](https://firebase.google.com/products/storage/) for your project.

### Importing the Dialogflow Agent

Go to the [Actions on Google developer console](https://console.actions.google.com), and create a new project.

Click “BUILD” on the Dialogflow card, and follow the flow to create a new Dialogflow agent.

When your agent is created, click on the gear icon to get to the “Export and Import” tab. You can then compress the `dialogflow_agent` folder from this repo into a zip file, and then import it. You should then see all of 21 Days of Gratitude’s Intents and Entities in your project.

[Here](https://dialogflow.com/docs/getting-started/basics)’s some more info about how Dialogflow works in general.

### Setting up

Install the Firebase CLI

`npm i -g firebase-tools`

On the root project folder, install dependencies

`npm i`

Login to Firebase

`firebase login`

Check list of Firebase projects

`firebase list`

Set Firebase project as default

`firebase use [FIREBASE_PROJECT_ID]`

Customize the "variables" from the npm script `deploy` inside root `package.json`

* `[GCLOUD_PROJECT]` with your `FIREBASE_PROJECT_ID`
* `[SECURITY_HEADER]` with any string you wish to secure your webhook connection.

Deploy to Firebase

`npm run deploy`

### Get your webhook URL and put it in Dialogflow

Once you’ve successfully deployed the project to Firebase, your terminal should give you a url called `Function URL (fulfillmentEntryPoint):`. In Dialogflow, click the “Fulfillment” tab and toggle the “Enable” switch for the webhook. Paste that url into the text field, and add to headers the key `x-security-content` and the value you used to replace `[SECURITY_HEADER]`.

**You can read more documentation about using Firebase Cloud Functions for Dialogflow fulfillment [here](https://dialogflow.com/docs/how-tos/getting-started-fulfillment).**

## Contributors

[Mike Nowak](https://github.com/n0wak),[Santiago D'Antuoni](https://github.com/sdantuoni), [Guillermo Figueroa](https://github.com/gfirem) and [Craig Hill](https://github.com/craighillwood).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.
