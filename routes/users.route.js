const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
require("../config/passport");
const saltRounds = 10;
const { User } = require("../models/users.model");



// //session create
// router.set('trust proxy', 1) 
// router.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   store: MongoStore.create({
//     mongoUrl : process.env.DB_URL,
//     collectionName : "sessions"
//   })
// }))
// router.use(passport.initialize());
// router.use(passport.session());


router.get("/register", (req,res)=>{
    res.status(200).render("register");
});

router.post("/register", async (req,res)=>{
    try {
        const user = await User.findOne({username : req.body.username});
        if(!user){
            bcrypt.hash(req.body.password, saltRounds, async (err,hash)=>{
                const newUser = new User({
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


router.get("/login", (req,res)=>{
    res.status(200).render("login");
});

router.post('/login', 
  passport.authenticate('local', { 
    failureRedirect: '/user/login', 
    successRedirect: "/profile",
    })
);


router.get("/profile", (req,res)=>{
    res.status(200).render("profile");
});

router.get("/logout", (req,res)=>{
    res.redirect("/");
});



exports.usersRoute = router;