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

    it('Should respond with 200 ok ', async function () {
        const body = {
            "sessionId": 0,
            "playerId" : 0,
            "cardIndex": 1,
            "card" : 13
        };

        const res = await request.post('/player/playcard/').send(body);
        expect(res.status).toBe(200);
        expect(res.body.players[0].cards).toStrictEqual([12, 14, 15]);
        expect(res.body.table.cards).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 13]);
    });

    it('Invalid request. Not a number is entered.', async function () {
        const body = {
            "sessionId": "zero",
            "playerId" : 0,
            "cardIndex": 1,
            "card" : 13
        };
        const res = await request.post('/player/playcard/').send(body);
        expect(res.status).toBe(400);
    });

    it('Invalid request. Out of bound cards are entered', async function () {
        const body = {
            "sessionId": 0,
            "playerId" : 0,
            "cardIndex": -1,
            "card" : 67
        };
        const res = await request.post('/player/playcard/').send(body);
        expect(res.status).toBe(400);
    });

    it('Invalid request. Non-existent session is enetered.', async function () {
        const body = {
            "sessionId": 10,
            "playerId" : 0,
            "cardIndex": 1,
            "card" : 13
        };
        const res = await request.post('/player/playcard/').send(body);
        expect(res.status).toBe(400);
    });

    it('Invalid request. Non-existent player is enetered.', async function () {
        const body = {
            "sessionId": 0,
            "playerId" : 10,
            "cardIndex": 1,
            "card" : 13
        };
        const res = await request.post('/player/playcard/').send(body);
        expect(res.status).toBe(400);
    });

    // should not be required as the request should only send the card, and not the index.
    it('Invalid request. Out of bound cardIndex is entered.', async function () {
        const body = {
            "sessionId": 0,
            "playerId" : 0,
            "cardIndex": 12,
            "card" : 13
        };
        const res = await request.post('/player/playcard/').send(body);
        expect(res.status).toBe(400);
    });
});