const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();
const firebaseAdmin = require("firebase-admin");
const firebaseConfig = require("./config/firebaseConfig");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Inicializar o Firebase
firebaseAdmin.initializeApp({
  databaseURL: process.env.DATABASE_URL, 
  credential: firebaseAdmin.credential.cert({
    type: process.env.CREDENTIAL_TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_URL,
    client_x509_cert_url: process.env.CLIENT_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN
  }),
});

const linkedinRoutes = require("./routes/linkedin");
app.use("/linkedin", linkedinRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const corsOptions = {
  origin: `'*'`,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Outras rotas podem ser adicionadas da mesma forma

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
