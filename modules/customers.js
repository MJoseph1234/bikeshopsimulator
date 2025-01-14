
/**
 * Get the poisson probability of k events happening when
 * there's an average of lambda events per step
 */
function poisson(lambda, k){
	return (lambda ** k) * (Math.E ** (-lambda)) / factorial(k)
}

/**
 * calculate the factorial of int n
 */
function factorial(n) {
	let ret = 1;
	for (let i = 2; i <= n; i++) {
		ret *= i;
	}
	return(ret)
}

/**
 * Get an array representing the cumulative distribution function values
 * for a poisson distribution from 0 to lambda+10
 */
function poissonCDF(lambda) {
	const max = lambda + 10;
	let p = [poisson(lambda, 0)];

	for(let i = 1; i <= max; i ++) {
		p.push(poisson(lambda, i) + p[i - 1]);
	}
	return(p);
}

/**
 * get the position/index from a sorted array after which the value would
 * be inserted. All entries up to this position are less than value, and all 
 * entries after this position are greater than value
 */
function bisectLeft(array, value, lo = 0, hi = array.length) {
	while (lo < hi) {
		const mid = (lo + hi) >> 1; // right shift by 1 to get division by 2
		if (array[mid] < value) {
			lo = mid + 1;
		} else {
			hi = mid;
		}
	}
	return lo;
}

let customerCDF = poissonCDF(gameData.demand);

/**
 * change the customer demand and update the cumulative
 * distribution array
 */
function updateDemand(newDemand) {
	gameData.demand = newDemand;
	customerCDF = poissonCDF(gameData.demand);
}

/**
 * Update the number of customers in the store based on a poisson
 * distribution of customer arrival probability
 */
function updateCustomers() {
	const roll = Math.random();
	gameData.customers = bisectLeft(customerCDF, roll);

	document.getElementById("customers").innerHTML = gameData.customers;
	document.getElementById("sell-bike").disabled = !canSellBike();

}

