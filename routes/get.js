/**
 * Created by ikerib on 27/05/14.
 */

var mysql = require('mysql');
var connection = mysql.createConnection({ host: 'localhost', user: 'root',
    password: '!Admin1234', database: 'planificacion'});

exports.all = function(req, res){
    if (connection) {
        connection.query('SELECT * FROM planing GROUP BY linea, fecha, turno ORDER BY linea, fecha, turno;', function(err, rows, fields) {
            if (err) throw err;

            var datuak = {
                linea:   '',
                egunak:  [
                    {
                        fetxa: '',
                        turnoak: [
                            {
                                turno: '',
                                ordenes: [
                                    {
                                        ref: '',
                                        of: [
                                            {
                                                numof: ''
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };;


            console.log(rows);
            for(var i = 0, l = rows.length; i < l; i++) {

                if (i > 0) {
                    if ( rows[i].linea != rows[i-1].linea ) {
                        datuak[i] = {
                            linea:   rows[i].linea,
                            egunak:  [
                                {
                                    fetxa: rows[i].fecha,
                                    turnoak: [
                                        {
                                            turno: rows[i].turno,
                                            ordenes: [
                                                {
                                                    ref: rows[i].ref,
                                                    of: [
                                                        {
                                                            numof: rows[i].of
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        };
                    } else if ( rows[i].fecha != datuak[i-1].egunak[i-1].fetxa ) {
                        datuak[i-1] = {
                            linea:   rows[i].linea,
                            egunak:  [
                                {
                                    fetxa: rows[i].fecha,
                                    turnoak: [
                                        {
                                            turno: rows[i].turno,
                                            ordenes: [
                                                {
                                                    ref: rows[i].ref,
                                                    of: [
                                                        {
                                                            numof: rows[i].of
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        };
                    } else if ( rows[i].turno != rows[i-1].turno ) {

                    } else if ( rows[i].ref != rows[i-1].ref ) {

                    }
                } else {

                    datuak[i] = {
                        linea:   rows[i].linea,
                        egunak:  [
                            {
                                fetxa: rows[i].fecha,
                                turnoak: [
                                    {
                                        turno: rows[i].turno,
                                        ordenes: [
                                            {
                                                ref: rows[i].ref,
                                                of: [
                                                    {
                                                        numof: rows[i].of
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    };

//                    datuak.push({"linea": rows[i].linea});
//                    datuak[i]=[];
//                    datuak[i].push({"fecha": rows[i].fecha});
//                    datuak[i][i]=[];
//                    datuak[i][i].push({"turno": rows[i].turno});
//                    datuak[i][i][i]=[];
//                    datuak[i][i][i].push({"ref": rows[i].ref});
//                    datuak[i][i][i][i]=[];
//                    datuak[i][i][i][i].push({"of": rows[i].of});

                }
            }


            res.contentType('application/json');
            res.write(JSON.stringify(datuak));
            res.end();
        });
    }
};

exports.one = function(req, res){
    var id = req.params.id;
    if (connection) {
        var queryString = 'select * from commodores where id = ?';
        connection.query(queryString, [id], function(err, rows, fields) {
            if (err) throw err;
            res.contentType('application/json');
            res.write(JSON.stringify(rows));
            res.end();
        });
    }
};