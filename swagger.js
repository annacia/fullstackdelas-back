const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
    info: {
        version: "1.0.0",
        title: "FullStackDelas - Backend",
        description: "API Backend do projeto FullStackDelas"
    },
    servers: [
        {
            url: 'http://fullstackdelas-back.onrender.com/'
        }
    ],
    components: {
        schemas: {
            requestRegisterCreate: {
                $nome: "Nome do Usuário",
                $email: "email@test.com",
                $linkedin: "https://www.linkedin.com/in/usuario",
                $frase: "Uma frase bonita"
            },
            responseGet: [
                {
                    "nome": "Nome do Usuário",
                    "email": "email@test.com",
                    "linkedin": "https://www.linkedin.com/in/usuario",
                    "frase": "Uma frase bonita"
                }
            ],
            responseGetRegisterById: {
                $nome: "Nome do Usuário",
                $email: "email@test.com",
                $linkedin: "https://www.linkedin.com/in/usuario",
                $frase: "Uma frase bonita"
            },
            responseCreateSuccess: {
                $msg: "Registro criado com sucesso",
                $key: "-123abc"
            },
            responseUpdateSuccess: {
                $msg: "Registro atualizado com sucesso",
                $key: "-123abc"
            },
            responseDeleteSuccess: {
                $msg: "Registro excluído com sucesso"
            },
            responseError: {
                $error: "Erro interno do servidor"
            },
            responseNotFound: {
                $error: "Registro não encontrado"
            }
        }
    }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/linkedin.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index');           // Your project's root file
});