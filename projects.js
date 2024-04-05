/* Projects

Projects are purchasable options that appear when certain targets are met.
These improve some rate or chance, or enable a new action to appear
*/

const projectStatus = {
	UNAVAILABLE: "unavailable",
	AVAILABLE: "available",
	ACTIVE: "active",
	DONE: "done"
}

var projects = [
	{
		title: 'Basic Sales Training',
		status: projectStatus.UNAVAILABLE,
		costStr: "$1,000",
		canAfford: function(){return gameData.money > 1000},
		effectDescription: "Improve sales staff success rate by 10%",
		effect: function() {
			gameData.money -= 1000;
			gameData.salesPersonSuccessRate *= 1.1;
			console.log("Basic sales training done")
		}
	},

	{
		title: 'Basic Mechanic Training',
		status: projectStatus.UNAVAILABLE,
		costStr: "$1,000",
		canAfford: function(){return gameData.money > 1000},
		effectDescription: "Improve mechanic build rate by 10%",
		effect: function() {
			gameData.money -= 1000;
			gameData.mechanicBaseTimePerBike = Math.floor(gameData.mechanicBaseTimePerBike * 0.9);
			console.log("Basic mechanic training done")
		}
	},

	{
		title: 'Business Analytics',
		status: projectStatus.UNAVAILABLE,
		costStr: "$1,000",
		purchased: 0,
	},
];