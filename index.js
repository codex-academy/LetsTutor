const express = require('express');
const exphbs  = require('express-handlebars');
var bodyParser = require('body-parser')

const app = express();

//configure handlebars as a view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//configure body-parser middleware to make form variables work

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'));

var subjects = {};

function addSubject(subject){
    if (subject){
        if (!subjects[subject]){
            subjects[subject] = '';
        }
    }
}


app.get('/', function(req, res){
    res.render("index", {name : req.query.name});
});

app.get('/subjects', function(req, res, next){

    var subjectList = [];
    for(var subject in subjects){
        subjectList.push({
            name : subject
        });
    }

    res.render('subjects', {subjects : subjectList});
})

app.get('/subjects/add', function(req, res, next){
    res.render('subjects-add');
});

app.post('/subjects/delete/:subjectName', function(req, res, next){
    const subjectName = req.params.subjectName;
    delete subjects[subjectName];
    res.redirect('/subjects');
});

app.post('/subjects/add', function(req, res, next){
    addSubject(req.body.subjectName);
    res.redirect('/subjects');
});

app.get('/tutors', function(req, res){
    var subject = req.query.subject;
    addSubject(subject);
    res.send(subjects);
});

app.get('/tutors/:subject', function(req, res){
    var subject = req.params.subject;
    addSubject(subject);
    res.send(subjects);
})

var portNumber = process.env.PORT || 3007;

const instance = app.listen(portNumber, function(){
    console.log("Express server running at port : " + instance.address().port);
});
