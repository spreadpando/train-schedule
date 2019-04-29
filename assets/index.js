var config = {
	apiKey: "AIzaSyDERgq2wOhamH6XLkqcothJsDxW35IMSJs",
	authDomain: "spreadpando-102.firebaseapp.com",
	databaseURL: "https://spreadpando-102.firebaseio.com",
	projectId: "spreadpando-102",
	storageBucket: "spreadpando-102.appspot.com",
	messagingSenderId: "982902885400"
};
firebase.initializeApp(config);
let dB = firebase.database();

$('#submit').on('click', function () {
	event.preventDefault();
	let name = $('#name').val().trim();
	let destination = $('#dest').val().trim();
	let initTime = $('#init-time').val().trim();
	let frequency = $('#freq').val().trim();
	let Train = {
		"name": name,
		"destination": destination,
		"initial": initTime,
		"frequency": frequency,
	}
	dB.ref('/trainsArray').push({
		Train
	});
})

dB.ref("/trainsArray").on('value', function (snapshot) {
	setInterval(renderTrains(snapshot), 60000);
});

function renderTrains(snapshot) {
	$('#schedule').html('');
	snapshot.forEach(function (childSnapshot) {
		let name = childSnapshot.val().Train.name;
		let nameDiv = $('<div>').attr('class', 'row').html("The <h1>" + name + " train</h1>");
		let destination = childSnapshot.val().Train.destination;
		let destDiv = $('<div>').attr('class', 'row').html(" to <h1>" + destination + "</h1>");
		let initial = childSnapshot.val().Train.initial;
		let frequency = childSnapshot.val().Train.frequency;
		let detail = $('<div>').attr('class', 'detail');
		let firstTrain = moment(initial, 'hh:mm').subtract(1, 'y');
		let difference = moment().diff(moment(firstTrain), 'minutes');
		let remainder = difference % frequency;
		let nextTrain = frequency - remainder;
		let nextDiv = $('<div>').attr('class', 'row').html(" will be arriving in <h1>" + nextTrain + " minute(s) </h1>");
		let arriving = moment().add(nextTrain, 'minutes').format("HH:mm");
		let arrivalDiv = $('<div>').attr('class', 'row').html(" at <h1>" + arriving + "</h1>");
		detail.append(nameDiv, destDiv, nextDiv, arrivalDiv);
		$('#schedule').append(detail);

		// ...
	});
};