'use strict';

const URL = 'http://pokeapi.salestock.net/api/v2';
const min = 1;
const max = 721;

let random_generated_id; // generate a random number from 1-721, assign it to this variable
let generated_ids = []; // create an empty array, we will store the pokemons that we encountered already in this array, we have to try to prevent duplicates somehow
let fetched_data = [];

//Once the user clicks on the start button, clear the landing page and show the game board to the user.
function start_Game(){
	$('.start-btn-container').on('click', '.start-btn', function(event){
		$('.content-container').css('display', 'none');
		$('.main-game-container').css('display', 'block');
		populate_ID_Array();
		console.log(generated_ids);
		fetch_Pokemon_Data(generated_ids, URL);
	});
}

function generate_Random_Number(min, max){
	random_generated_id = Math.floor(Math.random() * (max-min) + min);
	generated_ids.push(random_generated_id);
}

function populate_ID_Array(){
	for(let i = 0; i < 20; i ++){
		generate_Random_Number(min, max);
	};
}

//Make the API call to the PokeAPI.
//Populate a flexbox with a random selection of pokemons.
function fetch_Pokemon_Data(array, url){
	for(let i = 0; i < array.length; i ++){
		let final_Url = url + array[i];
		console.log(final_Url);
		$.ajax({url: "final_Url", success: function(data){
			console.log(data);
		}})
	};
}

function start_New_Game(){
	start_Game();
}

$(start_New_Game);