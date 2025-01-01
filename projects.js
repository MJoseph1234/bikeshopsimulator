/* Projects

Projects are purchasable options that appear when certain targets are met.
These improve some rate or chance, or enable a new action to appear
*/

const projectStatus = {
	UNAVAILABLE: "unavailable", // not allowed in project list
	AVAILABLE: "available", // could show up in project list
	ACTIVE: "active", // currently in project list
	DONE: "done" // purchased
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
			document.getElementById("money").innerHTML = gameData.money.toLocaleString();
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
			document.getElementById("money").innerHTML = gameData.money.toLocaleString();
		}
	},

	{
		title: 'Business Analytics',
		status: projectStatus.UNAVAILABLE,
		costStr: "$1,000",
		purchased: 0,
	},

	{
		title: 'Shop Stickers',
		status: projectStatus.UNAVAILABLE,
		costStr: "$1,000, 200 bikes sold",
		canAfford: function() {return gameData.money >= 1000 && gameData.bikesSold >= 200},
		effectDescription: "Each bike sold gets a sticker with the shop logo. It's like free advertising.",
		effect: function() {
			gameData.money -= 1000;
			gameData.demand += 10;
			document.getElementById("money").innerHTML = gameData.money.toLocaleString();
		}
	}
];