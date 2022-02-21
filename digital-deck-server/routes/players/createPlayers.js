const express = require('express');
const Player = require('../../model/player');
const createPlayers = express.Router();


createPlayers.post('/', function (req, res, next) {
    var player = new Player(
      req.body // only for test, will need to add Cards object in array
    );

    player.save(function (err, player) {
      if (err) { return next(err) }
      res.status(201).json(player)
    })
  })

module.exports = createPlayers;
