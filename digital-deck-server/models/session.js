var cardDistService = require('../services/cardDistService');
const { getDB } = require('./dbConnection');
var Player = require("./player.js");
var Table = require("./table.js");

/**
 * Class that creates and manages a game session
 */
module.exports = class Session {
  // Keeps track of distinct game sessions
  static id = 0;
  static async findUniqueSessionId(){
    var maxSession = 0;
    var sessions = [];
    if (process.env.NODE_ENV != 'test') {
      const sessionData = await getDB();
      const cursor = await sessionData.find();
      sessions = await cursor.toArray();

      if (!sessions || sessions.length == 0) {
        return 0;
      }
      sessions.forEach(session => {
        const id = Number(session.sessionId);
        maxSession = Math.max(maxSession, id);
      });

      maxSession = Number(maxSession) + 1;
      return maxSession;
    }
    else {
      return Session.id++;
    }
  }

  static async build(decks, players, cardsPerPlayer, cardsOnTable, gamemode){
    const sessionId = await Session.findUniqueSessionId();
    return new Session(decks, players, cardsPerPlayer, cardsOnTable, sessionId, gamemode);
  }

  constructor(decks, players, cardsPerPlayer, cardsOnTable, sessionId, gamemode) {
    this.numDecks = decks;
    this.numPlayers = players;
    this.sessionId = Number(sessionId);
    this.players =[];
    this.table = new Table([]);
    this.deck=[];
    this.cardsPerPlayer = cardsPerPlayer;
    this.cardsOnTable= cardsOnTable;
    this.gameStarted = false;
    this.gamemode = gamemode;
    Player.resetPlayerCount();
    let newPlayer = new Player([], "", 0);
    newPlayer.isHost=true;
    this.players.push(newPlayer);
  }
  // updates Deck when shuffleCard Service is called
  updateDeck(newDeck) {
    this.deck = newDeck;
  }
};
