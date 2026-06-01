/** Сессия считается определённой: можно опираться на role / isAuthenticated. */
export function isAuthSessionReady(
    hasAccessToken: boolean,
    sessionChecked: boolean
): boolean {
    if (!hasAccessToken) {
        return true;
    }

    return sessionChecked;
}