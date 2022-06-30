$(function () {

	var url_string = window.location.href;
	var url = new URL(url_string);
	var drink = url.searchParams.get("drink");
	if (drink != null && drink !== "undefined" && drink != "") {
		getRecipe(drink,false);
	}

	function capatilizeSentence(sentence) {
		var arr = sentence.split(" ");
		for (var i = 0; i < arr.length; i++) {
			arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
		}
		return arr.join(" ");
	}


	//clickhandler to reload the page -> instead of reload page - empty the html from the two drink divs - element.empty() alcoholTypeLi active.
	$(".reloadBtn").on("click", function () {
		$(".reloadBtn").hide();
		$(".heart").hide();
		$("#cocktailNameUl").empty();
		$("#cocktailNameDiv").css({
			'background-image': `url('./assets/images/cocktailNamesUlBG.png')`,
			'background-repeat': 'no-repeat',
			'background-size': 'cover'
		});
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
		$(".alcoholTypeLi").removeClass("active");
		if (window.location.href.indexOf('?') > -1) {
			history.pushState('', document.title, window.location.pathname);
		}
		$("#alcoholTypeUl").show();
		$("#cocktailNameDiv").show();
		$('html, body').animate({scrollTop: $("body").offset().top}, 500);
	});

	//click event listener to save current selected drink to local storage as an Array
	$("#favouriteDrinkButton").on("click", function (event) {
		event.preventDefault();
		var storedCocktails = JSON.parse(
			localStorage.getItem("storedCocktails")
		);
		if (storedCocktails === null) {
			storedCocktails = [];
		}
		var favouritedCocktail = $("#h3DrinkName").text();
		storedCocktails.push(favouritedCocktail);
		localStorage.setItem(
			"storedCocktails",
			JSON.stringify(storedCocktails)
		);
	});

	function addAlcoholNames() {
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
		var html = ``;
		alcoholNamesArray.map((alcohol) => {
			html += `<li class="list-group-item d-flex justify-content-between align-items-center custom-item alcoholTypeLi" id="${alcohol}Li">
			<button id="${alcohol}">${alcohol}</button></li>`;
		});
		$("#alcoholTypeUl").append(html);
	}
	addAlcoholNames();

	function getIngredientPrice(ingredientName, callIngredientName, measure) {
		console.log("getIngredientPrice->ingredientName: ",ingredientName);
		return fetch(
			`https://www.woolworths.com.au/apis/ui/search/products/?searchterm=${encodeURIComponent(ingredientName)}&sorttype=relevance`)
			.then((response) => response.json())
			.then((response) => {
				if (response.products !== null) {

					var thisProduct = response.Products[0];

					// need to send these two straight back so they are in scope for the calling function
					thisProduct["myMeasure"] = measure;
					thisProduct["callIngredientName"] = callIngredientName;

					returnValue = {
						status: "success",
						data: thisProduct,
					};

					return returnValue;
				} else {
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
					errorMessage: "getIngredientPrice response error",
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
					errorMessage: "getCocktails response error",
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
			$("#cocktailNameDiv").hide();
			// this means the call came from the fav page, we need to get the id of this drink
			var url = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/search.php?s=${drinkId}`;
			fetch(url)
				.then((response) => response.json())
				.then((data) => {
					// then create a button and append it
					$("#cocktailNameUl").append(`<li class="list-group-item custom-item cocktailNameLi" id="${data.drinks[0].idDrink}Li"><button class="drinkName" id="${data.drinks[0].idDrink}">${data.drinks[0].strDrink}</button></li>`);

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

	// add listener to alcoholTypeUl. Button clicks will bubble up to this. This saves us putting a listener on every button.
	$("#alcoholTypeUl").on("click", function (e) {
		// prevent default
		e.preventDefault();
		$(".reloadBtn").hide();
		$(".heart").hide();
		// remove active from any LI that currently has it and empty divs
		$(".alcoholTypeLi").removeClass("active");
		$("#cocktailNameUl").empty();
		$("#cocktailNameDiv").css({
			'background-image':'none',
			'background':'var(--mainColor10)'
		});
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
				$("#cocktailNameDivSpinner")
					.removeClass("d-flex")
					.addClass("d-none");
				} else {
					console.log(response.errorMessage);
				}
				$('html, body').animate({scrollTop: $("#cocktailNameUl").offset().top}, 500);
			});
	});

	// event listener for the cocktailNameUl. Button clicks will bubble up to this. This saves us putting a listener on every button.
	$("#cocktailNameUl").on("click", function (e) {
		// prevent default
		e.preventDefault();

		$(".reloadBtn").show();

		$(".heart").show();
		// get the id of the button clicked, ie "11007"
		selectedCocktail = e.target.id;

		// remove the active class from any cocktailNameLi that currently has it
		$(".cocktailNameLi").removeClass("active");
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
								callIngredientName = "Lemonaide";
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
							case "sugar syrup":
								callIngredientName = "Monin Pure Cane Sugar Syrup";
								break;
							case "peach nectar":
								callIngredientName = "Tamek Beverages Peach Nectar 1l";
								break;
							default:
								break;
						}

						// Create array of items not in WW API
						var dodgyIngredientArray = [
						{name: "ice", supplier: "home", string: "From your freezer", price: "Free!"},
						{name: "absinthe", supplier: "danMurphys", string: "Green Fairy Absinth 500Ml", price: "$75.99"},
						{name: "creme de cassis", supplier: "danMurphys", string: "Creme de Cassis", price: "$29.99"},
						{name: "creme de cacao", supplier: "danMurphys", string: "Vok Brown Creme De Cacao 500mL", price: "$27.99"},
						{name: "champagne", supplier: "danMurphys", string: "Special Cuvee Champagne", price: "$86.99"},
						{name: "grenadine", supplier: "danMurphys", string: "Grenadine Syrup", price: "$8.99"},
						{name: "sweet and sour", supplier: "danMurphys", string: "Sweet & Sour Mixer 1L", price: "$14.49"},
						{name: "151 proof rum", supplier: "nicks", string: "Goslings Black Seal 151 Proof Rum 700ml", price: "$130"},
						{name: "blue curacao", supplier: "danMurphys", string: "Vok	Blue Curacao 500mL", price: "$28.99"},
						{name: "strawberry schnapps", supplier: "danMurphys", string: "De Kuyper Strawberry Schnapps 700mL", price: "$42.99"},
						{name: "rosemary syrup", supplier: "home", string: "home", price: "Free"},
						{name: "peach schnapps", supplier: "danMurphys", string: "De Kuyper Peach Schnapps 700mL", price: "$45.99"}
					];

					const ingredientIndex = dodgyIngredientArray.findIndex(item => item.name === callIngredientName.toLowerCase());

						if (ingredientIndex !== -1) {

							// Print the items that aren't in WW API
							ingredientTr = ``;
							ingredientTr += `<tr>`;
							ingredientTr += `
								<td>${capatilizeSentence(dodgyIngredientArray[ingredientIndex].name)}</td>
								<td>${dodgyIngredientArray[ingredientIndex].string}</td>
								<td><img src="./assets/images/${dodgyIngredientArray[ingredientIndex].supplier}.png" /></td>
								<td>${dodgyIngredientArray[ingredientIndex].price}</td>
								<td>${measure}</td></tr>`;
							$("#ingredientsTable").append(ingredientTr);
						}
						else {
							// get the price of this ingredient, also send measure to get it back again, unless it's ice

							getIngredientPrice(
								callIngredientName,
								callIngredientName,
								measure
							)
							.then((response) => {
								if (response.status === "success") {

									// set up the tr
									ingredientTr = ``;
									var thisIngredient =
										response.data.Products[0];
									ingredientTr += `<tr>
								<td>${capatilizeSentence(response.data.callIngredientName)}</td>
								<td>${thisIngredient.Name}</td>
								<td><img src="./assets/images/woolWorths.png" /></td>
								<td>`;

									// sometimes the price comes back null, don't print that
									if (thisIngredient.Price !== null) {
										ingredientTr += `$${thisIngredient.Price}</td>`;
									}
									ingredientTr += `<td>${response.data.myMeasure}</td></tr>`;
								} else {
									ingredientTr = `<tr><td colspan="4">${response.errorMessage}</td></tr>`;
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
				$("#recipeImageSpinner")
					.removeClass("d-flex")
					.addClass("d-none");
				$("#recipeContainerSpinner")
					.removeClass("d-flex")
					.addClass("d-none");
			} else {
				console.log(response.errorMessage);
			}
			$('html, body').animate({scrollTop: $("#ingredientsDiv").offset().top}, 500);
		});
	});
		// FAVOURITES BUTTON FUNCTION
		$(".heart").on("click", function() {
			$(this).toggleClass("is-active");
		});

});
