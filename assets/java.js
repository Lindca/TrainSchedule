  // adding firebase
  var config = {
    apiKey: "AIzaSyDniQ-KTm3I1YetRqZyvEd1u1uSu8q6ta4",
    authDomain: "trainschedule-12f43.firebaseapp.com",
    databaseURL: "https://trainschedule-12f43.firebaseio.com",
    projectId: "trainschedule-12f43",
    storageBucket: "",
    messagingSenderId: "1048471152863"
};
firebase.initializeApp(config);

// set up global vars
var trainName;
var trainDestination;
var startTime;
var trainFrequency;
var trainMinutesAway;
var dbObj;
var formNextTrain;
var nextTrain;
// the time NOW
var momentTime = moment();
var database = firebase.database();
// this was not as easy as I would have liked 
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
database.ref().on('child_added', function (db) {
    dbObj = db.val();
    console.log("the first known time of the train", dbObj.firsttime);
    // get the input for the first train time and make it a var
    startTrain = moment(dbObj.firsttime, "HH:mm A");
    // turn the frequency into a integer
    trainFrequency = parseInt(dbObj.frequency);
    // do the modulas thing to get the remainder of minutes and subtract
    trainMinutesAway = trainFrequency - momentTime.diff(startTrain, "minutes") % trainFrequency;
    // add the remainder to the current time to get the next train time
    nextTrain = moment().add(trainMinutesAway, "minutes");
    // format the next train time into a readable thing
    formNextTrain = nextTrain.format("hh:mm A");
    //-----------------------------------------------------------------------------//
    // add all the database stuff to the screen
    var newRow = $("<tr>");
    newRow.append($("<td>" + dbObj.name + "</td>"));
    newRow.append($("<td>" + dbObj.destination + "</td>"));
    newRow.append($("<td>" + dbObj.frequency + "</td>"));
    newRow.append($("<td>" + formNextTrain + "</td>"));
    newRow.append($("<td>" + trainMinutesAway + "</td>"));
    $("tbody").append(newRow);
},
    function (e) {
        console.log(e);
    }
);

$("#submit").on("click", function () {
    event.preventDefault();
    // grab inputs on click
    trainName = $("#nameTrain").val().trim();
    trainDestination = $("#destinationTrain").val().trim();
    startTime = $("#firstTimeTrain").val().trim();
    trainFrequency = $("#frequencyTrain").val().trim();
    // push info to database
    database.ref().push({
        name: trainName,
        destination: trainDestination,
        firsttime: startTime,
        frequency: trainFrequency,
    });

})
