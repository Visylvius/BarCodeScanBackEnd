var upcCode = require('./models/upc-code');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs');
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/signup', passport.authenticate('local-signup', {
       successRedirect: '/profile', // redirect to the secure profile section
       failureRedirect: '/signup', // redirect back to the signup page if there is an error
       failureFlash: true // allow flash messages
   }));

   app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/upccode', function(req, res) {
      console.log('in the route');
      upcCode.find({}, function(err, data) {
        if (err) return res.status(400).json({err});
        res.status(200).json({upc: data});
      });
    });

    app.post('/upccode', function(req, res, next) {
      console.log('req.body', req.body);
      const userUpcCode = req.body.upc
      const userProductName = req.body.product_name;
      upcCode.findOne({upc: userUpcCode}, function(err, code) {
        console.log('yarr', code);
        if (!code) {
          upcCode.create({product_name: userProductName, upc: userUpcCode}, function(err, code) {
            if (err) return res.status(400).send({err});
            return res.status(201).send('the code was created');
          });
        } else {
          console.log('error', err);
          res.status(400).send({message: 'that upc code already exists'});
        }
      });
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
