const { prisma } = require('../config/prisma');

const getCalendarEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const events = await prisma.calendarEvent.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

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

    const event = await prisma.calendarEvent.create({
      data: {
        title,
        description,
        date: new Date(date),
        type,
        logementId: logementId ? parseInt(logementId) : null,
        userId,
      },
    });

    res.status(201).json(event);
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

    const existingEvent = await prisma.calendarEvent.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    });

    if (!existingEvent) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    const event = await prisma.calendarEvent.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        date: new Date(date),
        type,
        logementId: logementId ? parseInt(logementId) : null,
      },
    });

    res.json(event);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const deleteCalendarEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingEvent = await prisma.calendarEvent.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    });

    if (!existingEvent) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    await prisma.calendarEvent.delete({
      where: { id: parseInt(id) },
    });

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