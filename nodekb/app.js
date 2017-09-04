const express= require('express');
const path=require('path');
const mongoose=require('mongoose');
const bodyParser=require('body-parser')

mongoose.connect('mongodb://localhost/nodekb');
let db=mongoose.connection;


//Check for connection
db.once('open',function(){
  console.log('Connected to MongoDB');
});
//Check for db erros
db.on('error',function(err){
  console.log(err);
});
//Init App
const app =express();

//Bring In Models
let Article=require('./models/article');


// Load View Engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');

//bodyParser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));

//parse application/json
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname,'public')));

//Home Route

app.get('/', function(req,res){
  Article.find({},function(err,articles){
    if(err){
      console.log(err);
    }else{

    res.render('index',{
      title:'Articles',
      articles: articles
    });
  }
  });
/*  let articles = [
    {
    id:1,
    title:'Article one',
    author:'Panch mukesh',
    body:'This is article one'
  },
  {
  id:2,
  title:'Article two',
  author:'Panch mukesh an',
  body:'This is article two'
},
{
id:3,
title:'Article three',
author:'Panch mukesh da',
body:'This is article three'
}
];
  res.render('index',{
    title:'Articles',
    articles: articles
  });*/
});


//Get Single Article
app.get('/article/:id',function(req,res){
  Article.findById(req.params.id,function(err,article){
    //console.log(article);
    res.render('articles',{
      article:article
    });
  });
});
//Add Route
app.get('/articles/add', function(req,res){
  res.render('add_articles',{
    title:'add articles'
    //articles: articles;
  });
});

//Add Submit POST Route

app.post('/articles/add', function(req,res){
  /*console.log('Submitted');
    console.log(req.body.Title);
  return;*/
 let article=new Article();
  article.title=req.body.title;
  article.author=req.body.author;
  article.body=req.body.body;

  article.save(function(err){
    if(err){
    console.log(err);
  }else{
    res.redirect('/');
  }
  });
});

//Load Edit form
app.get('/article/edit/:id',function(req,res){
  Article.findById(req.params.id,function(err,article){
    //console.log(article);
    res.render('edit_articles',{
      title: 'Edit Article',
      article:article
    });
  });
});

// Update Submit POST Route
app.post('/articles/edit/:id', function(req,res){
  /*console.log('Submitted');
    console.log(req.body.Title);
  return;*/
 let article={};
  article.title=req.body.title;
  article.author=req.body.author;
  article.body=req.body.body;

 let query={_id:req.params.id};

  Article.update(query,article,function(err){
    if(err){
    console.log(err);
  }else{
    res.redirect('/');
  }
  });
});

//Start Server
app.listen(3000,function(){
  console.log('Server started on port 3000....');
});
