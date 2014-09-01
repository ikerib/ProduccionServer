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

exports.getlinea1 = function(req,res) {

    var desde = new Date(req.params.desde);
    var hastatemp = new Date(req.params.desde);
    var hasta = moment(hastatemp).add('days', 1).format('YYYY-MM-DD');

    desde = moment(req.params.desde, "YYYY-MM-DD").toISOString();
    hasta = moment(hasta, "YYYY-MM-DD").toISOString();

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

        var feceguna = moment(desde).format('YYYY-MM-DD');

        forEach (items, function(orden, callback){
            var fec = moment( orden.fetxa).format('YYYY-MM-DD');
            if ( fec === feceguna ) {
                topatua=true;
                var val = orden.ref;
                if (( val != "" ) && ( val !== undefined)) {
                    var of="";
                    val = val.replace("<BR>", "<br>").replace("<BR />", "<br>").replace("<br />", "<br>");
                    if (val === undefined) { return false }
                    var n = val.indexOf("<br>");
                    if (n > 0) {
                        var miarray = val.split('<br>');
                        tof = miarray[1];
                        var ofertada = miarray.slice(0,2);
                        console.log(ofertada);
                        if (tof.indexOf("of") > -1) {
                            var url = "http://10.0.0.12:5080/expertis/delaoferta?of="+ tof;
                            var req = httpsync.get({ url : url});
                            var res = req.end();

                            if ( (res.data.toString() !== "") && (res.data.toString()!== "undefinded") ) {
                                console.log(res.data.toString());
                                var miresp = res.data.toString();
                                var mijson = JSON.parse(miresp);
                                if ( mijson.length === 0 ) {
                                    orden.badutstock = 0;
                                } else {
                                    var aurki = false;
                                    mijson.forEach(function(entry) {
                                        if ( entry.QPendiente < entry.QNecesaria ) {
                                            orden.badutstock = 1;
                                            console.log(entry);
                                        } else {
        //                                    orden.badutstock = 0;
                                        }
                                    });
                                }
                            } else {
                                orden.badutstock = 0;
                            }
                        } else {
                            console.log("ez du oferta formatu zuzena");
                            orden.badutstock = 0;
                        }

                    } else {
                        orden.badutstock = 0;
                    }
                } else {
                    orden.badutstock = 0;
                }
            }
        }, function(){
            if ( topatua == true ) {
                res.json(items);
            }
        });
    });
}

exports.getlinea2 = function(req,res) {

    var desde = new Date(req.params.desde);
    var hastatemp = new Date(req.params.desde);
    var hasta = moment(hastatemp).add('days', 1).format('YYYY-MM-DD');

    desde = moment(req.params.desde, "YYYY-MM-DD").toISOString();
    hasta = moment(hasta, "YYYY-MM-DD").toISOString();

    c_planificacion.find( {
        $and: [
            { linea: 2 },
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

        var feceguna = moment(desde).format('YYYY-MM-DD');

        forEach (items, function(orden, callback){
            var fec = moment( orden.fetxa).format('YYYY-MM-DD');
            if ( fec === feceguna ) {
                topatua=true;
                var val = orden.ref;
                if (( val != "" ) && ( val !== undefined)) {
                    var of="";
                    val = val.replace("<BR>", "<br>").replace("<BR />", "<br>").replace("<br />", "<br>");
                    if (val === undefined) { return false }
                    var n = val.indexOf("<br>");
                    if (n > 0) {
                        var miarray = val.split('<br>');
                        tof = miarray[1];
                        var url = "http://10.0.0.12:5080/expertis/delaoferta?of="+ tof;
                        var req = httpsync.get({ url : url});
                        var res = req.end();

                        var miresp = res.data.toString();
                        var mijson = JSON.parse(miresp);
                        if ( mijson.length === 0 ) {
                            orden.badutstock = 0;
                        } else {
                            mijson.forEach(function(entry) {
                                if ( entry.QPendiente < entry.QNecesaria ) {
                                    orden.badutstock = 1;
                                } else {
                                    orden.badutstock = 0;
                                }
                            });
                        }
                    } else {
                        orden.badutstock = 0;
                    }
                } else {
                    orden.badutstock = 0;
                }
            }
        }, function(){
            if ( topatua == true ) {
                res.json(items);
            }
        });
    });
}

exports.save = function(io) {
    return function(req, res){

        var body = req.body;
        var id =  body.id;
        body.fetxa = new Date(body.fetxa),
        delete body.id;

        c_planificacion.findAndModify({_id: id}, {$set: body}, {multi:false}, function(err, bug){
            if (err) res.json(500, err);
            else if (bug) res.json(bug);
            else res.json(404);
        });

    }
};

exports.sartu = function (req, res) {

    var data = req.body;

    var producto = {
            fetxa:new Date(data.fetxa),
            linea: data.linea,
            ref: data.ref
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

exports.ezabatu = function(req, res) {
    var body = req.body;
    var id =  body.id;

    c_planificacion.remove({_id: id}, function(err, bug){
        if (err) res.json(500, err);
        else if (bug) res.json(bug);
        else res.json(404);
    });
}


//Settings
exports.getsettings = function(req, res){

    c_settings.find({},function(err, items){
        if(!err) {
            res.json(items);
        } else {
            onErr(err, function(){
                console.log(err);
            });
        }
    })


};

exports.insertSetting = function (req, res) {

    var data = req.body;

    c_settings.insert({
        ref: data.ref,
        backcolor: data.backcolor,
        forecolor: data.forecolor
    }, function() {
        res.send(200);
    });

};

exports.updateSetting = function(req, res){

    var data = req.body;
    var BSON = mongo.BSONPure;
    var o_id = new BSON.ObjectID(data._id);

    c_settings.update({'_id': o_id}, { $set :{
        ref: data.ref,
        backcolor: data.backcolor,
        forecolor: data.forecolor
    } }, {safe:true, multi:false, upsert:false}, function(e, result){
        if (e) console.log(e)
        res.send((result===1)?{msg:'success'}:{msg:'error'+e})
    })

};

