# Chatter

Created by: Matthew Reid, s5170630

# Git:
Structured the way angular is structured by default


# Data Structures:
I used 2 structures, 1 for users and the other for groups, I put rooms inside the groups.

User{id, name, email, role, password, groups[groupName, rooms[name]]}

Group{name, rooms[roomName, roomUsers[name]], users[name]}


# Angular:
Routes used to move between components.

Components used for users, groups, login, chat.

Service used for sockets

I used global variables to hold the collected users, groups, messages, currentUser.


# Node:
functions used: express(), express().use(), cors()modules used: express, cors, body-parser, http, iofiles used: socket.js, listen.js, users.JSON, groups.JSON


I used sockets for communication in the chat, I used some server routes to listen for messages for users, groups, rooms.


server routes:
/login(username, password) - checks if user exists in MongoDB  and if password is correct.

/getusers(username, email) - returns all users from MongoDB and stores in global variable.

/adduser(username, email, role, password) - adds new user to MongoDB and returns all users to global.

/deleteuser(username) - removes user from MongoDB returns all users to global.

/updateuser(id, username, role, email password) - updates user details in MongoDB and returns all users to global.

/getgroup(username) - gets all groups from MongoDB and returns all groups to global.

/addgroup{deluser2g(username, groupname)} - deletes user from MongoDB and returns all groups to global.

/addgroup{deluser2r(username, groupname, roomname)} - deletes user from room inside group in MongoDB and returns all groups to global.

/addgroup{delgroup(groupname)} - deletes group in MongoDB and returns all groups to global.

/addgroup{delroom(roomname, groupname)} - deletes room from group in MongoDB and returns all groups to global.

/addgroup{addroom(roomname, groupname)} - adds room to group in MongoDB and returns all groups to global.

/addgroup{addgroup(groupname)} - add group to MongoDB and returns all groups to global.

/addgroup{adduser2r(username, groupname, roomname)} - add user to room inside group in MongoDB and returns all groups to global.

/addgroup{adduser2g(username, groupname)} - add user to group in MongoDB and returns all groups to global.


When the client side submits a post, the server side is listening for what type of post, then the server runs an exported module and reads the MongoDB  to return back the results to store inside the component that sent the post. Each time a post is made the display updates.


