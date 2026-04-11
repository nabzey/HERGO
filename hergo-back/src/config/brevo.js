const env = require('./env');

const BREVO_BASE_URL = 'https://api.brevo.com/v3';

const assertBrevoKey = () => {
  if (!env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY manquant');
  }
};

const brevoRequest = async (path, payload) => {
  assertBrevoKey();

  const response = await fetch(`${BREVO_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': env.BREVO_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo ${response.status}: ${errorBody}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const sendTransactionalEmail = async ({ to, subject, htmlContent, textContent, params, tags }) => {
  if (!env.BREVO_SENDER_EMAIL) {
    throw new Error('BREVO_SENDER_EMAIL manquant');
  }

  return brevoRequest('/smtp/email', {
    sender: {
      email: env.BREVO_SENDER_EMAIL,
      name: env.BREVO_SENDER_NAME,
    },
    to: Array.isArray(to) ? to : [to],
    subject,
    htmlContent,
    textContent,
    params,
    tags,
  });
};

const sendTransactionalSms = async ({ recipient, content, type = 'transactional', tag, sender }) => {
  return brevoRequest('/transactionalSMS/sms', {
    sender: sender || env.BREVO_SMS_SENDER,
    recipient,
    content,
    type,
    tag,
  });
};

module.exports = {
  sendTransactionalEmail,
  sendTransactionalSms,
};
