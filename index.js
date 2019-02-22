'use strict';

// FOR REFERENCE: http://www.pokeapi-how.appspot.com/page1

const URL = 'https://pokeapi.co/api/v2/pokemon/';
const min = 1;
const max = 721;

let random_generated_id; // generate a random number from 1-721, assign it to this variable
let generated_ids = []; // create an empty array, we will store the pokemons that we encountered already in this array, we have to try to prevent duplicates somehow
let unique_ids = [];
let fetched_ids = []; // store the ids of fetched data, i may not actually need to use this
let fetched_names = []; // store the names of fetched data
let randomly_selected_name; // randomly select 1 index/id/name from array of fetched pokemon 

//Once the user clicks on the start button, clear the landing page and show the game board to the user.
function start_Game(){
	$('.start-btn-container').on('click', '.start-btn', function(event){
		event.preventDefault();
		$('.content-container').css('display', 'none');
		$('.go-container').css('display', 'block');
		// $('.main-game-container').css('display', 'block');
		generate_Random_Number(min, max);
		populate_ID_Array();
		remove_Duplicates(generated_ids);
		fetch_Pokemon_Data(unique_ids, URL);	
	});
}

function show_Game_Board(){
	$('.go-btn-container').on('click', '.go-btn', function(event){
		event.preventDefault();
		$('.go-container').css('display', 'none');
		$('.main-game-container').css('display', 'block');
		console.log(fetched_names.length);
		select_Random_Name(fetched_names);
		console.log(randomly_selected_name);
		$('.answer-container').append(append_Pokemon_Name(randomly_selected_name));
	})
}

function generate_Random_Number(min, max){
	random_generated_id = Math.floor(Math.random() * (max-min) + min);
	generated_ids.push(random_generated_id);
}

function select_Random_Name(array){
	randomly_selected_name = array[Math.floor(Math.random() * array.length)]
}

function populate_ID_Array(){
	for(let i = 0; i < 180; i ++){
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
	return '<div class="single-sprite-container"> <input type="image" class="image-btn" id="' + name + '" name="' + name + '"src="' + image_Url + '" alt="pokemon sprite button" value="' + name + '"> </div>'
}

function append_Pokemon_Name(name){
	return '<h3>Find <span id="answer">' + name + '</span></h3>'
}

function guess_Pokemon(){
	$('sprite-container').on('click', 'image-btn', (function(event){
		event.preventDefault();
		console.log('clicked');
	}))
}

function start_New_Game(){
	start_Game();
	show_Game_Board();
	guess_Pokemon();
}

$(start_New_Game);