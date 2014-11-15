    
//Dev
Parse.initialize("GI4coBdWVBWk8CexD33M9SD0GjHRTTq5jo1GnUbb", "r4yKyt6O5KiJhtMVfXraqoNZqee5JjiIBFH1fyIk");
//Parse.initialize("lu3wCFY4M2wIjZAZL99LMvaFelwvkMC6sx4a6I6I", "x7jQv4tn9vA52wZErXuvyllOYhEnG8d6IoxkeSM0");
var currentUser = Parse.User.current();
var temp = $("#inforCard").html();
var us_temp = _.template(temp);
var temp1 = $("#CheckCard").html();
var us_temp1 = _.template(temp1);
var ah = $('#altHeader').html();
var ah_temp = _.template(ah);
//var af = $("#altFooter").html();
//var af_temp = _.template(af);
var usName;
var test;
var checkedIn;

if (currentUser) {
  //usName = currentUser.attributes.username;
  toggleMap();
  var cardinfo = currentUser.attributes;
  document.getElementById("map_canvas").insertAdjacentHTML("afterBegin", us_temp(cardinfo));
  //document.getElementById("map_canvas").insertAdjacentHTML("afterBegin", us_temp(cardinfo))
  getUser();
  //$('#headerbut').html("<a data-role='button' onclick='editProfile()' id='NewData' class='ui-btn ui-mini ui-btn-left ui-corner-all ui-shadow ui-btn-a ' style='margin-top:20px'>Edit Profile</a>" 
  //  + "<img src='images/coworking.png' height='25' width='21' style='margin-top:25px'></img>Collisions!" 
  //  + "<a id='LogoutBut' data-role='button' onclick='logOut()' class='ui-btn ui-mini ui-btn-right ui-corner-all ui-shadow ui-btn-a ' style='margin-top:20px'>Log Out</a>");
  //  $('#footerbut').html("<a data-role='button' onclick='codeAddress()' data-position-to='window' class='ui-btn ui-mini ui-corner-all ui-shadow ui-btn-inline ui-icon-search ui-btn-icon-left ui-btn-a' data-transition='pop'>Search</a>");
  
  $('#headerbut').html(ah_temp);
  //$('#footerbut').html(af_temp);

  //setTimeout(function(){
    //logOut();
  //}, 300000);
        /*$(window).bind('beforeunload', function() {
            Parse.User.logOut();
        });*/
}
else{
  $('#footerbut').html("<a href='#popupLogin' data-rel='popup' data-position-to='window' class='ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-a' data-transition='pop'>Log In</a>");
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
  //currentUser.unset("location");
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
  document.getElementById("checkInWindow").style.display = "block";
 
}

function codeAddress() {
  var searchName = $('#target').val();
  localStorage.setItem("searchName", searchName);
  window.location = "./CheckIn.html";
}

function getUser() {
  //actually gets all users currently

  //currentUser.set("location", currentUser.attributes.homeBase);
 // currentUser.set("intent", Userintent);
  //currentUser.save(null, {
    //success: function(user) {
      var query = new Parse.Query(Parse.User);
      var query2 = new Parse.Query(Parse.User);

      //query.equalTo("location", currentUser.attributes.homeBase);
      //query.descending("checkedIn");
      query2.get(currentUser.id, {
        success:function(object){
              var locInfo = object.attributes;
              locInfo['objectId'] = object.id;
              $("#checkInWindow").append(us_temp1(locInfo));
              
          query.equalTo("homeBase", currentUser.attributes.homeBase);
          query.descending("checkedIn");
          query.notEqualTo("username", currentUser.attributes.username);
          query.find({
            success:function(results) {
              results.forEach(function(result){
                  var locInfo = result.attributes;
                  locInfo['objectId']= result.id;
                  $("#checkInWindow").append(us_temp1(locInfo));
                  });
        },
        error: function(error) {
          alert(error);
        }
      }); 
        },
        error: function(error){
          alert(error);
        }
      });

    //}
  //});
}

function CheckIn() {
  $( "#popupIntent" ).popup( "open" );
}

function CheckOut() {
  currentUser.set("checkedIn", false);
  currentUser.save(null, {
    success: function (User) {
      window.location.reload();
      // body...
    },
    error: function (error){
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

function confirm() {
  Userintent = $('#in').val();
	fq = $('#in2').val();
  $( "#popupIntent" ).popup( "close" );
  currentUser.set("intent", Userintent);
  currentUser.set("checkedIn", true);
	currentUser.set("funQuestion", fq);
  currentUser.save(null, {
    success: function (User) {
      window.location.reload();
      // body...
    },
    error: function (error){
    }
  });
}


