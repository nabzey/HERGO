const { pool } = require('../config/prisma');

const getCalendarEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const [events] = await pool.execute(
      'SELECT * FROM CalendarEvent WHERE userId = ? AND date >= ? AND date <= ? ORDER BY date ASC',
      [userId, startDate, endDate]
    );

    res.json(events);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const createCalendarEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, date, type, logementId } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO CalendarEvent (title, description, date, type, logementId, userId) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, new Date(date), type, logementId ? parseInt(logementId) : null, userId]
    );

    const [events] = await pool.execute('SELECT * FROM CalendarEvent WHERE id = ?', [result.insertId]);
    res.status(201).json(events[0]);
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const updateCalendarEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, date, type, logementId } = req.body;

    const [existingEvents] = await pool.execute(
      'SELECT * FROM CalendarEvent WHERE id = ? AND userId = ?',
      [parseInt(id), userId]
    );

    if (existingEvents.length === 0) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    await pool.execute(
      'UPDATE CalendarEvent SET title = ?, description = ?, date = ?, type = ?, logementId = ? WHERE id = ?',
      [title, description, new Date(date), type, logementId ? parseInt(logementId) : null, parseInt(id)]
    );

    const [events] = await pool.execute('SELECT * FROM CalendarEvent WHERE id = ?', [parseInt(id)]);
    res.json(events[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const deleteCalendarEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [existingEvents] = await pool.execute(
      'SELECT * FROM CalendarEvent WHERE id = ? AND userId = ?',
      [parseInt(id), userId]
    );

    if (existingEvents.length === 0) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    await pool.execute('DELETE FROM CalendarEvent WHERE id = ?', [parseInt(id)]);

    res.json({ message: 'Événement supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
};