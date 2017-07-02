const router = require('express').Router();

/**
 @api {get} /page/ Get
 @apiDiscription Get page by regionExtermalId, languageId and url
 @apiGroup Page
 @apiParam {String} _regionExternalId
 @apiParam {Number} _languageId
 @apiParam {Number} _url
 */
router.get('/', require('./get'));

module.exports = router;
