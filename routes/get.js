/**
 * Created by ikerib on 27/05/14.
 */

var moment = require('moment');
var forEach = require('async-foreach').forEach;
var httpsync = require('httpsync');

var monk = require('monk');
var db = monk('localhost:27017/planificacion');
var c_planificacion = db.get('planificacion');

exports.getlinea1 = function(req,res) {

    var desde = new Date(req.params.desde);

    var hasta = new Date(req.params.hasta);
    var resul = [];

    var asteaArray = [
        moment(desde).format('YYYY-MM-DD'),
        moment(desde).add('days', 1).format('YYYY-MM-DD'),
        moment(desde).add('days', 2).format('YYYY-MM-DD'),
        moment(desde).add('days', 3).format('YYYY-MM-DD'),
        moment(desde).add('days', 4).format('YYYY-MM-DD'),
        moment(desde).add('days', 5).format('YYYY-MM-DD'),
        moment(desde).add('days', 6).format('YYYY-MM-DD')
    ];

    desde = moment(req.params.desde, "YYYY-MM-DD").toISOString();
    hasta = moment(req.params.hasta, "YYYY-MM-DD").toISOString();

    c_planificacion.find( {
        $and: [
            { linea: 1 },
            { "fetxa": { $gte: new Date(desde) , $lte: new Date(hasta)  }}
        ]
    },function(err, items){
        if (err) {
            res.json(500, err);
        }
        if (items.length === 0) {
            res.statusCode = 404;
            return res.send({ error: 'Ez da topatu' });
        }

        var resul=[];

        console.log("Hasi");

        var astea = [0,1,2,3,4,5,6];

        forEach (astea, function(k, callback){
            var feceguna = moment(asteaArray[k]).format('YYYY-MM-DD');
            var topatua = false;
            resul[k]=[];
            var eguna = {};

//            resul[k]["linea"] = 1;
            eguna.linea = 1;
//            resul[k]["ordenes"] = new Array();
            eguna.ordenes = [];
            console.log("Eguna: " + k);
            eguna.fetxa = feceguna;

            forEach (items, function(item, callback){
                var fec = moment( item.fetxa).format('YYYY-MM-DD');
//                resul[k]["fetxa"] = fec;

                var nirea = [];
                if ( fec === feceguna ) {
                    topatua=true;
                    item.fetxa = fec;
                    forEach(item.ordenes, function(orden, callback) {
                        console.log(orden.ref);
                        var val = orden.ref;
                        if ( val != "" ) {
                            var of="";
                            val = val.replace("<BR>", "<br>").replace("<BR />", "<br>").replace("<br />", "<br>");
                            if (val === undefined) { return false }
                            var n = val.indexOf("<br>");
                            if (n > 0) {
                                var miarray = val.split('<br>');
                                tof = miarray[1];
                                console.log("Ez amaitu oraindik");
                                var url = "http://10.0.0.12:5080/expertis/delaoferta?of="+ tof;
                                var req = httpsync.get({ url : url});
                                var res = req.end();

                                var miresp = res.data.toString();
                                var mijson = JSON.parse(miresp);
                                mijson.forEach(function(entry) {
                                    if ( entry.QPendiente < entry.QNecesaria ) {
                                        orden.badutstock = 1;
                                    } else {
                                        orden.badutstock = 0;
                                    }
                                });
                            } else {
                                orden.badutstock = 0;
                            }
                        } else {
                            orden.badutstock = 0;
                        }

                        eguna.ordenes.push(orden);
                    }, function(){
                        // callback

                    });

                }
            }, function(){
                //callback
                if ( topatua == true ) {
                    resul[k].push(eguna);
                }

            })
            if ( topatua == false ) {

                resul[k].push({
                    fetxa: feceguna,
                    linea:1
                });
            }
        }, function(){
            //callback
            console.log("amaitu");
//            res.json(resul);
        })


        console.log(" zergaitik nao hemen?");
        res.json(resul);

    });
}

exports.all = function(req, res){

    var milinea = parseInt(req.params.linea);
    var desde = new Date(req.params.desde);

    var hasta = new Date(req.params.hasta);
    var resul = [];

    var asteaArray = [
        moment(desde).format('YYYY-MM-DD'),
        moment(desde).add('days', 1).format('YYYY-MM-DD'),
        moment(desde).add('days', 2).format('YYYY-MM-DD'),
        moment(desde).add('days', 3).format('YYYY-MM-DD'),
        moment(desde).add('days', 4).format('YYYY-MM-DD'),
        moment(desde).add('days', 5).format('YYYY-MM-DD'),
        moment(desde).add('days', 6).format('YYYY-MM-DD')
    ];

    desde = moment(req.params.desde, "YYYY-MM-DD").toISOString();
    hasta = moment(req.params.hasta, "YYYY-MM-DD").toISOString();


    c_planificacion.find( {
        $and: [
            { linea: milinea },
            { "fetxa": { $gte: new Date(desde) , $lte: new Date(hasta)  }}
            ]
        },function(err, items){
            if (err) {
                res.json(500, err);
            }
            if (items.length === 0) {
                res.statusCode = 404;
                return res.send({ error: 'Ez da topatu' });
            }

            for (var k=0; k < 7; k++ ) {
                var eguna = moment(asteaArray[k]).format('YYYY-MM-DD');
                var topatua = false;
                resul[k]=[];

                for (var i=0; i < items.length; i++ ) {

                    var fec = moment( items[i].fetxa).format('YYYY-MM-DD');

                    if ( fec === eguna ) {
                        topatua=true;
                        items[i].fetxa = fec;
                        resul[k].push( items[i]);
                    }

                }

                if ( topatua == false ) {

                    resul[k].push({
                        fetxa: eguna,
                        linea:0
                    });
                }
            }

            var resultado = [];
            // Hemen astea daukagu baina bi lineak daude nahastuta, bi lineak interpretatuko ditugu eta bidali

            forEach(resul, function(resul,callback){

                var tmp = resul[0];
                var row = {
                    fetxa: tmp.fetxa,
                    _id:'',
                    linea1: [],
                    linea2: []
                };

                var aurkitua1 = false;
                var aurkitua2 = false;

                if ( tmp.linea == 1 ) {
                    aurkitua1 = true;
                    row.linea1 = tmp.turnoak;
                    row._id = tmp._id;

                    forEach(tmp.turnoak, function(eguna, callbackTurnoak) { //The second argument (callback) is the "task callback" for a specific messageId
                        if ( eguna.ordenes.length > 0 ) {
                            forEach(eguna.ordenes, function(orden, callback) {
                                var val = orden.ref;
                                if ( val != "" ) {
                                    var of="";
                                    val = val.replace("<BR>", "<br>");
                                    val = val.replace("<BR />", "<br>");
                                    val = val.replace("<br />", "<br>");
                                    if (val === undefined) {
                                        return false
                                    }
                                    var n = val.indexOf("<br>");
                                    if (n > 0) {
                                        var miarray = val.split('<br>');
                                        tof = miarray[1];
                                    }

                                    var url = "http://10.0.0.12:5080/expertis/delaoferta?of="+ tof;
                                    var req = httpsync.get({ url : url});
                                    var res = req.end();

                                    var miresp = res.data.toString();
                                    var mijson = JSON.parse(miresp);
                                    mijson.forEach(function(entry) {
                                        if ( entry.QPendiente < entry.QNecesaria ) {
                                            orden.badutstock = 1;
                                        } else {
                                            orden.badutstock = 0;
                                        }
                                    });
                                }
                            });
                        }
                    });


                } else if ( tmp.linea == 2) {
                    aurkitua2 = true;
                    row.linea2 = tmp.turnoak;
                    row._id = tmp._id;

                    forEach(tmp.turnoak, function(eguna, callbackTurnoak) { //The second argument (callback) is the "task callback" for a specific messageId
                        if ( eguna.ordenes.length > 0 ) {
                            forEach(eguna.ordenes, function(orden, callback) {
                                var val = orden.ref;
                                if ( val != "" ) {
                                    var of="";
                                    val = val.replace("<BR>", "<br>");
                                    val = val.replace("<BR />", "<br>");
                                    val = val.replace("<br />", "<br>");
                                    if (val === undefined) {
                                        return false
                                    }
                                    var n = val.indexOf("<br>");
                                    if (n > 0) {
                                        var miarray = val.split('<br>');
                                        tof = miarray[1];
                                    }

                                    var url = "http://10.0.0.12:5080/expertis/delaoferta?of="+ tof;
                                    var req = httpsync.get({ url : url});
                                    var res = req.end();

                                    var miresp = res.data.toString();
                                    var mijson = JSON.parse(miresp);
                                    mijson.forEach(function(entry) {
                                        if ( entry.QPendiente < entry.QNecesaria ) {
                                            orden.badutstock = 1;
                                        } else {
                                            orden.badutstock = 0;
                                        }
                                    });
                                }
                            });
                        }
                    });


                }

                if ( aurkitua1 == false ) {
                    row.linea1 = [];
                }
                if ( aurkitua2 == false ) {
                    row.linea2 = [];
                }

                resultado.push(row);

            }
            , function (err){
                    res.json(resultado);
                }
            );
    });


};

exports.save = function(io) {
    return function(req, res){

        if (!db.serverConfig.isConnected()) {
            db.open(function(err, db) {
                if(!err) {

                } else {
                    onErr(err, function(){
                        console.log(err);
                        db.close();
                    });
                }
            });
        }

        var data = req.body;
        var BSON = mongo.BSONPure;
        var o_id = new BSON.ObjectID(data._id);

        var newData;
        if ( data.milinea === 1) {

            for (var k=0; data.linea1.length; k++) {
                for (var i=data.linea1[k].ordenes.length; i-->0; ) {
                    if (data.linea1[k].ordenes[i].ref === '') data.linea1[k].ordenes.splice(i, 1);
                }
            }
            newData = data.linea1;

        } else {

            for (var k=0; data.linea2.length; k++) {
                for (var i=data.linea2[k].ordenes.length; i-->0; ) {
                    if (data.linea2[k].ordenes[i].ref === '') {
                        data.linea2[k].ordenes.splice(i, 1);
                    }
                }
            }

            newData = data.linea2;
        }

        db.collection('planificacion').update({'_id': o_id}, { $set :{ turnoak: newData } }, {safe:true, multi:false, upsert:false}, function(e, result){
            if (e) console.log(e)

            io.sockets.emit("eguneratu");

            res.send((result===1)?{msg:'success'}:{msg:'error'+e})

        })
    }
};

exports.sartu = function (req, res) {

    var data = req.body;

    var producto = {
            fetxa:new Date(data.fetxa),
            linea: data.linea,
            ordenes:[{
                ref: data.ref
            }]
    };

    c_planificacion.insert(producto, {safe:true}, function(err, result) {
        if (err) {
            res.send({'error':'Akatsa bat egonda'});
        } else {
            res.send(result);
        }
    });

};

exports.egutegia = function(req, res){

    if (!db.serverConfig.isConnected()) {
        db.open(function(err, db) {
            if(!err) {

            } else {
                onErr(err, function(){
                    console.log(err);
                    db.close();
                });
            }
        });
    }

    var miresp = [];

    desde = moment(req.query.start, "YYYY-MM-DD").toISOString();
    hasta = moment(req.query.end, "YYYY-MM-DD").toISOString();

    db.collection('planificacion').find( {
        $and: [
            { "fetxa": { $gte: new Date(desde) , $lte: new Date(hasta)  }}
        ]
    }).toArray(function(err, items){
        if(!err) {

            for (var i=0; i < items.length; i++ ) {
                if ( items[i].turnoak.length > 0 ) {
                    var temp = items[i].turnoak;
                    for ( var j=0; j < temp.length; j++) {

                        if ( temp[j].ordenes.length > 0) {
                            var mit = temp[j].ordenes;
                            for ( var k=0; k < mit.length; k++) {
                                var miobj = {};
                                miobj.title = mit[k].ref;
                                miobj.start = moment(items[i].fetxa).format('YYYY-MM-DD');
                                miresp.push(miobj);
                            }
                        }

                    }

                }
            }

            res.json(miresp);

        } else {
            onErr(err, function(){
                console.log(err);
                db.close();
            });
        }
    })
};



//Settings
exports.getsettings = function(req, res){

    if (!db.serverConfig.isConnected()) {
        db.open(function(err, db) {
            if(!err) {

            } else {
                onErr(err, function(){
                    console.log(err);
                    db.close();
                });
            }
        });
    }

    db.collection('settings').find({}).toArray(function(err, items){
        if(!err) {
            res.json(items);
        } else {
            onErr(err, function(){
                console.log(err);
                db.close();
            });
        }
    })


};

exports.insertSetting = function (req, res) {

    if (!db.serverConfig.isConnected()) {
        db.open(function(err, db) {
            if(!err) {

            } else {
                onErr(err, function(){
                    console.log(err);
                    db.close();
                });
            }
        });
    }

    var data = req.body;

    db.collection('settings').insert({
        ref: data.ref,
        backcolor: data.backcolor,
        forecolor: data.forecolor
    }, function() {
        res.send(200);
    });

};

exports.updateSetting = function(req, res){

    if (!db.serverConfig.isConnected()) {
        db.open(function(err, db) {
            if(!err) {

            } else {
                onErr(err, function(){
                    console.log(err);
                    db.close();
                });
            }
        });
    }

    var data = req.body;
    var BSON = mongo.BSONPure;
    var o_id = new BSON.ObjectID(data._id);

    db.collection('settings').update({'_id': o_id}, { $set :{
        ref: data.ref,
        backcolor: data.backcolor,
        forecolor: data.forecolor
    } }, {safe:true, multi:false, upsert:false}, function(e, result){
        if (e) console.log(e)
        res.send((result===1)?{msg:'success'}:{msg:'error'+e})
    })

};

