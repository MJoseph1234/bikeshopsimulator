if (localStorage.getItem("bikeShopSimulatorSave") != null) {
	//loadGame();
}

const gameLoop = window.setInterval(function() {
	//runs 10 per second
	gameData.timer += 1;
	mechanicShift();
	salesShift();

	// every second
	if (gameData.timer % 10 === 0) {
		checkTargets();
		adjustBikePartsPrice();
		manageButtons();
		calculateBusinessAnalytics();
		updateActiveProjects();
		eventStep();
		
	}

	// every 2 seconds
	if (gameData.timer % 20 === 0) {
		updateCustomers();
	}

	// every 10 seconds
	if (gameData.timer % 100 === 0) {
		//saveGame();
	}

	// every 20 seconds
	if (gameData.timer % 200 === 0 ) {
		updateNewsTicker();
	}
}, 100)

////////// dom-utils.js /////////
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
 * Removes the .hidden css class from the element
 * 
 * @param {HTMLElement} element - the DOM element to blink
 */
function blinkAppear(element) {
	let blinkCount = 0;
	element.classList.remove("hidden");

	const handle = setInterval( () => toggleVisibility(element), 30);

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

////////// save-and-load.js /////////
function saveGame() {
	let targetsMet = [];
	for (let i=0; i < targets.length; i++) {
		targetsMet[i] = targets[i].done;
	}
	gameData.projectStatuses = [];
	for (let i=0; i < projects.length; i++){
		gameData.projectStatuses.push(projects[i].status)
	}
	localStorage.setItem("bikeShopSimulatorSave", JSON.stringify(gameData));
	localStorage.setItem("bikeShopSimulatorSaveTargets", JSON.stringify(targetsMet));
}

function loadGame() {
	let savedGame = JSON.parse(localStorage.getItem("bikeShopSimulatorSave"));
	let savedTargets = JSON.parse(localStorage.getItem("bikeShopSimulatorSaveTargets"));
	if (savedGame != null) {
		gameData = savedGame;
	}
	if (savedTargets != null){
		for (let i=0; i < savedTargets.length; i++) {
			if (savedTargets[i].done) {
				targets[i].done = true;
				target.effect();
			}
		}
	}
	for (let i=0; i < gameData.projectStatuses.length; i++){
		projects[i].status = gameData.projectStatuses[i];
	}
	refreshCounters();
	refreshProjectDOM();
}

////////// news-ticker.js /////////
function queueNewsTicker(headline, link = ""){
	gameData.newsTickerNext.push([headline, link]);
}

function updateNewsTicker(minTime = 1000) {

	// Get the next queued news, if there is one
	let newsEntry;
	if (gameData.newsTickerNext.length >= 1) {
		next = gameData.newsTickerNext.shift();
	}
	// otherwise, if enough time has passed, grab a random one from the list
	else if (gameData.timer - gameData.newsTickerTimeAtLastUpdate > minTime) {
		newsEntry = Math.floor(Math.random()*news.length);
		next = news[newsEntry];
	}
	else {
		return;
	}
	
	let text = next[0];
	let tickerHTML;
	if (next.length == 1 || next[1] == "") {
		tickerHTML = text;
	} else {
		tickerHTML = `<a href="${next[1]}" target="_blank">${text} </a><sup>[<a href="${next[1]}">${newsEntry}</a>]</sup>`
	}
	gameData.newsTickerTimeAtLastUpdate = gameData.timer;
	gameData.NewsTickerText = tickerHTML;
	document.getElementById("tickerText").innerHTML = tickerHTML;
}

let news = [
	["Research Shows Bikes are Good For You", "https://www.betterhealth.vic.gov.au/health/healthyliving/cycling-health-benefits"],
	["Study Suggests Bikes are Faster for Inner City Delivery", "https://www.larryvsharry.com/media/wysiwyg/cms_pages/Stories/Last_Mile_Delivery/Data-driven_Evaluation_of_Cargo_Bike_Delivery_Performance_in_Brussels.pdf"],
	["Urbanists: E-bikes are Fastest Way to the Airport", "https://www.wsj.com/lifestyle/travel/airport-race-new-york-chicago-los-angeles-67a2acbf"],
	["Study: New Bike Lanes Lead to Higher Restaurant Sales", "https://prismic-io.s3.amazonaws.com/peopleforbikes/54999b6d-3cb6-484a-863a-955d5d71a02e_National-Street-Improvements-Study-Summary.pdf"],
	["Middle School Bicycle Program Helps Student Mental Health", "https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2023.1255514/full"],
	["Doctors Say Biking To Work Makes You Die Less", "https://www.bmj.com/content/357/bmj.j1456"],
	["Experts: Kids Who Bike To School Are Smarter ", "https://jamanetwork.com/journals/jamapediatrics/fullarticle/384475"],
	
	["Scientists Discover You Should Bike More", ""],
	["Researchers Find No Connection Between Bicycles and Bigfoot Sightings", ""],
	["Opinion: Patriots Say More Bikes = More Freedom", ""],
	["High Schoolers Build Sweet Bicycle Jump Over Local Stream", ""],
	["Advocates Call for More Bike Paths", ""],
	["Cyclist Breaks Sprint Speed Record During Dog Chase", ""],
	["City Police: No Parking Tickets Issued to Bicycles in Past Year", ""],
	["Scientists: Does Citrus Work As Bicycle Chain Lube? No.", ""],
	["Local Cycling Groups Looking for Members In Your Area", ""],
	["Lone Cyclist On Tandem Wins Local Race", ""],
	["Report: Cyclist Does Sick Wheelie Outside Headline Writer's House", ""],
]

///////// business-ops.js //////////
function checkTargets() {
	targets
		.filter((target) => !target.done) // skip already-done projects
		.filter((target) => target.trigger()) // skip un-met targets
		.forEach(target => {
			target.done = true;
			target.effect();
			console.log(`Target ${target.title}: Done!`);
		})
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
		const partsAdjust = 25*(Math.sin(gameData.timer));
		gameData.bikePartsCost = Math.ceil(gameData.bikePartsBaseCost + partsAdjust);
		document.getElementById("parts-cost").innerHTML = gameData.bikePartsCost.toLocaleString();
		document.getElementById("buy-bike-parts").disabled = !canBuyBikeParts();
	}
}

function canBuyBikeParts() {
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

	const buyButton = document.getElementById('buy-bike-parts');
	buyButton.disabled = !canBuyBikeParts();
	currencyAnimation(`-$${gameData.bikePartsCost}`, buyButton);
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
	document.getElementById("hire-employee").disabled = !canHireEmployee();

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

////////// sales-department.js //////////
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
		if (Math.random() < gameData.salesPersonSuccessRate) {
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

/////////// service-department.js ///////////
function canBuildBike() {
	return(gameData.bikeParts >= 0);
}

function finishBike() {
	gameData.bikes += 1;
	document.getElementById("bikes-built").innerHTML = gameData.bikes;
	gameData.bikeBuildProgress = 0;
}

function bikeBuildStep(event) {
	//console.log(event);
	if ( !canBuildBike() ) {
		return;
	}

	let buildTime = gameData.mechanicBaseTimePerBike / 10;

	let timer = document.getElementById("player-build-timer");

	if ( gameData.bikeBuildProgress >= buildTime ) {
		finishBike();
		timer.style.setProperty("--progress", '0%')
	}
	else {
		let partsPerInterval = gameData.partsPerBike / buildTime;
		
		if ( gameData.bikeParts < partsPerInterval ) {
			gameData.bikeBuildProgress += (gameData.bikeParts / partsPerInterval);
			gameData.bikeParts = 0;
		}
		else {
			gameData.bikeBuildProgress += 1;
			gameData.bikeParts -= partsPerInterval;
		}

		let newProgressPercent = Math.min(Math.floor(100 * gameData.bikeBuildProgress / buildTime), 100);
		timer.style.setProperty("--progress", `${newProgressPercent}%`);
		document.getElementById("bike-parts").innerHTML = Math.round(gameData.bikeParts);
	}
}

document.getElementById("build-bike").addEventListener("click", (event) => bikeBuildStep(event));

let buildInterval;
document.getElementById("build-bike").addEventListener("mousedown", (event) => {
	buildInterval = window.setInterval( () => bikeBuildStep(event), 100);
});

document.getElementById("build-bike").addEventListener("mouseup", () => {
	clearInterval(buildInterval);
});

document.getElementById("build-bike").addEventListener("mouseleave", () => {
	clearInterval(buildInterval);
});

/**
 * Loop through each mechanic and update their build progress
 */
function mechanicShift() {
	if ( gameData.mechanics <= 0 ) {
		return
	}

	let partsPerInterval = gameData.partsPerBike / gameData.mechanicBaseTimePerBike;
	let timersToUpdate = Math.min(gameData.mechanics, gameData.mechanicTimers.length);

	for (let i = 0; i < timersToUpdate; i++) {

		if ( !canBuildBike() ) {
			return;
		}

		const timer = document.getElementById(`mech-${i + 1}-timer`);
		const mechsOnTimer = Math.floor(gameData.mechanics / 3) + ((gameData.mechanics % 3) > i);

		if (gameData.mechanicTimers[i] >= gameData.mechanicBaseTimePerBike) {
			gameData.bikes += mechsOnTimer;
			document.getElementById("bikes-built").innerHTML = gameData.bikes;
			gameData.mechanicTimers[i] = 0;
			timer.style.setProperty("--progress", '0%')
		}
		else {
			// if there's not enough parts for ALL the mechanics on that timer,
			// only progress a fractional amount
			if ( gameData.bikeParts < (mechsOnTimer * partsPerInterval) ) {
				gameData.mechanicTimers[i] += (gameData.bikeParts / (mechsOnTimer * partsPerInterval))
				gameData.bikeParts = 0;
			}
			else {
				gameData.mechanicTimers[i] += 1;
				gameData.bikeParts -= (mechsOnTimer * partsPerInterval);
			}

			let newProgressValue = Math.min(Math.floor(100 * gameData.mechanicTimers[i] / gameData.mechanicBaseTimePerBike), 100);
			timer.style.setProperty('--progress', `${newProgressValue}%`);
			document.getElementById("bike-parts").innerHTML = Math.round(gameData.bikeParts);
		}
	}
}

/**
 * Check if we need to display a new mechanic timer bar (up to 3)
 * and if so, display it and initialize it to zero percent
 */
function addNewMechanicTimer() {

	let currentTimers = gameData.mechanicTimers.length
	let newTimers = Math.min(gameData.mechanics, 3);

	for (let i = currentTimers; i < newTimers; i++) {

		const timer = document.getElementById(`mech-${i + 1}-timer`);
		const prog = document.getElementById(`mech-${i + 1}-progress`);
		timer.style.setProperty("--progress", `0%`);
		timer.classList.remove("hidden");
		prog.classList.remove("hidden");
		gameData.mechanicTimers.push(0);
	}

	for (let i = 0; i < gameData.mechanicTimers.length; i++) {
		const timer = document.getElementById(`mech-${i + 1}-timer`);
		const multiplierLabel = timer.getElementsByClassName("build-multiplier")[0];
		const mechsOnTimer = Math.floor(gameData.mechanics / 3) + ((gameData.mechanics % 3) > i);
		if (mechsOnTimer > 1) {
			multiplierLabel.classList.remove("hidden");
		}
		multiplierLabel.innerText = `×${mechsOnTimer}`;
	}
}

///////// project-manager.js ///////////
/**
 * Display the given project in the specified spot
 * 
 * @param {projects.project} project - an object from the projects list
 * @param {number} position - the position (0, 1, 2, 3 or 4) in the project DOM 
 * 		to display this project
 */
function displayProject(project, position) {
	projectElem = document.getElementById("p" + position);
	projectElem.classList.toggle("disabled", !project.canAfford());
	projectElem.getElementsByClassName("project-title")[0].innerHTML = project.title;
	projectElem.getElementsByClassName("project-cost")[0].innerHTML = "(" + project.costStr + ")";
	projectElem.getElementsByClassName("project-description")[0].innerHTML = project.effectDescription;
	projectElem.classList.remove("hidden");
	
	projectElem.onclick = function() {
		if (!project.canAfford()) {return;}
		project.effect();
		project.status = projectStatus.DONE;
		projectElem.classList.toggle("hidden");
		refreshProjectDOM();
		console.log(project.title + ": Done");
	};
}

/**
 * Update the projects interface component to remove any finished projects and
 * hide unused project containers
 */
function refreshProjectDOM() {
	// get the list of active projects
	let active = projects.filter((project) => project.status == projectStatus.ACTIVE);
	
	for (let i = 0; i < 5; i++) {
		if (i < active.length) {
			displayProject(active[i], i);
		}
		else {
			projectElem = document.getElementById("p" + i);
			projectElem.getElementsByClassName("project-title")[0].innerHTML = "";
			projectElem.getElementsByClassName("project-cost")[0].innerHTML = "";
			projectElem.getElementsByClassName("project-description")[0].innerHTML = "";
			projectElem.onclick = null;
			projectElem.classList.toggle("hidden", true);
		}
	}
}

/**
 * If there's fewer than five active projects, add more from the list of
 * available/queued projects. For each active project, check if it can be
 * purchased or not and update the dom accordingly.
 */
function updateActiveProjects() {
	let active = projects.filter((project) => project.status == projectStatus.ACTIVE);
	let available = projects.filter((project) => project.status == projectStatus.AVAILABLE);
	
	while (active.length < 5 && available.length > 0) {
		prj = available.shift();
		prj.status = projectStatus.ACTIVE;
		active.push(prj);
		displayProject(prj, active.length - 1);
	} 
	for (let i = 0; i < active.length; i++) {
		projectElem = document.getElementById("p" + i);
		projectElem.classList.toggle("disabled", !active[i].canAfford());
	}
}

///////// customers.js /////////

/**
 * Get the poisson probability of k events happening when
 * there's an average of lambda events per step
 */
function poisson(lambda, k){
	return (lambda ** k) * (Math.E ** (-lambda)) / factorial(k)
}

/**
 * calculate the factorial of int n
 */
function factorial(n) {
	let ret = 1;
	for (let i = 2; i <= n; i++) {
		ret *= i;
	}
	return(ret)
}

/**
 * Get an array representing the cumulative distribution function values
 * for a poisson distribution from 0 to lambda+10
 */
function poissonCDF(lambda) {
	const max = lambda + 10;
	let p = [poisson(lambda, 0)];

	for(let i = 1; i <= max; i ++) {
		p.push(poisson(lambda, i) + p[i - 1]);
	}
	return(p);
}

/**
 * get the position/index from a sorted array after which the value would
 * be inserted. All entries up to this position are less than value, and all 
 * entries after this position are greater than value
 */
function bisectLeft(array, value, lo = 0, hi = array.length) {
	while (lo < hi) {
		const mid = (lo + hi) >> 1; // right shift by 1 to get division by 2
		if (array[mid] < value) {
			lo = mid + 1;
		} else {
			hi = mid;
		}
	}
	return lo;
}

let customerCDF = poissonCDF(gameData.demand);

/**
 * change the customer demand and update the cumulative
 * distribution array
 */
function updateDemand(newDemand) {
	//gameData.demand = newDemand;
	customerCDF = poissonCDF(gameData.demand);
}

/**
 * Update the number of customers in the store based on a poisson
 * distribution of customer arrival probability
 */
function updateCustomers() {
	const roll = Math.random();
	gameData.customers = bisectLeft(customerCDF, roll);

	document.getElementById("customers").innerHTML = gameData.customers;
	document.getElementById("sell-bike").disabled = !canSellBike();

}


///////// community-events.js /////////
function startEvent(eventTag) {
	if (gameData.currentEvent) {
		// should not be able to start an event while another one is in progress
		throw new Error(`error starting ${eventTag} because ${gameData.currentEvent} in progress`)
		//console.log(`error starting ${eventTag} because ${gameData.currentEvent} in progress`)
		return;
	}

	gameData.currentEvent = eventTag
	const event = events[eventTag]
	const timer = document.getElementById("event-timer");
	
	document.getElementById("launch-event").disabled = true;
	document.getElementById("help-event").disabled = false;

	document.getElementById("next-event-name").innerText = event.name;
	gameData.eventTimer = event.time;
	timer.style.setProperty("--progress", '0%')
}

function eventStep() {
	
	if (!gameData.currentEvent) {
		// throw new Error("cannot event step because there's no current event")
		// make help-event disabled
		return;
	}

	const increment = gameData.eventIncrements;
	const timer = document.getElementById("event-timer");
	const event = events[gameData.currentEvent];
	const label = document.getElementById('event-progress-label');

	if ( gameData.eventTimer <= 0 ) {
		timer.style.setProperty("--progress", '100%')
		gameData.eventTimer = 0;
		label.innerText = "Ready to Launch!";
		document.getElementById("help-event").disabled = true;
		document.getElementById("launch-event").disabled = false;
		return;
	}

	gameData.eventTimer -= increment;
	let progressPercent = Math.min(100 * (event.time - gameData.eventTimer)/event.time, 100)
	timer.style.setProperty("--progress", `${progressPercent}%`);
	label.innerText = `${gameData.eventTimer}/${event.time} (Advertising)`;
}

function launchEvent() {
	if ( !gameData.currentEvent ) {
		//cant launch an event if there's no current event running
		throw new Error("error launching event because current event is null");
		//console.log("error launching event because current event is null")
		return;
	}

	const event = events[gameData.currentEvent];

	if ( gameData.eventTimer > 0 ) {
		return;
	}

	// can't lunch event if it's not done


	const timer = document.getElementById("event-timer");
	const label = document.getElementById('event-progress-label');

	document.getElementById("launch-event").disabled = true;
	document.getElementById("help-event").disabled = true;

	document.getElementById("next-event-name").innerText = "";
	timer.style.setProperty("--progress", '0%')
	gameData.eventTimer = 0;
	gameData.currentEvent = null;
	label.innerText = "";
	event.effect();
	event.done = true;
}

events = {
	groupRide: {
		name: "Group Ride",
		time: 1000,
		done: false,
		effect: function() {
			gameData.communityPoints += 20
			document.getElementById("engagement-pts").innerText = `${gameData.communityPoints}/${gameData.communityPointsMax}`
		}
	}
}

