const fs = require('fs');

//get users from file

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
        if(req.body.allUsers){
          var users = [];
          for(var i = 0; i < file.length; i++){
            user = {};
            user.id = file[i].id;
            user.name = file[i].name;
            user.role = file[i].role;
            users.push(user);
          }
          res.send(users);
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
          res.send(users);
        }
      }
    }
    catch(err){
      console.log("error parsing JSON string: ", err);
    }
      
  });
}