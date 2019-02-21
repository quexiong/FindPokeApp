'use strict';

// FOR REFERENCE: http://www.pokeapi-how.appspot.com/page1

const URL = 'https://pokeapi.co/api/v2/pokemon/';
const min = 1;
const max = 721;

let random_generated_id; // generate a random number from 1-721, assign it to this variable
let generated_ids = []; // create an empty array, we will store the pokemons that we encountered already in this array, we have to try to prevent duplicates somehow
let fetched_data = [];

//Once the user clicks on the start button, clear the landing page and show the game board to the user.
function start_Game(){
	$('.start-btn-container').on('click', '.start-btn', function(event){
		event.preventDefault();
		$('.content-container').css('display', 'none');
		$('.main-game-container').css('display', 'block');
		generate_Random_Number(min, max);
		console.log(random_generated_id);
		populate_ID_Array();
		fetch_Pokemon_Data(generated_ids, URL);
	});
}

function generate_Random_Number(min, max){
	random_generated_id = Math.floor(Math.random() * (max-min) + min);
	// console.log(random_generated_id);
	function check_For_Duplicates(array, number){
		for(let i = 0; i < array.length; i ++){
			if((array[i] == number)){
				break;
			}
			else{
				array.push(number);
			}
		}
	}
	check_For_Duplicates(generated_ids, random_generated_id);
	console.log(generated_ids);
	generated_ids.push(random_generated_id); 
}

function populate_ID_Array(){
	// console.log(random_generated_id);
	for(let i = 0; i < 130; i ++){
		generate_Random_Number(min, max);
	};
}

//Make the API call to the PokeAPI.
//Populate a flexbox with a random selection of pokemons.
function fetch_Pokemon_Data(array, url){
	for(let i = 0; i < array.length; i ++){
		let final_Url = url + array[i];
		$.getJSON(final_Url, function(data){
			// console.log(data);
			let id = data.id;
			let name = data.name;
			fetched_data.push(name);
			let sprite_url = data.sprites.front_default;
			$('.sprite-container').append(populate_Game_Board(sprite_url, name, id)); 
		});
	};
	// console.log(fetched_data);	
}

function populate_Game_Board(image_Url, name, id){
	return '<div class="single-sprite-container"> <input type="image" class="image-btn" id="' + id + '" name="' + name + '"src="' + image_Url + '" alt="pokemon sprite button"> </div>'
}

function start_New_Game(){
	start_Game();
}

$(start_New_Game);