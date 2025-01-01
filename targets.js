/* Targets

Targets are passive milestones that, once reached, enable some new feature or effect
These are checked from the Main Loop
*/

var targets = [
	{
		title: "Hire employees",
		done: false,
		effectDescription: "Enable hiring employees",
		trigger: function(){return(gameData.bikesSold >= 10 || (gameData.bikes + gameData.bikesSold >= 100))},
		effect: function(){
			document.getElementById("employee-label").classList.remove("hidden");
			document.getElementById("hire-employee").classList.remove("hidden");
			document.getElementById("employee-focus-slider-label").classList.remove("hidden");
			document.getElementById("employee-focus-slider").classList.remove("hidden");
			document.getElementById('employee-focus').classList.remove("hidden");
		}
	},

	{
		title: "Hired Sales and Mechanics",
		done: false,
		effectDescription: "Enable business projects",
		trigger: function(){return gameData.salesPeople > 0 && gameData.mechanics > 0 && gameData.timer % 20 === 0},
		effect: function(){
			document.getElementById("phase2").classList.remove("hidden");
			console.log("The machine is alive. Now focus on business projects")
			projects[0].status =  projectStatus.AVAILABLE;
			projects[1].status = projectStatus.AVAILABLE;
		}
	},

	{
		title: "Get Bike Stickers",
		done: false,
		effectDescription: "All bikes get the shop logo on a sticker",
		trigger: function() {return gameData.bikesSold > 100},
		effect: function() {
			projects[3].status = projectStatus.AVAILABLE;
		}
	},

	{
		title: "Sell Accessories",
		done: false,
		effectDescription: "Sell accessories with each bike",
		trigger: function() {return gameData.bikesSold > 100},
		effect: function() {
			projects[4].status = projectStatus.AVAILABLE;
		}
	}
];