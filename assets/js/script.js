$(function () {
	//clickhandler on the nav bar:
	$("#aboutButtonNav").on("click", function () {
		console.log("takes you to the about page");
		//Once the html is complete this funciton will hide all the pages, then make the about page visible.
		$(this).addClass("displayHTML"); //need to add in css to show display
		$("#homePage").addClass("hideHTML");
		$("#favouritesPage").addClass("hideHTML"); //Names for the divs that wrap the home and favourites pages // need to add in css class "hideHTML" to hide display
	});
	//clickhandler on the nav bar:
	$("#favouritesButtonNav").on("click", function () {
		console.log("takes you to the favourites page");
		$(this).addClass("displayHTML"); //need to add in css to show display
		$("#homePage").addClass("hideHTML");
		$("#aboutPage").addClass("hideHTML"); //Names for the divs that wrap the home and about pages // need to add in css class "hideHTML" to hide display
	});
	//clickhandler on the nav bar:
	$("#homeButtonNav").on("click", function () {
		console.log("takes you to the home page");
		$(this).addClass("displayHTML"); //need to add in css to show display
		$("#aboutPage").addClass("hideHTML");
		$("#favouritesPage").addClass("hideHTML"); //Names for the divs that wrap the about and favourites pages // need to add in css class "hideHTML" to hide display
	});
	//clickhandler to reload the page -> instead of reload page - empty the html from the two drink divs - element.empty() alcoholTypeLi active.
	$("#reloadPage").on("click", function () {
		$("#cocktailNameUl").empty();
		$("#recipeDiv").empty();
		$(".alcoholTypeLi").removeClass("active");
	});

	//click event listener to save current selected drink to local storage
	$("#favouriteDrinkButton").on("click", function (event) {
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
		storedCocktails.map((cocktail) => {
			console.log(cocktail);
			var favouriteDrinkItem =
				"<button class='cocktailFavDrinksButton'>" +
				favouritedCocktail +
				"</button>";
			$("#cocktailFavDiv").append(favouriteDrinkItem);
		});
	});

	// call this function with the value from the search text input on click listener
	function getCocktails(cocktailAlcoholType) {  // is a string, ie "Rum"

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
					errorMessage: error,
				};

				return returnValue;
			});
	}

	function getRecipe(drinkId) { // drink ID is a string ie "11007"

		// api key for dev is "1"
		var apiKey = "1";

		// we are going to return a promise containing this object
		var returnValue = {};

		// api endpoint
		var url = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/lookup.php?i=${parseInt(drinkId)}`;

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
					errorMessage: error,
				};
				return returnValue;
			});
	}

	//https://spoonacular.com/food-api/

	// add listener to alcoholTypeUl. Button clicks will bubble up to this. This saves us putting a listener on every button.
	$("#alcoholTypeUl").on("click", function (e) {

		// prevent default 
		e.preventDefault();

		// remove active from any LI that currently has it
		$(".alcoholTypeLi").removeClass("active");

		// add active class to then parent Li of the button they pressed
		$("#"+e.target.id+"Li").addClass("active");

		// empty the cocktailNameUl	so we can append new items there
		$("#cocktailNameUl").empty();

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
			}
		
		});
	});

	// event listener for the cocktailNameUl. Button clicks will bubble up to this. This saves us putting a listener on every button.
	$("#cocktailNameUl").on("click", function (e) {

		// prevent default 
		e.preventDefault();

		// get the id of the button clicked, ie "11007"
		selectedCocktail = e.target.id;

		// remove the active class from any cocktailNameLi that currently has it
		$(".cocktailNameLi").removeClass("active");

		// add the active class the the li parent of the button pressed.
		$("#"+e.target.id+"Li").addClass("active");

		// turn on the spinner
		$("#recipeImageSpinner").removeClass("d-none").addClass("d-flex");
		$("#recipeContainerSpinner").removeClass("d-none").addClass("d-flex");

		// api call to get the recipe of the selected cocktail
		getRecipe(e.target.id).then((response) => {
			if (response.status === "success") {
				
			// print the image, name and instructions to recipeDiv
			$("#imageDiv").html(`<img src="${response.data.drinks[0].strDrinkThumb}"/>`);
			$("#recipeHeader").html(`<h3 id="h3DrinkName">${response.data.drinks[0].strDrink}<h3>`);
			$("#recipeSpan").html(`<p>${response.data.drinks[0].strInstructions}</p>`);

			// turn off the spinner
			$("#recipeImageSpinner").removeClass("d-flex").addClass("d-none");
			$("#recipeContainerSpinner").removeClass("d-flex").addClass("d-none");
			}
			else {
				console.log(response.errorMessage);
			}
		});
	});
});
