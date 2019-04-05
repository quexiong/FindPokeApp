'use strict';

// Constant declarations
const URL = 'https://pokeapi.co/api/v2/pokemon/';
const min = 1;
const max = 721;

// Changeable variables
let score = 0;
let startTime = 0;
let endTime = 0;
let time = 0;
let totalTime = 0;
let skipped = 0;
let random_generated_id; // generate a random number from 1-721, assign it to this variable
let generated_ids = []; // create an empty array, we will store the pokemons that we encountered already in this array, we have to try to prevent duplicates somehow
let unique_ids = [];
let fetched_ids = []; // store the ids of fetched data, i may not actually need to use this
let fetched_names = []; // store the names of fetched data
let randomly_selected_name = ''; // randomly select 1 index/id/name from array of fetched pokemon 
let random_name_temp = '';

function startTimer(){
	startTime = new Date();
}

function endTimer(){
	endTime = new Date();
	let difference = endTime - startTime;
	difference /= 1000;
	time = Math.round(difference);
	totalTime += time;
	console.log(time + ' seconds');
	console.log('total time: ' + totalTime + ' seconds');
}

// Function for API call
function fetch_Pokemon_Data(array, url){
	for(let i = 0; i < array.length; i ++){
		let final_Url = url + array[i];
		$.getJSON(final_Url, function(data){
			let id = data.id;
			let name = data.name;
			fetched_ids.push(id);
			fetched_names.push(name);
			let sprite_url = data.sprites.front_default;
			$('.sprite-container').append(populate_Game_Board(sprite_url, name, id));
		}).done(function(){
			select_Random_Name(fetched_names);
		});
	};
	$(document).ajaxStop(function(){
		$('.answer-container').empty();
		display_Pokemon_Name(randomly_selected_name);
		console.log('i ran');
	})
}

// Button/Event handlers
function start_Game(){
	$('.start-btn').on('click', function(event){
		event.preventDefault();
		new_Game_Board();
		$('.content-container').css('display', 'none');
		$('.main-game-container').css('display', 'block');
 		startTimer();
	});
}

function next_Button(){
	$('.next-btn').on('click', function(event){
		event.preventDefault();
		clear_Data();
		new_Game_Board();
		$('.next-container').css('display', 'none');
		$('.sprite-container').css('display', 'block');
		$('.control-container').css('display', 'block');
 		startTimer();
	});
}

// If skip button is clicked, then reload a new game board, do not increment question count.
function skip_Button(){
	$('#skip-btn').on('click', function(event){
		event.preventDefault();
		skipped ++;
		console.log(skipped);
		clear_Data();
		new_Game_Board();
 		startTimer();
	});
}

function calculate_Skip_Penalty(number){
	let penalty = number * (-5);
	return penalty;
}

function generate_Random_Number(min, max){
	random_generated_id = Math.floor(Math.random() * (max-min) + min);
	generated_ids.push(random_generated_id);
}

function select_Random_Name(array){
	randomly_selected_name = array[Math.floor(Math.random() * array.length)];
	random_name_temp = randomly_selected_name;
}

function populate_ID_Array(){
	for(let i = 0; i < 150; i ++){
		generate_Random_Number(min, max);
	};
}

function remove_Duplicates(array){
	unique_ids = [...new Set(array)];
}

function display_Pokemon_Name(name){
	$('.answer-container').append(append_Pokemon_Name(name));
}

function populate_Game_Board(image_Url, name, id){
	return '<input type="image" class="image-btn" id="' + name + '" value="' + name + '"src="' + image_Url + '" alt="pokemon sprite button" value="' + name + '">'
}

function append_Pokemon_Name(name){
	return '<h3>Find: <span id="answer">' + name + '</span></h3>'
}

function append_Stats(){
	return '<h3>It took you ' + time + ' seconds to find that Pokémon.</h3>' + '<br> <h3> So far you have found ' + score + ' Pokémon in ' + totalTime + ' seconds.</h3>'
}

function show_Stats(){
	$('.stats').append(append_Stats());
	$('.sprite-container').css('display', 'none');
	$('.next-container').css('display', 'block');
}

function check_User_Answer(guess, name){
	if(guess == name){
		score++;
		console.log(score);
		next_Pokemon();
		endTimer();
		$('.control-container').css('display', 'none');
		show_Stats();
	}
	else{
		alert('Wrong Pokemon!');
	}
}

function clear_Data(){
	$('.sprite-container').empty();
	$('.answer-container').empty();
	$('.stats').empty();
	random_generated_id = '';
	randomly_selected_name = '';
	generated_ids.length = 0;
	unique_ids.length = 0;
	fetched_ids.length = 0;
	fetched_names.length = 0;
}

function next_Pokemon(){
	clear_Data();
	// new_Game_Board();
}

function new_Game_Board(){
	generate_Random_Number(min, max);
	populate_ID_Array();
	remove_Duplicates(generated_ids);
	fetch_Pokemon_Data(unique_ids, URL);
}

// Make the API call and populate the board when page loads, remove the need to wait for API call to finish
// $(document).ready(function(){
// 	new_Game_Board();
// })

// Add event listener to the future buttons
$(document).on('click', '.image-btn', function(e){
	let guess = $(this).val();
	check_User_Answer(guess, randomly_selected_name);
})

function start_New_Game(){
	start_Game();
	next_Button();
	skip_Button();
}

$(start_New_Game);