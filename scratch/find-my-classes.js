const fs = require('fs');
const content = fs.readFileSync('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/db.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('getMyClasses') || line.includes('function getMyClasses')) {
        console.log(`${idx + 1}: ${line}`);
    }
});
