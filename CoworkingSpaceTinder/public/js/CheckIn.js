Parse.initialize("GI4coBdWVBWk8CexD33M9SD0GjHRTTq5jo1GnUbb", "r4yKyt6O5KiJhtMVfXraqoNZqee5JjiIBFH1fyIk");
var currentUser = Parse.User.current();
var temp1 = $("#CheckCard").html();
var us_temp1 = _.template(temp1);
var temp2 = $("#checkLoc").html();
var us_temp2 = _.template(temp2);
var ShowCard = Parse.Object.extend("UserInfor");
var usName;
var pyrmont;
var Add;
var Build;
var test;
var Userintent;
var objectId;

if (currentUser){
  usName = currentUser.attributes.username;
  var locationName = Parse.Object.extend("Location");
  var query = new Parse.Query(locationName);
  query.find({
    success:function(results) {
      results.forEach(function(result){
        var locName = result.attributes;
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