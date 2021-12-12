const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
// for static css or custom css we create a new folder public
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");

});


app.post("/", function(req, res) {
   var firstName = req.body.fName;
   var lastName = req.body.lName;
   var email = req.body.email;

   var data = {
      members: [
        {
          email_address: email,
          status: "subscribed" ,
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
   };

// we need to convert above javascript object into json to send it to mailchimp.
   var jsonData = JSON.stringify(data);
   var url = "https://us5.api.mailchimp.com/3.0/lists/a9dcd49a9f";
   var option = {
   method: "post",
   auth:"hari:6f855a169ad4f3af7127be8ff07b082d-us5"
 };
 // need to save below code in a variable in order to use it to send to mailchimp server
  const request = https.request(url, option, function(response) {

    if(response.statusCode === 200){
    res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }

     response.on("data", function(data) {
       console.log(JSON.parse(data));
     } )
   });

// code for sending above data to mailchimp(see node documentation).
 request.write(jsonData);
 request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.post("/success", function(req, res) {
  res.redirect("/");
});

// process.env.PORT (put it in place of 3000 when hosting on heroku website.)
app.listen(process.env.PORT || 3000, function() {
  console.log("runnning");
});

// API key
// 6f855a169ad4f3af7127be8ff07b082d-us5

// list id
// a9dcd49a9f
