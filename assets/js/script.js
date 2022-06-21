$(function(){

    // call this function with the value from the search text input on click listener
    function getCocktail(cocktailName){

        var apiKey = "1";

        fetch(`https://www.thecocktaildb.com/api/json/v1/${apiKey}/search.php?s=${cocktailName}`)
        .then (response => response.json())
        .then((data) => {
            console.log(data);
            var drinkInstructions = data.drinks[0].strInstructions;
            var instructionsHTML = `<h2>${cocktailName}</h2><p>${drinkInstructions}</p>`;
            var imgSrc = data.drinks[0].strDrinkThumb;
            var buttonListHTML = "";
            for (var i = 1; i <= 15; i++ ){
                var ingredient = data.drinks[0]["strIngredient"+i];
                if (ingredient !== null) {
                    buttonListHTML += `<button class="ingredientButton" data-ingredient="${ingredient}">${ingredient}</button>`;
                }
            }
            console.log(buttonListHTML);
        })
        .catch((error) => {
            console.error("Error: ", error);
        })
        

    }

    // call this function from the click listener for each ingredient 
    function getIngredientData(ingredient){

        // for testing
        ingredient = "Sugar";

        // https://spoonacular.com/food-api/
        var apiKey = "8745aeb27da04cd69ab054ceafed0495";

        var html=`<p></p>`;

        // insert into modal
    }
    getCocktail("Margarita");
});