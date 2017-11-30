var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:'SuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 42184);
app.use(express.static(__dirname + '/img'));



app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    console.log("RESULTS: ", context.results)
    res.render('home', context);
  });
});

app.get('/new',function(req,res,next){
  res.render('new');
});


app.post('/insert',function(req,res,next){
  console.log("REQ:  ", req.body)
  mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `unit`) VALUES (?, ?, ?, ?, ?)", 
  [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.unit], 
  function(err, result){
    if(err){
      next(err);
      return;
    }
    res.redirect('/');
  });
});


app.get('/edit/:id',function(req,res,next){
  console.log("EDIT REQ:  ", req.params)
  var context = {};
  mysql.pool.query('SELECT * FROM workouts WHERE id=?', [req.params.id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.result = rows[0];
    console.log("EDIT RESULTS: ", context.result)
    res.render('edit', context);
  });
});


app.post('/update',function(req,res,next){
  console.log("REQ:  ", req.body)
  mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, unit=? WHERE id=?", 
    [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.unit, req.body.id], 
    function(err, result){
    if(err){
      next(err);
      return;
    }
    res.redirect('/');
  });
});


app.post('/delete',function(req,res,next){
  console.log("REQ:  ", req.body)
  mysql.pool.query("DELETE FROM workouts WHERE id=?", 
    [req.body.id], 
    function(err, result){
    if(err){
      next(err);
      return;
    }
    res.redirect('/');
  });
});



app.use(function(req,res){
res.status(404);
res.render('404');
});

app.use(function(err, req, res, next){
console.error(err.stack);
res.status(500);
res.render('500');
});

app.listen(app.get('port'), function(){
console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
