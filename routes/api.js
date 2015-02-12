/**
 * Created by ikerib on 27/05/14.
 */
"use strict";
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
        { "fetxa": { $gte: new Date(desde) , $lte: new Date(hasta)  }},
    {
        sort: {linea:1,orden: 1}
    },
    function(err, items){
        if (err) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.json(500, err);
        }
        if (items.length === 0) {
            res.statusCode = 404;
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            return res.send({ error: 'Ez da topatu' });
        }



        forEach (items, function(orden, callback){

            var val = orden.ref;

            if (( val !== "" ) && ( val !== undefined)) {
                var of="";
                val = val.replace("<BR>", " <br> ").replace("<BR />", " <br> ").replace("<br />", " <br> ");
                if (val === undefined) { return false; }
                var n = val.indexOf("<br>");
                if (n > 0) {
                    var miarray = val.split('<br>');
                    var tof = miarray[1];
                    var url = "http://10.0.0.12:5080/expertis/delaoferta?of="+ tof.trim();
                    var req = httpsync.get({ url : url});
                    var res = req.end();



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
};

exports.getgantt = function(req, res) {
    var desde = moment(req.params.dia,"YYYY-MM-DD").toISOString();
    var d = moment(desde).subtract('days', 7).toISOString();

    c_planificacion.find(
        { "fetxa": { $gte: new Date(desde) }},
    {
        sort: { fetxa: 1, linea: 1, orden:1}
    },
    function(err, items){
        if (err) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.json(500, err);
        }
        if (items.length === 0) {
            res.statusCode = 404;
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            return res.send({ error: 'Ez da topatu' });
        }

        var data = [];


        var linea1gehituta = false;
        var linea2gehituta = false;
        var linea3gehituta = false;
        //Comprobamos que en los datos está la 3º línea
        for (var i=0; i < items.length; i++) {
            if (( items[i].linea === 1 ) && (linea1gehituta === false )){
                var l = {};
                l.id=1;
                l.type = "project";
                l.text = "Siplace";
                l.open=true;
                data.push(l);
                linea1gehituta = true;
            }
            if (( items[i].linea === 2 ) && (linea2gehituta === false )){
                var l2 = {};
                l2.id=2;
                l2.type = "project";
                l2.text = "Assambleon";
                l2.open=true;
                data.push(l2);
                linea2gehituta = true;
            }
            if (( items[i].linea === 3 ) && (linea3gehituta === false )){
                var l3 = {};
                l3.id=3;
                l3.type = "project";
                l3.text = "Repaso";
                l3.open=true;
                data.push(l3);
                linea3gehituta = true;
            }
        }


        var rek = req;

        forEach (items, function(item, callback){
            var textua = item.ref.split('<BR>');
            var d = {};
            d._id = item._id;
            if ( ( textua.length === 1) ) {
                d.id = textua[0];
            } else {
                d.id = textua[1];
            }

            var tmp = moment(item.fetxa).format('DD/MM/YYYY');

            //HORA INI
            if ( item.denbora !== undefined ) {
                var ho = item.denbora;
                d.start_date = moment(tmp + ' ' + item.denbora, "DD/MM/YYYY HH:mm").format('DD/MM/YYYY HH:mm:ss');
            } else  {
                d.start_date = moment(item.fetxa).format('DD/MM/YYYY HH:mm:ss');
            }
            // HORA FIN
            if ( item.denborafin !== undefined ) {
                d.end_date = moment(tmp + ' ' + item.denborafin, "DD/MM/YYYY HH:mm").format('DD/MM/YYYY HH:mm:ss');
            } else {
                d.end_date = moment(d.start_date, 'DD/MM/YYYY HH:mm:ss' ).add(8,'hours').format('DD/MM/YYYY HH:mm:ss');
            }

            // CALCULO DEL PROGRESO
            var val = item.ref;
            if ( ( val === "" ) || ( val === undefined ) ) {
                d.progress = 0;
            } else {
                var of="";
                val = val.replace("<BR>", "<br>");
                val = val.replace("<BR />", "<br>");
                val = val.replace("<br />", "<br>");
                if (val === undefined) {
                    d.progress = 0;
                }
                var n = val.indexOf("<br>");
                if (n > 0) {
                    var miarray = val.split('<br>');
                    of = miarray[1];
                }
                if ( of === "" ) {
                    d.progress = 0;
                } else {
                    var url2 = "http://10.0.0.12:5080/expertis/delaoferta?of="+ of.trim();
                    var req2 = httpsync.get({ url : url2});
                    var res = req2.end();
                    if ( (res.data.toString() !== "") && (res.data.toString()!== "undefinded") ) {
                        var miresp = res.data.toString();
                        var mijson = JSON.parse(miresp);
                        if (mijson.length > 0) {
                            //console.log(mijson);
                            var datuak = mijson[0];
                            var qfabricar = parseFloat(datuak.QFabricar);
                            var qfabricada = parseFloat(datuak.QFabricada);

                            d.progress = Math.round((qfabricar * 100) / qfabricada);
                            //console.log(qfabricar);
                            //console.log(qfabricada);
                            //console.log((qfabricar * 100) / qfabricada);
                            //console.log(d.progress);
                            //console.log("********");
                        } else {
                            d.progress = 0;
                        }


                    } else {
                        d.progress = 0;
                    }
                }
            }

            // nos aseguramos de que el progeso tiene un valor
            if ( ( d.progress === undefined ) || ( d.progress === null) || ( isFinite(d.progress) === false ) ) {
                d.progress = 0;
                //console.log("A");
            }

            if ( textua[0] !== undefined ) {
                d.text = textua[0];
            } else {
                d.text = "";
            }
            d.parent = parseInt(item.linea);

            // console.log(d);
            data.push(d);

        }, function(){
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.contentType('application/json');
            res.send(JSON.stringify({"data":data}));
            //res.json(data);
        });
    });
};


exports.getofs = function(req, res) {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    var desde = moment(yyyy + "-" + mm + "-" + dd,"YYYY-MM-DD").toISOString();
    var hasta = moment(desde).add('days', 1).toISOString();


    c_planificacion.find(
        { "fetxa": { $gte: new Date(desde) , $lte: new Date(hasta)  }}
    ,
    {
        sort: { fetxa: 1, linea: 1, orden:1}
    },
    function(err, items){
        if (err) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.json(500, err);
        }
        if (items.length === 0) {
            res.statusCode = 404;
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            return res.send({ error: 'Ez da topatu' });
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.contentType('application/json');
        res.send(JSON.stringify(items));

    });
};
