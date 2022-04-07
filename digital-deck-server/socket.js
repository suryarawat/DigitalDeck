const { getConcSessions, addSession, getSession, getPlayerNames } = require('./services/utilities');

function handleSocket(io) {
    io.on("connection", (socket) => { 
        console.log("Connected");
        socket.emit("hello-world"); 
        socket.on('joinRoom', async (sessionId) => {
            let session = await getSession(sessionId);
            console.log("Room joined");
            socket.join(sessionId);
            // emit to others which are in the same room
            // socket.to(sessionId).emit("PlayerJoined", session);
            socket.emit("PlayerJoined", session);
        });

        socket.on('gameStarted', async (sessionId) => {
            let session = await getSession(sessionId);
            console.log("game Started for a player");
            session.gameStarted = true;
            // emit to others which are in the same room
            // socket.to(sessionId).emit("launchGame", session);           
            socket.emit("launchGame", session);           
        });

        socket.on('disconnect', () => {
            console.log("Disconnected");
        });

        socket.on('drawCard', ({ sessionId, numCards, player }) => {
            // socket.to(sessionId).emit('cardDrawn', { deck: numCards, player: player });
            socket.emit('cardDrawn', { deck: numCards, player: player });
        });

        socket.on("playCard", ({ sessionId, cardsOnTable, player }) => {
            // socket.to(sessionId).emit("cardPlayed", { table: { cards: cardsOnTable }, player: player });
            socket.emit("cardPlayed", { table: { cards: cardsOnTable }, player: player });
        });


    })





}


module.exports = { handleSocket }
