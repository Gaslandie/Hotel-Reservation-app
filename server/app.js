const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const roomRoutes = require('./routes/room');
const errorHandler = require('./errors/errorhandler');
const helmet = require('helmet');
const cors = require('cors');
const limiter = require('./securité/rateLimit')

const app = express();
const connectDB = require('./db');

//nos middllewares
app.use(express.json());
app.use(errorHandler);
//securité
app.use(helmet());
app.use(cors());
app.use(limiter);
//nos routes
app.use('/api/rooms',roomRoutes);

const port = 4000
const start = async () => {
    try {
        await connectDB()//attendre la connexion à la base de données
        app.listen(port,() => console.log(`server is listening on port ${port}`))
    } catch (error) {
        console.log(error);
    }
}

start();


