function refreshCounters() {
	document.getElementById("bikes-sold").innerHTML = gameData.bikesSold.toLocaleString();
	document.getElementById("bikes-built").innerHTML = gameData.bikes;
	document.getElementById("bike-parts").innerHTML = gameData.bikeParts;
	document.getElementById("parts-cost").innerHTML = gameData.bikePartsCost.toLocaleString();
	document.getElementById("customers").innerHTML = gameData.customers;
	document.getElementById("money").innerHTML = gameData.money.toLocaleString();
	document.getElementById("employees").innerHTML = gameData.employees;
}

/**
 * check all buttons to update weather they should be disabled or not
 */
function manageButtons() {
	document.getElementById("sell-bike").disabled = !canSellBike();
	document.getElementById("build-bike").disabled = !canBuildBike();
	document.getElementById("buy-bike-parts").disabled = !canBuyBikeParts();
	document.getElementById("hire-employee").disabled = !canHireEmployee();
	document.getElementById("buy-accessories").disabled = !canBuyAccessories();
}

/**
 * Make an element (and its contents) blink between visible and hidden
 * before ultimately settling on visible. This is used to draw attention to
 * a new component on the screen when it first shows up.
 * 
 * @param {HTMLElement} element - the DOM element to blink
 */
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

/**
 * Display a little animation of some text value floating away, like dollar
 * signs floating away from a button that spent some in-game money
 * 
 * @param {string} textValue - the floating text to float away. 
 * 	   If it starts with a +, the animation will be green and float upward. 
 *     Otherwise it will be red and float down.
 * @param {HTMLElement} fromElem - the element to start the animation from
 */
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