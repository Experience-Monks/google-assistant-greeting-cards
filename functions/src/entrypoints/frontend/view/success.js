'use strict';

const utils = require('../utils');

module.exports = (url, card) => {
  const twitterUrl = utils.makeTwitter(url);
  const facebookUrl = utils.makeFaceBook(url);
  const mailSubject = 'Your friend sent you this greeting card! Enjoy.';
  const mailBody = `<a href="${url}">${url}</a> Want to make your own card? Use Google Home or the Google Assistant app and say “Talk to Greeting Cards” `;
  const mailUrl = utils.makeEmail(mailBody, mailSubject);

  return `
    <div class="main">

      <div class="img-container">
        <img src="${
          card.url
        }" style="width:90%;margin-bottom:4rem;max-width:1200px;max-height:85vh;box-shadow: 0 20px 20px rgba(0,0,0,0.2)">
      </div>
      <br/>

      <div class="usersaid-container">
        <p>${card.message}</p>
      </div>

      <br/>
      <div class="share-container">
        <a target="_blank" href="${facebookUrl}"><img src="https://${
    process.env.GCLOUD_PROJECT
  }.firebaseapp.com/assets/images/icons/facebook.png"></a>
        <a target="_blank" href="${twitterUrl}"><img src="https://${
    process.env.GCLOUD_PROJECT
  }.firebaseapp.com/assets/images/icons/twitter.png"></a>
        <a target="_blank" href="${mailUrl}"><img src="https://${
    process.env.GCLOUD_PROJECT
  }.firebaseapp.com/assets/images/icons/email.png"></a>
      </div>
    </div>

    <style>
      body {
        background-color: #FFF6EA;
      }

      .bonsai-box {
        width: 289px;
        height: 95px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .usersaid-container {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 18px;
      }

      .share-container {
        width: 190px;
      }

      .share-container a:nth-child(2) {
        transform: translateX(4px);
      }

      .share-container a {
        text-align: center;
      }

      .box-content {
        text-align: center;
        display: block !important;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      }

      .box-content p {
        padding: 5px;
      }

      .day-text {
        font-size: 32px;
      }

      .day {
        padding-top: 10px;
      }

      .main * {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;
        position: relative;
        left: 0; right: 0;
        color: #4B465C;
      }
    </style>
`;
};
