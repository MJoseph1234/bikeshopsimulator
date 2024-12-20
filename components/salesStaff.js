function canHireSales() {
	return(gameData.money >= gameData.salesPersonHiringCost && gameData.bikes > 0);
}
function hireSales() {
	if (!canHireSales()) {
		return
	}
	gameData.money -= gameData.salesPersonHiringCost;
	gameData.salesPeople += 1;

	if (gameData.salesPeople == 1) {
		queueNewsTicker("Bike Shop hires first sales person.");
	}

	document.getElementById("money").innerHTML = gameData.money.toLocaleString();
	document.getElementById("staff-sales").innerHTML = gameData.salesPeople;
	document.getElementById("hire-sales").disabled = !canHireSales();
}
function salesShift() {
	if (!canSellBike() || gameData.salesPeople === 0) {
		return
	}
	for (let i = 0; i < gameData.salesPeople; i++) {
		var salesSuccess = getRandomIntInclusinve(0, 100);
		if (salesSuccess < gameData.salesPersonSuccessRate) {
			sellBike();
		}
	}
}