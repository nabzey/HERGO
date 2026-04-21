const { pool } = require('../config/db');

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  reservationNotifications: true,
  departureReminders: false,
  monthlyNewsletter: false,
  language: 'fr',
  currency: 'FCFA',
  theme: 'auto',
};



const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;



    const [settings] = await pool.execute('SELECT * FROM UserSettings WHERE userId = ?', [userId]);

    if (settings.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO UserSettings (userId, emailNotifications, reservationNotifications, departureReminders, monthlyNewsletter, language, currency, theme) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          userId,
          DEFAULT_SETTINGS.emailNotifications,
          DEFAULT_SETTINGS.reservationNotifications,
          DEFAULT_SETTINGS.departureReminders,
          DEFAULT_SETTINGS.monthlyNewsletter,
          DEFAULT_SETTINGS.language,
          DEFAULT_SETTINGS.currency,
          DEFAULT_SETTINGS.theme,
        ]
      );

      const [newSettings] = await pool.execute('SELECT * FROM UserSettings WHERE id = ?', [result.insertId]);
      return res.json(newSettings[0]);
    }

    res.json({
      ...DEFAULT_SETTINGS,
      ...settings[0],
      theme: settings[0].theme || DEFAULT_SETTINGS.theme,
    });
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
      theme,
    } = req.body;



    const [existingSettings] = await pool.execute('SELECT * FROM UserSettings WHERE userId = ?', [userId]);

    if (existingSettings.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO UserSettings (userId, emailNotifications, reservationNotifications, departureReminders, monthlyNewsletter, language, currency, theme) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          userId,
          emailNotifications ?? DEFAULT_SETTINGS.emailNotifications,
          reservationNotifications ?? DEFAULT_SETTINGS.reservationNotifications,
          departureReminders ?? DEFAULT_SETTINGS.departureReminders,
          monthlyNewsletter ?? DEFAULT_SETTINGS.monthlyNewsletter,
          language ?? DEFAULT_SETTINGS.language,
          currency ?? DEFAULT_SETTINGS.currency,
          theme ?? DEFAULT_SETTINGS.theme,
        ]
      );

      const [newSettings] = await pool.execute('SELECT * FROM UserSettings WHERE id = ?', [result.insertId]);
      return res.json(newSettings[0]);
    }

    const current = { ...DEFAULT_SETTINGS, ...existingSettings[0] };

    await pool.execute(
      'UPDATE UserSettings SET emailNotifications = ?, reservationNotifications = ?, departureReminders = ?, monthlyNewsletter = ?, language = ?, currency = ?, theme = ? WHERE userId = ?',
      [
        emailNotifications ?? current.emailNotifications,
        reservationNotifications ?? current.reservationNotifications,
        departureReminders ?? current.departureReminders,
        monthlyNewsletter ?? current.monthlyNewsletter,
        language ?? current.language,
        currency ?? current.currency,
        theme ?? current.theme ?? DEFAULT_SETTINGS.theme,
        userId,
      ]
    );

    const [updatedSettings] = await pool.execute('SELECT * FROM UserSettings WHERE userId = ?', [userId]);
    res.json({
      ...DEFAULT_SETTINGS,
      ...updatedSettings[0],
      theme: updatedSettings[0]?.theme || theme || current.theme || DEFAULT_SETTINGS.theme,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
