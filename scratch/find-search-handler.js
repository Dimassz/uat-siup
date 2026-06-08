const fs = require('fs');
const content = fs.readFileSync('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/views/pages/index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('Cari') || line.includes('cari') || line.includes('search') || line.includes('filter')) {
        console.log(`${idx + 1}: ${line}`);
    }
});
