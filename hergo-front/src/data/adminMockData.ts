import im1 from '../assets/im1.jpeg';
import im2 from '../assets/im2.jpeg';
import im3 from '../assets/im3.jpeg';
import im4 from '../assets/im4.jpeg';
import im5 from '../assets/im5.jpeg';
import im6 from '../assets/im6.jpeg';
import im7 from '../assets/im7.jpeg';
import im8 from '../assets/im8.jpeg';
import im9 from '../assets/im9.jpeg';

export interface Reservation {
  id: number;
  villaName: string;
  voyageur: string;
  avatar: string;
  location: string;
  dateArrivee: string;
  dateDepart: string;
  nuits: number;
  montant: string;
  status: 'confirmée' | 'en attente' | 'annulée';
  image: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Voyageur' | 'Hôte' | 'Admin';
  status: 'actif' | 'inactif' | 'suspendu';
  joinDate: string;
  avatar: string;
  reservations: number;
}

export interface VillaHote {
  id: number;
  name: string;
  location: string;
  price: string;
  status: 'publié' | 'brouillon' | 'suspendu';
  image: string;
  reservations: number;
  rating: number;
}

export interface PendingLogement {
  id: number;
  name: string;
  hote: string;
  location: string;
  price: string;
  submittedDate: string;
  image: string;
  type: string;
}

export interface StatMonth {
  mois: string;
  reservations: number;
  revenus: number;
}

// --- Reservations (voyageur + hôte) ---
export const mockReservations: Reservation[] = [
  {
    id: 1,
    villaName: 'La Maison des Artistes',
    voyageur: 'Amadou Diallo',
    avatar: 'https://i.pravatar.cc/40?u=amadou',
    location: 'Dakar Plateau, Sénégal',
    dateArrivee: '15 Mar 2026',
    dateDepart: '22 Mar 2026',
    nuits: 7,
    montant: '2 100 000 FCFA',
    status: 'confirmée',
    image: im1,
  },
  {
    id: 2,
    villaName: 'Le Clos de la Corniche',
    voyageur: 'Fatou Seck',
    avatar: 'https://i.pravatar.cc/40?u=fatou',
    location: 'Corniche Ouest, Dakar',
    dateArrivee: '02 Avr 2026',
    dateDepart: '05 Avr 2026',
    nuits: 3,
    montant: '1 050 000 FCFA',
    status: 'en attente',
    image: im3,
  },
  {
    id: 3,
    villaName: 'Hôtel Radisson Blu',
    voyageur: 'Ibrahima Ndiaye',
    avatar: 'https://i.pravatar.cc/40?u=ibrahima',
    location: 'Almadies, Dakar',
    dateArrivee: '10 Avr 2026',
    dateDepart: '17 Avr 2026',
    nuits: 7,
    montant: '1 960 000 FCFA',
    status: 'confirmée',
    image: im5,
  },
  {
    id: 4,
    villaName: 'La Villa des Palmiers',
    voyageur: 'Mariama Ba',
    avatar: 'https://i.pravatar.cc/40?u=mariama',
    location: 'Saly, Sénégal',
    dateArrivee: '20 Mar 2026',
    dateDepart: '23 Mar 2026',
    nuits: 3,
    montant: '840 000 FCFA',
    status: 'annulée',
    image: im2,
  },
  {
    id: 5,
    villaName: 'Hôtel Terrou-Bi',
    voyageur: 'Omar Sy',
    avatar: 'https://i.pravatar.cc/40?u=omar',
    location: 'Dakar Plateau, Sénégal',
    dateArrivee: '05 Mai 2026',
    dateDepart: '12 Mai 2026',
    nuits: 7,
    montant: '2 450 000 FCFA',
    status: 'en attente',
    image: im4,
  },
];

// --- Villas du hôte ---
export const mesVillas: VillaHote[] = [
  {
    id: 1,
    name: 'La Maison des Artistes',
    location: 'Dakar Plateau, Sénégal',
    price: '300 000 FCFA / nuit',
    status: 'publié',
    image: im1,
    reservations: 14,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Le Clos de la Corniche',
    location: 'Corniche Ouest, Dakar',
    price: '350 000 FCFA / nuit',
    status: 'publié',
    image: im3,
    reservations: 9,
    rating: 4.9,
  },
  {
    id: 3,
    name: 'La Villa des Palmiers',
    location: 'Saly, Sénégal',
    price: '280 000 FCFA / nuit',
    status: 'brouillon',
    image: im5,
    reservations: 0,
    rating: 0,
  },
];

// --- Users admin ---
export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Amadou Diallo',
    email: 'amadou.diallo@gmail.com',
    role: 'Voyageur',
    status: 'actif',
    joinDate: '12 Jan 2026',
    avatar: 'https://i.pravatar.cc/40?u=amadou',
    reservations: 5,
  },
  {
    id: 2,
    name: 'Fatou Seck',
    email: 'fatou.seck@gmail.com',
    role: 'Hôte',
    status: 'actif',
    joinDate: '03 Fév 2026',
    avatar: 'https://i.pravatar.cc/40?u=fatou',
    reservations: 12,
  },
  {
    id: 3,
    name: 'Ibrahima Ndiaye',
    email: 'ibrahima.n@gmail.com',
    role: 'Voyageur',
    status: 'inactif',
    joinDate: '20 Déc 2025',
    avatar: 'https://i.pravatar.cc/40?u=ibrahima',
    reservations: 1,
  },
  {
    id: 4,
    name: 'Mariama Ba',
    email: 'mariama.ba@gmail.com',
    role: 'Hôte',
    status: 'actif',
    joinDate: '15 Nov 2025',
    avatar: 'https://i.pravatar.cc/40?u=mariama',
    reservations: 8,
  },
  {
    id: 5,
    name: 'Omar Sy',
    email: 'omar.sy@gmail.com',
    role: 'Voyageur',
    status: 'suspendu',
    joinDate: '01 Mar 2026',
    avatar: 'https://i.pravatar.cc/40?u=omar',
    reservations: 0,
  },
  {
    id: 6,
    name: 'Aissatou Fall',
    email: 'aissatou.fall@hergo.sn',
    role: 'Admin',
    status: 'actif',
    joinDate: '10 Jan 2025',
    avatar: 'https://i.pravatar.cc/40?u=aissatou',
    reservations: 0,
  },
];

// --- Pending logements for validation ---
export const pendingLogements: PendingLogement[] = [
  {
    id: 1,
    name: 'La Villa Baobab',
    hote: 'Fatou Seck',
    location: 'Mbour, Sénégal',
    price: '260 000 FCFA/nuit',
    submittedDate: '25 Fév 2026',
    image: im6,
    type: 'Villa',
  },
  {
    id: 2,
    name: 'Résidence Almadies',
    hote: 'Mariama Ba',
    location: 'Almadies, Dakar',
    price: '180 000 FCFA/nuit',
    submittedDate: '26 Fév 2026',
    image: im7,
    type: 'Hôtel',
  },
  {
    id: 3,
    name: 'Le Relais des Collines',
    hote: 'Cheikh Diop',
    location: 'Dakar, Sénégal',
    price: '320 000 FCFA/nuit',
    submittedDate: '27 Fév 2026',
    image: im8,
    type: 'Villa',
  },
];

// --- All logements for admin management ---
export const allLogements = [
  { id: 1, name: 'La Maison des Artistes', hote: 'Fatou Seck', location: 'Dakar Plateau', type: 'Villa', price: '300 000 FCFA', status: 'publié' as const, image: im1, reservations: 14 },
  { id: 2, name: 'Le Clos de la Corniche', hote: 'Mariama Ba', location: 'Corniche Ouest', type: 'Villa', price: '350 000 FCFA', status: 'publié' as const, image: im3, reservations: 9 },
  { id: 3, name: 'Hôtel Radisson Blu', hote: 'Ibrahima Ndiaye', location: 'Almadies', type: 'Hôtel', price: '45 000 FCFA', status: 'publié' as const, image: im2, reservations: 22 },
  { id: 4, name: 'La Villa des Palmiers', hote: 'Fatou Seck', location: 'Saly', type: 'Villa', price: '280 000 FCFA', status: 'brouillon' as const, image: im5, reservations: 0 },
  { id: 5, name: 'Hôtel Terrou-Bi', hote: 'Amadou Diallo', location: 'Dakar Plateau', type: 'Hôtel', price: '40 000 FCFA', status: 'suspendu' as const, image: im9, reservations: 3 },
];

// --- Stats mensuelles ---
export const statsParMois: StatMonth[] = [
  { mois: 'Sep', reservations: 18, revenus: 5400000 },
  { mois: 'Oct', reservations: 24, revenus: 7200000 },
  { mois: 'Nov', reservations: 20, revenus: 6000000 },
  { mois: 'Déc', reservations: 35, revenus: 10500000 },
  { mois: 'Jan', reservations: 28, revenus: 8400000 },
  { mois: 'Fév', reservations: 32, revenus: 9600000 },
];

// --- Avis (reviews) ---
export interface Avis {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  categories: { proprete: number; confort: number; emplacement: number; accueil: number };
}

export const villaAvis: Avis[] = [
  {
    id: 1,
    author: 'Amadou Diallo',
    avatar: 'https://i.pravatar.cc/40?u=amadou',
    rating: 5,
    date: 'Fév 2026',
    comment: 'Villa absolument exceptionnelle dans le cœur historique du Plateau. L\'architecture coloniale rénovée est magnifique, et l\'accueil de l\'hôte est chaleureux. Je recommande vivement !',
    categories: { proprete: 5, confort: 5, emplacement: 5, accueil: 5 },
  },
  {
    id: 2,
    author: 'Mariama Ba',
    avatar: 'https://i.pravatar.cc/40?u=mariama',
    rating: 4,
    date: 'Jan 2026',
    comment: 'Très beau séjour dans une villa moderne avec vue sur la corniche. La piscine est parfaite et les chambres spacieuses. Seul bémol : le bruit de la circulation le soir.',
    categories: { proprete: 4, confort: 5, emplacement: 4, accueil: 4 },
  },
  {
    id: 3,
    author: 'Ibrahima Ndiaye',
    avatar: 'https://i.pravatar.cc/40?u=ibrahima',
    rating: 5,
    date: 'Déc 2025',
    comment: 'Parfait en tout point ! L\'hôtel Radisson Blu offre un service de qualité internationale. La chambre est impeccable et le petit-déjeuner est délicieux.',
    categories: { proprete: 5, confort: 5, emplacement: 4, accueil: 5 },
  },
  {
    id: 4,
    author: 'Omar Sy',
    avatar: 'https://i.pravatar.cc/40?u=omar',
    rating: 4,
    date: 'Nov 2025',
    comment: 'Excellent hôtel près du Marché Sandaga. Le personnel est professionnel et la chambre est très confortable. Le seul inconvénient est le parking limité.',
    categories: { proprete: 4, confort: 4, emplacement: 5, accueil: 4 },
  },
];

// --- Espaces du logement ---
export interface EspaceLogement {
  id: string;
  nom: string;
  icon: string;
  surface?: string;
  description: string;
  details: string[];
  image: string;
}

export interface ScoreCategorie {
  label: string;
  score: number;
}

export interface AvisVedette {
  quote: string;
  author: string;
  initial: string;
  country: string;
  flag: string;
  avatar: string;
}

export interface ScoresLogement {
  global: number;
  label: string;
  totalExperiences: number;
  categories: ScoreCategorie[];
  avisVedette: AvisVedette;
}

// --- Villa detail data ---
export const villaDetails = {
  id: 1,
  name: 'La Maison des Artistes',
  location: 'Dakar Plateau, Sénégal',
  coordinates: { lat: 14.6928, lng: -17.4467 },
  rating: 4.8,
  reviewCount: 124,
  pricePerNight: 300000,
  images: [im7, im1, im8, im2, im3, im4, im5, im6],
  description:
    "Nichée dans le quartier historique du Plateau à Dakar, La Maison des Artistes est une villa coloniale rénovée offrant un hébergement de luxe. Avec ses salons spacieux, ses chambres élégantes et son jardin tropical, cette propriété est l'incarnation du charme sénégalais.",
  amenities: [
    { label: 'Piscine privée', icon: 'Waves' },
    { label: 'Cuisine équipée', icon: 'ChefHat' },
    { label: 'Climatisation', icon: 'Wind' },
    { label: 'Wi-Fi haut débit', icon: 'Wifi' },
    { label: 'Parking sécurisé', icon: 'Car' },
    { label: '4 Chambres', icon: 'BedDouble' },
    { label: 'Terrasse panoramique', icon: 'Sunset' },
    { label: 'Salle de sport', icon: 'Dumbbell' },
  ],
  host: {
    name: 'Fatou Seck',
    avatar: 'https://i.pravatar.cc/60?u=fatou',
    joinDate: 'Fév 2026',
    rating: 4.9,
  },
  capacity: 8,
  bedrooms: 4,
  transportPropose: ['Transfert aéroport', 'Parking privé', 'Navette centre-ville'],
  avis: villaAvis,

  // Espaces du logement (nouveaux)
  espaces: [
    {
      id: 'chambre',
      nom: 'Chambres',
      icon: 'BedDouble',
      surface: '25 m² chacune',
      description: '4 chambres spacieuses et lumineuses avec décoration raffinée, lits king-size et salle de bain privative. Vue sur le jardin tropical ou la piscine.',
      details: ['4 lits king-size', 'Climatisation individuelle', 'Salle de bain privative', 'Coffre-fort', 'Smart TV 55"', 'Balcon ou terrasse'],
      image: im1,
    },
    {
      id: 'salon',
      nom: 'Salon',
      icon: 'Sofa',
      surface: '60 m²',
      description: 'Grand salon ouvert sur la terrasse, décoré dans un style afro-contemporain alliant modernité et authenticité sénégalaise.',
      details: ['Canapé 8 places', 'TV 75" 4K', 'Système audio Sonos', 'Connexion Wi-Fi fibre', 'Terrasse attenante', 'Climatisation centrale'],
      image: im2,
    },
    {
      id: 'cuisine',
      nom: 'Cuisine',
      icon: 'ChefHat',
      surface: '40 m²',
      description: "Cuisine entièrement équipée avec îlot central, pensée pour recevoir famille et amis. Espace repas intégré pour 10 personnes.",
      details: ['Îlot central', 'Réfrigérateur américain', 'Four & micro-ondes', 'Lave-vaisselle', 'Machine à café', 'Ustensiles complets'],
      image: im8,
    },
    {
      id: 'piscine',
      nom: 'Piscine',
      icon: 'Waves',
      surface: '12 m × 5 m',
      description: 'Piscine privée chauffée avec vue sur le jardin tropical. Espace détente avec transats et coin bar à la ombre des palmiers.',
      details: ['Longueur 12 m', 'Largeur 5 m', 'Profondeur 1,4 m', 'Eau chauffée', 'Transats & parasols', 'Éclairage nocturne'],
      image: im7,
    },
    {
      id: 'sdb',
      nom: 'Salles de bain',
      icon: 'ShowerHead',
      surface: '15 m² chacune',
      description: 'Salles de bain luxueuses avec finitions en marbre, douche à l\'italienne et baignoire balnéo dans la suite principale.',
      details: ['Douche à l\'italienne', 'Baignoire balnéo (suite)', 'Double vasque', 'Produits Nuxe fournis', 'Sèche-serviettes', 'Miroir anti-buée'],
      image: im3,
    },
    {
      id: 'terrasse',
      nom: 'Terrasse & Jardin',
      icon: 'TreePalm',
      surface: '200 m²',
      description: 'Terrasse panoramique et jardin tropical avec vue sur la baie de Dakar. Idéal pour les soirées en plein air et les repas sous les étoiles.',
      details: ['Vue sur la baie', 'Salon de jardin', 'Barbecue intégré', 'Éclairage design', 'Palmiers & plantes tropicales', 'Accès piscine direct'],
      image: im4,
    },
  ] as EspaceLogement[],

  // Scores style Booking.com
  scores: {
    global: 9.2,
    label: 'Exceptionnel',
    totalExperiences: 1646,
    categories: [
      { label: 'Personnel', score: 9.4 },
      { label: 'Propreté', score: 9.6 },
      { label: 'Confort', score: 9.1 },
      { label: 'Emplacement', score: 9.5 },
      { label: 'Équipements', score: 8.9 },
      { label: 'Rapport qualité-prix', score: 8.7 },
    ],
    avisVedette: {
      quote: "Villa absolument exceptionnelle. Petit-déjeuner servi en terrasse avec vue sur la piscine. Chambre parfaite avec balcon. Le personnel est aux petits soins. Je recommande vivement !",
      author: 'Hélène',
      initial: 'H',
      country: 'France',
      flag: '🇫🇷',
      avatar: 'https://i.pravatar.cc/36?u=helene-france',
    },
  } as ScoresLogement,
};
