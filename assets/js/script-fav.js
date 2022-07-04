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
					"<li class='col-12 favouriteNameLi list-group-item d-flex justify-content-between align-items-center cocktailFavDrinksButton custom-item' id='"+cocktail.replace(" ","+")+"-Li'><button id='"+cocktail.replace(" ","+")+"'>" +
					cocktail +
					"</button><button class='col-2 removeFavCocktail'> <i class='bi bi-heartbreak-fill'></i></button></li>";
				$("#cocktailFavDiv").append(favouriteDrinkItem);
				$(".trolley").show();
			}
		});
	}
	
	loadDrinks();

	$("#cocktailFavDiv").on("click",(e) => {
		console.log(e.target.id);

		// sometimes the click will register on the Li, not the button
		if (e.target.id.slice(-3) === "-Li") {
			var query = e.target.id.slice(0,-3);
		}
		else {
			var query = e.target.id;
		}
		window.location.href = "./index.html?drink="+query;
	})


	//This removes the hearted drinks from list and local storage:
	$(".removeFavCocktail").on("click", function (event) {
		event.stopPropagation()
		var storedCocktails = JSON.parse(
			localStorage.getItem("storedCocktails")
		);
		var eventTarget = $(event.target);
		var favouritedCocktail = eventTarget.parent().prev().text();
		var removeCocktail = storedCocktails.indexOf(favouritedCocktail);

		if (removeCocktail > -1) {

			storedCocktails.splice(removeCocktail, 1);
			localStorage.setItem(
				"storedCocktails",
				JSON.stringify(storedCocktails)
				);
				$("#cocktailFavDiv").empty();
				loadDrinks();
			}
	});
});
