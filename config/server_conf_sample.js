/*
    
    API_KEY: value to be passed in header of rest call to server - req.headers.apikey,
    PORT: port number on server to host this script,
    FROM: value added in the email list of OCI SMTP - customer will receive invitation email from this id,
    FROM_NOREPLY: value added in the email list of OCI SMTP - sender will receive email from this id with code
    TRANSPORTER_USER_OCID: username - Generate under User SMTP
    TRANSPORTER_PASS: password - Generate under User SMTP
    TRANSPORTER_HOST: host - Get from OCI
    TRANSPORTER_PORT: port - Get from OCI
    CODE_EXPIRY: expiry for code sent to user for login
    CLEANUP_TIME_INTERVAL: Interval after which user struct will be cleaned 
    
    INSTRUCTIONS:
     - Fill with actual values
     - update name to server_conf.js
*/

module.exports = {
    API_KEY: "",
    PORT: 0,
    FROM: "",
    FROM_NOREPLY: "",
    TRANSPORTER_USER_OCID: "",
    TRANSPORTER_PASS: "",
    TRANSPORTER_HOST: "",
    TRANSPORTER_PORT: "",
    CODE_EXPIRY: 0,
    CLEANUP_TIME_INTERVAL: 0
}