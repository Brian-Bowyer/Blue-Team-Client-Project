    
//Dev
//Parse.initialize("GI4coBdWVBWk8CexD33M9SD0GjHRTTq5jo1GnUbb", "r4yKyt6O5KiJhtMVfXraqoNZqee5JjiIBFH1fyIk");
Parse.initialize("lu3wCFY4M2wIjZAZL99LMvaFelwvkMC6sx4a6I6I", "x7jQv4tn9vA52wZErXuvyllOYhEnG8d6IoxkeSM0");
var currentUser = Parse.User.current();
var temp = $("#inforCard").html();
var us_temp = _.template(temp);
var usName;
var test;

if (currentUser) {
  //usName = currentUser.attributes.username;
  //cardinfo = currentUser.attributes;
  toggleMap();
  //document.getElementById("map_canvas").insertAdjacentHTML("afterBegin", us_temp(cardinfo))
  $('#headerbut').html("<a data-role=\"button\" onclick=\"editProfile()\" id=\"NewData\" class=\"ui-btn ui-btn-left ui-corner-all ui-shadow ui-btn-a \">Edit Profile</a>" 
    + "<img src=\"images/coworking.png\" height=\"25\" width=\"21\" style=\"margin-top:6px\"></img>Collisions!" 
    + "<a id=\"LogoutBut\" data-role=\"button\" onclick=\"logOut()\" class=\"ui-btn ui-btn-right ui-corner-all ui-shadow ui-btn-a \">Log Out</a>");
    $('#footerbut').html("<a data-role=\"button\" onclick=\"codeAddress()\" data-position-to=\"window\" class=\"ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-search ui-btn-icon-left ui-btn-a\" data-transition=\"pop\">Search</a>");
  
  //setTimeout(function(){
    //logOut();
  //}, 300000);
        /*$(window).bind('beforeunload', function() {
            Parse.User.logOut();
        });*/
}
else{
  $('#footerbut').html("<a href=\"#popupLogin\" data-rel=\"popup\" data-position-to=\"window\" class=\"ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-a\" data-transition=\"pop\">Log In</a>");
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
  document.getElementById("search-panel").style.display = "block";
 
}

