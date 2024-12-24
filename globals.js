var gameData = {
	timer: 0,
	money: 0,
	bikes: 0,
	customers: 0,
	demand: 30,
	bikesSold: 0,
	partsPerBike: 100,
	bikeMSRP: 100,

	newsTickerText: "New bike shop opens on Williamson Street!",
	newsTickerNext: [],
	newsTickerTimeAtLastUpdate: 0,
	
	bikeParts: 1000,
	bikePartsBaseCost: 100,
	bikePartsCost: 100,
	bikePartsPerBuy: 1000,
	bikePartsPurchases: 0,
	bikePartsPriceAdjustChance: 0.1,

	employees: 0,
	employeeHiringCost: 1000,

	salesPeople: 0,
	salesPersonSuccessRate: 25,// x over 100 chance per customer of selling a bike (if there's one to sell)
	salesPersonHiringCost: 1000,
	salesRateData: [0],
	salesRate: 0, //sales per minute over last 5 minutes

	mechanics: 0,
	mechanicTimers: [],
	mechanicBaseTimePerBike: 30,//seconds per bike per mechanic
	mechanicHiringCost: 1000,
}

