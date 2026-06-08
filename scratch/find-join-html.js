const fs = require('fs');
const content = fs.readFileSync('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/views/pages/index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('join') || line.includes('enroll') || line.includes('kode') || line.includes('code') || line.includes('api/')) {
        console.log(`${idx + 1}: ${line}`);
    }
});
