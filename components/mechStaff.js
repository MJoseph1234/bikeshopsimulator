function canHireMechanic() {
	// don't softlock
	// so, need enough money to hire + at least one bike to sell or enough parts to build a bike or enough money to buy parts
	return(gameData.money >= gameData.mechanicHiringCost 
		&& (gameData.bikes > 0 || gameData.bikeParts >= gameData.partsPerBike || gameData.money > gameData.BikePartsBaseCost ))
}

function hireMechanic() {
	if (!canHireMechanic()) {
		return
	}
	gameData.money -= gameData.mechanicHiringCost;
	gameData.mechanics += 1;

	if (gameData.mechanics == 1) {
		queueNewsTicker("Bike Shop hires first mechanic.");
	}

	if (gameData.mechanics <= 5){
		//show next mechanic timer bar
		const timer = document.getElementById(`mech-${gameData.mechanics}-timer`);
		const prog = document.getElementById(`mech-${gameData.mechanics}-progress`);
		timer.classList.remove("hidden");
		prog.classList.remove("hidden");
		timer.style.setProperty("--progress", `0%`);
		//set new mechanic timer
		gameData.mechanicTimers.push(0);
	}
	document.getElementById("money").innerHTML = gameData.money.toLocaleString();
	document.getElementById("staff-mechanics").innerHTML = gameData.mechanics;
	document.getElementById("hire-mechanic").disabled = !canHireMechanic();
}

function mechanicShift() {
	if (gameData.mechanics.length <= 0) {
		return
	}
	// let ts = gameData.timer;

	// let progress = document.getElementById("mechanic-progress-bar");
	// const progValue = Math.floor(100*(ts - gameData.mechanics[0])/gameData.mechanicBaseTimePerBike);
	// progress.style.setProperty("--progress", `${progValue}%`);
	
	var mechsOnTimer = 0;
	var progValue = 0;
	for (let i = 0; i < gameData.mechanicTimers.length; i++) {
		mechsOnTimer = Math.floor(gameData.mechanics/5) + (gameData.mechanics%5>=i);
		
		if (gameData.bikeParts < (mechsOnTimer * 100)) {
			continue;
		}

		var progElement = document.getElementById(`mech-${i+1}-timer`);
		progValue = Math.min(Math.floor(100*gameData.mechanicTimers[i]/gameData.mechanicBaseTimePerBike), 100);

		if (progValue >= 100) {
			for (let j = 0; j < mechsOnTimer; j++) {
				buildBike();
				progElement.style.setProperty('--progress', '0%');
			}
			gameData.mechanicTimers[i] = 0;
		}
		else {
			gameData.mechanicTimers[i] += 1;
			progValue = Math.min(Math.floor(100*gameData.mechanicTimers[i]/gameData.mechanicBaseTimePerBike), 100);
			progElement.style.setProperty('--progress', `${progValue}%`);
		}
	}
}