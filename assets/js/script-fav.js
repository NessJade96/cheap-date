$(function () {
	var storedCocktails = JSON.parse(localStorage.getItem("storedCocktails"));
	storedCocktails.map((cocktail) => {
		console.log(cocktail);
		var favouriteDrinkItem =
			"<button class='cocktailFavDrinksButton'>" + cocktail + "</button>";
		$("#cocktailFavDiv").append(favouriteDrinkItem);
	});
});
