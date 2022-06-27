$(function () {
	// var removeFavCocktail = $(".removeFavCocktail");
	var favouriteDrinkItem;
	var storedCocktails;
	function loadDrinks() {
		storedCocktails = JSON.parse(localStorage.getItem("storedCocktails"));
		storedCocktails.map((cocktail) => {
			console.log(cocktail);
			favouriteDrinkItem =
				"<div><button class='cocktailFavDrinksButton'>" +
				cocktail +
				"<button class='removeFavCocktail'> x</button></button></div>";
			$("#cocktailFavDiv").append(favouriteDrinkItem);
		});
	}
	loadDrinks();

	$(".removeFavCocktail").on("click", function (event) {
		eventPrev = event.prev;
		storedCocktails = storedCocktails.splice(eventPrev);

		// var currentTarget = $(event.currentTarget);
		// var favCocktail = currentTarget.prev();
		// console.log(typeof favCocktail);
		// console.log(favCocktail);

		// console.log(storedCocktails);
		// storedCocktails = $.grep(storedCocktails, function (value) {
		// 	return value != favouriteDrinkItem;
		// });
		// console.log(storedCocktails);
	});
});
