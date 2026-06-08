const http = require('http');

const cookie = 'connect.sid=s%3ATfO9cx50fShWetmOSGsQrRc7IYEeEfvP.5TficZCbO52Iav7Ko35%2FyCphiEgvnuwVUtGCfe9VWmw';

function fetchPath(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET',
            headers: {
                'Cookie': cookie
            }
        };
        http.get(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({ status: res.statusCode, body: data });
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

(async () => {
    try {
        console.log('Fetching detail context API:');
        const me = await fetchPath('/api/me');
        console.log('/api/me STATUS:', me.status, 'BODY:', me.body);

        const myClasses = await fetchPath('/api/my-classes');
        console.log('/api/my-classes STATUS:', myClasses.status, 'BODY:', myClasses.body.slice(0, 100));

        const cls = await fetchPath('/api/classes/SIM-MN8-2025');
        console.log('/api/classes/SIM-MN8-2025 STATUS:', cls.status, 'BODY:', cls.body);

        const materials = await fetchPath('/api/classes/SIM-MN8-2025/materials');
        console.log('/api/classes/SIM-MN8-2025/materials STATUS:', materials.status, 'BODY:', materials.body.slice(0, 200));

        const quests = await fetchPath('/api/classes/SIM-MN8-2025/quests');
        console.log('/api/classes/SIM-MN8-2025/quests STATUS:', quests.status, 'BODY:', quests.body.slice(0, 200));

        const logs = await fetchPath('/api/classes/SIM-MN8-2025/logs');
        console.log('/api/classes/SIM-MN8-2025/logs STATUS:', logs.status, 'BODY:', logs.body);

        const participants = await fetchPath('/api/class-participants?classId=SIM-MN8-2025');
        console.log('/api/class-participants STATUS:', participants.status, 'BODY:', participants.body.slice(0, 200));

    } catch (err) {
        console.error('ERROR:', err);
    }
})();
