const router = require('express').Router();
const auth = require('../../../../auth/passportBearer');

router.use(auth.passport.initialize());

const Bearer = auth.passport.bearer;

/**
@api {get} /user Get
@apiHeader {String} Authorization=Bearer Users unique access-key.

@apiGroup User
@apiDescription Get info about authorized user

@apiSuccessExample {json} Success
HTTP/1.1 200 OK
{
  "id": 1,
  "name": "admin",
  "email": "admin@mail.com",
  "phone": "+420-241-142-124",
  "firstName": "Mr. Admin",
  "lastName": "Adminuv"
}

@apiUse Unauthorized
@apiUse NotFound
*/
router.get('/', Bearer, require('./get'));

/**
@api {post} /user/signUp SignUp
@apiDescription New user registration
@apiGroup User

@apiParam {String} name display name of user
@apiParam {String} email E-mail
@apiParam {String} phone Phone number
@apiParam {String} firstName First name
@apiParam {String} lastName Last name
@apiParam {String} password Password

@apiSuccessExample {json} Success
HTTP/1.1 200 OK
{
  "tokenType": "Bearer",
  "accessToken": "b3f2dacb-d0d9-4b11-9fd4-475f4cd9f8df",
  "expires": "2017-07-11T13:00:22.611Z"
}
@apiError BadRequest
 */
router.post('/signUp', require('./signUp'));

/**
@api {post} /user/signIn SignIn
@apiHeader {String} Authorization=Bearer Users unique access-key.

@apiGroup User
@apiDescription User authorization

@apiParam {String} email E-mail
@apiParam {String} password Password

@apiSuccessExample {json} Success
HTTP/1.1 200 OK
{
  "tokenType": "Bearer",
  "accessToken": "b3f2dacb-d0d9-4b11-9fd4-475f4cd9f8df",
  "expires": "2017-07-11T13:00:22.611Z"
}
@apiError BadRequest
@apiUse Unauthorized
 */
router.post('/signIn', require('./signIn'));

/**
@api {post} /updateInfo Update user info
@apiHeader {String} Authorization=Bearer Users unique access-key.

@apiGroup User
@apiDescription Update info of authorized user

@apiParam {String} name display name of user
@apiParam {String} phone Phone number
@apiParam {String} firstName First name
@apiParam {String} lastName Last name

@apiSuccessExample {json} Success
HTTP/1.1 200 OK
{
  "id": 1,
  "name": "admin",
  "email": "admin@mail.com",
  "phone": "+420-241-142-124",
  "firstName": "Mr. Admin",
  "lastName": "Adminuv"
}

@apiUse Unauthorized
@apiUse NotFound
*/
router.post('/updateInfo', Bearer, require('./updateInfo'));

/**
@api {delete} / Remove
@apiHeader {String} Authorization=Bearer Users unique access-key.

@apiGroup User
@apiDescription Delete the authorized user

@apiSuccessExample {json} Success
HTTP/1.1 204 OK

@apiError NotFound
@apiError BadRequest
*/
router.delete('/', Bearer, require('./delete'));

module.exports = router;
