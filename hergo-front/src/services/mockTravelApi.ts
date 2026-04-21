import { hebergements } from '../data/mockData';

export interface MockLogement {
  id: number;
  titre: string;
  type: string;
  ville: string;
  pays: string;
  adresse: string;
  description: string;
  prixJour: number;
  chambres: number;
  capacite: number;
  equipements: string[];
  images: string[];
  note: number;
  idProprietaire: number;
  statut: string;
}

export interface MockFavori {
  id: number;
  idLogement: number;
  logementId: number;
  titre: string;
  ville: string;
  pays: string;
  prixJour: number;
  imageUrl: string;
}

export interface MockReservation {
  id: number;
  idVoyageur: number;
  idLogement: number;
  dateDebut: string;
  dateFin: string;
  nombrePersonnes: number;
  prixTotal: number;
  statut: 'CONFIRME' | 'EN_ATTENTE' | 'ANNULE';
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  titre: string;
  ville: string;
  pays: string;
  imageUrl: string;
}

const FAVORIS_KEY = 'hergoMockFavoris';
const RESERVATIONS_KEY = 'hergoMockReservations';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readStorage = <T>(key: string, fallback: T): T => {
  if (!canUseStorage()) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
};

const writeStorage = <T>(key: string, value: T) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

const toVillePays = (location: string) => {
  const [ville = 'Dakar', pays = 'Sénégal'] = location.split(',').map((item) => item.trim());
  return { ville, pays };
};

const getCurrentUser = () => {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem('hergoUser');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as {
      id?: number;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string | null;
    };
  } catch {
    return null;
  }
};

const getMockLogementById = (id: number): MockLogement | null => {
  const logement = hebergements.find((item) => item.id === id);
  if (!logement) {
    return null;
  }

  const { ville, pays } = toVillePays(logement.location);

  return {
    id: logement.id,
    titre: logement.name,
    type: logement.type,
    ville,
    pays,
    adresse: logement.location,
    description: `Séjournez dans ${logement.name}, un logement sélectionné pour son confort et son emplacement.`,
    prixJour: logement.pricePerNight,
    chambres: logement.type === 'Villa' ? 3 : 2,
    capacite: logement.type === 'Villa' ? 6 : 4,
    equipements: logement.equipments,
    images: [logement.image],
    note: logement.rating,
    idProprietaire: 1,
    statut: 'PUBLIE',
  };
};

const getSeedReservations = (): MockReservation[] => {
  const user = getCurrentUser();
  const logement = getMockLogementById(1);

  if (!user || !logement) {
    return [];
  }

  const createdAt = new Date().toISOString();

  return [
    {
      id: 1,
      idVoyageur: user.id ?? 1,
      idLogement: logement.id,
      dateDebut: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      dateFin: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      nombrePersonnes: 2,
      prixTotal: logement.prixJour * 3 + 150000,
      statut: 'CONFIRME',
      createdAt,
      updatedAt: createdAt,
      firstName: user.firstName ?? 'Client',
      lastName: user.lastName ?? 'Hergo',
      email: user.email ?? 'client@hergo.sn',
      phone: user.phone ?? '+221770000000',
      titre: logement.titre,
      ville: logement.ville,
      pays: logement.pays,
      imageUrl: logement.images[0],
    },
  ];
};

const readFavoris = () => readStorage<MockFavori[]>(FAVORIS_KEY, []);

const writeFavoris = (favoris: MockFavori[]) => {
  writeStorage(FAVORIS_KEY, favoris);
};

const readReservations = () => {
  const current = readStorage<MockReservation[]>(RESERVATIONS_KEY, []);
  if (current.length > 0) {
    return current;
  }

  const seeded = getSeedReservations();
  writeStorage(RESERVATIONS_KEY, seeded);
  return seeded;
};

const writeReservations = (reservations: MockReservation[]) => {
  writeStorage(RESERVATIONS_KEY, reservations);
};

export const mockTravelApi = {
  getLogementById(id: number) {
    return getMockLogementById(id);
  },

  getFavoris() {
    return readFavoris();
  },

  addFavori(idLogement: number) {
    const logement = getMockLogementById(idLogement);
    if (!logement) {
      throw new Error('Logement introuvable');
    }

    const favoris = readFavoris();
    const existing = favoris.find((item) => item.idLogement === idLogement);
    if (existing) {
      return existing;
    }

    const favori: MockFavori = {
      id: Date.now(),
      idLogement,
      logementId: idLogement,
      titre: logement.titre,
      ville: logement.ville,
      pays: logement.pays,
      prixJour: logement.prixJour,
      imageUrl: logement.images[0],
    };

    writeFavoris([favori, ...favoris]);
    return favori;
  },

  removeFavori(idLogement: number) {
    writeFavoris(readFavoris().filter((item) => item.idLogement !== idLogement));
  },

  isFavori(idLogement: number) {
    return readFavoris().some((item) => item.idLogement === idLogement);
  },

  getReservations() {
    return readReservations().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getReservationById(id: number) {
    return readReservations().find((item) => item.id === id) ?? null;
  },

  createReservation(input: {
    idLogement: number;
    dateDebut: string;
    dateFin: string;
    nombrePersonnes: number;
  }) {
    const logement = getMockLogementById(input.idLogement);
    if (!logement) {
      throw new Error('Logement introuvable');
    }

    const user = getCurrentUser();
    if (!user) {
      throw new Error('Veuillez vous connecter pour réserver');
    }

    const reservations = readReservations();
    const nextId = reservations.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    const now = new Date().toISOString();
    const dateDebut = new Date(input.dateDebut);
    const dateFin = new Date(input.dateFin);
    const nuits = Math.max(
      1,
      Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24))
    );

    const reservation: MockReservation = {
      id: nextId,
      idVoyageur: user.id ?? 1,
      idLogement: logement.id,
      dateDebut: input.dateDebut,
      dateFin: input.dateFin,
      nombrePersonnes: input.nombrePersonnes,
      prixTotal: logement.prixJour * nuits + 150000,
      statut: 'EN_ATTENTE',
      createdAt: now,
      updatedAt: now,
      firstName: user.firstName ?? 'Client',
      lastName: user.lastName ?? 'Hergo',
      email: user.email ?? 'client@hergo.sn',
      phone: user.phone ?? '+221770000000',
      titre: logement.titre,
      ville: logement.ville,
      pays: logement.pays,
      imageUrl: logement.images[0],
    };

    writeReservations([reservation, ...reservations]);
    return reservation;
  },

  cancelReservation(id: number) {
    const reservations = readReservations();
    const reservation = reservations.find((item) => item.id === id);
    if (!reservation) {
      throw new Error('Réservation introuvable');
    }

    const updated = { ...reservation, statut: 'ANNULE' as const, updatedAt: new Date().toISOString() };
    writeReservations(reservations.map((item) => (item.id === id ? updated : item)));
    return updated;
  },
};
