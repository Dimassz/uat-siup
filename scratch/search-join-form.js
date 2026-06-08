const fs = require('fs');
const content = fs.readFileSync('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/views/pages/index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('Gabung') || line.includes('gabung') || line.includes('input') || line.includes('Modal') || line.includes('modal')) {
        if (line.includes('kelas') || line.includes('Kelas') || line.includes('code') || line.includes('Code')) {
            console.log(`${idx + 1}: ${line}`);
        }
    }
});
