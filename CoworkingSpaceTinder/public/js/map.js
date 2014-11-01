var useCurrent = true;
var gotLocation = false;
var mapOptions;
var map;
var markers = new Array();
var restMarkers = new Array();
var parkMarkers = new Array();
var input;
var geocoder = new google.maps.Geocoder();
var searchbox;
var here;
var initialized = 0;
      //InfoWindow related vars
var contentString;
var singleInfoWindow = new google.maps.InfoWindow();
var contentStringArr = new Array();
var emailStringArr = new Array();
var idArr = new Array();

function initializeMap(position) {
        
        var curLat;
        var curLong;
        if (useCurrent == true) {

          curLat = position.coords.latitude;
          curLong = position.coords.longitude;
          //alert(curLat + '\n' + curLong);
        } else {

          curLat = position.lat();
          curLong = position.lng();
        }
        mapOptions = {
          center : new google.maps.LatLng(curLat, curLong),
          zoom : 14,
          mapTypeId : google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        
        here = new google.maps.Marker({
          position: new google.maps.LatLng(curLat, curLong),
          map: map,
          icon: 'images/here-star.png',
          draggable: false,
          animation: google.maps.Animation.BOUNCE,
          title: 'You Are Here!'
        }); 
        
        here.setMap(map);
      }

      function initialize() {

        welcome = document.getElementById("welcome");        
        if (initialized == 0) {
          initialized = 1;
          toggleMap();
        }
        //alert('initializing');
        /*Parse.initialize("LKworc4PQlQ5YL1rgYWVqWGRbPE48a6oLpDCx0Lh", "bbjJLDdBzrMgnHMtCMyq0FgYqIhyPi6TROoakWU1");
        Hotels = Parse.Object.extend("Hotels");
        Restaurants = Parse.Object.extend("Restaurants");
        Parks = Parse.Object.extend("Parks");*/
        if (navigator.geolocation) {
          //alert('geolocator enabled');
          navigator.geolocation.getCurrentPosition(initializeMap, errorFunction);
          gotLocation = true;
        } else {
          alert('Error: No location');
        }
        
      }

      function toggleMap() {
        document.getElementById("map_canvas").style.display="block";
        welcome.style.display = "none";
      }