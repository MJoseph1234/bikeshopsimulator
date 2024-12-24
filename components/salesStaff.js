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