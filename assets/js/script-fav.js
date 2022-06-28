$(function () {
	// var removeFavCocktail = $(".removeFavCocktail");
	function loadDrinks() {
		var storedCocktails = JSON.parse(
			localStorage.getItem("storedCocktails")
		);
		storedCocktails.forEach((cocktail) => {
			var favouriteDrinkItem;

			if (cocktail != "") {
				favouriteDrinkItem =
					"<li class='col cocktailNameLi list-group-item d-flex justify-content-between align-items-center cocktailFavDrinksButton custom-item'><button id='favouriteDrinkItem'>" +
					cocktail +
					"</button><button class='col-sm col-auto removeFavCocktail'> x</button></li>";
				$("#cocktailFavDiv").append(favouriteDrinkItem);
			}
		});
	}
	loadDrinks();

	//This removes the hearted drinks from list and local storage:
	$(".removeFavCocktail").on("click", function (event) {
		var storedCocktails = JSON.parse(
			localStorage.getItem("storedCocktails")
		);
		var eventTarget = $(event.target);
		var favouritedCocktail = eventTarget.prev().text();
		var removeCocktail = storedCocktails.indexOf(favouritedCocktail);
		storedCocktails.splice(removeCocktail, 1);
		localStorage.setItem(
			"storedCocktails",
			JSON.stringify(storedCocktails)
		);
		$("#cocktailFavDiv").empty();
		loadDrinks();
	});
});
