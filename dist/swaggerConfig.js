"use strict";
// swaggerConfig.js
const swaggerJSDoc = require('swagger-jsdoc');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Payment API',
            version: '1.0.0',
            description: 'API documentation for the Payment API',
        },
        servers: [
            {
                url: 'http://localhost:3001',
            },
        ],
    },
    apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
