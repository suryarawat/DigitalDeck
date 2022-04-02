function handleSocket(io)
{
    io.on("connection", (socket) => {
        console.log("Connected");
        socket.emit("hello-world");
      
        socket.on('joinRoom', (sessionId) => {
            socket.join(sessionId);
            console.log("in server", sessionId);
        });

        socket.on('disconnect', () => {
            console.log("Disconnected");
        });

        socket.on('drawCard', ({ sessionId, numCards, player }) => {
            socket.to(sessionId).emit('cardDrawn', { deck: numCards, player: player });
        });

        socket.on("playCard", ({ sessionId, cardsOnTable, player }) => {
            socket.to(sessionId).emit("cardPlayed", { table: { cards: cardsOnTable }, player: player });
        });
    })
}


module.exports = {handleSocket}