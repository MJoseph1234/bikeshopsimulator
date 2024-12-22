/* Targets

Targets are passive goals that, once reached, enable some new feature or effect
These are checked from the Main Loop
*/

var targets = [
	{
		title: "Sell Ten Bikes",
		done: false,
		effectDescription: "Enable hiring sales staff",
		trigger: function(){return gameData.bikesSold >= 10},
		effect: function(){
			document.getElementById("staff-sales-label").classList.remove("hidden");
			document.getElementById("hire-sales").classList.remove("hidden");
		}
	},

	{
		title: "Build 100 Bikes",
		done: false,
		effectDescription: "Enable hiring mechanics",
		trigger: function(){return gameData.bikes + gameData.bikesSold >= 100},
		effect: function(){
			document.getElementById("staff-mechanics-label").classList.remove("hidden");
			document.getElementById("hire-mechanic").classList.remove("hidden");
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
	}
];