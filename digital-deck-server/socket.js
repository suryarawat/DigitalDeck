function handleSocket(io)
{
    io.on("connection", (socket) => {
        console.log("Connected");
        socket.emit("hello-world");
      
        socket.on('joinRoom', (sessionId) => {
            socket.join(sessionId);
            console.log("in server", sessionId)
        });
      
      })
}


module.exports = {handleSocket}