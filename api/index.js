const express = require('express');
const dotenv=require("dotenv").config();  //dotenv is a popular npm package used for loading environment variables from a .env file into the process.env object
const connectDB = require ("./config/dbConnection");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ws = require('ws'); //web sockets

connectDB();
const port=process.env.port || 5000;
const app=express();
app.use(express.json());
app.use(cookieParser());

//to allow which url can acess express js routes
app.use(cors(
    {
        credentials:true,
        origin:process.env.CLIENT_URL,
    }
))

app.use('',require('./routes/RegisterRequests'));

// Establising websocket connection
//This websocket connection will be active when connection will be establised
// Create an HTTP server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Create a WebSocket server
const WSS = new ws.WebSocketServer({ server });

// Handle WebSocket connections when ever there is a new connection done to server ws connection will be established for eah of them
WSS.on('connection', (connection) => {
    console.log(`New WebSocket connection established`);
    connection.send('Hello');
});
