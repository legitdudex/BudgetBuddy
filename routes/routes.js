var express = require("express");
var router = express.Router(); //this allow us to use 'router' to create our routes for the app.
//requiring the DB model
var User = require("../models/userModel");
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

//this is the root route which will redirect to the Homepage
router.get('/', function(req, res){
	res.redirect('/budgetbuddy');
});

//route for homepage
router.get('/budgetbuddy', function(req, res){
	// res.send("This is the Homepage");
	//res.render("homepage");
	User.find({}, function(err, result){
		if(err){
			console.log("Failed to find all users.. ", err);
			}else{	//the first result can be named anything, the second is the one
				res.render('sample', {result: result});
			}
		});
});

//route for login page
router.get('/budgetbuddy/sign_in', function(req, res){
	res.render("login");
});

//route for sign up page
router.get('/budgetbuddy/sign_up', function(req, res){
res.render("signup");
});

//route for user main activity page
router.get('/budgetbuddy/home', function(req, res){
	res.render('home');
});

router.post('/budgetbuddy/sign_in/user', function(req, res){
	//search if user exists in database
	User.find({$and: [{ email: req.body.email , password: req.body.password}]}, function (err, docs){
		if(err) console.log ("Error");
		else if (docs.length == 0) console.log("An account with this email does not exist");
		else{
			docs.isActive = true;
			res.render('home', {user: docs});
			console.log(JSON.stringify(docs.firstName));
		}
	});
	});

router.post('/budgetbuddy/sign_up/user', function(req, res){
		//search database for email
		User.find({email: req.body.email},function (err,docs){
			//if there is an account with this email output it already exists, else create new user and direct to login page
			if (docs.length != 0) console.log("An account with this email already exists, please sign in ");
			else {
				User.create({
					firstName: req.body.firstname,
					lastName: req.body.lastname, 
					email: req.body.email,
					password: req.body.password
				});
				
			}		
		});

		//search if user exists in database
		User.find({email: req.body.email}, function (err, user){
		if(err) console.log ("Error");
		// else if (user.length == 0) console.log("An account with this email does not exist \n");
		else{
			user.isActive = true;
			res.render('home', {user: user});
		
		}
	});
		
});



//all other pages end up here
router.get("*", function(req, res) {
	res.send("UNABLE TO FIND THIS ROUTE, SORRY :(");
});

/*============SAMPLE ROUTE================*/
router.get('/budgetbuddy/sample', function(req, res){
	//this code searches through the DB and gives back all users info
	User.find({}, function(err, result){
	if(err){
		console.log("Failed to find all users.. ", err);
		}else{	//the first result can be named anything, the second is the one
			res.render('sample', {result: result});
		}
	});
});


/*
router.post('/budgetbuddy/home/user', function(req, res){

	//if tab is expense
	expense = {description: req.body.description,
			amount: req.body.amount,
			dateOfPurchase: today;
	User.update({//user}, {'$push': { expenses: expense}});

	//if tab is goals
	goal = { description: req.body.description,
			date: req.body.date,
			amount: req.body.amount };

	User.update({//user}, {'$push' : { goals: goal}});

	res.render('home');
});
*/

//export file
module.exports = router;
