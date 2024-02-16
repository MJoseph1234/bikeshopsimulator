/* Targets
Targets are passive goals that, once reached, enable some new feature or effect

These are checked from the Main Loop
*/


var targets = [];

var target1 = {
	title: "Sell Ten Bikes",
	done: false,
	effectDescription: "Enable hiring sales staff",
	trigger: function(){return gameData.bikesSold >= 10},
	effect: function(){
		document.getElementById("staff-sales-label").classList.remove("hidden");
		document.getElementById("hire-sales").classList.remove("hidden");
		console.log(target1.title);
	}
}

targets.push(target1);

var target2 = {
	title: "Build 100 Bikes",
	done: false,
	effectDescription: "Enable hiring mechanics",
	trigger: function(){return gameData.bikes + gameData.bikesSold >= 100},
	effect: function(){
		document.getElementById("staff-mechanics-label").classList.remove("hidden");
		document.getElementById("hire-mechanic").classList.remove("hidden");
		console.log(target2.title);
	}
}

targets.push(target2);