const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-route');
const usersRoutes = require('./routes/users-route');

const HttpError = require('./models/http-error');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

const uri = "mongodb+srv://nitish:2vTMhUui80za7Vf4@cluster0.81oh9.mongodb.net/mern?retryWrites=true&w=majority&appName=Cluster0";

// This only runs when there vis no routes
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        })
    }
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occoured' })
})

mongoose
.connect(uri)
.then(() => {
    app.listen(5000);
})
.catch(err => {
    console.log(err)
})
