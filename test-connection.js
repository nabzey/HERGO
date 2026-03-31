// Script de test pour vérifier la connexion au backend
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

async function testConnection() {
  console.log('Test de connexion au backend...');
  
  try {
    // Test de la route de santé
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Route de santé:', healthData);
    
    // Test de la route de login (avec des données invalides pour voir si la validation fonctionne)
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Route de login (réponse):', loginData);
    
    console.log('\n✅ Le backend est accessible et répond correctement.');
    console.log('Si vous ne pouvez toujours pas vous connecter, vérifiez:');
    console.log('1. Que le backend est démarré (npm start dans hergo-back)');
    console.log('2. Que le frontend est démarré (npm run dev dans hergo-front)');
    console.log('3. Que la base de données est accessible');
    console.log('4. Les logs du backend pour voir les erreurs');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.log('\nLe backend n\'est pas accessible. Vérifiez:');
    console.log('1. Que le backend est démarré (npm start dans hergo-back)');
    console.log('2. Que le port 5000 n\'est pas utilisé par un autre processus');
    console.log('3. Que le fichier .env est correctement configuré');
  }
}

testConnection();