const { sendTransactionalSms } = require('../config/brevo');

const sendSmsSafely = async ({ phone, content, tag }) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.warn('Brevo SMS non configuré, envoi ignoré');
      return false;
    }

    if (!phone) {
      return false;
    }

    await sendTransactionalSms({
      recipient: phone,
      content,
      tag,
    });

    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS via Brevo:", error.message);
    return false;
  }
};

const smsHelper = {
  sendRegistrationSms: async (phone, firstName, continuationLink) =>
    sendSmsSafely({
      phone,
      content: `Bienvenue ${firstName} sur Hergo. Continuez votre inscription ici: ${continuationLink}`,
      tag: 'registration',
    }),

  sendReservationSms: async (phone, reservationDetails) =>
    sendSmsSafely({
      phone,
      content: `Reservation Hergo confirmee pour ${reservationDetails.titre || 'votre logement'}.`,
      tag: 'reservation-created',
    }),

  sendCancelationSms: async (phone, reservationDetails) =>
    sendSmsSafely({
      phone,
      content: `Votre reservation Hergo pour ${reservationDetails.titre || 'votre logement'} a ete annulee.`,
      tag: 'reservation-cancelled',
    }),
};

module.exports = smsHelper;
