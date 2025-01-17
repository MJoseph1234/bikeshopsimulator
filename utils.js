//tools and helpers for debugging

let reset = () => {
	localStorage.removeItem("bikeShopSimulatorSave");
	localStorage.removeItem("bikeShopSimulatorSaveTargets");
	location.reload();
}

function showHidden() {
	let ruleIndex = 3;
	document.styleSheets[0].deleteRule(ruleIndex);
	document.styleSheets[0].insertRule(".hidden { opacity: 0.33; disabled: true;}", ruleIndex);
}

let easy = () => {
	updateDemand(10);
	gameData.salesPersonSuccessRate = 80;
	gameData.mechanicBaseTimePerBike /= 10;
}