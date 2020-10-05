var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

const dbName = 'mydb';
const dbUser = 'users';
const dbGroups = 'groups';

exports.addUser = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
        console.log("add user");
        if (err) throw err;
        let db = client.db(dbName);
        users = await db.collection(dbUser).find().toArray();
        let exist = false;
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        let user = {};
        user.name = doc.name;
        user.email = doc.email;
        user.role = doc.role;
        user.password = doc.password;
        for (var i = 0; i < users.length; i++) {
            if (user.name == users[i].user.name) {
                exist = true;
                i = users.length;
            }
        }
        if (!exist) {
            console.log("doesnt exist");
            await db.collection(dbUser).insertOne({ user });
            res.send(await db.collection(dbUser).find().toArray());
            client.close();
        } else {
            console.log("exist");
            res.send(await db.collection(dbUser).find().toArray());
            client.close();
        }
    });
};

exports.getUser = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
        console.log("get users");
        if (err) throw err;
        let db = client.db(dbName);
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        res.send(await db.collection(dbUser).find().toArray());
        client.close();
    });
};

exports.login = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
        console.log("login");
        if (err) throw err;
        let db = client.db(dbName);
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        var user = {};
        user.name = doc.name;
        user.password = doc.password;
        let userdb = await db.collection(dbUser).find({ "user.name": doc.name }).toArray();
        if (userdb.length == 0) {
            user.valid = false;
        } else {
            if (userdb[0].user.password == user.password) {
                user.valid = true;
                user.id = userdb[0]._id;
                user.role = userdb[0].user.role;
                user.email = userdb[0].user.email;
            } else {
                user.valid = false;
            }
        }
        res.send(user);
        client.close();
    });
};

exports.updateUser = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
        console.log("update user");
        if (err) throw err;
        let db = client.db(dbName);
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        let search = { _id: ObjectID(doc.id) };
        let update = { $set: { "user.name": doc.name, "user.email": doc.email, "user.role": doc.role, "user.password": doc.password } };
        let options = {};
        await db.collection(dbUser).updateOne(search, update, options);
        res.send(await db.collection(dbUser).find().toArray());
        client.close();
    });
};

exports.deleteUser = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
        console.log("del users");
        if (err) throw err;
        let db = client.db(dbName);
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        await db.collection(dbUser).deleteOne({ "user.name": req.body.name });
        res.send(await db.collection(dbUser).find().toArray());
        client.close();
    });
};

exports.addGroup = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
        console.log("add group");
        if (err) throw err;
        let db = client.db(dbName);
        let exist = false;
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        let groups = await db.collection(dbGroups).find().toArray();
        for (var i = 0; i < groups.length; i++) {
            if (doc.group == groups[i].name) {
                exist = true;
                i = groups.length;
            }
        }
        if (!exist) {
            console.log("doesnt exist");
            await db.collection(dbGroups).insertOne({ name: doc.group, rooms: [], users: [{ name: doc.user }] });
            res.send(await db.collection(dbGroups).find().toArray());
            client.close();
        } else {
            console.log("exist");
            res.send(await db.collection(dbGroups).find().toArray());
            client.close();
        }
    });
};

exports.delGroup = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
        console.log("del group");
        if (err) throw err;
        let db = client.db(dbName);
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        await db.collection(dbGroups).deleteOne({ "name": doc.group });
        res.send(await db.collection(dbGroups).find().toArray());
        client.close();
    });
};

exports.getGroup = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
        console.log("get groups");
        if (err) throw err;
        let db = client.db(dbName);
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        res.send(await db.collection(dbGroups).find().toArray());
        client.close();
    });
};

exports.addRoom = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
        console.log("add room");
        if (err) throw err;
        let db = client.db(dbName);
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        let search = { _id: ObjectID(doc.groupID._id) };
        let update = {
            $push: {
                rooms: {
                    $each: [{ "name": doc.room, "roomUsers": [{ "name": doc.user }] }]
                }
            }
        };
        let options = {};
        await db.collection(dbGroups).updateOne(search, update, options);
        res.send(await db.collection(dbGroups).find().toArray());
        client.close();
    });
};

exports.delRoom = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
        console.log("del room");
        if (err) throw err;
        let db = client.db(dbName);
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        let search = { _id: ObjectID(doc.groupID) };
        let update = {
            $pull: {
                rooms: {
                    "name": doc.room
                }
            }
        };
        let options = {};
        await db.collection(dbGroups).updateOne(search, update, options);
        res.send(await db.collection(dbGroups).find().toArray());
        client.close();
    });
};

exports.addUser2G = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
        console.log("add user 2 group");
        if (err) throw err;
        let db = client.db(dbName);
        let exist = false;
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        let search = { _id: ObjectID(doc.group) };
        let group = await db.collection(dbGroups).find(search).toArray();
        for (var i = 0; i < group[0].users.length; i++) {
            if (doc.user == group[0].users[i].name) {
                exist = true;
                i = users.length;
            }
        }
        let options = {};
        let update = {
            $push: {
                users: {
                    $each: [{ "name": doc.user }]
                }
            }
        };
        if (!exist) {
            console.log("doesnt exist");
            await db.collection(dbGroups).updateOne(search, update, options)
            res.send(await db.collection(dbGroups).find().toArray());
            client.close();
        } else {
            console.log("exist");
            res.send(await db.collection(dbGroups).find().toArray());
            client.close();
        }
    });
};

exports.delUser2G = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
        console.log("del user 2 group");
        if (err) throw err;
        let db = client.db(dbName);
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        let search = { _id: ObjectID(doc.group) };
        let update = {
            $pull: {
                users: {
                    "name": doc.user
                }
            }
        };
        let options = {};
        await db.collection(dbGroups).updateOne(search, update, options);
        res.send(await db.collection(dbGroups).find().toArray());
        client.close();
    });
};

exports.addUser2R = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
        console.log("add user 2 room");
        if (err) throw err;
        let db = client.db(dbName);
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        let search = { _id: ObjectID(doc.group) };
        let options = {};
        let group = await db.collection(dbGroups).find(search).toArray();
        let userInRoom = false;
        for (let i = 0; i < group[0].rooms.length; i++) {
            if (group[0].rooms[i].name == doc.room) {
                for (let j = 0; j < group[0].rooms[i].roomUsers.length; j++) {
                    if (group[0].rooms[i].roomUsers[j].name == doc.user) {
                        j = group[0].rooms[i].roomUsers.length;
                        i = group[0].rooms.length;
                        userInRoom = true;
                    }
                }
                if (!userInRoom) {
                    group[0].rooms[i].roomUsers.push({ name: doc.user });
                    await db.collection(dbGroups).findOneAndReplace(search, group[0], options);
                }
            }
        }
        res.send(await db.collection(dbGroups).find().toArray());
        client.close();
    });
};

exports.delUser2R = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
        console.log("del user 2 room");
        if (err) throw err;
        let db = client.db(dbName);
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        let search = { _id: ObjectID(doc.group) };
        let options = {};
        let group = await db.collection(dbGroups).find(search).toArray();
        for (let i = 0; i < group[0].rooms.length; i++) {
            if (group[0].rooms[i].name == doc.room) {
                let length = group[0].rooms[i].roomUsers.length;
                for (let j = 0; j < length; j++) {
                    if (group[0].rooms[i].roomUsers[j].name == doc.user) {
                        group[0].rooms[i].roomUsers.splice(j, 1);
                        j = group[0].rooms[i].roomUsers.length;
                        i = group[0].rooms.length;
                    }
                }
                await db.collection(dbGroups).findOneAndReplace(search, group[0], options);
            }
        }
        res.send(await db.collection(dbGroups).find().toArray());
        client.close();
    });
};