const fs = require('fs');
const content = fs.readFileSync('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/views/pages/detail.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('initClassContext') || line.includes('activeClassId') || line.includes('classId =')) {
        console.log(`${idx + 1}: ${line}`);
    }
});
