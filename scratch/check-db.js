const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/data/db.json', 'utf8'));
console.log('Class IDs in classes:', db.classes.map(c => c.id));
if (db.materials) {
    console.log('Materials classIds:', db.materials.map(m => ({ id: m.id, title: m.title, classId: m.classId })));
} else {
    console.log('No materials key in db.json!');
}
