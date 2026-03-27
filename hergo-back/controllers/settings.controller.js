const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    let settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId,
          emailNotifications: true,
          reservationNotifications: true,
          departureReminders: false,
          monthlyNewsletter: false,
          language: 'fr',
          currency: 'FCFA',
        },
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      emailNotifications,
      reservationNotifications,
      departureReminders,
      monthlyNewsletter,
      language,
      currency,
    } = req.body;

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        emailNotifications,
        reservationNotifications,
        departureReminders,
        monthlyNewsletter,
        language,
        currency,
      },
      create: {
        userId,
        emailNotifications: emailNotifications ?? true,
        reservationNotifications: reservationNotifications ?? true,
        departureReminders: departureReminders ?? false,
        monthlyNewsletter: monthlyNewsletter ?? false,
        language: language ?? 'fr',
        currency: currency ?? 'FCFA',
      },
    });

    res.json(settings);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};