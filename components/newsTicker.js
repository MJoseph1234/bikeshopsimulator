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
	else{
		return;
	}
	console.log(next);
	gameData.newsTickerTimeAtLastUpdate = gameData.timer;
	gameData.NewsTickerText = next;
	document.getElementById("tickerText").innerHTML = next;
}