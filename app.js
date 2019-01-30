var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var port = 5000;
var path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//gets rid of warning for Mongoose
mongoose.Promise = global.Promise;

//connect to mongodb using mongoose
mongoose.connect("mongodb://localhost:27017/gameentries",{
    useMonogoClienct:true
})
.then(function(){console.log("MongoDB Connected.")})
.catch(function(err){console.log(err)});

//Load in Entry Model
require('./models/Entry');
var Entry = mongoose.model('Entries');

//sets up handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Functions needed to run body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Route to index.html
router.get('/', function(req,res){
    //res.sendFile(path.join(__dirname+'/index.html'));
    var title = "Welcome to the GameApp Page";

    res.render('index', {
        title:title
    });
});

//Route to entries.html
router.get('/entries', function(req,res){
    res.sendFile(path.join(__dirname+'/entries.html'));
});

app.get('/getdata', function(req, res){
    console.log("request made from fetch.");
    Entry.find({})
    .then(function(entries){
        res.send({
            entries:entries
        })
    })
});

//post from on index.html
app.post('/', function(req,res){
    console.log(req.body);
    var newEntry = {
        title:req.body.title,
        genre:req.body.genre
    }
    new Entry(newEntry)
    .save().then(function(entry){
        res.redirect('/')
    });
});

//routes for paths
app.use(express.static(__dirname+'/views'));
app.use(express.static(__dirname+'/scripts'));
app.use('/', router);

//starts server
app.listen(port, function(){
    console.log("Server is running on Port " + port);
});