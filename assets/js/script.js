$(function () {

	/* -----------------------------------------------------------------------------------------------------------
									FUNCTIONS
	----------------------------------------------------------------------------------------------------------- */
	function getStoredCocktails() {
		var storedCocktails = JSON.parse(
			localStorage.getItem("storedCocktails")
		);
		if (storedCocktails === null){
			storedCocktails = []
		}

		return storedCocktails
	}
	//function to load the heart button as active if that drink is saved in local storage. 
	function isDrinkFavourited(){
		var storedCocktails = getStoredCocktails()
		
		var activateHeart = $(".cocktailNameLi.active .drinkName").text()
		var isFavourited = storedCocktails.indexOf(activateHeart) > -1
		var heart = $(".heart")
		if (isFavourited) {
			heart.addClass("is-active")
		} else {
			heart.removeClass("is-active")
		}
	}


	// capitalise the first letter of every string
	function capatiliseSentence(sentence) {
		var arr = sentence.split(" ");
		for (var i = 0; i < arr.length; i++) {
			arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
		}
		return arr.join(" ");
	}

	// function to get the price of ingredients from the WW API
	function getIngredientPrice(ingredientName, callIngredientName, measure) {

		// please leave this log so that it is easy to track API failures (product doesn't exist) as they happen
		//console.log("getIngredientPrice->ingredientName: ",ingredientName);
		return fetch(
			`https://www.woolworths.com.au/apis/ui/search/products/?searchterm=${encodeURIComponent(ingredientName)}&sorttype=relevance`)
			.then((response) => response.json())
			.then((response) => {
				if (response.products !== null) {

					// just use the first product returned
					var thisProduct = response.Products[0];

					// need to send these two straight back so they are in scope for the calling function
					thisProduct["myMeasure"] = measure;
					thisProduct["callIngredientName"] = callIngredientName;

					returnValue = {
						status: "success",
						data: thisProduct,
					};

					// and return as a promise
					return returnValue;
				} 
				else {
					returnValue = {
						status: "error",
						data: null,
					};
					return returnValue;
				}
			})
			.catch((error) => {
				returnValue = {
					status: "error",
					errorMessage: "getIngredientPrice response error: " + error,
					ingredient: ingredientName
				};
				return returnValue;
			});
	}
	// call this function with the value from the search text input on click listener
	function getCocktails(cocktailAlcoholType) {
		// is a string, ie "Rum"

		// api key for dev is "1"
		var apiKey = "1";

		// we are going to return a promise containing returnValue object
		var returnValue = {};

		// api endpoint
		var url = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/filter.php?i=${cocktailAlcoholType}`;
		return fetch(url)
			.then((response) => response.json())
			.then((data) => {
				returnValue = {
					status: "success",
					data: data,
				};

				return returnValue;
			})
			.catch((error) => {
				
				
				returnValue = {
					status: "error",
					errorMessage: "getCocktails response error|"+cocktailAlcoholType+"|"+error,
				};
				
				return returnValue;
			});
	}

	function getRecipe(drinkId,isInt) {
		// api key for dev is "1"
		var apiKey = "1";
		if (isInt) {
			drinkId = parseInt(drinkId);
		}
		else {

			$("#alcoholTypeUl").hide();
			$("#cocktailNameDiv").removeClass("d-md-flex").addClass("d-none");
			// this means the call came from the fav page, we need to get the id of this drink
			var url = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/search.php?s=${drinkId}`;
			fetch(url)
				.then((response) => response.json())
				.then((data) => {
					// then create a button and append it
					$("#cocktailNameUl").append(`<li class=" list-group-item custom-item cocktailNameLi" id="${data.drinks[0].idDrink}Li"><button class="drinkName" id="${data.drinks[0].idDrink}">${data.drinks[0].strDrink}</button></li>`);

					// then fake click it
					$("#"+data.drinks[0].idDrink).trigger("click");
				})
				.catch((error) => {
					console.log("getCocktails id from string response error");
				});

		}
		// drink ID is a string ie "11007"


		// we are going to return a promise containing this object
		var returnValue = {};

		// api endpoint
		var url = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/lookup.php?i=${
			drinkId
		}`;

		// and return a promise containing returnValue object
		return fetch(url)
			.then((response) => response.json())
			.then((data) => {
				returnValue = {
					status: "success",
					data: data,
				};
				return returnValue;
			})
			.catch((error) => {
				returnValue = {
					status: "error",
					errorMessage: "getRecipe response error",
				};

				return returnValue;
			});
	}

	function addAlcoholNames() {

		// this is a list of alcohols that will appear on the front page
		var alcoholNamesArray = [
			"Absinthe",
			"Tequila",
			"Gin",
			"Vodka",
			"Rum",
			"Whiskey",
			"Brandy",
			"Beer",
			"Wine",
			"Champagne",
			"Cognac",
		];

		// create the string that we will write to the page later
		var html = ``;

		// loop through the alcohol name and create li's and buttons by concating string
		alcoholNamesArray.map((alcohol) => {
			html += `<li class=" list-group-item d-flex justify-content-between align-items-center custom-item alcoholTypeLi" id="${alcohol}Li">
			<button id="${alcohol}">${alcohol}</button></li>`;
		});

		// and print the li's and buttons to the alcoholTypeUl list
		$("#alcoholTypeUl").append(html);
	}

	/* -----------------------------------------------------------------------------------------------------------
									CLICK HANDLERS
	----------------------------------------------------------------------------------------------------------- */


	//clickhandler to reload the page -> instead of reload page - empty the html from the two drink divs - element.empty() alcoholTypeLi active.
	$(".reloadBtn").on("click", function () {

		// hide the reload button, fav icon, and trolley icon
		$(".reloadBtn").hide();
		$(".heart").hide();
		$(".trolley").hide();

		// empty the cocktailNameUL and add the BG placeholder image, 
		$("#cocktailNameUl").empty();
		$("#cocktailNameDiv").css({
			'background-image': `url('./assets/images/cocktailNamesUlBG.png')`,
			'background-repeat': 'no-repeat',
			'background-size': 'cover'
		});

		// remove the old cocktail image, change BG of imageWrapper to place holder, add d-none back to image wrapper
		$("#imageDiv").css({
			'background-image':'none'
		});
		$("#imageWrapper").addClass("d-none");

		$("#imageWrapper").css({
			'background-image': `url('./assets/images/cocktailNamesUlBG.png')`,
			'background-repeat': 'no-repeat',
			'background-size': 'cover'
		});

		// empty ingredients stuff
		$("#ingredientsDiv").empty();
		$("#recipeHeader").empty();
		$("#recipeSpan").empty();

		// remove the highlight from alcohol type button
		$(".alcoholTypeLi").removeClass("active");

		// delete the querystring which will be there if came from favs page
		if (window.location.href.indexOf('?') > -1) {
			history.pushState('', document.title, window.location.pathname);
		}

		// show the alcohol type, cocktail name div, and image wrapper div
		$("#alcoholTypeUl").show();
		$("#cocktailNameDiv").addClass("d-md-flex");
		$("#imageWrapper").addClass("d-md-flex");
		$('html, body').animate({scrollTop: $("body").offset().top}, 500);
	});





	$("#trolleyButton").on("click", function (event) {

		// prevent the page from reloading
		event.preventDefault();

		// get the current stored ingredients from local
		var storedIngredients = JSON.parse(
			localStorage.getItem("storedIngredients")
		);

		// if nothing is stored in local, create array
		if (storedIngredients === null) {
			storedIngredients = [];
		}
		
		// loop over each row of the table
		var thisIngredientsList = $('table#ingredientsTable tr').map(function() {

			// loop over each td in the tr
			return $(this).find('td').map(function() {

				// return the html content of the td
				return $(this).html();
			});
			
		// keep the tr as it's own object
		}).get();

		// loop over the array of objects created above
		thisIngredientsList.map((thisEntry) => {

			// if the name (object key 0) of the object doesn't equal thisIngredient, then add it to the storedIngredients array
			if (storedIngredients.findIndex(storedIngredient => thisEntry[0] === storedIngredient[0] ) === -1) {
				storedIngredients.push(thisEntry);
			}
		});

		// save the new storedIngredients array to local as a string
		localStorage.setItem(
			"storedIngredients",
			JSON.stringify(storedIngredients)
		);	
	});




	

	// add listener to alcoholTypeUl. Button clicks will bubble up to this. This saves us putting a listener on every button.
	$("#alcoholTypeUl").on("click", function (e) {

		// prevent default
		e.preventDefault();

		// hide unneeded buttons
		$(".reloadBtn").hide();
		$(".heart").hide();
		$(".trolley").hide();

		// remove active from any LI that currently has it and empty divs
		$(".alcoholTypeLi").removeClass("active");

		// empty cocktail name div and and allow it to show > mobile screens
		$("#cocktailNameUl").empty();
		// $("#cocktailNameDiv").css({
		// 	'background-image':'none',
		// 	'background':'var(--mainColor10)'
		// });
		$("#cocktailNameDiv").removeClass("d-none").addClass("d-md-flex");


		$("#imageWrapper").addClass("d-md-flex");
		$("#imageDiv").css({
			'background-image':'none'
		});

		$("#imageWrapper").css({
			'background-image': `url('./assets/images/cocktailNamesUlBG.png')`,
			'background-repeat': 'no-repeat',
			'background-size': 'cover'
		});
		$("#ingredientsDiv").empty();
		$("#recipeHeader").empty();
		$("#recipeSpan").empty();

		// add active class to then parent Li of the button they pressed
		$("#" + e.target.id + "Li").addClass("active");

		// empty the cocktailNameUl	so we can append new items there
		$("#cocktailNameUl").empty();
		$("#cocktailNameDiv").css({
			'background-image':'none',
			'background':'var(--mainColor10)'
		});
		// turn on spinner
		$("#cocktailNameDivSpinner").removeClass("d-none").addClass("d-flex");

		// make the api call to get all drinks with e.target.id, ie "Rum" in the ingredients
		getCocktails(e.target.id).then((response) => {
			if (response.status === "success") {
				var drinks = response.data.drinks;
				var buttonsHTML = ``;

				// loop through the returned cocktails
				drinks.map((drink) => {
					// write a li and button to the buttonsHTML variable
					buttonsHTML += `<li class="list-group-item custom-item cocktailNameLi" id="${drink.idDrink}Li"><button class="drinkName" id="${drink.idDrink}">${drink.strDrink}</button></li>`;
				});

				// append the buttonsHTML variable to the cocktailNameUl ul
				$("#cocktailNameUl").append(buttonsHTML);

				// turn off spinner
				$("#cocktailNameDivSpinner").removeClass("d-flex").addClass("d-none");
			} 
			else {
				console.log(response.errorMessage);
				// The call failed. Check if the last two letters are Li or Ul, this will indicate that the click registered on the LI or Ul, not the button
				if (e.target.id.slice(-2) === "Li" || e.target.id.slice(-2) === "Ul") {

					// if it did, trim the erroneous characters of and call again
					$("#"+e.target.id.slice(0,-2)).click();
				}
				else {
					$("#exampleModalLongTitle").text("API ERROR");
					$("#modal-body-div").text("Please try again");
					$("#modal-footer-div").html(`<button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>`);
					$("#myModal").modal('show');
				}
			}
			$('html, body').animate({scrollTop: $("#cocktailNameUl").offset().top}, 500);
		});
	});


	
	
	// event listener for the cocktailNameUl. Button clicks will bubble up to this. This saves us putting a listener on every button.
	$("#cocktailNameUl").on("click", function (e) {

		// prevent default
		e.preventDefault();

		// show buttons
		$(".reloadBtn").show();
		$(".heart").show();
		$(".trolley").show();
		
		// get the id of the button clicked, ie "11007"
		selectedCocktail = e.target.id;
		
		// remove the active class from any cocktailNameLi that currently has it
		$(".cocktailNameLi").removeClass("active");
		
		// remove the cocktail image if there is one, add the image div place holder image
		$("#imageDiv").css({'background-image':'none'});
		$("#imageWrapper").css({
			'background-image': `url('./assets/images/cocktailNamesUlBG.png')`,
			'background-repeat': 'no-repeat',
			'background-size': 'cover'
		});
		$("#imageWrapper").removeClass("d-none");

		// show the image div
		$("#imageWrapper").addClass("d-md-flex");
		$("#ingredientsDiv").empty();
		$("#recipeHeader").empty();
		$("#recipeSpan").empty();

		// add the active class the the li parent of the button pressed.
		$("#" + e.target.id + "Li").addClass("active");
		
		// turn on the spinner
		$("#recipeImageSpinner").removeClass("d-none").addClass("d-flex");
		$("#recipeContainerSpinner").removeClass("d-none").addClass("d-flex");
		
		// api call to get the recipe of the selected cocktail
		getRecipe(e.target.id, true).then((response) => {
			if (response.status === "success") {
				// empty ingredients div
				$("#ingredientsDiv").empty();
				
				// setup ingredients string
				$("#ingredientsDiv").append(`<table id="ingredientsTable">`);
				for (var i = 1; i <= 15; i++) {
					var ingredientTr = ``;

					// need to send measure in getIngredientPrice function call to get it back again in scope
					// there must be a better way to do this...
					var measure = response.data.drinks[0]["strMeasure" + i];
					var callIngredientName =
					response.data.drinks[0]["strIngredient" + i];
					// The drinks object will include all 15 ingredients, the unsed ones will be null or "", we don't want those
					if (
						response.data.drinks[0]["strIngredient" + i] !== null &&
						response.data.drinks[0]["strIngredient" + i] !== ""
					) {
						
						// put ingredients that we want to rename here
						switch (callIngredientName.toLowerCase()) {
							case "roses sweetened lime juice":
								callIngredientName = "lime juice";
								break;
							case "lemon peel":
								callIngredientName = "Lemon";
								break;
							case "7-up":
								callIngredientName = "Lemonade";
								break;
							case "cherry":
								callIngredientName = "Cherries";
								break;
							case "club soda":
								callIngredientName = "Soda Water";
								break;
							case "cherry grenadine":
								callIngredientName = "Grenadine";
								break;
							case "apple cider":
								callIngredientName = "Somersby Apple Cider";
								break;
							case "peach nectar":
								callIngredientName = "Tamek Beverages Peach Nectar 1l";
								break;
							case "kirschwasser":
								callIngredientName = "Kirsch";
								break;
							case "schweppes Russchian":
								callIngredientName = " Sanpellegrino Tonica Citrus Flavoured Tonic Water";
								break;
							case "creme de menthe":
								callIngredientName = "Marie Brizard - Cr??me De Menthe 500ml";
								break;
							case "Lemonaide":
								
								callIngredientName = "Lemonade";
								break;
							case "scotch":
								callIngredientName = "Johnnie Walker Red Label Scotch Whisky";
								break;
								
							default:
								break;
						}
						
						// Create array of items not in WW API
						var dodgyIngredientArray = [
							{name: "ice", supplier: "Home", string: "Ice", price: "Free!"},
							{name: "absinthe", supplier: "Dan+Murphys", string: "Green Fairy Absinth 500Ml", price: "$75.99"},
							{name: "creme de cassis", supplier: "Dan+Murphys", string: "Creme de Cassis", price: "$29.99"},
							{name: "creme de cacao", supplier: "Dan+Murphys", string: "Vok Brown Creme De Cacao 500mL", price: "$27.99"},
							{name: "champagne", supplier: "Dan+Murphys", string: "Special Cuvee Champagne", price: "$86.99"},
							{name: "grenadine", supplier: "Dan+Murphys", string: "Grenadine Syrup", price: "$8.99"},
							{name: "sweet and sour", supplier: "Dan+Murphys", string: "Sweet & Sour Mixer 1L", price: "$14.49"},
							{name: "151 proof rum", supplier: "Nicks+Wine+Merchants", string: "Goslings Black Seal 151 Proof Rum 700ml", price: "$130"},
							{name: "blue curacao", supplier: "Dan+Murphys", string: "Vok	Blue Curacao 500mL", price: "$28.99"},
							{name: "strawberry schnapps", supplier: "Dan+Murphys", string: "De Kuyper Strawberry Schnapps 700mL", price: "$42.99"},
							{name: "rosemary syrup", supplier: "Home", string: "home", price: "Free"},
							{name: "peach schnapps", supplier: "Dan+Murphys", string: "De Kuyper Peach Schnapps 700mL", price: "$45.99"},
							{name: "licorice root", supplier: "The+Licorice+Shop", string: "Pure Licorice Root", price: "$3.00"},
							{name: "wormwood", supplier: "iHerb", string: "Wormwood, 1 fl oz", price: "$22.32 "},
							{name: "white creme de menthe", supplier: "Nicks+Wine+Merchants", string: "Baitz White Creme de Menthe Liqueur (500ml)", price: "$26.99"},
							{name: "everclear", supplier: "Dan+Murphys", string: "Poliakov Vodka 700mL", price: "$38.99"},
							{name: "sloe gin", supplier: "Dan+Murphys", string: "Hayman's Sloe Gin 700mL", price: "$59.00"},
							{name: "apricot brandy", supplier: "Dan+Murphys", string: "Massenez	Apricot Brandy liqueur 25% 500mL", price: "$47.80"},
							{name: "green creme de menthe", supplier: "Dan+Murphys", string: "Vok Green Creme De Menthe 500mL", price: "$25.00"},
							{name: "apple schnapps", supplier: "Dan+Murphys", string: "De Kuyper Apple Schnapps 700Ml", price: "$36.80"},
							{name: "sugar syrup", supplier: "Woolworths", string: "Monin Pure Cane Sugar Syrup", price: "$16.00"},
							{name: "passoa", supplier: "Dan+Murphys", string: "Passoa Passionfruit Liqueur 700mL", price: "$44.99"},
							{name: "lemon-lime soda", supplier: "Woolworths", string: "Schweppes Natural Mineral Water Lemon & Lime 1.1l", price: "$1.40"},
							{name: "mint", supplier: "Home", string: "Mint Leaves", price: "$0.00"},
							{name: "peach bitters", supplier: "Dan+Murphys", string: "The Bitter Truth Peach Bitters 200mL", price: "$46.00"},
							{name: "pernod", supplier: "Dan+Murphys", string: "Pernod 700mL", price: "$51.99"},
							{name: "gold rum", supplier: "Dan+Murphys", string: "Elements 8 Gold Rum 700mL", price: "$64.90"},
							{name: "hot damn", supplier: "Dan+Murphys", string: "FireBomb Cinnamon Schnapps 700mL", price: "$34.00"}
						];

console.log(callIngredientName);
					const ingredientIndex = dodgyIngredientArray.findIndex(item => item.name === callIngredientName.toLowerCase());

					if (ingredientIndex !== -1) {

						// Print the items that aren't in WW API
						ingredientTr = ``;
						ingredientTr += `
							<tr>
								<td>${capatiliseSentence(dodgyIngredientArray[ingredientIndex].name)}</td>
								<td class="ingredientLongName">${dodgyIngredientArray[ingredientIndex].string}</td>
								<td class="ingredientSupplierLogo"><img src="./assets/images/${dodgyIngredientArray[ingredientIndex].supplier.replaceAll("+","")}.png" /></td>
								<td>${dodgyIngredientArray[ingredientIndex].price}</td>
								<td>${(measure !== null)?measure:""}</td>
							</tr>`;
							$("#ingredientsTable").append(ingredientTr);
						}
						else {

							// get the price of this ingredient, also send measure to get it back again, unless it's ice
							getIngredientPrice(callIngredientName,callIngredientName,measure)
							.then((response) => {
								if (response.status === "success") {

									// set up the tr
									ingredientTr = ``;
									var thisIngredient =
										response.data.Products[0];
										ingredientTr += `<tr>
										<td>${capatiliseSentence(response.data.callIngredientName)}</td>
										<td class="ingredientLongName">${thisIngredient.Name}</td>
										<td class="ingredientSupplierLogo"><img src="./assets/images/Woolworths.png" /></td>
										<td>`;
								
									// sometimes the price comes back null, don't print that
									if (thisIngredient.Price !== null) {
										ingredientTr += `$${thisIngredient.Price}</td>`;
									}
									ingredientTr += `<td>${(response.data.myMeasure !== null)?response.data.myMeasure:""}</td></tr>`;
								} else {
									ingredientTr = `<tr><td>${response.ingredient}</td> <td></td> <td></td> <td>$0.00</td>  <td></td> </tr>`;
								}
							})
							.then(() => {
								// append the tr to ingredientsTable
								$("#ingredientsTable").append(ingredientTr);
							});
						}
					}
				}
				
				// print the image, name and instructions to recipeDiv
				$("#imageDiv").css({
					'background-image':`url(${response.data.drinks[0].strDrinkThumb})`,
					'background-repeat': 'no-repeat',
					'background-size': 'contain'
				});
				
				$("#imageWrapper").css({
					'background-image':`none`,
					'background': 'var(--mainColor10)'
				});
				$("#recipeHeader").html(
					`<h3 id="h3DrinkName">${response.data.drinks[0].strDrink}<h3>`
				);
				$("#recipeSpan").html(
					`<p>${response.data.drinks[0].strInstructions}</p>`
					);
					
					// turn off the spinner
					$("#recipeImageSpinner").removeClass("d-flex").addClass("d-none");
					$("#recipeContainerSpinner").removeClass("d-flex").addClass("d-none");
					
					// check if drink is a fav
					isDrinkFavourited();
					
				} else {
					console.log(response.errorMessage);

					// The call failed. Check if the last two letters are Li or Ul, this will indicate that the click registered on the LI or Ul, not the button
					if (e.target.id.slice(-2) === "Li" || e.target.id.slice(-2) === "Ul") {

						// if it did, trim the erroneous characters of and call again
						$("#"+e.target.id.slice(0,-2)).click();
					}
					else {
						$("#exampleModalLongTitle").text("API ERROR");
						$("#modal-body-div").text("Please try again");
						$("#modal-footer-div").html(`<button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>`);
						$("#myModal").modal('show');
					}
			}

			// auto scroll to ingredients
			$('html, body').animate({scrollTop: $("#ingredientsDiv").offset().top}, 500);
		});
	});

	// FAVOURITES BUTTON FUNCTION
	/* SOURCE: https://codepen.io/mattbhenley/pen/gQbWgd */
	$(".heart").on("click", function() {
		var drinkName = $(".cocktailNameLi.active .drinkName").text()
		var storedCocktails = getStoredCocktails()
		var drinkNameIndex = storedCocktails.indexOf(drinkName)
		if (drinkNameIndex > -1) {
			storedCocktails.splice(drinkNameIndex, 1);
		} else {
			storedCocktails.push(drinkName)
		}

		localStorage.setItem(
			"storedCocktails",
			JSON.stringify(storedCocktails)
		);
		isDrinkFavourited();
	});

	// TROLLEY BUTTON FUNCTION
	/* SOURCE: https://codepen.io/mattbhenley/pen/gQbWgd */
	$(".trolley").on("click", function() {
		$(this).toggleClass("is-active");
		setTimeout(() => {$(this).toggleClass("is-active");},500);
	});



	/* -----------------------------------------------------------------------------------------------------------
									RUNS ON PAGE LOAD
	----------------------------------------------------------------------------------------------------------- */
	

	// get the query string if we came from favs page and auto load cocktail
	var url_string = window.location.href;
	var url = new URL(url_string);
	var drink = url.searchParams.get("drink");
	if (drink != null && drink !== "undefined" && drink != "" && drink !== undefined ) {
		getRecipe(drink,false);
	}

	// call the addAlcoholNames on page load
	addAlcoholNames();

	// when we come back from facs page we need to know if the drink is favourited
	isDrinkFavourited();

	// MODAL USAGE
	// to change title text = $("exampleModalLongTitle").text("");
	// to add body text = $("#modal-body-div").text("");
	// add close button = $("").append(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`);
	// add save button = $("").append(`<button type="button" class="btn btn-primary">Save changes</button>`);
	// to open modal = $("myModal").modal(options);

});
