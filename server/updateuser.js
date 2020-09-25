

module.exports = async function(db,app){
  const collection = db.collection('users');
  const ObjectID = require('mongodb').ObjectID;
  app.post('/updateuser',async function(req, res){

    console.log("before");
    console.log(await collection.find().toArray());

    let search = {_id:ObjectID(req.body.id)};
    console.log("search");
    console.log(search);
    let update = {$set:{"user.name":req.body.name, "user.email":req.body.email, "user.role":req.body.role, "user.password":req.body.password}};
    let options = { };
    await collection.updateOne(search,update,options);
    
    console.log("after");
    console.log(await collection.find().toArray());
    res.send(await collection.find().toArray());
    
  });
}

/*
module.exports = async function(db,app){
  const collection = db.collection('users');
  app.post('/updateuser',async function(req, res){
    console.log("before");
    console.log(await collection.find().toArray());
    await collection.deleteOne({"user.name":req.body.name});
    let user = {};
    user.name = req.body.name;
    user.email = req.body.email;
    user.role = req.body.role;
    user.password = req.body.password;
    console.log(user);
    await collection.insertOne({user});
    
    console.log("after");
    console.log(await collection.find().toArray());
    res.send(await collection.find().toArray());
    
  });
}
*/