

// add database config

var time = new Date().getTime();
     $(document.body).bind("mousemove keypress", function(e) {
         time = new Date().getTime();
     });

     function refresh() {
         if(new Date().getTime() - time >= 60000) 
             window.location.reload(true);
         else 
             setTimeout(refresh, 10000);
     }

     setTimeout(refresh, 10000);

  var config = {
    apiKey: "AIzaSyA_Tgr1vOKoCO5Hr7z0jF7RftHiEtNctJA",
    authDomain: "train-timetable-db9c8.firebaseapp.com",
    databaseURL: "https://train-timetable-db9c8.firebaseio.com",
    projectId: "train-timetable-db9c8",
    storageBucket: "train-timetable-db9c8.appspot.com",
    messagingSenderId: "160801758086"
  };

// initialize database

	firebase.initializeApp(config);

	var database = firebase.database();


// Timetable refresh

$("#refresh").on("click", function(event) {
    window.location.reload(true);
})

// Set up on-click handler w/ prevent default

var trainVar = "";
var destVar = "";
var firstVar = 0;
var freqVar = "";

$("#add-train").on("click", function(event) {
  event.preventDefault();

  // Convert the time to moment.js

	//Grab values from form inputs w/ val trim

	trainVar = $("#train-name-input").val().trim();
	destVar = $("#destination-input").val().trim();
	firstVar = $("#first-time-input").val().trim();
	freqVar = $("#frequency-input").val().trim();

	var newTrain = {
		train: trainVar,
		destination: destVar,
		first: firstVar,
		frequency: freqVar,
		dateAdded: firebase.database.ServerValue.TIMESTAMP
	};

	console.log(newTrain.train);
	console.log(newTrain.destination);
	console.log(newTrain.first);
	console.log(newTrain.frequency);

	database.ref().push(newTrain);

	$("#train-name-input").val("");
  	$("#destination-input").val("");
  	$("#first-time-input").val("");
  	$("#frequency-input").val("");

})

// database on child added snapshot

database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {

	console.log(snapshot.val());

	var dbTrain = snapshot.val().train;
	var dbDest = snapshot.val().destination;
	var dbFirst = snapshot.val().first;
	var dbFreq = snapshot.val().frequency;

//  Math for Next Train Arrival and Minutes Away will go here

// First Time (pushed back 1 year to make sure it comes before current time)
    var dbFirstConverted = moment(dbFirst, "hh:mm").subtract(1, "years");
	// Current Time
    var currentTime = moment();
	// Difference between the times
    var interval = moment().diff(moment(dbFirstConverted), "minutes");
	// Time apart (remainder)
    var intervalRemainder = interval % dbFreq;
	// Minute Until Train
    var waitTime = dbFreq - intervalRemainder;
	// Next Train
    var nextTrain = moment().add(waitTime, "minutes");
    // Making a display version of next
    var nextDisplay = moment(nextTrain).format("hh:mm");

    // Appending to Table
	$("#train-table").append("<tr><td>" + dbTrain + "</td><td>" + dbDest + "</td><td>" + dbFreq + "</td><td>" + nextDisplay + "</td><td>" + waitTime + "</td></tr>");

	})
// 