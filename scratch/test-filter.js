const db = require('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/db.js');

async function test() {
    try {
        const classId = 'ENG-II-2025';
        const data = await db.getUsers();
        const classes = await db.getClasses();
        const enrollments = await db.getEnrollments();

        const targetClass = classes.find(c => c.id === classId);
        console.log('Target Class:', targetClass ? targetClass.id : 'NOT FOUND');

        if (targetClass) {
            const studentNimsInClass = enrollments
                .filter(e => e.classId === targetClass.id)
                .map(e => e.studentNim);
            
            console.log('Student NIMs in class:', studentNimsInClass);

            const students = data
                .filter(u => u.role === 'Mahasiswa' && studentNimsInClass.includes(u.NIM))
                .map(student => ({ name: student.name, NIM: student.NIM }));

            console.log('Students filtered count:', students.length);
            console.log('Students filtered:', students);
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

test();
