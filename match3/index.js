(function($){
  $.isBlank = function(obj){
	return(!obj || $.trim(obj) === "");
  };
})(jQuery);

function VERTICAL(n,a,b) {
	return n+a;
}

function HORIZONTAL(n,a,b) {
	return n+b;
}


function logResult(phraseToLog) {
	$("#display").html(phraseToLog);
}

function runAssessment() {
	let arrayOf = makeArray();
	let validation = isValid(arrayOf);
	if (validation !== null) {
		logResult(validation);
		return;
	}
	let gridOf = makeGrid(arrayOf);
	let swapList = [];
	for (let i = 0; i < 6; i++) {
		for (let j = 0; j < 7; j++) {
			swapList.push([j+1, i+1, "down", scoreSwap(gridOf, j, i, VERTICAL)[0]]);
			swapList.push([i+1, j+1, "right", scoreSwap(gridOf, i, j, HORIZONTAL)[0]]);
		}
	}
	swapList = swapList.filter(swap => swap[3] !== 0).sort((a,b)=>b[1]-a[1]).sort((a,b)=>b[2]==="right"?1:a[2]==="right"?-1:0).sort((a,b)=>b[3]-a[3]);
	$("#display").html("");
	swapList.map(segment => {
		$("#display").append("<div>"+segment+"</div>");
	});
	$("#display").children().each((i,t) => {
		$(t).click(e => executeSwap(e));
	});
}

function executeSwap(e) {
	let [x, y, orient, ...j] = $(e.currentTarget).html().split(",");
	switch (orient) {
		case "right":
			orient = HORIZONTAL;
			break;
		case "down":
			orient = VERTICAL;
			break;
	}

	let [score, grid] = scoreSwap(makeGrid(makeArray()),x-1,y-1,orient);
	grid = collapse(grid);
	for (let y = 0; y < 7; y++) {
		for (let x = 0; x < 7; x++ ) {
			$('#grid [name="'+y+'_'+x+'"]')[0].value = grid[y][x] || '';
		}
	}

	$("#display").empty();
}

function makeEntry(x, y, direction, collapseInfo) {
	return {
		'x': x,
		'y': y,
		'direction': direction,
		'collapseInfo': collapseInfo
	};
}

function prep() {
	let grid = $("#grid");
	for (let i = 0; i < 7; i++) {
		for (let j = 0; j < 7; j++) {
			grid.append("<input type=\"text\" name=\""+i+"_"+j+"\" />");
			//grid.append("<input type=\"text\" name=\""+i+"_"+j+"\" value=\""+(i+j === 0 ? 3 : (i+j)%7+1)+"\" />");
		}
	}
	$("#controls [name=\"runAssessment\"]").click(runAssessment);
}

function makeArray() {
	return Array.from($("#grid input")).map(input => input.value);
}

function makeGrid(arrayOf) {
	let gridOf = [];
	for (let i = 0; i < arrayOf.length; i+=7) {
		let chunk = arrayOf.slice(i,i+7);
		gridOf.push(chunk);
	}
	return gridOf;
}

function isValid(arrayOf) {
	let allNumbersEntered = true;//!arrayOf.map(input => input).includes(null);
	if (allNumbersEntered) {
		return null;
	} else {
		return "Need numbers in all entries";
	}
}

function scoreSwap(gridOf, x, y, orient) {
	let gridCopy = gridOf.map(row => row.slice());
	gridCopy[y][x] = gridOf[orient(y,1,0)][orient(x,0,1)];
	gridCopy[orient(y,1,0)][orient(x,0,1)] = gridOf[y][x];
	const [levels, grid] = scoreMatches(gridCopy);
	const level = levels.reduce((p,c)=>Math.max(p,c),0);
	let score = grid.flat().map(a => $.isBlank(a)?1:0).reduce((p,c)=>p+c,0);
	switch (level) {
		case 5:
			score+=100;
			break;
		case 4:
			score+=50;
			break;
	}
	
	return [score, grid];
}

function scoreMatches(grid) {
	let matches = [];
	for (let y = 0; y < 7; y++) {
		let horizontal = makeTracker(null,0,HORIZONTAL);
		let vertical = makeTracker(null,0,VERTICAL);
		for (let x = 0; x < 7; x++) {
			horizontal = trackMatch(grid, x, y, horizontal, matches)
			vertical = trackMatch(grid, y, x, vertical, matches)
		}
		pushMatch(7, y, horizontal, matches)
		pushMatch(y, 7, vertical, matches)
	}

	let score;
	let levels = [];
	if (hasIntersections(matches,grid)) {
		levels.push(5);
	} else {
		levels.push(matches.map(a => a.length).filter(a => a > 2).reduce((prev,curr) => Math.max(prev,curr),0));
	}

	if (levels[0] > 0) {
		grid = collapse(grid);
		levels = levels.concat(scoreMatches(grid)[0]);
	}

	return [levels, grid];
}

function collapse(grid) {
	const gridCopy = _.unzip(grid);
	for (let x = 0; x < gridCopy.length; x++) {
		gridCopy[x] = gridCopy[x].filter(a => !$.isBlank(a));
		while (gridCopy[x].length < 7) {
			gridCopy[x].unshift(null);
		}
	};
	return _.unzip(gridCopy);
}

function hasIntersections(matches,grid) {
	let intersectFound = false;
	let valueList = {};
	matches.map(a => valueList[a.value] = true);
	for (const value in valueList) {
		const matchOnValue = matches.filter(a => a.value == value);
		const points = {};
		for (const matchIndex in matchOnValue) {
			const match = matchOnValue[matchIndex];
			for (let y = match.start[1]; y <= match.end[1]; y++) {
				for (let x = match.start[0]; x <= match.end[0]; x++) {
					grid[y][x] = null;
					if (points[x+","+y]) {
						intersectFound = true;
					}
					points[x+","+y] = true;
				}
			}
		}
	}
	
	return intersectFound;
}

function trackMatch(grid, x, y, tracker, matches) {
	if (!$.isBlank(tracker.value) && grid[y][x] === tracker.value) {
		tracker.counter += 1;
	} else {
		pushMatch(x,y,tracker,matches);
		tracker.value = grid[y][x];
		tracker.counter = 1;
	}
	return tracker;
}

function pushMatch(x, y, tracker, matches) {
	if (!$.isBlank(tracker.value) && tracker.counter > 2) {
		matches.push(makeMatch(x,y,tracker));
	}
}

function makeMatch(x, y, tracker) {
	const orient = tracker.orient;
	const counter = tracker.counter;
	return {
		start: [orient(x,0,-counter),orient(y,-counter,0)],
		end: [orient(x,0,-1),orient(y,-1,0)],
		length: counter,
		value: tracker.value
	};
};

function makeTracker(value,count,isVertical) {
	return { "value": value, "counter": count, "orient": isVertical };
}

function collapsable(numberSet) {
	return numberSet.map(instance => instance.reduce((acc,curr) => acc === null ? null : acc === curr ? curr : null) !== null).includes(true);
}

$(document).ready(() => {
  prep();
});
