const fs = require('fs');

module.exports = function(req, res){
    id = 0;
    users = [];
    fs.readFile('./JSON/users.json', 'utf8', (err, jsonString) =>{
        if(err){
            console.log("file read failed: ", err);
            return;
        }
        try{
            const file = JSON.parse(jsonString);
            for(let i = 0; i < file.length; i++){
                user = {};
                user.id = file[i].id;
                user.name = file[i].name;
                user.email = file[i].email;
                user.role = file[i].role;
                users.push(user);
                this.id++;
            }
            this.id++;
            if(!req.body){
                return res.sendStatus(400);
            } else {
                user = {};
                user.id = this.id;
                user.name = req.body.name;
                user.email = req.body.email;
                user.role = req.body.role;
                users.push(user);
                fs.writeFile('./JSON/users.json', JSON.stringify(users), function(err){
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