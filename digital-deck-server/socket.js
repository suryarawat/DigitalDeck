const {getConcSessions , addSession, getSession , getPlayers} = require('../digital-deck-server/services/utilities');

function handleSocket(io)
{
    io.on("connection", (socket) => {
        console.log("Connected");
        socket.emit("hello-world");
      
        socket.on('joinRoom', (sessionId) => {
         console.log("in server");
        });
      

        
      socket.on('joinRoom', (sessionId) => {
         let session = await getSession(sessionId);
         let players = await session.players;
        console.log("Room joined");
        socket.join(sessionId);
        // emit to others which are in the same room
        socket.to(sessionId).emit("PlayerJoined",players);

    }); 

      })

     

      

}


module.exports = {handleSocket}