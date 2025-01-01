function refreshCounters() {
	document.getElementById("bikes-sold").innerHTML = gameData.bikesSold.toLocaleString();
	document.getElementById("bikes-built").innerHTML = gameData.bikes;
	document.getElementById("bike-parts").innerHTML = gameData.bikeParts;
	document.getElementById("parts-cost").innerHTML = gameData.bikePartsCost.toLocaleString();
	document.getElementById("customers").innerHTML = gameData.customers;
	document.getElementById("money").innerHTML = gameData.money.toLocaleString();
	document.getElementById("employees").innerHTML = gameData.employees;
}

function manageButtons() {
	document.getElementById("sell-bike").disabled = !canSellBike();
	document.getElementById("build-bike").disabled = !canBuildBike();
	document.getElementById("buy-bike-parts").disabled = !canBuyBikeParts();
	document.getElementById("hire-employee").disabled = !canHireEmployee();
	document.getElementById("buy-accessories").disabled = !canBuyAccessories();
}

function blinkAppear(element) {
	var blinkCount = 0;

	{
		var handle = setInterval( () => toggleVisibility(element), 30);
	}

	function toggleVisibility(element) {
		blinkCount += 1;

		if (blinkCount >= 12) {
			clearInterval(handle);
			element.style.visibility = "visible";
		} else {
			let isHidden = (element.style.visibility == "hidden");
			if (isHidden) {
				element.style.visibility = "visible";
			} else {
				element.style.visibility = "hidden";
			}
		}
	}
}