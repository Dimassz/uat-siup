const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

const dbDir = path.join(__dirname, 'data');
const dbPath = path.join(dbDir, 'db.json');

// Pastikan direktori data ada
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Data awal (Seed) jika database belum terisi
const defaultStudents = [
    { name: 'Rangga Wijaya', NIM: '10201210001', rank: 1, xp: 980, level: 'Level 5', status: 'SIM Master', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=60&q=80', frame: 'avatar-frame-gold-decorated', badges: ['database', 'analyst', 'vocal', 'style', 'api'], skills: { db: 100, analysis: 95, layout: 80, api: 85, security: 0, vocal: 100 }, password: bcrypt.hashSync('rangga123', 10) },
    { name: 'Aurelia Putri', NIM: '10201210002', rank: 2, xp: 950, level: 'Level 5', status: 'SIM Specialist', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80', frame: 'avatar-frame-silver-decorated', badges: ['database', 'analyst', 'vocal', 'style'], skills: { db: 90, analysis: 90, layout: 100, api: 0, security: 0, vocal: 90 }, password: bcrypt.hashSync('aurelia123', 10) },
    { name: 'Bobby Kertanegara', NIM: '10201210003', rank: 3, xp: 910, level: 'Level 5', status: 'SIM Specialist', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80', frame: 'avatar-frame-bronze-decorated', badges: ['database', 'analyst', 'vocal', 'api'], skills: { db: 85, analysis: 85, layout: 0, api: 90, security: 0, vocal: 90 }, password: bcrypt.hashSync('bobby123', 10) },
    { name: 'Clarissa Amanda', NIM: '10201210004', rank: 4, xp: 840, level: 'Level 4', status: 'SIM Senior', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=60&q=80', frame: '', badges: ['database', 'analyst', 'vocal'], skills: { db: 80, analysis: 85, layout: 0, api: 0, security: 0, vocal: 95 }, password: bcrypt.hashSync('clarissa123', 10) },
    { name: 'Farhan Ramadhan', NIM: '10201210005', rank: 5, xp: 780, level: 'Level 4', status: 'SIM Senior', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=60&q=80', frame: '', badges: ['database', 'analyst'], skills: { db: 80, analysis: 80, layout: 0, api: 0, security: 0, vocal: 0 }, password: bcrypt.hashSync('farhan123', 10) },
    { name: 'Kevin Sanjaya', NIM: '10201210006', rank: 6, xp: 720, level: 'Level 4', status: 'SIM Senior', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=60&q=80', frame: '', badges: ['database', 'vocal'], skills: { db: 70, analysis: 0, layout: 0, api: 0, security: 0, vocal: 95 }, password: bcrypt.hashSync('kevin123', 10) },
    { name: 'Dimas Dwi Budi Sulistio', NIM: '10201210007', rank: 7, xp: 650, level: 'Level 4', status: 'SIM Apprentice', role: 'Mahasiswa (Anda)', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=60&q=80', frame: 'avatar-frame-purple-glow-decorated', badges: ['database', 'analyst', 'vocal'], skills: { db: 90, analysis: 85, layout: 0, api: 0, security: 0, vocal: 90 }, password: bcrypt.hashSync('dimas123', 10) },
    { name: 'Siti Rahma', NIM: '10201210008', rank: 8, xp: 590, level: 'Level 3', status: 'SIM Junior', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=60&q=80', frame: '', badges: ['database'], skills: { db: 75, analysis: 0, layout: 0, api: 0, security: 0, vocal: 0 }, password: bcrypt.hashSync('siti123', 10) }
];

const defaultLecturers = [
    { name: 'Prof. Hermawan Kartajaya', email: 'hermawan@universitaspertamina.ac.id', role: 'Dosen', password: bcrypt.hashSync('dosen123', 10), avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=60&q=80' },
    { name: 'Sarah Wijaya, M.Si.', email: 'sarah.wijaya@universitaspertamina.ac.id', role: 'Dosen', password: bcrypt.hashSync('dosen123', 10), avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=60&q=80' },
    { name: 'Jafar Shadiq, M.Cs.', email: 'jafar.shadiq@universitaspertamina.ac.id', role: 'Dosen', password: bcrypt.hashSync('dosen123', 10), avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=60&q=80' },
    { name: 'Dr. Irwan Prasetyo, M.E.', email: 'irwan.prasetyo@universitaspertamina.ac.id', role: 'Dosen', password: bcrypt.hashSync('dosen123', 10), avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=60&q=80' },
    { name: 'Alice Smith, M.Hum.', email: 'alice.smith@universitaspertamina.ac.id', role: 'Dosen', password: bcrypt.hashSync('dosen123', 10), avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=60&q=80' }
];

const defaultClasses = [
    { id: 'LPK-MN8-2025', name: 'Lembaga dan Pasar Keuangan-MN8-2025', code: 'LPK-101', lecturer: 'Prof. Hermawan Kartajaya', semester: 'Semester Genap 2025-2026', progressPercent: 0, completedCount: 0, totalQuests: 4, type: 'Wajib' },
    { id: 'PAJAK-MN8A-2025', name: 'Perpajakan-MN8A-2025', code: 'PJK-202', lecturer: 'Sarah Wijaya, M.Si.', semester: 'Semester Genap 2025-2026', progressPercent: 50, completedCount: 1, totalQuests: 2, type: 'Wajib' },
    { id: 'SIM-MN8-2025', name: 'Sistem Informasi Manajemen-MN8-2025', code: 'SIM-303', lecturer: 'Jafar Shadiq, M.Cs.', semester: 'Semester Genap 2025-2026', progressPercent: 60, completedCount: 3, totalQuests: 5, type: 'Wajib' },
    { id: 'FINTECH-MN8-2025', name: 'Teknologi Keuangan (Financial Technology)-MN8-2025', code: 'FIN-404', lecturer: 'Dr. Irwan Prasetyo, M.E.', semester: 'Semester Genap 2025-2026', progressPercent: 25, completedCount: 1, totalQuests: 4, type: 'Pilihan' },
    { id: 'ENG-II-2025', name: 'PRAKTIKUM BAHASA INGGRIS II', code: 'ENG-202', lecturer: 'Alice Smith, M.Hum.', semester: 'Semester Genap 2025-2026', progressPercent: 0, completedCount: 0, totalQuests: 3, type: 'Wajib' }
];

// Seed enrollments: Semua mahasiswa didaftarkan di 'Sistem Informasi Manajemen-MN8-2025' sebagai default
const defaultEnrollments = defaultStudents.map(student => ({
    studentNim: student.NIM,
    classId: 'SIM-MN8-2025'
})).concat([
    // Daftarkan beberapa ke kelas lain agar variatif
    { studentNim: '10201210001', classId: 'LPK-MN8-2025' },
    { studentNim: '10201210002', classId: 'LPK-MN8-2025' },
    { studentNim: '10201210001', classId: 'PAJAK-MN8A-2025' },
    { studentNim: '10201210002', classId: 'PAJAK-MN8A-2025' },
    { studentNim: '10201210003', classId: 'PAJAK-MN8A-2025' },
    { studentNim: '10201210001', classId: 'FINTECH-MN8-2025' },
    { studentNim: '10201210003', classId: 'FINTECH-MN8-2025' },
    { studentNim: '10201210001', classId: 'ENG-II-2025' },
    { studentNim: '10201210003', classId: 'ENG-II-2025' },
    { studentNim: '10201210007', classId: 'ENG-II-2025' }
]);

const initialDb = {
    users: [...defaultStudents, ...defaultLecturers],
    classes: defaultClasses,
    enrollments: defaultEnrollments,
    logs: [
        { id: 1, action: 'Sistem Terbuka', detail: 'Inisialisasi database awal dengan seed data.', timestamp: new Date().toISOString() }
    ]
};

// Tulis basis data awal file lokal jika belum ada
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2), 'utf-8');
    console.log('[DATABASE] Database file lokal baru diinisialisasi di data/db.json');
}

// Fungsi bantu sinkron membaca JSON
function readDb() {
    try {
        const data = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('[DATABASE] Gagal membaca database file lokal, menggunakan memori default', err);
        return initialDb;
    }
}

// Fungsi bantu sinkron menulis JSON
function writeDb(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        console.error('[DATABASE] Gagal menulis ke database file lokal', err);
    }
}

// ==========================================
// POSTGRES / SUPABASE SETUP
// ==========================================
let pool = null;
let usePg = false;
let isInitialized = false;

if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    try {
        const connectionString = process.env.DATABASE_URL.trim();
        pool = new Pool({
            connectionString: connectionString,
            ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1') ? false : { rejectUnauthorized: false }
        });
        usePg = true;
        console.log('[DATABASE] Mencoba konfigurasi koneksi PostgreSQL Supabase...');
        
        // Cek koneksi secara proaktif saat startup
        pool.connect()
            .then(client => {
                console.log('[DATABASE] Koneksi Berhasil! Terhubung langsung ke PostgreSQL Supabase.');
                client.release();
                // Jalankan inisialisasi tabel secara proaktif
                checkAndInitPg().catch(err => {
                    console.error('[DATABASE] Gagal migrasi database Supabase:', err.message);
                });
            })
            .catch(err => {
                console.error('[DATABASE] Gagal koneksi ke Supabase:', err.message);
                console.log('[DATABASE] Beralih otomatis ke fallback basis data file lokal (data/db.json).');
                usePg = false;
            });
            
    } catch (err) {
        console.error('[DATABASE] Gagal konfigurasi Pool PostgreSQL:', err.message);
        usePg = false;
    }
} else {
    console.log('[DATABASE] DATABASE_URL kosong. Menggunakan basis data file lokal (data/db.json).');
}

// Mapping database rows ke JavaScript object format
function mapUserToJs(row) {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        NIM: row.nim,
        email: row.email,
        role: row.role,
        password: row.password,
        avatar: row.avatar,
        frame: row.frame || '',
        rank: row.rank,
        xp: row.xp,
        level: row.level,
        status: row.status,
        badges: row.badges || [],
        skills: typeof row.skills === 'string' ? JSON.parse(row.skills) : (row.skills || {})
    };
}

function mapClassToJs(row) {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        code: row.code,
        lecturer: row.lecturer,
        semester: row.semester,
        progressPercent: row.progress_percent,
        completedCount: row.completed_count,
        totalQuests: row.total_quests,
        type: row.type
    };
}

function mapEnrollmentToJs(row) {
    if (!row) return null;
    return {
        studentNim: row.student_nim,
        classId: row.class_id
    };
}

function mapLogToJs(row) {
    if (!row) return null;
    return {
        id: row.id,
        action: row.action,
        detail: row.detail,
        timestamp: row.timestamp
    };
}

// Inisialisasi Tabel & Seeding di PostgreSQL
async function seedDatabase() {
    console.log('[DATABASE] Seeding data awal ke database Supabase...');
    try {
        // Seed users
        for (const u of initialDb.users) {
            await pool.query(
                `INSERT INTO sim_users (name, nim, email, password, role, avatar, frame, rank, xp, level, status, badges, skills) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                 ON CONFLICT (nim) DO NOTHING`,
                [
                    u.name, 
                    u.NIM || null, 
                    u.email || null, 
                    u.password, 
                    u.role, 
                    u.avatar || null, 
                    u.frame || '', 
                    u.rank || null, 
                    u.xp !== undefined ? u.xp : (u.role === 'Mahasiswa' ? 0 : null), 
                    u.level || (u.role === 'Mahasiswa' ? 'Level 1' : null), 
                    u.status || (u.role === 'Mahasiswa' ? 'Apprentice' : null), 
                    u.badges || [], 
                    u.skills || null
                ]
            );
        }
        
        // Seed classes
        for (const c of initialDb.classes) {
            await pool.query(
                `INSERT INTO sim_classes (id, name, code, lecturer, semester, progress_percent, completed_count, total_quests, type) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 ON CONFLICT (id) DO NOTHING`,
                [c.id, c.name, c.code, c.lecturer, c.semester, c.progressPercent, c.completedCount, c.totalQuests, c.type]
            );
        }
        
        // Seed enrollments
        for (const e of initialDb.enrollments) {
            await pool.query(
                `INSERT INTO sim_enrollments (student_nim, class_id) 
                 VALUES ($1, $2)
                 ON CONFLICT (student_nim, class_id) DO NOTHING`,
                [e.studentNim, e.classId]
            );
        }
        
        // Seed logs
        for (const l of initialDb.logs) {
            await pool.query(
                `INSERT INTO sim_logs (id, action, detail, timestamp) 
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (id) DO NOTHING`,
                [l.id, l.action, l.detail, l.timestamp]
            );
        }
        // Sinkronkan sequence ID log
        await pool.query(`SELECT setval('sim_logs_id_seq', COALESCE((SELECT MAX(id)+1 FROM sim_logs), 1), false)`);
        console.log('[DATABASE] Seeding data awal Supabase berhasil selesai.');
    } catch (err) {
        console.error('[DATABASE] Gagal seeding database Supabase:', err.message);
        throw err;
    }
}

async function checkAndInitPg() {
    if (!usePg) return false;
    if (isInitialized) return true;
    
    try {
        // Cek koneksi sederhana
        const client = await pool.connect();
        client.release();
        
        // Migrasi Tabel dengan nama prefixed (sim_*)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sim_users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                nim VARCHAR(50) UNIQUE,
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                avatar VARCHAR(255),
                frame VARCHAR(100) DEFAULT '',
                rank INTEGER,
                xp INTEGER DEFAULT 0,
                level VARCHAR(50) DEFAULT 'Level 1',
                status VARCHAR(100) DEFAULT 'Apprentice',
                badges TEXT[] DEFAULT '{}',
                skills JSONB DEFAULT '{"db": 0, "analysis": 0, "layout": 0, "api": 0, "security": 0, "vocal": 0}'
            );
            
            CREATE TABLE IF NOT EXISTS sim_classes (
                id VARCHAR(100) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                code VARCHAR(50) UNIQUE NOT NULL,
                lecturer VARCHAR(255) NOT NULL,
                semester VARCHAR(255) NOT NULL,
                progress_percent INTEGER DEFAULT 0,
                completed_count INTEGER DEFAULT 0,
                total_quests INTEGER DEFAULT 1,
                type VARCHAR(50) DEFAULT 'Wajib'
            );
            
            CREATE TABLE IF NOT EXISTS sim_enrollments (
                student_nim VARCHAR(50) NOT NULL,
                class_id VARCHAR(100) NOT NULL,
                PRIMARY KEY (student_nim, class_id)
            );
            
            CREATE TABLE IF NOT EXISTS sim_logs (
                id SERIAL PRIMARY KEY,
                action VARCHAR(255) NOT NULL,
                detail TEXT NOT NULL,
                timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        // Periksa apakah data kosong
        const userCountRes = await pool.query('SELECT COUNT(*) FROM sim_users');
        if (parseInt(userCountRes.rows[0].count) === 0) {
            await seedDatabase();
        } else {
            // Sinkronkan sequence ID log agar tidak terjadi error duplicate key
            await pool.query(`SELECT setval('sim_logs_id_seq', COALESCE((SELECT MAX(id)+1 FROM sim_logs), 1), false)`);
        }
        
        isInitialized = true;
        console.log('[DATABASE] Terhubung langsung ke database PostgreSQL Supabase (dengan tabel sim_*).');
        return true;
    } catch (err) {
        console.error('[DATABASE] Gagal terhubung/inisialisasi Supabase Postgres:', err.message);
        console.log('[DATABASE] Beralih otomatis ke fallback basis data file lokal (data/db.json).');
        usePg = false;
        return false;
    }
}

// Wrapper Helper untuk Asynchronous Execution & Fallback
async function executeQuery(pgQueryFn, jsonFallbackFn) {
    if (usePg) {
        try {
            const ok = await checkAndInitPg();
            if (ok) {
                return await pgQueryFn();
            }
        } catch (err) {
            console.error('[DATABASE] Query PostgreSQL gagal. Menggunakan fallback basis data file lokal:', err.message);
        }
    }
    return jsonFallbackFn();
}

const db = {
    // Pengguna
    getUsers: () => {
        return executeQuery(
            async () => {
                const res = await pool.query('SELECT * FROM sim_users ORDER BY role DESC, xp DESC, id ASC');
                return res.rows.map(mapUserToJs);
            },
            () => {
                return readDb().users;
            }
        );
    },
    
    createUser: (userData) => {
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(userData.password, salt);
        
        return executeQuery(
            async () => {
                let rank = null;
                if (userData.role === 'Mahasiswa') {
                    const countRes = await pool.query("SELECT COUNT(*) FROM sim_users WHERE role = 'Mahasiswa'");
                    rank = parseInt(countRes.rows[0].count) + 1;
                }
                const xp = userData.role === 'Mahasiswa' ? 0 : null;
                const level = userData.role === 'Mahasiswa' ? 'Level 1' : null;
                const status = userData.role === 'Mahasiswa' ? 'Apprentice' : null;
                const badges = userData.role === 'Mahasiswa' ? [] : null;
                const skills = userData.role === 'Mahasiswa' ? { db: 0, analysis: 0, layout: 0, api: 0, security: 0, vocal: 0 } : null;
                
                const res = await pool.query(
                    `INSERT INTO sim_users (name, nim, email, password, role, avatar, frame, rank, xp, level, status, badges, skills)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                     RETURNING *`,
                    [
                        userData.name,
                        userData.NIM || null,
                        userData.email || null,
                        passwordHash,
                        userData.role,
                        userData.avatar || null,
                        userData.frame || '',
                        rank,
                        xp,
                        level,
                        status,
                        badges,
                        skills
                    ]
                );
                
                const newUser = mapUserToJs(res.rows[0]);
                
                // Catat Log
                await pool.query(
                    `INSERT INTO sim_logs (action, detail)
                     VALUES ($1, $2)`,
                    [
                        `Buat Akun (${userData.role})`,
                        `User ${userData.name} dibuat. Password di-hash menggunakan bcryptjs. Hash: ${passwordHash.substring(0, 15)}...`
                    ]
                );
                
                return { user: newUser, hash: passwordHash };
            },
            () => {
                const data = readDb();
                const newUser = {
                    ...userData,
                    password: passwordHash,
                    rank: userData.role === 'Mahasiswa' ? data.users.filter(u => u.role === 'Mahasiswa').length + 1 : undefined,
                    xp: userData.role === 'Mahasiswa' ? 0 : undefined,
                    level: userData.role === 'Mahasiswa' ? 'Level 1' : undefined,
                    status: userData.role === 'Mahasiswa' ? 'Apprentice' : undefined,
                    badges: userData.role === 'Mahasiswa' ? [] : undefined,
                    skills: userData.role === 'Mahasiswa' ? { db: 0, analysis: 0, layout: 0, api: 0, security: 0, vocal: 0 } : undefined
                };
                
                data.users.push(newUser);
                
                const logId = data.logs.length + 1;
                data.logs.push({
                    id: logId,
                    action: `Buat Akun (${userData.role})`,
                    detail: `User ${userData.name} dibuat. Password di-hash menggunakan bcryptjs. Hash: ${passwordHash.substring(0, 15)}...`,
                    timestamp: new Date().toISOString()
                });
                
                writeDb(data);
                return { user: newUser, hash: passwordHash };
            }
        );
    },
    
    // Kelas
    getClasses: () => {
        return executeQuery(
            async () => {
                const res = await pool.query('SELECT * FROM sim_classes ORDER BY name ASC');
                return res.rows.map(mapClassToJs);
            },
            () => {
                return readDb().classes;
            }
        );
    },
    
    createClass: (classData) => {
        const id = classData.name.replace(/\s+/g, '-').toUpperCase();
        
        return executeQuery(
            async () => {
                const res = await pool.query(
                    `INSERT INTO sim_classes (id, name, code, lecturer, semester, progress_percent, completed_count, total_quests, type)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                     RETURNING *`,
                    [
                        id,
                        classData.name,
                        classData.code,
                        classData.lecturer,
                        classData.semester || 'Semester Genap 2025-2026',
                        0,
                        0,
                        1,
                        classData.type || 'Wajib'
                    ]
                );
                const newClass = mapClassToJs(res.rows[0]);
                
                await pool.query(
                    `INSERT INTO sim_logs (action, detail)
                     VALUES ($1, $2)`,
                    [
                        'Buat Kelas',
                        `Kelas baru '${classData.name}' (${classData.code}) dengan pengajar ${classData.lecturer} telah dibuat.`
                    ]
                );
                
                return newClass;
            },
            () => {
                const data = readDb();
                const newClass = {
                    id: id,
                    ...classData,
                    progressPercent: 0,
                    completedCount: 0,
                    totalQuests: 1
                };
                data.classes.push(newClass);
                
                const logId = data.logs.length + 1;
                data.logs.push({
                    id: logId,
                    action: 'Buat Kelas',
                    detail: `Kelas baru '${classData.name}' (${classData.code}) dengan pengajar ${classData.lecturer} telah dibuat.`,
                    timestamp: new Date().toISOString()
                });
                
                writeDb(data);
                return newClass;
            }
        );
    },
    
    // Pendaftaran
    getEnrollments: () => {
        return executeQuery(
            async () => {
                const res = await pool.query('SELECT * FROM sim_enrollments');
                return res.rows.map(mapEnrollmentToJs);
            },
            () => {
                return readDb().enrollments;
            }
        );
    },
    
    enrollStudent: (studentNim, classId) => {
        return executeQuery(
            async () => {
                // Cek duplikasi
                const checkRes = await pool.query('SELECT 1 FROM sim_enrollments WHERE student_nim = $1 AND class_id = $2', [studentNim, classId]);
                if (checkRes.rows.length > 0) {
                    return { error: 'Mahasiswa sudah terdaftar di kelas ini!' };
                }
                
                await pool.query('INSERT INTO sim_enrollments (student_nim, class_id) VALUES ($1, $2)', [studentNim, classId]);
                
                const studentRes = await pool.query('SELECT name FROM sim_users WHERE nim = $1', [studentNim]);
                const classRes = await pool.query('SELECT name FROM sim_classes WHERE id = $1', [classId]);
                const studentName = studentRes.rows[0] ? studentRes.rows[0].name : studentNim;
                const className = classRes.rows[0] ? classRes.rows[0].name : classId;
                
                await pool.query(
                    `INSERT INTO sim_logs (action, detail)
                     VALUES ($1, $2)`,
                    [
                        'Pendaftaran Mahasiswa',
                        `Mahasiswa ${studentName} dimasukkan ke kelas ${className}.`
                    ]
                );
                
                return { studentNim, classId };
            },
            () => {
                const data = readDb();
                const isEnrolled = data.enrollments.some(e => e.studentNim === studentNim && e.classId === classId);
                if (isEnrolled) {
                    return { error: 'Mahasiswa sudah terdaftar di kelas ini!' };
                }
                
                const newEnrollment = { studentNim, classId };
                data.enrollments.push(newEnrollment);
                
                const student = data.users.find(u => u.NIM === studentNim);
                const targetClass = data.classes.find(c => c.id === classId);
                
                const logId = data.logs.length + 1;
                data.logs.push({
                    id: logId,
                    action: 'Pendaftaran Mahasiswa',
                    detail: `Mahasiswa ${student ? student.name : studentNim} dimasukkan ke kelas ${targetClass ? targetClass.name : classId}.`,
                    timestamp: new Date().toISOString()
                });
                
                writeDb(data);
                return newEnrollment;
            }
        );
    },
    
    // Logs
    getLogs: () => {
        return executeQuery(
            async () => {
                const res = await pool.query('SELECT * FROM sim_logs ORDER BY id ASC');
                return res.rows.map(mapLogToJs);
            },
            () => {
                return readDb().logs;
            }
        );
    }
};

module.exports = db;
