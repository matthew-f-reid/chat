var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI || "mongodb://localhost:27017/";
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

const dbName = 'chatter';
const dbUser = 'users';
const dbGroups = 'groups';
let notifyGroupAdmins = function () {};
let notifyJoinRequestDecision = function () {};

exports.setGroupRequestNotifier = function (notifier) {
    notifyGroupAdmins = notifier;
};

exports.setJoinRequestDecisionNotifier = function (notifier) {
    notifyJoinRequestDecision = notifier;
};

async function getDatabase(res, operation) {
    let client;
    try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        await operation(client.db(dbName));
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).send({ error: 'Database operation failed' });
        }
    } finally {
        if (client) {
            client.close();
        }
    }
}

function hasGroupMember(group, name) {
    return (group.users || []).some(member => member.name === name);
}

exports.addUser = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
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
            await db.collection(dbUser).insertOne({ user });
            res.send(await db.collection(dbUser).find().toArray());
            client.close();
        } else {
            res.send(await db.collection(dbUser).find().toArray());
            client.close();
        }
    });
};

exports.getUser = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
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
        if (err) throw err;
        let db = client.db(dbName);
        let doc = req.body;
        if (!doc) {
            return res.sendStatus(400);
        }
        var user = {};
        user.name = doc.name;
        user.password = doc.password;
        let userdb = await db.collection(dbUser).find({
            $or: [
                { "user.name": doc.name },
                { name: doc.name }
            ]
        }).toArray();
        if (userdb.length == 0) {
            user.valid = false;
        } else {
            let storedUser = userdb[0].user || userdb[0];
            if (storedUser.password == user.password) {
                user.valid = true;
                user.id = userdb[0]._id;
                user.role = storedUser.role;
                user.email = storedUser.email;
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
            await db.collection(dbGroups).insertOne({ name: doc.group, rooms: [], users: [{ name: doc.user }] });
            res.send(await db.collection(dbGroups).find().toArray());
            client.close();
        } else {
            res.send(await db.collection(dbGroups).find().toArray());
            client.close();
        }
    });
};

exports.delGroup = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
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
        }
        if (!exist) {
            await db.collection(dbGroups).updateOne(search, update, options);
            res.send(await db.collection(dbGroups).find().toArray());
            client.close();
        } else {
            res.send(await db.collection(dbGroups).find().toArray());
            client.close();
        }
    });
};

exports.delUser2G = function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, client) {
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

exports.requestGroup = function (req, res) {
    getDatabase(res, async function (db) {
        const groupId = req.body.group;
        const userName = req.body.user;
        if (!ObjectID.isValid(groupId) || !userName) {
            return res.sendStatus(400);
        }

        const account = await db.collection(dbUser).findOne({
            $or: [{ 'user.name': userName }, { name: userName }]
        });
        const user = account && (account.user || account);
        if (!user || user.role !== 'User') {
            return res.sendStatus(403);
        }

        const group = await db.collection(dbGroups).findOne({ _id: ObjectID(groupId) });
        if (!group) {
            return res.sendStatus(404);
        }
        if (hasGroupMember(group, userName)) {
            return res.status(409).send({ error: 'Already a group member' });
        }
        if ((group.joinRequests || []).some(request => request.user === userName)) {
            return res.status(200).send({ status: 'pending' });
        }

        await db.collection(dbGroups).updateOne(
            { _id: group._id },
            { $push: { joinRequests: { user: userName, requestedAt: new Date() } } }
        );
        notifyGroupAdmins({
            type: 'group',
            user: userName,
            group: group.name,
            groupId: group._id.toString()
        });
        res.status(201).send({ status: 'pending' });
    });
};

exports.requestRoom = function (req, res) {
    getDatabase(res, async function (db) {
        const groupId = req.body.group;
        const roomName = req.body.room;
        const userName = req.body.user;
        if (!ObjectID.isValid(groupId) || !roomName || !userName) {
            return res.sendStatus(400);
        }

        const account = await db.collection(dbUser).findOne({
            $or: [{ 'user.name': userName }, { name: userName }]
        });
        const user = account && (account.user || account);
        if (!user || user.role !== 'User') {
            return res.sendStatus(403);
        }

        const group = await db.collection(dbGroups).findOne({ _id: ObjectID(groupId) });
        if (!group) {
            return res.sendStatus(404);
        }
        if (!hasGroupMember(group, userName)) {
            return res.status(403).send({ error: 'Join the group before requesting a room' });
        }

        const room = (group.rooms || []).find(item => item.name === roomName);
        if (!room) {
            return res.sendStatus(404);
        }
        if ((room.roomUsers || []).some(member => member.name === userName)) {
            return res.status(409).send({ error: 'Already a room member' });
        }
        if ((room.joinRequests || []).some(request => request.user === userName)) {
            return res.status(200).send({ status: 'pending' });
        }

        await db.collection(dbGroups).updateOne(
            { _id: group._id, 'rooms.name': roomName },
            { $push: { 'rooms.$.joinRequests': { user: userName, requestedAt: new Date() } } }
        );
        notifyGroupAdmins({
            type: 'room',
            user: userName,
            group: group.name,
            room: roomName,
            groupId: group._id.toString()
        });
        res.status(201).send({ status: 'pending' });
    });
};

exports.decideJoinRequest = function (req, res) {
    getDatabase(res, async function (db) {
        const groupId = req.body.group;
        const userName = req.body.user;
        const reviewerName = req.body.reviewer;
        const requestType = req.body.type;
        const roomName = req.body.room;
        const approve = req.body.approve === true;
        if (!ObjectID.isValid(groupId) || !userName || !reviewerName ||
            (requestType !== 'group' && requestType !== 'room') ||
            (requestType === 'room' && !roomName)) {
            return res.sendStatus(400);
        }

        const reviewerAccount = await db.collection(dbUser).findOne({
            $or: [{ 'user.name': reviewerName }, { name: reviewerName }]
        });
        const reviewer = reviewerAccount && (reviewerAccount.user || reviewerAccount);
        if (!reviewer || (reviewer.role !== 'Super Admin' && reviewer.role !== 'Group Admin')) {
            return res.sendStatus(403);
        }

        const group = await db.collection(dbGroups).findOne({ _id: ObjectID(groupId) });
        if (!group) {
            return res.sendStatus(404);
        }

        let result;
        if (requestType === 'group') {
            if (!(group.joinRequests || []).some(request => request.user === userName)) {
                return res.sendStatus(404);
            }
            const update = { $pull: { joinRequests: { user: userName } } };
            if (approve) {
                update.$addToSet = { users: { name: userName } };
            }
            result = await db.collection(dbGroups).updateOne({ _id: group._id }, update);
        } else {
            if (!hasGroupMember(group, userName)) {
                return res.status(400).send({ error: 'User must be a group member before joining a room' });
            }
            const room = (group.rooms || []).find(item => item.name === roomName);
            if (!room || !(room.joinRequests || []).some(request => request.user === userName)) {
                return res.sendStatus(404);
            }
            const update = { $pull: { 'rooms.$.joinRequests': { user: userName } } };
            if (approve) {
                update.$addToSet = { 'rooms.$.roomUsers': { name: userName } };
            }
            result = await db.collection(dbGroups).updateOne(
                { _id: group._id, 'rooms.name': roomName },
                update
            );
        }

        if (!result.matchedCount) {
            return res.sendStatus(404);
        }
        const account = await db.collection(dbUser).findOne({
            $or: [{ 'user.name': userName }, { name: userName }]
        });
        if (!account) {
            return res.sendStatus(404);
        }
        const notificationId = new ObjectID();
        const location = requestType === 'room'
            ? group.name + ' / ' + roomName
            : group.name;
        const notification = {
            _id: notificationId,
            type: requestType,
            groupId: group._id.toString(),
            group: group.name,
            room: roomName || null,
            decision: approve ? 'approved' : 'rejected',
            message: 'Your request to join ' + location + ' was ' + (approve ? 'accepted.' : 'rejected.'),
            createdAt: new Date(),
            read: false
        };
        const notificationPath = account.user ? 'user.notifications' : 'notifications';
        await db.collection(dbUser).updateOne(
            { _id: account._id },
            { $push: { [notificationPath]: notification } }
        );
        notifyJoinRequestDecision({
            user: userName,
            groupId: group._id.toString(),
            type: requestType,
            room: roomName || null,
            decision: approve ? 'approved' : 'rejected',
            notification
        });
        res.send({ status: approve ? 'approved' : 'rejected', notification });
    });
};

exports.getNotifications = function (req, res) {
    getDatabase(res, async function (db) {
        const userName = req.body && req.body.user;
        if (!userName) {
            return res.sendStatus(400);
        }
        const account = await db.collection(dbUser).findOne({
            $or: [{ 'user.name': userName }, { name: userName }]
        });
        if (!account) {
            return res.sendStatus(404);
        }
        const user = account.user || account;
        res.send((user.notifications || []).filter(notification => !notification.read));
    });
};

exports.dismissNotification = function (req, res) {
    getDatabase(res, async function (db) {
        const userName = req.body && req.body.user;
        const notificationId = req.body && req.body.notification;
        if (!userName || !ObjectID.isValid(notificationId)) {
            return res.sendStatus(400);
        }
        const account = await db.collection(dbUser).findOne({
            $or: [{ 'user.name': userName }, { name: userName }]
        });
        if (!account) {
            return res.sendStatus(404);
        }
        const notificationPath = account.user ? 'user.notifications' : 'notifications';
        const result = await db.collection(dbUser).updateOne(
            { _id: account._id, [notificationPath + '._id']: ObjectID(notificationId) },
            { $set: { [notificationPath + '.$.read']: true } }
        );
        if (!result.matchedCount) {
            return res.sendStatus(404);
        }
        res.send({ status: 'dismissed' });
    });
};
