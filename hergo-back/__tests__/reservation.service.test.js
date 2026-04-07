const reservationService = require('../services/reservation.service');
const { pool } = require('../config/db');
const notificationHelper = require('../helpers/notification.helper');
const emailHelper = require('../helpers/email.helper');
const smsHelper = require('../helpers/sms.helper');

// Mock de la base de données et des helpers
jest.mock('../config/db', () => ({
  pool: {
    execute: jest.fn()
  }
}));

jest.mock('../helpers/notification.helper', () => ({
  createReservationNotification: jest.fn(),
  createReservationConfirmationNotification: jest.fn(),
  createReservationCancelationNotification: jest.fn()
}));

jest.mock('../helpers/email.helper', () => ({
  sendReservationEmail: jest.fn(),
  sendCancelationEmail: jest.fn(),
  sendHostNotificationEmail: jest.fn()
}));

jest.mock('../helpers/sms.helper', () => ({
  sendReservationSms: jest.fn(),
  sendCancelationSms: jest.fn()
}));

describe('ReservationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllReservations', () => {
    it('devrait récupérer toutes les réservations pour un hôte', async () => {
      const userId = 1;
      const userRole = 'HOTE';
      const mockReservations = [
        {
          id: 1,
          idVoyageur: 2,
          idLogement: 1,
          dateDebut: '2024-01-01',
          dateFin: '2024-01-05',
          statut: 'CONFIRME',
          firstName: 'John',
          lastName: 'Doe',
          titre: 'Appartement Paris'
        }
      ];

      pool.execute.mockResolvedValueOnce([mockReservations]);

      const result = await reservationService.getAllReservations(userId, userRole);

      expect(pool.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockReservations);
    });

    it('devrait récupérer toutes les réservations pour un voyageur', async () => {
      const userId = 2;
      const userRole = 'VOYAGEUR';
      const mockReservations = [
        {
          id: 1,
          idVoyageur: 2,
          idLogement: 1,
          dateDebut: '2024-01-01',
          dateFin: '2024-01-05',
          statut: 'CONFIRME',
          firstName: 'John',
          lastName: 'Doe',
          titre: 'Appartement Paris'
        }
      ];

      pool.execute.mockResolvedValueOnce([mockReservations]);

      const result = await reservationService.getAllReservations(userId, userRole);

      expect(pool.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockReservations);
    });

    it('devrait récupérer toutes les réservations pour un admin', async () => {
      const userId = 999;
      const userRole = 'ADMIN';
      const mockReservations = [
        {
          id: 1,
          idVoyageur: 2,
          idLogement: 1,
          dateDebut: '2024-01-01',
          dateFin: '2024-01-05',
          statut: 'CONFIRME'
        }
      ];

      pool.execute.mockResolvedValueOnce([mockReservations]);

      const result = await reservationService.getAllReservations(userId, userRole);

      expect(pool.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockReservations);
    });

    it('devrait filtrer les réservations par statut', async () => {
      const userId = 1;
      const userRole = 'HOTE';
      const filters = { statut: 'CONFIRME' };
      const mockReservations = [
        {
          id: 1,
          statut: 'CONFIRME'
        }
      ];

      pool.execute.mockResolvedValueOnce([mockReservations]);

      const result = await reservationService.getAllReservations(userId, userRole, filters);

      expect(pool.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockReservations);
    });
  });

  describe('getReservationById', () => {
    it('devrait récupérer une réservation par son ID pour un voyageur', async () => {
      const reservationId = 1;
      const userId = 2;
      const userRole = 'VOYAGEUR';
      const mockReservation = {
        id: reservationId,
        idVoyageur: userId,
        idLogement: 1,
        dateDebut: '2024-01-01',
        dateFin: '2024-01-05',
        statut: 'CONFIRME',
        firstName: 'John',
        lastName: 'Doe',
        titre: 'Appartement Paris'
      };

      pool.execute.mockResolvedValueOnce([[mockReservation]]);

      const result = await reservationService.getReservationById(reservationId, userId, userRole);

      expect(pool.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockReservation);
    });

    it('devrait récupérer une réservation par son ID pour un hôte', async () => {
      const reservationId = 1;
      const userId = 1;
      const userRole = 'HOTE';
      const mockReservation = {
        id: reservationId,
        idVoyageur: 2,
        idLogement: 1,
        idProprietaire: userId,
        dateDebut: '2024-01-01',
        dateFin: '2024-01-05',
        statut: 'CONFIRME'
      };

      pool.execute.mockResolvedValueOnce([[mockReservation]]);

      const result = await reservationService.getReservationById(reservationId, userId, userRole);

      expect(result).toEqual(mockReservation);
    });

    it('devrait rejeter si la réservation n\'existe pas', async () => {
      const reservationId = 999;
      const userId = 1;
      const userRole = 'VOYAGEUR';

      pool.execute.mockResolvedValueOnce([[]]);

      await expect(reservationService.getReservationById(reservationId, userId, userRole))
        .rejects.toThrow('Réservation non trouvée');
    });

    it('devrait rejeter si l\'utilisateur n\'a pas accès', async () => {
      const reservationId = 1;
      const userId = 999;
      const userRole = 'VOYAGEUR';
      const mockReservation = {
        id: reservationId,
        idVoyageur: 2, // Voyageur différent
        idProprietaire: 1
      };

      pool.execute.mockResolvedValueOnce([[mockReservation]]);

      await expect(reservationService.getReservationById(reservationId, userId, userRole))
        .rejects.toThrow('Accès refusé');
    });
  });

  describe('createReservation', () => {
    it('devrait créer une réservation avec succès', async () => {
      const reservationData = {
        idLogement: 1,
        dateDebut: '2024-01-01',
        dateFin: '2024-01-05',
        nombrePersonnes: 2
      };
      const userId = 2;

      const mockLogement = {
        id: 1,
        titre: 'Appartement Paris',
        prixJour: 100,
        statut: 'PUBLIE',
        idProprietaire: 10
      };

      const mockCreatedReservation = {
        id: 1,
        idVoyageur: userId,
        idLogement: 1,
        dateDebut: '2024-01-01',
        dateFin: '2024-01-05',
        nombrePersonnes: 2,
        prixTotal: 400,
        statut: 'EN_ATTENTE',
        email: 'voyageur@example.com',
        phone: '+221770000000',
        firstName: 'John',
        lastName: 'Doe',
        titre: 'Appartement Paris'
      };

      const mockHost = {
        id: 10,
        firstName: 'Host',
        email: 'host@example.com',
        phone: '+221780000000'
      };

      pool.execute
        .mockResolvedValueOnce([[mockLogement]]) // Vérification logement
        .mockResolvedValueOnce([[]]) // Vérification disponibilité
        .mockResolvedValueOnce([{ insertId: 1 }]) // Insertion
        .mockResolvedValueOnce([[mockCreatedReservation]]) // Récupération
        .mockResolvedValueOnce([[mockHost]]); // Hôte

      const result = await reservationService.createReservation(reservationData, userId);

      expect(pool.execute).toHaveBeenCalledTimes(5);
      expect(result).toEqual(mockCreatedReservation);
    });

    it('devrait rejeter si le logement n\'existe pas', async () => {
      const reservationData = {
        idLogement: 999,
        dateDebut: '2024-01-01',
        dateFin: '2024-01-05',
        nombrePersonnes: 2
      };
      const userId = 2;

      pool.execute.mockResolvedValueOnce([[]]); // Logement non trouvé

      await expect(reservationService.createReservation(reservationData, userId))
        .rejects.toThrow('Logement non disponible');
    });

    it('devrait rejeter si le logement n\'est pas disponible pour ces dates', async () => {
      const reservationData = {
        idLogement: 1,
        dateDebut: '2024-01-01',
        dateFin: '2024-01-05',
        nombrePersonnes: 2
      };
      const userId = 2;

      const mockLogement = {
        id: 1,
        titre: 'Appartement Paris',
        prixJour: 100,
        statut: 'PUBLIE'
      };

      const overlappingReservation = {
        id: 1,
        dateDebut: '2024-01-02',
        dateFin: '2024-01-04'
      };

      pool.execute
        .mockResolvedValueOnce([[mockLogement]])
        .mockResolvedValueOnce([[overlappingReservation]]); // Chevauchement trouvé

      await expect(reservationService.createReservation(reservationData, userId))
        .rejects.toThrow('Logement non disponible pour ces dates');
    });
  });

  describe('updateReservationStatus', () => {
    it('devrait mettre à jour le statut d\'une réservation par un hôte', async () => {
      const reservationId = 1;
      const newStatus = 'CONFIRME';
      const userId = 1;
      const userRole = 'HOTE';

      const mockReservation = {
        id: reservationId,
        idVoyageur: 2,
        idLogement: 1,
        idProprietaire: userId,
        statut: 'EN_ATTENTE'
      };

      const mockUpdatedReservation = {
        ...mockReservation,
        statut: newStatus,
        email: 'voyageur@example.com',
        phone: '+221770000000',
        firstName: 'John',
        titre: 'Appartement Paris'
      };

      pool.execute
        .mockResolvedValueOnce([[mockReservation]]) // Vérification
        .mockResolvedValueOnce([{}]) // Mise à jour
        .mockResolvedValueOnce([[mockUpdatedReservation]]); // Récupération

      const result = await reservationService.updateReservationStatus(reservationId, newStatus, userId, userRole);

      expect(pool.execute).toHaveBeenCalledTimes(3);
      expect(result.statut).toBe(newStatus);
    });

    it('devrait rejeter si l\'utilisateur n\'est pas autorisé', async () => {
      const reservationId = 1;
      const newStatus = 'CONFIRME';
      const userId = 999;
      const userRole = 'HOTE';

      const mockReservation = {
        id: reservationId,
        idProprietaire: 1 // Propriétaire différent
      };

      pool.execute.mockResolvedValueOnce([[mockReservation]]);

      await expect(reservationService.updateReservationStatus(reservationId, newStatus, userId, userRole))
        .rejects.toThrow('Accès refusé');
    });
  });

  describe('cancelReservation', () => {
    it('devrait annuler une réservation par un voyageur', async () => {
      const reservationId = 1;
      const userId = 2;
      const userRole = 'VOYAGEUR';

      const mockReservation = {
        id: reservationId,
        idVoyageur: userId,
        idLogement: 1,
        statut: 'CONFIRME'
      };

      const mockCancelledReservation = {
        ...mockReservation,
        statut: 'ANNULE',
        email: 'voyageur@example.com',
        phone: '+221770000000',
        firstName: 'John',
        titre: 'Appartement Paris'
      };

      pool.execute
        .mockResolvedValueOnce([[mockReservation]])
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([[mockCancelledReservation]]);

      const result = await reservationService.cancelReservation(reservationId, userId, userRole);

      expect(pool.execute).toHaveBeenCalledTimes(3);
      expect(result.statut).toBe('ANNULE');
    });

    it('devrait rejeter si la réservation est déjà annulée', async () => {
      const reservationId = 1;
      const userId = 2;
      const userRole = 'VOYAGEUR';

      const mockReservation = {
        id: reservationId,
        idVoyageur: userId,
        statut: 'ANNULE'
      };

      pool.execute.mockResolvedValueOnce([[mockReservation]]);

      await expect(reservationService.cancelReservation(reservationId, userId, userRole))
        .rejects.toThrow('Réservation déjà annulée ou terminée');
    });

    it('devrait rejeter si la réservation est déjà terminée', async () => {
      const reservationId = 1;
      const userId = 2;
      const userRole = 'VOYAGEUR';

      const mockReservation = {
        id: reservationId,
        idVoyageur: userId,
        statut: 'TERMINE'
      };

      pool.execute.mockResolvedValueOnce([[mockReservation]]);

      await expect(reservationService.cancelReservation(reservationId, userId, userRole))
        .rejects.toThrow('Réservation déjà annulée ou terminée');
    });
  });

  describe('deleteReservation', () => {
    it('devrait supprimer une réservation', async () => {
      const reservationId = 1;

      pool.execute
        .mockResolvedValueOnce([[{ id: reservationId }]]) // Vérification
        .mockResolvedValueOnce([{}]); // Suppression

      const result = await reservationService.deleteReservation(reservationId);

      expect(pool.execute).toHaveBeenCalledTimes(2);
      expect(result).toBe(true);
    });

    it('devrait rejeter si la réservation n\'existe pas', async () => {
      const reservationId = 999;

      pool.execute.mockResolvedValueOnce([[]]);

      await expect(reservationService.deleteReservation(reservationId))
        .rejects.toThrow('Réservation non trouvée');
    });
  });
});
