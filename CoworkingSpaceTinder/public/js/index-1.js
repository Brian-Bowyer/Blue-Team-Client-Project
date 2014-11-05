
    var Add;
    var Build;

    Parse.initialize("GI4coBdWVBWk8CexD33M9SD0GjHRTTq5jo1GnUbb", "r4yKyt6O5KiJhtMVfXraqoNZqee5JjiIBFH1fyIk");
    var currentUser = Parse.User.current();
    var geocoder = new google.maps.Geocoder();
    var objectId;
    var useCurrent = true;
    var temp = $("#inforCard").html();
    var us_temp = _.template(temp);
    var temp1 = $("#CheckCard").html();
    var us_temp1 = _.template(temp1);
    var ShowCard = Parse.Object.extend("UserInfor");
    var usName;
    var pyrmont;
    if (currentUser) {
        usName = currentUser.attributes.username;
        //usphoto = currentUser.attributes.photo.url;
        //document.getElementById('UseCurText').style.display = "block";
        //document.getElementById('UserCurBut').style.display = "block";
        toggleMap();
        
        var query = new Parse.Query(ShowCard);
        query.equalTo("UserName", usName);
        query.find({
      success: function(results) {
        results.forEach(function(result){
                  var cardinfo = result.attributes;
                  objectId = result.id;
                  document.getElementById("map_canvas").insertAdjacentHTML("afterBegin", us_temp(cardinfo))
                  //$("#map_canvas").append(us_temp(cardinfo));
                  document.getElementById('photoimg').setAttribute('src',currentUser.attributes.photo.url());
                          });
      },
      error: function(error) {
                // error is an instance of Parse.Error.
              }
            });
        $('#headerbut').html("<a data-role=\"button\" onclick=\"editProfile()\" id=\"NewData\" class=\"ui-btn ui-btn-left ui-corner-all ui-shadow ui-btn-a ui-btn-icon-notext ui-icon-action\">Profile</a>" + "<img src=\"images/coworking.png\" height=\"25\" width=\"21\" style=\"margin-top:6px\"></img>CoWorking!" + "<a id=\"LogoutBut\" data-role=\"button\" onclick=\"logOut()\" class=\"ui-btn ui-btn-right ui-corner-all ui-shadow ui-btn-a ui-btn-icon-notext ui-icon-back\">LogOut</a>");
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
        //document.getElementById('UseCurText').style.display = "none";
      //document.getElementById('UserCurBut').style.display = "none";
      $('#footerbut').html("<a href=\"#popupLogin\" data-rel=\"popup\" data-position-to=\"window\" class=\"ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-check ui-btn-icon-left ui-btn-a\" data-transition=\"pop\">Sign in</a>");
      }


    function logIn() {
    Parse.User.logIn($("#un").val(), $("#pw").val(), {
      success: function(user) {
        //alert("Login successful, redirecting to home page.");
        window.location.reload();
      },
      error: function(user, error) {
          // Login failed. Check error for reason.
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
          window.location.reload();
        }
      });
  }
      function logOut() {
        var query = new Parse.Query(ShowCard);
        query.get(objectId, {
      success: function(s) {
        s.unset("Location");
        s.save();  
        Parse.User.logOut();
      location.reload();      // The object was retrieved successfully.
      },
      error: function(object, error) {
      }

    });
  }

  function signUp(){
     var user = new Parse.User();
     user.set("username", $("#un").val());
     user.set("password", $("#pw").val());

     user.signUp(null, {
       success: function(user) {  
        //alert("Sign up successful, redirecting to home page.");
       window.location = "../public/editProfile.html";
      },
      error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      });
   }
   function editProfile() {
    window.location = "../public/editProfile.html";
   }

   function toggleMap() {
        document.getElementById("map_canvas").style.display="block";
        document.getElementById("welcome").style.display = "none";
      }

   function initialize() {
      
        if (navigator.geolocation) {
          //alert('geolocator enabled');
          navigator.geolocation.getCurrentPosition(initializeMap);
          gotLocation = true;
        } else {
          alert('Error: No location');
        }
        
      }
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          if (results[0]) {
            Build = results[0].name;
             var query = new Parse.Query(ShowCard);
                  query.get(objectId, {
                    success: function(s) {
                      s.set("BuildingName", Build);
                      s.save();  
               // The object was retrieved successfully.
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


    function initializeMap(position) {
        var curLat;
        var curLong;
        document.getElementById("inforWindow").style.display = "none";
        document.getElementById("search-panel").style.display = "none";
        document.getElementById("footer").style.display = "none";
        document.getElementById("checkInWindow").style.display = "block";
        $('#headerbut').html("<a data-role=\"button\" onclick=\"window.location.reload();\" id=\"NewData\" class=\"ui-btn ui-btn-left ui-corner-all ui-shadow ui-btn-a ui-btn-icon-notext ui-icon-carat-l\">Profile</a>" + "<img src=\"images/coworking.png\" height=\"25\" width=\"21\" style=\"margin-top:6px\"></img>CoWorking!" + "<a id=\"LogoutBut\" data-role=\"button\" onclick=\"logOut()\" class=\"ui-btn ui-btn-right ui-corner-all ui-shadow ui-btn-a ui-btn-icon-notext ui-icon-back\">LogOut</a>");

        if (useCurrent == true) {

          curLat = position.coords.latitude;
          curLong = position.coords.longitude;
                    //alert(curLat + '\n' + curLong);
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
               // The object was retrieved successfully.
                    },
                    error: function(object, error) {
                      alert('Failed to create new object, with error code: ' + error.message);
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                    }
                  });
                } else {
                  alert('No results found');
                }
              } else {
              alert('Geocoder failed due to: ' + status);
              }
            }); 

        } else {

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
            s.save();   
               // The object was retrieved successfully.
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
            else{
              results.forEach(function(result){
              if (result.attributes.UserName == usName) {
                return false;
              }
                  var locInfo = result.attributes;
                  locInfo['ObjectId']= result.id;
                  //locInfo['URL'] = result.attributes.photo.url;
                  $("#checkInWindow").append(us_temp1(locInfo));
                    //document.getElementById("checkInWindow").insertAdjacentHTML("beforeEnd", us_temp1(locInfo));
                  //$("#map_canvas").append(us_temp(cardinfo));
                  //document.getElementById('photoimg').setAttribute('src',result.attributes.photo.url());
              });

            }   
        },
        error: function(error) {
                // error is an instance of Parse.Error.
              }
        });
      }
      function codeAddress() {
        //alert('codeAddress');
        useCurrent = false;
        input = document.getElementById("target");
        Add = input.value;
        //alert('created Address');
        //alert('Address = ' + Address);
        var query = new Parse.Query(ShowCard);
                  query.get(objectId, {
                    success: function(s) {
                      s.set("Address", Add);
                      s.save();   
               // The object was retrieved successfully.
                    },
                    error: function(object, error) {
                      alert('Failed to create new object, with error code: ' + error.message);
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                    }
                  });
        geocoder.geocode({
          'address' : Add
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var temp = results[0].geometry.location;
            //alert('ready to initialize map');
            initializeMap(temp);        
          } else {
            alert("Geocode was not successful for the following reason: " + status);
            useCurrent = true;
          }
        });
      }
      function calcDistance(p1, p2){
        return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000 * 0.621371).toFixed(2);
      }
     
       