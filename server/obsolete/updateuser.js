

module.exports = async function(db,app){
  const collection = db.collection('users');
  const ObjectID = require('mongodb').ObjectID;
  app.post('/updateuser',async function(req, res){

    let search = {_id:ObjectID(req.body.id)};
    let update = {$set:{"user.name":req.body.name, "user.email":req.body.email, "user.role":req.body.role, "user.password":req.body.password}};
    let options = { };
    await collection.updateOne(search,update,options);
    
    res.send(await collection.find().toArray());
    
  });
}
