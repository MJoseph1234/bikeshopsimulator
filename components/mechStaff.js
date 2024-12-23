function mechanicShift() {
	if (gameData.mechanics <= 0) {
		return
	}

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
			var mechsOnTimer = Math.floor(gameData.mechanics/3) + (gameData.mechanics%3>=i);

			// if there's not enough parts for ALL the mechanics on that timer,
			// skip the timer, it should not move.
			if (gameData.bikeParts < (mechsOnTimer * gameData.partsPerBike)) {
				continue;
			}

			const timer = document.getElementById(`mech-${i}-timer`);
			let progValue = Math.min(Math.floor(100 * gameData.mechanicTimers[i-1] / gameData.mechanicBaseTimePerBike), 100);

			if (progValue >= 100) {
				for (let j = 0; j < mechsOnTimer; j++) {
					buildBike();
					timer.style.setProperty('--progress', '0%');
				}
				gameData.mechanicTimers[i-1] = 0;
			}
			else {
				gameData.mechanicTimers[i-1] += 1;
				let progValue = Math.min(Math.floor(100 * gameData.mechanicTimers[i-1] / gameData.mechanicBaseTimePerBike), 100);
				timer.style.setProperty('--progress', `${progValue}%`);
			}
		}
	}
}