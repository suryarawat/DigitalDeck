const supertest = require('supertest');
const {app} = require('../index');
const request = supertest(app);
const {addSession} = require('../services/utilities');
const Player = require('../models/player');
const Table = require('../models/table');

beforeAll(() => {
    var player = new Player([]);
    var table = new Table([]);

    var session = {
        "numDecks" : 1,
        "numPlayers" : 1, 
        "sessionId" : 0,
        "players" : [
            player
        ],
        "table" : table,
        "deck" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52]
    };

    addSession(session);
});

/**
 * Testing draw card endpoint
 */

describe('POST /player/drawcard', function () {
    // Valid request
    it('Typical Valid request. Respond with 200', async function () {
        const body = {
            "sessionId": 0,
            "playerId" : 0,
            "numOfCards": 1
        };
        const res = await request.post('/player/drawcard').send(body);
        expect(res.status).toBe(200);
    });

    // Valid request. Draw max number of cards
    it('Draw max number of cards. Respond with 200', async function () {
        const body = {
            "sessionId": 0,
            "playerId" : 0,
            "numOfCards": 51
        };
        const res = await request.post('/player/drawcard').send(body);
        expect(res.status).toBe(200);
    });

    // Invalid request. Session Id not exist
    it('Session Id not exist. Respond with 400', async function () {
        const body = {
            "sessionId": 1,
            "playerId" : 0,
            "numOfCards": 0
        };
        const res = await request.post('/player/drawcard').send(body);
        expect(res.status).toBe(400);
    });

    // Invalid request. Player Id not exist
    it('Player Id not exist. Respond with 400', async function () {
        const body = {
            "sessionId": 0,
            "playerId" : 1,
            "numOfCards": 0
        };
        const res = await request.post('/player/drawcard').send(body);
        expect(res.status).toBe(400);
    });

    // Invalid request. Invalid numOfCards
    it('Invalid numOfCards. Respond with 400', async function () {
        const body = {
            "sessionId": 0,
            "playerId" : 0,
            "numOfCards": -1
        };
        const res = await request.post('/player/drawcard').send(body);
        expect(res.status).toBe(400);
    });

    // Invalid request. Draw more than number of available cards in deck
    it('Draw more than available cards in deck. Respond with 400', async function () {
        const body = {
            "sessionId": 0,
            "playerId" : 0,
            "numOfCards": 1
        };
        const res = await request.post('/player/drawcard').send(body);
        expect(res.status).toBe(400);
    });

    // Invalid request. Missing sessionId
    it('Missing sessionId. Respond with 400', async function () {
        const body = {
            "playerId" : 0,
            "numOfCards": 0
        };
        const res = await request.post('/player/drawcard').send(body);
        expect(res.status).toBe(400);
    });

    // Invalid request. Missing playerId
    it('Missing playerId. Respond with 400', async function () {
        const body = {
            "sessionId" : 0,
            "numOfCards": 0
        };
        const res = await request.post('/player/drawcard').send(body);
        expect(res.status).toBe(400);
    });

    // Invalid request. Missing numOfCards
    it('Missing numOfCards. Respond with 400', async function () {
        const body = {
            "sessionId": 0,
            "playerId" : 0
        };
        const res = await request.post('/player/drawcard').send(body);
        expect(res.status).toBe(400);
    });
});