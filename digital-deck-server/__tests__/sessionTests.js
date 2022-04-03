const supertest = require('supertest');
const { app } = require('../index');
const request = supertest(app);
const { getConcSessions, addSession, clearConcSessions } = require('../services/utilities');
const Player = require('../models/player');
const Table = require('../models/table');

beforeEach(() => {
  clearConcSessions();
});

/**
 * Testing new session endpoint
 */
describe('POST /session/new', function () {
  // Valid request
  it('Typical valid request. Respond with 200', async function () {
    const body = {
      "decks": 1,
      "players": 1,
      "cardsPerPlayer": 1,
      "cardsOnTable": 2
    };
    const res = await request.post('/session/new').send(body);
    expect(res.status).toBe(200);
    expect(res.body.numDecks).toStrictEqual(1);
    expect(res.body.numPlayers).toStrictEqual(1);
    expect(res.body.sessionId).toStrictEqual(0);
    expect(res.body.players[0].cards.length).toStrictEqual(0);
    expect(res.body.deck.length).toStrictEqual(0);
  });

  // Edge case. Max number of cards distributed
  it('Edge valid request. Respond with 200', async function () {
    const body = {
      "decks": 1,
      "players": 1,
      "cardsPerPlayer": 51,
      "cardsOnTable": 1
    };
    const res = await request.post('/session/new').send(body);
    expect(res.status).toBe(200);
    expect(res.body.numDecks).toStrictEqual(1);
    expect(res.body.numPlayers).toStrictEqual(1);
    expect(res.body.sessionId).toStrictEqual(0);
    expect(res.body.players[0].cards.length).toStrictEqual(0);
    expect(res.body.deck.length).toStrictEqual(0);
  });

  // Invalid request. Distribute more than available cards
  it('Invalid request, more than available cards are asked to be distributed. Respond with 400', async function () {
    const body = {
      "decks": 1,
      "players": 1,
      "cardsPerPlayer": 52,
      "cardsOnTable": 1,
    };
    const res = await request.post('/session/new').send(body);
    const otherResponse = await request.post('/session/distributeCards').send(res.sessionId);
    expect(res.status).toBe(200);
    expect(otherResponse.status).toBe(400);
  });

  // Invalid request. Invalid decks value
  it('Invalid decks value. Respond with 400', async function () {
    const body = {
      "decks": 0,
      "players": 1,
      "cardsPerPlayer": 1,
      "cardsOnTable": 2
    };
    const res = await request.post('/session/new').send(body);
    expect(res.status).toBe(400);
  });

  // Invalid request. Invalid players value
  it('Invalid players value. Respond with 400', async function () {
    const body = {
      "decks": 1,
      "players": 0,
      "cardsPerPlayer": 1,
      "cardsOnTable": 2
    };
    const res = await request.post('/session/new').send(body);
    expect(res.status).toBe(400);
  });

  // Invalid request. Invalid cardsPerPlayer value
  it('Invalid cardsPerPlayer value. Respond with 400', async function () {
    const body = {
      "decks": 1,
      "players": 1,
      "cardsPerPlayer": -1,
      "cardsOnTable": 2
    };
    const res = await request.post('/session/new').send(body);
    expect(res.status).toBe(400);
  });

  // Invalid request. Invalid cardsOnTable value
  it('Invalid cardsOnTable value. Respond with 400', async function () {
    const body = {
      "decks": 1,
      "players": 0,
      "cardsPerPlayer": 1,
      "cardsOnTable": -1
    };
    const res = await request.post('/session/new').send(body);
    expect(res.status).toBe(400);
  });
});

describe('GET /session/current', function () {
  // Valid request
  it('Typical valid request. Respond with 200', async function () {
    addSession({
      "numDecks": 1,
      "numPlayers": 1, 
      "sessionId": 0,
      "players": [
        new Player([1])
      ],
      "table": new Table([]),
      "deck": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52]
    });

    const res = await request.get('/session/current?sessionId=0');
    expect(res.status).toBe(200);
    expect(res.body.numDecks).toStrictEqual(1);
    expect(res.body.numPlayers).toStrictEqual(1);
    expect(res.body.sessionId).toStrictEqual(0);
    expect(res.body.players[0].cards.length).toStrictEqual(1);
    expect(res.body.table.cards.length).toStrictEqual(0);
    expect(res.body.deck.length).toStrictEqual(52);
  });

  // Invalid request. SessionId not a number
  it('Invalid request. SessionId not a number. Respond with 400', async function () {
    const res = await request.get('/session/current?sessionId=abc');
    expect(res.status).toBe(400);
  });

  // Invalid request. Session Id not exist
  it('Invalid request, sessionId not exist. Respond with 400', async function () {
    const res = await request.get('/session/current?sessionId=0');
    expect(res.status).toBe(400);
  });
});

describe('POST /session/shufflecards', function () {
  // Valid request
  it('Typical valid request. Respond with 200', async function () {
    addSession({
      "numDecks": 1,
      "numPlayers": 1, 
      "sessionId": 0,
      "players": [
        new Player([1])
      ],
      "table": new Table([]),
      "deck": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52]
    });

    const body = {
      "sessionId": 0
    };
    const res = await request.post('/session/shufflecards').send(body);
    expect(res.status).toBe(200);
    expect(res.body).not.toEqual([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52]);
  });

  // Invalid request. sessionId not a number
  it('Invalid request, sessionId not a number. Respond with 200', async function () {
    const body = {
      "sessionId": 'abc'
    };
    const res = await request.post('/session/shufflecards').send(body);
    expect(res.status).toBe(400);
  });

  // Invalid request. sessionId not exist
  it('Invalid request, sessionId not exist. Respond with 200', async function () {
    const body = {
      "sessionId": 0
    };
    const res = await request.post('/session/shufflecards').send(body);
    expect(res.status).toBe(400);
  });
});