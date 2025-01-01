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
	if (getRandomIntInclusive(0, 100) <= gameData.demand) {
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

function getRandomIntInclusive(min, max) {
	min = Math.floor(min)
	max = Math.ceil(max)
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function adjustBikePartsPrice() {
	if (gameData.timer / 2500 > 0 && gameData.bikePartsBaseCost > 100){
		gameData.bikePartsBaseCost = gameData.bikePartsBaseCost - (gameData.bikePartsBaseCost/100);
	}
	if (Math.random() < gameData.bikePartsPriceAdjustChance) {
		var partsAdjust = 25*(Math.sin(gameData.timer));
		gameData.bikePartsCost = Math.ceil(gameData.bikePartsBaseCost + partsAdjust);
		document.getElementById("parts-cost").innerHTML = gameData.bikePartsCost.toLocaleString();
		document.getElementById("buy-bike-parts").disabled = !canBuyBikeParts();
	}
}

function currencyAnimation(textValue = "+$100", fromElem) {
	let newDiv = document.createElement("div");
	let newContent = document.createTextNode(textValue);
	let buttonPos = fromElem.getBoundingClientRect();

	// calculate the direction this will move
	let rads = getRandomIntInclusive(30, 60) * Math.PI / 180;
	let hyp = 40;

	let transX = Math.cos(rads) * hyp;
	let transY = Math.sin(rads) * hyp;

	// style the div
	newDiv.style.position = "absolute";
	newDiv.style.left = buttonPos.right + "px";
	newDiv.style.userSelect = "none";

	if (textValue[0] == "+") {
		newDiv.style.color = "green";
		transY *= -1;
	} else {
		newDiv.style.color = "red";
		newDiv.style.top = buttonPos.bottom + "px";
	}

	// define the animation
	const timing = {
		duration: 3000,
		iterations: 1,
		easing: "ease-out"
	};
	const keyframes = [
		{ transform: "translate(0, 0)", opacity: 1},
		{ transform: `translate(${transX}px, ${transY}px)`, opacity: 0}
	];

	newDiv.animate(keyframes, timing);

	// add the div next to the element it's emitted from
	newDiv.appendChild(newContent);
	fromElem.parentNode.insertBefore(newDiv, fromElem);

	// remove the element after the animation
	window.setTimeout( () => { fromElem.parentNode.removeChild(newDiv) }, 2900)
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

	currencyAnimation(`-$${gameData.bikePartsCost}`, document.getElementById("buy-bike-parts"));
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

	currencyAnimation("-$1000", document.getElementById("hire-employee"));

}

function changeEmployeeFocus(value) {
	gameData.mechanics = Math.min(value, gameData.employees);
	gameData.salesPeople = gameData.employees - value;
	document.getElementById("employee-focus-slider").title = `Sales: ${gameData.salesPeople} Mechanics: ${gameData.mechanics}`
	addNewMechanicTimer();
}