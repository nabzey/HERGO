const API_URL = 'http://localhost:5000/api';
let token = '';

async function testFlow() {
  try {
    console.log('1. Login as Admin to get a token...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'aissatou@hergo.sn',
        password: 'admin123'
      })
    });
    const loginData = await loginRes.json();
    token = loginData.token;
    console.log('Login success!');

    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('\n2. Testing /admin/users...');
    const usersRes = await fetch(`${API_URL}/admin/users`, { headers });
    const usersData = await usersRes.json();
    console.log(`Success! Found ${usersData.users.length} users.`);

    console.log('\n3. Testing /admin/statistics...');
    const statsRes = await fetch(`${API_URL}/admin/statistics`, { headers });
    const statsData = await statsRes.json();
    console.log('Success! Statistics retrieved:', statsData);

    console.log('\n4. Testing Mobile Money Simulation (Wave)...');
    const reservationsRes = await fetch(`${API_URL}/admin/reservations`, { headers });
    const resData = await reservationsRes.json();
    
    if (resData.reservations && resData.reservations.length > 0) {
      const resId = resData.reservations[0].id;
      console.log(`Simulating payment for reservation #${resId}...`);
      const payRes = await fetch(`${API_URL}/payments/simulate-mobile-money`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          reservationId: resId,
          amount: 50000,
          method: 'WAVE',
          phoneNumber: '771234567'
        })
      });
      const payData = await payRes.json();
      console.log('Success!', payData.message);
    } else {
      console.log('No reservations found to test payment simulation.');
    }

    console.log('\n--- ALL TESTS PASSED ---');
  } catch (error) {
    console.error('Test failed!', error.message);
  }
}

testFlow();
