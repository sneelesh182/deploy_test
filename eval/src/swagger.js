const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
    servers:[
        {
            url:'https://deploy-test-msnv.onrender.com',
            description:'Event Management App'
        }
    ]
  },
  apis: ['./src/routes/*.js'],
};

const openapiSpecification = swaggerJsdoc(options);
module.exports=openapiSpecification