const express = require('express');
const path = require('path');
const session = require('express-session'); // added session support
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (secure cookies when using HTTPS)
app.set('trust proxy', 1);
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in prod
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Middleware untuk file statis
app.use(express.static(path.join(__dirname, 'public')));

// Import router utama
const mainRoutes = require('./routes/index');
app.use('/', mainRoutes);

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server E-Learning berjalan di http://localhost:${PORT}`);
});
