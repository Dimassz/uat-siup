const fs = require('fs');
const content = fs.readFileSync('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/views/pages/index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('Gabung Kelas') || line.includes('gabung-kelas') || line.includes('input-code') || line.includes('Kode Kelas') || line.includes('kode-kelas')) {
        console.log(`${idx + 1}: ${line}`);
    }
});
