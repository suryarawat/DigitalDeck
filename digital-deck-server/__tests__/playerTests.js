const supertest = require('supertest');
const {app} = require('../index');
const request = supertest(app);
const {addSession} = require('../services/utilities');
const Player = require('../models/player');
const Table = require('../models/table');

beforeAll(() => {
    var player = new Player( [ 12, 13, 14, 15]);
    var table = new Table([1, 2, 3, 4, 5, 6, 7]);

    var session = {
        "numDecks" : 1,
        "numPlayers" : 1, 
        "sessionId" : 0,
        "players" : [
                player
        ],
        "table" : table,
        "deck" : [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
    };
    
    addSession(session);
  });

/**
 * Testing play card enpoint
 */
 describe('POST /player/playcard', function () {
     const body1 = {
         "sessionId": 0,
         "playerId" : 0,
         "cardIndex": 1,
         "card" : 13
     };

     const body2 = {
        "sessionId": 0,
        "playerId" : 0,
        "cardIndex": 2,
        "card" : 14
    };
    it('respond with 200 ok ', async function () {
        const res = await request.post('/player/playcard/').send(body1);
        expect(res.status).toBe(200);
    });

    it('respond with 200 ok ', async function () {
        const res = await request.post('/player/playcard/').send(body2);
        expect(res.status).toBe(200);
    });
});