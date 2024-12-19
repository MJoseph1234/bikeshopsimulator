function queueNewsTicker(value){
	gameData.newsTickerNext.push(value);
}

function updateNewsTicker(){

	if (gameData.newsTickerNext.length >= 1) {
		next = gameData.newsTickerNext.shift();
	}
	else if (gameData.timer - gameData.newsTickerTimeAtLastUpdate > 100) {
		next = news[Math.floor(Math.random()*news.length)]
	}
	else {
		return;
	}
	console.log(next);
	gameData.newsTickerTimeAtLastUpdate = gameData.timer;
	gameData.NewsTickerText = next;
	document.getElementById("tickerText").innerHTML = next;
}

var news = [
	"Advocates Call for More Bike Paths",
	"Research Shows Bikes are Good For You",
	"Study Shows Bikes are Faster for Inner City Delivery",
	"Scientists Discover You Should Bike More",
	"Researchers find no connection between bicycles and bigfoot sightings",
	"Opinion: Patriots Say More Bikes = More Freedom",
	]