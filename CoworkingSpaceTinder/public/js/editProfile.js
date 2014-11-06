		Parse.initialize("GI4coBdWVBWk8CexD33M9SD0GjHRTTq5jo1GnUbb", "r4yKyt6O5KiJhtMVfXraqoNZqee5JjiIBFH1fyIk");

		var user = Parse.User.current();

		var un;
		if (user) {
			un = user.attributes.username;
			document.getElementById('picture2').setAttribute('src',user.attributes.photo.url());
			$("#username").html("<button onclick=\"Parse.User.logOut();location.reload();\" class =\"btn btn-primary btn-lg\"><span class = \"buttontext\">Log Out</span></button>");
		} else {
			un = "none";
			document.getElementById('picture2').setAttribute('src',"https://truonex-static.s3.amazonaws.com/images/fallback/profile_avatar_default.png");
			$("#username").html("<a href = \"login.html\"><button class =\"btn btn-primary btn-lg\"><span class = \"buttontext\">Log In</span></button></a>");
		}

		function Redirect() {
      window.location = "./index.html";
    }


		$('#submit').click(function () {
			var un = user.attributes.username;
			var n = $("#Name").val();
			var fileUploadControl = $("#Photo")[0];

			if (fileUploadControl.files.length > 0) {
  				var file = fileUploadControl.files[0];
  				var name = "photo.png";
  			 	var parseFile = new Parse.File(name, file);
  			 	parseFile.save().then(function() {
						alert("success");
			//user = Parse.User.current();
 				 // The file has been saved to Parse.
			}, function(error) {
  				alert('Failed to create new file, with error code: ' + error.id);// The file either could not be read, or could not be saved to Parse.
			});
  			 
  			 user.set("name", n);
			user.set("photo", parseFile);


			user.save(null, {
				success: function(user) {
					// Execute any logic that should take place after the object is saved.
					console.log("save success.");
				},
				error: function(user, error) {
					// Execute any logic that should take place if the save fails.
					// error is a Parse.Error with an error code and message.
					alert('Failed to create new object, with error code: ' + error.id);
				}
			});
            //user = Parse.User.current();
            setTimeout('Redirect()', 250);
			}

			
		});
