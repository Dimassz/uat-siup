module.exports = {
    // Middleware to protect routes that require authentication
    ensureAuthenticated: (req, res, next) => {
        if (req.session && req.session.user) {
            return next();
        }
        // Not logged in – redirect to login page
        return res.redirect('/login');
    },

    // Middleware: hanya Mahasiswa yang boleh akses
    ensureMahasiswa: (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.redirect('/login');
        }
        if (req.session.user.role === 'Dosen') {
            return res.redirect('/lecturer');
        }
        return next();
    },

    // Middleware: hanya Dosen yang boleh akses
    ensureDosen: (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.redirect('/login');
        }
        if (req.session.user.role !== 'Dosen') {
            return res.redirect('/');
        }
        return next();
    },

    // Middleware: redirect user yang sudah login ke dashboard sesuai role
    redirectIfLoggedIn: (req, res, next) => {
        if (req.session && req.session.user) {
            if (req.session.user.role === 'Dosen') {
                return res.redirect('/lecturer');
            }
            return res.redirect('/');
        }
        return next();
    }
};
