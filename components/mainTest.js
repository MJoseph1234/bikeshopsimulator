if (localStorage.getItem("bikeShopSimulatorSave") != null) {
	loadGame()
}

var gameLoop = window.setInterval(function() {
	//runs once per second
	gameData.timer += 1;
	checkTargets();
	salesShift();
	mechanicShift()
	updateCustomers();
	adjustBikePartsPrice();
	manageButtons();
	calculateBusinessAnalytics();
	updateActiveProjects();

	if (gameData.timer % 10 === 0) {
		saveGame();
	}
	if (gameData.timer % 20 === 0 ) {
		updateNewsTicker();
	}
}, 1000)

////////// domManager.js /////////

////////// gameState.js /////////

////////// newsTicker.js /////////

///////// shopOperations.js //////////

////////// salesStaff.js //////////

/////////// mechStaff.js ///////////

///////// shopProjects.js ///////////


