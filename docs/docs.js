//File generated automatically at 2017-03-01 03:30:10.669228691 -0500 EST

/**
 * @apiDefine UserAuthHeader
 * @apiParam (Request-Header) {String} x-auth-token JWT User Token unique token generated for user at login.
 */

/**
 * @apiDefine DeviceAuthHeader
 * @apiParam (Request-Header) {String} x-device-token JWT Device Token unique token generated for device at verification.
 */

/**
 * @apiDefine AuthHeader
 * @apiParam (Request-Header) {String} x-auth-token x-auth-token JWT User Token unique token generated for user at login.
 * @apiParam (Request-Header) {String} [x-device-token] x-device-token JWT Device Token unique token generated for device at verification. *Required when Two-Factor enabled.
 */

/**
* @apiDefine LoginInput
* @apiParam (Request) {string} email
* @apiParam (Request) {string} password
 */

/**
* @apiDefine UserRegisterInput
* @apiParam (Request) {string} fullName
* @apiParam (Request) {string} email
* @apiParam (Request) {string} password
* @apiParam (Request) {string} [email2]
 */

/**
* @apiDefine ResetPasswordRequestInput
* @apiParam (Request) {string} email
 */

/**
* @apiDefine ResetPasswordInput
* @apiParam (Request) {string} email
* @apiParam (Request) {string} password
* @apiParam (Request) {string} resetCode
 */

/**
* @apiDefine EmailDisplay
* @apiSuccess (Response) {number} id
* @apiSuccess (Response) {string} email
* @apiSuccess (Response) {number} verified
* @apiSuccess (Response) {number} isPrimary
 */

/**
* @apiDefine EmailInput
* @apiParam (Request) {string} password The current users password.
* @apiParam (Request) {string} email The new email to add, promote, or delete.
 */

/**
* @apiDefine RequestEmailActivationLink
* @apiParam (Request) {string} email The email to send the activation link to.
 */

/**
* @apiDefine UserDisplay
* @apiSuccess (Response) {number} id
* @apiSuccess (Response) {string} fullName
* @apiSuccess (Response) {string} email
* @apiSuccess (Response) {number} gender 1=male, 2=female
 */

/**
* @apiDefine UserUpdateInput
* @apiParam (Request) {string} fullName
* @apiParam (Request) {number} gender 1=male, 2=female
 */

/**
* @apiDefine UserChangePasswordInput
* @apiParam (Request) {string} password The current users password.
* @apiParam (Request) {string} newPassword
 */

/**
* @apiDefine UserAdminDisplay
* @apiSuccess (Response) {number} id
* @apiSuccess (Response) {string} fullName
* @apiSuccess (Response) {string} email
* @apiSuccess (Response) {number} gender 1=male, 2=female
* @apiSuccess (Response) {boolean} enabled true is the user is enabled
* @apiSuccess (Response) {boolean} verified true is the user has verified their primary email address
* @apiSuccess (Response) {number} minAge
* @apiSuccess (Response) {number} maxAge
* @apiSuccess (Response) {string} created
 */

/**
* @apiDefine Admin Admin User
* User must be logged in and have the role of Admin.
 */

/**
* @api {get} /admin/user/:userId Get User By Id
* @apiDescription Get a user by their Id.
* @apiName GetUserById
* @apiGroup Admin
*
* @apiUse UserAuthHeader
* @apiUse UserDisplay
* @apiPermission Admin
 */

/**
* @api {get} /admin/user Get All Users
* @apiDescription Used to get a list of all users.
* @apiName GetAllUsers
* @apiGroup Admin
*
* @apiUse UserAuthHeader
* @apiUse UserDisplay
* @apiPermission Admin
 */

/**
* @apiDefine Authenticated Authenticated User
* User must be logged in and authenticated.
 */

/**
* @api {post} /login Login
* @apiName Login
* @apiGroup Authentication
*
* @apiUse LoginInput
* @apiUse UserDisplay
* @apiSuccess (Response-Header) {string} x-auth-token
 */

/**
* @api {post} /login/facebook Login - Facebook
* @apiName LoginFacebook
* @apiGroup Authentication
*
* @apiParam (Request-Header) {String} x-facebook-token Facebook Authorization Token generated from facebook sdk in app.
*
* @apiUse UserDisplay
*
* @apiSuccess (Response-Header) {string} x-auth-token
 */

/**
* @api {post} /login/google Login - Google
* @apiName LoginGoogle
* @apiGroup Authentication
*
* @apiParam (Request-Header) {String} x-google-token Google Authorization Token generated from google sdk in app.
*
* @apiUse UserDisplay
*
* @apiSuccess (Response-Header) {string} x-auth-token
 */

/**
* @api {post} /register Register
* @apiName Register
* @apiGroup Authentication
*
* @apiUse UserRegisterInput
*
* @apiUse UserDisplay
 */

/**
* @api {post} /reset-password Reset Password (Request)
* @apiName ResetPassword
* @apiGroup Authentication
*
* @apiUse ResetPasswordRequestInput
 */

/**
* @api {put} /reset-password Reset Password (Verify/Set)
* @apiName SetResetPassword
* @apiGroup Authentication
*
* @apiUse ResetPasswordInput
 */

/**
* @api {get} /healthy Service Health Status
* @apiDescription Used to verify that the services are up and running.
* @apiName GetHealthy
* @apiGroup Utility
 */

/**
* @api {get} /verify Verify User
* @apiDescription Used to verify that the user is authenticated.
* @apiName VerifyUser
* @apiGroup Authentication
*
* @apiUse UserAuthHeader
* @apiUse UserDisplay
* @apiPermission Authenticated
 */

/**
* @api {post} /user/email/activate Request New Email Activation Link
* @apiName ActivateEmail
* @apiGroup User
* @apiUse RequestEmailActivationLink
* @apiDescription Request a new activation link for a registered email.
 */

/**
* @api {get} /user/email/activate Activate Email
* @apiName ActivateEmail
* @apiGroup User
* @apiDescription This endpoint requires two url params &email and &code. Links are auto generated for this endpoint by the system. This will likely never be called diructly from an app.
 */

/**
* @api {post} /user/email Add Email
* @apiName AddEmail
* @apiGroup User
*
* @apiUse AuthHeader
* @apiUse EmailInput
* @apiUse EmailDisplay
* @apiPermission Authenticated
 */

/**
* @api {put} /user/email/promote Promote Email
* @apiName PromoteEmail
* @apiGroup User
* @apiUse EmailInput
* @apiUse AuthHeader
* @apiPermission Authenticated
 */

/**
* @api {delete} /user/email Delete Email
* @apiName DeleteEmail
* @apiGroup User
*
* @apiUse AuthHeader
* @apiUse EmailInput
* @apiPermission Authenticated
 */

/**
* @api {get} /user/email Get Emails
* @apiName GetEmails
* @apiGroup User
*
* @apiUse AuthHeader
* @apiUse EmailDisplay
* @apiPermission Authenticated
 */

/**
* @api {get} /user Get Profile
* @apiName GetUser
* @apiGroup User
*
* @apiUse AuthHeader
* @apiUse UserDisplay
* @apiPermission Authenticated
 */

/**
* @api {put} /user Update Profile
* @apiName UpdateUser
* @apiGroup User
*
* @apiUse AuthHeader
* @apiUse UserUpdateInput
* @apiPermission Authenticated
 */

/**
* @api {put} /user/changePassword Change Password
* @apiName ChangePassword
* @apiGroup User
*
* @apiUse AuthHeader
* @apiUse UserChangePasswordInput
* @apiPermission Authenticated`
 */