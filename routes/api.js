/**
 * Created by ikerib on 27/05/14.
 */

var moment = require('moment');
var forEach = require('async-foreach').forEach;
var httpsync = require('httpsync');

var monk = require('monk');
var db = monk('localhost:27017/planificacion');
var c_planificacion = db.get('planificacion');
var c_settings = db.get('settings');

exports.getplanificacion = function(req, res) {
    var desde = moment(req.params.dia,"YYYY-MM-DD").toISOString();
    var hasta = moment(desde).add('days', 1).toISOString();


    c_planificacion.find( 

        { "fetxa": { $gte: new Date(desde) , $lte: new Date(hasta)  }}
    ,
    {
        sort: {linea:1,orden: 1}
    },
    function(err, items){
        if (err) {
            res.json(500, err);
        }
        if (items.length === 0) {
            res.statusCode = 404;
            return res.send({ error: 'Ez da topatu' });
        }

        res.json(items);

        forEach (items, function(orden, callback){

        }, function(){

        });
    });
}

