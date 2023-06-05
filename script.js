let container = document.querySelector('#container');
let runner = document.querySelector('#runner');
let block = document.querySelector('#block');
let time = document.querySelector('#time');
let startMessage = document.querySelector('#startMessage');

let gameLoop = null;
let velLoop = null;
let result = null;
let velArr = [];
let playerTime = 0;

let gameInterval = () => {
	playerTime++;
	time.innerHTML = `Time <b>${playerTime}</b>s`;
}

window.addEventListener("keydown", (key) => {
	if (key.keyCode == 32) {
		gameLoop = setInterval(gameInterval, 1000);
		result = setInterval(checkResult, 10);
		velArr.push(300);
		velLoop = setInterval(() => {
			velArr.push(300);
		}, 3000);
		block.style.animation = `animateBlock 5s linear infinite`;
		startMessage.style.display = `none`;
	};
	if (key.keyCode == 39) {
		clearInterval(velLoop);
		velArr.push(500);
		velLoop = setInterval(() => {
			velArr.push(500);
		}, 3000);
		block.style.animation = `animateBlock 3s linear infinite`;
	}
	if (key.keyCode == 38) {
		if (runner.classList != "runnerActive") {
			runner.style.animation = `animateRunner 1s linear infinite`;

			setTimeout(() => {
				runner.style.animation = `none`;
			}, 1000);
		};
	};
});

window.addEventListener("keyup", (key) => {
	if (key.keyCode == 39) {
		clearInterval(velLoop);
		velArr.push(300);
		velLoop = setInterval(() => {
			velArr.push(300);
		}, 3000);
		block.style.animation = `animateBlock 5s linear infinite`;
	}
});

let checkResult = () => {
	let runnerBottom = window.getComputedStyle(runner).getPropertyValue("bottom");
	//console.log(runnerBottom);

	let blockLeft = window.getComputedStyle(block).getPropertyValue("left");
	//console.log("Block left " + blockLeft);

	if (parseFloat(runnerBottom) <= 210 && parseFloat(blockLeft) >= 20 &&parseFloat(blockLeft) <= 100) {
		clearInterval(velLoop);
		clearInterval(gameLoop);
		clearInterval(result);
		block.style.animation = `none`;
		calculateAll();
		gameLoop = null;
		velLoop = null;
		result = null;
		velArr = [];
		playerTime = 0;
		time.innerHTML = `Time <b>${playerTime}</b>s`;
		startMessage.style.display = `inline`;
	};
};

let calculateAll = () => {
	// trapezoidal sum of veloctiy
	let trapezoidalSum = trapezoidalRule(velArr);
	// average value of the velocity
	let averageVelocity = (1/playerTime) * trapezoidalSum;
	// integral of avg. velocity from t = 0 to t = playerTime
	let totalDistance = (Math.abs(averageVelocity) * playerTime) - (Math.abs(averageVelocity) * 0);
	averageVelocity = Math.round(averageVelocity);
	totalDistance = Math.round(totalDistance);
	let message = 'Time: ' + playerTime + '\nAvg. Velocity: ' + averageVelocity + ' px/s\nTotal Distance: ' + totalDistance+ ' px';
	alert(message);
};

let trapezoidalRule = (arr) => {
	let total = arr[0] + arr[arr.length-1];
	for (let i = 1; i < arr.length - 1; i++) {
		total += arr[i] * 2;
	};
	return total * ((playerTime/arr.length) / 2);
}
