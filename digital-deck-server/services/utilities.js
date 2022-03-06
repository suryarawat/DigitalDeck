const Session = require('../models/session');

let concSessions = [];

/**
 * Returns all the sessions
 * 
 * @return [array of {json} ] The array of json containing information of all sessions
 */
function getConcSessions()
{
    return concSessions;
}

/**
 * Clear all the sessions. Used for testing
 */
function clearConcSessions()
{
    concSessions = [];
    Session.id = 0;
}

/**
 * Adds a new session in concurrent sessions
 * 
 * @param session The session to add
 */
function addSession(session)
{
    concSessions.push(session);
}

/**
 * Returns a session based on id
 * 
 * @param id The session to add
 */
function getSession(id)
{
    return concSessions.find(session => session.sessionId === id);
}

/**
 * Returns a player based on session and player id
 * 
 * @param session the session in which to find the player
 * @param id The id of the player to find
 */
function getPlayer(session, id)
{
    return session.players.find(player => player.playerId === id);
}

module.exports = {getConcSessions, clearConcSessions, addSession, getSession, getPlayer};