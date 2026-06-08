const db = require('../db');

(async () => {
    try {
        console.log('Class participants for BISNIS-INTERNASIONAL:');
        const data = await db.getUsers();
        const classes = await db.getClasses();
        const enrollments = await db.getEnrollments();
        
        const targetClass = classes.find(c => c.id === 'BISNIS-INTERNASIONAL');
        console.log('targetClass:', targetClass);

        const studentNimsInClass = enrollments
            .filter(e => e.classId === targetClass.id)
            .map(e => e.studentNim);
        console.log('studentNimsInClass:', studentNimsInClass);

        const students = data
            .filter(u => u.role === 'Mahasiswa' && studentNimsInClass.includes(u.NIM))
            .map(student => {
                const enrollment = enrollments.find(e => e.studentNim === student.NIM && e.classId === targetClass.id);
                return {
                    name: student.name,
                    NIM: student.NIM,
                    xp: enrollment ? (enrollment.localXp || 0) : (student.xp || 0),
                };
            });
        console.log('Students:', students);
    } catch (err) {
        console.error(err);
    }
})();
