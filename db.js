const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

const dbDir = path.join(__dirname, 'data');
const dbPath = path.join(dbDir, 'db.json');

function generateUsername(fullName) {
    if (!fullName) return 'user';
    let cleanName = fullName.replace(/(Prof\.|Dr\.|M\.Si\.|M\.Cs\.|M\.Hum\.|M\.E\.|,)/gi, '').trim();
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'user';
    const firstName = parts[0].toLowerCase();
    const firstLetter = firstName.charAt(0);
    const lastName = parts[parts.length - 1].toLowerCase();
    return `${firstLetter}.${lastName}`;
}

// Pastikan direktori data ada
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Data awal (Seed) jika database belum terisi
const defaultStudents = [
    { name: 'Rangga Wijaya', NIM: '10201210001', rank: 1, xp: 980, coins: 450, level: 'Level 5', status: 'SIM Master', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=60&q=80', frame: 'avatar-frame-gold-decorated', badges: ['database', 'analyst', 'vocal', 'style', 'api'], skills: { db: 100, analysis: 95, layout: 80, api: 85, security: 0, vocal: 100 }, password: bcrypt.hashSync('rangga123', 10) },
    { name: 'Aurelia Putri', NIM: '10201210002', rank: 2, xp: 950, coins: 420, level: 'Level 5', status: 'SIM Specialist', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80', frame: 'avatar-frame-silver-decorated', badges: ['database', 'analyst', 'vocal', 'style'], skills: { db: 90, analysis: 90, layout: 100, api: 0, security: 0, vocal: 90 }, password: bcrypt.hashSync('aurelia123', 10) },
    { name: 'Bobby Kertanegara', NIM: '10201210003', rank: 3, xp: 910, coins: 390, level: 'Level 5', status: 'SIM Specialist', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80', frame: 'avatar-frame-bronze-decorated', badges: ['database', 'analyst', 'vocal', 'api'], skills: { db: 85, analysis: 85, layout: 0, api: 90, security: 0, vocal: 90 }, password: bcrypt.hashSync('bobby123', 10) },
    { name: 'Clarissa Amanda', NIM: '10201210004', rank: 4, xp: 840, coins: 350, level: 'Level 4', status: 'SIM Senior', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=60&q=80', frame: '', badges: ['database', 'analyst', 'vocal'], skills: { db: 80, analysis: 85, layout: 0, api: 0, security: 0, vocal: 95 }, password: bcrypt.hashSync('clarissa123', 10) },
    { name: 'Farhan Ramadhan', NIM: '10201210005', rank: 5, xp: 780, coins: 310, level: 'Level 4', status: 'SIM Senior', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=60&q=80', frame: '', badges: ['database', 'analyst'], skills: { db: 80, analysis: 80, layout: 0, api: 0, security: 0, vocal: 0 }, password: bcrypt.hashSync('farhan123', 10) },
    { name: 'Kevin Sanjaya', NIM: '10201210006', rank: 6, xp: 720, coins: 280, level: 'Level 4', status: 'SIM Senior', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=60&q=80', frame: '', badges: ['database', 'vocal'], skills: { db: 70, analysis: 0, layout: 0, api: 0, security: 0, vocal: 95 }, password: bcrypt.hashSync('kevin123', 10) },
    { name: 'Dimas Dwi Budi Sulistio', NIM: '10201210007', rank: 7, xp: 650, coins: 420, level: 'Level 4', status: 'SIM Apprentice', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=60&q=80', frame: 'avatar-frame-purple-glow-decorated', badges: ['database', 'analyst', 'vocal'], skills: { db: 90, analysis: 85, layout: 0, api: 0, security: 0, vocal: 90 }, password: bcrypt.hashSync('dimas123', 10) },
    { name: 'Siti Rahma', NIM: '10201210008', rank: 8, xp: 590, coins: 200, level: 'Level 3', status: 'SIM Junior', role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=60&q=80', frame: '', badges: ['database'], skills: { db: 75, analysis: 0, layout: 0, api: 0, security: 0, vocal: 0 }, password: bcrypt.hashSync('siti123', 10) }
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
const defaultEnrollments = defaultStudents.map((student, idx) => ({
    studentNim: student.NIM,
    classId: 'SIM-MN8-2025',
    localXp: [120, 150, 110, 80, 70, 95, 90, 60][idx] || 0
})).concat([
    // Daftarkan beberapa ke kelas lain agar variatif
    { studentNim: '10201210001', classId: 'LPK-MN8-2025', localXp: 180 },
    { studentNim: '10201210002', classId: 'LPK-MN8-2025', localXp: 120 },
    { studentNim: '10201210001', classId: 'PAJAK-MN8A-2025', localXp: 90 },
    { studentNim: '10201210002', classId: 'PAJAK-MN8A-2025', localXp: 210 },
    { studentNim: '10201210003', classId: 'PAJAK-MN8A-2025', localXp: 140 },
    { studentNim: '10201210001', classId: 'FINTECH-MN8-2025', localXp: 75 },
    { studentNim: '10201210003', classId: 'FINTECH-MN8-2025', localXp: 160 },
    { studentNim: '10201210001', classId: 'ENG-II-2025', localXp: 50 },
    { studentNim: '10201210003', classId: 'ENG-II-2025', localXp: 110 },
    { studentNim: '10201210007', classId: 'ENG-II-2025', localXp: 150 }
]);

const defaultMaterials = [
    { id: 1, classId: 'SIM-MN8-2025', title: 'Pengantar Sistem Informasi Manajemen', fileName: 'Modul_1_Intro_to_MIS.pdf', fileType: 'pdf', fileSize: '1.8 MB', downloadUrl: '#', description: 'Materi ini membahas dasar-dasar Sistem Informasi Manajemen, sejarah perkembangannya, serta bagaimana SIM dapat membantu efisiensi bisnis perusahaan modern.', additionalFiles: [{ name: 'Slide_Intro_SIM_Tambahan.pptx', type: 'pptx', size: '2.1 MB' }, { name: 'Jurnal_Referensi_SIM_Global.pdf', type: 'pdf', size: '1.4 MB' }] },
    { id: 2, classId: 'SIM-MN8-2025', title: 'Desain Basis Data Relasional & Normalisasi', fileName: 'Modul_2_Database_Design.pdf', fileType: 'pdf', fileSize: '2.5 MB', downloadUrl: '#', description: 'Pembahasan mendalam tentang Entity Relationship Diagram (ERD), aturan-aturan normalisasi database dari 1NF sampai 3NF, serta perancangan skema relasional yang optimal.', additionalFiles: [{ name: 'Contoh_Studi_Kasus_Normalisasi.docx', type: 'doc', size: '512 KB' }] },
    { id: 3, classId: 'SIM-MN8-2025', title: 'Arsitektur Enterprise & E-Business', fileName: 'Modul_3_Enterprise_Architecture.pptx', fileType: 'pptx', fileSize: '4.2 MB', downloadUrl: '#', description: 'Materi ini menerangkan framework Enterprise Architecture (seperti TOGAF), integrasi aplikasi bisnis (ERP, CRM), dan transformasi bisnis menuju model E-Commerce digital.', additionalFiles: [{ name: 'Template_Analisis_Enterprise.docx', type: 'doc', size: '320 KB' }] },
    { id: 4, classId: 'LPK-MN8-2025', title: 'Struktur Pasar Keuangan & Otoritas Jasa Keuangan', fileName: 'Materi_1_Financial_Markets.pdf', fileType: 'pdf', fileSize: '2.1 MB', downloadUrl: '#', description: 'Materi pengantar pasar modal, fungsi OJK, pasar uang, dan bagaimana pasar keuangan memfasilitasi kebutuhan modal korporasi.', additionalFiles: [{ name: 'Undang_Undang_OJK_No21.pdf', type: 'pdf', size: '1.9 MB' }] },
    { id: 5, classId: 'PAJAK-MN8A-2025', title: 'Konsep Pajak Penghasilan (PPh) Pasal 21', fileName: 'Panduan_PPh21_Perpajakan.pdf', fileType: 'pdf', fileSize: '1.6 MB', downloadUrl: '#', description: 'Panduan tata cara pemotongan Pajak Penghasilan Pasal 21 atas penghasilan berupa gaji, upah, honorarium, tunjangan, dan pembayaran lainnya.', additionalFiles: [{ name: 'Kalkulator_PPh21_Excel.xlsx', type: 'code', size: '150 KB' }] },
    { id: 6, classId: 'FINTECH-MN8-2025', title: 'Evolusi FinTech & Sistem Pembayaran Digital', fileName: 'FinTech_Evolution_Overview.pdf', fileType: 'pdf', fileSize: '3.1 MB', downloadUrl: '#', description: 'Evolusi industri teknologi finansial (FinTech), model peer-to-peer lending, crowdfunding, e-wallets, dan tren regulasi sistem pembayaran di Indonesia.', additionalFiles: [{ name: 'Laporan_Fintech_OJK_2025.pdf', type: 'pdf', size: '4.7 MB' }] },
    { id: 7, classId: 'ENG-II-2025', title: 'Professional English Speaking & Writing Guide', fileName: 'English_II_Speaking_Guide.pdf', fileType: 'pdf', fileSize: '1.2 MB', downloadUrl: '#', description: 'Guidebook and exercises for enhancing speaking, presentation skills, and formal business writing inside a corporate environment.', additionalFiles: [{ name: 'Vocabulary_Business_English.pdf', type: 'pdf', size: '890 KB' }] }
];

const defaultQuests = [
    { id: 1, classId: 'SIM-MN8-2025', title: '1. Konsep Dasar & Peran Sistem Informasi dalam Bisnis', description: 'Pelajari konsep dasar sistem informasi dalam konteks bisnis modern. Buat esai analisis mengenai peranan teknologi informasi dalam meningkatkan keunggulan kompetitif perusahaan.', xpReward: 100, coinReward: 20, deadline: 'Tenggat Terlewati (25 Mei 2026)', lecturerFiles: [{ name: 'Silabus_Mata_Kuliah_SIM.pdf', type: 'pdf', size: '850 KB' }, { name: 'Slide_Kuliah_Pertemuan_1_Konsep_Dasar.pptx', type: 'pptx', size: '4.2 MB' }] },
    { id: 2, classId: 'SIM-MN8-2025', title: '2. Desain Database & Data Warehouse Bisnis', description: 'Desain sebuah database relational untuk sistem penjualan ritel (Point of Sales). Gambarkan Entity Relationship Diagram (ERD), skema tabel, dan lakukan normalisasi database hingga bentuk normal ketiga (3NF).', xpReward: 150, coinReward: 30, deadline: 'Tenggat Terlewati (4 Juni 2026)', lecturerFiles: [{ name: 'Modul_Praktikum_Desain_Database.pdf', type: 'pdf', size: '1.8 MB' }, { name: 'Slide_Pertemuan_2_Normalisasi.pptx', type: 'pptx', size: '3.6 MB' }, { name: 'POS_Sample_Data_Script.sql', type: 'code', size: '45 KB' }] },
    { id: 3, classId: 'SIM-MN8-2025', title: '3. Flexbox & Layouting Responsif Bootstrap 5', description: 'Buatlah desain landing page yang responsif dengan memanfaatkan Bootstrap Grid, Flexbox utilities, dan media query kustom. Pastikan layout dapat beradaptasi dengan baik di layar mobile, tablet, dan desktop.', xpReward: 250, coinReward: 50, deadline: 'Tenggat: 9 Juni 2026 (3 Hari lagi)', lecturerFiles: [{ name: 'Panduan_Layouting_Bootstrap5.pdf', type: 'pdf', size: '2.4 MB' }, { name: 'Slide_Pertemuan_3_Flexbox_Grid.pptx', type: 'pptx', size: '5.1 MB' }, { name: 'Asset_Landing_Page_Kopi.zip', type: 'zip', size: '12.8 MB' }] },
    { id: 4, classId: 'SIM-MN8-2025', title: '4. Integrasi API & Pertukaran Data Sistem Informasi', description: 'Integrasikan aplikasi mock-up Anda dengan RESTful API publik. Ambil data JSON, olah, dan tampilkan dalam bentuk tabel dinamis menggunakan Fetch API JavaScript secara asinkron.', xpReward: 300, coinReward: 60, deadline: 'Prasyarat: Selesaikan Modul 3', lecturerFiles: [{ name: 'REST_API_Integration_Guide.pdf', type: 'pdf', size: '1.5 MB' }, { name: 'Slide_Fetch_JSON_Parsing.pptx', type: 'pptx', size: '3.9 MB' }] },
    { id: 5, classId: 'SIM-MN8-2025', title: '5. Keamanan Informasi & Audit Sistem Bisnis', description: 'Lakukan analisis risiko keamanan informasi pada sistem e-commerce. Identifikasi kerentanan (OWASP Top 10) dan rancang rekomendasi mitigasi risiko beserta kontrol auditnya.', xpReward: 350, coinReward: 70, deadline: 'Prasyarat: Selesaikan Modul 4', lecturerFiles: [{ name: 'Audit_Keamanan_Modul5.pdf', type: 'pdf', size: '3.1 MB' }, { name: 'Slide_OWASP_Threats_Mitigation.pptx', type: 'pptx', size: '4.8 MB' }] }
];

const defaultSubmissions = [
    { id: 1, studentNim: '10201210007', questId: 1, submittedFile: 'Tugas_1_Konsep_SIM_Dimas.pdf', submittedDate: '25 Mei 2026, 09:15 WIB', grade: '92 / 100', feedback: 'Pemahaman konsep sudah sangat baik. Esai ditulis secara analitis dan mencakup studi kasus relevan.', status: 'completed' },
    { id: 2, studentNim: '10201210007', questId: 2, submittedFile: 'Dimas_Dwi_ERD_Normalisasi_3NF.zip', submittedDate: '4 Juni 2026, 14:30 WIB', grade: '95 / 100', feedback: 'ERD sangat komprehensif, normalisasi 3NF dilakukan dengan tepat. Penggunaan foreign key dan referential integrity didefinisikan dengan baik. Kerja bagus!', status: 'completed' }
];

const initialDb = {
    users: [...defaultStudents, ...defaultLecturers].map(u => ({ ...u, username: generateUsername(u.name) })),
    classes: defaultClasses,
    enrollments: defaultEnrollments,
    materials: defaultMaterials,
    quests: defaultQuests,
    submissions: defaultSubmissions,
    studentMaterials: [],
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
        const dbObj = JSON.parse(data);
        let changed = false;
        if (!dbObj.materials || !dbObj.materials[0] || !dbObj.materials[0].description) {
            dbObj.materials = defaultMaterials;
            changed = true;
            console.log('[DATABASE] Migrasi database lokal: memperbarui defaultMaterials dengan deskripsi');
        }
        if (!dbObj.studentMaterials) {
            dbObj.studentMaterials = [];
            changed = true;
            console.log('[DATABASE] Migrasi database lokal: menambahkan studentMaterials');
        }
        if (!dbObj.quests) {
            dbObj.quests = defaultQuests;
            changed = true;
            console.log('[DATABASE] Migrasi database lokal: menambahkan quests');
        }
        if (!dbObj.submissions) {
            dbObj.submissions = defaultSubmissions;
            changed = true;
            console.log('[DATABASE] Migrasi database lokal: menambahkan submissions');
        }
        let userChanged = false;
        if (dbObj.users && Array.isArray(dbObj.users)) {
            dbObj.users.forEach(u => {
                if (!u.username) {
                    u.username = generateUsername(u.name);
                    userChanged = true;
                }
                // Fix role 'Mahasiswa (Anda)' -> 'Mahasiswa'
                if (u.role && u.role.includes('Mahasiswa') && u.role !== 'Mahasiswa') {
                    u.role = 'Mahasiswa';
                    userChanged = true;
                }
            });
        }
        if (userChanged) {
            changed = true;
            console.log('[DATABASE] Migrasi database lokal: memperbaiki field user (username/role)');
        }
        if (changed) {
            fs.writeFileSync(dbPath, JSON.stringify(dbObj, null, 2), 'utf-8');
        }
        return dbObj;
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
        coins: row.coins !== undefined ? row.coins : 420,
        level: row.level,
        status: row.status,
        badges: row.badges || [],
        skills: typeof row.skills === 'string' ? JSON.parse(row.skills) : (row.skills || {}),
        username: row.username
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
        classId: row.class_id,
        localXp: row.local_xp || 0
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
                `INSERT INTO sim_users (name, nim, email, password, role, avatar, frame, rank, xp, coins, level, status, badges, skills, username) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
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
                    u.coins !== undefined ? u.coins : (u.role === 'Mahasiswa' ? 420 : null),
                    u.level || (u.role === 'Mahasiswa' ? 'Level 1' : null), 
                    u.status || (u.role === 'Mahasiswa' ? 'Apprentice' : null), 
                    u.badges || [], 
                    u.skills || null,
                    u.username || generateUsername(u.name)
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
                `INSERT INTO sim_enrollments (student_nim, class_id, local_xp) 
                 VALUES ($1, $2, $3)
                 ON CONFLICT (student_nim, class_id) DO NOTHING`,
                [e.studentNim, e.classId, e.localXp || 0]
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
        
        // Seed materials
        for (const m of initialDb.materials) {
            await pool.query(
                `INSERT INTO sim_materials (id, class_id, title, file_name, file_type, file_size, download_url, description, additional_files) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 ON CONFLICT (id) DO NOTHING`,
                [m.id, m.classId, m.title, m.fileName, m.fileType, m.fileSize, m.downloadUrl, m.description || '', JSON.stringify(m.additionalFiles || [])]
            );
        }
        await pool.query(`SELECT setval('sim_materials_id_seq', COALESCE((SELECT MAX(id)+1 FROM sim_materials), 1), false)`);

        // Seed quests
        for (const q of initialDb.quests) {
            await pool.query(
                `INSERT INTO sim_quests (id, class_id, title, description, xp_reward, coin_reward, deadline, lecturer_files) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 ON CONFLICT (id) DO NOTHING`,
                [q.id, q.classId, q.title, q.description, q.xpReward, q.coinReward, q.deadline, JSON.stringify(q.lecturerFiles || [])]
            );
        }
        await pool.query(`SELECT setval('sim_quests_id_seq', COALESCE((SELECT MAX(id)+1 FROM sim_quests), 1), false)`);

        // Seed submissions
        for (const s of initialDb.submissions) {
            await pool.query(
                `INSERT INTO sim_submissions (id, student_nim, quest_id, submitted_file, submitted_date, grade, feedback, status) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 ON CONFLICT (id) DO NOTHING`,
                [s.id, s.studentNim, s.questId, s.submittedFile, s.submittedDate, s.grade, s.feedback, s.status]
            );
        }
        await pool.query(`SELECT setval('sim_submissions_id_seq', COALESCE((SELECT MAX(id)+1 FROM sim_submissions), 1), false)`);

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
                skills JSONB DEFAULT '{"db": 0, "analysis": 0, "layout": 0, "api": 0, "security": 0, "vocal": 0}',
                username VARCHAR(100) UNIQUE
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

            CREATE TABLE IF NOT EXISTS sim_materials (
                id SERIAL PRIMARY KEY,
                class_id VARCHAR(100) REFERENCES sim_classes(id),
                title VARCHAR(255) NOT NULL,
                file_name VARCHAR(255) NOT NULL,
                file_type VARCHAR(50) NOT NULL,
                file_size VARCHAR(50) NOT NULL,
                download_url VARCHAR(255) DEFAULT '#'
            );

            CREATE TABLE IF NOT EXISTS sim_student_materials (
                student_nim VARCHAR(50) REFERENCES sim_users(nim),
                material_id INTEGER REFERENCES sim_materials(id),
                read_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (student_nim, material_id)
            );

            CREATE TABLE IF NOT EXISTS sim_quests (
                id SERIAL PRIMARY KEY,
                class_id VARCHAR(100) REFERENCES sim_classes(id),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                xp_reward INTEGER DEFAULT 100,
                coin_reward INTEGER DEFAULT 50,
                deadline VARCHAR(100),
                lecturer_files JSONB DEFAULT '[]'
            );

            CREATE TABLE IF NOT EXISTS sim_submissions (
                id SERIAL PRIMARY KEY,
                student_nim VARCHAR(50) REFERENCES sim_users(nim),
                quest_id INTEGER REFERENCES sim_quests(id),
                submitted_file VARCHAR(255),
                submitted_date VARCHAR(100),
                grade VARCHAR(50) DEFAULT '',
                feedback TEXT DEFAULT '',
                status VARCHAR(50) DEFAULT 'pending_grade'
            );
        `);
        
        // Pastikan kolom baru ditambahkan jika belum ada
        await pool.query(`
            ALTER TABLE sim_users ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 420;
            ALTER TABLE sim_enrollments ADD COLUMN IF NOT EXISTS local_xp INTEGER DEFAULT 0;
            ALTER TABLE sim_materials ADD COLUMN IF NOT EXISTS description TEXT;
            ALTER TABLE sim_materials ADD COLUMN IF NOT EXISTS additional_files JSONB DEFAULT '[]';
            ALTER TABLE sim_users ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;
        `);

        // Sinkronkan username & perbaiki role di PG
        const usersRes = await pool.query('SELECT id, name, username, role FROM sim_users');
        for (const row of usersRes.rows) {
            let needsUpdate = false;
            let newUsername = row.username;
            let newRole = row.role;

            if (!row.username) {
                newUsername = generateUsername(row.name);
                needsUpdate = true;
            }
            // Fix role 'Mahasiswa (Anda)' -> 'Mahasiswa'
            if (row.role && row.role.includes('Mahasiswa') && row.role !== 'Mahasiswa') {
                newRole = 'Mahasiswa';
                needsUpdate = true;
            }
            if (needsUpdate) {
                await pool.query('UPDATE sim_users SET username = $1, role = $2 WHERE id = $3', [newUsername, newRole, row.id]);
            }
        }
        
        // Periksa apakah data kosong
        const userCountRes = await pool.query('SELECT COUNT(*) FROM sim_users');
        if (parseInt(userCountRes.rows[0].count) === 0) {
            await seedDatabase();
        } else {
            // Sinkronkan sequence ID log agar tidak terjadi error duplicate key
            await pool.query(`SELECT setval('sim_logs_id_seq', COALESCE((SELECT MAX(id)+1 FROM sim_logs), 1), false)`);
            
            // Sinkronkan data materi agar update deskripsi/tambahan file selalu masuk
            console.log('[DATABASE] Menyinkronkan data materi ke Supabase...');
            for (const m of initialDb.materials) {
                await pool.query(
                    `INSERT INTO sim_materials (id, class_id, title, file_name, file_type, file_size, download_url, description, additional_files) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                     ON CONFLICT (id) DO UPDATE SET 
                        title = EXCLUDED.title,
                        file_name = EXCLUDED.file_name,
                        file_type = EXCLUDED.file_type,
                        file_size = EXCLUDED.file_size,
                        download_url = EXCLUDED.download_url,
                        description = EXCLUDED.description,
                        additional_files = EXCLUDED.additional_files`,
                    [m.id, m.classId, m.title, m.fileName, m.fileType, m.fileSize, m.downloadUrl, m.description || '', JSON.stringify(m.additionalFiles || [])]
                );
            }
            await pool.query(`SELECT setval('sim_materials_id_seq', COALESCE((SELECT MAX(id)+1 FROM sim_materials), 1), false)`);

            // Sinkronkan data quests ke Supabase
            console.log('[DATABASE] Menyinkronkan data quests ke Supabase...');
            for (const q of initialDb.quests) {
                await pool.query(
                    `INSERT INTO sim_quests (id, class_id, title, description, xp_reward, coin_reward, deadline, lecturer_files) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                     ON CONFLICT (id) DO UPDATE SET 
                        title = EXCLUDED.title,
                        description = EXCLUDED.description,
                        xp_reward = EXCLUDED.xp_reward,
                        coin_reward = EXCLUDED.coin_reward,
                        deadline = EXCLUDED.deadline,
                        lecturer_files = EXCLUDED.lecturer_files`,
                    [q.id, q.classId, q.title, q.description, q.xpReward, q.coinReward, q.deadline, JSON.stringify(q.lecturerFiles || [])]
                );
            }
            await pool.query(`SELECT setval('sim_quests_id_seq', COALESCE((SELECT MAX(id)+1 FROM sim_quests), 1), false)`);

            // Sinkronkan submissions ke Supabase
            console.log('[DATABASE] Menyinkronkan data submissions ke Supabase...');
            for (const s of initialDb.submissions) {
                await pool.query(
                    `INSERT INTO sim_submissions (id, student_nim, quest_id, submitted_file, submitted_date, grade, feedback, status) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                     ON CONFLICT (id) DO UPDATE SET 
                        submitted_file = EXCLUDED.submitted_file,
                        submitted_date = EXCLUDED.submitted_date,
                        grade = EXCLUDED.grade,
                        feedback = EXCLUDED.feedback,
                        status = EXCLUDED.status`,
                    [s.id, s.studentNim, s.questId, s.submittedFile, s.submittedDate, s.grade, s.feedback, s.status]
                );
            }
            await pool.query(`SELECT setval('sim_submissions_id_seq', COALESCE((SELECT MAX(id)+1 FROM sim_submissions), 1), false)`);
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
                    `INSERT INTO sim_users (name, nim, email, password, role, avatar, frame, rank, xp, level, status, badges, skills, username)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
                        skills,
                        generateUsername(userData.name)
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
                    username: generateUsername(userData.name),
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
    },

    // Optimized Single User Lookup (Supports NIM or email)
    getUserByNim: (nim) => {
        return executeQuery(
            async () => {
                const res = await pool.query('SELECT * FROM sim_users WHERE nim = $1 OR email = $1 OR username = $1', [nim]);
                return res.rows[0] ? mapUserToJs(res.rows[0]) : null;
            },
            () => {
                const data = readDb();
                const user = data.users.find(u => u.NIM === nim || u.email === nim || u.username === nim);
                return user || null;
            }
        );
    },

    // Optimized Enrolled Classes lookup via JOIN
    getMyClasses: (studentNim) => {
        return executeQuery(
            async () => {
                if (studentNim) {
                    const res = await pool.query(
                        `SELECT c.id, c.name, c.code, c.lecturer, c.semester, c.progress_percent, c.completed_count, c.total_quests, c.type, COALESCE(e.local_xp, 0) as local_xp
                         FROM sim_classes c
                         JOIN sim_enrollments e ON c.id = e.class_id
                         WHERE e.student_nim = $1
                         ORDER BY c.name ASC`,
                        [studentNim]
                    );
                    return res.rows.map(row => ({
                        ...mapClassToJs(row),
                        localXp: row.local_xp || 0
                    }));
                } else {
                    const res = await pool.query('SELECT *, 100 as local_xp FROM sim_classes ORDER BY name ASC');
                    return res.rows.map(row => ({
                        ...mapClassToJs(row),
                        localXp: 100
                    }));
                }
            },
            () => {
                const data = readDb();
                if (studentNim) {
                    const enrolled = data.enrollments.filter(e => e.studentNim === studentNim);
                    const enrolledClassIds = enrolled.map(e => e.classId);
                    return data.classes
                        .filter(c => enrolledClassIds.includes(c.id))
                        .map(c => {
                            const enr = enrolled.find(e => e.classId === c.id);
                            return {
                                ...c,
                                localXp: enr ? (enr.localXp || 0) : 0
                            };
                        });
                } else {
                    return data.classes.map(c => ({
                        ...c,
                        localXp: 100
                    }));
                }
            }
        );
    },

    getClassMaterialsWithStatus: (classId, studentNim) => {
        return executeQuery(
            async () => {
                const res = await pool.query(
                    `SELECT m.*, 
                     CASE WHEN sm.read_at IS NOT NULL THEN TRUE ELSE FALSE END as is_read
                     FROM sim_materials m
                     LEFT JOIN sim_student_materials sm ON m.id = sm.material_id AND sm.student_nim = $2
                     WHERE m.class_id = $1 
                     ORDER BY m.id ASC`,
                    [classId, studentNim || '']
                );
                return res.rows.map(row => ({
                    id: row.id,
                    classId: row.class_id,
                    title: row.title,
                    fileName: row.file_name,
                    fileType: row.file_type,
                    fileSize: row.file_size,
                    downloadUrl: row.download_url,
                    description: row.description || '',
                    additionalFiles: typeof row.additional_files === 'string' ? JSON.parse(row.additional_files) : (row.additional_files || []),
                    isRead: row.is_read
                }));
            },
            () => {
                const data = readDb();
                const studentMatIds = (data.studentMaterials || [])
                    .filter(sm => sm.studentNim === studentNim)
                    .map(sm => sm.materialId);
                
                return (data.materials || [])
                    .filter(m => m.classId === classId)
                    .map(m => ({
                        ...m,
                        isRead: studentMatIds.includes(m.id)
                    }));
            }
        );
    },

    markMaterialAsRead: (studentNim, materialId) => {
        return executeQuery(
            async () => {
                await pool.query(
                    `INSERT INTO sim_student_materials (student_nim, material_id) 
                     VALUES ($1, $2)
                     ON CONFLICT (student_nim, material_id) DO NOTHING`,
                    [studentNim, materialId]
                );
                return { success: true };
            },
            () => {
                const data = readDb();
                if (!data.studentMaterials) data.studentMaterials = [];
                const alreadyRead = data.studentMaterials.some(sm => sm.studentNim === studentNim && sm.materialId === parseInt(materialId));
                if (!alreadyRead) {
                    data.studentMaterials.push({ studentNim, materialId: parseInt(materialId), readAt: new Date().toISOString() });
                    writeDb(data);
                }
                return { success: true };
            }
        );
    },

    getQuests: (classId) => {
        return executeQuery(
            async () => {
                const res = await pool.query('SELECT * FROM sim_quests WHERE class_id = $1 ORDER BY id ASC', [classId]);
                return res.rows.map(row => ({
                    id: row.id,
                    classId: row.class_id,
                    title: row.title,
                    description: row.description,
                    xpReward: row.xp_reward,
                    coinReward: row.coin_reward,
                    deadline: row.deadline,
                    lecturerFiles: typeof row.lecturer_files === 'string' ? JSON.parse(row.lecturer_files) : (row.lecturer_files || [])
                }));
            },
            () => {
                const data = readDb();
                return (data.quests || []).filter(q => q.classId === classId);
            }
        );
    },

    getQuestsWithStatus: (classId, studentNim) => {
        return executeQuery(
            async () => {
                const questsRes = await pool.query('SELECT * FROM sim_quests WHERE class_id = $1 ORDER BY id ASC', [classId]);
                const subsRes = await pool.query('SELECT * FROM sim_submissions WHERE student_nim = $1', [studentNim || '']);
                
                return questsRes.rows.map((q, idx) => {
                    const sub = subsRes.rows.find(s => s.quest_id === q.id);
                    let defaultStatus = 'locked';
                    if (idx === 0) defaultStatus = 'active';
                    else {
                        const prev = questsRes.rows[idx - 1];
                        const prevSub = subsRes.rows.find(s => s.quest_id === prev.id);
                        if (prevSub && prevSub.status === 'completed') {
                            defaultStatus = 'active';
                        }
                    }
                    return {
                        id: q.id,
                        classId: q.class_id,
                        title: q.title,
                        description: q.description,
                        xpReward: q.xp_reward,
                        coinReward: q.coin_reward,
                        deadline: q.deadline,
                        lecturerFiles: typeof q.lecturer_files === 'string' ? JSON.parse(q.lecturer_files) : (q.lecturer_files || []),
                        status: sub ? sub.status : defaultStatus,
                        submittedFile: sub ? sub.submitted_file : '',
                        submittedDate: sub ? sub.submitted_date : '',
                        grade: sub ? sub.grade : '',
                        feedback: sub ? sub.feedback : ''
                    };
                });
            },
            () => {
                const data = readDb();
                const quests = (data.quests || []).filter(q => q.classId === classId);
                const subs = (data.submissions || []).filter(s => s.studentNim === studentNim);
                
                return quests.map((q, idx) => {
                    const sub = subs.find(s => s.questId === q.id);
                    let defaultStatus = 'locked';
                    if (idx === 0) defaultStatus = 'active';
                    else {
                        const prev = quests[idx - 1];
                        const prevSub = subs.find(s => s.questId === prev.id);
                        if (prevSub && prevSub.status === 'completed') {
                            defaultStatus = 'active';
                        }
                    }
                    return {
                        ...q,
                        status: sub ? sub.status : defaultStatus,
                        submittedFile: sub ? sub.submittedFile : '',
                        submittedDate: sub ? sub.submittedDate : '',
                        grade: sub ? sub.grade : '',
                        feedback: sub ? sub.feedback : ''
                    };
                });
            }
        );
    },

    createQuest: (questData) => {
        return executeQuery(
            async () => {
                const res = await pool.query(
                    `INSERT INTO sim_quests (class_id, title, description, xp_reward, coin_reward, deadline, lecturer_files) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                    [
                        questData.classId,
                        questData.title,
                        questData.description,
                        questData.xpReward || 100,
                        questData.coinReward || 50,
                        questData.deadline || '',
                        JSON.stringify(questData.lecturerFiles || [])
                    ]
                );
                await pool.query('UPDATE sim_classes SET total_quests = total_quests + 1 WHERE id = $1', [questData.classId]);
                
                const q = res.rows[0];
                return {
                    id: q.id,
                    classId: q.class_id,
                    title: q.title,
                    description: q.description,
                    xpReward: q.xp_reward,
                    coinReward: q.coin_reward,
                    deadline: q.deadline,
                    lecturerFiles: typeof q.lecturer_files === 'string' ? JSON.parse(q.lecturer_files) : (q.lecturer_files || [])
                };
            },
            () => {
                const data = readDb();
                const newId = (data.quests || []).reduce((max, q) => q.id > max ? q.id : max, 0) + 1;
                const newQuest = {
                    id: newId,
                    classId: questData.classId,
                    title: questData.title,
                    description: questData.description,
                    xpReward: questData.xpReward || 100,
                    coinReward: questData.coinReward || 50,
                    deadline: questData.deadline || '',
                    lecturerFiles: questData.lecturerFiles || []
                };
                if (!data.quests) data.quests = [];
                data.quests.push(newQuest);
                
                const cls = data.classes.find(c => c.id === questData.classId);
                if (cls) cls.totalQuests = (cls.totalQuests || 0) + 1;
                
                writeDb(data);
                return newQuest;
            }
        );
    },

    createMaterial: (materialData) => {
        return executeQuery(
            async () => {
                const res = await pool.query(
                    `INSERT INTO sim_materials (class_id, title, file_name, file_type, file_size, download_url, description, additional_files)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                    [
                        materialData.classId,
                        materialData.title,
                        materialData.fileName,
                        materialData.fileType || 'pdf',
                        materialData.fileSize || '1.0 MB',
                        materialData.downloadUrl || '#',
                        materialData.description || '',
                        JSON.stringify(materialData.additionalFiles || [])
                    ]
                );
                const m = res.rows[0];
                return {
                    id: m.id,
                    classId: m.class_id,
                    title: m.title,
                    fileName: m.file_name,
                    fileType: m.file_type,
                    fileSize: m.file_size,
                    downloadUrl: m.download_url,
                    description: m.description || '',
                    additionalFiles: typeof m.additional_files === 'string' ? JSON.parse(m.additional_files) : (m.additional_files || [])
                };
            },
            () => {
                const data = readDb();
                const newId = (data.materials || []).reduce((max, m) => m.id > max ? m.id : max, 0) + 1;
                const newMat = {
                    id: newId,
                    classId: materialData.classId,
                    title: materialData.title,
                    fileName: materialData.fileName,
                    fileType: materialData.fileType || 'pdf',
                    fileSize: materialData.fileSize || '1.0 MB',
                    downloadUrl: materialData.downloadUrl || '#',
                    description: materialData.description || '',
                    additionalFiles: materialData.additionalFiles || []
                };
                if (!data.materials) data.materials = [];
                data.materials.push(newMat);
                writeDb(data);
                return newMat;
            }
        );
    },

    submitQuest: (studentNim, questId, submittedFile) => {
        return executeQuery(
            async () => {
                const now = new Date();
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
                
                const res = await pool.query(
                    `INSERT INTO sim_submissions (student_nim, quest_id, submitted_file, submitted_date, status)
                     VALUES ($1, $2, $3, $4, 'pending_grade') RETURNING *`,
                    [studentNim, questId, submittedFile, dateStr]
                );
                return res.rows[0];
            },
            () => {
                const data = readDb();
                const now = new Date();
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
                
                const newId = (data.submissions || []).reduce((max, s) => s.id > max ? s.id : max, 0) + 1;
                const sub = {
                    id: newId,
                    studentNim,
                    questId: parseInt(questId),
                    submittedFile,
                    submittedDate: dateStr,
                    grade: '',
                    feedback: '',
                    status: 'pending_grade'
                };
                if (!data.submissions) data.submissions = [];
                data.submissions.push(sub);
                writeDb(data);
                return sub;
            }
        );
    },

    getSubmissionsForClass: (classId) => {
        return executeQuery(
            async () => {
                const res = await pool.query(
                    `SELECT s.*, u.name as student_name, q.title as quest_title, q.xp_reward, q.coin_reward
                     FROM sim_submissions s
                     JOIN sim_users u ON s.student_nim = u.nim
                     JOIN sim_quests q ON s.quest_id = q.id
                     WHERE q.class_id = $1
                     ORDER BY s.id DESC`,
                    [classId]
                );
                return res.rows.map(row => ({
                    id: row.id,
                    studentNim: row.student_nim,
                    studentName: row.student_name,
                    questId: row.quest_id,
                    questTitle: row.quest_title,
                    xpReward: row.xp_reward,
                    coinReward: row.coin_reward,
                    submittedFile: row.submitted_file,
                    submittedDate: row.submitted_date,
                    grade: row.grade,
                    feedback: row.feedback,
                    status: row.status
                }));
            },
            () => {
                const data = readDb();
                const classQuests = (data.quests || []).filter(q => q.classId === classId);
                const classQuestIds = classQuests.map(q => q.id);
                return (data.submissions || [])
                    .filter(s => classQuestIds.includes(s.questId))
                    .map(s => {
                        const student = data.users.find(u => u.NIM === s.studentNim);
                        const quest = classQuests.find(q => q.id === s.questId);
                        return {
                            id: s.id,
                            studentNim: s.studentNim,
                            studentName: student ? student.name : s.studentNim,
                            questId: s.questId,
                            questTitle: quest ? quest.title : '',
                            xpReward: quest ? quest.xpReward : 100,
                            coinReward: quest ? quest.coinReward : 50,
                            submittedFile: s.submittedFile,
                            submittedDate: s.submittedDate,
                            grade: s.grade,
                            feedback: s.feedback,
                            status: s.status
                        };
                    })
                    .reverse();
            }
        );
    },

    gradeSubmission: (submissionId, grade, feedback) => {
        return executeQuery(
            async () => {
                const subRes = await pool.query('SELECT * FROM sim_submissions WHERE id = $1', [submissionId]);
                if (subRes.rows.length === 0) return { error: 'Submission tidak ditemukan.' };
                const sub = subRes.rows[0];
                if (sub.status === 'completed') return { error: 'Submission sudah dinilai.' };

                const questRes = await pool.query('SELECT * FROM sim_quests WHERE id = $1', [sub.quest_id]);
                const quest = questRes.rows[0];

                await pool.query(
                    `UPDATE sim_submissions SET grade = $1, feedback = $2, status = 'completed' WHERE id = $3`,
                    [grade, feedback, submissionId]
                );

                await pool.query(
                    `UPDATE sim_users 
                     SET xp = COALESCE(xp, 0) + $1, coins = COALESCE(coins, 0) + $2 
                     WHERE nim = $3`,
                    [quest.xp_reward, quest.coin_reward, sub.student_nim]
                );

                await pool.query(
                    `UPDATE sim_enrollments 
                     SET local_xp = COALESCE(local_xp, 0) + $1 
                     WHERE student_nim = $2 AND class_id = $3`,
                    [quest.xp_reward, sub.student_nim, quest.class_id]
                );

                const classEnrollRes = await pool.query('SELECT COUNT(*) FROM sim_enrollments WHERE class_id = $1', [quest.class_id]);
                const classEnrollCount = parseInt(classEnrollRes.rows[0].count);
                
                const completedSubsRes = await pool.query(
                    `SELECT COUNT(*) FROM sim_submissions s
                     JOIN sim_quests q ON s.quest_id = q.id
                     WHERE q.class_id = $1 AND s.status = 'completed'`,
                    [quest.class_id]
                );
                const completedCount = parseInt(completedSubsRes.rows[0].count);
                const totalQuestsRes = await pool.query('SELECT total_quests FROM sim_classes WHERE id = $1', [quest.class_id]);
                const totalQuests = totalQuestsRes.rows[0] ? totalQuestsRes.rows[0].total_quests : 1;
                
                const newProgressPercent = Math.round((completedCount / (totalQuests * Math.max(classEnrollCount, 1))) * 100);
                await pool.query(
                    `UPDATE sim_classes 
                     SET progress_percent = $1, completed_count = $2 
                     WHERE id = $3`,
                    [newProgressPercent, completedCount, quest.class_id]
                );

                return { success: true };
            },
            () => {
                const data = readDb();
                const sub = data.submissions.find(s => s.id === parseInt(submissionId));
                if (!sub) return { error: 'Submission tidak ditemukan.' };
                if (sub.status === 'completed') return { error: 'Submission sudah dinilai.' };

                const quest = data.quests.find(q => q.id === sub.questId);
                const xp = quest ? quest.xpReward : 100;
                const coins = quest ? quest.coinReward : 50;

                sub.grade = grade;
                sub.feedback = feedback;
                sub.status = 'completed';

                const student = data.users.find(u => u.NIM === sub.studentNim);
                if (student) {
                    student.xp = (student.xp || 0) + xp;
                    student.coins = (student.coins || 0) + coins;
                }

                const enrollment = data.enrollments.find(e => e.studentNim === sub.studentNim && e.classId === (quest ? quest.classId : 'SIM-MN8-2025'));
                if (enrollment) {
                    enrollment.localXp = (enrollment.localXp || 0) + xp;
                }

                if (quest) {
                    const cls = data.classes.find(c => c.id === quest.classId);
                    if (cls) {
                        const enrolledCount = data.enrollments.filter(e => e.classId === quest.classId).length;
                        const completedCount = data.submissions.filter(s => {
                            const q = data.quests.find(x => x.id === s.questId);
                            return q && q.classId === quest.classId && s.status === 'completed';
                        }).length;
                        cls.completedCount = completedCount;
                        cls.progressPercent = Math.round((completedCount / ((cls.totalQuests || 1) * Math.max(enrolledCount, 1))) * 100);
                    }
                }

                writeDb(data);
                return { success: true };
            }
        );
    },

    markMaterialAsRead: (studentNim, materialId) => {
        return executeQuery(
            async () => {
                await pool.query(
                    `INSERT INTO sim_student_materials (student_nim, material_id) 
                     VALUES ($1, $2)
                     ON CONFLICT (student_nim, material_id) DO NOTHING`,
                    [studentNim, materialId]
                );
                return { success: true };
            },
            () => {
                const data = readDb();
                if (!data.studentMaterials) data.studentMaterials = [];
                const alreadyRead = data.studentMaterials.some(sm => sm.studentNim === studentNim && sm.materialId === parseInt(materialId));
                if (!alreadyRead) {
                    data.studentMaterials.push({ studentNim, materialId: parseInt(materialId), readAt: new Date().toISOString() });
                    writeDb(data);
                }
                return { success: true };
            }
        );
    }
};

module.exports = db;

