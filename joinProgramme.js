const fetch = require('node-fetch');
const config = require('config');

var url = `${config.api.URL}/${config.api.version}/joinProgramme`;
var headers = {
  "Content-Type": "application/json",
  "x-api-key": config.api.apiKey
}

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

// Make a request to joinProgramme with authorisation using API Key
fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  })
  .then((res) => {
    return res.json()
  })
  .then((json) => {
    console.log(json);
    // Do something with the returned data.
  });
