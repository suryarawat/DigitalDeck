const { getConcSessions, addSession, getSession, getPlayerNames, updateSession } = require('./services/utilities');


function handleSocket(io) {
    io.on("connection", (socket) => { 
        console.log("Connected");
        socket.emit("hello-world"); 
        socket.on('joinRoom', async (sessionId) => {
            let session = await getSession(sessionId);
            console.log("Room joined");
            socket.join(sessionId);
            // emit to others which are in the same room
            console.log("Emitting to: "+sessionId);
            socket.to(sessionId).emit("PlayerJoined", session);
        });

        socket.on('gameStarted', async (sessionId) => {
            socket.to(sessionId).emit("launchGame");

        });

        socket.on('disconnect', () => {
            console.log("Disconnected");
        });

        socket.on('drawCard', ({ sessionId, numCards, player }) => {
            socket.to(sessionId).emit('cardDrawn', { deck: numCards });
            socket.to(sessionId).emit("updateOtherPlayersInfo", {name: player.name, numCards: player.numCards});
        });

        socket.on("playCard", ({ sessionId, cardsOnTable, player }) => {
            socket.to(sessionId).emit("cardPlayed", { table: { cards: cardsOnTable } });
            socket.to(sessionId).emit("updateOtherPlayersInfo", {name: player.name, numCards: player.numCards});
        });

        socket.on("endTurn", async ({ sessionId, playerId }) => {
            let session = await getSession(sessionId);
            session.currentTurn = playerId + 1;
            await updateSession(session);
            socket.to(sessionId).emit("setTurn", { playerId: session.currentTurn });
        });

        socket.on("endGame", ({ sessionId, table, winners }) => {
            socket.to(sessionId).emit("gameEnded", { table: table, winners: winners });
        });

        socket.on("resetGame", async ({ sessionId }) => {
            let session = await getSession(sessionId);
            session.currentTurn = 0;
            session.gameState = 0;
            await updateSession(session);
            socket.to(sessionId).emit("gameResetted");
        });
    });
}


module.exports = { handleSocket }
