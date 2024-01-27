const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hotel Reservation API',
            version: '1.0.0',
            description: 'API for managing hotel reservations',
            contact: {
                name: 'Mohamed gassama',
                email: 'gassaza60@gmail.com',
            },
        },
    },
    apis: ['./routes/*.js'], // Chemin vers vos fichiers de routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
