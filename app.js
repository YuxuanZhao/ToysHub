var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    Toy             = require("./models/toy"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash");
    
var commentRoutes   = require("./routes/comments"),
    toyRoutes       = require("./routes/toys"),
    indexRoutes     = require("./routes/index");
    
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/toys_hub", {useNewUrlParser: true, useUnifiedTopology: true});
//seedDB();

//Passport Configuration
app.use(require("express-session")({
    secret: "A secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/toys/:id/comment", commentRoutes);
app.use("/toys", toyRoutes);
app.use("/", indexRoutes);

//tell Express to listen for request (specify by Cloud9)
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});