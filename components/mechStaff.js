function mechanicShift() {
	if (gameData.mechanics <= 0) {
		return
	}

	let partsPerInterval = gameData.partsPerBike / gameData.mechanicBaseTimePerBike;

	// loop through the mechanic timers
	for (let i = 1; i <= Math.min(gameData.mechanics, 3); i++) {
		// reveal a new mechanic timer (up to 3 timers)
		if (i > gameData.mechanicTimers.length) {
			const timer = document.getElementById(`mech-${i}-timer`);
			const prog = document.getElementById(`mech-${i}-progress`);
			timer.style.setProperty("--progress", `0%`);
			timer.classList.remove("hidden");
			prog.classList.remove("hidden");
			gameData.mechanicTimers.push(0);
		}
		else {
			if (!canBuildBike()) {
				continue;
			}

			const timer = document.getElementById(`mech-${i}-timer`);
			var mechsOnTimer = Math.floor(gameData.mechanics/3) + (gameData.mechanics%3>=i);

			if (gameData.mechanicTimers[i-1] >= gameData.mechanicBaseTimePerBike) {
				gameData.bikes += mechsOnTimer;
				document.getElementById("bikes-built").innerHTML = gameData.bikes;
				gameData.mechanicTimers[i-1] = 0;
				timer.style.setProperty("--progress", '0%')
			}
			else {
				// if there's not enough parts for ALL the mechanics on that timer,
				// only progress a fractional amount
				if (gameData.bikeParts < (mechsOnTimer * partsPerInterval)) {
					gameData.mechanicTimers[i-1] += (gameData.bikeParts / (mechsOnTimer * partsPerInterval))
					gameData.bikeParts = 0;
				}
				else {
					gameData.mechanicTimers[i-1] += 1;
					gameData.bikeParts -= (mechsOnTimer * partsPerInterval);
				}

				let newProgressValue = Math.min(Math.floor(100 * gameData.mechanicTimers[i-1] / gameData.mechanicBaseTimePerBike), 100);
				timer.style.setProperty('--progress', `${newProgressValue}%`);
				document.getElementById("bike-parts").innerHTML = Math.round(gameData.bikeParts);
			}
		}
	}
}