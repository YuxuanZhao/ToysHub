var express = require("express"),
    app     = express(),
    mongoose= require("mongoose"),
    bodyParser = require("body-parser"),
    Toy         = require("./models/toy"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds"),
    passport    = require("passport"),
    localStrategy = require("passport-local"),
    User = require("./models/user");
    
    
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/toys_hub", {useNewUrlParser: true, useUnifiedTopology: true});

seedDB();

//landing page
app.get("/", function(req, res){
    res.render("landing");
});

//== toy route ==
//INDEX - a page showing all toys
app.get("/toys", function(req, res){
    Toy.find({}, function(err, toys){
      if (err){
          console.log(err);
      } else {
          res.render("toys/toys", {toys: toys});
      } 
    });
    
});

//NEW - a form to create a new toy
app.get("/toys/new", function(req, res){
    res.render("toys/newToy");
});

//CREATE - create a new toy in DB
app.post("/toys", function(req, res){
    var newToy = {
        name: req.body.name,
        picture: req.body.picture,
        description: req.body.description,
        price: req.body.price
    };
    
    Toy.create(newToy, function(err, newCreatedToy){
        if (err){
            console.log(err);
        } else {
            res.redirect("/toys");
        }
    });
});
//== toy route ==

//SHOW - show a specfic toy page
app.get("/toys/:id", function(req, res){
   Toy.findById(req.params.id).populate("comments").exec(function(err, foundToy){
       console.log("This page's toy: " + foundToy);
       if (err || !foundToy){
           console.log(err);
           return res.redirect("/toys");
       } else {
           res.render("toys/toy", {toy: foundToy});
       }
   }) 
});

//NEW - a page to create a new comment
app.get("/toys/:id/comment/new", function(req, res){
    Toy.findById(req.params.id, function(err, toy){
        if (err){
            console.log(err);
        } else {
            res.render("comments/newComment", {toy: toy});
        }
    });
});

//CREATE - create a new comment in DB
app.post("/toys/:id/comment", function(req, res){
    var newComment = {
        author: req.body.author,
        content: req.body.content
    };
    
    Comment.create(newComment, function(err, newCreatedComment){
        if (err){
            console.log(err);
        }
        else{
            Toy.findOne({_id: req.params.id}, function(err, foundToy){
            
                if (err){
                    console.log(err);
                } else {
                    foundToy.comments.push(newCreatedComment);
                    foundToy.save(function(err, data){
                        if(err){
                            console.log(err);
                        }
                    });
                }
                //redirect to /toys/:id
                res.redirect("/toys/" + req.params.id);
            });
        }
    });
});

//edit a comment in DB
app.post("/toys/:id/comment/:commentId", function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.content, function(err, content){
       if(err){
          console.log(err);
           res.render("editComment");
       } else {
           Toy.findOne({_id: req.params.id}, function(err, foundToy){
                if (err){
                    console.log(err);
                }else{
                    foundToy.save(function(err, data){
                        if(err){
                            console.log(err);
                        }
                    });
                }
           });
           res.redirect("/toys/" + req.params.id);
       }
   }); 
});

//a page to edit a comment
app.get("/toys/:id/comment/:commentId", function(req, res){
    Toy.findById(req.params.id).populate("comments").exec(function(err, foundToy){
        if (err || !foundToy){
            console.log(err);
        } else {
            Comment.findById(req.params.commentId, function(err, comment){
                if (err){
                    console.log(err);
                } else{
                    res.render("comments/editComment", {toy: foundToy, comment: comment});
                }
            });
        }
    });
});

//handle all others routing
app.get("*", function(req, res){
   res.send("Page not found!"); //work for all links that are not defined 
});

//tell Express to listen for request (specify by Cloud9)
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});