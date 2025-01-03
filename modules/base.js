if (localStorage.getItem("bikeShopSimulatorSave") != null) {
	//loadGame();
}

var gameLoop = window.setInterval(function() {
	//runs 10 per second
	gameData.timer += 1;
	mechanicShift();

	// every second
	if (gameData.timer % 10 === 0) {
		checkTargets();
		updateCustomers();
		adjustBikePartsPrice();
		manageButtons();
		calculateBusinessAnalytics();
		updateActiveProjects();
		salesShift();
	}

	// every 10 seconds
	if (gameData.timer % 100 === 0) {
		//saveGame();
	}

	// every 20 seconds
	if (gameData.timer % 200 === 0 ) {
		updateNewsTicker();
	}
}, 100)

////////// dom-utils.js /////////

////////// save-and-load.js /////////

////////// news-ticker.js /////////

///////// business-ops.js //////////

////////// sales-department.js //////////

/////////// service-department.js ///////////

///////// project-manager.js ///////////


