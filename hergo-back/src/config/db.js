const { Pool } = require('pg');
const env = require('./env');

const quotedIdentifiers = [
  'User',
  'Voyage',
  'Logement',
  'Image',
  'Equipement',
  'Espace',
  'Reservation',
  'Review',
  'Notification',
  'Reclamation',
  'UserSettings',
  'Payment',
  'Favori',
  'firstName',
  'lastName',
  'createdAt',
  'updatedAt',
  'userId',
  'idVoyageur',
  'idProprietaire',
  'idLogement',
  'idReservation',
  'stripePaymentId',
  'paymentMethod',
  'amount',
  'currency',
  'idUser',
  'dateDebut',
  'dateFin',
  'nombrePersonnes',
  'prixJour',
  'prixTotal',
  'emailNotifications',
  'reservationNotifications',
  'departureReminders',
  'monthlyNewsletter',
  'language',
  'currency',
  'theme',
  'resetOtp',
  'resetOtpExpires',
  'id',
  'email',
  'role',
  'status',
  'statut',
  'phone',
  'avatar',
  'idProprietaire',
  'idLogement',
  'idVoyageur',
  'prixJour',
  'prixTotal',
  'dateDebut',
  'dateFin',
  'nombrePersonnes',
  'ville',
  'pays',
  'titre',
  'description',
  'image',
  'type',
];

const keyAliases = {
  firstname: 'firstName',
  lastname: 'lastName',
  createdat: 'createdAt',
  updatedat: 'updatedAt',
  idvoyageur: 'idVoyageur',
  idproprietaire: 'idProprietaire',
  idlogement: 'idLogement',
  iduser: 'idUser',
  userid: 'userId',
  datedebut: 'dateDebut',
  datefin: 'dateFin',
  nombrepersonnes: 'nombrePersonnes',
  prixjour: 'prixJour',
  prixtotal: 'prixTotal',
  emailnotifications: 'emailNotifications',
  reservationnotifications: 'reservationNotifications',
  departurereminders: 'departureReminders',
  monthlynewsletter: 'monthlyNewsletter',
  voyageurid: 'voyageurId',
  proprietaireid: 'proprietaireId',
  logementid: 'logementId',
};

const pgPool = env.DATABASE_URL
  ? new Pool({
      connectionString: env.DATABASE_URL,
    })
  : null;

const quoteIdentifiers = (query) => {
  let transformed = query;

  for (const identifier of quotedIdentifiers) {
    const quoted = `"${identifier}"`;
    if (transformed.includes(quoted)) continue;
    
    transformed = transformed.replace(
      new RegExp(`\\b${identifier}\\b`, 'g'),
      quoted
    );
  }

  return transformed;
};

const replaceDateFormat = (query) =>
  query.replace(
    /DATE_FORMAT\s*\(\s*("?[\w.]+"?)\s*,\s*'%Y-%m'\s*\)/g,
    `TO_CHAR($1, 'YYYY-MM')`
  );

const convertPlaceholders = (query) => {
  let index = 0;

  return query.replace(/\?/g, () => {
    index += 1;
    return `$${index}`;
  });
};

const normalizeRows = (rows) =>
  rows.map((row) => {
    const normalized = {};

    for (const [key, value] of Object.entries(row)) {
      normalized[keyAliases[key] || key] = value;
    }

    return normalized;
  });

const transformQuery = (rawQuery) => {
  let query = rawQuery;

  query = query.replace(/`/g, '"');
  query = query.replace(/CURRENT_TIMESTAMP\(3\)/g, 'CURRENT_TIMESTAMP');
  query = query.replace(/\bNOW\(\)/g, 'CURRENT_TIMESTAMP');
  query = replaceDateFormat(query);
  query = quoteIdentifiers(query);
  query = convertPlaceholders(query);

  return query;
};

const execute = async (rawQuery, params = []) => {
  if (!pgPool) {
    throw new Error('DATABASE_URL est requis pour la connexion PostgreSQL');
  }

  const transformedQuery = transformQuery(rawQuery);
  const isInsert = /^\s*INSERT\s+/i.test(transformedQuery);
  const finalQuery =
    isInsert && !/\bRETURNING\b/i.test(transformedQuery)
      ? `${transformedQuery} RETURNING id`
      : transformedQuery;
  const result = await pgPool.query(finalQuery, params);

  if (isInsert) {
    return [
      {
        insertId: result.rows[0] ? result.rows[0].id : null,
        rowCount: result.rowCount,
      },
    ];
  }

  if (/^\s*SELECT\s+/i.test(transformedQuery)) {
    return [normalizeRows(result.rows)];
  }

  return [
    {
      rowCount: result.rowCount,
    },
  ];
};

const testConnection = async () => {
  try {
    await execute('SELECT 1');
    console.log('Connexion PostgreSQL reussie');
    return true;
  } catch (error) {
    console.error('Erreur de connexion a la base de donnees:', error);
    process.exit(1);
  }
};

module.exports = {
  pool: {
    execute,
    end: async () => {
      if (pgPool) {
        await pgPool.end();
      }
    },
  },
  testConnection,
};
