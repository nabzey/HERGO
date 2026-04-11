const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hergo API',
      version: '1.0.0',
      description: 'API pour la plateforme de réservation de voyages et hébergements Hergo',
    },
    servers: [
      {
        url: 'http://localhost:{port}/{basePath}',
        variables: {
          port: {
            default: '5000'
          },
          basePath: {
            default: 'api'
          }
        }
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js', './src/docs/swagger/*.swagger.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, { customCss: '.swagger-ui .topbar { display: none }' })
};