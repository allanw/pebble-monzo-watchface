var xhrRequest = function (url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
}

function getData() {
  var url = "https://monzobalance.herokuapp.com/getBalance/";
  
  xhrRequest(url, 'GET',
    function(responseText) {
      console.log(responseText);
      var json = JSON.parse(responseText);
      
      var balance = json.balance;
      var spent_today = json.spend_today;
      
      var dictionary = {
        'BALANCE': balance,
        'SPENT_TODAY': spent_today
      }
            
      // Send to Pebble
      Pebble.sendAppMessage(dictionary,
        function(e) {
          console.log('Monzo balance/spent today info sent to Pebble successfully!');
        },
        function(e) {
          console.log('Error sending Monzo balance/spent today info to Pebble!');
        }
      );
    }
  );
}

// Listen for when the watchface is opened
Pebble.addEventListener('ready',
  function(e) {
    console.log('PebbleKit JS ready!');
    
    getData();
  }
);

// Listen for when an AppMessage is received
Pebble.addEventListener('appMessage',
  function(e) {
    console.log('AppMessage received');
    getData();
  }
);