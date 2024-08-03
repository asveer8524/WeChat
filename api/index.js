const express = require('express');
const dotenv=require("dotenv").config();  //dotenv is a popular npm package used for loading environment variables from a .env file into the process.env object
const connectDB = require ("./config/dbConnection");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ws = require('ws'); //web sockets
const {websocketConnection} = require('./websocketConnection/wsConnect,js');


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
/*
// Handle WebSocket connections when ever there is a new connection done to server ws connection will be established for eah of them
WSS.on('connection', (connection,req) => {

// We will check who all are online and send the all the online user
// WSS.clients will give us only ids we want usernames sp we will pass a req param; from req.headers we will choose cookie (jwt token) and decript it

    const cookies = req.headers.cookie;

    if(cookies)
    {
        const tokenCookieString = cookies.split(';').find(str=>str.startsWith('token=')); // as there can be may cookies; fetch cookies for each
        
        if(tokenCookieString)
        {
            const token = tokenCookieString.split('=')[1];

            if(token)
            {
                jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
                    if (err) {
                        return res.status(401).json({ error: 'User is not authorized' });
                    }
                    console.log(userData);
                   // res.json(userData);
                });
            }
        }
        
    }

    });
*/

WSS.on('connection', (connection, req) => {
    websocketConnection(connection, req);
});