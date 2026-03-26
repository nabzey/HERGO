// Ce fichier contient les fonctions pour envoyer des emails
// Dans un projet réel, vous pouvez utiliser Nodemailer avec un service comme Gmail, SendGrid, ou Mailgun

const emailHelper = {
  // Envoi d'un email de confirmation d'inscription
  sendRegistrationEmail: async (email, firstName) => {
    try {
      console.log(`Email de confirmation envoyé à ${email} pour ${firstName}`);
      // Implémentation avec Nodemailer
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  },

  // Envoi d'un email de confirmation de réservation
  sendReservationEmail: async (email, firstName, reservationDetails) => {
    try {
      console.log(`Email de confirmation de réservation envoyé à ${email} pour ${firstName}`);
      console.log('Détails de la réservation:', reservationDetails);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  },

  // Envoi d'un email de confirmation de annulation
  sendCancelationEmail: async (email, firstName, reservationDetails) => {
    try {
      console.log(`Email d'annulation envoyé à ${email} pour ${firstName}`);
      console.log('Détails de la réservation:', reservationDetails);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  },

  // Envoi d'un email de notification de nouvelle réservation (hôte)
  sendHostNotificationEmail: async (email, firstName, reservationDetails) => {
    try {
      console.log(`Email de notification de nouvelle réservation envoyé à ${email} pour ${firstName}`);
      console.log('Détails de la réservation:', reservationDetails);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  },
};

module.exports = emailHelper;