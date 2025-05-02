//Loads the env variables 
require('dotenv').config();


//Imports the modules needed
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express(); //Creates the Express application
const PORT = process.env.PORT || 3600; //Will use the port from env variables or defaults to 3600

//Enables CORS for frontend to make requests
app.use(cors());


//Enables the server to understand JSON (parse)
app.use(express.json());

//Uses routes defined in routes/states.js
app.use('/states', require('./routes/states'));


//CATCH-ALL for 404 
app.all('*', (req,res) => {
    //Will send the correct type of response to the client
    if(req.accepts('html')) {
        res.status(404).send('<h1>404 Not Found</h1>');
    } else if (req.accepts('json')) {
        res.status(404).json({ error: '404 Not Found' });
    } else {
        res.status(404).type('txt').send('404 Not Found');
    }
});


//MongoDB connection using Mongoose
mongoose.connect(process.env.DATABASE_URI)
    .then(() => {
        console.log('Connected to DB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });