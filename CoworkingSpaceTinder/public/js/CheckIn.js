//Dev
var currentUser = Parse.User.current();
var temp1 = $("#CheckCard").html();
var us_temp1 = _.template(temp1);
var temp2 = $("#checkLoc").html();
var us_temp2 = _.template(temp2);
var usName;
var searchName = localStorage.getItem("searchName");
var test;
var Userintent;

if (currentUser){
  usName = currentUser.attributes.username;
  var locationName = Parse.Object.extend("Location");
  if (searchName) {
    var query = new Parse.Query(locationName);
    query.contains("Name", searchName);
    localStorage.removeItem("searchName");
    query.find({
    success:function(results) {
      results.forEach(function(result){
        var locName = _.clone(result.attributes);
        locName['ObjectId'] = result.id;
        objectID = result.id;
        $("#LocWin").append(us_temp2(locName));

      });
    },
    error: function(error) {
      // error is an instance of Parse.Error.
    }
  });
  } else {
    var query = new Parse.Query(locationName);
    query.find({
    success:function(results) {
      results.forEach(function(result){
        var locName = _.clone(result.attributes);
        locName['ObjectId'] = result.id;
        objectID = result.id;
        $("#LocWin").append(us_temp2(locName));
      });
    },
    error: function(error) {
      // error is an instance of Parse.Error.
    }
  });

  }
}



function display () {
  $( "#popupIntent" ).popup( "open" );
  // body...
}

function confirm() {
  Userintent = $('#in').val();
  $( "#popupIntent" ).popup( "close" );
  getUser();
}
function refresh () {
  $('#checkInWindow').empty();
  getUser();// body...
}

function getUser() {
  document.getElementById("checkInWindow").style.display = "block";
  document.getElementById("checkLocation").style.display = "none";
  currentUser.set("location", test);
  currentUser.set("intent", Userintent);
  currentUser.save(null, {
    success: function(user) {
      var query = new Parse.Query(Parse.User);
      query.equalTo("location", user.attributes.location);
      query.find({
        success:function(results) {
          results.forEach(function(result){
            if (result.attributes.username == usName) {
              return false;
            }
              var locInfo = result.attributes;
              locInfo['objectId']= result.id;
              $("#checkInWindow").append(us_temp1(locInfo));
              });   
        },
        error: function(error) {
        }
      }); 
    }
  });
}

function logOut() {
  var query = new Parse.Query(ShowCard);
  query.get(objectId, {
    success: function(s) {
      //s.unset("Location");
      s.unset("CheckIn");
      s.save();  
      Parse.User.logOut();
      location.reload();      // reset CheckIn in userInfor on parse.
    },
    error: function(object, error) {
      alert(error.message)
    }

  });
}

function checkOut() {
  currentUser.unset("location");
  currentUser.save(null, {
    success: function(results){
      window.location="./index.html";
    },
    error: function(error) {
      // body...
    }
  });
}
function limitText(limitField, limitCount, limitNum) {
  if (limitField.value.length > limitNum) {
    limitField.value = limitField.value.substring(0, limitNum);
  } else {
    limitCount.value = limitNum - limitField.value.length;
  }
}
