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
	gameData.demand = 80;
	gameData.salesPersonSuccessRate = 80;
}