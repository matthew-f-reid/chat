const fs = require('fs');

module.exports = function(req, res){
    groups = [];
  fs.readFile('./JSON/groups.json', 'utf8', (err, jsonString) =>{
    if(err){
      console.log("file read failed: ", err);
      return;
    }
    try{
        console.log(req.body);
      const file = JSON.parse(jsonString);
      console.log('file');
      console.log(file);
      if(!req.body){
        return res.sendStatus(400);
      } else {
        //add user to group
        if(req.body.type == 'adduser'){
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
                        
                        console.log(users);
                        
                        fs.writeFile('./JSON/groups.json', JSON.stringify(file, null, "\t"), function(err){
                            if(err) throw err;
                            console.log(err);
                        });
                        i = file.length;
                        j = users.length;
                        
                        res.send(file);
                    }
                }
            }
        } else {
            res.send(file);
        }
      }
    }
    catch(err){
      console.log("error parsing JSON string: ", err);
    }
      
  });
}