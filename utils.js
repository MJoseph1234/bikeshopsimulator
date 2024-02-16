//tools and helpers for debugging

function reset() {
	localStorage.removeItem("bikeShopSimulatorSave");
	location.reload();
}

function showHidden() {
	let ruleIndex = 3;
	document.styleSheets[0].deleteRule(ruleIndex);
	document.styleSheets[0].insertRule(".hidden { opacity: 0.33; disabled: true;}", ruleIndex);
}