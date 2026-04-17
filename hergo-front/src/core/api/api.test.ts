const { authApi, logementsApi, reservationsApi } = require('./api');

// Mock de fetch
global.fetch = jest.fn();

describe('API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('authApi', () => {
    it('devrait inscrire un utilisateur avec succès', async () => {
      const mockResponse = {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Voyageur'
        },
        token: 'mockToken'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await authApi.register({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        role: 'VOYAGEUR',
        phone: '+221770000000'
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Password123!',
            role: 'VOYAGEUR',
            phone: '+221770000000'
          })
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('devrait connecter un utilisateur avec succès', async () => {
      const mockResponse = {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Voyageur'
        },
        token: 'mockToken'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await authApi.login({
        email: 'john@example.com',
        password: 'Password123!'
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            email: 'john@example.com',
            password: 'Password123!'
          })
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('devrait gérer les erreurs de connexion', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Email ou mot de passe incorrect' })
      });

      await expect(authApi.login({
        email: 'wrong@example.com',
        password: 'WrongPassword'
      })).rejects.toThrow('Email ou mot de passe incorrect');
    });
  });

  describe('logementsApi', () => {
    it('devrait récupérer tous les logements', async () => {
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

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockLogements
      });

      const result = await logementsApi.getAll();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/logements',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result).toEqual(mockLogements);
    });

    it('devrait récupérer un logement par ID', async () => {
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

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockLogement
      });

      const result = await logementsApi.getById(1);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/logements/1',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result).toEqual(mockLogement);
    });

    it('devrait créer un logement avec succès', async () => {
      const newLogement = {
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

      const mockResponse = {
        id: 3,
        ...newLogement,
        idProprietaire: 1
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await logementsApi.create(newLogement);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/logements',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(newLogement)
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('reservationsApi', () => {
    it('devrait récupérer toutes les réservations', async () => {
      const mockReservations = [
        {
          id: 1,
          idVoyageur: 2,
          idLogement: 1,
          dateDebut: '2024-01-01',
          dateFin: '2024-01-05',
          nombrePersonnes: 2,
          prixTotal: 400,
          statut: 'CONFIRME',
          firstName: 'John',
          lastName: 'Doe',
          titre: 'Appartement Paris',
          ville: 'Paris',
          pays: 'France'
        }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReservations
      });

      const result = await reservationsApi.getAll();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/reservations',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result).toEqual(mockReservations);
    });

    it('devrait créer une réservation avec succès', async () => {
      const newReservation = {
        idLogement: 1,
        dateDebut: '2024-06-01',
        dateFin: '2024-06-05',
        nombrePersonnes: 2
      };

      const mockResponse = {
        id: 1,
        idVoyageur: 2,
        ...newReservation,
        prixTotal: 400,
        statut: 'EN_ATTENTE'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await reservationsApi.create(newReservation);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/reservations',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(newReservation)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('devrait annuler une réservation avec succès', async () => {
      const mockResponse = {
        id: 1,
        statut: 'ANNULE'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await reservationsApi.cancel(1);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/reservations/1/cancel',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

export {};
