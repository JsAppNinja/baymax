var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var stripe = require("stripe")("sk_test_AuDH86bLhVlGKi63amO5eGCa");
var mongoose = require('mongoose');
var customerList = require('../models/customer');

// GET home page.
router.get('/', function(req, res, next) {
  res.render('index');
});

// Stripe Payments
router.post('/createCharge', function(req,res){

  // get the token and useremail for subscription
	var token = req.body.stripeToken;
  var usremail = req.body.email;
  console.log(req.body);

// finding the customer in the server database and if not existing, create customer collection for subscription
// if existing, we don't have to create new collection, we will use the existing collection
   customerList.findOne({email: usremail}, function(err, customerInfo) {
      if(err) {
        res.status(404).send(err);
       }
      if(customerInfo){ //if collection is pre-existed
          console.log('existing customer');
          res.json({"err":err, "success":1});
      }
      else {// if customer is new customer
        var customerSchema = new customerList({
          //name:'',
          email:usremail,
          token: token
        });
        customerSchema.save(function(err, result) {
          if(err) {
            console.log(err);
          }
          console.log(result);
        });
          console.log(customerInfo);
      }
   });
// creating customer
  var customer = stripe.customers.create({
    account_balance:0,    // starting account balance for customer, cents
    business_vat_id:null, //cusomter's VAT identification number
    coupon: null,         // coupon code
    description: null,    // arbitrary string which u can attach to a customer object.
    email: usremail,      //customer email address
    source:token,         // token or source's Id
    metadata:null,             //set of key/value; it is useful for storing additional information.
    }, function(err, customer) {
      if(err)
      {
        console.log(err);
        res.redirect('/');
      }
      else {
          var customer_id = customer.id;  // customer id is required for the customer subscription
          console.log(customer);

//        creating subscription
          stripe.subscriptions.create({
            customer: customer_id,         // customer id
            items: [                       //subscription items list
              {
                plan: "smart-monthly",     //plan Id
              },
            ],
          }, function(err, subscription) {
             if(err)
             {
               console.log(err);
               res.redirect('/');
             }
             else {
               console.log(subscription);
               console.log("subscription charged");
             }
          });
           res.json({"err":err, "success":1});
        }
      });
      /*
      	var charge = stripe.charges.create({
      	  amount: 4900,
      	  currency: "usd",
      	  description: "Smart charge",
      	  source: token,
      	}, function(err, charge) {
          //console.log(charge);
      	  res.json({ "err":err, "charge":charge });
      	});
      */
});

// Stripe webhook receiving function
router.post("/webhook/action", function(request, response) {

  // Retrieve the request's body and parse it as JSON
  var event_json = JSON.parse(request.body);
  console.log(event_json.type);

  if(event_json.type == 'customer.subscription.created')
  {
    console.log('Your subscription is created correctly');
  }
  response.send(200);
});

  // Sending Email
router.post('/index', function(req,res){
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'spiesshubert@gmail.com',
    pass:'wkimnuyimqtmipzn'
  }
});

var mailOptions = {
  from : 'Admin Baymax support@baymax.ai',
  to: 'support@baymax.ai',
  subject: 'Website contact form',
  text: 'You have received a new Email',
  html: '<p> You have received a new email</p>'
};

transporter.sendMail(mailOptions, function(error, info){
  if(error){
    console.log(error);
    res.redirect('/');
      }
  else{
    console.log('Message Sent:'+info.response);
    res.redirect('/');
  }
});
});




module.exports = router;
