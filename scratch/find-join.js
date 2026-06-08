const fs = require('fs');
const content = fs.readFileSync('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/routes/index.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('join') || line.includes('enroll') || line.includes('code') || line.includes('join-class')) {
        console.log(`${idx + 1}: ${line}`);
    }
});
