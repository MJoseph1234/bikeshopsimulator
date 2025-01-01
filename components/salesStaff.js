function canSellBike() {
	return(gameData.bikes > 0 && gameData.customers > 0);
}
function sellBike() {
	if (!canSellBike()) {
		return
	}
	gameData.bikes -= 1;
	gameData.bikesSold += 1;
	gameData.money += gameData.bikeMSRP;
	gameData.customers -= 1;
	gameData.salesRateData[0] += 1;
	document.getElementById("bikes-built").innerHTML = gameData.bikes;
	document.getElementById("bikes-sold").innerHTML = gameData.bikesSold;
	document.getElementById("money").innerHTML = gameData.money.toLocaleString();
	document.getElementById("customers").innerHTML = gameData.customers;
	
	let button = document.getElementById('sell-bike');

	button.disabled = !canSellBike();

	currencyAnimation("+$100", button);
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