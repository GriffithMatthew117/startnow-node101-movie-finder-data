var express = require('express');
var morgan = require('morgan');
var axios = require('axios');

var cache = {};

const app = express();

app.use(morgan('dev'));
//http: //www.omdbapi.com/?apikey=[yourkey]&

app.get("/", function(req, res) {
    const apiKey = "&apikey=*******";
    const tQuery = '?t=' + encodeURIComponent(req.query.t);
    var iQuery = '?i=' + req.query.i;

    if (req.query.i) {
        var url = 'http://www.omdbapi.com/' + iQuery + apiKey;
        var key = req.query.i;
    } else if (req.query.t) {
        var url = 'http://www.omdbapi.com/' + tQuery + apiKey;
        var key = req.query.t;
    }
    //Check if movie is in cache. If false, search api. If true, pull from cache
    if (cache[key] === undefined) {
        if (key === "/") {
            return res.status(200).send("Nothin' here, mate");
        }
        axios({
                method: 'get',
                url: url,
                responseType: 'text'
            })
            .then(function(response) {
                cache[key] = response.data;
                res.status(200).json(cache[key]);
            })
            .catch(function(error) {
                console.log(error);
                console.log(error);
                res.status(500).json(error.message);
            });
    } else {
        res.status(200).json(cache[key]);
    }
});
module.exports = app;