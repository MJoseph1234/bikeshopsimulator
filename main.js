if (localStorage.getItem("bikeShopSimulatorSave") != null) {
	//loadGame();
}

var gameLoop = window.setInterval(function() {
	//runs once per second
	gameData.timer += 1;
	checkTargets();
	salesShift();
	mechanicShift();
	updateCustomers();
	adjustBikePartsPrice();
	manageButtons();
	calculateBusinessAnalytics();
	updateActiveProjects();

	if (gameData.timer % 10 === 0) {
		saveGame();
	}
	if (gameData.timer % 20 === 0 ) {
		updateNewsTicker();
	}
}, 1000)

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
function queueNewsTicker(value){
	gameData.newsTickerNext.push(value);
}

function updateNewsTicker(){

	if (gameData.newsTickerNext.length >= 1) {
		next = gameData.newsTickerNext.shift();
	}
	else if (gameData.timer - gameData.newsTickerTimeAtLastUpdate > 100) {
		next = news[Math.floor(Math.random()*news.length)]
	}
	else {
		return;
	}
	console.log(next);
	gameData.newsTickerTimeAtLastUpdate = gameData.timer;
	gameData.NewsTickerText = next;
	document.getElementById("tickerText").innerHTML = next;
}

var news = [
	"Advocates Call for More Bike Paths",
	"Research Shows Bikes are Good For You",
	"Study Shows Bikes are Faster for Inner City Delivery",
	"Scientists Discover You Should Bike More",
	"Researchers find no connection between bicycles and bigfoot sightings",
	"Opinion: Patriots Say More Bikes = More Freedom",
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

let buildInterval;
document.getElementById("player-build-timer").style.setProperty("--progress", "0%")
document.getElementById("build-bike").addEventListener("mousedown", () => {
	buildInterval = window.setInterval( () => {
		if (gameData.bikeParts <= 0) {
			return;
		}

		let timer = document.getElementById("player-build-timer");

		if (gameData.bikeBuildProgress >= gameData.mechanicBaseTimePerBike) {
			finishBike();
			timer.style.setProperty("--progress", '0%')
		}
		else {
			let partsPerInterval = gameData.partsPerBike / gameData.mechanicBaseTimePerBike;
			
			if (gameData.bikeParts <= partsPerInterval) {
				return;
			}

			gameData.bikeBuildProgress += 1;
			gameData.bikeParts -= partsPerInterval;
			let progressPercent = Math.min(Math.floor(100 * gameData.bikeBuildProgress / gameData.mechanicBaseTimePerBike), 100);
			console.log(gameData.bikeParts);
			timer.style.setProperty("--progress", `${progressPercent}%`);
			document.getElementById("bike-parts").innerHTML = Math.round(gameData.bikeParts);
		}
	}, 100);
});

document.getElementById("build-bike").addEventListener("mouseup", () => {
	clearInterval(buildInterval);
});

document.getElementById("build-bike").addEventListener("mouseleave", () => {
	clearInterval(buildInterval);
})

document.getElementById("build-bike").addEventListener("click", () => {
	if (gameData.bikeParts <= 0) {
		return;
	}

	let timer = document.getElementById("player-build-timer");

	if (gameData.bikeBuildProgress >= gameData.mechanicBaseTimePerBike) {
		finishBike();
		timer.style.setProperty("--progress", '0%')
	}
	else {
		let partsPerInterval = gameData.partsPerBike / gameData.mechanicBaseTimePerBike;
		
		if (gameData.bikeParts <= partsPerInterval) {
			return;
		}

		gameData.bikeBuildProgress += 1;
		gameData.bikeParts -= partsPerInterval;
		let progressPercent = Math.min(Math.floor(100 * gameData.bikeBuildProgress / gameData.mechanicBaseTimePerBike), 100);
		console.log(gameData.bikeParts);
		timer.style.setProperty("--progress", `${progressPercent}%`);
		document.getElementById("bike-parts").innerHTML = Math.round(gameData.bikeParts);
	}
});

function finishBike() {
	gameData.bikes += 1;
	document.getElementById("bikes-built").innerHTML = gameData.bikes;
	gameData.bikeBuildProgress = 0;
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
	document.getElementById("bike-parts").innerHTML = Math.round(gameData.bikeParts);
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
function mechanicShift() {
	if (gameData.mechanics <= 0) {
		return
	}

	// loop through the mechanic timers
	for (let i = 1; i <= Math.min(gameData.mechanics, 3); i++) {
		// reveal a new mechanic timer (up to 3 timers)
		if (i > gameData.mechanicTimers.length) {
			const timer = document.getElementById(`mech-${i}-timer`);
			const prog = document.getElementById(`mech-${i}-progress`);
			timer.style.setProperty("--progress", `0%`);
			timer.classList.remove("hidden");
			prog.classList.remove("hidden");
			gameData.mechanicTimers.push(0);
		}
		else {
			if (!canBuildBike()) {
				continue;
			}
			var mechsOnTimer = Math.floor(gameData.mechanics/3) + (gameData.mechanics%3>=i);

			// if there's not enough parts for ALL the mechanics on that timer,
			// skip the timer, it should not move.
			if (gameData.bikeParts < (mechsOnTimer * gameData.partsPerBike)) {
				continue;
			}

			const timer = document.getElementById(`mech-${i}-timer`);
			let progValue = Math.min(Math.floor(100 * gameData.mechanicTimers[i-1] / gameData.mechanicBaseTimePerBike), 100);

			if (progValue >= 100) {
				for (let j = 0; j < mechsOnTimer; j++) {
					buildBike();
					timer.style.setProperty('--progress', '0%');
				}
				gameData.mechanicTimers[i-1] = 0;
			}
			else {
				gameData.mechanicTimers[i-1] += 1;
				let progValue = Math.min(Math.floor(100 * gameData.mechanicTimers[i-1] / gameData.mechanicBaseTimePerBike), 100);
				timer.style.setProperty('--progress', `${progValue}%`);
			}
		}
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
			projectElem.classList("hidden", true);

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

