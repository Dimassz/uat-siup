const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/data/db.json', 'utf8'));
console.log('JSON DB Enrollments:', db.enrollments);
console.log('JSON DB Users:', db.users.filter(u => u.role === 'Mahasiswa').map(u => u.NIM));
