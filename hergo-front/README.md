# HERGO - Plateforme de réservation d'hébergements

HERGO est une plateforme de réservation d'hébergements qui permet aux voyageurs de trouver et de réserver des logements en ligne, et aux hôtes de proposer leurs logements.

## Architecture du projet

### Structure des fichiers

```
src/
├── assets/              # Images et ressources statiques
├── components/          # Composants réutilisables
│   ├── Navbar.tsx       # Barre de navigation
│   └── ProtectedRoute.tsx  # Route protégée
├── core/                # Configuration et utilitaires
│   ├── api/             # Appels API
│   ├── config/          # Configuration
│   └── uttils/          # Utilitaires
├── data/                # Données mock
│   ├── adminMockData.ts # Données admin
│   └── mockData.ts      # Données principales
├── hooks/               # Hooks personnalisés
│   └── useAuth.ts       # Hook d'authentification
├── pages/               # Pages de l'application
│   ├── acceuil/         # Page d'accueil
│   │   └── sections/    # Sections de la page d'accueil
│   ├── admin/           # Pages admin
│   ├── auth/            # Pages d'authentification
│   ├── hote/            # Pages hôte
│   ├── logements/       # Pages logements
│   ├── reservations/    # Pages reservations
│   └── voyageur/        # Pages voyageur
├── services/            # Services
├── App.tsx              # Composant principal
├── main.tsx             # Point d'entrée
└── index.css            # Styles globaux
```

### Technologies utilisées

- **React 19** : Framework JavaScript
- **TypeScript** : Langage de programmation
- **Vite** : Outil de build
- **React Router Dom** : Gestion de la navigation
- **Lucide React** : Icônes
- **CSS Modules** : Styling

### Fonctionnalités

#### Voyageur

- Parcourir les logements
- Rechercher des logements
- Réserver un logement
- Consulter les réservations
- Laisser un avis
- Gérer le profil

#### Hôte

- Ajouter un logement
- Modifier un logement
- Consulter les réservations
- Voir le calendrier
- Gérer le profil

#### Admin

- Gérer les utilisateurs
- Gérer les logements
- Valider les logements
- Voir les statistiques

### Installation

```bash
npm install
npm run dev
```

### Test

Pour tester l'application, vous pouvez utiliser les identifiants suivants :

- **Voyageur** : email: amadou.diallo@gmail.com, password: (n'importe quel mot de passe)
- **Hôte** : email: fatou.seck@gmail.com, password: (n'importe quel mot de passe)
- **Admin** : email: aissatou.fall@hergo.sn, password: (n'importe quel mot de passe)
