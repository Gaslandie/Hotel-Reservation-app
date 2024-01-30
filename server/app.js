const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');
const roomRoutes = require('./routes/room');
const userRoutes = require('./routes/user');
const reservationRoutes = require('./routes/reservation');
const errorHandler = require('./errors/errorhandler');
const helmet = require('helmet');
const cors = require('cors');
const limiter = require('./securité/rateLimit');

const app = express();
const connectDB = require('./db');

//nos middllewares
app.use(express.json());
app.use(errorHandler);
app.use(morgan('tiny'));
    //securité
//helmet ajoute plusieurs en-tetes http pour securiser notre application
app.use(helmet());

//permet ou restreint les ressources demandées sur un serveur web en fonction de l'origine de la requete
app.use(cors());
app.use(limiter);
//nos routes
app.use('/api/rooms',roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservation',reservationRoutes)

const port = process.env.PORT || 4000;
const start = async () => {
    try {
        await connectDB()//attendre la connexion à la base de données
        app.listen(port,() => console.log(`server is listening on port ${port}`))
    } catch (error) {
        console.log(error);
    }
}

start();


