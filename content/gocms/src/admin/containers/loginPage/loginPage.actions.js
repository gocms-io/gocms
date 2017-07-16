export const GOCMS_LOGIN = 'GOCMS_LOGIN';

export function gocms_login(key, data) {
    return {
        type: GOCMS_LOGIN,
        key,
        data,
        requestedAt: Date.now()
    }
}