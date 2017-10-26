package permission_model

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
 * @apiDefine AuthHeaderResponse
 * @apiSuccess (Response-Header) {string} x-auth-token
 */

/**
* @apiDefine LoginInput
* @apiParam (Request) {string} email
* @apiParam (Request) {string} password
 */
type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

/**
* @apiDefine UserRegisterInput
* @apiParam (Request) {string} fullName
* @apiParam (Request) {string} email
* @apiParam (Request) {string} password
* @apiParam (Request) {string} [email2]
 */
type UserRegisterInput struct {
	FullName string `json:"fullName,omitempty" binding:"required" `
	Email    string `json:"email,omitempty" binding:"required"`
	Password string `json:"password,omitempty" binding:"required"`
	Email2   string `json:"email2,omitempty"`
}

/**
* @apiDefine ResetPasswordRequestInput
* @apiParam (Request) {string} email
 */
type ResetPasswordRequestInput struct {
	Email string `json:"email" binding:"required"`
}

/**
* @apiDefine ResetPasswordInput
* @apiParam (Request) {string} email
* @apiParam (Request) {string} password
* @apiParam (Request) {string} resetCode
 */
type ResetPasswordInput struct {
	Email     string `json:"email" binding:"required"`
	Password  string `json:"password" binding:"required"`
	ResetCode string `json:"resetCode" binding:"required"`
}
