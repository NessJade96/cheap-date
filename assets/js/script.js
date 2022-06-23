$(function () {
	var selectedCocktail;
	//clickhandler on the nav bar:
	$("#aboutButtonNav").on("click", function () {
		console.log("takes you to the about page");
		//Once the html is complete this funciton will hide all the pages (display: hidden), then make the about page visible (display:flex).
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
	//clickhandler to reload the page
	$("#reloadPage").on("click", function () {
		location.reload();
	});
	//click event listener to save current selected drink to local storage
	$("#favouriteDrinkButton").on("click", function () {
		localStorage.setItem("favouriteCocktail", selectedCocktail);
		var favouritedCocktail = localStorage.getItem("favouriteCocktail");
		console.log(favouritedCocktail);
		console.log(typeof favouritedCocktail);
		favouritedCocktail.split(",");
		console.log(favouritedCocktail);
		//need to add to favourites html - via buttons
		Array.from(favouritedCocktail).forEach(function () {
			var favouriteDrinkItem =
				"<button class='cocktailFavDrinksButton'>" +
				favouritedCocktail +
				"</button>";
			$("#cocktailFavDiv").append(favouriteDrinkItem);
		});
	});

	// call this function with the value from the search text input on click listener
	function getCocktails(cocktailAlcoholType) {
		var apiKey = "1";
		var returnValue = {};
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

	function getRecipe(drinkId) {
		var apiKey = "1";
		var url = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/lookup.php?i=${parseInt(
			drinkId
		)}`;
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

	// Example Usage
	// getCocktails("Gin").then(response => console.log(response));
	// getRecipe("11007").then(response => console.log(response));
	//https://spoonacular.com/food-api/

	$("#alcoholTypeDiv").on("click", function (e) {
		getCocktails(e.target.id).then((response) => {
			var drinks = response.data.drinks;
			var buttonsHTML = ``;
			drinks.map((drink) => {
				buttonsHTML += `<button class="drinkName" id="${drink.idDrink}">${drink.strDrink}</button>`;
			});
			$("#drinkNameDiv").append(buttonsHTML);
		});
	});
	$("#drinkNameDiv").on("click", function (e) {
		selectedCocktail = e.target.id;
		console.log(e.target.id);
		console.log(selectedCocktail);
		getRecipe(e.target.id).then((response) => console.log(response));
	});
});
