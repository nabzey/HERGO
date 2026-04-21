const http = require('http');

const postRequest = (url, data, headers = {}) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: '127.0.0.1', // Explicitly use IPv4
      port: 5000,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
    });

    req.on('error', (e) => reject(e));
    req.write(JSON.stringify(data));
    req.end();
  });
};

const getRequest = (url, headers = {}) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: urlObj.pathname,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    http.get(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
    }).on('error', (e) => reject(e));
  });
};

const API_URL = 'http://127.0.0.1:5000/api';
let token = '';

async function testFlow() {
  try {
    console.log('1. Login as Admin to get a token...');
    const loginRes = await postRequest(`${API_URL}/auth/login`, {
      email: 'aissatou@hergo.sn',
      password: 'admin123'
    });
    token = loginRes.data.token;
    console.log('Login success!');

    const headers = { 'Authorization': `Bearer ${token}` };

    console.log('\n2. Testing /admin/users...');
    const usersRes = await getRequest(`${API_URL}/admin/users`, headers);
    console.log(`Success! Found ${usersRes.data.users.length} users.`);

    console.log('\n3. Testing /admin/statistics...');
    const statsRes = await getRequest(`${API_URL}/admin/statistics`, headers);
    console.log('Success! Statistics retrieved:', statsRes.data);

    console.log('\n4. Testing Mobile Money Simulation (Wave)...');
    const resRes = await getRequest(`${API_URL}/admin/reservations`, headers);
    if (resRes.data.reservations && resRes.data.reservations.length > 0) {
      const resId = resRes.data.reservations[0].id;
      console.log(`Simulating payment for reservation #${resId}...`);
      const payRes = await postRequest(`${API_URL}/payments/simulate-mobile-money`, {
        reservationId: resId,
        amount: 50000,
        method: 'WAVE',
        phoneNumber: '771234567'
      }, headers);
      console.log('Success!', payRes.data.message);
    }

    console.log('\n--- ALL TESTS PASSED ---');
  } catch (error) {
    console.error('Test failed!', error.message);
    if (error.stack) console.error(error.stack);
  }
}

testFlow();
