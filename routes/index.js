const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

// Route untuk homepage / dashboard utama
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/index.html'));
});

// Route untuk detail kelas SIM
router.get('/detail', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/detail.html'));
});

// Route untuk halaman admin (auth dinonaktifkan untuk keperluan dev)
router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/admin.html'));
});
// Route untuk halaman login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/pages/login.html'));
});

router.post('/login', async (req, res) => {
    const { nim, password } = req.body;
    if (!nim || !password) {
        return res.redirect('/login?error=' + encodeURIComponent('NIM dan password harus diisi!'));
    }
    try {
        const users = await db.getUsers();
        const user = users.find(u => u.NIM === nim);
        if (!user) {
            return res.redirect('/login?error=' + encodeURIComponent('NIM tidak terdaftar.'));
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.redirect('/login?error=' + encodeURIComponent('Password salah.'));
        }
        req.session.user = {
            nim: user.NIM,
            role: user.role,
            name: user.name,
            avatar: user.avatar,
            xp: user.xp,
            level: user.level,
            status: user.status
        };
        return res.redirect('/');
    } catch (err) {
        console.error('[AUTH] Login error:', err);
        return res.redirect('/login?error=' + encodeURIComponent('Terjadi kesalahan server, coba lagi.'));
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// API: data user yang sedang login
router.get('/api/me', async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.json({ loggedIn: false });
    }
    try {
        const users = await db.getUsers();
        const user = users.find(u => u.NIM === req.session.user.nim);
        if (!user) return res.json({ loggedIn: false });
        res.json({
            loggedIn: true,
            nim: user.NIM,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            xp: user.xp || 0,
            level: user.level || 'Level 1',
            status: user.status || 'Apprentice'
        });
    } catch (err) {
        res.json({ loggedIn: false });
    }
});
// ==========================================
// API ENDPOINTS FOR DATA INTEGRATION
// ==========================================

// API: Kelas yang diikuti user yang sedang login
router.get('/api/my-classes', async (req, res) => {
    try {
        const nim = req.session && req.session.user ? req.session.user.nim : null;
        const classes = await db.getClasses();
        const enrollments = await db.getEnrollments();

        let myClasses;
        if (nim) {
            // Filter kelas berdasarkan enrollment user
            const enrolledClassIds = enrollments
                .filter(e => e.studentNim === nim)
                .map(e => e.classId);
            myClasses = classes.filter(c => enrolledClassIds.includes(c.id));
        } else {
            // Jika tidak login (mode dev), kembalikan semua kelas
            myClasses = classes;
        }
        res.json(myClasses);
    } catch (err) {
        console.error('[API] /api/my-classes error:', err);
        res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
});

// 1. Get dashboard summary
router.get('/api/dashboard-summary', async (req, res) => {
    try {
        const users = await db.getUsers();
        const classes = await db.getClasses();
        const enrollments = await db.getEnrollments();
        const logs = await db.getLogs();
        
        res.json({
            totalUsers: users.length,
            totalLecturers: users.filter(u => u.role === 'Dosen').length,
            totalStudents: users.filter(u => u.role === 'Mahasiswa').length,
            totalClasses: classes.length,
            totalEnrollments: enrollments.length,
            logs: logs.slice().reverse() // Show latest first
        });
    } catch (err) {
        console.error('Error on /api/dashboard-summary:', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
});

// 2. Get all users
router.get('/api/users', async (req, res) => {
    try {
        const users = await db.getUsers();
        res.json(users);
    } catch (err) {
        console.error('Error on /api/users:', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
});

// 3. Create a new user (Mahasiswa / Dosen)
router.post('/api/users', async (req, res) => {
    try {
        const { name, role, password, nim, email, avatar, frame } = req.body;
        
        if (!name || !role || !password) {
            return res.status(400).json({ error: 'Nama, Peran, dan Password harus diisi!' });
        }
        
        if (role === 'Mahasiswa' && !nim) {
            return res.status(400).json({ error: 'NIM harus diisi untuk peran Mahasiswa!' });
        }
        
        if (role === 'Dosen' && !email) {
            return res.status(400).json({ error: 'Email harus diisi untuk peran Dosen!' });
        }

        // Check duplicate NIM or Email
        const users = await db.getUsers();
        if (role === 'Mahasiswa' && users.some(u => u.NIM === nim)) {
            return res.status(400).json({ error: `NIM ${nim} sudah terdaftar!` });
        }
        if (role === 'Dosen' && users.some(u => u.email === email)) {
            return res.status(400).json({ error: `Email ${email} sudah terdaftar!` });
        }
        
        const defaultAvatar = role === 'Mahasiswa'
            ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'
            : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=60&q=80';
            
        const userData = {
            name,
            role,
            password,
            avatar: avatar || defaultAvatar,
            frame: role === 'Mahasiswa' ? (frame || '') : undefined,
            NIM: role === 'Mahasiswa' ? nim : undefined,
            email: role === 'Dosen' ? email : undefined
        };
        
        const result = await db.createUser(userData);
        res.json({
            success: true,
            user: result.user,
            hash: result.hash
        });
    } catch (err) {
        console.error('Error on POST /api/users:', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
});

// 4. Get all classes
router.get('/api/classes', async (req, res) => {
    try {
        const classes = await db.getClasses();
        res.json(classes);
    } catch (err) {
        console.error('Error on /api/classes:', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
});

// 5. Create a new class
router.post('/api/classes', async (req, res) => {
    try {
        const { name, code, lecturer, semester, type } = req.body;
        
        if (!name || !code || !lecturer) {
            return res.status(400).json({ error: 'Nama Kelas, Kode Kelas, dan Dosen Pengajar harus diisi!' });
        }
        
        const classes = await db.getClasses();
        if (classes.some(c => c.code === code)) {
            return res.status(400).json({ error: `Kode Kelas ${code} sudah digunakan!` });
        }
        
        const classData = {
            name,
            code,
            lecturer,
            semester: semester || 'Semester Genap 2025-2026',
            type: type || 'Wajib'
        };
        
        const newClass = await db.createClass(classData);
        res.json({ success: true, class: newClass });
    } catch (err) {
        console.error('Error on POST /api/classes:', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
});

// 6. Get all enrollments
router.get('/api/enrollments', async (req, res) => {
    try {
        const enrollments = await db.getEnrollments();
        res.json(enrollments);
    } catch (err) {
        console.error('Error on /api/enrollments:', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
});

// 7. Enroll a student to a class
router.post('/api/enroll', async (req, res) => {
    try {
        const { studentNim, classId } = req.body;
        
        if (!studentNim || !classId) {
            return res.status(400).json({ error: 'NIM Mahasiswa dan Kelas harus dipilih!' });
        }
        
        const result = await db.enrollStudent(studentNim, classId);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        
        res.json({ success: true, enrollment: result });
    } catch (err) {
        console.error('Error on POST /api/enroll:', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
});

// 8. Get dynamic participants for a specific class (either class name or class ID)
router.get('/api/class-participants', async (req, res) => {
    try {
        const { className, classId } = req.query;
        if (!className && !classId) {
            return res.status(400).json({ error: 'Parameter className atau classId harus ditentukan!' });
        }
        
        const data = await db.getUsers();
        const classes = await db.getClasses();
        const enrollments = await db.getEnrollments();
        
        // Find target class
        let targetClass = null;
        if (classId) {
            targetClass = classes.find(c => c.id === classId);
        } else {
            targetClass = classes.find(c => c.name === className);
        }
        
        if (!targetClass) {
            return res.json([]);
        }
        
        // Get students enrolled in this class
        const studentNimsInClass = enrollments
            .filter(e => e.classId === targetClass.id)
            .map(e => e.studentNim);
            
        const students = data
            .filter(u => u.role === 'Mahasiswa' && studentNimsInClass.includes(u.NIM))
            .map(student => ({
                name: student.name,
                NIM: student.NIM,
                xp: student.xp || 0,
                level: student.level || 'Level 1',
                status: student.status || 'Apprentice',
                role: student.name === 'Dimas Dwi Budi Sulistio' ? 'Mahasiswa (Anda)' : 'Mahasiswa',
                avatar: student.avatar,
                frame: student.frame || '',
                badges: student.badges || [],
                skills: student.skills || { db: 0, analysis: 0, layout: 0, api: 0, security: 0, vocal: 0 }
            }));
            
        // Sort students by XP descending to assign rankings
        students.sort((a, b) => b.xp - a.xp);
        students.forEach((student, index) => {
            student.rank = index + 1;
        });
        
        res.json(students);
    } catch (err) {
        console.error('Error on /api/class-participants:', err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
});

module.exports = router;
