const fs = require('fs');
const content = fs.readFileSync('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/views/pages/index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('enroll') || line.includes('join') || line.includes('gabung') || line.includes('gabung-kelas') || line.includes('class-code') || line.includes('code-input')) {
        console.log(`${idx + 1}: ${line}`);
    }
});
