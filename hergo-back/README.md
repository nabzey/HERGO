# Hebergo Backend (API Express + Prisma)

Backend Node.js/Express pour la plateforme de location de logements touristiques **Hebergo**.

Ce projet expose une API REST sécurisée qui gère :
- Les utilisateurs (voyageurs, hôtes, admins)
- Les logements (création, validation, publication)
- Les réservations (demande, confirmation, annulation)
- Les avis (reviews)
- Les notifications (système et utilisateur)

---

## 🚀 Démarrage (en local)

### 1) Prérequis

- Node.js >= 20
- Docker + Docker Compose
- npm ou yarn

### 2) Installation

1. Cloner le dépôt
2. `npm install`
3. Copier `.env.example` en `.env` et ajuster les variables (DB, JWT, Cloudinary)
5. Générer le client Prisma :
   ```bash
   npx prisma generate
   ```
6. Appliquer les migrations (local) :
   ```bash
   npx prisma migrate dev
   ```
7. Lancer le serveur :
   ```bash
   npm run dev
   ```

> ✅ Le serveur écoute par défaut sur `http://localhost:5000` (ou la valeur de `PORT` dans `.env`).

### 3) Démarrage avec Docker

```bash
docker compose up --build
```

Le conteneur `app` applique automatiquement `prisma migrate deploy` au démarrage puis lance l'API.

### 4) Notifications email et SMS avec Brevo

Variables d'environnement à renseigner :

- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_SENDER_NAME`
- `BREVO_SMS_SENDER`

Fichiers utiles :

- `config/brevo.js` : client HTTP Brevo
- `helpers/email.helper.js` : emails transactionnels
- `helpers/sms.helper.js` : SMS transactionnels

---

## 🧠 Architecture & flux de traitement (pas à pas)

### 1) Point d’entrée

- `core/server.js` : démarre l’application et lance le serveur.
- `core/app.js` : configure Express, les middlewares, les routes et la gestion des erreurs.

### 2) Routage

- Les routes sont définies dans `routes/*.js`.
- Chaque route appelle un contrôleur (ex: `auth.controller.js`).

### 3) Contrôleurs

- `controllers/*.controller.js` reçoivent `req/res`, appliquent des validations simples, et délèguent la logique métier aux services.

### 4) Services

- `services/*.service.js` contiennent la logique métier détaillée.
- Les services appellent les modèles (Prisma) pour interagir avec la base de données.

### 5) Modèles / Prisma

- `prisma/schema.prisma` définit les tables et relations.
- `prisma/client.js` exporte le client Prisma.
- Les fichiers `models/*.model.js` encapsulent les requêtes Prisma.

---

## ✨ Exemple de traitement (création d’un logement)

1. Le client envoie `POST /api/logements`.
2. Route `routes/logement.routes.js` redirige vers `logement.controller.create`.
3. Le middleware d’authentification (`core/middlewares/auth.middleware.js`) vérifie le JWT et injecte l’utilisateur.
4. `logement.controller.create` appelle `logement.service.create`.
5. `logement.service.create` utilise Prisma (`models/logement.model.js`) pour insérer une ligne en BDD.
6. Le contrôleur retourne la réponse JSON au client.

---

## 🗂️ Structure du projet (arborescence)

```
hergo-back/
├── config/                # Configuration (BDD, JWT, env)
├── controllers/           # Requêtes entrantes -> services
├── core/                  # Point d'entrée et setup Express
│   ├── app.js
│   └── server.js
├── docs/                  # Swagger / documentation API
├── helpers/               # Fonctions utilitaires (hash, email, notif)
├── middleware/            # Middlewares Express (auth, erreurs)
├── models/                # Requêtes Prisma encapsulées
├── prisma/                # Schéma et client Prisma
├── routes/                # Définition des endpoints
├── services/              # Logique métier
├── package.json
└── README.md
```

---

## 🧩 Points importants

### Authentification JWT

- Le token est généré dans `auth.service.js`.
- Le middleware `core/middlewares/auth.middleware.js` vérifie le token et ajoute `req.user`.

### Gestion des rôles

- Certains endpoints sont réservés à `ADMIN` ou `HOTE`.
- Le middleware d’authentification vérifie le rôle avant d’autoriser l’accès.

### Notifications

- Les notifications sont créées via `notification.helper.js`.
- Les notifications sont stockées en base puis consultables via l’API.

---

## ✅ Routes API (résumé)

### Auth
- `POST /api/auth/register` : inscription
- `POST /api/auth/login` : connexion
- `GET /api/auth/me` : profil connecté

### Utilisateurs
- `GET /api/users` (admin) : liste des utilisateurs
- `GET /api/users/:id` : détail
- `PUT /api/users/:id` : mise à jour
- `PUT /api/users/:id/password` : changement de mot de passe
- `PUT /api/users/:id/role` (admin) : rôle/statut
- `DELETE /api/users/:id` (admin)

### Logements
- `GET /api/logements` : liste
- `GET /api/logements/:id` : détail
- `POST /api/logements` : création (hôte)
- `PUT /api/logements/:id` : modification
- `DELETE /api/logements/:id` : suppression
- `PUT /api/logements/:id/images` : images
- `PUT /api/logements/:id/equipements` : équipements
- `PUT /api/logements/:id/espaces` : espaces

### Réservations
- `GET /api/reservations` : liste
- `GET /api/reservations/:id` : détail
- `POST /api/reservations` : création
- `PUT /api/reservations/:id/status` : statut
- `PUT /api/reservations/:id/cancel` : annulation
- `DELETE /api/reservations/:id` (admin)

### Avis
- `GET /api/reviews/logement/:idLogement` : avis par logement
- `GET /api/reviews/:id` : avis par ID
- `POST /api/reviews` : création
- `PUT /api/reviews/:id` : modification
- `DELETE /api/reviews/:id` : suppression

### Notifications
- `GET /api/notifications` : toutes les notifications
- `GET /api/notifications/:id` : détail
- `PUT /api/notifications/:id/read` : marquer lue
- `PUT /api/notifications/read-all` : marquer toutes lues
- `DELETE /api/notifications/:id` : suppression
- `DELETE /api/notifications/delete-all` : suppression de toutes

---

## 🧪 Débogage & outils

- Démarrer en mode développement : `npm run dev` (nodemon)
- Ouvrir Prisma Studio : `npx prisma studio`

---

## Licence

ISC




***********************
fichier test
'erreur que vous rencontrez est liée au format JSON invalide. Le corps de la requête doit être du JSON valide, pas du JavaScript.

Format incorrect (JavaScript)
{
  name: 'John Doe',
  email: 'john@example.com',
  password: 'Password123!',
  role: 'Voyageur'
}
Format correct (JSON)
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "Voyageur"
}
Règles du JSON
Les clés doivent être entre guillemets doubles "clé"
Les valeurs string doivent être entre guillemets doubles "valeur"
Pas d'apostrophes ' pour les strings
Pas de virgule après le dernier élément
Exemples de données JSON valides pour tester
Inscription (POST /api/auth/register)
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "Voyageur"
}
Connexion (POST /api/auth/login)
{
  "email": "john@example.com",
  "password": "Password123!"
}
Créer un logement (POST /api/logements)
{
  "titre": "Appartement Paris",
  "description": "Bel appartement au centre-ville",
  "prixJour": 100,
  "capacite": 4,
  "adresse": "123 Rue de Paris",
  "ville": "Paris",
  "pays": "France",
  "longitude": 2.3522,
  "latitude": 48.8566,
  "statut": "BROUILLON"
}
Créer une réservation (POST /api/reservations)
{
  "idLogement": 1,
  "dateDebut": "2024-06-01",
  "dateFin": "2024-06-05",
  "nombrePersonnes": 2
}
Comment tester avec curl
# Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"Password123!","role":"Voyageur"}'

# Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123!"}'
Comment tester avec Postman/Insomnia
Sélectionnez la méthode POST
Entrez l'URL (ex: http://localhost:3000/api/auth/register)
Dans l'onglet Body, sélectionnez raw et JSON
Collez le JSON valide
Envoyez la requête
Assurez-vous que le serveur backend est démarré avant de tester (npm run dev).
