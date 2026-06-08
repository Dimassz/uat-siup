const http = require('http');

http.get('http://localhost:3000/api/class-participants?classId=SIM-MN8-2025', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('STATUS:', res.statusCode);
        console.log('HEADERS:', res.headers);
        console.log('BODY:', data.slice(0, 500));
    });
}).on('error', (err) => {
    console.error('ERROR connecting to server:', err.message);
});


