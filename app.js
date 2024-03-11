require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const passport = require("passport");
const session = require("express-session");
require("./config/passport");
require("./config/passport-google-auth");
const MongoStore = require('connect-mongo');
const { usersRoute } = require("./routes/users.route");
const { User, Normal } = require("./models/users.model");
const app = express();

app.set("view engine", "ejs");
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({extended : false}));
app.use(express.json());

// app.use("/user", usersRoute);

//session create
app.set('trust proxy', 1) 
app.use(session({
  secret: 'keyboard cat',
  resave: false, 
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl : process.env.DB_URL,
    collectionName : "sessions"
  })
}))
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req,res)=>{
    res.status(200).render("index");
});


app.get("/user/register", (req,res)=>{
    res.status(200).render("register");
});

app.post("/user/register", async (req,res)=>{
    try {
        const user = await Normal.findOne({username : req.body.username});
        if(!user){
            bcrypt.hash(req.body.password, saltRounds, async (err,hash)=>{
                const newUser = new Normal({
                    username : req.body.username,
                    password : hash
                });
                await newUser.save();
                res.redirect("/user/login");
            });
        }else{
            res.status(404).send("<h3> username already exists!");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const checkLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
       return res.redirect("/user/profile");
    }
    next();
}

app.get("/user/login", checkLoggedIn, (req,res)=>{
    res.status(200).render("login");
});

app.post('/user/login', 
  passport.authenticate('local', { 
    failureRedirect: '/user/login', 
    successRedirect: "/user/profile",
    })
);

const checkAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/user/login");
}

app.get("/user/profile", checkAuthenticated , (req,res)=>{
    res.status(200).render("profile", {username : req.user.username});
    console.log(req.user);
});

app.get("/user/logout", (req,res)=>{
    try {
        req.logout((err)=>{
            if(err){
                return next(err);
            }
            res.redirect("/");
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
});





// passport-google-oauth2
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

  app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/user/login', successRedirect : "/user/profile" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });





















app.use((req,res,next)=>{
    res.status(404).render("client_error");
});

app.use((err,req,res,next)=>{
    res.status(500).send(err.message);
});




exports.app = app;


