# Test E2E

## 1. Variables requises

Verifier dans `.env` :

- `DATABASE_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_SENDER_NAME`
- `BREVO_SMS_SENDER`

## 2. Lancer le backend

```bash
cd hergo-back
docker compose up --build
```

API attendue sur `http://localhost:5000`.

## 3. Inscription voyageur avec SMS Brevo

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "role": "VOYAGEUR",
    "phone": "+221770000000"
  }'
```

Resultat attendu :

- utilisateur cree
- `token` retourne
- email Brevo recu
- SMS Brevo recu

## 4. Inscription hote

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Host User",
    "email": "host@example.com",
    "password": "Password123!",
    "role": "HOTE",
    "phone": "+221780000000"
  }'
```

Conserver le `token` hote.

## 5. Creation logement

```bash
curl -X POST http://localhost:5000/api/logements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HOTE" \
  -d '{
    "titre": "Villa test Hergo",
    "description": "Belle villa pour test end to end.",
    "prixJour": 25000,
    "capacite": 4,
    "adresse": "Almadies",
    "ville": "Dakar",
    "pays": "Senegal",
    "statut": "PUBLIE"
  }'
```

Conserver `logement.id`.

## 6. Upload image Cloudinary

```bash
curl -X POST http://localhost:5000/api/logements/LOGEMENT_ID/images/upload \
  -H "Authorization: Bearer TOKEN_HOTE" \
  -F "image=@/chemin/vers/photo.jpg"
```

Resultat attendu :

- URL Cloudinary en reponse
- image visible dans Cloudinary

## 7. Reservation voyageur

```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_VOYAGEUR" \
  -d '{
    "idLogement": 1,
    "dateDebut": "2026-04-20T00:00:00.000Z",
    "dateFin": "2026-04-24T00:00:00.000Z",
    "nombrePersonnes": 2
  }'
```

Resultat attendu :

- reservation creee
- email voyageur recu
- SMS voyageur recu
- notification interne hote creee
- email hote recu
- SMS hote recu

## 8. Confirmation par l'hote

```bash
curl -X PUT http://localhost:5000/api/reservations/RESERVATION_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HOTE" \
  -d '{
    "statut": "CONFIRME"
  }'
```

Resultat attendu :

- notification interne voyageur
- email de confirmation voyageur
- SMS de confirmation voyageur

## 9. Annulation

```bash
curl -X PUT http://localhost:5000/api/reservations/RESERVATION_ID/cancel \
  -H "Authorization: Bearer TOKEN_VOYAGEUR"
```

Resultat attendu :

- notification interne voyageur
- email d'annulation voyageur
- SMS d'annulation voyageur
