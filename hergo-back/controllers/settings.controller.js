const { pool } = require('../config/prisma');

const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const [settings] = await pool.execute(
      'SELECT * FROM UserSettings WHERE userId = ?',
      [userId]
    );

    if (settings.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO UserSettings (userId, emailNotifications, reservationNotifications, departureReminders, monthlyNewsletter, language, currency) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, true, true, false, false, 'fr', 'FCFA']
      );

      const [newSettings] = await pool.execute('SELECT * FROM UserSettings WHERE id = ?', [result.insertId]);
      return res.json(newSettings[0]);
    }

    res.json(settings[0]);
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

    const [existingSettings] = await pool.execute(
      'SELECT * FROM UserSettings WHERE userId = ?',
      [userId]
    );

    if (existingSettings.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO UserSettings (userId, emailNotifications, reservationNotifications, departureReminders, monthlyNewsletter, language, currency) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          userId,
          emailNotifications !== undefined ? emailNotifications : true,
          reservationNotifications !== undefined ? reservationNotifications : true,
          departureReminders !== undefined ? departureReminders : false,
          monthlyNewsletter !== undefined ? monthlyNewsletter : false,
          language !== undefined ? language : 'fr',
          currency !== undefined ? currency : 'FCFA',
        ]
      );

      const [newSettings] = await pool.execute('SELECT * FROM UserSettings WHERE id = ?', [result.insertId]);
      return res.json(newSettings[0]);
    }

    await pool.execute(
      'UPDATE UserSettings SET emailNotifications = ?, reservationNotifications = ?, departureReminders = ?, monthlyNewsletter = ?, language = ?, currency = ? WHERE userId = ?',
      [
        emailNotifications !== undefined ? emailNotifications : existingSettings[0].emailNotifications,
        reservationNotifications !== undefined ? reservationNotifications : existingSettings[0].reservationNotifications,
        departureReminders !== undefined ? departureReminders : existingSettings[0].departureReminders,
        monthlyNewsletter !== undefined ? monthlyNewsletter : existingSettings[0].monthlyNewsletter,
        language !== undefined ? language : existingSettings[0].language,
        currency !== undefined ? currency : existingSettings[0].currency,
        userId,
      ]
    );

    const [updatedSettings] = await pool.execute('SELECT * FROM UserSettings WHERE userId = ?', [userId]);
    res.json(updatedSettings[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};