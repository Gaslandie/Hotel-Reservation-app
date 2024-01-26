const express = require('express')
const mongoose = require('mongoose')
const app = express()
const connectDB = require('./db')

const port = process.env.PORT || 4000
const start = async () => {
    try {
        await connectDB//attendre la connexion à la base de données
        app.listen(port,() => console.log(`server is listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()


