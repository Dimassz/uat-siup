const fs = require('fs');
const content = fs.readFileSync('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/views/pages/detail.html', 'utf8');
const matches = content.match(/id="[^"]*modal[^"]*"/gi);
console.log('Modal IDs found:', matches);
