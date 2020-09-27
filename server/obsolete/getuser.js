module.exports = async function(db,app){
  const collection = db.collection('users');
  app.post('/getuser',async function(req, res){
    res.send(await collection.find().toArray());
  });
}