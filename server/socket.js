module.exports = {

    //sockets for chat

    connect: function (io) {
        const socketRoom = [];
        var roomParticipants = {};

        const chat = io.of('/chat');

        function participantsInRoom(room) {
            return Array.from(new Set((roomParticipants[room] || []).map(participant => participant.name)));
        }

        function removeSocketFromRoom(socket, notify) {
            const index = socketRoom.findIndex(entry => entry.id === socket.id);
            if (index === -1) {
                return;
            }

            const participant = socketRoom[index];
            socketRoom.splice(index, 1);
            socket.leave(participant.room);
            const members = roomParticipants[participant.room] || [];
            roomParticipants[participant.room] = members.filter(member => member.id !== socket.id);
            if (roomParticipants[participant.room].length === 0) {
                delete roomParticipants[participant.room];
            }

            if (notify) {
                chat.to(participant.room).emit('roomPresence', {
                    user: participant.name,
                    action: 'left'
                });
                chat.to(participant.room).emit('roomUsers', participantsInRoom(participant.room));
            }
        }

        chat.on('connection', (socket) => {
            socket.on('registerGroupAdmin', (account) => {
                if (account && (account.role === 'Super Admin' || account.role === 'Group Admin')) {
                    socket.join('group-admins');
                }
            });

            socket.on('message', (message) => {
                const participant = socketRoom.find(entry => entry.id === socket.id);
                if (participant && typeof message === 'string' && message.trim()) {
                    chat.to(participant.room).emit('message', message, participant.name);
                }
            });

            socket.on("joinRoom", (room, user) => {
                if (typeof room !== 'string' || !room || typeof user !== 'string' || !user) {
                    return;
                }
                removeSocketFromRoom(socket, true);
                socket.join(room, () => {
                    const participant = { id: socket.id, room, name: user };
                    socketRoom.push(participant);
                    roomParticipants[room] = roomParticipants[room] || [];
                    roomParticipants[room].push(participant);
                    chat.to(room).emit('roomPresence', { user, action: 'joined' });
                    chat.to(room).emit('roomUsers', participantsInRoom(room));
                    chat.to(room).emit('numusers', participantsInRoom(room).length);
                    socket.emit('joined', room);
                });
            });

            socket.on("leaveRoom", (room, user) => {
                const participant = socketRoom.find(entry => entry.id === socket.id);
                if (participant && participant.room === room && participant.name === user) {
                    removeSocketFromRoom(socket, true);
                    socket.emit('left', room);
                    chat.to(room).emit('numusers', participantsInRoom(room).length);
                }
            });

            socket.on("disconnect", () => {
                const participant = socketRoom.find(entry => entry.id === socket.id);
                const room = participant && participant.room;
                removeSocketFromRoom(socket, true);
                if (room) {
                    chat.to(room).emit('numusers', participantsInRoom(room).length);
                }
            });
        });
    }
}
