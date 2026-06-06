module.exports = {
    // Middleware to protect routes that require authentication
    ensureAuthenticated: (req, res, next) => {
        if (req.session && req.session.user) {
            return next();
        }
        // Not logged in – redirect to login page
        return res.redirect('/login');
    }
};
