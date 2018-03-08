# Greeting Cards for Google Assistant

Gratitude Garden an experiment for Google Experiments Assistant.

# Get Started

## Installation

* Clone the repo `git clone https://github.com/Jam3/prj-bot-greeting-cards.git`
* `cd prj-bot-greeting-cards/`
* Install Firebase tools `npm install -g firebase-tools`
* run `npm i`
* Login to FireBase `firebase login`
* Emulate functions local `npm install -g @google-cloud/functions-emulator`
* Select the project on firebase `firebase use dev`

## Important commands

* Run local `npm run local`
* Run ngrock `npm run external`
* Run the test `npm run test`
* Start functions emulator `functions start`
* Stop functions emulator `functions stop`
* Reset functions emulator `functions restart`
* List functions in emulator `functions list`
* Reset specific function `functions reset <function_name>`
* `functions deploy shareCard --local-path functions --trigger-http`

## Environments & Deployment

We use 3 environment, Development, Staging and Production. They are available in **DialogFlow** and **Google Projects**

## Accounts

* [Actions on Google](https://console.actions.google.com)
* [DialogFlow](https://console.dialogflow.com)
* [Firebase](https://console.firebase.google.com)
* [CodeShip](https://app.codeship.com/projects/263208)
* [Function Emulator](https://github.com/GoogleCloudPlatform/cloud-functions-emulator)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Jam3/prj-bot-gratitude-garden.git).

## Authors

* **Craig Hill** - _Developer_ - @craig - craig.hillwood@jam3.com
* **Santiago D'Antuoni** - _Developer_ - @Santiago - santiago.dantuoni@jam3.com
* **Guillermo Figueroa** - _Developer_ - @gfirem - guillermo.figueroa@jam3.com
* **Mike Nowak** - _Developer_ - @n0wak - mike.nowak@jam3.com
  See also the list of [contributors](https://github.com/Jam3/prj-bot-gratitude-garden.git/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
