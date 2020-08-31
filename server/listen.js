module.exports = {
    listen: function(http, PORT){
        var server = http.listen(PORT, function(){
            console.log("server started");
        });
    }
}