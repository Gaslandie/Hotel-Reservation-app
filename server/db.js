const mongoose = require('mongoose');

//connexion à notre base de données MongoDB
const connectDB = async () =>{
   try {
     await mongoose.connect(process.env.MONGO_URI)
    console.log('connected to mongoDB Atlas')
   } catch (error) {
    console.error('Error connecting to MongoDB',error);
    process.exit(1)//arreter l'application en cas d'echec de connexion
   }
}

module.exports = connectDB;