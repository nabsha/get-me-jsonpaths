
var express = require('express');
var jp = require('jsonpath');
var bodyParser = require('body-parser')

var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.set('port', (process.env.PORT || 5000));


app.get('/ping', function (req, res) {
    res.send('pong');
});

function spliceResults(out) {
	for (var i = 0, len = out.length; i < len; i++) {
		var srcTokens = out[i]
		for (var j = i + 1; j < len; j++) {
			var targetToken = out[j]
			if (arrayContainsAnotherArray(srcTokens, targetToken)) {
				console.log (srcTokens + " exists in " + targetToken)
				out.splice(i,1)
				return false
			}
		}
	}
	return true
}

app.options('/jsonpaths', function (req, res) {
	res.header("Allow","POST")
	res.send ("Usage is : \n query param: \n\tleafOnly: to include only leaf nodes of the json tree")
})
app.post('/jsonpaths', function (req, res) {

    var out = jp.paths(req.body, "$..*")
    var tbdOut = []
    var result = []

    console.log(req.query.leafOnly)
    // if ?leafOnly is set,
    if (req.query.leafOnly != null) {
	    console.log("Filtering response")
    	// remove all parents one by one
		while (!spliceResults(out)) {}

	    // remove marked entries from the array
	    for (var i = 0, len = tbdOut.length; i < len; i++) {
	    	console.log(tbdOut[i])
	    	out.splice(tbdOut[i],1 )
	    }
    }

	    for (var i = 0, len = out.length; i < len; i++) {
	    	console.log(out[i])
	    }

    for (var i = 0, len = out.length; i < len; i++) {
        result.push(jp.stringify(out[i]))
    }
    res.send(result)

})

app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
})

function arrayContainsAnotherArray(needle, haystack){

  if (needle.length >= haystack.length)
	return false;

  for(var i = 0; i < needle.length; i++){
    if(haystack[i] !== needle[i])
       return false;
  }
  return true;
}