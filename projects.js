/* Projects
Projects are purchasable options that appear when certain targets are met.
These improve some rate or chance, or enable a new action to appear
*/

var basicSalesTraining = {
	title: 'Basic Sales Training',
	purchased: 0,
	effectDescription: "Improve sales staff success rate by 10%",
	effect: function() {
		gameData.salesPersonSuccessRate *= 1.1;
	}
}

var basicMechanicTraining = {
	title: 'Basic Mechanic Training',
	purchased: 0,
	effectDescription: "Improve mechanic build rate by 10%",
	effect: function() {
		gameData.mechanicBaseTimePerBike = Math.floor(gameData.mechanicBaseTimePerBike * 0.9);
	}
}

var businessAnalytics = {
	title: 'Business Analytics',
	purchased: 0,
	effectDescription: 
}