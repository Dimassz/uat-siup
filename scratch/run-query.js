const db = require('../db');
(async () => {
    try {
        console.log('Testing getClassMaterialsWithStatus for SIM-MN8-2025:');
        const res = await db.getClassMaterialsWithStatus('SIM-MN8-2025', '10201210007');
        console.log('Results:', res);
    } catch (err) {
        console.error(err);
    }
})();
