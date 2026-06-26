function checkForAuthenticationCookie(cookieName = "token") {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies?.cookieName || req.cookies?.[cookieName];

        if (!tokenCookieValue) {
            req.user = null;
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            req.user = null;
        }

        next();
    };
}