const request = require('supertest');
const app = require('../index');
const {addSession} = require('../services/utilities');

beforeAll(() => {
    var session = {
        "numDecks" : 1,
        "numPlayers" : 1, 
        "sessionId" : 0,
        "players" : {
            "cards" : [ 12, 13, 14, 15],
            "playerId" : 0
        },
        "table" : [1, 2, 3, 4, 5, 6, 7],
        "deck" : [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
    };
    addSession(session);
  });

/**
 * Testing play card enpoint
 */
 describe('POST /player/playcard', function () {
     const body = {
         "sessionId": 0,
         "playerId" : 0,
         "cardIndex": 1,
         "card" : 13
     };
    it('respond with 200 ok ', async function (done) {
        await request(app)
            .post('/player/playcard')
            .set('Content-type', 'application/json')
            .send({ body })
            .expect(200, done);
    });
});