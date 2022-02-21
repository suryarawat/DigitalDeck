const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());


// all requests to url/players will go to getPlayers.js
const getplayers = require('./routes/players/getPlayers');
app.use('/players', getplayers); 

const createplayer = require('./routes/players/createPlayers');
app.use('/createplayer', createplayer); 

// connect to db
const db = "mongodb+srv://admin:admin123@cluster0.vrlsj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(db, {
    useNewUrlParser: true
}).then(() => {
    console.log(`Database connected successfully ${db}`)
}).catch(err => {
    console.log(`Unable to connect with the database ${err}`)
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});