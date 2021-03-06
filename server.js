//setup Dependencies

var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 8081)
    , get = require('./routes/get')
    , api = require('./routes/api')
    , proxy = require('./routes/proxy')
    , moment = require('moment');


moment().format();
//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "ezdoknahi!!"}));
    server.use(connect.static(__dirname + '/static'));
});


server.configure('development', function(){
    server.use(express.errorHandler());
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: {
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                },status: 404 });
    } else {
        res.render('500.jade', { locals: {
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err
                },status: 500 });
    }
});
server.listen( port);
//
////Setup Socket.IO
//var io = io.listen(server);
//io.sockets.on('connection', function(socket){
//  console.log('Client Connected');
//  socket.on('message', function(data){
////    socket.broadcast.emit('server_message',data);
////    socket.emit('server_message',data);
//      console.log(data);
//  });
//  socket.on('disconnect', function(){
//    console.log('Client Disconnected.');
//  });
//});


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function(req,res){
  res.render('index.jade', {
    locals : {
              title : 'Your Page Title'
             ,description: 'Your Page Description'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX'
            }
  });
});

server.get('/planificacion/:linea/:desde/:hasta', get.all);
server.get('/planificacionlinea1/:desde/:hasta', get.getlinea1);
server.get('/planificacionlinea2/:desde/:hasta', get.getlinea2);
server.get('/planificacionlinea3/:desde/:hasta', get.getlinea3);


server.get ('/api/getplanificacion/:dia', api.getplanificacion)
server.get ('/api/getgantt/:dia', api.getgantt)
server.get ('/api/getofs', api.getofs);
server.get ('/proxy/expertis/:of', proxy.getofdata);


server.post('/saveplanificacion', get.save(io));
server.post('/saveorden', get.saveorden(io));
server.post('/savehoras', get.savehoras(io));
server.post('/savedenbora', get.savedenbora(io));
server.post('/savedenborafin', get.savedenborafin(io));
server.post('/savedenborafinfetxa', get.savedenborafinfetxa(io));
// server.post('/savefetxa', get.savefetxa(io));

server.post('/sartu', get.sartu);
server.post('/ezabatu', get.ezabatu);
server.get('/egutegia', get.egutegia);
server.put('/egutegiaeguneratu', get.egutegiaeguneratu);
server.put('/ordenatu', get.ordenatu);
//Settings
server.get('/getsettings', get.getsettings);
server.post('/insertsetting', get.insertSetting);
server.post('/updatesetting', get.updateSetting);


//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://localhost:' + port );
