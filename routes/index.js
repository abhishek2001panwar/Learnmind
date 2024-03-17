var express = require('express');
var router = express.Router();
var userModel = require("./users");
var editModel = require("./editprofile");
const Query = require('./query');
const AdminUser = require("./admin");
const passport = require('passport');
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/courses',checkAuthentication, isloggedIn ,function(req, res, next) {
  res.render('courses');
});
router.get('/web', function(req, res, next) {
  res.render('web');
});
router.post('/login',passport.authenticate("local",{
  successRedirect:"/courses",
  failureRedirect:"/login"
}), function(req, res, next) {
});

router.get('/signup', function(req, res, next) {
  res.render('login' , { message : " Please register to access courses."});
});
router.get('/mobile', function(req, res, next) {
  res.render('mobile');
});
router.get('/contact', function(req, res, next) {
  res.render('contact');
});
router.get('/about', function(req, res, next) {
  res.render('about');
});
router.get('/user', function(req, res, next) {
  res.render('user');
});
router.get('/editProfile',  async function(req, res, next) {
res.render('editProfile');
});
router.get('/landing',  async function(req, res, next) {
  res.render('landing');
  });
  
router.get("/editprofile" , async function(req, res ,next){
   const user = await userModel.findOne({  
    areaofInterest : req.session.passport.user,
skills : req.session.passport.user,
  });
  res.redirect("profile" , {user: areaofInterest, skills });
});

router.get('/profile', isloggedIn,  async function(req, res, next) {
  const user = await userModel.findOne({
    username : req.session.passport.user,
   

  });
  res.render('profile',{user});
});

router.post('/submit_contact_form', (req, res) => {

  var userData = new userModel({
   fullname : req.body.fullname,
  email : req.body.email,
message : req.body.message,

  });


  // Process the data (e.g., save to a database, send an email, etc.)
userData.save();
  res.render('index', { title: "message send"});
});

router.get('/logout', function(req, res, next) {
  req.logout(function(err){
    if(err){return next(err)}
    res.redirect("/");
  })
});
router.get('/protected-route', checkAuthentication, (req, res) => {
  res.render('courses', { user: req.user }); // Render the courses view
});


router.post("/register" , function(req,res){
  var userData = new userModel({
    username:req.body.username,
    fullname:req.body.fullname,
    email:req.body.email,
    skills:req.body.skills,
    areaofInterest:req.body.areaofInterest,
   
  });
  userModel.register(userData , req.body.password)
  .then(function(registeredUser){
    passport.authenticate("local")(req,res ,function(){
  res.redirect("/courses");
    });
  });
});

function isloggedIn(req,res ,next ){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}
function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware or route handler
  } else {
    res.render('login', { message: 'Please register to access courses.' });
  }
}
router.post('/updateProfileData', async (req, res) => {
  const userId = req.user._id; // Assuming you have a user object in the request

  try {
    // Find the user by ID and update skills and areasOfInterest
    const user = await userModel.findByIdAndUpdate(userId, {
      skills: req.body.skills,
      areaOfInterest: req.body.areaOfInterest,
    }, { new: true });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating profile data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// Route to get all logged-in users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all queries
router.get('/queries', async (req, res) => {
  try {
    const queries = await Query.find();
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUser = new AdminUser({ username, password });
    await adminUser.save();
    res.json({ message: 'Admin user registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to authenticate an admin user
router.post('/login', async (req, res) => {
  try {
    // Hardcoded admin credentials
    const hardcodedAdminUsername = 'abhishek';
    const hardcodedAdminPassword = '123';

    const { username, password } = req.body;

    // Check if the provided credentials match the hardcoded admin credentials
    if (username === hardcodedAdminUsername && password === hardcodedAdminPassword) {
      // Create a session or token for the authenticated admin user
      // ...

      res.json({ message: 'Admin user authenticated successfully.' });
    } else {
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
