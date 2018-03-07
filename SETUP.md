GOTCHAS:

Environment Project

Even though you define the project using `firebase use <prj-name>`, your gcloud cli, and thus functions, project might still be something else. In my case I had an existing project that was conflicting and would cause errors when deploying the function. You might want to set a specific gcloud configuration using `gcloud init` for the new project, and change the project on the functions emulator using `functions config set projectId <prj-name>`. This will require a reboot of the emulator `functions restart`

.env file

.credentials file

Create agent

in dialog

Check what port functions is running on and change that in npm run external script.

As we're using Google A, ensure that the url for webhooks is https.
