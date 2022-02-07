const GLOBAL_CONSTANTS = require("../config/server_conf");
const nodemailer = require("nodemailer");

let userVerificationStruct = [];
let transporter;

function verifyUser(email, code){

  let result = false;
    
  userVerificationStruct.forEach((userEmailStruct) => {
      if(userEmailStruct.email == email && userEmailStruct.code == code ) result = true;
  });

  //console.log(JSON.stringify(userVerificationStruct) + " --------   " + email + " --------   " + code);
  
  return result;
}
  
//Generates code - adds Email:Code combo to emailStruct and sends email with the code.
async function addEmailToStruct(email){
      let userExists = false;
      let code = Math.floor(100000 + Math.random() * 900000);
      
      userVerificationStruct.forEach((userEmailStruct) => {
          if(userEmailStruct.email == email){
            userEmailStruct.timestamp = new Date().getTime();
            userEmailStruct.code = code;
            userExists = true;
          }
      });
  
      if(!userExists) 
        userVerificationStruct.push({"email": email, "timestamp": new Date().getTime(), "code": code});
  
    sendMail({
      "to": email,
      "code": true,
      "subject":"Your Verification Code",
      "emailBody":"Your Verification Code is: " + code + ". Your code expires in 5 minutes",
      "senderEmail": GLOBAL_CONSTANTS.FROM_NOREPLY
    });
}
  
async function sendMail(emailTemplateObj){
      
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: emailTemplateObj.code ? GLOBAL_CONSTANTS.FROM_NOREPLY : GLOBAL_CONSTANTS.FROM, // sender address
    to: emailTemplateObj.to, // list of receiver
    replyTo: emailTemplateObj.senderEmail,
    subject: emailTemplateObj.subject, // Subject line
    text: emailTemplateObj.emailBody, // plain text body
    html: emailTemplateObj.emailBody, // html body
  });

  console.log(`Message sent: ${info.messageId}`);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  console.log("-----------------------------------------");
}

function init(){

  console.log("Init @ " + new Date());
  console.log("Creating Transport to SMTP Server....");

  transporter = nodemailer.createTransport({
      host: GLOBAL_CONSTANTS.TRANSPORTER_HOST,
      port: GLOBAL_CONSTANTS.TRANSPORTER_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: GLOBAL_CONSTANTS.TRANSPORTER_USER_OCID, // generated OCI user
        pass: GLOBAL_CONSTANTS.TRANSPORTER_PASS, // generated password
      },
    });

  console.log("Connection to SMTP Server Established!");

  setInterval(()=> {
      //console.log("Before cleaning length: " + JSON.stringify(userVerificationStruct));
      userVerificationStruct = userVerificationStruct.filter((user) => (new Date().getTime() - user.timestamp) < GLOBAL_CONSTANTS.CODE_EXPIRY);
      //console.log("Cleaning userVerification Struct. New length: " + userVerificationStruct.length);
    }, GLOBAL_CONSTANTS.CLEANUP_TIME_INTERVAL);
}

module.exports = {
  sendMail,
  verifyUser,
  addEmailToStruct,
  init
};