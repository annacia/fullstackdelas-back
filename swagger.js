const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
    info: {
        version: "1.0.0",
        title: "FullStackDelas - Backend",
        description: "API Backend do projeto FullStackDelas"
    },
    servers: [
        {
            url: 'http://localhost:3000'
        }
    ],
    components: {
        schemas: {
            requestBody: {
                $nome: "Nome do Usuário",
                $email: "email@test.com",
                $linkedin: "https://www.linkedin.com/in/usuario",
                $frase: "Uma frase bonita"
            },
            responseCreateSuccess: {
                msg: "Registro criado com sucesso"
            }
        }
    }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/linkedin.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index');           // Your project's root file
});