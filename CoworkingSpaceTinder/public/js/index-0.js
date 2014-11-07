    
Parse.initialize("GI4coBdWVBWk8CexD33M9SD0GjHRTTq5jo1GnUbb", "r4yKyt6O5KiJhtMVfXraqoNZqee5JjiIBFH1fyIk");
var currentUser = Parse.User.current();
var temp = $("#inforCard").html();
var us_temp = _.template(temp);
var usName;
var test;

if (currentUser) {
  usName = currentUser.attributes.username;
  cardinfo = currentUser.attributes;
  toggleMap();
  document.getElementById("map_canvas").insertAdjacentHTML("afterBegin", us_temp(cardinfo))
  //document.getElementById('photoimg').setAttribute('src',currentUser.attributes.photo.url());
  
  $('#headerbut').html("<a data-role=\"button\" onclick=\"editProfile()\" id=\"NewData\" class=\"ui-btn ui-btn-left ui-corner-all ui-shadow ui-btn-a ui-btn-icon-notext ui-icon-action\">Profile</a>" 
    + "<img src=\"images/coworking.png\" height=\"25\" width=\"21\" style=\"margin-top:6px\"></img>CoWorking!" 
    + "<a id=\"LogoutBut\" data-role=\"button\" onclick=\"logOut()\" class=\"ui-btn ui-btn-right ui-corner-all ui-shadow ui-btn-a ui-btn-icon-notext ui-icon-back\">LogOut</a>");
  //document.getElementById("search-panel").style.display = "block";
  //$('#footerbut').html("<a data-role=\"button\" onclick=\"codeAddress()\" data-position-to=\"window\" class=\"ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-search ui-btn-icon-left ui-btn-a\" data-transition=\"pop\">Search</a>");
  //setTimeout(function(){
    //logOut();
  //}, 300000);
        /*$(window).bind('beforeunload', function() {
            Parse.User.logOut();
        });*/
}
else{
  $('#footerbut').html("<a href=\"#popupLogin\" data-rel=\"popup\" data-position-to=\"window\" class=\"ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-check ui-btn-icon-left ui-btn-a\" data-transition=\"pop\">Sign in</a>");
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
  currentUser.unset("location");
  currentUser.save(null, {
    success: function(user) {
      Parse.User.logOut();
      window.location.reload();      
    },
    error: function(error) {
      // error is an instance of Parse.Error.
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
  document.getElementById("welcome").style.display = "none";
  document.getElementById("footer").style.display="none";
  document.getElementById("map_canvas").style.display="block";
 
}

//Check usecurrent function

//google place return function


//show person  nearby the location


/*function calcDistance(p1, p2){
  return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000 * 0.621371).toFixed(2);
}*/

