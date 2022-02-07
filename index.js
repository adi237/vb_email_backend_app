"use strict";

const GLOBAL_CONSTANTS = require("./config/server_conf");
const SERVER_CONTROLLER = require("./controller/server_controller");

const express = require('express');

const port = GLOBAL_CONSTANTS.PORT;

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended:true}));

app.use(function(req, res, next){
  console.log("-----------------------------------------");
  console.log("A new request received at " + new Date()  + " User APIKEY is " + JSON.stringify(req.headers.apikey));

  //console.log(JSON.stringify(req.headers));

  if(req.headers.apikey != GLOBAL_CONSTANTS.API_KEY){
    res.status(401).send({"status": "Please Enter a Valid API KEY!"});
  }else{
    next();
  }
});

app.get('/status', (req,res) => {
  res.send({"status":"Success"});
});

app.post('/verifyUser', (req,res) => {
  if(req.body.emailAddress == undefined || req.body.code == undefined) res.status(400).send({"result":"Please Provide an email address"});
  
  let result = SERVER_CONTROLLER.verifyUser(req.body.emailAddress, req.body.code);
  res.send({"result": result});
});

app.post('/sendConfirmationCode', (req,res) => {
    if(req.body.emailAddress == undefined) res.status(400).send({"result": "Please Provide an email address"});

    SERVER_CONTROLLER.addEmailToStruct(req.body.emailAddress).then(() => {
      res.send({"result": "success"});
    }).catch((err) => res.status(500).send({"result": 'Something went wrong!'}) );
});

app.post('/sendEmail', (req, res) => {

  SERVER_CONTROLLER.sendMail(req.body).then((result) => {
        res.send({"result": 'Request Received Successfully!'});
    }).catch((err) => {
        res.status(500).send({"result": 'Something went wrong!'});
    });
});

async function main() {

  SERVER_CONTROLLER.init();

  console.log("App Listener Initializing...");
  
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  })

  //console.log(GLOBAL_CONSTANTS);
}

main().catch(console.error);