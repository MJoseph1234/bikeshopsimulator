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

const projects = [
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
			gameData.demand *= 2;
			document.getElementById("money").innerHTML = gameData.money.toLocaleString();
		}
	},

	{
		title: 'Accessory Sales',
		status: projectStatus.UNAVAILABLE,
		costStr: "$10,000",
		canAfford: function() {return gameData.money >= 10000},
		effectDescription: "Sell accessories with each bike",
		effect: function() {
			gameData.money -= 10000;
			gameData.accessories = 1000;
			gameData.accessoryCost = 1000;
			gameData.accessoriesPerCase = 1000;
			document.getElementById("money").innerHTML = gameData.money.toLocaleString();
			document.getElementById("accessories").innerHTML = gameData.accessories.toLocaleString();
			blinkAppear(document.getElementById("accessory-container"));
			sellFunction = sellBikeWithAccessories;
		}
	},

	{
		title: "Plan a Group Ride",
		status: projectStatus.UNAVAILABLE,
		costStr: "$10,000",
		canAfford: function() { return gameData.money >= 10000 },
		effectDescription: "Plan a group ride for your customers",
		effect: function() {
			gameData.money -= 10000;
			document.getElementById("money").innerHTML = gameData.money.toLocaleString();
			blinkAppear(document.getElementById("community-events"))
			startEvent("groupRide");
		}
	},
];