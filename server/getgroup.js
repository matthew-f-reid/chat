const fs = require('fs');

//get groups from file

module.exports = function(req, res){
  fs.readFile('./JSON/groups.json', 'utf8', (err, jsonString) =>{
    if(err){
      console.log("file read failed: ", err);
      return;
    }
    try{
      const file = JSON.parse(jsonString);
      if(!req.body){
        return res.sendStatus(400);
      } else {
        var groups = [];
        for(var i = 0; i < file.length; i++){
            group = {};
            group.name = file[i].name;
            group.rooms = file[i].rooms;
            group.users = file[i].users;
            groups.push(group);
        }
        res.send(groups);
      }
    }
    catch(err){
      console.log("error parsing JSON string: ", err);
    }
      
  });
}