const Sender = require('../libs/sender');
const errors = require('../libs/errors');
const handlebars = require('handlebars');

module.exports = () => {
  const sender = Sender();

  return {
    send: (db, to, email, regionId, languageId, content, attachments) => db.email.findOne({
      where: {
        use: email,
        regionId,
        languageId
      }
    }).then((emailTemplate) => {
      if (!emailTemplate) {
        return db.email.findOne({
          where: {
            use: email,
            languageId
          }
        });
      }

      return emailTemplate;
    }).then((emailTemplate) => {
      if (!emailTemplate) {
        return db.email.findOne({
          where: {
            use: email,
            regionId: null
          }
        });
      }

      return emailTemplate;
    }).then((emailTemplate) => {
      if (!emailTemplate) {
        throw new errors.EmailTemplateNotFoundError();
      }
      const html = emailTemplate.content ? handlebars.compile(emailTemplate.content)(content) : undefined;
      const text = emailTemplate.textContent ? handlebars.compile(emailTemplate.textContent)(content) : undefined;
      const subject = emailTemplate.subject ? handlebars.compile(emailTemplate.subject)(content) : undefined;
      const emailFrom = emailTemplate.emailFrom.replace('{{clubName}}', content.clubName || '');

      return sender.send(subject, emailFrom, to, text, html, attachments);
    }),
    sendPreview: ({ subject, from, to, textPlain, textHtml }) =>
      sender.send(subject, from, to, textPlain, textHtml)
  };
};
