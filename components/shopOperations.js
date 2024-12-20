function checkTargets() {
	targets.forEach(target => {
		if (target.trigger() && !(target.done)) {
			target.done = true;
			target.effect();
			console.log(target.title + ": Done!")
		}
	})
}

function updateCustomers() {
	if (getRandomIntInclusinve(0, 100) <= gameData.demand) {
		gameData.customers += 1
	}
	else {
		gameData.customers = Math.max(gameData.customers - 1, 0);
	}
	document.getElementById("customers").innerHTML = gameData.customers;
}

function calculateBusinessAnalytics() {
	if (gameData.timer % 60 === 0) {
		gameData.salesRateData.unshift(0);
		if (gameData.salesRateData.length > 5) {
			gameData.salesRateData.pop();
		}
		gameData.salesPerMinuteAverage = Math.round(gameData.salesRateData.reduce((partialSum, datum) => partialSum + datum, 0) / gameData.salesRateData.length);
		// console.log("Sales Rate: " + gameData.salesPerMinuteAverage + " bikes per minute (averaged over last " + gameData.salesRateData.length + " minutes)");
	}
}

function getRandomIntInclusinve(min, max) {
	min = Math.floor(min)
	max = Math.ceil(max)
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function canBuildBike() {
	return(gameData.bikeParts >= gameData.partsPerBike);
}
function buildBike() {
	if (!canBuildBike()) {
		return
	}
	gameData.bikes += 1;
	gameData.bikeParts -= gameData.partsPerBike;
	document.getElementById("bikes-built").innerHTML = gameData.bikes;
	document.getElementById("bike-parts").innerHTML = gameData.bikeParts;
	document.getElementById("build-bike").disabled = !canBuildBike();
}

function adjustBikePartsPrice() {
	if (gameData.timer / 250 > 0 && gameData.bikePartsBaseCost > 100){
		gameData.bikePartsBaseCost = gameData.bikePartsBaseCost - (gameData.bikePartsBaseCost/100);
	}
	if (Math.random() < gameData.bikePartsPriceAdjustChance) {
		var partsAdjust = 25*(Math.sin(gameData.timer));
		gameData.bikePartsCost = Math.ceil(gameData.bikePartsBaseCost + partsAdjust);
		document.getElementById("parts-cost").innerHTML = gameData.bikePartsCost.toLocaleString();
		document.getElementById("buy-bike-parts").disabled = !canBuyBikeParts();
	}
}
function canSellBike() {
	return(gameData.bikes > 0 && gameData.customers > 0);
}
function sellBike() {
	if (!canSellBike()){
		return
	}
	gameData.bikes -= 1;
	gameData.bikesSold += 1;
	//gameData.money += Math.ceil(gameData.bikeMSRP / (1 + gameData.salesPeople + gameData.mechanics));
	gameData.money += gameData.bikeMSRP;
	gameData.customers -= 1;
	gameData.salesRateData[0] += 1;
	document.getElementById("bikes-built").innerHTML = gameData.bikes;
	document.getElementById("bikes-sold").innerHTML = gameData.bikesSold;
	document.getElementById("money").innerHTML = gameData.money.toLocaleString();
	document.getElementById("customers").innerHTML = gameData.customers;

	document.getElementById('sell-bike').disabled = !canSellBike();
}

function canBuyBikeParts(){
	return(gameData.money >= gameData.bikePartsCost);
}

function buyBikeParts() {
	if (!canBuyBikeParts()) {
		return
	}
	gameData.bikePartsBaseCost += 10;
	gameData.bikePartsPurchases += 1;
	gameData.money -= gameData.bikePartsCost;
	gameData.bikeParts += gameData.bikePartsPerBuy;
	document.getElementById("bike-parts").innerHTML = gameData.bikeParts;
	document.getElementById("money").innerHTML = gameData.money.toLocaleString();

	document.getElementById('build-bike').disabled = !canBuildBike();
	document.getElementById('buy-bike-parts').disabled = !canBuyBikeParts();
	//This (and really any function that costs money) should also check
	//to disable any other thing that costs money
}