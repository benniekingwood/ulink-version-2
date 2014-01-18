var path      = require('path')
	,express       = require('express')
	,app           = express()
	,env           = process.env.NODE_ENV || 'development';

// app configuration
app.configure(function () {
	app.use(express.logger('dev'));
  app.set('port', process.env.PORT || 8889);
  app.use("/", express.static(__dirname + '/build'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

// development environment settings
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// production environment settings
app.configure('production', function(){
    app.use(express.errorHandler());
});

// root route
app.get('/', function(req, res) {
  res.redirect('/app.html');
});

console.log('ulink node server running on port ' + app.get('port'));
app.listen(app.get('port'));