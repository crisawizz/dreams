var indico = require('indico.io');
indico.apiKey =  '8d5eadfd6e61db37480b6d47215770a9';

var response = function(res) { console.log(res); }
var logError = function(err) { console.log(err); }

// single example
indico.sentimentHQ("I love writing code!")
  .then(response)
  .catch(logError);

// batch example
var batchInput = [
    "I love writing code!",
    "Alexander and the Terrible, Horrible, No Good, Very Bad Day"
];
indico.sentimentHQ(batchInput)
  .then(response)
  .catch(logError);