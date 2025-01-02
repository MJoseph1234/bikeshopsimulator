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

	currencyAnimation(`+$${gameData.bikeMSRP}`, button);
}

function sellBikeWithAccessories() {
	if (!canSellBike()) {
		return
	}

	let accessoriesSold = getRandomIntInclusive(0, Math.min(gameData.accessories, 20));
	let accessoryPrice = getRandomIntInclusive(1, 3) * accessoriesSold;
	let profit = gameData.bikeMSRP + accessoryPrice;
	
	gameData.bikes -= 1;
	gameData.bikesSold += 1;
	gameData.customers -= 1;
	gameData.money += profit;
	gameData.accessories -= accessoriesSold;
	gameData.salesRateData[0] += 1;

	document.getElementById("bikes-built").innerHTML = gameData.bikes;
	document.getElementById("bikes-sold").innerHTML = gameData.bikesSold.toLocaleString();
	document.getElementById("money").innerHTML = gameData.money.toLocaleString();
	document.getElementById("customers").innerHTML = gameData.customers;
	document.getElementById("accessories").innerHTML = gameData.accessories.toLocaleString();
	
	let button = document.getElementById('sell-bike');

	button.disabled = !canSellBike();

	currencyAnimation(`+$${profit}`, button);
}

let sellFunction = sellBike;

function salesShift() {
	if (!canSellBike() || gameData.salesPeople === 0) {
		return
	}
	for (let i = 0; i < gameData.salesPeople; i++) {
		var salesSuccess = getRandomIntInclusive(0, 100);
		if (salesSuccess < gameData.salesPersonSuccessRate) {
			sellFunction();
		}
	}
}


function canBuyAccessories() {
	return(gameData.money > gameData.accessoryCost)
}
function buyAccessories() {
	if (!canBuyAccessories()) {
		return;
	}
	gameData.money -= gameData.accessoryCost;
	gameData.accessories += gameData.accessoriesPerCase;
	document.getElementById("money").innerHTML = gameData.money.toLocaleString();
	document.getElementById("accessories").innerHTML = gameData.accessories.toLocaleString();
	document.getElementById("buy-accessories").disabled = !canBuyAccessories();
	currencyAnimation(`-$${gameData.accessoryCost}`, document.getElementById("buy-accessories"));
}
