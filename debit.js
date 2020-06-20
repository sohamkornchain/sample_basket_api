const fetch = require('node-fetch');
const config = require('config');

var AUTH_TYPE = 'client_credentials';
var DEBIT_API_SCOPE = 'eCommerce.API/Debit.create';
var AUTH_HEADER = 'Basic ' + new Buffer.from(config.auth.ClientId + ':' + config.auth.ClientSecret).toString('base64');
var AUTH_URL = config.auth.URL;
var GRANT_TYPE = "grant_type=" + AUTH_TYPE;
var SCOPE_VALUE = "&scope=" + DEBIT_API_SCOPE ; 
var AUTH_TOKEN_REQUEST_CONTENT_TYPE = "application/x-www-form-urlencoded";
var DEBIT_REQUEST_CONTENT_TYPE = "application/json";

console.log(`Calling: ${AUTH_URL}, using header: ${AUTH_HEADER}`);

var data = {
    "programme_identifier": "TESTBASKETS1",
    "account_identifier": "U100029D",
    "amount": 250,
    "currencyCode": "AED",
    "externalTransactionIdentifier": "20200618#0001",
    "externalTransactionDate": "2020-06-18T16:30:45.270+01:00",
    "productSummary": {
      "productInstanceIdentifier": "VAC#7890",
      "productTypeSummary": "Vacation Package",
      "productItemsSummary": [
        {
          "itemCode": "H4567",
          "itemDescription": "Hotel Booking",
          "itemValue": 120
        }
      ]
    },
    "firstName": "Joe",
    "lastName": "Bloggs",
    "email": "Joe.Bloggs@email.com"
  }

// For /Debit api call, first API call is to generate an authentication token, second API call is to perform Debit operation. 

fetch(AUTH_URL, {
  method: "POST",
  headers: {
    "Authorization": AUTH_HEADER, // AUTH Header is the combination of Congnito App client id and secret.
    "Content-Type": AUTH_TOKEN_REQUEST_CONTENT_TYPE,
  },
  body: GRANT_TYPE + SCOPE_VALUE 
}).then((res) => {
  return res.json()
}).then((json) => {
  console.log(`OAuth2 Response: ${JSON.stringify(json)}`);

  var authToken = json.access_token; // returned as a response from above api call.
  var url = `${config.api.URL}/${config.api.version}/Debit`;
  var headers = {
    "Content-Type": DEBIT_REQUEST_CONTENT_TYPE,
    "Authorization": authToken, 
    "x-api-key": config.api.apiKey
  }

  // Make a request to Balance with authorisation using both OAuth2 and API Key
  fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
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
