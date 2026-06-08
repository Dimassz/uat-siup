const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/my-classes',
    method: 'GET',
    headers: {
        'Cookie': 'connect.sid=s%3ATfO9cx50fShWetmOSGsQrRc7IYEeEfvP.5TficZCbO52Iav7Ko35%2FyCphiEgvnuwVUtGCfe9VWmw'
    }
};

http.get(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('STATUS:', res.statusCode);
        console.log('BODY:', data);
    });
}).on('error', (err) => {
    console.error('ERROR:', err.message);
});
