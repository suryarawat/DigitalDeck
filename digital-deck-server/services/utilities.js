const Session = require('../models/session');
const Player = require('../models/player');
const Table = require('../models/table');
const {getDB} = require('../models/dbConnection');

let concSessions = [];
let sessionData;
/**
 * Cleans sessions from the database
 * 
 * @return [array of {json} ] The array of json containing information of all sessions
 */
function cleanSession(session) {
    session.players.forEach((player, index) => session.players[index] = convertToPlayer(player));
    session.table = convertToTable(session.table);
    delete session._id;
}

/**
 * Updates sessions in the database
 */
async function updateSession(session) {
    const query = {'sessionId': session.sessionId};
    if (process.env.NODE_ENV !== 'test')
    {
        if (sessionData == undefined)
        {
            sessionData = await getDB();
        }
        await sessionData.replaceOne(query, session);
    }
}

/**
 * Returns all the sessions
 * 
 * @return [array of {json} ] The array of json containing information of all sessions
 */
async function getConcSessions()
{   
    if (process.env.NODE_ENV == 'test')
    {
        return concSessions;
    }
    if (sessionData == undefined)
    {
        sessionData = await getDB();
    }
    var sessions = [];
    const cursor = await sessionData.find();
    sessions = await cursor.toArray();
    return sessions;
}

/**
 * Clear all the sessions. Used for testing
 */
async function clearConcSessions()
{
    if (process.env.NODE_ENV == 'test')
    {
        concSessions = [];
        Session.id = 0;
    }
    else
    {
        if (sessionData == undefined)
        {
            sessionData = await getDB();
        }
        await sessionData.deleteMany();
        Session.id = 0;
    }    
}

/**
 * Adds a new session in concurrent sessions
 * 
 * @param session The session to add
 */
async function addSession(session)
{
    if (process.env.NODE_ENV == 'test')
    {
        concSessions.push(session);
    }
    else
    {
        if (sessionData == undefined)
        {
            sessionData = await getDB();
        }
        await sessionData.insertOne(session);
    }
}

/**
 * Returns a session based on id
 * 
 * @param id The session to add
 */
async function getSession(id)
{
    const sessionId = Number(id);
    if (process.env.NODE_ENV == 'test')
    {
        return concSessions.find(session => session.sessionId === sessionId);
    }
    else
    {
        if (sessionData == undefined)
        {
            sessionData = await getDB();
        }
        const query = {sessionId: sessionId};
        const session = await sessionData.findOne(query);
        return convertToSession(session);
    }
}

function convertToSession(session) {
    try{
        let sessionCopy = new Session(session.numDecks, session.numPlayers, session.cardsPerPlayer, session.cardsOnTable, session.sessionId, session.gamemode, session.gameStarted, session.currentTurn, session.gameState);
        sessionCopy.players = session.players;
        sessionCopy.deck = session.deck;
        sessionCopy.players.forEach((player, index) => {
            sessionCopy.players[index] = convertToPlayer(player);
        });
        sessionCopy.table = convertToTable(session.table);
        return sessionCopy;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

function convertToPlayer(player) {
    try{
        return new Player(player.cards, player.name, player.playerId);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

function convertToTable(table) {
    try{
        return new Table(table.cards);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

/**
 * Returns a player based on session and player id
 * 
 * @param session the session in which to find the player
 * @param id The id of the player to find
 */
function getPlayer(session, id)
{
    if (process.env.NODE_ENV == 'test')
    {
        return session.players.find(player => player.playerId === id);
    }
    else
    {
        const player = session.players.find(p => p.playerId === id);
        return convertToPlayer(player);
    }
}

/**
 * Returns players based on session 
 * 
 * @param session the session in which to find the player
 */
 function getPlayerNames(session)
 {  let nameArray = [];
    let players = session.players;
    for (var player of players) {
        nameArray.push(player.name);
    }
    return nameArray;
 }

module.exports = {getConcSessions, clearConcSessions, addSession, getSession, getPlayer, getPlayerNames, cleanSession, updateSession};
