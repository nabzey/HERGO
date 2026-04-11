const { pool } = require('../config/db');
const env = require('../config/env');

const getOwnedLogement = async (id) => {
  const [logements] = await pool.execute('SELECT * FROM Logement WHERE id = ?', [id]);

  if (logements.length === 0) {
    throw new Error('Logement non trouvé');
  }

  return logements[0];
};

const ensureAccess = (logement, userId, userRole) => {
  if (userRole !== 'ADMIN' && logement.idProprietaire !== userId) {
    throw new Error('Accès refusé');
  }
};

const logementService = {
  getAllLogements: async (filters = {}) => {
    try {
      const { ville, pays, prixMin, prixMax, capacite, statut = 'PUBLIE' } = filters;

      let query = 'SELECT * FROM Logement WHERE statut = ?';
      const params = [statut];

      if (ville) {
        query += ' AND ville LIKE ?';
        params.push(`%${ville}%`);
      }
      if (pays) {
        query += ' AND pays LIKE ?';
        params.push(`%${pays}%`);
      }
      if (prixMin) {
        query += ' AND prixJour >= ?';
        params.push(parseFloat(prixMin));
      }
      if (prixMax) {
        query += ' AND prixJour <= ?';
        params.push(parseFloat(prixMax));
      }
      if (capacite) {
        query += ' AND capacite >= ?';
        params.push(parseInt(capacite, 10));
      }

      query += ' ORDER BY createdAt DESC';

      const [logements] = await pool.execute(query, params);
      return logements;
    } catch (error) {
      throw error;
    }
  },

  getLogementById: async (id) => {
    try {
      const logement = await getOwnedLogement(id);
      const [images] = await pool.execute(
        'SELECT * FROM Image WHERE idLogement = ? ORDER BY createdAt DESC',
        [id]
      );
      const [equipements] = await pool.execute(
        'SELECT * FROM Equipement WHERE idLogement = ? ORDER BY createdAt ASC',
        [id]
      );
      const [espaces] = await pool.execute(
        'SELECT * FROM Espace WHERE idLogement = ? ORDER BY createdAt ASC',
        [id]
      );

      return {
        ...logement,
        images,
        equipements,
        espaces,
      };
    } catch (error) {
      throw error;
    }
  },

  createLogement: async (data, userId) => {
    try {
      const {
        titre,
        description,
        prixJour,
        capacite,
        adresse,
        ville,
        pays,
        longitude,
        latitude,
        statut = 'BROUILLON',
      } = data;

      const [result] = await pool.execute(
        `
        INSERT INTO Logement (titre, description, prixJour, capacite, adresse, ville, pays, longitude, latitude, statut, idProprietaire, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
        [
          titre,
          description,
          parseFloat(prixJour),
          parseInt(capacite, 10),
          adresse,
          ville,
          pays,
          longitude ? parseFloat(longitude) : null,
          latitude ? parseFloat(latitude) : null,
          statut,
          userId,
        ]
      );

      return await logementService.getLogementById(result.insertId);
    } catch (error) {
      throw error;
    }
  },

  updateLogement: async (id, data, userId, userRole) => {
    try {
      const existingLogement = await getOwnedLogement(id);
      ensureAccess(existingLogement, userId, userRole);

      const mergedData = {
        ...existingLogement,
        ...data,
      };

      await pool.execute(
        `
        UPDATE Logement SET
          titre = ?, description = ?, prixJour = ?, capacite = ?, adresse = ?,
          ville = ?, pays = ?, longitude = ?, latitude = ?, statut = ?, updatedAt = CURRENT_TIMESTAMP(3)
        WHERE id = ?
      `,
        [
          mergedData.titre,
          mergedData.description,
          parseFloat(mergedData.prixJour),
          parseInt(mergedData.capacite, 10),
          mergedData.adresse,
          mergedData.ville,
          mergedData.pays,
          mergedData.longitude ? parseFloat(mergedData.longitude) : null,
          mergedData.latitude ? parseFloat(mergedData.latitude) : null,
          mergedData.statut,
          id,
        ]
      );

      return await logementService.getLogementById(id);
    } catch (error) {
      throw error;
    }
  },

  deleteLogement: async (id, userId, userRole) => {
    try {
      const existingLogement = await getOwnedLogement(id);
      ensureAccess(existingLogement, userId, userRole);

      await pool.execute('DELETE FROM Image WHERE idLogement = ?', [id]);
      await pool.execute('DELETE FROM Equipement WHERE idLogement = ?', [id]);
      await pool.execute('DELETE FROM Espace WHERE idLogement = ?', [id]);
      await pool.execute('DELETE FROM Logement WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  manageImages: async (id, images = [], userId, userRole) => {
    try {
      const logement = await getOwnedLogement(id);
      ensureAccess(logement, userId, userRole);

      await pool.execute('DELETE FROM Image WHERE idLogement = ?', [id]);

      for (const imageUrl of images) {
        await pool.execute(
          'INSERT INTO Image (url, idLogement, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)',
          [imageUrl, id]
        );
      }

      return await logementService.getLogementById(id);
    } catch (error) {
      throw error;
    }
  },

  manageEquipements: async (id, equipements = [], userId, userRole) => {
    try {
      const logement = await getOwnedLogement(id);
      ensureAccess(logement, userId, userRole);

      await pool.execute('DELETE FROM Equipement WHERE idLogement = ?', [id]);

      for (const nom of equipements) {
        await pool.execute(
          'INSERT INTO Equipement (nom, idLogement, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)',
          [nom, id]
        );
      }

      return await logementService.getLogementById(id);
    } catch (error) {
      throw error;
    }
  },

  manageEspaces: async (id, espaces = [], userId, userRole) => {
    try {
      const logement = await getOwnedLogement(id);
      ensureAccess(logement, userId, userRole);

      await pool.execute('DELETE FROM Espace WHERE idLogement = ?', [id]);

      for (const espace of espaces) {
        await pool.execute(
          'INSERT INTO Espace (nom, description, idLogement, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
          [espace.nom, espace.description, id]
        );
      }

      return await logementService.getLogementById(id);
    } catch (error) {
      throw error;
    }
  },

  uploadLogementImage: async (id, file, userId, userRole) => {
    try {
      const logement = await getOwnedLogement(id);
      ensureAccess(logement, userId, userRole);

      if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
        throw new Error('Configuration Cloudinary manquante');
      }

      const { uploadBuffer } = require('../config/cloudinary');
      const result = await uploadBuffer(file.buffer, {
        folder: `${env.CLOUDINARY_FOLDER}/logements/${id}`,
        resource_type: 'image',
      });

      const [insertResult] = await pool.execute(
        'INSERT INTO Image (url, idLogement, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [result.secure_url, id]
      );

      const [images] = await pool.execute('SELECT * FROM Image WHERE id = ?', [insertResult.insertId]);
      return images[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = logementService;
