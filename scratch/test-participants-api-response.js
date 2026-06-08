const db = require('../db');

(async () => {
    try {
        const data = await db.getUsers();
        const classes = await db.getClasses();
        const enrollments = await db.getEnrollments();
        
        for (const cls of classes) {
            console.log(`\nTesting class participants for ${cls.id} (${cls.name}):`);
            const targetClass = cls;
            
            // Filter enrollments
            const studentNimsInClass = enrollments
                .filter(e => e.classId === targetClass.id)
                .map(e => e.studentNim);
                
            console.log(`- studentNimsInClass:`, studentNimsInClass);

            const students = data
                .filter(u => u.role === 'Mahasiswa' && studentNimsInClass.includes(u.NIM))
                .map(student => {
                    const enrollment = enrollments.find(e => e.studentNim === student.NIM && e.classId === targetClass.id);
                    return {
                        name: student.name,
                        NIM: student.NIM,
                        xp: enrollment ? (enrollment.localXp || 0) : (student.xp || 0),
                        level: student.level || 'Level 1',
                        status: student.status || 'Apprentice',
                        role: 'Mahasiswa',
                        avatar: student.avatar,
                        frame: student.active_frame || student.frame || '',
                        badges: student.owned_badges || [],
                        skills: student.skills || { db: 0, analysis: 0, layout: 0, api: 0, security: 0, vocal: 0 },
                        faculty: student.faculty || '',
                        major: student.major || ''
                    };
                });
            console.log(`- students count:`, students.length);
        }
        console.log('\nAll classes simulated successfully without throwing!');
    } catch (e) {
        console.error('SIMULATION FAILED:', e);
    } finally {
        process.exit(0);
    }
})();
