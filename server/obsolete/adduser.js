//add user

users = [];

module.exports = async function(db,app){
    const collection = db.collection('users');
    users = await collection.find().toArray();
    app.post('/adduser',async function(req, res){
        let exist = false;
        if(!req.body){
          return res.sendStatus(400);
        }        
        user = {};
        user.name = req.body.name;
        user.email = req.body.email;
        user.role = req.body.role;
        user.password = req.body.password;
        console.log(users);

        for(var i = 0; i < users.length; i++){
            if(user.name == users[i].user.name){
                exist = true;
                i = users.length;
            }
        }
        if(!exist){
            console.log("doesnt exist");
            await collection.insertOne({user});
            res.send(await collection.find().toArray());
        } else {
            console.log("exist");
            res.send(await collection.find().toArray());
        }
    });
}

