const fs = require('fs');
const path = require('path');

const groupsPath = path.join(__dirname, 'JSON', 'groups.json');

module.exports = function(req, res){
    groups = [];
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
        //add user to group
        if(req.body.type == 'adduser2G'){
            let group = req.body.group;
            let user = req.body.user;

            //find if user already in group, add if new
            for(let i = 0; i < file.length; i++){
                let users = file[i].users;
                if(group == file[i].name){
                    let count = 0;
                    for(let j = 0; j < users.length; j++){
                        if(user == users[j].name){
                            count++;
                        }
                    }
                    if(count == 0){

                        file[i].users.push({name:user});
                        
                        fs.writeFile(groupsPath, JSON.stringify(file, null, "\t"), function(err){
                            if(err) throw err;
                        });
                        i = file.length;
                        j = users.length;
                        
                        res.send(file);
                    }
                }
            }
        } else if(req.body.type == 'addgroup'){
          let group = {};
          let user = req.body.user;
          group.name = req.body.group;
          group.rooms = [];
          group.users = [{"name": user}];
          file.push(group);
          fs.writeFile(groupsPath, JSON.stringify(file, null, "\t"), function(err){
            if(err) throw err;
          });
            res.send(file);
        } else if(req.body.type == 'addroom'){
          let roomName = req.body.room;
          let userName = req.body.user;
          let groupName = req.body.group;
          let index = 0;
          for(let i = 0; i < file.length; i++){
            if(file[i].name == groupName){
              index = i;
              i = file.length;
            }
          }
          room = {"name": roomName, roomUsers:[{"name": userName}]};
          file[index].rooms.push(room);
          fs.writeFile(groupsPath, JSON.stringify(file, null, "\t"), function(err){
            if(err) throw err;
          });
          res.send(file);
        } else if(req.body.type == 'adduser2R'){
          
          let roomName = req.body.room;
          let userName = req.body.user;
          let groupName = req.body.group;

          for(let i = 0; i < file.length; i++){
            if(groupName == file[i].name){
              let size = file[i].rooms.length;
              for(let j = 0; j < size; j++){
                if(roomName == file[i].rooms[j].name){
                  let count = 0
                  for(let k = 0; k < file[i].rooms[j].roomUsers.length; k++){
                    if(userName == file[i].rooms[j].roomUsers[k]){
                      count++;
                    }
                  }
                  if(count != 1){
                    file[i].rooms[j].roomUsers.push({"name": userName});
                    fs.writeFile(groupsPath, JSON.stringify(file, null, "\t"), function(err){
                      if(err) throw err;
                    });
                    i = file.length;
                    j = size;
                  }
                }
              }
            }
          }
          res.send(file);
        } else if(req.body.type == 'delgroup'){
          let group = req.body.group;
          let fileGroup = [];
          for(let i = 0; i < file.length; i++){
            fileGroup.push(file[i]);
          }
          for(let i = 0; i < file.length; i++){
            if(group == fileGroup[i].name){
              fileGroup.splice(i, 1);
              i = file.length;
            }
          }
          fs.writeFile(groupsPath, JSON.stringify(fileGroup, null, "\t"), function(err){
            if(err) throw err;
          });
          res.send(fileGroup);
        } else if(req.body.type == 'delroom'){
          let group = req.body.group;
          let room = req.body.room;
          let fileGroup = [];
          for(let i = 0; i < file.length; i++){
            fileGroup.push(file[i]);
          }
          for(let i = 0; i < fileGroup.length; i++){
            size = fileGroup[i].rooms.length;
            if(group == fileGroup[i].name){
              for(let j = 0; j < size; j++){
                if(room == fileGroup[i].rooms[j].name){
                  fileGroup[i].rooms.splice(j, 1);
                  i = fileGroup[i].rooms.length;
                }
              }
            }
          }
          fs.writeFile(groupsPath, JSON.stringify(fileGroup, null, "\t"), function(err){
            if(err) throw err;
          });
          res.send(fileGroup);
        } else if(req.body.type == 'deluser2G'){
          let group = req.body.group;
          let user = req.body.user;
          let fileArray = [];
          let users = [];
          for(let i = 0; i < file.length; i++){
            fileArray.push(file[i]);
          }
          for(let i = 0; i < fileArray.length; i++){
            if(group == fileArray[i].name){
              let size = fileArray[i].users.length
              for(let j = 0; j < size; j++){
                if(user == fileArray[i].users[j].name){
                  fileArray[i].users.splice(j, 1);
                  i = fileArray.length;
                  j = size;
                }
              }
            }
          }
          fs.writeFile(groupsPath, JSON.stringify(fileArray, null, "\t"), function(err){
            if(err) throw err;
          });
          res.send(fileArray);
        } else if(req.body.type == 'deluser2R'){
          let group = req.body.group;
          let user = req.body.user;
          let room = req.body.room;
          let fileArray = [];
          for(let i = 0; i < file.length; i++){
            fileArray.push(file[i]);
          }
          for(let i = 0; i < fileArray.length; i++){
            if(group == fileArray[i].name){
              let roomSize = fileArray[i].rooms.length;
              for(let j = 0; j < roomSize; j++){
                let roomUserSize = fileArray[i].rooms[j].roomUsers.length;
                if(room == fileArray[i].rooms[j].name){
                  for(let k = 0; k < roomUserSize; k++){
                    if(user == fileArray[i].rooms[j].roomUsers[k].name){
                      fileArray[i].rooms[j].roomUsers.splice(k, 1);
                      i = fileArray.length;
                      j = roomSize;
                      k = roomUserSize;
                    }
                  }
                }
              }
            }
          }
          
          fs.writeFile(groupsPath, JSON.stringify(fileArray, null, "\t"), function(err){
            if(err) throw err;
          });
          res.send(file);
        }
      }
    }
    catch(err){
      console.error("error parsing JSON string: ", err);
    }
      
  });
}