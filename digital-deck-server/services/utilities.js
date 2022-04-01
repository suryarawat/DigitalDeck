const Session = require('../models/session');
const sessionData = require('../models/dbConnection');


/**
 * Cleans sessions from the database
 * 
 * @return [array of {json} ] The array of json containing information of all sessions
 */
function cleanSession(session) {
    delete session._id;
}

/**
 * Returns all the sessions
 * 
 * @return [array of {json} ] The array of json containing information of all sessions
 */
async function getConcSessions()
{
    var sessions = await sessionData.find();
    console.log(sessions);
    sessions.forEach((session) => {
        session = cleanSession(session);
    });
    console.log(sessions);
    return sessions;
}

/**
 * Clear all the sessions. Used for testing
 */
async function clearConcSessions()
{
    await sessionData.deleteMany();
    Session.id = 0;
}

/**
 * Adds a new session in concurrent sessions
 * 
 * @param session The session to add
 */
async function addSession(session)
{
    await sessionData.insertOne(session);
}

/**
 * Returns a session based on id
 * 
 * @param id The session to add
 */
async function getSession(id)
{
    const query = {sessionId: id};
    const session = await sessionData.findOne(query);
    return session;
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

module.exports = {getConcSessions, clearConcSessions, addSession, getSession, getPlayer, cleanSession};