if (localStorage.getItem("bikeShopSimulatorSave") != null) {
	loadGame()
}

var gameLoop = window.setInterval(function() {
	//runs once per second
	gameData.timer += 1;
	checkTargets();
	salesShift();
	mechanicShift()
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
//this is my test
function refreshCounters() {
	document.getElementById("bikes-sold").innerHTML = gameData.bikesSold.toLocaleString();
	document.getElementById("bikes-built").innerHTML = gameData.bikes;
	document.getElementById("bike-parts").innerHTML = gameData.bikeParts;
	document.getElementById("parts-cost").innerHTML = gameData.bikePartsCost.toLocaleString();
	document.getElementById("customers").innerHTML = gameData.customers;
	document.getElementById("money").innerHTML = gameData.money.toLocaleString();
	document.getElementById("staff-sales").innerHTML = gameData.salesPeople;
	document.getElementById("staff-mechanics").innerHTML = gameData.mechanics;
}

function manageButtons() {
	document.getElementById("sell-bike").disabled = !canSellBike();
	document.getElementById("build-bike").disabled = !canBuildBike();
	document.getElementById("buy-bike-parts").disabled = !canBuyBikeParts();
	document.getElementById("hire-sales").disabled = !canHireSales();
	document.getElementById("hire-mechanic").disabled = !canHireMechanic();
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
	else{
		return;
	}
	console.log(next);
	gameData.newsTickerTimeAtLastUpdate = gameData.timer;
	gameData.NewsTickerText = next;
	document.getElementById("tickerText").innerHTML = next;
}
///////// shopOperations.js //////////
function checkTargets() {
	targets.forEach(target => {
		if (target.trigger() && !(target.done)) {
			target.done = true;
			target.effect();
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
////////// salesStaff.js //////////
function canHireSales() {
	return(gameData.money >= gameData.salesPersonHiringCost && gameData.bikes > 0);
}
function hireSales() {
	if (!canHireSales()) {
		return
	}
	gameData.money -= gameData.salesPersonHiringCost;
	gameData.salesPeople += 1;
	document.getElementById("money").innerHTML = gameData.money.toLocaleString();
	document.getElementById("staff-sales").innerHTML = gameData.salesPeople;
	document.getElementById("hire-sales").disabled = !canHireSales();
}
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
function canHireMechanic() {
	// don't softlock
	// so, need enough money to hire + at least one bike to sell or enough parts to build a bike or enough money to buy parts
	return(gameData.money >= gameData.mechanicHiringCost 
		&& (gameData.bikes > 0 || gameData.bikeParts >= gameData.partsPerBike || gameData.money > gameData.BikePartsBaseCost ))
}

function hireMechanic() {
	if (!canHireMechanic()) {
		return
	}
	gameData.money -= gameData.mechanicHiringCost;
	gameData.mechanics += 1;

	if (gameData.mechanics <= 5){
		//show next mechanic timer bar
		const timer = document.getElementById(`mech-${gameData.mechanics}-timer`);
		const prog = document.getElementById(`mech-${gameData.mechanics}-progress`);
		timer.classList.remove("hidden");
		prog.classList.remove("hidden");
		timer.style.setProperty("--progress", `0%`);
		//set new mechanic timer
		gameData.mechanicTimers.push(0);
	}
	document.getElementById("money").innerHTML = gameData.money.toLocaleString();
	document.getElementById("staff-mechanics").innerHTML = gameData.mechanics;
	document.getElementById("hire-mechanic").disabled = !canHireMechanic();
}

function mechanicShift() {
	if (gameData.mechanics.length <= 0) {
		return
	}
	// let ts = gameData.timer;

	// let progress = document.getElementById("mechanic-progress-bar");
	// const progValue = Math.floor(100*(ts - gameData.mechanics[0])/gameData.mechanicBaseTimePerBike);
	// progress.style.setProperty("--progress", `${progValue}%`);
	
	var mechsOnTimer = 0
	var progValue = 0
	for (let i = 0; i < gameData.mechanicTimers.length; i++) {
		mechsOnTimer = Math.floor(gameData.mechanics/5) + (gameData.mechanics%5>=i);
		
		if (gameData.bikeParts < (mechsOnTimer * 100)) {
			continue;
		}

		gameData.mechanicTimers[i] += 1;

		var progElement = document.getElementById(`mech-${i+1}-timer`);
		progValue = Math.min(Math.floor(100*gameData.mechanicTimers[i]/gameData.mechanicBaseTimePerBike), 100);
		progElement.style.setProperty('--progress', `${progValue}%`);

		if (progValue >= 100) {
			for (let j = 0; j < mechsOnTimer; j++) {
				buildBike();
				progElement.style.setProperty('--progress', '0%');
			}
			gameData.mechanicTimers[i] = 0;
		}
	}
}
///////// shopProjects.js ///////////
function displayProject(project, index) {
	projectElem = document.getElementById("p"+index);
	projectElem.classList.toggle("disabled", !project.canAfford());
	projectElem.getElementsByClassName("project-title")[0].innerHTML = project.title;
	projectElem.getElementsByClassName("project-cost")[0].innerHTML = "(" + project.costStr + ")";
	projectElem.getElementsByClassName("project-description")[0].innerHTML = project.effectDescription;
	projectElem.classList.remove("hidden");
	
	projectElem.onclick = function() {
		project.effect();
		project.status = projectStatus.DONE;
		projectElem.classList.toggle("hidden");
		refreshProjectDOM();
	}
}

function listProjectsWithStatus(status) {
	//returns the index from the projects list, not the project object itself
	var projectList = [];
	for (let i=0; i < projects.length; i++) {
		if (projects[i].hasOwnProperty("status") && projects[i].status == status) {
			projectList.push(i);
		}
	}
	return projectList
}

function refreshProjectDOM() {
	var active = listProjectsWithStatus(projectStatus.ACTIVE);
	for (let i = 0; i < 5; i++) {
		if (i < active.length) {
			displayProject(projects[active[i]], i);
		}
		else {
			projectElem = document.getElementById("p"+i);
			projectElem.getElementsByClassName("project-title")[0].innerHTML = "";
			projectElem.getElementsByClassName("project-cost")[0].innerHTML = "";
			projectElem.getElementsByClassName("project-description")[0].innerHTML = "";
			projectElem.onclick = null;
		}
	}
}

function updateActiveProjects() {
	var active = listProjectsWithStatus(projectStatus.ACTIVE);
	var available = listProjectsWithStatus(projectStatus.AVAILABLE);
	
	while (active.length < 5 && available.length > 0) {
		projects[available[0]].status = projectStatus.ACTIVE;
		active.push(available.shift());
		displayProject(projects[active[active.length - 1]], active.length - 1);
	} 
	for (let i = 0; i < active.length; i++) {
		projectElem = document.getElementById("p"+i);
		projectElem.classList.toggle("disabled", !projects[active[i]].canAfford());
	}
}

