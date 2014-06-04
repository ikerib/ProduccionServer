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

exports.all = function(req, res){

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

    db.open(function(err, db) {
        if(!err) {

                db.collection('planificacion').find({
                    "fetxa": {$gte: new Date('2014-01-01T14:56:59.301Z') }
                }).toArray(function(err, items){
                    // Aste osoa bueltatuko dugu
                    for ( k=0; k < 7; k++ ) {
                        var eguna = moment(asteaArray[k]).format('YYYY-MM-DD');
                        var topatua = false;

                        for ( i=0; i < items.length; i++ ) {

                            var fec = moment( items[i].fetxa).format('YYYY-MM-DD');

                            if ( fec === eguna ) {
                                topatua=true;
                                items[i].fetxa = fec;
                                resul[k] = items[i];
                                break;
                            }

                        }

                        if ( topatua == false ) {

                            resul[k] = {
                                fetxa: eguna
                            }

                        }
                    }

                    res.json(resul);
                    db.close();
                })

//            db.collection('test').find({fetxa: {$gte: desde, $lt: hasta}}).toArray(function (err, items) {
//                res.json(items);
//            });
        } else {
            onErr(err, function(){
                console.log(err);
                db.close();
            });
        }
    });
};

exports.save = function(req, res){
    db.open(function(err, db) {
        if(!err) {
            var data = req.body;
            var BSON = mongo.BSONPure;
            var o_id = new BSON.ObjectID(data._id);

            db.collection('planificacion').update({'_id': o_id, fetxa: new Date(data.fetxa)}, { $set :{ turnoak: data.turnoak } }, {safe:true, multi:false, upsert:false}, function(e, result){
                if (e) console.log(e)
                res.send((result===1)?{msg:'success'}:{msg:'error'})
                db.close();
            })

        } else {
            onErr(err, function(){
                console.log(err);
                db.close();
            });
        }
    });
};

exports.sartu = function (req, res) {
    db.open(function(err, db) {
        if(!err) {
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
                db.close();
            });

        } else {
            onErr(err, function(){
                console.log(err);
            });
        }
    });
};

