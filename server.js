require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors());
app.use(express.json());

app.use('/states', require('./routes/states'));

app.all('*', (req,res) => {
    if(req.accepts('html')) {
        res.status(404).send('<h1>404 Not Found</h1>');
    } else if (req.accepts('json')) {
        res.status(404).json({ error: '404 Not Found' });
    } else {
        res.status(404).type('txt').send('404 Not Found');
    }
});


//DB connection
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => console.error(err));