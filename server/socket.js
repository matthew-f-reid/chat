module.exports = {

    //sockets for chat

    connect: function(io, PORT){
        var rooms=["room1", "room2", "room3"];
        var socketRoom = [];
        var socketRoomnum = [];

        const chat = io.of('/chat');

        chat.on('connection', (socket) => {
            socket.on('message', (message) => {
                for(i = 0; i < socketRoom.length; i++){
                    if(socketRoom[i][0] == socket.id){
                        chat.to(socketRoom[i][1]).emit('message', message);
                    }
                }
            });

            socket.on('newroom', (newroom) => {
                if(rooms.indexOf(newroom) == -1){
                    rooms.push(newroom);
                    chat.emit('roomlist', JSON.stringify(rooms));
                }
            });

            socket.on('roomlist', (m) => {
                chat.emit('roomlist', JSON.stringify(rooms));
            });

            socket.on('numusers', (room) => {
                var usercount = 0;

                for(i = 0; i < socketRoomnum.length; i++){
                    if(socketRoomnum[i][0] == room){
                        usercount = socketRoomnum[i][1];
                    }
                }
                chat.in(room).emit('numusers', usercount);
            });

            socket.on("joinRoom", (room, user) => {
                console.log(user);
                    socket.join(room, () => {
                        var inroomSocketarray = false;

                        for(i = 0; i < socketRoom.length; i++){
                            if(socketRoom[i][0] == socket.id){
                                socketRoom[i][1] = room;
                                inroom = true;
                            }
                        }
                        if(inroomSocketarray == false){
                            socketRoom.push([socket.id, room]);
                            var hasroomnum = false;
                            for(j = 0; j < socketRoomnum.length; j++){

                                if(socketRoomnum[j][0] == room){
                                    socketRoomnum[j][1] = socketRoomnum[j][1]+1;
                                    hasroomnum = true;
                                }
                            }
                            if(hasroomnum == false){
                                socketRoomnum.push([room, 1]);
                            }
                        }

                        chat.in(room).emit("notice", user + " has joined the chat");
                    });

                    return chat.in(room).emit("joined", room);
            });

            socket.on("leaveRoom", (room, user) => {

                for(i = 0; i < socketRoom.length; i++){
                    if(socketRoom[i][0] == socket.id){
                        socketRoom.splice(i, 1);
                        socket.leave(room);
                        chat.to(room).emit("notice", user + " has left the chat");
                    }
                }

                for(j = 0; j < socketRoomnum.length; j++){
                    if(socketRoomnum[j][0] == room){
                        socketRoomnum[j][1] = socketRoomnum[j][1]-1;
                        if(socketRoomnum[j][1] == 0){
                            socketRoomnum.splice(j, 1);
                        }
                    }
                }
            });

            socket.on("disconnect", () => {
                chat.emit("disconnect");
                for(i = 0; i < socketRoom.length; i++){
                    if(socketRoom[i][0] == socket.id){
                        socketRoom.splice(i, 1);
                    }
                }

                for(j = 0; j < socketRoomnum.length; j++){
                    if(socketRoomnum[j][0] == socket.room){
                        socketRoomnum[j][1] = socketRoomnum[j][1]-1;
                    }
                }
                console.log("client disconected");
            });
        });
    }
}
