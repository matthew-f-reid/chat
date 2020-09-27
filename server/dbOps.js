var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

const dbName = 'mydb';
const dbUser = 'users';
const dbGroups = 'groups';


exports.addUser = function(req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function(err, client) {
        console.log("add user");
        if (err) throw err;
        let db = client.db(dbName);
        users = await db.collection(dbUser).find().toArray();
        let exist = false;
        let doc = req.body;
        if(!doc){
            return res.sendStatus(400);
        }     

        let user = {};
        user.name = doc.name;
        user.email = doc.email;
        user.role = doc.role;
        user.password = doc.password;

        for(var i = 0; i < users.length; i++){
            if(user.name == users[i].user.name){
                exist = true;
                i = users.length;
            }
        }
        if(!exist){
            console.log("doesnt exist");
            await db.collection(dbUser).insertOne({user});
            res.send(await db.collection(dbUser).find().toArray());
            client.close();
        } else {
            console.log("exist");
            res.send(await db.collection(dbUser).find().toArray());
            client.close();
        }
    });
};

exports.getUser = function(req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function(err, client) {
        console.log("get users");
        if (err) throw err;
        let db = client.db(dbName);
        
        let doc = req.body;
        if(!doc){
            return res.sendStatus(400);
        }
        res.send(await db.collection(dbUser).find().toArray());
        client.close();
    });
};

exports.updateUser = function(req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function(err, client) {
        console.log("update user");
        if (err) throw err;
        let db = client.db(dbName);
        
        let doc = req.body;
        if(!doc){
            return res.sendStatus(400);
        }
        let search = {_id:ObjectID(doc.id)};
        let update = {$set:{"user.name":doc.name, "user.email":doc.email, "user.role":doc.role, "user.password":doc.password}};
        let options = { };
        await db.collection(dbUser).updateOne(search,update,options);
        
        res.send(await db.collection(dbUser).find().toArray());
        client.close();
    });
};

exports.deleteUser = function(req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function(err, client) {
        console.log("get users");
        if (err) throw err;
        let db = client.db(dbName);
        
        let doc = req.body;
        if(!doc){
            return res.sendStatus(400);
        }
        await db.collection(dbUser).deleteOne({"user.name":req.body.name});
        res.send(await db.collection(dbUser).find().toArray());
        client.close();
    });
};

exports.addGroup = function(req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function(err, client) {
        console.log("add group");
        if (err) throw err;
        let db = client.db(dbName);
        let exist = false;
        let doc = req.body;
        if(!doc){
            return res.sendStatus(400);
        }
        console.log(doc);
        
        let groups = await db.collection(dbGroups).find().toArray();

        for(var i = 0; i < groups.length; i++){
            if(doc.group == groups[i].name){
                exist = true;
                i = groups.length;
            }
        }

        if(!exist){
            console.log("doesnt exist");
            await db.collection(dbGroups).insertOne({name: doc.group, rooms:[],users:[{name: doc.user}]});
            res.send(await db.collection(dbGroups).find().toArray());
            client.close();
        } else {
            console.log("exist");
            res.send(await db.collection(dbGroups).find().toArray());
            client.close();
        }
    });
};

exports.delGroup = function(req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function(err, client) {
        console.log("del group");
        if (err) throw err;
        let db = client.db(dbName);
        
        let doc = req.body;
        if(!doc){
            return res.sendStatus(400);
        }
        console.log(doc);
    
        await db.collection(dbGroups).deleteOne({"name":doc.group});
        res.send(await db.collection(dbGroups).find().toArray());
        client.close();
    });
};

exports.getGroup = function(req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function(err, client) {
        
        console.log("get groups");
        if (err) throw err;
        let db = client.db(dbName);
        
        let doc = req.body;
        if(!doc){
            return res.sendStatus(400);
        }

        res.send(await db.collection(dbGroups).find().toArray());
        client.close();
        
    });
};

exports.addRoom = function(req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function(err, client) {
        console.log("add room");
        if (err) throw err;
        let db = client.db(dbName);
        
        let doc = req.body;
        if(!doc){
            return res.sendStatus(400);
        }
        console.log(doc);
        console.log(doc.groupID._id);
        
        let search = {_id:ObjectID(doc.groupID._id)};
        let update = {
            $push:{
                rooms: {
                    $each: [{ "name": doc.room, "roomUsers":[{"name": doc.user}]}]
                }
            }
        };
        let options = { };
        await db.collection(dbGroups).updateOne(search,update,options);

        res.send(await db.collection(dbGroups).find().toArray());
        client.close();
    });
};

exports.delRoom = function(req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, async function(err, client) {
        console.log("del room");
        if (err) throw err;
        let db = client.db(dbName);
        
        let doc = req.body;
        if(!doc){
            return res.sendStatus(400);
        }
        console.log(doc);
        console.log(doc.groupID);
        
        let search = {_id:ObjectID(doc.groupID)};
        let update = {
            $pull:{
                rooms: {
                    "name": doc.room
                }
            }
        };
        let options = { };
        await db.collection(dbGroups).updateOne(search,update,options);

        res.send(await db.collection(dbGroups).find().toArray());
        client.close();
    });
};