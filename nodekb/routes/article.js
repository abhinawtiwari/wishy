const express = require('express');
const router=express.Router();

//Bring In Article Model
let Article=require('../models/article');
//Bring in User model
let User=require('../models/user');


//Add Route
router.get('/add', ensureAuthenticated,function(req,res){
  res.render('add_articles',{
    title:'add articles'

  });
});

//Add Submit POST Route

router.post('/add', function(req,res){
  /*console.log('Submitted');
    console.log(req.body.Title);
  return;*/
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();
  //Get Errors
  let errors=req.validationErrors();
  if(errors){
    res.render('add_articles',{
      title: 'add article',
      errors:errors
    });
  }
  else{
    let article=new Article();
     article.title=req.body.title;
     article.author=req.user._id;
     article.body=req.body.body;

     article.save(function(err){
       if(err){
       console.log(err);
     }else{
       req.flash('success','Article Added');
       res.redirect('/');
     }
  });
}
});

//Load Edit form
router.get('/edit/:id',ensureAuthenticated,function(req,res){
  Article.findById(req.params.id,function(err,article){
  if(article.author != req.user._id){
    req.flash('danger','Not Authorised');
    res.redirect('/');
  }else{
    res.render('edit_articles',{
    title: 'Edit Article',
    article:article
    });
  }
    //console.log(article);


  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req,res){
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
    req.flash('sucess','Article Updated');
    res.redirect('/');
  }
  });
});

//Delete an Article
router.delete('/:id',function(req,res){
  if(!req.user._id){
    res.status(500).send();
  }
  let query={_id:req.params.id}

  Article.findById(req.params.id,function(err,article){
    if(article.author!=req.user._id){
      res.status(500).send();
    }
    else{
      Article.remove(query,function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });

});

//Get Single Article
router.get('/:id',function(req,res){
  Article.findById(req.params.id,function(err,article){
    User.findById(article.author,function(err,user){
      //console.log(article);
      res.render('articles',{
        article:article,
        author:user.name
     });
    });
  });
});

//Access Control
function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    req.flash('danger','Please Login');
    res.redirect('/users/login');
  }
}
module.exports=router;
