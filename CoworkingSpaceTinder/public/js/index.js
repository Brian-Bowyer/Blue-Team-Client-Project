Parse.initialize("GI4coBdWVBWk8CexD33M9SD0GjHRTTq5jo1GnUbb", "r4yKyt6O5KiJhtMVfXraqoNZqee5JjiIBFH1fyIk");

var temp = $("#cardTemplate").html();
var us_temp = _.template(temp);
var createCard = function(a) {$("#target").append(us_temp(a))};

var cards = [{name: "Generic Name", imageURL: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ23wZlNDJoHzsuRQ7X4zFE7lcNY7RrR3AiGZXeo8R6qJa4vjBo"},
{name: "Other Guy", imageURL: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSFNB7vDxxxGgCoGcmhAmu4CxKgXRUZPLV6wli-qpSvCuEcu0Hq4A"}]

_.forEach(cards, function(result){
	createCard(result);
});
