$(function () {
	// var removeFavCocktail = $(".removeFavCocktail");
	function loadDrinks() {
		var storedCocktails = JSON.parse(
			localStorage.getItem("storedCocktails")
		);
		storedCocktails.sort()
		storedCocktails = storedCocktails.filter(
			function(i){
				if (!this[i]) {
					this[i] = 1; 
					return i;
				}},
			{}
		   );
		storedCocktails.forEach((cocktail,index) => {
			var favouriteDrinkItem;

			if (cocktail != "") {
				favouriteDrinkItem =
					"<li class='col cocktailNameLi list-group-item d-flex justify-content-between align-items-center cocktailFavDrinksButton custom-item'><button id='"+cocktail.replace(" ","+")+"'>" +
					cocktail +
					"</button><button class='col-sm col-auto removeFavCocktail'> x</button></li>";
				$("#cocktailFavDiv").append(favouriteDrinkItem);
			}
		});
	}
	loadDrinks();

	$("#cocktailFavDiv").on("click",(e) => {
		console.log(e.target.id);
		window.location.href = "/index.html?drink="+e.target.id;
	})
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
