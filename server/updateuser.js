const fs = require('fs');

//update user details

module.exports = function(req, res){
  fs.readFile('./JSON/users.json', 'utf8', (err, jsonString) =>{
    if(err){
      console.log("file read failed: ", err);
      return;
    }
    try{
        const file = JSON.parse(jsonString);
        console.log(req.body);
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
                users.push(user);
            }
            for(var i = 0; i < users.length; i++){
                if(users[i].id == req.body.id){
                    user = {};
                    user.id = req.body.id;
                    user.name = req.body.name;
                    user.email = req.body.email;
                    user.role = req.body.role;
                    user.password = req.body.password;
                    users.splice(i, 1, user);
                }
            }
            fs.writeFile('./JSON/users.json', JSON.stringify(users, null, "\t"), function(err){
                if(err) throw err;
                console.log(err);
            });
            res.send(users);
        }
    }
    catch(err){
      console.log("error parsing JSON string: ", err);
    }
      
  });
}