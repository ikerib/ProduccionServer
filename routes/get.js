/**
 * Created by ikerib on 27/05/14.
 */

var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db;
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('planificacion', server);
var moment = require('moment');
var onErr = function(err,callback){
    db.close();
    callback(err);
};

db.open(function(err, db) {
    if(!err) {

    } else {
        onErr(err, function(){
            console.log(err);
            db.close();
        });
    }
});

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


    desde = moment(req.params.desde, "YYYY-MM-DD").toISOString();
    hasta = moment(req.params.hasta, "YYYY-MM-DD").toISOString();

    db.collection('planificacion').find( {
        $and: [
            { linea: milinea },
            { "fetxa": { $gte: new Date(desde) , $lte: new Date(hasta)  }}
            ]
        }).toArray(function(err, items){
        if (err) {return console.log(err);}


            // Aste osoa bueltatuko dugu
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
            for ( var i=0; i < resul.length; i++ ) {

                var tmp = resul[i][0];

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
                } else if ( tmp.linea == 2) {
                    aurkitua2 = true;
                    row.linea2 = tmp.turnoak;
                    row._id = tmp._id;
                }

                if ( aurkitua1 == false ) {
                    row.linea1 = [];
                }
                if ( aurkitua2 == false ) {
                    row.linea2 = [];
                }

                resultado.push(row);

            }

            res.json(resultado);

    })


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
            newData = data.linea1;
        } else {
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

    db.collection('planificacion').insert({
        fetxa:new Date(data.fetxa),
        linea: data.linea,
        turnoak: [{
           turno: data.turno,
           ordenes:[{
               ref: data.ref
           }]
        }]
    }, function() {
        res.send(200);
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

