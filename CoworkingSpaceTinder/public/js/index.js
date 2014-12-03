    
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
var usName;
var test;
var checkedIn;

if (currentUser) {
  toggleMap();
  var cardinfo = currentUser.attributes;
  document.getElementById("map_canvas").insertAdjacentHTML("afterBegin", us_temp(cardinfo));
  getUser();
  
  $('#headerbut').html(ah_temp);
  if (cardinfo.checkedIn) { 
    $("#CheckedInButton").jqxSwitchButton({ orientation: 'vertical', theme: 'classic', width: '47', height: '65', checked: true, onLabel:"In",offLabel:"Out"});
    if (cardinfo.available) {
            $("#BusyFreeButton").jqxSwitchButton({ orientation: 'vertical', theme: 'classic', width: '47', height: '65', checked: true, onLabel:"free",offLabel:"busy"});
          } else {
            $("#BusyFreeButton").jqxSwitchButton({ orientation: 'vertical', theme: 'classic', width: '47', height: '65', checked: false, onLabel:"free",offLabel:"busy"});
            } 
  } else {
    $("#CheckedInButton").jqxSwitchButton({ orientation: 'vertical', theme: 'classic', width: '47', height: '65', checked: false, onLabel:"In",offLabel:"Out"});   
  }
}
  

$("#CheckedInButton").bind('change', function (event) {
  var checked = event.args.check;
  if(checked) {
    CheckIn();
  } else { 
    CheckOut();
  }
});

$("#BusyFreeButton").bind('change', function (event) {
  var checked = event.args.check;
  if(checked) {
    toggleb();
  } else {
    togglea();
  }
});

//to check timeout
var pollingInterval = setInterval(onInterval, 300000);

// log in function
function logIn() {
  Parse.User.logIn($("#un").val().toLowerCase(), $("#pw").val(), {
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
  currentUser.set("checkedIn", false);
  currentUser.set("available", false);
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
  document.getElementById("headerbut").style.display = "block";
  document.getElementById("map_canvas").style.display="block";
  document.getElementById("checkInWindow").style.display = "block";
  
}

function codeAddress() {
  var searchName = $('#target').val();
  localStorage.setItem("searchName", searchName);
  window.location = "./CheckIn.html";
}

function getUser() {
	var query = new Parse.Query(Parse.User);
	var query2 = new Parse.Query(Parse.User);
	query2.get(currentUser.id, {
		success:function(object){
					var locInfo = object.attributes;
					locInfo['objectId'] = object.id;
					$("#checkInWindow").append(us_temp1(locInfo));
					
			query.equalTo("homeBase", currentUser.attributes.homeBase);
			query.descending("checkedIn","available");
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
}


function CheckIn() {
  $("#popupIntent").popup("open");
}

function CheckOut() {
  currentUser.set("checkedIn", false);
	currentUser.set("funQuestion", "");
	currentUser.set("intent", "");
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

function limitText(limitField, limitNum) {
  if (limitField.value.length > limitNum) {
    limitField.value = limitField.value.substring(0, limitNum);
  } else {
    //limitCount.value = limitNum - limitField.value.length;
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
  currentUser.set("available", true); 
 
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
  $("#checkInWindow").empty();
  getUser();
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

function togglea() {
  //toggles availability
  currentUser.set("available", false); 
  currentUser.save(null, {
    success: function (User) {
      window.location.reload();// body...
    },
    error: function (error){
      console.log("error with code " + error.code + " :" + error.message);
    }
  });
}

function toggleb(){
  //toggles availability
  currentUser.set("available", true); 
  currentUser.save(null, {
    success: function (User) {
      window.location.reload();// body...
    },
    error: function (error){
      console.log("error with code " + error.code + " :" + error.message);
    }
  });


}