const logementService = require('../services/logement.service');
const { pool } = require('../config/db');

// Mock de la base de données
jest.mock('../config/db', () => ({
  pool: {
    execute: jest.fn()
  }
}));

describe('LogementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLogements', () => {
    it('devrait récupérer tous les logements publiés', async () => {
      const mockLogements = [
        {
          id: 1,
          titre: 'Appartement Paris',
          description: 'Bel appartement',
          prixJour: 100,
          capacite: 4,
          ville: 'Paris',
          pays: 'France',
          statut: 'PUBLIE'
        },
        {
          id: 2,
          titre: 'Maison Lyon',
          description: 'Grande maison',
          prixJour: 150,
          capacite: 6,
          ville: 'Lyon',
          pays: 'France',
          statut: 'PUBLIE'
        }
      ];

      pool.execute.mockResolvedValueOnce([mockLogements]);

      const result = await logementService.getAllLogements();

      expect(pool.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLogements);
    });

    it('devrait filtrer les logements par ville', async () => {
      const mockLogements = [
        {
          id: 1,
          titre: 'Appartement Paris',
          ville: 'Paris',
          pays: 'France',
          statut: 'PUBLIE'
        }
      ];

      pool.execute.mockResolvedValueOnce([mockLogements]);

      const result = await logementService.getAllLogements({ ville: 'Paris' });

      expect(pool.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLogements);
    });

    it('devrait filtrer les logements par prix', async () => {
      const mockLogements = [
        {
          id: 1,
          titre: 'Appartement Paris',
          prixJour: 100,
          statut: 'PUBLIE'
        }
      ];

      pool.execute.mockResolvedValueOnce([mockLogements]);

      const result = await logementService.getAllLogements({ prixMin: 50, prixMax: 150 });

      expect(pool.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLogements);
    });
  });

  describe('getLogementById', () => {
    it('devrait récupérer un logement par son ID', async () => {
      const mockLogement = {
        id: 1,
        titre: 'Appartement Paris',
        description: 'Bel appartement',
        prixJour: 100,
        capacite: 4,
        ville: 'Paris',
        pays: 'France',
        statut: 'PUBLIE'
      };

      pool.execute
        .mockResolvedValueOnce([[mockLogement]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[]]);

      const result = await logementService.getLogementById(1);

      expect(pool.execute).toHaveBeenCalledTimes(4);
      expect(result).toEqual({
        ...mockLogement,
        images: [],
        equipements: [],
        espaces: [],
      });
    });

    it('devrait rejeter si le logement n\'existe pas', async () => {
      pool.execute.mockResolvedValueOnce([[]]);

      await expect(logementService.getLogementById(999)).rejects.toThrow('Logement non trouvé');
    });
  });

  describe('createLogement', () => {
    it('devrait créer un logement avec succès', async () => {
      const logementData = {
        titre: 'Nouveau Appartement',
        description: 'Description du nouvel appartement',
        prixJour: 120,
        capacite: 3,
        adresse: '123 Rue Example',
        ville: 'Marseille',
        pays: 'France',
        longitude: 5.3698,
        latitude: 43.2965,
        statut: 'BROUILLON'
      };

      const userId = 1;
      const mockCreatedLogement = {
        id: 1,
        ...logementData,
        idProprietaire: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      pool.execute
        .mockResolvedValueOnce([{ insertId: 1 }]) // Insertion
        .mockResolvedValueOnce([[mockCreatedLogement]]) // Récupération logement
        .mockResolvedValueOnce([[]]) // Images
        .mockResolvedValueOnce([[]]) // Equipements
        .mockResolvedValueOnce([[]]); // Espaces

      const result = await logementService.createLogement(logementData, userId);

      expect(pool.execute).toHaveBeenCalledTimes(5);
      expect(result).toEqual({
        ...mockCreatedLogement,
        images: [],
        equipements: [],
        espaces: [],
      });
    });
  });

  describe('updateLogement', () => {
    it('devrait mettre à jour un logement par le propriétaire', async () => {
      const logementId = 1;
      const userId = 1;
      const userRole = 'HOTE';
      const updateData = {
        titre: 'Titre Mis à Jour',
        description: 'Description mise à jour',
        prixJour: 130,
        capacite: 4,
        adresse: '456 Rue Example',
        ville: 'Nice',
        pays: 'France',
        longitude: 7.2620,
        latitude: 43.7102,
        statut: 'PUBLIE'
      };

      const existingLogement = {
        id: logementId,
        idProprietaire: userId,
        titre: 'Ancien Titre'
      };

      const updatedLogement = {
        id: logementId,
        ...updateData,
        idProprietaire: userId
      };

      pool.execute
        .mockResolvedValueOnce([[existingLogement]]) // Vérification existence
        .mockResolvedValueOnce([{}]) // Mise à jour
        .mockResolvedValueOnce([[updatedLogement]]) // Récupération logement
        .mockResolvedValueOnce([[]]) // Images
        .mockResolvedValueOnce([[]]) // Equipements
        .mockResolvedValueOnce([[]]); // Espaces

      const result = await logementService.updateLogement(logementId, updateData, userId, userRole);

      expect(pool.execute).toHaveBeenCalledTimes(6);
      expect(result).toEqual({
        ...updatedLogement,
        images: [],
        equipements: [],
        espaces: [],
      });
    });

    it('devrait rejeter si l\'utilisateur n\'est pas le propriétaire', async () => {
      const logementId = 1;
      const userId = 2;
      const userRole = 'HOTE';
      const updateData = { titre: 'Nouveau Titre' };

      const existingLogement = {
        id: logementId,
        idProprietaire: 1 // Propriétaire différent
      };

      pool.execute.mockResolvedValueOnce([[existingLogement]]);

      await expect(logementService.updateLogement(logementId, updateData, userId, userRole))
        .rejects.toThrow('Accès refusé');
    });

    it('devrait permettre à un admin de mettre à jour n\'importe quel logement', async () => {
      const logementId = 1;
      const userId = 999;
      const userRole = 'ADMIN';
      const updateData = {
        titre: 'Titre Mis à Jour par Admin',
        description: 'Description mise à jour',
        prixJour: 130,
        capacite: 4,
        adresse: '456 Rue Example',
        ville: 'Nice',
        pays: 'France',
        longitude: 7.2620,
        latitude: 43.7102,
        statut: 'PUBLIE'
      };

      const existingLogement = {
        id: logementId,
        idProprietaire: 1
      };

      const updatedLogement = {
        id: logementId,
        ...updateData,
        idProprietaire: 1
      };

      pool.execute
        .mockResolvedValueOnce([[existingLogement]])
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([[updatedLogement]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[]]);

      const result = await logementService.updateLogement(logementId, updateData, userId, userRole);

      expect(result).toEqual({
        ...updatedLogement,
        images: [],
        equipements: [],
        espaces: [],
      });
    });
  });

  describe('deleteLogement', () => {
    it('devrait supprimer un logement par le propriétaire', async () => {
      const logementId = 1;
      const userId = 1;
      const userRole = 'HOTE';

      const existingLogement = {
        id: logementId,
        idProprietaire: userId
      };

      pool.execute
        .mockResolvedValueOnce([[existingLogement]])
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([{}]);

      const result = await logementService.deleteLogement(logementId, userId, userRole);

      expect(pool.execute).toHaveBeenCalledTimes(5);
      expect(result).toBe(true);
    });

    it('devrait rejeter si l\'utilisateur n\'est pas le propriétaire', async () => {
      const logementId = 1;
      const userId = 2;
      const userRole = 'HOTE';

      const existingLogement = {
        id: logementId,
        idProprietaire: 1
      };

      pool.execute.mockResolvedValueOnce([[existingLogement]]);

      await expect(logementService.deleteLogement(logementId, userId, userRole))
        .rejects.toThrow('Accès refusé');
    });

    it('devrait permettre à un admin de supprimer n\'importe quel logement', async () => {
      const logementId = 1;
      const userId = 999;
      const userRole = 'ADMIN';

      const existingLogement = {
        id: logementId,
        idProprietaire: 1
      };

      pool.execute
        .mockResolvedValueOnce([[existingLogement]])
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([{}]);

      const result = await logementService.deleteLogement(logementId, userId, userRole);

      expect(result).toBe(true);
    });
  });
});
