const express = require('express');
const Player = require('../../model/player');
const getPlayers = express.Router();


// get players  ( '/' means url/players because that request is sent to this file)
getPlayers.get('/', (req, res) => {
    Player.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
} 
)

module.exports = getPlayers;
