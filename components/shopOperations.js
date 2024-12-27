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

function bikeBuildStep() {
	if (!canBuildBike()){
		return;
	}

	let timer = document.getElementById("player-build-timer");

	if (gameData.bikeBuildProgress >= gameData.mechanicBaseTimePerBike) {
		finishBike();
		timer.style.setProperty("--progress", '0%')
	}
	else {
		let partsPerInterval = gameData.partsPerBike / gameData.mechanicBaseTimePerBike;
		
		if (gameData.bikeParts < partsPerInterval) {
			gameData.bikeBuildProgress += (gameData.bikeParts / partsPerInterval);
			gameData.bikeParts = 0;
		}
		else {
			gameData.bikeBuildProgress += 1;
			gameData.bikeParts -= partsPerInterval;
		}

		let newProgressPercent = Math.min(Math.floor(100 * gameData.bikeBuildProgress / gameData.mechanicBaseTimePerBike), 100);
		timer.style.setProperty("--progress", `${newProgressPercent}%`);
		document.getElementById("bike-parts").innerHTML = Math.round(gameData.bikeParts);
	}
}

document.getElementById("build-bike").addEventListener("click", () => bikeBuildStep() );

let buildInterval;
document.getElementById("build-bike").addEventListener("mousedown", () => {
	buildInterval = window.setInterval( () => bikeBuildStep(), 100);
});

document.getElementById("build-bike").addEventListener("mouseup", () => {
	clearInterval(buildInterval);
});

document.getElementById("build-bike").addEventListener("mouseleave", () => {
	clearInterval(buildInterval);
});

function finishBike() {
	gameData.bikes += 1;
	document.getElementById("bikes-built").innerHTML = gameData.bikes;
	gameData.bikeBuildProgress = 0;
}

function canBuildBike() {
	return(gameData.bikeParts >= 0);
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
	document.getElementById("bike-parts").innerHTML = Math.round(gameData.bikeParts);
	document.getElementById("money").innerHTML = gameData.money.toLocaleString();

	document.getElementById('build-bike').disabled = !canBuildBike();
	document.getElementById('buy-bike-parts').disabled = !canBuyBikeParts();
	//This (and really any function that costs money) should also check
	//to disable any other thing that costs money
}

function canHireEmployee() {
	return(gameData.money >= gameData.employeeHiringCost
		&& (gameData.bikes > 0 
			|| gameData.bikeParts >= gameData.partsPerBike
			|| gameData.money > gameData.BikePartsBaseCost
			)
		);
}

function hireEmployee() {
	if (!canHireEmployee()) {
		return
	}
	
	gameData.money -= gameData.employeeHiringCost;
	gameData.employees += 1;

	if (gameData.employees == 1) {
		queueNewsTicker("Bike shop hires first employee");
		document.getElementById("employee-focus-slider").disabled = false;

	}

	document.getElementById("employees").innerHTML = gameData.employees;
	document.getElementById("money").innerHTML = gameData.money.toLocaleString();
	document.getElementById("hire-employee").disables = !canHireEmployee();

	let slider = document.getElementById("employee-focus-slider")
	let currentValue = slider.value;
	let ratio = slider.max / currentValue;
	slider.max = gameData.employees;
	slider.value = gameData.employees / ratio;
	document.getElementById("all-mech-tick").value = slider.max;
	changeEmployeeFocus(slider.value);
}

function changeEmployeeFocus(value) {
	gameData.mechanics = Math.min(value, gameData.employees);
	gameData.salesPeople = gameData.employees - value;
	document.getElementById("employee-focus-slider").title = `Sales: ${gameData.salesPeople} Mechanics: ${gameData.mechanics}`
	addNewMechanicTimer();
}