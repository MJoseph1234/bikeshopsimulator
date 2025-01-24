function saveGame() {
	let targetsMet = [];
	for (let i=0; i < targets.length; i++) {
		targetsMet[i] = targets[i].done;
	}
	gameData.projectStatuses = [];
	for (let i=0; i < projects.length; i++){
		gameData.projectStatuses.push(projects[i].status)
	}
	localStorage.setItem("bikeShopSimulatorSave", JSON.stringify(gameData));
	localStorage.setItem("bikeShopSimulatorSaveTargets", JSON.stringify(targetsMet));
}

function loadGame() {
	let savedGame = JSON.parse(localStorage.getItem("bikeShopSimulatorSave"));
	let savedTargets = JSON.parse(localStorage.getItem("bikeShopSimulatorSaveTargets"));
	if (savedGame != null) {
		gameData = savedGame;
	}
	if (savedTargets != null){
		for (let i=0; i < savedTargets.length; i++) {
			if (savedTargets[i].done) {
				targets[i].done = true;
				target.effect();
			}
		}
	}
	for (let i=0; i < gameData.projectStatuses.length; i++){
		projects[i].status = gameData.projectStatuses[i];
	}
	refreshCounters();
	refreshProjectDOM();
}