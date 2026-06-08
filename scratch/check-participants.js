const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

(async () => {
    try {
        console.log('Enrollments in Postgres:');
        const enrollRes = await pool.query("SELECT * FROM sim_enrollments");
        console.log(enrollRes.rows);

        console.log('Classes in Postgres:');
        const classRes = await pool.query("SELECT * FROM sim_classes");
        console.log(classRes.rows.map(c => c.id));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
})();
