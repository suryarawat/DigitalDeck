var cardDistService = require('../services/cardDistService');
var Player = require("./player.js");
const {getConcSessions} = require('../services/utilities');

/**
 * Class that creates and manages a game session
 */
module.exports = class Session {
  // Keeps track of distinct game sessions
  static async findUniqueSessionId(){
    var maxSession = 0;
    var allSessions = await getConcSessions();
    if (!allSessions || allSessions.length == 0) {
      return 0;
    }
    allSessions.forEach(session => {
      const id = Number(session.sessionId);
      maxSession = Math.max(maxSession, id);
    });
    maxSession = Number(maxSession) + 1;
    return maxSession;
  }

  static async build(decks, players, cardsPerPlayer, cardsOnTable){
    const sessionId = await Session.findUniqueSessionId();
    return new Session(decks, players, cardsPerPlayer, cardsOnTable, sessionId);
  }

  constructor(decks, players, cardsPerPlayer, cardsOnTable, sessionId) {
    this.numDecks = decks;
    this.numPlayers = players;
    this.sessionId = Number(sessionId);
    this.players =[] ;
    this.table ;
    this.deck=[];
    this.cardsPerPlayer = cardsPerPlayer;
    this.cardsOnTable= cardsOnTable;
    this.gameStarted = false;
    Player.resetPlayerCount();
    let newPlayer = new Player([], "");
    newPlayer.isHost=true;
    this.players.push(newPlayer);
  }
  // updates Deck when shuffleCard Service is called
  updateDeck(newDeck) {
    this.deck = newDeck;
  }
};
