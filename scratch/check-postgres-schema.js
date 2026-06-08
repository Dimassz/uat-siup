const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

(async () => {
    try {
        console.log('Postgres columns for sim_materials:');
        const matCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sim_materials'");
        console.log(matCols.rows);

        console.log('Postgres columns for sim_student_materials:');
        const smCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sim_student_materials'");
        console.log(smCols.rows);

        console.log('Number of rows in sim_materials:');
        const countRes = await pool.query("SELECT COUNT(*) FROM sim_materials");
        console.log(countRes.rows[0]);

        console.log('Sample rows in sim_materials:');
        const sampleRes = await pool.query("SELECT * FROM sim_materials LIMIT 2");
        console.log(sampleRes.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
})();
