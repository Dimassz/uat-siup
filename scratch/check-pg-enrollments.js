const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

(async () => {
    try {
        const resEnroll = await pool.query('SELECT * FROM sim_enrollments');
        console.log('ENROLLMENTS:', resEnroll.rows);
        const resUsers = await pool.query('SELECT nim, name, role, xp, global_coins FROM sim_users');
        console.log('USERS:', resUsers.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
})();
