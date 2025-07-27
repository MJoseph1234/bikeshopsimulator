function startEvent(eventTag) {
	if (gameData.currentEvent) {
		// should not be able to start an event while another one is in progress
		throw new Error(`error starting ${eventTag} because ${gameData.currentEvent} in progress`)
		//console.log(`error starting ${eventTag} because ${gameData.currentEvent} in progress`)
		return;
	}

	gameData.currentEvent = eventTag
	const event = events[eventTag]
	const timer = document.getElementById("event-timer");

	document.getElementById("next-event-name").innerText = event.name;
	gameData.eventTimer = event.time;
	timer.style.setProperty("--progress", '0%')
}

function eventStep() {
	
	if (!gameData.currentEvent) {
		// throw new Error("cannot event step because there's no current event")
		// make help-event disabled
		return;
	}

	const increment = gameData.eventIncrements;
	const timer = document.getElementById("event-timer");
	const event = events[gameData.currentEvent]

	if ( gameData.eventTimer <= 0 ) {
		timer.style.setProperty("--progress", '100%')
		gameData.eventTimer = 0;

		//make launch-event enabled
		document.getElementById("help-event").disabled = true;
		document.getElementById("launch-event").disabled = false;
		return;
	}

	gameData.eventTimer -= increment;
	let progressPercent = Math.min(100 - Math.floor(100 * (event.time - gameData.eventTimer)/event.time))
	timer.style.setProperty("--progress", `${progressPercent}%`);
}

function launchEvent() {
	if ( !gameData.currentEvent ) {
		//cant launch an event if there's no current event running
		throw new Error("error launching event because current event is null")
		//console.log("error launching event because current event is null")
		return;
	}

	document.getElementById("launch-event").disabled = true;
	document.getElementById("help-event").disabled = true;

	const event = events[gameData.currentEvent]
	timer.style.setProperty("--progress", '0%')

	event.effect();
}

events = {
	groupRide: {
		name: "Group Ride",
		time: 10000,
		effect: function() {
			document.getElementById("engagement-pts").innerText = "hfy"
		}
	}
}
