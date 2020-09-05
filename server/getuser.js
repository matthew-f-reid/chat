const fs = require('fs');

module.exports = function(req, res){
  fs.readFile('./JSON/users.json', 'utf8', (err, jsonString) =>{
    if(err){
      console.log("file read failed: ", err);
      return;
    }
    try{
      const file = JSON.parse(jsonString);
      if(!req.body){
        return res.sendStatus(400);
      } else {
        var users = [];
        for(var i = 0; i < file.length; i++){
          user = {};
          user.id = file[i].id;
          user.name = file[i].name;
          user.email = file[i].email;
          user.role = file[i].role;
          user.password = file[i].password;
          user.groups = file[i].groups;
          users.push(user);
        }
        console.log(users);
        res.send(users);
      }
    }
    catch(err){
      console.log("error parsing JSON string: ", err);
    }
      
  });
}