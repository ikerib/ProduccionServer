/**
 * Created by ikerib on 27/05/14.
 */

var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db;
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('planificacion', server);

var onErr = function(err,callback){
    db.close();
    callback(err);
};

exports.all = function(req, res){

    var desde = new Date(req.params.desde);
//    ISODate("2011-11-24")
    var hasta = new Date(req.params.hasta);

    db.open(function(err, db) {
        if(!err) {

//            db.collection('planificacion').find().toArray(function (err, items) {
//                res.json(items);
//                db.close();
//            });

                db.collection('planificacion').find({
                    "fetxa": {$gte: new Date('2014-01-01T14:56:59.301Z') }
                }).toArray(function(err, items){
                    res.json(items);
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

