const fs = require('fs');

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
            group.groupName = file[i].groupName;
            group.rooms = file[i].rooms;
            group.users = file[i].users;
            group.mod = file[i].mod;
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