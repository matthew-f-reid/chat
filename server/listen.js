module.exports = {

    //listen to port

    listen: function (http, PORT) {
        var server = http.listen(PORT, function () {
            console.log("server started");
            console.log(http);
        });
    }
}