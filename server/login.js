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
        console.log(users.users[0].userName);
        var customer = {};
        customer.name = req.body.name;
        console.log("customer name: ", customer.name);
        customer.password = req.body.password;
        console.log("customer pass: ", customer.password);
        console.log("JSON name: ", users.users[0].userName);

        for(let i = 0; i < users.users.length; i++){
          if(req.body.name == users.users[i].userName && req.body.password == users.users[i].password){
            customer.valid = true;
            customer.id = users.users[i].id;
            customer.role = users.users[i].role;
            customer.email = users.users[i].email;
          }
        }

        if(customer.valid){
          customer.valid = true;
        } else {
          customer.valid = false;
        }

        res.send(customer);
      }
    }
    catch(err){
      console.log("error parsing JSON string: ", err);
    }
      
  });
}