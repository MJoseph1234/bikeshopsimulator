if (localStorage.getItem("bikeShopSimulatorSave") != null) {
	//loadGame();
}

var gameLoop = window.setInterval(function() {
	//runs 10 per second
	gameData.timer += 1;
	mechanicShift();

	// every second
	if (gameData.timer % 10 === 0) {
		checkTargets();
		updateCustomers();
		adjustBikePartsPrice();
		manageButtons();
		calculateBusinessAnalytics();
		updateActiveProjects();
		salesShift();
	}

	// every 10 seconds
	if (gameData.timer % 100 === 0) {
		saveGame();
	}

	// every 20 seconds
	if (gameData.timer % 200 === 0 ) {
		updateNewsTicker();
	}
}, 100)

////////// domManager.js /////////
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
////////// gameState.js /////////
function saveGame() {
	var targetsMet = [];
	for (var i=0; i < targets.length; i++) {
		targetsMet[i] = targets[i].done;
	}
	gameData.projectStatuses = [];
	for (var i=0; i < projects.length; i++){
		gameData.projectStatuses.push(projects[i].status)
	}
	localStorage.setItem("bikeShopSimulatorSave", JSON.stringify(gameData));
	localStorage.setItem("bikeShopSimulatorSaveTargets", JSON.stringify(targetsMet));
}

function loadGame() {
	var savedGame = JSON.parse(localStorage.getItem("bikeShopSimulatorSave"));
	var savedTargets = JSON.parse(localStorage.getItem("bikeShopSimulatorSaveTargets"));
	if (savedGame != null) {
		gameData = savedGame;
	}
	if (savedTargets != null){
		for (var i=0; i < savedTargets.length; i++) {
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
////////// newsTicker.js /////////
function queueNewsTicker(headline, link = ""){
	gameData.newsTickerNext.push([headline, link]);
}

function updateNewsTicker() {

	// Get the next queued news, if there is one
	let newsEntry;
	if (gameData.newsTickerNext.length >= 1) {
		next = gameData.newsTickerNext.shift();
	}
	// otherwise, if enough time has passed, grab a random one from the list
	else if (gameData.timer - gameData.newsTickerTimeAtLastUpdate > 1000) {
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

var news = [
	["Advocates Call for More Bike Paths", ""],
	["Research Shows Bikes are Good For You", "https://www.betterhealth.vic.gov.au/health/healthyliving/cycling-health-benefits"],
	["Study Suggests Bikes are Faster for Inner City Delivery", "https://www.larryvsharry.com/media/wysiwyg/cms_pages/Stories/Last_Mile_Delivery/Data-driven_Evaluation_of_Cargo_Bike_Delivery_Performance_in_Brussels.pdf"],
	["Scientists Discover You Should Bike More", ""],
	["Researchers find no connection between bicycles and bigfoot sightings", ""],
	["Opinion: Patriots Say More Bikes = More Freedom", ""],
	["Urbanists: E-bikes are fastest way to the airport", "https://www.wsj.com/lifestyle/travel/airport-race-new-york-chicago-los-angeles-67a2acbf"],
]
///////// shopOperations.js //////////
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

	let buildTime = gameData.mechanicBaseTimePerBike / 10;

	let timer = document.getElementById("player-build-timer");

	if (gameData.bikeBuildProgress >= buildTime) {
		finishBike();
		timer.style.setProperty("--progress", '0%')
	}
	else {
		let partsPerInterval = gameData.partsPerBike / buildTime;
		
		if (gameData.bikeParts < partsPerInterval) {
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

function currencyAnimation(textValue = "+$100", fromElem) {
	let newDiv = document.createElement("div");
	let newContent = document.createTextNode(textValue);
	let buttonPos = fromElem.getBoundingClientRect();

	// calculate the direction this will move
	let rads = getRandomIntInclusinve(30, 60) * Math.PI / 180;
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
////////// salesStaff.js //////////
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
/////////// mechStaff.js ///////////
/**
 * Loop through each mechanic and update their build progress
 */
function mechanicShift() {
	if (gameData.mechanics <= 0) {
		return
	}

	let partsPerInterval = gameData.partsPerBike / gameData.mechanicBaseTimePerBike;
	let timersToUpdate = Math.min(gameData.mechanics, gameData.mechanicTimers.length);

	for (let i = 0; i < timersToUpdate; i++) {

		if (!canBuildBike()) {
			continue;
		}

		const timer = document.getElementById(`mech-${i + 1}-timer`);
		var mechsOnTimer = Math.floor(gameData.mechanics / 3) + ((gameData.mechanics % 3) > i);

		if (gameData.mechanicTimers[i] >= gameData.mechanicBaseTimePerBike) {
			gameData.bikes += mechsOnTimer;
			document.getElementById("bikes-built").innerHTML = gameData.bikes;
			gameData.mechanicTimers[i] = 0;
			timer.style.setProperty("--progress", '0%')
		}
		else {
			// if there's not enough parts for ALL the mechanics on that timer,
			// only progress a fractional amount
			if (gameData.bikeParts < (mechsOnTimer * partsPerInterval)) {
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
}
///////// shopProjects.js ///////////

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
 * Get the list of projects with a given status
 * 
 * @param {projectStatus.<status>} status - a project status from the projectStatus const in projects.js
 * 
 * @returns {Array.<number>} a list of numbers that are indexes into the projects list
 */
function listProjectsWithStatus(status) {
	var projectList = [];

	projects.forEach((project) => {
		if (project.status == status) {
			projectList.push(project);
		}
	});
	return projectList;
}

/**
 * Update the projects interface component to remove any finished projects and
 * hide unused project containers
 */
function refreshProjectDOM() {
	var active = listProjectsWithStatus(projectStatus.ACTIVE);
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
	var active = listProjectsWithStatus(projectStatus.ACTIVE);
	var available = listProjectsWithStatus(projectStatus.AVAILABLE);
	
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

