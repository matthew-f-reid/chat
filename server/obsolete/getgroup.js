const fs = require('fs');
const path = require('path');

const groupsPath = path.join(__dirname, 'JSON', 'groups.json');

//get groups from file

module.exports = function(req, res){
  fs.readFile(groupsPath, 'utf8', (err, jsonString) =>{
    if(err){
      console.error("file read failed: ", err);
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
      console.error("error parsing JSON string: ", err);
    }
      
  });
}