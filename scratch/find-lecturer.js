const fs = require('fs');
const content = fs.readFileSync('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/views/pages/lecturer.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('modal') || line.includes('tugas') || line.includes('quest') || line.includes('penalty') || line.includes('late')) {
        console.log(`${idx + 1}: ${line}`);
    }
});
