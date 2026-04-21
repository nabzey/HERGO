const express = require('express');
const { sendTransactionalEmail, sendTransactionalSms } = require('../config/brevo');
const env = require('../config/env');
const router = express.Router();

// GET /api/test/brevo-email?email=test@example.com
router.get('/brevo-email', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: 'Paramètre email requis' });

  if (!env.BREVO_API_KEY) {
    return res.status(503).json({ message: 'BREVO_API_KEY non configurée dans .env' });
  }

  try {
    await sendTransactionalEmail({
      to: { email, name: 'Test Hergo' },
      subject: '✅ Test Brevo — Hergo',
      htmlContent: `
        <html><body>
          <h2>Test réussi !</h2>
          <p>La configuration Brevo de Hergo fonctionne correctement.</p>
          <p>Envoyé depuis : ${env.BREVO_SENDER_EMAIL}</p>
        </body></html>
      `,
      textContent: 'Test Brevo Hergo fonctionnel.',
      tags: ['test'],
    });
    res.json({ success: true, message: `Email de test envoyé à ${email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/test/brevo-sms?phone=+33612345678
router.get('/brevo-sms', async (req, res) => {
  const phone = req.query.phone;
  if (!phone) return res.status(400).json({ message: 'Paramètre phone requis (ex: +33612345678)' });

  if (!env.BREVO_API_KEY) {
    return res.status(503).json({ message: 'BREVO_API_KEY non configurée dans .env' });
  }

  try {
    await sendTransactionalSms({
      recipient: phone,
      content: 'Test SMS Hergo — configuration fonctionnelle !',
      tag: 'test',
    });
    res.json({ success: true, message: `SMS de test envoyé à ${phone}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/test/config — vérifie les variables d'environnement tierces
router.get('/config', (req, res) => {
  res.json({
    brevo: {
      apiKey: env.BREVO_API_KEY ? '✅ configurée' : '❌ manquante',
      senderEmail: env.BREVO_SENDER_EMAIL || '❌ manquante',
      smsSender: env.BREVO_SMS_SENDER || '❌ manquante',
    },
    cloudinary: {
      cloudName: env.CLOUDINARY_CLOUD_NAME ? '✅ configuré' : '❌ manquant',
      apiKey: env.CLOUDINARY_API_KEY ? '✅ configurée' : '❌ manquante',
      apiSecret: env.CLOUDINARY_API_SECRET ? '✅ configurée' : '❌ manquante',
    },
  });
});

module.exports = router;
