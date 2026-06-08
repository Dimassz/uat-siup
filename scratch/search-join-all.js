const fs = require('fs');
const path = require('path');
const viewsDir = 'c:/Users/dimas/Documents/kampus/sems-6/SIM/web/views/pages';
fs.readdirSync(viewsDir).forEach(file => {
    const content = fs.readFileSync(path.join(viewsDir, file), 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (line.includes('enroll') || line.includes('enrollment') || line.includes('gabung') || line.includes('Gabung')) {
            console.log(`${file}:${idx + 1}: ${line}`);
        }
    });
});
