/**
 * Created by ikerib on 24/10/14.
 */

//var httpsync = require('httpsync');
var request = require('urllib-sync').request;

exports.getofdata = function(req, res) {

    var miof = req.params.of;
    //var url = "http://servsm02.grupogureak.local:5080/expertis/delaoferta?of="+miof.trim();
    var url = "http://10.0.0.12:5080/expertis/delaoferta?of="+miof.trim();
    var kk={};
    kk.mezua =url;
    //res.json(kk);
    //var req = httpsync.get({ url : url});
    var resp = request( url );
    //var resp = req.end();
    var erantzuna = {};

    if ( (resp.data.toString() !== "") && (resp.data.toString()!== "undefinded") ) {
        var miresp = resp.data.toString();
        var mijson = JSON.parse(miresp);

        if ( mijson.length === 0 ) {
            erantzuna.QFabricar = "-";
            erantzuna.QFabricada = "-";
            erantzuna.QIniciada = "-";
            erantzuna.IDArticulo = "-";
            erantzuna.NOrden ="-";
        } else {
            erantzuna.QFabricar = mijson[0].QFabricar;
            erantzuna.QFabricada = mijson[0].QFabricada;
            erantzuna.QIniciada = mijson[0].QIniciada;
            erantzuna.IDArticulo = mijson[0].IDArticulo;
            erantzuna.NOrden = mijson[0].NOrden;
        }
    } else {
        erantzuna.QFabricar = "-";
        erantzuna.QFabricada = "-";
        erantzuna.QIniciada = "-";
        erantzuna.IDArticulo = "-";
        erantzuna.NOrden ="-";
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.json(erantzuna);
}

