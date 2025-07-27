function canBuildBike() {
	return(gameData.bikeParts >= 0);
}

function finishBike() {
	gameData.bikes += 1;
	document.getElementById("bikes-built").innerHTML = gameData.bikes;
	gameData.bikeBuildProgress = 0;
}

function bikeBuildStep(event) {
	//console.log(event);
	if ( !canBuildBike() ) {
		return;
	}

	let buildTime = gameData.mechanicBaseTimePerBike / 10;

	let timer = document.getElementById("player-build-timer");

	if ( gameData.bikeBuildProgress >= buildTime ) {
		finishBike();
		timer.style.setProperty("--progress", '0%')
	}
	else {
		let partsPerInterval = gameData.partsPerBike / buildTime;
		
		if ( gameData.bikeParts < partsPerInterval ) {
			gameData.bikeBuildProgress += (gameData.bikeParts / partsPerInterval);
			gameData.bikeParts = 0;
		}
		else {
			gameData.bikeBuildProgress += 1;
			gameData.bikeParts -= partsPerInterval;
		}

		let newProgressPercent = Math.min(Math.floor(100 * gameData.bikeBuildProgress / buildTime), 100);
		timer.style.setProperty("--progress", `${newProgressPercent}%`);
		document.getElementById("bike-parts").innerHTML = Math.round(gameData.bikeParts);
	}
}

document.getElementById("build-bike").addEventListener("click", (event) => bikeBuildStep(event));

let buildInterval;
document.getElementById("build-bike").addEventListener("mousedown", (event) => {
	buildInterval = window.setInterval( () => bikeBuildStep(event), 100);
});

document.getElementById("build-bike").addEventListener("mouseup", () => {
	clearInterval(buildInterval);
});

document.getElementById("build-bike").addEventListener("mouseleave", () => {
	clearInterval(buildInterval);
});

/**
 * Loop through each mechanic and update their build progress
 */
function mechanicShift() {
	if ( gameData.mechanics <= 0 ) {
		return
	}

	let partsPerInterval = gameData.partsPerBike / gameData.mechanicBaseTimePerBike;
	let timersToUpdate = Math.min(gameData.mechanics, gameData.mechanicTimers.length);

	for (let i = 0; i < timersToUpdate; i++) {

		if ( !canBuildBike() ) {
			return;
		}

		const timer = document.getElementById(`mech-${i + 1}-timer`);
		const mechsOnTimer = Math.floor(gameData.mechanics / 3) + ((gameData.mechanics % 3) > i);

		if (gameData.mechanicTimers[i] >= gameData.mechanicBaseTimePerBike) {
			gameData.bikes += mechsOnTimer;
			document.getElementById("bikes-built").innerHTML = gameData.bikes;
			gameData.mechanicTimers[i] = 0;
			timer.style.setProperty("--progress", '0%')
		}
		else {
			// if there's not enough parts for ALL the mechanics on that timer,
			// only progress a fractional amount
			if ( gameData.bikeParts < (mechsOnTimer * partsPerInterval) ) {
				gameData.mechanicTimers[i] += (gameData.bikeParts / (mechsOnTimer * partsPerInterval))
				gameData.bikeParts = 0;
			}
			else {
				gameData.mechanicTimers[i] += 1;
				gameData.bikeParts -= (mechsOnTimer * partsPerInterval);
			}

			let newProgressValue = Math.min(Math.floor(100 * gameData.mechanicTimers[i] / gameData.mechanicBaseTimePerBike), 100);
			timer.style.setProperty('--progress', `${newProgressValue}%`);
			document.getElementById("bike-parts").innerHTML = Math.round(gameData.bikeParts);
		}
	}
}

/**
 * Check if we need to display a new mechanic timer bar (up to 3)
 * and if so, display it and initialize it to zero percent
 */
function addNewMechanicTimer() {

	let currentTimers = gameData.mechanicTimers.length
	let newTimers = Math.min(gameData.mechanics, 3);

	for (let i = currentTimers; i < newTimers; i++) {

		const timer = document.getElementById(`mech-${i + 1}-timer`);
		const prog = document.getElementById(`mech-${i + 1}-progress`);
		timer.style.setProperty("--progress", `0%`);
		timer.classList.remove("hidden");
		prog.classList.remove("hidden");
		gameData.mechanicTimers.push(0);
	}

	for (let i = 0; i < gameData.mechanicTimers.length; i++) {
		const timer = document.getElementById(`mech-${i + 1}-timer`);
		const multiplierLabel = timer.getElementsByClassName("build-multiplier")[0];
		const mechsOnTimer = Math.floor(gameData.mechanics / 3) + ((gameData.mechanics % 3) > i);
		if (mechsOnTimer > 1) {
			multiplierLabel.classList.remove("hidden");
		}
		multiplierLabel.innerText = `×${mechsOnTimer}`;
	}
}