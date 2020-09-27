
module.exports = async function(db,app){
  const collection = db.collection('users');
  app.post('/deluser',async function(req, res){
    await collection.deleteOne({"user.name":req.body.name});
    //await collection.remove();
    console.log(await collection.find().toArray());
    res.send(await collection.find().toArray());
  });
}