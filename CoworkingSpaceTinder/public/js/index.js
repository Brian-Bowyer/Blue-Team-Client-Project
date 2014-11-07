    
Parse.initialize("GI4coBdWVBWk8CexD33M9SD0GjHRTTq5jo1GnUbb", "r4yKyt6O5KiJhtMVfXraqoNZqee5JjiIBFH1fyIk");
var currentUser = Parse.User.current();
var geocoder = new google.maps.Geocoder();
var objectId;
var useCurrent = true;
var temp = $("#inforCard").html();
var us_temp = _.template(temp);
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

if (currentUser) {
  usName = currentUser.attributes.username;
  toggleMap();
  var query = new Parse.Query(ShowCard);
  query.equalTo("UserName", usName);
  query.find({
    success: function(results) {
      results.forEach(function(result){
        var cardinfo = result.attributes;
        objectId = result.id;
        document.getElementById("map_canvas").insertAdjacentHTML("afterBegin", us_temp(cardinfo))
        document.getElementById('photoimg').setAttribute('src',currentUser.attributes.photo.url());
      });
    },
    error: function(error) {
    // error is an instance of Parse.Error.
		}
	});
  $('#headerbut').html("<a data-role=\"button\" onclick=\"editProfile()\" id=\"NewData\" class=\"ui-btn ui-btn-left ui-corner-all ui-shadow ui-btn-a \">Edit Profile</a>" 
    + "<img src=\"images/coworking.png\" height=\"25\" width=\"21\" style=\"margin-top:6px\"></img>CoWorking!" 
    + "<a id=\"LogoutBut\" data-role=\"button\" onclick=\"logOut()\" class=\"ui-btn ui-btn-right ui-corner-all ui-shadow ui-btn-a \">Log Out</a>");
  document.getElementById("search-panel").style.display = "block";
  $('#footerbut').html("<a data-role=\"button\" onclick=\"codeAddress()\" data-position-to=\"window\" class=\"ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-search ui-btn-icon-left ui-btn-a\" data-transition=\"pop\">Search</a>");
  setTimeout(function(){
    logOut();
  }, 300000);
        /*$(window).bind('beforeunload', function() {
            Parse.User.logOut();
        });*/
}
else{
  $('#footerbut').html("<a href=\"#popupLogin\" data-rel=\"popup\" data-position-to=\"window\" class=\"ui-btn ui-corner-all ui-shadow ui-btn-inline uui-btn-a\" data-transition=\"pop\">Log In</a>");
}

// log in function
function logIn() {
  Parse.User.logIn($("#un").val(), $("#pw").val(), {
    success: function(user) {
        window.location.reload();//alert("Login successful, redirecting to home page.");
    },
    error: function(user, error) {
      alert("Error: " + error.code + " " + error.message);
      window.location.reload();
    }
  });
}

//logout function
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
    }

  });
}

//sign Up function
function signUp(){
  var user = new Parse.User();
  user.set("username", $("#un").val());
  user.set("password", $("#pw").val());
	
	//var parseFile = new Parse.File("photo.png", file);
	//parseFile.save().then(function() {
		//alert("success");
 // The file has been saved to Parse.
	//}, function(error) {
			//alert('Failed to create new file, with error code: ' + error.id);// The file either could not be read, or could not be saved to Parse.
	//});
	//user.set("photo", "https://truonex-static.s3.amazonaws.com/images/fallback/profile_avatar_default.png");
  
	user.signUp(null, {
    success: function(user) {  
      //alert("Sign up successful, redirecting to home page.");
      window.location = "./editProfile.html";
    },
    error: function(user, error) {
      alert("Error: " + error.code + " " + error.message);// Show the error message somewhere and let the user try again.
    }
  });
}

function editProfile() {
  window.location = "./editProfile.html";
}

function toggleMap() {
  document.getElementById("map_canvas").style.display="block";
  document.getElementById("welcome").style.display = "none";
}

//Check usecurrent function
function initialize() {
  if (navigator.geolocation) {
    //alert('geolocator enabled');
    navigator.geolocation.getCurrentPosition(initializeMap);
  } 
  else {
    alert('Error: No location');
  }
        
}

//google place return function
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    if (results[0]) {
      Build = results[0].name;
      var query = new Parse.Query(ShowCard);
      query.get(objectId, {
        success: function(s) {
          s.set("BuildingName", Build);
          s.save();// The object was retrieved successfully.
        },
        error: function(object, error) {
          alert('Failed to create new object, with error code: ' + error.message);
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and message.
        }
      });
    }
  }
}

//show person  nearby the location
function initializeMap(position) {
  var curLat;
  var curLong;
  document.getElementById("inforWindow").style.display = "none";
  document.getElementById("search-panel").style.display = "none";
  document.getElementById("footer").style.display = "none";
  document.getElementById("checkInWindow").style.display = "block";
  $('#headerbut').html("<a data-role=\"button\" onclick=\"window.location.reload();\" id=\"NewData\" class=\"ui-btn ui-btn-left ui-corner-all ui-shadow ui-btn-a ui-btn-icon-notext ui-icon-carat-l\">Profile</a>" 
  + "<img src=\"images/coworking.png\" height=\"25\" width=\"21\" style=\"margin-top:6px\"></img>CoWorking!" 
  + "<a id=\"LogoutBut\" data-role=\"button\" onclick=\"logOut()\" class=\"ui-btn ui-btn-right ui-corner-all ui-shadow ui-btn-a ui-btn-icon-notext ui-icon-back\">LogOut</a>");

  if (useCurrent == true) {
    curLat = position.coords.latitude;
    curLong = position.coords.longitude;

    //research place neme by location
    var latlng = new google.maps.LatLng(curLat, curLong);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          Add = results[0].formatted_address;
          var query = new Parse.Query(ShowCard);
          query.get(objectId, {
            success: function(s) {
              s.set("Address", Add);
              s.save();   
            },
            error: function(object, error) {
              //alert('Failed to create new object, with error code: ' + error.message);
            }
          });
        } 
        else {
          alert('No results found');
        }
      } 
      else {
        alert('Geocoder failed due to: ' + status);
      }
    }); 
  } 
  else {
    curLat = position.lat();
    curLong = position.lng();
  }

  pyrmont = new google.maps.LatLng(curLat, curLong);
  var request = {
    location: pyrmont,
    radius: '60',
    type: ['store']
  };

  var map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: pyrmont,
    zoom: 15
  });

  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);

  var point = new Parse.GeoPoint({
    latitude : curLat,
    longitude : curLong
  });

  var query = new Parse.Query(ShowCard);
  query.get(objectId, {
    success: function(s) {
      s.set("Location", point);
      s.save();// The object was retrieved successfully.
    },
    error: function(object, error) {
      alert('Failed to create new object, with error code: ' + error.message);
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and message.
    }
  });

  var query = new Parse.Query(ShowCard);
  query.withinMiles("Location", point, 0.4);
  query.limit(10);
  query.find({
    success:function(results) {
      if(results.length == 1) {
        alert("No person around")
      }
      else {
        results.forEach(function(result){
          if (result.attributes.UserName == usName) {
            return false;
          }
          var locInfo = result.attributes;
          locInfo['ObjectId']= result.id;
          $("#checkInWindow").append(us_temp1(locInfo));
        });
      }   
    },
    error: function(error) {
    }
  });
}

function codeAddress() {
  useCurrent = false;
  input = document.getElementById("target");
  Add = input.value;
  var query = new Parse.Query(ShowCard);
  query.get(objectId, {
    success: function(s) {
      s.set("Address", Add);
      s.save();// The object was retrieved successfully.
    },
    error: function(object, error) {
      alert('Failed to create new object, with error code: ' + error.message);
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and message.
    }
  });
  geocoder.geocode({
    'address' : Add
  },
  function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var temp = results[0].geometry.location;
      initializeMap(temp);        
    } 
    else {
      alert("Geocode was not successful for the following reason: " + status);
      useCurrent = true;
    }
  });
}

/*function calcDistance(p1, p2){
  return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000 * 0.621371).toFixed(2);
}*/

function CheckIn() {
  document.getElementById("inforWindow").style.display = "none";
  document.getElementById("search-panel").style.display = "none";
  document.getElementById("footer").style.display = "none";
  document.getElementById("checkInWindow").style.display = "none";
  document.getElementById("checkLocation").style.display = "block"; 

  $('#headerbut').html("<a data-role=\"button\" onclick=\"window.location.reload();\" id=\"NewData\" class=\"ui-btn ui-btn-left ui-corner-all ui-shadow ui-btn-a ui-btn-icon-notext ui-icon-carat-l\">Profile</a>" 
    + "<img src=\"images/coworking.png\" height=\"25\" width=\"21\" style=\"margin-top:6px\"></img>CoWorking!" 
    + "<a id=\"LogoutBut\" data-role=\"button\" onclick=\"logOut()\" class=\"ui-btn ui-btn-right ui-corner-all ui-shadowui-btn-a ui-btn-icon-notext ui-icon-back\">LogOut</a>");

  var locationName = Parse.Object.extend("Location");
  var query = new Parse.Query(locationName);
  query.find({
    success:function(results) {
      results.forEach(function(result){
        var locName = result.attributes;
        locName['ObjectId']= result.id;
        $("#LocWin").append(us_temp2(locName));
      });
    },
    error: function(error) {
      // error is an instance of Parse.Error.
    }
  });
}


function getUser() {
  document.getElementById("inforWindow").style.display = "none";
  document.getElementById("search-panel").style.display = "none";
  document.getElementById("footer").style.display = "none";
  document.getElementById("checkInWindow").style.display = "block";
  document.getElementById("checkLocation").style.display = "none";
  $('#headerbut').html("<a data-role=\"button\" onclick=\"window.location.reload();\" id=\"NewData\" class=\"ui-btn ui-btn-left ui-corner-all ui-shadow ui-btn-a ui-btn-icon-notext ui-icon-carat-l\">Profile</a>" 
    + "<img src=\"images/coworking.png\" height=\"25\" width=\"21\" style=\"margin-top:6px\"></img>CoWorking!" 
    + "<a id=\"LogoutBut\" data-role=\"button\" onclick=\"logOut()\" class=\"ui-btn ui-btn-right ui-corner-all ui-shadow ui-btn-a ui-btn-icon-notext ui-icon-back\">LogOut</a>");

  var query = new Parse.Query(ShowCard);
  query.get(objectId, {
    success: function(s) {
      s.set("CheckIn", test);
      s.save();
    }
  });

  var query = new Parse.Query(ShowCard);
  query.equalTo("CheckIn", test);
  query.find({
    success:function(results) {
      if(results.length == 1 ) {
        alert("No person around")
      }
      else {
        results.forEach(function(result){
          if (result.attributes.UserName == usName) {
            return false;
          }
          var locInfo = result.attributes;
          locInfo['ObjectId']= result.id;
          $("#checkInWindow").append(us_temp1(locInfo));
        });
      }   
    },
    error: function(error) {
      // error is an instance of Parse.Error.
    }
  });
	
	var user = Parse.User.current();
	var q2 =  new Parse.Query(Parse.User);
	q2.equalTo("location", user.attributes.location);
	q2.find({
		success:function(results) {
        results.forEach(function(result){
					console.log(result.attributes.username);
					console.log(result.attributes.photo.url());
        });
    },
    error: function(error) {
      // error is an instance of Parse.Error.
    }
  });		
}









     
       