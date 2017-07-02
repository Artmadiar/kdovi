const nodemailer = require('nodemailer');
const sesnodemailer = require('nodemailer-ses-transport');

module.exports = () => {
  const options = {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_KEY,
    region: process.env.AWS_REGION,
    rateLimit: 10
  };
  const transport = nodemailer.createTransport(sesnodemailer(options));

  return {
    send: (subject, from, to, text, html, attachments) =>
      new Promise((resolve, reject) => {
        const opts = { subject, from, to, text, html, attachments };

        transport.sendMail(opts, (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        });
      })
  };
};
