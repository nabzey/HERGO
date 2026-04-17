const { sendTransactionalEmail } = require('../config/brevo');

const sendEmailSafely = async (payload) => {
  try {
    if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
      console.warn('Brevo email non configuré, envoi ignoré');
      return false;
    }

    await sendTransactionalEmail(payload);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email via Brevo:", error.message);
    return false;
  }
};

const emailHelper = {
  sendRegistrationEmail: async (email, firstName, continuationLink) =>
    sendEmailSafely({
      to: {
        email,
        name: firstName,
      },
      subject: 'Poursuivez votre inscription sur Hergo',
      htmlContent: `
        <html>
          <body>
            <h2>Bienvenue ${firstName},</h2>
            <p>Votre compte Hergo a bien ete cree.</p>
            <p>Utilisez ce lien pour continuer votre inscription et finaliser votre acces a la plateforme :</p>
            <p><a href="${continuationLink}">${continuationLink}</a></p>
          </body>
        </html>
      `,
      textContent: `Bienvenue ${firstName}, poursuivez votre inscription Hergo ici: ${continuationLink}`,
      tags: ['registration'],
    }),

  sendReservationEmail: async (email, firstName, reservationDetails) =>
    sendEmailSafely({
      to: {
        email,
        name: firstName,
      },
      subject: 'Confirmation de reservation',
      htmlContent: `
        <html>
          <body>
            <h2>Bonjour ${firstName},</h2>
            <p>Votre reservation pour <strong>${reservationDetails.titre || 'votre logement'}</strong> a bien ete enregistree.</p>
            <p>Du ${new Date(reservationDetails.dateDebut).toLocaleDateString('fr-FR')} au ${new Date(reservationDetails.dateFin).toLocaleDateString('fr-FR')}.</p>
          </body>
        </html>
      `,
      textContent: `Bonjour ${firstName}, votre reservation pour ${reservationDetails.titre || 'votre logement'} a bien ete enregistree.`,
      tags: ['reservation-created'],
    }),

  sendCancelationEmail: async (email, firstName, reservationDetails) =>
    sendEmailSafely({
      to: {
        email,
        name: firstName,
      },
      subject: 'Annulation de reservation',
      htmlContent: `
        <html>
          <body>
            <h2>Bonjour ${firstName},</h2>
            <p>Votre reservation pour <strong>${reservationDetails.titre || 'votre logement'}</strong> a ete annulee.</p>
          </body>
        </html>
      `,
      textContent: `Bonjour ${firstName}, votre reservation pour ${reservationDetails.titre || 'votre logement'} a ete annulee.`,
      tags: ['reservation-cancelled'],
    }),

  sendHostNotificationEmail: async (email, firstName, reservationDetails) =>
    sendEmailSafely({
      to: {
        email,
        name: firstName,
      },
      subject: 'Nouvelle reservation recue',
      htmlContent: `
        <html>
          <body>
            <h2>Bonjour ${firstName},</h2>
            <p>Vous avez recu une nouvelle reservation pour <strong>${reservationDetails.titre || 'votre logement'}</strong>.</p>
          </body>
        </html>
      `,
      textContent: `Bonjour ${firstName}, vous avez recu une nouvelle reservation pour ${reservationDetails.titre || 'votre logement'}.`,
      tags: ['host-notification'],
    }),
};

module.exports = emailHelper;
