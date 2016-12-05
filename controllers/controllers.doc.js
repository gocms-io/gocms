/**
 * @apiDefine UserAuthHeader
 * @apiHeader {String} x-auth-token JWT User Token unique token generated for user at login.
 */

/**
 * @apiDefine DeviceAuthHeader
 * @apiHeader {String} x-device-token JWT Device Token unique token generated for device at verification.
 */

/**
 * @apiDefine AuthHeader
 * @apiHeader {String} x-auth-token (required) x-auth-token JWT User Token unique token generated for user at login.
 * @apiHeader {String} x-device-token (two-factor) x-device-token JWT Device Token unique token generated for device at verification.
 */
