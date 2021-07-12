/*	
	ORDER OF PLAY
	
	[STATE-0]
		potential answer emojis appear on the left
		left side is highlighted
		main player chooses a card on the left
	
	[STATE-1]
		main player has chosen an emoji
		selected emoji is green
		"START" button appears
		right side is highlighted
	
	[STATE-2]
	
	[STATE-3]
		"NEXT" button is removed
		right side is highlighted
		row of emojis appear on the right
		user is prompted to choose a similar emoji from the right
	
	[STATE-4]
		non-selected clue emojis are faded
		left side is highlighted
*/

var emojisChosen = [], emojisClues = [];

var state = 0;
var potentialAnswerCount = 6;
var clueEmojiCount = 5;
var answer = -1;
var guessed = 0;
var selectedCategory = 'Object';

function selectLeftSide() {	
	d3.select('#answers').style('background', '#fdb');	
	d3.select('#clues').style('background', '#fff');
}

function selectRightSide() {	
	d3.select('#answers').style('background', '#fff');	
	d3.select('#clues').style('background', '#fdb');
}

function startGame() { // state 0
	state = 0;
	guessed = 0;
	selectLeftSide();
	var emojisRandom = getCategoryEmojisOnly(selectedCategory);
	emojisChosen = emojisRandom.slice(0, potentialAnswerCount);
	emojisClues = emojisRandom.slice(potentialAnswerCount);
	createPotentialGuessCards();
	d3.select('#help').html("<em>Guessers </em> look away, while <em>Player 1</em> selects a target emoji")
	d3.selectAll('.guess_container').remove();
	d3.select('#different_targets').style('display', 'block');
	d3.select('#restart').style('display', 'none');
	doResize();
}

function getCategoryEmojisOnly(cat) {
	var arr = [...new Set(emojis.filter(x => x[1].includes(cat)).map(x => x[0]))];
	return shuffle(arr);
}

function newTargetEmojiSet() {
	var emojisRandom = getCategoryEmojisOnly(selectedCategory);
	emojisChosen = emojisRandom.slice(0, potentialAnswerCount);
	emojisClues = emojisRandom.slice(potentialAnswerCount);
	createPotentialGuessCards();
	return false;
}

function showAllEmojis() {
	var gc = d3.select('#clues_container').append('div');
	gc.lower();
	d3.selectAll('.active').classed('active', false);
	gc.attr('class', 'guess_container active');
	for (var i = 0; i < emojisClues.length; i++) {
		var css = "rotate([deg]deg) translate([left]px, [top]px)"
			.replace("[deg]", random(-4, 4))
			.replace("[left]", random(-3, 3))
			.replace("[top]", random(-3, 3));		
		gc
			.append('div')
			.attr('class', 'minicard current')
			.style('transform', css)
			.on('mousedown', function() { clickedClueEmoji(this) })
			.html(emojisClues[i]);
		if (i > 0 && (i+1) % 8 == 0) {
			gc.append('br');
		}
	}
	doResize();
}

function createPotentialGuessCards() {
	d3.selectAll('#card_container *').remove();
	var perRow = Math.floor(Math.sqrt(emojisChosen.length));
	var perCol = emojisChosen.length / perRow;
	console.log(perRow);
	for (var i = 0; i < emojisChosen.length; i++) {
		var css = "rotate([deg]deg) translate([left]px, [top]px)"
			.replace("[deg]", random(-4, 4))
			.replace("[left]", random(-3, 3))
			.replace("[top]", random(-3, 3));		
		d3
			.select('#card_container')
			.append('div')
			.attr('class', 'card selecting_target')
			.attr('id', 'card' + i)
			.style('transform', css)
			.style('cursor', 'pointer')
			.on('mousedown', function() { clickedGuess(this) })
			.text(emojisChosen[i]);
		if (emojisChosen.length == 6 && i == 2) {
			d3
			.select('#card_container')
			.append('br');
		}
	}
}

function getRandomCelebrationEmoji() {
	return shuffle([ '🏆', '🏅', '🏵️', '✨', '✔️', '🌟', '🤩', '⭐' ])[0];	
}

function getRandomFailEmoji() {
	return shuffle([ '💥', '❌', '😢', '😭', '😿', '💔', '🤦' ])[0];	
}

function clickedGuess(element) {
	var chosen = d3.select(element);
	var cardIndex = +chosen.attr('id').replace('card', '');	
	switch (state) {
		case 0:
			answer = cardIndex;
			selectRightSide();
			d3.selectAll('.card').attr('class', 'card');
			chosen.attr('class', 'card selected_answer');			
			d3.selectAll('.card')
				.style('cursor', 'not-allowed')
				.on('mousedown', null);
			d3.select('#next').style('display', 'inline-block');
			d3.select('#help').html('<em>Player 1</em>: remember your emoji and click Next');
			d3.select('#different_targets').style('display', 'none');
			state = 1;
			doResize();
			break;
		case 4:
			d3.selectAll('.card')
				.style('cursor', 'not-allowed')
				.classed('selecting', false)
				.on('mousedown', null);
			if (answer == cardIndex) {
				chosen.attr('class', 'card error');
				d3.selectAll('.card')
					.style('cursor', 'not-allowed');
				d3.select('#help').html("Whoops! " + getRandomFailEmoji() + " Accidentally clicked the target emoji! Game over");
				d3.select('#restart').style('display', 'block');
			} else {
				guessed++;
				chosen.attr('class', 'card disabled');
				if (guessed + 1 == emojisChosen.length) {
					d3.select('#help').html("Congratulations! " + getRandomCelebrationEmoji() + " The target emoji has been found!");
					d3.select('#card' + answer).attr('class', 'card selected_answer');
					d3.select('#restart').style('display', 'block');
				} else {
					clickStartGame();
				}
			}
			doResize();
			break;
	}
}

function clickCommitTargetEmoji() {
	d3.select('#next').style('display', 'none');
	d3.select('#start').style('display', 'inline-block');
	d3.select('.selected_answer').attr('class', 'card');
	d3.select('#help').html("<em>Player 1</em>: tell the <em>Guessers</em> that they can look, then press Start");	
	state = 2;
	doResize();
}

function clickStartGame() {
	d3.select('#start').style('display', 'none');
	d3.select('#help').html("<em>Player 1</em>: select the emoji on the right that is most similar to your target emoji");
	makeGuessEmojis();
	state = 3;
	doResize();
}

function makeGuessEmojis() {
	var gc = d3.select('#clues_container').append('div');
	gc.lower();
	d3.selectAll('.active').classed('active', false);
	gc.attr('class', 'guess_container active');
	for (var i = 0; i < clueEmojiCount; i++) {
		var css = "rotate([deg]deg) translate([left]px, [top]px)"
			.replace("[deg]", random(-3, 3))
			.replace("[left]", random(-1, 1))
			.replace("[top]", random(-1, 1));		
		gc
			.append('div')
			.attr('class', 'minicard current')
			.style('transform', css)
			.on('mousedown', function() { clickedClueEmoji(this) })
			.append('span')
			.html(emojisClues[0]);
		emojisClues = emojisClues.slice(1);
	}
	doResize();
}

function clickedClueEmoji(element) {
	d3.select(element).attr('class', 'minicard selected');
	d3.selectAll('.current')
		.on('mousedown', null)
		.style('cursor', 'not-allowed')
		.attr('class', 'minicard');
	d3.selectAll('.minicard')
		.on('mousedown', null);			
	selectLeftSide();
	state = 4;	
	guessEmoji();
	doResize();
}

function guessEmoji() {
	d3.select('#help').html("<em>Guessers</em>: select an emoji on the left that you don't think is the target emoji");
	d3
		.selectAll('.card')
		.style('cursor', 'pointer')
		.on('mousedown', function() { clickedGuess(this) })
		.classed('selecting_remove', true);
	d3
		.selectAll('.disabled')
		.style('cursor', 'not-allowed')
		.on('mousedown', null)		
		.classed('selecting_remove', false);
}

/***** CLUE CONTAINER RESIZING *****/

function doResize() {
	
	var documentHeight = d3.select('body').node().getBoundingClientRect().height;
	var cluesHeight = documentHeight - d3.select('#header').node().getBoundingClientRect().height;
	var outside = d3.select("#clues");
	var inside = d3.select("#clues_container");
	
	inside.style('transform', 'scale(1)');
	
	var outsideWidth = outside.node().getBoundingClientRect().width;	
	var outsideHeight = outside.node().getBoundingClientRect().height;
	var insideWidth = inside.node().getBoundingClientRect().width;	
	var insideHeight = inside.node().getBoundingClientRect().height;
		
	var scale = Math.min(
		1,
		outsideWidth / insideWidth,
		cluesHeight / insideHeight
	);
	
	inside
		.style('left', (outsideWidth / 2) - ((insideWidth / 2) * scale) + 'px')
		.style('top', (outsideHeight / 2) - ((insideHeight / 2) * scale) + 'px')
		.style('transform', 'scale('+scale+')');
}

doResize();
window.addEventListener("resize", doResize);

/***** OPTIONS ******/

function showOptions() {	
	d3.select('#target_emoji_count').property('value', potentialAnswerCount);
	d3.select('#clue_emoji_count').property('value', clueEmojiCount);
	updateCategoryList();
	d3.select('#container').style('opacity', 0.5);
	d3.select('#cog').style('opacity', 0.5);
	d3.select('#container').style('filter', 'grayscale(100)');
	d3.select('#cog').style('filter', 'grayscale(100)');	
	d3.select('#cover').style('display', 'block');
	d3.select('#options').style('display', 'block');	
	d3.select('#cog').style('display', 'none');	
}

function updateCategoryList() {
	var oldCategory = document.getElementById('category').value;
	var requiredEmojis = +document.getElementById('target_emoji_count').value + ((+document.getElementById('target_emoji_count').value - 1) * +document.getElementById('clue_emoji_count').value);
	var list = d3.select('select#category');										
	list.selectAll('*').remove();
	var categoryValue = '';
	for (var category of categories) {
		var amount = getCategoryEmojisOnly(category).length;
		if (amount >= requiredEmojis) {
			if (!categoryValue) {
				categoryValue = category;	
			}
			if (oldCategory == category) {
				categoryValue = category;
			}
			list
				.append('option')
				.attr('value', category)
				.html(category);
		}
	}
	d3.select('#category').property('value', categoryValue);
	showCategoryPreview();
}

function showCategoryPreview() {
	var box = d3.select('#category_preview');
	box.selectAll('*').remove();
	var listCategory = document.getElementById('category').value || 'Object';
	var previewEmojis = getCategoryEmojisOnly(listCategory);
	previewEmojis = previewEmojis.slice(0, 5);
	box.text(previewEmojis.join(' '));
}

function optionsCancel() {
	d3.select('#container').style('opacity', 1);
	d3.select('#cog').style('opacity', 1);
	d3.select('#container').style('filter', 'none');
	d3.select('#cog').style('filter', 'none');	
	d3.select('#cover').style('display', 'none');
	d3.select('#options').style('display', 'none');	
	d3.select('#cog').style('display', 'block');	
}

function optionsApply() {
	d3.select('#container').style('opacity', 1);
	d3.select('#cog').style('opacity', 1);
	d3.select('#container').style('filter', 'none');
	d3.select('#cog').style('filter', 'none');	
	d3.select('#cover').style('display', 'none');
	d3.select('#options').style('display', 'none');	
	d3.select('#cog').style('display', 'block');
	selectedCategory = document.getElementById('category').value;
	potentialAnswerCount = document.getElementById('target_emoji_count').value;
	clueEmojiCount = document.getElementById('clue_emoji_count').value;
	startGame();
}

/***** GENERIC ******/

function random(start, end, exclude=[]) {
	var answer;
	do {
		answer = start + Math.floor(Math.random() * (end - start));
	} while (exclude.includes(answer));
	return answer;
}

/*
this function is from
https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
*/
function shuffle(array) {
  var currentIndex = array.length,  randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

startGame();