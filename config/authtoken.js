const axios = require("axios").default;


const options = { method: 'POST',
  url: 'https://dev--fe2sg9v.us.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: '{"client_id":"fkmlVG3wtE9OEw17cJrmk4jX8qNy2vTi","client_secret":"394a3CvikaMIyVF4yTlEjkVX2M7fbwoZ8RNUYHiryQeCA6qxl3vHXNJyHTPq-Ymf","audience":"https://tms.com","grant_type":"client_credentials"}' };

axios.request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});