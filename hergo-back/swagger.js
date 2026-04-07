const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const env = require('./config/env');

const publicBaseUrl = (env.PUBLIC_BASE_URL || '').trim();
const swaggerServers = publicBaseUrl
  ? [
      {
        url: publicBaseUrl.replace(/\/$/, ''),
        description: 'Public server',
      },
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Local development server',
      },
    ]
  : [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Local development server',
      },
    ];

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hergo API Documentation',
      version: '1.0.0',
      description: 'API documentation for Hergo accommodation booking platform',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: swaggerServers,
  },
  apis: [
    './docs/swagger/auth.swagger.js',
    './docs/swagger/user.swagger.js',
    './docs/swagger/logement.swagger.js',
    './docs/swagger/reservation.swagger.js',
    './docs/swagger/review.swagger.js',
    './docs/swagger/notification.swagger.js',
    './docs/swagger/admin.swagger.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerUIOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
};

const swaggerSetup = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec, swaggerUIOptions),
};

module.exports = swaggerSetup;
