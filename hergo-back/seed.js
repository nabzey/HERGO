// seed.js — Script d'initialisation des données Hergo
// Usage: node seed.js
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Démarrage du seed...\n');
    await client.query('BEGIN');

    // ── 1. Utilisateurs ────────────────────────────────────
    console.log('👤 Création des utilisateurs...');
    const passwordHash = await bcrypt.hash('demo123', 10);
    const adminHash = await bcrypt.hash('admin123', 10);

    const users = [
      {
        firstName: 'Admin',
        lastName: 'Hergo',
        email: 'admin@hergo.sn',
        password: adminHash,
        role: 'ADMIN',
        phone: '+221 33 800 00 00',
        ville: 'Dakar',
        pays: 'Sénégal',
        bio: 'Administrateur de la plateforme Hergo',
      },
      {
        firstName: 'Fatou',
        lastName: 'Seck',
        email: 'fatou@hergo.sn',
        password: passwordHash,
        role: 'HOTE',
        phone: '+221 77 123 45 67',
        ville: 'Saly',
        pays: 'Sénégal',
        bio: 'Hôte passionnée, je propose des villas de luxe à Saly.',
      },
      {
        firstName: 'Moussa',
        lastName: 'Diallo',
        email: 'moussa@hergo.sn',
        password: passwordHash,
        role: 'HOTE',
        phone: '+221 77 987 65 43',
        ville: 'Dakar',
        pays: 'Sénégal',
        bio: 'Gestionnaire de plusieurs appartements à Dakar.',
      },
      {
        firstName: 'Aminata',
        lastName: 'Traoré',
        email: 'aminata@hergo.sn',
        password: passwordHash,
        role: 'VOYAGEUR',
        phone: '+221 76 234 56 78',
        ville: 'Saint-Louis',
        pays: 'Sénégal',
        bio: 'Voyageuse curieuse en quête de belles expériences.',
      },
      {
        firstName: 'Ibrahima',
        lastName: 'Ndiaye',
        email: 'ibrahima@hergo.sn',
        password: passwordHash,
        role: 'VOYAGEUR',
        phone: '+221 70 345 67 89',
        ville: 'Ziguinchor',
        pays: 'Sénégal',
        bio: 'Amateur de nature et de détente.',
      },
    ];

    const userIds = {};
    for (const u of users) {
      const res = await client.query(
        `INSERT INTO "User" ("firstName","lastName","email","password","role","phone","ville","pays","bio","status","updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'ACTIF',NOW())
         ON CONFLICT (email) DO UPDATE SET "updatedAt"=NOW()
         RETURNING id, email`,
        [u.firstName, u.lastName, u.email, u.password, u.role, u.phone, u.ville, u.pays, u.bio]
      );
      userIds[u.email] = res.rows[0].id;
      console.log(`  ✓ ${u.role}: ${u.firstName} ${u.lastName} (${u.email})`);
    }

    // ── 2. Logements ───────────────────────────────────────
    console.log('\n🏠 Création des logements...');
    const hoteId = userIds['fatou@hergo.sn'];
    const hote2Id = userIds['moussa@hergo.sn'];

    const logements = [
      {
        titre: 'Villa Sunset Paradise',
        description: 'Magnifique villa avec piscine privée et vue sur l\'océan Atlantique. Idéale pour des séjours de luxe en famille ou entre amis. Profitez du coucher de soleil depuis votre terrasse.',
        prixJour: 150000,
        capacite: 10,
        adresse: 'Résidence Bel Air, Saly Portudal',
        ville: 'Saly',
        pays: 'Sénégal',
        longitude: -16.8167,
        latitude: 14.45,
        statut: 'PUBLIE',
        idProprietaire: hoteId,
      },
      {
        titre: 'Villa Ocean View Ngor',
        description: 'Villa contemporaine face à l\'île de Ngor. Architecture moderne, piscine à débordement, 5 chambres en suite. A 5 minutes des meilleures plages de Dakar.',
        prixJour: 120000,
        capacite: 8,
        adresse: '12 Rue des Dauphins, Ngor',
        ville: 'Dakar',
        pays: 'Sénégal',
        longitude: -17.5167,
        latitude: 14.745,
        statut: 'PUBLIE',
        idProprietaire: hoteId,
      },
      {
        titre: 'Appartement Plateau Premium',
        description: 'Appartement haut standing au cœur du Plateau. Vue panoramique sur la Médina. Idéal pour voyageurs d\'affaires et touristes souhaitant découvrir Dakar.',
        prixJour: 65000,
        capacite: 4,
        adresse: 'Avenue Léopold Sédar Senghor, Plateau',
        ville: 'Dakar',
        pays: 'Sénégal',
        longitude: -17.4435,
        latitude: 14.6937,
        statut: 'PUBLIE',
        idProprietaire: hote2Id,
      },
      {
        titre: 'Villa Azur Saly Niakh Niakhal',
        description: 'Villa de 4 chambres avec piscine, jardin tropical et bungalow séparé pour les invités. Accès privé à la plage à 200m. Service de ménage inclus.',
        prixJour: 95000,
        capacite: 6,
        adresse: 'Zone Résidentielle, Saly Niakh Niakhal',
        ville: 'Saly',
        pays: 'Sénégal',
        longitude: -16.8333,
        latitude: 14.45,
        statut: 'PUBLIE',
        idProprietaire: hote2Id,
      },
      {
        titre: 'Hôtel Royal Palace Dakar',
        description: 'Établissement de prestige en plein cœur de Dakar. Chambres climatisées, restaurant gastronomique, spa et salle de fitness. Accueil VIP garanti.',
        prixJour: 85000,
        capacite: 2,
        adresse: 'Place de l\'Indépendance, Plateau',
        ville: 'Dakar',
        pays: 'Sénégal',
        longitude: -17.4467,
        latitude: 14.6931,
        statut: 'PUBLIE',
        idProprietaire: hoteId,
      },
      {
        titre: 'Villa Casamance Lodge',
        description: 'Éco-lodge authentique en Casamance. Construit en matériaux locaux, entouré de mangroves. Kayak, pirogue et découverte de la faune locale inclus.',
        prixJour: 55000,
        capacite: 6,
        adresse: 'Route des Mangroves, Ziguinchor',
        ville: 'Ziguinchor',
        pays: 'Sénégal',
        longitude: -16.2667,
        latitude: 12.5667,
        statut: 'EN_ATTENTE',
        idProprietaire: hote2Id,
      },
    ];

    const logementIds = [];
    for (const l of logements) {
      const res = await client.query(
        `INSERT INTO "Logement" ("titre","description","prixJour","capacite","adresse","ville","pays","longitude","latitude","statut","idProprietaire","updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW())
         RETURNING id, titre`,
        [l.titre, l.description, l.prixJour, l.capacite, l.adresse, l.ville, l.pays, l.longitude, l.latitude, l.statut, l.idProprietaire]
      );
      logementIds.push(res.rows[0].id);
      console.log(`  ✓ [${l.statut}] ${l.titre}`);
    }

    // ── 3. Images Cloudinary (URLs publiques Unsplash pour demo) ──
    console.log('\n🖼️  Ajout des images...');
    const imagesSets = [
      [ // Villa Sunset Paradise
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      ],
      [ // Villa Ocean View Ngor
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
        'https://images.unsplash.com/photo-1601918774516-a35b3c6ab94c?w=800',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      ],
      [ // Appartement Plateau Premium
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      ],
      [ // Villa Azur Saly
        'https://images.unsplash.com/photo-1603193690429-1012e4d97e28?w=800',
        'https://images.unsplash.com/photo-1629079447777-1e605162dc8d?w=800',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
      ],
      [ // Hôtel Royal Palace
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      ],
      [ // Villa Casamance Lodge
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
        'https://images.unsplash.com/photo-1504615755583-2916b52192a3?w=800',
      ],
    ];

    for (let i = 0; i < logementIds.length; i++) {
      const lId = logementIds[i];
      const imgs = imagesSets[i] || [];
      for (const url of imgs) {
        await client.query(
          `INSERT INTO "Image" ("url","idLogement","updatedAt") VALUES ($1,$2,NOW())`,
          [url, lId]
        );
      }
      console.log(`  ✓ ${imgs.length} images → logement #${lId}`);
    }

    // ── 4. Équipements ─────────────────────────────────────
    console.log('\n🛠️  Ajout des équipements...');
    const equipementsSets = [
      ['Piscine privée', 'Climatisation', 'WiFi haut débit', 'Cuisine équipée', 'Parking', 'Salle de sport', 'Barbecue', 'Vue mer'],
      ['Piscine à débordement', 'Climatisation', 'WiFi', 'Cuisine équipée', 'Terrasse', 'Parking privé'],
      ['Climatisation', 'WiFi haut débit', 'Cuisine équipée', 'Ascenseur', 'Sécurité 24h'],
      ['Piscine', 'Climatisation', 'WiFi', 'Jardin tropical', 'Bungalow invités', 'Accès plage'],
      ['Climatisation', 'WiFi', 'Restaurant', 'Spa', 'Salle de fitness', 'Room service', 'Parking'],
      ['WiFi', 'Cuisine locale', 'Kayak', 'Pirogue', 'Jardin'],
    ];

    for (let i = 0; i < logementIds.length; i++) {
      const lId = logementIds[i];
      const eqs = equipementsSets[i] || [];
      for (const nom of eqs) {
        await client.query(
          `INSERT INTO "Equipement" ("nom","idLogement","updatedAt") VALUES ($1,$2,NOW())`,
          [nom, lId]
        );
      }
      console.log('  ✓ ' + eqs.length + ' équipements → logement #' + lId);
    }

    // ── 5. Espaces ─────────────────────────────────────────
    console.log('\n🏡 Ajout des espaces...');
    const espacesVilla = [
      { nom: 'Chambre Maître', description: 'Suite principale avec lit king-size, dressing et salle de bain privative en marbre.' },
      { nom: 'Salon Principal', description: 'Grand salon lumineux avec canapés design, TV 75", vue sur piscine.' },
      { nom: 'Cuisine Ouverte', description: 'Cuisine moderne équipée, îlot central, accès direct terrasse.' },
      { nom: 'Piscine & Terrasse', description: 'Piscine chauffée 12x5m avec transats et douche extérieure.' },
    ];
    for (const espace of espacesVilla) {
      await client.query(
        `INSERT INTO "Espace" ("nom","description","idLogement","updatedAt") VALUES ($1,$2,$3,NOW())`,
        [espace.nom, espace.description, logementIds[0]]
      );
    }
    console.log(`  ✓ ${espacesVilla.length} espaces → Villa Sunset Paradise`);

    // ── 6. Reviews ─────────────────────────────────────────
    console.log('\n⭐ Ajout des avis...');
    const voyageurId = userIds['aminata@hergo.sn'];
    const reviews = [
      { idLogement: logementIds[0], note: 5, commentaire: 'Séjour absolument parfait. La villa est encore plus belle qu\'en photo. Le coucher de soleil depuis la terrasse est inoubliable !' },
      { idLogement: logementIds[1], note: 5, commentaire: 'Vue spectaculaire sur l\'île de Ngor. Piscine magnifique, hôte très attentionné. On reviendra !' },
      { idLogement: logementIds[2], note: 4, commentaire: 'Appartement bien situé, propre et moderne. Idéal pour découvrir Dakar. WiFi excellent.' },
      { idLogement: logementIds[4], note: 5, commentaire: 'Hotel de grande classe. Service impeccable, restaurant délicieux. Un vrai palace !' },
    ];
    for (const r of reviews) {
      await client.query(
        `INSERT INTO "Review" ("idVoyageur","idLogement","note","commentaire","updatedAt") VALUES ($1,$2,$3,$4,NOW())`,
        [voyageurId, r.idLogement, r.note, r.commentaire]
      );
    }
    console.log(`  ✓ ${reviews.length} avis créés`);

    await client.query('COMMIT');

    console.log('\n✅ Seed terminé avec succès !\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Comptes disponibles :');
    console.log('   admin@hergo.sn     → mot de passe: admin123 (ADMIN)');
    console.log('   fatou@hergo.sn     → mot de passe: demo123  (HÔTE)');
    console.log('   moussa@hergo.sn    → mot de passe: demo123  (HÔTE)');
    console.log('   aminata@hergo.sn   → mot de passe: demo123  (VOYAGEUR)');
    console.log('   ibrahima@hergo.sn  → mot de passe: demo123  (VOYAGEUR)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🏠 ${logementIds.length} logements créés (${logements.filter(l=>l.statut==='PUBLIE').length} publiés, ${logements.filter(l=>l.statut==='EN_ATTENTE').length} en attente)`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erreur seed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(() => process.exit(1));
