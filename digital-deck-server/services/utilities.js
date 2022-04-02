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
    session.players.forEach((player) => Object.assign(new Player(), player));
    session.table = Object.assign(new Table(), session.table);
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
        sessionData.replaceOne(query, session);
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
    sessions.forEach(session => {
        session = cleanSession(session);
    });
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
    if (process.env.NODE_ENV == 'test')
    {
        return concSessions.find(session => session.sessionId === id);
    }
    else
    {
        if (sessionData == undefined)
        {
            sessionData = await getDB();
        }
        const query = {sessionId: id};
        const session = await sessionData.findOne(query);
        session.players.forEach((player) => Object.assign(new Player(), player));
        session.table = Object.assign(new Table(), session.table);
        return session;        
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
        const player = session.players.find(player => player.playerId === id);
        return Object.assign(new Player(), player);
    }
}

module.exports = {getConcSessions, clearConcSessions, addSession, getSession, getPlayer, cleanSession, updateSession};