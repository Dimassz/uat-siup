const db = require('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/db.js');

async function test() {
    try {
        const enrollments = await db.getEnrollments();
        console.log('Enrollments count:', enrollments.length);
        console.log('Enrollments data:', enrollments.slice(0, 5));
        const users = await db.getUsers();
        console.log('Users in DB count:', users.length);
        const classes = await db.getClasses();
        console.log('Classes:', classes.map(c => ({ id: c.id, name: c.name })));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}

test();
