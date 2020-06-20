const fetch = require('node-fetch');
const config = require('config');

var AUTH_TYPE = 'client_credentials';
var BALANCE_API_SCOPE = 'eCommerce.API/Balance.read';
var AUTH_HEADER = 'Basic ' + new Buffer.from(config.auth.ClientId + ':' + config.auth.ClientSecret).toString('base64');
var AUTH_URL = config.auth.URL;
var GRANT_TYPE = "grant_type=" + AUTH_TYPE;
var SCOPE_VALUE = "&scope=" + BALANCE_API_SCOPE; 
var CONTENT_TYPE = "application/x-www-form-urlencoded";

console.log(`Calling: ${AUTH_URL}, using header: ${AUTH_HEADER}`);

// For /Balance api call, first API call is to generate an authentication token, second API call is to perform Balance operation.  

fetch(AUTH_URL, {
  method: "POST",
  headers: {
    "Authorization": AUTH_HEADER, // AUTH Header is the combination of Congnito App client id and secret.
    "Content-Type": CONTENT_TYPE
  },
  body: GRANT_TYPE + SCOPE_VALUE
}).then((res) => {
  return res.json()     
}).then((json) => {
  console.log(`OAuth2 Response: ${JSON.stringify(json)}`);

  var pathString = 'programme/TESTBASKETS1/account/U100029D';
  var authToken = json.access_token; // returned as a response from above api call.
  var url = `${config.api.URL}/${config.api.version}/Balance/${pathString}`;
  var headers = {
    "Content-Type": "application/json",
    "Authorization": authToken,
    "x-api-key": config.api.apiKey
  }

  // Make a request to Balance with authorisation using both OAuth2 and API Key
  fetch(url, {
    method: 'GET',
    headers: headers,
  })
  .then((res) => {
    return res.json()
  })
  .then((data) => {
    console.log(data);
    // Do something with the returned data.
  });

}).catch((err) => {
  console.log(`OAuth2 Flow Error: ${err}`);
});
