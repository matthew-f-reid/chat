const fs = require('fs');

module.exports = function(req, res){
  fs.readFile('./JSON/users.json', 'utf8', (err, jsonString) =>{
    if(err){
      console.log("file read failed: ", err);
      return;
    }
    console.log("file read: ", jsonString);
    
    try{
      const users = JSON.parse(jsonString);
      
      if(!req.body){
        return res.sendStatus(400);
      } else {
        var user = {};
        user.name = req.body.name;
        user.password = req.body.password;
        console.log("req.body.name");
        console.log(req.body.name);
        console.log("users[0].name");
        console.log(users[0].name);
        console.log("req.body.password");
        console.log(req.body.password);
        console.log("users[0].password");
        console.log(users[0].password);

        for(let i = 0; i < users.length; i++){
          if(req.body.name == users[i].name && req.body.password == users[i].password){
            user.valid = true;
            user.id = users[i].id;
            user.role = users[i].role;
            user.email = users[i].email;
          }
        }

        if(user.valid){
          user.valid = true;
        } else {
          user.valid = false;
        }

        res.send(user);
      }
    }
    catch(err){
      console.log("error parsing JSON string: ", err);
    }
      
  });
}