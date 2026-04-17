import im1 from '../assets/im1.jpeg';
import im2 from '../assets/im2.jpeg';
import im3 from '../assets/im3.jpeg';
import im4 from '../assets/im4.jpeg';
import im5 from '../assets/im5.jpeg';
import im6 from '../assets/im6.jpeg';
import im7 from '../assets/im7.jpeg';
import im8 from '../assets/im8.jpeg';
import im9 from '../assets/im9.jpeg';

export type HebergementType = 'Villa' | 'Hôtel';

export type Equipment = 'piscine' | 'wifi' | 'parking' | 'cuisine' | 'climatisation' | 'machine_a_laver' | 'bar' | 'terrasse' | 'jardin' | 'service_menage';

export const EQUIPMENTS: { value: Equipment; label: string }[] = [
  { value: 'piscine', label: 'Piscine' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'parking', label: 'Parking' },
  { value: 'cuisine', label: 'Cuisine' },
  { value: 'climatisation', label: 'Climatisation' },
  { value: 'machine_a_laver', label: 'Machine à laver' },
  { value: 'bar', label: 'Bar' },
  { value: 'terrasse', label: 'Terrasse' },
  { value: 'jardin', label: 'Jardin' },
  { value: 'service_menage', label: 'Service ménage' },
];

export interface Hebergement {
  id: number;
  type: HebergementType;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  image: string;
  isFavorite: boolean;
  equipments: Equipment[];
}

export interface Destination {
  id: number;
  city: string;
  country: string;
  propertyCount: number;
  image: string;
}

export interface Villa {
  id: number;
  image: string;
  price: string;
  location: string;
}

export const hebergements: Hebergement[] = [
  {
    id: 1,
    type: 'Villa',
    name: 'Villa Sunset Paradise',
    location: 'Dakar, Senegal',
    rating: 4.8,
    reviewCount: 124,
    pricePerNight: 85000,
    image: im1,
    isFavorite: false,
    equipments: ['piscine', 'wifi', 'parking', 'cuisine', 'climatisation', 'machine_a_laver', 'terrasse', 'jardin'],
  },
  {
    id: 2,
    type: 'Hôtel',
    name: 'Hôtel Royal Palace',
    location: 'Dakar, Sénégal',
    rating: 4.6,
    reviewCount: 89,
    pricePerNight: 45000,
    image: im2,
    isFavorite: false,
    equipments: ['wifi', 'parking', 'climatisation', 'bar', 'service_menage'],
  },
  {
    id: 3,
    type: 'Villa',
    name: 'Villa Ocean View',
    location: 'Sine-Saloum, Senegal',
    rating: 4.9,
    reviewCount: 156,
    pricePerNight: 120000,
    image: im3,
    isFavorite: false,
    equipments: ['piscine', 'wifi', 'parking', 'cuisine', 'climatisation', 'bar', 'terrasse', 'jardin', 'service_menage'],
  },
  {
    id: 4,
    type: 'Hôtel',
    name: 'Hôtel Radisson Blue',
    location: 'Dakar, Senegal',
    rating: 4.5,
    reviewCount: 98,
    pricePerNight: 30000,
    image: im4,
    isFavorite: false,
    equipments: ['wifi', 'parking', 'climatisation', 'service_menage'],
  },
  {
    id: 5,
    type: 'Villa',
    name: 'Villa Les Palmiers',
    location: 'Ziginchor, casamance',
    rating: 4.7,
    reviewCount: 67,
    pricePerNight: 55000,
    image: im5,
    isFavorite: false,
    equipments: ['piscine', 'wifi', 'parking', 'cuisine', 'jardin'],
  },
  {
    id: 6,
    type: 'Hôtel',
    name: 'Hôtel Azur Plage',
    location: 'Meri, Senegal',
    rating: 4.4,
    reviewCount: 112,
    pricePerNight: 32000,
    image: im2,
    isFavorite: false,
    equipments: ['wifi', 'parking', 'climatisation', 'bar', 'terrasse'],
  },
];

export const destinations: Destination[] = [
  {
    id: 1,
    city: 'Saint-Louis',
    country: 'Senegal',
    propertyCount: 245,
    image: 'https://picsum.photos/seed/senegal-city/500/380',
  },
  {
    id: 2,
    city: 'Dakar',
    country: 'Sénégal',
    propertyCount: 189,
    image: 'https://picsum.photos/seed/dakar-sunset/500/380',
  },
  {
    id: 3,
    city: 'DAKAR',
    country: 'Senegal',
    propertyCount: 156,
    image: 'https://picsum.photos/seed/lome-beach/500/380',
  },
  {
    id: 4,
    city: 'Rufisque',
    country: 'dakar',
    propertyCount: 134,
    image: 'https://picsum.photos/seed/cotonou-city/500/380',
  },
];

export const villas: Villa[] = [
  { id: 1, image: im1, price: '300 000 FCFA', location: 'Dakar' },
  { id: 2, image: im2, price: '280 000 FCFA', location: 'Saly' },
  { id: 3, image: im3, price: '350 000 FCFA', location: 'Casamance' },
  { id: 4, image: im4, price: '350 000 FCFA', location: 'Thiès' },
  { id: 5, image: im5, price: '290 000 FCFA', location: 'Mbour' },
  { id: 6, image: im6, price: '320 000 FCFA', location: 'Rufisque' },
];

export { im7 as poolImage, im8 as kitchenImage, im9 as heroVillaImage };
