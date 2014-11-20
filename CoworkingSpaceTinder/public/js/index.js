    
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

//to check timeout
var pollingInterval = setInterval(onInterval, 300000);

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
          console.log("error with code " + error.code + " :" + error.message);
        }
      }); 
        },
        error: function(error){
          console.log("error with code " + error.code + " :" + error.message);
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
	currentUser.set("funQuestion", "");
  currentUser.set("TimeoutTime", -1);
  currentUser.save(null, {
    success: function (User) {
      window.location.reload();
      // body...
    },
    error: function (error){
      console.log("error with code " + error.code + " :" + error.message);
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
  tMins = $('#timeout').val();
  $( "#popupIntent" ).popup( "close" );
  currentUser.set("intent", Userintent);
	currentUser.set("funQuestion", fq);
  currentUser.set("checkedIn", true);  
 
  tSecs = tMins * 60;//currently assuming duration measured in seconds
  tSecs = typeof(tSecs)!== 'undefined' ?  tSecs : 60*60; //setting to an hour if t is null

  var timeout = new Date().getTime() + tSecs*1000;
  console.log(timeout);
  currentUser.set("TimeoutTime", timeout);
  currentUser.save(null, {
    success: function (User) {
      console.log("Sucessfully saved TimeoutTime as " + currentUser.get("TimeoutTime") + " which should be equal to " + timeout);
      window.location.reload();
      // body...
    },
    error: function (error){
      console.log("error with code " + error.code + " :" + error.message);
    }
  });
}

function onInterval() {
  console.log("Starting poll now")
  if (currentUser == null)
  {
    return;
  }
  //check timeout
  var now = new Date().getTime();
  var then = currentUser.get("TimeoutTime");
  console.log(now + " " + then);
  if (currentUser.get("checkedIn") && then <= now){
    CheckOut();

  }
  
}

function togglea(){
  //toggles availability
  if (currentUser.get("Available")){
    currentUser.set("Available", false); 
  } else {
    currentUser.set("Available", true);
  }

  currentUser.save(null, {
    success: function (User) {
      console.log("Availability toggled, is now " + currentUser.get("Available"));
      window.location.reload();
      // body...
    },
    error: function (error){
      console.log("error with code " + error.code + " :" + error.message);
    }
  });

}