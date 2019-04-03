'use strict';

// FOR REFERENCE: http://www.pokeapi-how.appspot.com/page1

const URL = 'https://pokeapi.co/api/v2/pokemon/';
const min = 1;
const max = 721;

let score = 0;
let startTime = 0;
let endTime = 0;
let totalTime = 0;

let random_generated_id; // generate a random number from 1-721, assign it to this variable
let generated_ids = []; // create an empty array, we will store the pokemons that we encountered already in this array, we have to try to prevent duplicates somehow
let unique_ids = [];
let fetched_ids = []; // store the ids of fetched data, i may not actually need to use this
let fetched_names = []; // store the names of fetched data
let randomly_selected_name; // randomly select 1 index/id/name from array of fetched pokemon 

function startTimer(){
	startTime = new Date();
}

function endTimer(){
	endTime = new Date();
	let difference = endTime - startTime;
	difference /= 1000;
	let time = Math.round(difference);
	totalTime += time;
	console.log(time + ' seconds');
	console.log('total time: ' + totalTime + ' seconds');
}

function start_Game(){
	$('.start-btn').on('click', function(event){
		event.preventDefault();
		$('.content-container').css('display', 'none');
		$('.main-game-container').css('display', 'block');
 		select_Random_Name(fetched_names);
 		startTimer();
	});
}

function next_Button(){
	$('.next-btn').on('click', function(event){
		event.preventDefault();
		console.log('clicked');
		$('.next-container').css('display', 'none');
		$('.sprite-container').css('display', 'block');
 		select_Random_Name(fetched_names);
 		startTimer();
	});
}

function generate_Random_Number(min, max){
	random_generated_id = Math.floor(Math.random() * (max-min) + min);
	generated_ids.push(random_generated_id);
}

function select_Random_Name(array){
	randomly_selected_name = array[Math.floor(Math.random() * array.length)];
	$('.answer-container').append(append_Pokemon_Name(randomly_selected_name));
}

function populate_ID_Array(){
	for(let i = 0; i < 100; i ++){
		generate_Random_Number(min, max);
	};
}

function remove_Duplicates(array){
	unique_ids = [...new Set(array)];
}

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
		});
	};
}

function populate_Game_Board(image_Url, name, id){
	return '<input type="image" class="image-btn" id="' + name + '" value="' + name + '"src="' + image_Url + '" alt="pokemon sprite button" value="' + name + '">'
}

function append_Pokemon_Name(name){
	return '<h3>Find <span id="answer">' + name + '</span></h3>'
}

function check_User_Answer(guess, name){
	if(guess == name){
		score++;
		console.log(score);
		clear_Data();
		next_Pokemon();
		endTimer();
	}
	else{
		alert('Wrong Pokemon!');
	}
}

function clear_Data(){
	$('.sprite-container').empty();
	$('.answer-container').empty();
	random_generated_id = '';
	randomly_selected_name = '';
	generated_ids.length = 0;
	unique_ids.length = 0;
	fetched_ids.length = 0;
	fetched_names.length = 0;
	$('.sprite-container').css('display', 'none');
	$('.next-container').css('display', 'block');
}

function next_Pokemon(){
	clear_Data();
	new_Game_Board();
	// console.log(random_generated_id);
	// console.log(randomly_selected_name);
	// console.log(generated_ids);
	// console.log(unique_ids);
	// console.log(fetched_ids);
	// console.log(fetched_names);
}



function new_Game_Board(){
	generate_Random_Number(min, max);
	populate_ID_Array();
	remove_Duplicates(generated_ids);
	fetch_Pokemon_Data(unique_ids, URL);
}

// Make the API call and populate the board when page loads, remove the need to wait for API call to finish
$(document).ready(function(){
	new_Game_Board();
})

// Add event listener to the future buttons
$(document).on('click', '.image-btn', function(e){
	let guess = $(this).val();
	check_User_Answer(guess, randomly_selected_name);
})

function start_New_Game(){
	start_Game();
	next_Button();
}

$(start_New_Game);