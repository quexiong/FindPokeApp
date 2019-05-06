'use strict';

// Constant declarations
const URL = 'https://pokeapi.co/api/v2/pokemon/';
const min = 1;
const max = 493;

// Changeable variables
let score = 0;
let start_Time = 0;
let end_Time = 0;
let time = 0;
let total_Time = 0;
let skipped = 0;
let wrong_Guess = 0;
let random_Generated_Id; // generate a random number from 1-721, assign it to this variable
let generated_Ids = []; // create an empty array, we will store the pokemons that we encountered already in this array, we have to try to prevent duplicates somehow
let unique_Ids = [];
let fetched_Ids = []; // store the ids of fetched data, i may not actually need to use this
let fetched_Names = []; // store the names of fetched data
let randomly_Selected_Name = ''; // randomly select 1 index/id/name from array of fetched pokemon 
let random_Name_Temp = '';
let results = {};

function startTimer(){
	start_Time = new Date();
}

function endTimer(){
	end_Time = new Date();
	let difference = end_Time - start_Time;
	difference /= 1000;
	time = Math.round(difference);
	total_Time += time;
}

// Function for API call
function fetch_Pokemon_Data(array, url){
	for(let i = 0; i < array.length; i ++){
		let final_Url = url + array[i];
		$.getJSON(final_Url, function(data){
			let id = data.id;
			let name = data.name;
			fetched_Ids.push(id);
			fetched_Names.push(name);
			let sprite_Url = data.sprites.front_default;
			$('.sprite-container').append(populate_Game_Board(sprite_Url, name, id));
		}).done(function(){
			select_Random_Name(fetched_Names);
		});
	};
	$(document).ajaxStop(function(){
		$('.answer-container').empty();
		display_Pokemon_Name(randomly_Selected_Name);
		startTimer();
	})
}

// Button/Event handlers
function start_Game(){
	$('.start-btn').on('click', function(event){
		event.preventDefault();
		new_Game_Board();
		$('.landing-container').css('display', 'none');
		$('.main-game-container').css('display', 'block');
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
	});
}

// If skip button is clicked, then reload a new game board, do not increment question count.
function skip_Button(){
	$('#skip-btn').on('click', function(event){
		event.preventDefault();
		skipped ++;
		clear_Data();
		new_Game_Board();
	});
}

function restart_Button(){
	$('#restart-btn').on('click', function(event){
		event.preventDefault();
		location.reload();
	});
}

// unfinished function - need to add penalty to endgame
function calculate_Skip_Penalty(number){
	let penalty = number * (-10);
	return penalty;
}

function generate_Random_Number(min, max){
	random_Generated_Id = Math.floor(Math.random() * (max-min) + min);
	generated_Ids.push(random_Generated_Id);
}

function select_Random_Name(array){
	randomly_Selected_Name = array[Math.floor(Math.random() * array.length)];
	random_Name_Temp = randomly_Selected_Name;
}

function populate_ID_Array(){
	for(let i = 0; i < 20; i ++){
		generate_Random_Number(min, max);
	};
}

function remove_Duplicates(array){
	unique_Ids = [...new Set(array)];
}

function populate_Object(name, time){
	return results[name] = time;
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
	return '<h3>It took you ' + time + ' seconds to find that Pokémon.</h3>'
}

function append_Final_Stats(){
	return '<h3>You needed ' + total_Time + ' seconds to find 10 Pokémon.</h3>' + '<br> <h3> Your score is ' + calculate_Points(results, skipped);
}

function calculate_Points(object, number){
	let total_Points = 0;
	let values = Object.values(object);
	for (let i = 0; i < values.length; i ++){
		if(values[i] <= 5){
			total_Points += 100;
		}
		if(values[i] > 5 && values[i] <= 10){
			total_Points += 50;
		}
		if(values[i] > 10 && values[i] <= 15){
			total_Points += 25;
		}
		if(values[i] > 15){
			total_Points += 10;
		}
	}
	if(number == 0){
		total_Points += 100;
	}
	else{
		let negative_Points = calculate_Skip_Penalty(number);
		total_Points += negative_Points;
	}
	return total_Points;
}

function show_Stats(){
	$('.stats').append(append_Stats());
	$('.sprite-container').css('display', 'none');
	$('.next-container').css('display', 'block');
}

function show_Final_Stats(){
	$('#skip-btn').css('display', 'none');
	$('.sprite-container').css('display', 'none');
	$('.answer-container').append(append_Final_Stats());
}

function check_User_Answer(guess, name){
	if(guess == name){
		score++;
		if(score == 3){
			endTimer();
			populate_Object(randomly_Selected_Name, time);
			clear_Data();
			show_Final_Stats();
			console.log(results);
		}
		else{
			endTimer();
			populate_Object(randomly_Selected_Name, time);
			clear_Data();
			$('.control-container').css('display', 'none');
			show_Stats();
		}
	}
	else{
		alert('Wrong Pokemon!');
		wrong_Guess ++;
	}
}

function clear_Data(){
	$('.sprite-container').empty();
	$('.answer-container').empty();
	$('.stats').empty();
	random_Generated_Id = '';
	randomly_Selected_Name = '';
	generated_Ids.length = 0;
	unique_Ids.length = 0;
	fetched_Ids.length = 0;
	fetched_Names.length = 0;
}

function new_Game_Board(){
	generate_Random_Number(min, max);
	populate_ID_Array();
	remove_Duplicates(generated_Ids);
	fetch_Pokemon_Data(unique_Ids, URL);
}

// Add event listener to the future buttons
$(document).on('click', '.image-btn', function(e){
	let guess = $(this).val();
	check_User_Answer(guess, randomly_Selected_Name);
})

function start_New_Game(){
	start_Game();
	next_Button();
	skip_Button();
	restart_Button();
}

$(start_New_Game);