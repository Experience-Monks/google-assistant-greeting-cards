'use strict';

module.exports = app => {
  const response = app.buildRichResponse();

  let format = app.getArgument('ImageDisplay');
  if (format === null) {
    format == 'DEFAULT';
  }
  console.warn(format);
  response.addSimpleResponse(format);
  response.addBasicCard(
    app
      .buildBasicCard(format)
      .setImage(
        'https://storage.googleapis.com/prj-bot-greeting-cards-staging.appspot.com/out/4ad0pNjSYo0REpBAy_UIU_SbhamXUHg2tWNNX0EiKWcpsHm8ig_7Jksv8GvV-lZB8mYKAl6cE8AAA2AAg1D32p82/Wz71fVpCMn6riuFXyYp7.jpg',
        'Your card'
      )
      .setImageDisplay(format)
  );

  return app.ask(response);
};
