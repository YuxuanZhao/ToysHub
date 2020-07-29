var express = require("express"),
    app     = express(),
    mongoose= require("mongoose");
    
app.use(express.static("pages"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/toys_hub", {useNewUrlParser: true, useUnifiedTopology: true});

var toySchema = new mongoose.Schema({
    name: String,
    picture: String,
    description: String
});

var Toy = mongoose.model("Toy", toySchema);

Toy.create({
    name: "Freedom gundam",
    picture: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.plazajapan.com%2F4573102580580%2F&psig=AOvVaw39djA-54VbORMDdo7YgV2H&ust=1596070259567000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIihnJif8eoCFQAAAAAdAAAAABAI",
    description: "The most popular gundam in China. Also, the Seed is very attractive in China's market."
}, function(err, toy){
    if (err){
        console.log(err);
    }
    else{
        console.log("Newly created toy:");
        console.log(toy);
    }
});

app.get("/", function(req, res){
    res.render("../pages/landing");
});

app.get("/toys", function(req, res){
    res.render("../pages/toys");
});

app.post("/toys", function(req, res){
    var newToy = req.body.newToy;
    
})

app.get("*", function(req, res){
   res.send("Page not found!"); //work for all links that are not defined 
});

//tell Express to listen for request (specify by Cloud9)
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});