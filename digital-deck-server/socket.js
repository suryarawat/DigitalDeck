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
            setTimeout(() => socket.to(sessionId).emit("PlayerJoined", session)
                , 1000);

        });

        socket.on('gameStarted', async (sessionId) => {
            let session = await getSession(sessionId);
            console.log("game Started for a player");
            // session.gameStarted = true;
            // await updateSession(session);
            // emit to others which are in the same room
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

        socket.on("endTurn", ({ sessionId, playerId }) => {
            socket.to(sessionId).emit("setTurn", {playerId: playerId + 1});
        });

        socket.on("endGame", ({ sessionId, table, winners }) => {
            socket.to(sessionId).emit("gameEnded", { table: table, winners: winners });
        });

        socket.on("resetGame", ({ sessionId }) => {
            console.log('test');
            socket.to(sessionId).emit("gameResetted");
        });
    });
}


module.exports = { handleSocket }
