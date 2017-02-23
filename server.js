
var express = require('express');
var jp = require('jsonpath');
var bodyParser = require('body-parser')

var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.set('port', (process.env.PORT || 5000));


app.get('/ping', function (req, res) {
    res.send('pong');
});

app.post('/jsonpaths', function (req, res) {

    var out = jp.paths(req.body, "$..*")

    var result = []
    for (var i = 0, len = out.length; i < len; i++) {
        result.push(jp.stringify(out[i]))
    }
    res.send(result)

})

app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
})