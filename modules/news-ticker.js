function queueNewsTicker(headline, link = ""){
	gameData.newsTickerNext.push([headline, link]);
}

function updateNewsTicker() {

	// Get the next queued news, if there is one
	let newsEntry;
	if (gameData.newsTickerNext.length >= 1) {
		next = gameData.newsTickerNext.shift();
	}
	// otherwise, if enough time has passed, grab a random one from the list
	else if (gameData.timer - gameData.newsTickerTimeAtLastUpdate > 1000) {
		newsEntry = Math.floor(Math.random()*news.length);
		next = news[newsEntry];
	}
	else {
		return;
	}
	
	let text = next[0];
	let tickerHTML;
	if (next.length == 1 || next[1] == "") {
		tickerHTML = text;
	} else {
		tickerHTML = `<a href="${next[1]}" target="_blank">${text} </a><sup>[<a href="${next[1]}">${newsEntry}</a>]</sup>`
	}
	gameData.newsTickerTimeAtLastUpdate = gameData.timer;
	gameData.NewsTickerText = tickerHTML;
	document.getElementById("tickerText").innerHTML = tickerHTML;
}

var news = [
	["Research Shows Bikes are Good For You", "https://www.betterhealth.vic.gov.au/health/healthyliving/cycling-health-benefits"],
	["Study Suggests Bikes are Faster for Inner City Delivery", "https://www.larryvsharry.com/media/wysiwyg/cms_pages/Stories/Last_Mile_Delivery/Data-driven_Evaluation_of_Cargo_Bike_Delivery_Performance_in_Brussels.pdf"],
	["Urbanists: E-bikes are fastest way to the airport", "https://www.wsj.com/lifestyle/travel/airport-race-new-york-chicago-los-angeles-67a2acbf"],
	["Study: New Bike Lanes Lead to Higher Restaurant Sales", "https://prismic-io.s3.amazonaws.com/peopleforbikes/54999b6d-3cb6-484a-863a-955d5d71a02e_National-Street-Improvements-Study-Summary.pdf"],
	["Scientists: Middle School Bicycle Program Helps with Mental Health", "https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2023.1255514/full"],
	
	["Scientists Discover You Should Bike More", ""],
	["Researchers find no connection between bicycles and bigfoot sightings", ""],
	["Opinion: Patriots Say More Bikes = More Freedom", ""],
	["High Schoolers Build Sweet Bicycle Jump Over Local Stream", ""],
	["Advocates Call for More Bike Paths", ""],
	["Cyclist Breaks Sprint Speed Record during Dog Chase", ""],
	["City Police: No Parking Tickets Issued to Bicycles in Past Year", ""],
	["Scientists: Does Citrus Work As Bicycle Chain Lube? No. Not At All", ""],
	["Local Cycling Groups In Your Area", ""],
	["Muscled Cyclist Riding Tandem Bicycle Alone Wins Local Race", ""]
]