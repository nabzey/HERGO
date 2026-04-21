const https = require('https');
require('dotenv').config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
console.log('Testing key:', BREVO_API_KEY ? (BREVO_API_KEY.substring(0, 10) + '...') : 'MISSING');

const options = {
  hostname: 'api.brevo.com',
  port: 443,
  path: '/v3/account',
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'api-key': BREVO_API_KEY
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
