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
    { name: 'Rangga Wijaya', NIM: '10201210001', rank: 1, global_coins: 450, role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=60&q=80', frame: '', owned_frames: [], owned_badges: ['database', 'analyst'], password: bcrypt.hashSync('rangga123', 10), faculty: 'Fakultas Sains dan Ilmu Komputer', major: 'Ilmu Komputer' },
    { name: 'Aurelia Putri', NIM: '10201210002', rank: 2, global_coins: 320, role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80', frame: '', owned_frames: [], owned_badges: ['database'], password: bcrypt.hashSync('aurelia123', 10), faculty: 'Fakultas Teknologi Industri', major: 'Teknik Kimia' },
    { name: 'Bobby Kertanegara', NIM: '10201210003', rank: 3, global_coins: 290, role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80', frame: '', owned_frames: [], owned_badges: [], password: bcrypt.hashSync('bobby123', 10), faculty: 'Fakultas Teknologi Industri', major: 'Teknik Elektro' },
    { name: 'Clarissa Amanda', NIM: '10201210004', rank: 4, global_coins: 250, role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=60&q=80', frame: '', owned_frames: [], owned_badges: [], password: bcrypt.hashSync('clarissa123', 10), faculty: 'Fakultas Ekonomi dan Bisnis', major: 'Manajemen' },
    { name: 'Farhan Ramadhan', NIM: '10201210005', rank: 5, global_coins: 210, role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=60&q=80', frame: '', owned_frames: [], owned_badges: [], password: bcrypt.hashSync('farhan123', 10), faculty: 'Fakultas Komunikasi dan Diplomasi', major: 'Hubungan Internasional' },
    { name: 'Kevin Sanjaya', NIM: '10201210006', rank: 6, global_coins: 180, role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=60&q=80', frame: '', owned_frames: [], owned_badges: [], password: bcrypt.hashSync('kevin123', 10), faculty: 'Fakultas Perencanaan Infrastruktur', major: 'Teknik Sipil' },
    { name: 'Dimas Dwi Budi Sulistio', NIM: '10201210007', rank: 7, global_coins: 420, role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=60&q=80', frame: '', owned_frames: [], owned_badges: ['database', 'analyst'], password: bcrypt.hashSync('dimas123', 10), faculty: 'Fakultas Sains dan Ilmu Komputer', major: 'Ilmu Komputer' },
    { name: 'Siti Rahma', NIM: '10201210008', rank: 8, global_coins: 100, role: 'Mahasiswa', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=60&q=80', frame: '', owned_frames: [], owned_badges: [], password: bcrypt.hashSync('siti123', 10), faculty: 'Fakultas Teknologi Eksplorasi dan Produksi', major: 'Teknik Perminyakan' }
];

const defaultLecturers = [
    { name: 'Prof. Hermawan Kartajaya', email: 'hermawan@universitaspertamina.ac.id', role: 'Dosen', password: bcrypt.hashSync('dosen123', 10), avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=60&q=80', faculty: 'Fakultas Ekonomi dan Bisnis', major: 'Manajemen' },
    { name: 'Sarah Wijaya, M.Si.', email: 'sarah.wijaya@universitaspertamina.ac.id', role: 'Dosen', password: bcrypt.hashSync('dosen123', 10), avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=60&q=80', faculty: 'Fakultas Teknologi Industri', major: 'Teknik Kimia' },
    { name: 'Jafar Shadiq, M.Cs.', email: 'jafar.shadiq@universitaspertamina.ac.id', role: 'Dosen', password: bcrypt.hashSync('dosen123', 10), avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=60&q=80', faculty: 'Fakultas Sains dan Ilmu Komputer', major: 'Ilmu Komputer' },
    { name: 'Dr. Irwan Prasetyo, M.E.', email: 'irwan.prasetyo@universitaspertamina.ac.id', role: 'Dosen', password: bcrypt.hashSync('dosen123', 10), avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=60&q=80', faculty: 'Fakultas Ekonomi dan Bisnis', major: 'Ekonomi' },
    { name: 'Alice Smith, M.Hum.', email: 'alice.smith@universitaspertamina.ac.id', role: 'Dosen', password: bcrypt.hashSync('dosen123', 10), avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=60&q=80', faculty: 'Fakultas Komunikasi dan Diplomasi', major: 'Ilmu Komunikasi' }
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
    localXp: [980, 950, 910, 840, 780, 720, 650, 590][idx] || 0,
    classBadges: idx < 3 ? ['data_explorer', 'query_master'] : (idx < 6 ? ['data_explorer'] : []),
    isCompleted: false,
    coinsClaimed: false
})).concat([
    { studentNim: '10201210001', classId: 'LPK-MN8-2025', localXp: 1800, classBadges: ['data_explorer'], isCompleted: false, coinsClaimed: false },
    { studentNim: '10201210002', classId: 'LPK-MN8-2025', localXp: 1200, classBadges: [], isCompleted: false, coinsClaimed: false },
    { studentNim: '10201210001', classId: 'PAJAK-MN8A-2025', localXp: 900, classBadges: [], isCompleted: false, coinsClaimed: false },
    { studentNim: '10201210002', classId: 'PAJAK-MN8A-2025', localXp: 2100, classBadges: ['data_explorer', 'query_master', 'class_champion'], isCompleted: true, coinsClaimed: true },
    { studentNim: '10201210003', classId: 'PAJAK-MN8A-2025', localXp: 1400, classBadges: ['data_explorer'], isCompleted: false, coinsClaimed: false },
    { studentNim: '10201210001', classId: 'FINTECH-MN8-2025', localXp: 750, classBadges: [], isCompleted: false, coinsClaimed: false },
    { studentNim: '10201210003', classId: 'FINTECH-MN8-2025', localXp: 1600, classBadges: ['data_explorer'], isCompleted: false, coinsClaimed: false },
    { studentNim: '10201210001', classId: 'ENG-II-2025', localXp: 500, classBadges: [], isCompleted: false, coinsClaimed: false },
    { studentNim: '10201210003', classId: 'ENG-II-2025', localXp: 1100, classBadges: ['data_explorer'], isCompleted: false, coinsClaimed: false },
    { studentNim: '10201210007', classId: 'ENG-II-2025', localXp: 1500, classBadges: ['data_explorer'], isCompleted: false, coinsClaimed: false }
]);

// Shop items seed
const defaultShopItems = [
    // Frames
    { itemId: 'frame_gold_crown', itemType: 'frame', name: 'Gold Crown', description: 'Bingkai emas mewah dengan efek crown.', price: 500, icon: 'fa-solid fa-crown', cssClass: 'avatar-frame-gold-decorated', previewUrl: '' },
    { itemId: 'frame_silver_diamond', itemType: 'frame', name: 'Silver Diamond', description: 'Bingkai perak elegan dengan kilau berlian.', price: 350, icon: 'fa-solid fa-gem', cssClass: 'avatar-frame-silver-decorated', previewUrl: '' },
    { itemId: 'frame_neon_purple', itemType: 'frame', name: 'Neon Purple Glow', description: 'Bingkai neon ungu berpendar futuristik.', price: 300, icon: 'fa-solid fa-circle-radiation', cssClass: 'avatar-frame-purple-glow-decorated', previewUrl: '' },
    { itemId: 'frame_emerald_ring', itemType: 'frame', name: 'Emerald Ring', description: 'Bingkai zamrud dengan aura hijau.', price: 250, icon: 'fa-solid fa-ring', cssClass: 'avatar-frame-emerald-decorated', previewUrl: '' },
    // Global Badges
    { itemId: 'database', itemType: 'badge', name: 'Database Master', description: 'Menguasai desain dan manajemen basis data.', price: 200, icon: 'fa-solid fa-database', cssClass: 'bg-badge-database', previewUrl: '' },
    { itemId: 'analyst', itemType: 'badge', name: 'System Analyst', description: 'Ahli analisis dan perancangan sistem informasi.', price: 200, icon: 'fa-solid fa-chart-pie', cssClass: 'bg-badge-analyst', previewUrl: '' },
    { itemId: 'api_architect', itemType: 'badge', name: 'API Architect', description: 'Pakar integrasi API dan pertukaran data.', price: 200, icon: 'fa-solid fa-plug', cssClass: 'bg-badge-api', previewUrl: '' },
    { itemId: 'security', itemType: 'badge', name: 'Security Warden', description: 'Penjaga keamanan dan audit sistem.', price: 250, icon: 'fa-solid fa-shield-halved', cssClass: 'bg-badge-security', previewUrl: '' },
    { itemId: 'design_guru', itemType: 'badge', name: 'Design Guru', description: 'Master desain UI/UX dan layouting.', price: 200, icon: 'fa-brands fa-css3-alt', cssClass: 'bg-badge-style', previewUrl: '' },
    { itemId: 'grand_master', itemType: 'badge', name: 'Grand Master SIM', description: 'Pencapaian tertinggi: menguasai seluruh aspek SIM.', price: 500, icon: 'fa-solid fa-trophy', cssClass: 'bg-badge-grand', previewUrl: '' }
];

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
    { id: 5, classId: 'SIM-MN8-2025', title: '5. Keamanan Informasi & Audit Sistem Bisnis', description: 'Lakukan analisis risiko keamanan informasi pada sistem e-commerce. Identifikasi kerentanan (OWASP Top 10) dan rancang rekomendasi mitigasi risiko beserta kontrol auditnya.', xpReward: 350, coinReward: 70, deadline: 'Prasyarat: Selesaikan Modul 4', lecturerFiles: [{ name: 'Audit_Keamanan_Modul5.pdf', type: 'pdf', size: '3.1 MB' }, { name: 'Slide_OWASP_Threats_Mitigation.pptx', type: 'pptx', size: '4.8 MB' }] },
    { id: 6, classId: 'LPK-MN8-2025', title: '1. Struktur Lembaga Keuangan Bank & Non-Bank', description: 'Pelajari modul struktur lembaga keuangan, buat rangkuman singkat dalam format PDF mengenai perbedaan mendasar Bank Sentral, Bank Umum, dan Lembaga Keuangan Mikro.', xpReward: 150, coinReward: 30, deadline: 'Tenggat: 12 Juni 2026 (2 Hari lagi)', lecturerFiles: [{ name: 'Modul_LPK_Struktur_Lembaga.pdf', type: 'pdf', size: '1.4 MB' }] },
    { id: 7, classId: 'LPK-MN8-2025', title: '2. Analisis Pasar Modal & Instrumen Keuangan', description: 'Analisis pergerakan indeks pasar modal Indonesia dan buat laporan komparatif instrumen saham, obligasi, dan reksa dana.', xpReward: 200, coinReward: 40, deadline: 'Prasyarat: Selesaikan Modul 1', lecturerFiles: [{ name: 'Panduan_Analisis_Pasar_Modal.pdf', type: 'pdf', size: '2.0 MB' }] },
    { id: 8, classId: 'PAJAK-MN8A-2025', title: '1. Ketentuan Umum & Tata Cara Perpajakan', description: 'Pelajari dasar-dasar sistem perpajakan Indonesia dan buat ringkasan konsep domisili, subjek pajak, serta objek pajak.', xpReward: 100, coinReward: 20, deadline: 'Tenggat Terlewati (3 Juni 2026)', lecturerFiles: [{ name: 'Panduan_Peraturan_Perppajakan.pdf', type: 'pdf', size: '1.2 MB' }] },
    { id: 9, classId: 'PAJAK-MN8A-2025', title: '2. Simulasi Perhitungan PPh Pasal 21', description: 'Hitunglah PPh Pasal 21 dari 3 skenario karyawan dengan status PTKP yang berbeda menggunakan formulir resmi terbaru.', xpReward: 250, coinReward: 50, deadline: 'Tenggat: 11 Juni 2026 (4 Hari lagi)', lecturerFiles: [{ name: 'Kalkulator_PPh21_Excel.xlsx', type: 'code', size: '150 KB' }] },
    { id: 10, classId: 'FINTECH-MN8-2025', title: '1. Evolusi FinTech & Sistem Pembayaran Digital', description: 'Analisis evolusi e-wallet dan payment gateway di Indonesia beserta regulasi BI/OJK yang berlaku.', xpReward: 200, coinReward: 40, deadline: 'Tenggat: 13 Juni 2026 (5 Hari lagi)', lecturerFiles: [{ name: 'FinTech_Evolution_Overview.pdf', type: 'pdf', size: '3.1 MB' }] },
    { id: 11, classId: 'FINTECH-MN8-2025', title: '2. Model Bisnis Peer-to-Peer (P2P) Lending', description: 'Analisis regulasi OJK terkait batas atas pendanaan P2P Lending dan buat laporan komparatif mitigasi risiko gagal bayar.', xpReward: 300, coinReward: 60, deadline: 'Prasyarat: Selesaikan Modul 1', lecturerFiles: [{ name: 'Laporan_Fintech_OJK_2025.pdf', type: 'pdf', size: '4.7 MB' }] },
    { id: 12, classId: 'ENG-II-2025', title: '1. Professional Elevator Pitch Video', description: 'Rekam video berdurasi 60 detik yang mempresentasikan ide bisnis inovatif Anda dalam Bahasa Inggris formal.', xpReward: 150, coinReward: 30, deadline: 'Tenggat: 14 Juni 2026 (6 Hari lagi)', lecturerFiles: [{ name: 'English_II_Speaking_Guide.pdf', type: 'pdf', size: '1.2 MB' }] },
    { id: 13, classId: 'ENG-II-2025', title: '2. Business Email & Report Writing', description: 'Tulis email bisnis formal dan laporan singkat dalam Bahasa Inggris terkait studi kasus perusahaan multinasional.', xpReward: 200, coinReward: 40, deadline: 'Prasyarat: Selesaikan Modul 1', lecturerFiles: [{ name: 'Vocabulary_Business_English.pdf', type: 'pdf', size: '890 KB' }] }
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
    shopItems: defaultShopItems,
    purchases: [],
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
        } else {
            const existingIds = new Set(dbObj.quests.map(q => q.id));
            defaultQuests.forEach(q => {
                if (!existingIds.has(q.id)) {
                    dbObj.quests.push(q);
                    changed = true;
                }
            });
            if (changed) console.log('[DATABASE] Migrasi database lokal: menambahkan quests kelas baru');
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
        global_coins: row.global_coins !== undefined ? row.global_coins : (row.coins || 0),
        owned_frames: typeof row.owned_frames === 'string' ? JSON.parse(row.owned_frames) : (row.owned_frames || []),
        owned_badges: typeof row.owned_badges === 'string' ? JSON.parse(row.owned_badges) : (row.owned_badges || []),
        active_frame: row.active_frame !== undefined ? row.active_frame : (row.frame || ''),
        username: row.username,
        faculty: row.faculty || '',
        major: row.major || ''
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
        localXp: row.local_xp || 0,
        classBadges: typeof row.class_badges === 'string' ? JSON.parse(row.class_badges) : (row.class_badges || []),
        isCompleted: row.is_completed || false,
        coinsClaimed: row.coins_claimed || false
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
                `INSERT INTO sim_users (name, nim, email, password, role, avatar, frame, rank, global_coins, owned_frames, owned_badges, username, faculty, major) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
                    u.global_coins || 0,
                    JSON.stringify(u.owned_frames || []),
                    JSON.stringify(u.owned_badges || []),
                    u.username || generateUsername(u.name),
                    u.faculty || '',
                    u.major || ''
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
                `INSERT INTO sim_enrollments (student_nim, class_id, local_xp, class_badges, is_completed, coins_claimed) 
                 VALUES ($1, $2, $3, $4, $5, $6)
                 ON CONFLICT (student_nim, class_id) DO UPDATE 
                 SET local_xp = CASE WHEN sim_enrollments.local_xp = 0 THEN EXCLUDED.local_xp ELSE sim_enrollments.local_xp END,
                     class_badges = CASE WHEN sim_enrollments.local_xp = 0 THEN EXCLUDED.class_badges ELSE sim_enrollments.class_badges END,
                     is_completed = CASE WHEN sim_enrollments.local_xp = 0 THEN EXCLUDED.is_completed ELSE sim_enrollments.is_completed END,
                     coins_claimed = CASE WHEN sim_enrollments.local_xp = 0 THEN EXCLUDED.coins_claimed ELSE sim_enrollments.coins_claimed END`,
                [e.studentNim, e.classId, e.localXp || 0, JSON.stringify(e.classBadges || []), e.isCompleted || false, e.coinsClaimed || false]
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
                `INSERT INTO sim_quests (id, class_id, title, description, xp_reward, coin_reward, deadline, lecturer_files, allow_late_submission, late_penalty) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 ON CONFLICT (id) DO NOTHING`,
                [
                    q.id,
                    q.classId,
                    q.title,
                    q.description,
                    q.xpReward,
                    q.coinReward,
                    q.deadline,
                    JSON.stringify(q.lecturerFiles || []),
                    q.allowLateSubmission !== undefined ? q.allowLateSubmission : true,
                    q.latePenalty !== undefined ? q.latePenalty : 30
                ]
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

        // Seed shop items
        for (const item of initialDb.shopItems) {
            await pool.query(
                `INSERT INTO sim_shop_items (item_id, item_type, name, description, price, icon, css_class) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (item_id) DO NOTHING`,
                [item.itemId, item.itemType, item.name, item.description, item.price, item.icon, item.cssClass]
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
                skills JSONB DEFAULT '{"db": 0, "analysis": 0, "layout": 0, "api": 0, "security": 0, "vocal": 0}',
                username VARCHAR(100) UNIQUE,
                faculty VARCHAR(100) DEFAULT '',
                major VARCHAR(100) DEFAULT ''
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
                lecturer_files JSONB DEFAULT '[]',
                allow_late_submission BOOLEAN DEFAULT TRUE,
                late_penalty INTEGER DEFAULT 30
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
            
            -- Gamification V2: new columns
            ALTER TABLE sim_users ADD COLUMN IF NOT EXISTS global_coins INTEGER DEFAULT 0;
            ALTER TABLE sim_users ADD COLUMN IF NOT EXISTS owned_frames JSONB DEFAULT '[]';
            ALTER TABLE sim_users ADD COLUMN IF NOT EXISTS owned_badges JSONB DEFAULT '[]';
            ALTER TABLE sim_users ADD COLUMN IF NOT EXISTS active_frame VARCHAR(100) DEFAULT '';
            
            ALTER TABLE sim_enrollments ADD COLUMN IF NOT EXISTS class_badges JSONB DEFAULT '[]';
            ALTER TABLE sim_enrollments ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE;
            ALTER TABLE sim_enrollments ADD COLUMN IF NOT EXISTS coins_claimed BOOLEAN DEFAULT FALSE;

            ALTER TABLE sim_users ADD COLUMN IF NOT EXISTS faculty VARCHAR(100) DEFAULT '';
            ALTER TABLE sim_users ADD COLUMN IF NOT EXISTS major VARCHAR(100) DEFAULT '';

            -- Late submission configurations on quests
            ALTER TABLE sim_quests ADD COLUMN IF NOT EXISTS allow_late_submission BOOLEAN DEFAULT TRUE;
            ALTER TABLE sim_quests ADD COLUMN IF NOT EXISTS late_penalty INTEGER DEFAULT 30;
        `);

        // Gamification V2: new tables
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sim_shop_items (
                id SERIAL PRIMARY KEY,
                item_id VARCHAR(50) UNIQUE NOT NULL,
                item_type VARCHAR(20) NOT NULL,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                price INTEGER NOT NULL,
                icon VARCHAR(100),
                css_class VARCHAR(100)
            );
            
            CREATE TABLE IF NOT EXISTS sim_purchases (
                id SERIAL PRIMARY KEY,
                student_nim VARCHAR(50) NOT NULL,
                item_id VARCHAR(50) NOT NULL,
                purchased_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS sim_class_logs (
                id SERIAL PRIMARY KEY,
                class_id VARCHAR(100) NOT NULL,
                activity_text TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Sync shop items seed data
        for (const item of defaultShopItems) {
            await pool.query(
                `INSERT INTO sim_shop_items (item_id, item_type, name, description, price, icon, css_class)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (item_id) DO UPDATE SET
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    price = EXCLUDED.price,
                    icon = EXCLUDED.icon,
                    css_class = EXCLUDED.css_class`,
                [item.itemId, item.itemType, item.name, item.description, item.price, item.icon, item.cssClass]
            );
        }

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
                    `INSERT INTO sim_quests (id, class_id, title, description, xp_reward, coin_reward, deadline, lecturer_files, allow_late_submission, late_penalty) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                     ON CONFLICT (id) DO UPDATE SET 
                        title = EXCLUDED.title,
                        description = EXCLUDED.description,
                        xp_reward = EXCLUDED.xp_reward,
                        coin_reward = EXCLUDED.coin_reward,
                        deadline = EXCLUDED.deadline,
                        lecturer_files = EXCLUDED.lecturer_files,
                        allow_late_submission = EXCLUDED.allow_late_submission,
                        late_penalty = EXCLUDED.late_penalty`,
                    [
                        q.id,
                        q.classId,
                        q.title,
                        q.description,
                        q.xpReward,
                        q.coinReward,
                        q.deadline,
                        JSON.stringify(q.lecturerFiles || []),
                        q.allowLateSubmission !== undefined ? q.allowLateSubmission : true,
                        q.latePenalty !== undefined ? q.latePenalty : 30
                    ]
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

            // Sinkronkan data enrollments agar default local_xp, badges, dll. masuk
            console.log('[DATABASE] Menyinkronkan data enrollments ke Supabase...');
            for (const e of initialDb.enrollments) {
                await pool.query(
                    `INSERT INTO sim_enrollments (student_nim, class_id, local_xp, class_badges, is_completed, coins_claimed) 
                     VALUES ($1, $2, $3, $4, $5, $6)
                     ON CONFLICT (student_nim, class_id) DO UPDATE 
                     SET local_xp = CASE WHEN sim_enrollments.local_xp = 0 THEN EXCLUDED.local_xp ELSE sim_enrollments.local_xp END,
                         class_badges = CASE WHEN sim_enrollments.local_xp = 0 THEN EXCLUDED.class_badges ELSE sim_enrollments.class_badges END,
                         is_completed = CASE WHEN sim_enrollments.local_xp = 0 THEN EXCLUDED.is_completed ELSE sim_enrollments.is_completed END,
                         coins_claimed = CASE WHEN sim_enrollments.local_xp = 0 THEN EXCLUDED.coins_claimed ELSE sim_enrollments.coins_claimed END`,
                    [e.studentNim, e.classId, e.localXp || 0, JSON.stringify(e.classBadges || []), e.isCompleted || false, e.coinsClaimed || false]
                );
            }
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

function calculateXpBonus(submittedDateStr, deadlineStr, grade, precedingCount, latePenalty) {
    let timeBonus = 0;
    let gradeBonus = 0;
    
    // Grade bonus: ≥90 = +50 XP, ≥75 = +25 XP, ≥60 = +10 XP, <60 = +0
    const gradeNum = parseFloat(grade) || 0;
    if (gradeNum >= 90) gradeBonus = 50;
    else if (gradeNum >= 75) gradeBonus = 25;
    else if (gradeNum >= 60) gradeBonus = 10;
    
    let fastBonus = 0;
    if (precedingCount === 0) {
        fastBonus = 20;
    } else if (precedingCount >= 1 && precedingCount <= 4) {
        fastBonus = 10;
    }

    const monthMap = {
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mei': 4, 'jun': 5,
        'jul': 6, 'agu': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'des': 11,
        'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5,
        'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11
    };

    const parseDate = (str) => {
        if (!str) return null;
        const match = str.match(/(\d+)\s+([A-Za-z]+)\s+(\d{4})/);
        if (!match) return null;
        const day = parseInt(match[1]);
        const monthStr = match[2].toLowerCase();
        const year = parseInt(match[3]);
        const month = monthMap[monthStr] !== undefined ? monthMap[monthStr] : 0;
        return new Date(year, month, day);
    };

    const submittedDate = parseDate(submittedDateStr);
    const deadlineDate = parseDate(deadlineStr);

    let isLate = false;
    if (submittedDate && deadlineDate) {
        submittedDate.setHours(0, 0, 0, 0);
        deadlineDate.setHours(0, 0, 0, 0);
        if (submittedDate.getTime() > deadlineDate.getTime()) {
            isLate = true;
        }
    }

    if (isLate) {
        timeBonus = -Math.abs(latePenalty !== undefined ? latePenalty : 30);
    } else {
        timeBonus = fastBonus;
    }
    
    return { timeBonus, gradeBonus, totalBonus: timeBonus + gradeBonus };
}

function calculateClassBadges(localXp) {
    const badges = [];
    if (localXp >= 500) badges.push('data_explorer');
    if (localXp >= 1000) badges.push('query_master');
    if (localXp >= 1500) badges.push('class_champion');
    if (localXp >= 2000) badges.push('class_master');
    return badges;
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
                    `INSERT INTO sim_users (name, nim, email, password, role, avatar, frame, rank, xp, level, status, badges, skills, username, faculty, major)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
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
                        generateUsername(userData.name),
                        userData.faculty || '',
                        userData.major || ''
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
    
    getClassById: (classId) => {
        return executeQuery(
            async () => {
                const res = await pool.query('SELECT * FROM sim_classes WHERE id = $1', [classId]);
                return res.rows[0] ? mapClassToJs(res.rows[0]) : null;
            },
            () => {
                const data = readDb();
                return data.classes.find(c => c.id === classId) || null;
            }
        );
    },

    isStudentEnrolled: (studentNim, classId) => {
        return executeQuery(
            async () => {
                const res = await pool.query(
                    'SELECT 1 FROM sim_enrollments WHERE student_nim = $1 AND class_id = $2',
                    [studentNim, classId]
                );
                return res.rows.length > 0;
            },
            () => {
                const data = readDb();
                return data.enrollments.some(e => e.studentNim === studentNim && e.classId === classId);
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

    getQuestById: (questId) => {
        return executeQuery(
            async () => {
                const res = await pool.query('SELECT * FROM sim_quests WHERE id = $1', [questId]);
                if (res.rows.length === 0) return null;
                const row = res.rows[0];
                return {
                    id: row.id,
                    classId: row.class_id,
                    title: row.title,
                    description: row.description,
                    xpReward: row.xp_reward,
                    coinReward: row.coin_reward,
                    deadline: row.deadline,
                    lecturerFiles: typeof row.lecturer_files === 'string' ? JSON.parse(row.lecturer_files) : (row.lecturer_files || []),
                    allowLateSubmission: row.allow_late_submission !== false,
                    latePenalty: row.late_penalty !== undefined ? row.late_penalty : 30
                };
            },
            () => {
                const data = readDb();
                const q = (data.quests || []).find(x => x.id === parseInt(questId));
                if (!q) return null;
                return {
                    ...q,
                    allowLateSubmission: q.allowLateSubmission !== false,
                    latePenalty: q.latePenalty !== undefined ? q.latePenalty : 30
                };
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
                    lecturerFiles: typeof row.lecturer_files === 'string' ? JSON.parse(row.lecturer_files) : (row.lecturer_files || []),
                    allowLateSubmission: row.allow_late_submission !== false,
                    latePenalty: row.late_penalty !== undefined ? row.late_penalty : 30
                }));
            },
            () => {
                const data = readDb();
                return (data.quests || []).filter(q => q.classId === classId).map(q => ({
                    ...q,
                    allowLateSubmission: q.allowLateSubmission !== false,
                    latePenalty: q.latePenalty !== undefined ? q.latePenalty : 30
                }));
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
                        allowLateSubmission: q.allow_late_submission !== false,
                        latePenalty: q.late_penalty !== undefined ? q.late_penalty : 30,
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
                        allowLateSubmission: q.allowLateSubmission !== false,
                        latePenalty: q.latePenalty !== undefined ? q.latePenalty : 30,
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
                    `INSERT INTO sim_quests (class_id, title, description, xp_reward, coin_reward, deadline, lecturer_files, allow_late_submission, late_penalty) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                    [
                        questData.classId,
                        questData.title,
                        questData.description,
                        questData.xpReward || 100,
                        questData.coinReward || 50,
                        questData.deadline || '',
                        JSON.stringify(questData.lecturerFiles || []),
                        questData.allowLateSubmission !== false,
                        questData.latePenalty !== undefined ? questData.latePenalty : 30
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
                    lecturerFiles: typeof q.lecturer_files === 'string' ? JSON.parse(q.lecturer_files) : (q.lecturer_files || []),
                    allowLateSubmission: q.allow_late_submission !== false,
                    latePenalty: q.late_penalty !== undefined ? q.late_penalty : 30
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
                    lecturerFiles: questData.lecturerFiles || [],
                    allowLateSubmission: questData.allowLateSubmission !== false,
                    latePenalty: questData.latePenalty !== undefined ? questData.latePenalty : 30
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
                
                const checkRes = await pool.query(
                    `SELECT * FROM sim_submissions WHERE student_nim = $1 AND quest_id = $2`,
                    [studentNim, questId]
                );
                
                if (checkRes.rows.length > 0) {
                    const existing = checkRes.rows[0];
                    if (existing.status === 'completed') {
                        return { error: 'Tugas sudah dinilai, tidak dapat diubah.' };
                    }
                    const updateRes = await pool.query(
                        `UPDATE sim_submissions 
                         SET submitted_file = $1, submitted_date = $2 
                         WHERE student_nim = $3 AND quest_id = $4 RETURNING *`,
                        [submittedFile, dateStr, studentNim, questId]
                    );
                    return updateRes.rows[0];
                } else {
                    const res = await pool.query(
                        `INSERT INTO sim_submissions (student_nim, quest_id, submitted_file, submitted_date, status)
                         VALUES ($1, $2, $3, $4, 'pending_grade') RETURNING *`,
                        [studentNim, questId, submittedFile, dateStr]
                    );
                    return res.rows[0];
                }
            },
            () => {
                const data = readDb();
                const now = new Date();
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
                
                if (!data.submissions) data.submissions = [];
                const existing = data.submissions.find(s => s.studentNim === studentNim && s.questId === parseInt(questId));
                
                if (existing) {
                    if (existing.status === 'completed') {
                        return { error: 'Tugas sudah dinilai, tidak dapat diubah.' };
                    }
                    existing.submittedFile = submittedFile;
                    existing.submittedDate = dateStr;
                    writeDb(data);
                    return existing;
                } else {
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
                    data.submissions.push(sub);
                    writeDb(data);
                    return sub;
                }
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

                const orderRes = await pool.query(
                    `SELECT COUNT(*) FROM sim_submissions WHERE quest_id = $1 AND id < $2`,
                    [sub.quest_id, sub.id]
                );
                const precedingCount = parseInt(orderRes.rows[0].count);

                const bonus = calculateXpBonus(sub.submitted_date, quest.deadline, grade, precedingCount, quest.late_penalty);
                const totalXp = Math.max(0, quest.xp_reward + bonus.totalBonus);

                await pool.query(
                    `UPDATE sim_submissions SET grade = $1, feedback = $2, status = 'completed' WHERE id = $3`,
                    [grade, feedback, submissionId]
                );

                await pool.query(
                    `UPDATE sim_enrollments 
                     SET local_xp = COALESCE(local_xp, 0) + $1 
                     WHERE student_nim = $2 AND class_id = $3`,
                    [totalXp, sub.student_nim, quest.class_id]
                );

                // Fetch new local_xp to compute badges and completeness
                const enrollRes = await pool.query(
                    `SELECT local_xp FROM sim_enrollments WHERE student_nim = $1 AND class_id = $2`,
                    [sub.student_nim, quest.class_id]
                );
                const newLocalXp = enrollRes.rows[0] ? enrollRes.rows[0].local_xp : 0;
                const badges = calculateClassBadges(newLocalXp);
                const isCompleted = newLocalXp >= 2000;

                await pool.query(
                    `UPDATE sim_enrollments 
                     SET class_badges = $1, is_completed = $2 
                     WHERE student_nim = $3 AND class_id = $4`,
                    [JSON.stringify(badges), isCompleted, sub.student_nim, quest.class_id]
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

                return { success: true, xpGained: totalXp };
            },
            () => {
                const data = readDb();
                const sub = data.submissions.find(s => s.id === parseInt(submissionId));
                if (!sub) return { error: 'Submission tidak ditemukan.' };
                if (sub.status === 'completed') return { error: 'Submission sudah dinilai.' };

                const quest = data.quests.find(q => q.id === sub.questId);
                const baseXp = quest ? quest.xpReward : 100;

                const questSubmissions = data.submissions.filter(s => s.questId === sub.questId).sort((a, b) => a.id - b.id);
                const myIndex = questSubmissions.findIndex(s => s.id === sub.id);
                const precedingCount = myIndex >= 0 ? myIndex : questSubmissions.length;
                const latePenalty = quest ? quest.latePenalty : 30;

                const bonus = calculateXpBonus(sub.submittedDate, quest ? quest.deadline : '', grade, precedingCount, latePenalty);
                const totalXp = Math.max(0, baseXp + bonus.totalBonus);

                sub.grade = grade;
                sub.feedback = feedback;
                sub.status = 'completed';

                let enrollment = data.enrollments.find(e => e.studentNim === sub.studentNim && e.classId === (quest ? quest.classId : 'SIM-MN8-2025'));
                if (!enrollment) {
                    enrollment = { studentNim: sub.studentNim, classId: quest ? quest.classId : 'SIM-MN8-2025', localXp: 0, classBadges: [], isCompleted: false, coinsClaimed: false };
                    data.enrollments.push(enrollment);
                }

                enrollment.localXp = (enrollment.localXp || 0) + totalXp;
                enrollment.classBadges = calculateClassBadges(enrollment.localXp);
                enrollment.isCompleted = enrollment.localXp >= 2000;

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
                return { success: true, xpGained: totalXp };
            }
        );
    },

    getShopItems: () => {
        return executeQuery(
            async () => {
                const res = await pool.query('SELECT * FROM sim_shop_items ORDER BY price ASC');
                return res.rows.map(row => ({
                    itemId: row.item_id,
                    itemType: row.item_type,
                    name: row.name,
                    description: row.description,
                    price: row.price,
                    icon: row.icon,
                    cssClass: row.css_class
                }));
            },
            () => {
                const data = readDb();
                return data.shopItems || [];
            }
        );
    },

    purchaseItem: (studentNim, itemId) => {
        return executeQuery(
            async () => {
                const userRes = await pool.query('SELECT * FROM sim_users WHERE nim = $1', [studentNim]);
                if (userRes.rows.length === 0) return { error: 'User tidak ditemukan.' };
                const user = mapUserToJs(userRes.rows[0]);

                const itemRes = await pool.query('SELECT * FROM sim_shop_items WHERE item_id = $1', [itemId]);
                if (itemRes.rows.length === 0) return { error: 'Item toko tidak ditemukan.' };
                const item = itemRes.rows[0];

                if (user.global_coins < item.price) {
                    return { error: 'Koin global tidak cukup!' };
                }

                if (item.item_type === 'frame') {
                    if (user.owned_frames.includes(itemId)) {
                        return { error: 'Anda sudah memiliki bingkai ini!' };
                    }
                    user.owned_frames.push(itemId);
                    await pool.query(
                        'UPDATE sim_users SET global_coins = global_coins - $1, owned_frames = $2 WHERE nim = $3',
                        [item.price, JSON.stringify(user.owned_frames), studentNim]
                    );
                } else if (item.item_type === 'badge') {
                    if (user.owned_badges.includes(itemId)) {
                        return { error: 'Anda sudah memiliki lencana ini!' };
                    }
                    user.owned_badges.push(itemId);
                    await pool.query(
                        'UPDATE sim_users SET global_coins = global_coins - $1, owned_badges = $2 WHERE nim = $3',
                        [item.price, JSON.stringify(user.owned_badges), studentNim]
                    );
                }

                await pool.query(
                    'INSERT INTO sim_purchases (student_nim, item_id) VALUES ($1, $2)',
                    [studentNim, itemId]
                );

                return { success: true };
            },
            () => {
                const data = readDb();
                const user = data.users.find(u => u.NIM === studentNim);
                if (!user) return { error: 'User tidak ditemukan.' };

                const item = data.shopItems.find(i => i.itemId === itemId);
                if (!item) return { error: 'Item toko tidak ditemukan.' };

                if ((user.global_coins || 0) < item.price) {
                    return { error: 'Koin global tidak cukup!' };
                }

                if (!user.owned_frames) user.owned_frames = [];
                if (!user.owned_badges) user.owned_badges = [];

                if (item.itemType === 'frame') {
                    if (user.owned_frames.includes(itemId)) return { error: 'Anda sudah memiliki bingkai ini!' };
                    user.owned_frames.push(itemId);
                } else if (item.itemType === 'badge') {
                    if (user.owned_badges.includes(itemId)) return { error: 'Anda sudah memiliki lencana ini!' };
                    user.owned_badges.push(itemId);
                }

                user.global_coins = (user.global_coins || 0) - item.price;
                if (!data.purchases) data.purchases = [];
                data.purchases.push({ studentNim, itemId, purchasedAt: new Date().toISOString() });

                writeDb(data);
                return { success: true };
            }
        );
    },

    equipFrame: (studentNim, frameId) => {
        return executeQuery(
            async () => {
                const userRes = await pool.query('SELECT * FROM sim_users WHERE nim = $1', [studentNim]);
                if (userRes.rows.length === 0) return { error: 'User tidak ditemukan.' };
                const user = mapUserToJs(userRes.rows[0]);

                if (frameId && !user.owned_frames.includes(frameId)) {
                    return { error: 'Anda tidak memiliki bingkai ini!' };
                }

                await pool.query('UPDATE sim_users SET active_frame = $1 WHERE nim = $2', [frameId, studentNim]);
                return { success: true };
            },
            () => {
                const data = readDb();
                const user = data.users.find(u => u.NIM === studentNim);
                if (!user) return { error: 'User tidak ditemukan.' };

                if (frameId && (!user.owned_frames || !user.owned_frames.includes(frameId))) {
                    return { error: 'Anda tidak memiliki bingkai ini!' };
                }

                user.active_frame = frameId;
                writeDb(data);
                return { success: true };
            }
        );
    },

    claimClassCoins: (studentNim, classId) => {
        return executeQuery(
            async () => {
                const enrollRes = await pool.query(
                    'SELECT * FROM sim_enrollments WHERE student_nim = $1 AND class_id = $2',
                    [studentNim, classId]
                );
                if (enrollRes.rows.length === 0) return { error: 'Pendaftaran tidak ditemukan.' };
                const enrollment = mapEnrollmentToJs(enrollRes.rows[0]);

                if (!enrollment.isCompleted) {
                    return { error: 'Kelas belum diselesaikan! Minimal butuh 2000 XP.' };
                }
                if (enrollment.coinsClaimed) {
                    return { error: 'Koin untuk kelas ini sudah diklaim.' };
                }

                const extraXp = Math.max(0, enrollment.localXp - 2000);
                const extraCoins = Math.floor(extraXp / 100) * 10;
                const totalCoinsClaimed = 200 + extraCoins;

                await pool.query(
                    'UPDATE sim_enrollments SET coins_claimed = TRUE WHERE student_nim = $1 AND class_id = $2',
                    [studentNim, classId]
                );

                await pool.query(
                    'UPDATE sim_users SET global_coins = COALESCE(global_coins, 0) + $1 WHERE nim = $2',
                    [totalCoinsClaimed, studentNim]
                );

                return { success: true, coinsClaimed: totalCoinsClaimed };
            },
            () => {
                const data = readDb();
                const enrollment = data.enrollments.find(e => e.studentNim === studentNim && e.classId === classId);
                if (!enrollment) return { error: 'Pendaftaran tidak ditemukan.' };

                if (enrollment.localXp < 2000) {
                    return { error: 'Kelas belum diselesaikan! Minimal butuh 2000 XP.' };
                }
                if (enrollment.coinsClaimed) {
                    return { error: 'Koin untuk kelas ini sudah diklaim.' };
                }

                const extraXp = Math.max(0, enrollment.localXp - 2000);
                const extraCoins = Math.floor(extraXp / 100) * 10;
                const totalCoinsClaimed = 200 + extraCoins;

                enrollment.coinsClaimed = true;
                enrollment.isCompleted = true;

                const user = data.users.find(u => u.NIM === studentNim);
                if (user) {
                    user.global_coins = (user.global_coins || 0) + totalCoinsClaimed;
                }

                writeDb(data);
                return { success: true, coinsClaimed: totalCoinsClaimed };
            }
        );
    },

    getStudentProfile: (studentNim) => {
        return executeQuery(
            async () => {
                const userRes = await pool.query('SELECT * FROM sim_users WHERE nim = $1', [studentNim]);
                if (userRes.rows.length === 0) return null;
                const user = mapUserToJs(userRes.rows[0]);

                const enrollRes = await pool.query(
                    `SELECT e.local_xp, e.class_badges, e.is_completed, e.coins_claimed, c.name as class_name, c.id as class_id
                     FROM sim_enrollments e
                     JOIN sim_classes c ON e.class_id = c.id
                     WHERE e.student_nim = $1`,
                    [studentNim]
                );

                const classes = enrollRes.rows.map(row => ({
                    classId: row.class_id,
                    className: row.class_name,
                    localXp: row.local_xp,
                    classBadges: typeof row.class_badges === 'string' ? JSON.parse(row.class_badges) : (row.class_badges || []),
                    isCompleted: row.is_completed,
                    coinsClaimed: row.coins_claimed
                }));

                return {
                    name: user.name,
                    nim: user.NIM,
                    avatar: user.avatar,
                    activeFrame: user.active_frame,
                    globalCoins: user.global_coins,
                    ownedFrames: user.owned_frames,
                    ownedBadges: user.owned_badges,
                    faculty: user.faculty || '',
                    major: user.major || '',
                    classes: classes
                };
            },
            () => {
                const data = readDb();
                const user = data.users.find(u => u.NIM === studentNim);
                if (!user) return null;

                const enrollments = data.enrollments.filter(e => e.studentNim === studentNim);
                const classes = enrollments.map(e => {
                    const cls = data.classes.find(c => c.id === e.classId);
                    return {
                        classId: e.classId,
                        className: cls ? cls.name : e.classId,
                        localXp: e.localXp || 0,
                        classBadges: e.classBadges || [],
                        isCompleted: e.isCompleted || false,
                        coinsClaimed: e.coinsClaimed || false
                    };
                });

                return {
                    name: user.name,
                    nim: user.NIM,
                    avatar: user.avatar,
                    activeFrame: user.active_frame || '',
                    globalCoins: user.global_coins || 0,
                    ownedFrames: user.owned_frames || [],
                    ownedBadges: user.owned_badges || [],
                    faculty: user.faculty || '',
                    major: user.major || '',
                    classes: classes
                };
            }
        );
    },

    getLeaderboard: (classId, major) => {
        return executeQuery(
            async () => {
                if (classId) {
                    const res = await pool.query(
                        `SELECT u.name, u.nim, u.avatar, u.active_frame, e.local_xp, e.class_badges 
                         FROM sim_enrollments e 
                         JOIN sim_users u ON e.student_nim = u.nim 
                         WHERE e.class_id = $1 
                         ORDER BY e.local_xp DESC`,
                        [classId]
                    );
                    return res.rows.map(row => ({
                        name: row.name,
                        nim: row.nim,
                        avatar: row.avatar,
                        activeFrame: row.active_frame,
                        xp: row.local_xp,
                        badges: typeof row.class_badges === 'string' ? JSON.parse(row.class_badges) : (row.class_badges || [])
                    }));
                } else {
                    let query = `
                        SELECT u.name, u.nim, u.avatar, u.active_frame, u.owned_badges, COALESCE(SUM(e.local_xp), 0) as total_xp 
                        FROM sim_users u 
                        LEFT JOIN sim_enrollments e ON u.nim = e.student_nim 
                        WHERE u.role = 'Mahasiswa'
                    `;
                    const params = [];
                    if (major) {
                        query += ` AND u.major = $1`;
                        params.push(major);
                    }
                    query += `
                        GROUP BY u.id, u.name, u.nim, u.avatar, u.active_frame, u.owned_badges 
                        ORDER BY total_xp DESC
                    `;
                    const res = await pool.query(query, params);
                    return res.rows.map(row => ({
                        name: row.name,
                        nim: row.nim,
                        avatar: row.avatar,
                        activeFrame: row.active_frame,
                        xp: parseInt(row.total_xp),
                        badges: typeof row.owned_badges === 'string' ? JSON.parse(row.owned_badges) : (row.owned_badges || [])
                    }));
                }
            },
            () => {
                const data = readDb();
                if (classId) {
                    const enrolled = data.enrollments.filter(e => e.classId === classId);
                    const list = enrolled.map(e => {
                        const u = data.users.find(usr => usr.NIM === e.studentNim);
                        return {
                            name: u ? u.name : '',
                            nim: e.studentNim,
                            avatar: u ? u.avatar : '',
                            activeFrame: u ? u.active_frame : '',
                            xp: e.localXp || 0,
                            badges: e.classBadges || []
                        };
                    });
                    return list.sort((a, b) => b.xp - a.xp);
                } else {
                    const list = data.users.filter(u => u.role === 'Mahasiswa' && (!major || u.major === major)).map(u => {
                        const studentEnrollments = data.enrollments.filter(e => e.studentNim === u.NIM);
                        const totalXp = studentEnrollments.reduce((sum, e) => sum + (e.localXp || 0), 0);
                        return {
                            name: u.name,
                            nim: u.NIM,
                            avatar: u.avatar,
                            activeFrame: u.active_frame || '',
                            xp: totalXp,
                            badges: u.owned_badges || []
                        };
                    });
                    return list.sort((a, b) => b.xp - a.xp);
                }
            }
        );
    },

    getClassLogs: (classId) => {
        return executeQuery(
            async () => {
                const res = await pool.query('SELECT * FROM sim_class_logs WHERE class_id = $1 ORDER BY id DESC', [classId]);
                return res.rows.map(row => ({
                    id: row.id,
                    classId: row.class_id,
                    activityText: row.activity_text,
                    createdAt: row.created_at
                }));
            },
            () => {
                const data = readDb();
                if (!data.classLogs) data.classLogs = [];
                return data.classLogs.filter(l => l.classId === classId).slice().reverse();
            }
        );
    },

    createClassLog: (classId, activityText) => {
        return executeQuery(
            async () => {
                const res = await pool.query(
                    `INSERT INTO sim_class_logs (class_id, activity_text) VALUES ($1, $2) RETURNING *`,
                    [classId, activityText]
                );
                return res.rows[0];
            },
            () => {
                const data = readDb();
                if (!data.classLogs) data.classLogs = [];
                const newId = data.classLogs.length + 1;
                const newLog = {
                    id: newId,
                    classId,
                    activityText,
                    createdAt: new Date().toISOString()
                };
                data.classLogs.push(newLog);
                writeDb(data);
                return newLog;
            }
        );
    }
};

module.exports = db;
