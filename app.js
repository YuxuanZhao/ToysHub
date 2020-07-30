var express = require("express"),
    app     = express(),
    mongoose= require("mongoose"),
    bodyParser = require("body-parser");
    
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("toys"));

app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/toys_hub", {useNewUrlParser: true, useUnifiedTopology: true});

var toySchema = new mongoose.Schema({
    name: String,
    picture: String,
    description: String
});

var Toy = mongoose.model("Toy", toySchema);

//landing page
app.get("/", function(req, res){
    res.render("landing");
});

//show all toys
app.get("/toys", function(req, res){

    Toy.find({}, function(err, toys){
      if (err){
          console.log(err);
      } else {
          res.render("toys/toys", {toys: toys});
      } 
    });
    
});

//create a new toy form
app.get("/toys/new", function(req, res){
    res.render("toys/newToy");
});

//create a new toy post
app.post("/toys", function(req, res){
    console.log(req.body);
    var newToy = {
        name: req.body.name,
        picture: req.body.picture,
        description: req.body.description
    };
    
    Toy.create(newToy, function(err, newCreatedToy){
        if (err){
            console.log(err);
        } else {
            res.redirect("toys/toys");
        }
    });
});

//show a specfic page
app.get("/toys/:id", function(req, res){
   Toy.findById(req.params.id).populate("comments").exec(function(err, foundToy){
       if (err || !foundToy){
           console.log(err);
           return res.redirect("/toys");
       } else {
           console.log(foundToy);
           res.render("toys/toy", {toy: foundToy});
       }
   }) 
});

//all other pages
app.get("*", function(req, res){
   res.send("Page not found!"); //work for all links that are not defined 
});

//tell Express to listen for request (specify by Cloud9)
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});