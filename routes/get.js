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

            db.collection('test').find({fetxa: {$gte: desde, $lt: hasta}}).toArray(function (err, items) {
                res.json(items);
            });
        } else {
            onErr(err, function(){
                console.log(err);
            });
        }
    });
};

exports.save = function(req, res){
    db.open(function(err, db) {
        if(!err) {
            var data = req.body;
//            console.log(data.egunak);
            var BSON = mongo.BSONPure;
            var o_id = new BSON.ObjectID(data._id);
//            db.collection('test').find({'_id': o_id}).toArray(function (err, items) {
//                res.json(items);
//            });

            db.collection('test').update({'_id': o_id}, { $set :{ egunak: data.egunak } }, {safe:true, multi:false, upsert:false}, function(e, result){
                if (e) console.log(e)
                res.send((result===1)?{msg:'success'}:{msg:'error'})
            })

        } else {
            onErr(err, function(){
                console.log(err);
            });
        }
    });
};


//exports.one = function(req, res){
//    var id = req.params.id;
//    if (connection) {
//        var queryString = 'select * from commodores where id = ?';
//        connection.query(queryString, [id], function(err, rows, fields) {
//            if (err) throw err;
//            res.contentType('application/json');
//            res.write(JSON.stringify(rows));
//            res.end();
//        });
//    }
//};