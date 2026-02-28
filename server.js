//Loads the env variables 
require('dotenv').config();


//Imports the modules needed
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


const app = express(); //Creates the Express application
const PORT = process.env.PORT || 3600; //Will use the port from env variables or defaults to 3600

//Enables CORS for frontend to make requests
app.use(cors());


//Enables the server to understand JSON (parse)
app.use(express.json());



//Uses routes defined in routes/states.js
app.use('/states', require('./routes/states'));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>US States Fact Finder API</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    background-color: #f4f6f8;
                }
                h1 { color: #2c3e50; }
                button {
                    margin: 5px 0;
                    padding: 8px 14px;
                    border: none;
                    border-radius: 4px;
                    background-color: #3498db;
                    color: white;
                    cursor: pointer;
                }
                button: hover {
                    background-color: #2980b9;
                }
                .box {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    max-width: 700px;
                }
                pre {
                    background: #eee;
                    padding: 10px;
                    border-radius: 4px;
                    overflow-x: auto;
                }
            </style>

            </head>
            <body>
                <div class="box">
                <h1>U.S. States API</h1>
                <p>This REST API provides U.S. state data and MongoDB-backed fun facts.</p>
                
                <h3>Try it Live Here:</h3>

                <button onclick="getStates()">Get All States</button>
                <button onclick="getRandomState()">Get Random State</button>

                <h3> Response:</h3>
                <pre id="output">Click a button to see data...</pre>
                </div>

                <script>
                    async function getStates() {
                    const res = await fetch('/states');
                    const data= await res.json();
                    document.getElementById('output').textContent = 
                        JSON.stringify(data.slice(0,5), null, 2) + "\\n\\...Showing first 5 states";
                    }
                
                async function getRandomState() {
                    const res= await fetch('/states');
                    const data = await res.json();
                    const random = data[Math.floor(Math.random() * data.length)];
                    document.getElementById('output').textContent = 
                        JSON.stringify(random,null,2);
                    }
                </script>
            </body>
        </html>
    `);
})



//CATCH-ALL for 404 
app.all('*', (req,res) => {
    //Will send the correct type of response to the client
    if(req.accepts('html')) {
        res.status(404).send(`
            <!DOCTYPE html>
        <html>
            <head>
                <title>404 Not Found</title>
            </head>
            <body>
                <h1>404 Not Found</h1>
                <p>This page does not exist</p>
            </body>
        </html> 
        `);

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