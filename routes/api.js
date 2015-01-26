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



        forEach (items, function(orden, callback){

            var val = orden.ref;

            if (( val != "" ) && ( val !== undefined)) {
                var of="";
                val = val.replace("<BR>", " <br> ").replace("<BR />", " <br> ").replace("<br />", " <br> ");
                if (val === undefined) { return false }
                var n = val.indexOf("<br>");
                if (n > 0) {
                    var miarray = val.split('<br>');
                    tof = miarray[1];
                    var url = "http://10.0.0.12:5080/expertis/delaoferta?of="+ tof.trim();
                    var req = httpsync.get({ url : url});
                    var res = req.end();

                    console.log("HEMEN");

                    if ( (res.data.toString() !== "") && (res.data.toString()!== "undefinded") ) {
                        var miresp = res.data.toString();
                        var mijson = JSON.parse(miresp);

                        var aurki = false;
                        var amaituta = false;
                        mijson.forEach(function(entry) {

                            if ((amaituta===false) && ( parseFloat(entry.QFabricada) >= parseFloat(entry.QFabricar) )) {
                                orden.amaituta = 1;
                            } else if ((amaituta===false) && ( parseFloat(entry.QFabricada) < parseFloat(entry.QFabricar) )) {
                                orden.amaituta = 0;
                            }

                        });

                    } else {
                        orden.amaituta = 0;
                    }
                } else {
                    orden.amaituta = 0;
                }
            } else {
                orden.amaituta = 0;
            }

        }, function(){
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.json(items);
        });
    });
}

