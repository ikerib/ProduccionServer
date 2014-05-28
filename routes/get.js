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
    db.open(function(err, db) {
        if(!err) {
            db.collection('test').find().toArray(function (err, items) {
                res.json(items);
            });
        } else {
            onErr(err,callback);
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