module.exports = {

    //listen to port

    listen: function (http, PORT) {
        http.listen(PORT, '0.0.0.0', function () {
            console.info('Server listening on port ' + PORT + ' (0.0.0.0)');
        });
    }
}