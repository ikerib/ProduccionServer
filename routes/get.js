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

                        var aurkitua1 = false;
                        var aurkitua2 = false;
                        var row = {
                            fetxa: '',
                            _id:'',
                            linea1: [],
                            linea2: []
                        };

                        for ( var k=0; k < resul[i].length; k++) {
                            var tmp = resul[i][k];

                            row.fetxa = tmp.fetxa;

                            if ( tmp.linea == 1 ) {
                                aurkitua1 = true;
                                row.linea1[0] = tmp.turnoak;
                                row.linea1[0]._id = tmp._id.toString();
                            } else if ( tmp.linea == 2) {
                                aurkitua2 = true;
                                row.linea2[0] = tmp.turnoak;
                                row.linea2[0]._id = tmp._id.toString();
                            }

                        }

                        if ( aurkitua1 == false ) { row.linea1 = []; }
                        if ( aurkitua2 == false ) { row.linea2 = []; }

                        resultado.push(row);

                    }


                    res.json(resultado);
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

               db.collection('planificacion').update({'_id': o_id}, { $set :{ turnoak: data } }, {safe:true, multi:false, upsert:false}, function(e, result){
                   if (e) console.log(e)
                   res.send((result===1)?{msg:'success'}:{msg:'error'+e})
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
                res.send(200);
                db.close();
            });

        } else {
            onErr(err, function(){
                console.log(err);
            });
        }
    });
};

