$(function(){

    // call this function with the value from the search text input on click listener
    function getCocktail(cocktailName,cocktailId){

        var apiKey = "1";
        var returnValue = {};
        if (cocktailName !== null) { var url = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/search.php?s=${cocktailName}`; }
        if (cocktailId !== null) { var url = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/search.php?i=${cocktailId}`;  }
        return fetch(url)
        .then (response => response.json())
        .then((data) => {
            
            // if there is more than one drink, add names to array so the function caller can add buttons
            // ie, "Margarita" will return half a dozen different versions
            var drinksReturned = data.drinks.length;
            if (drinksReturned >= 1) {
                if (drinksReturned === 1) { 

                    // one drink returned
                    var strDrinkThumb = data.drinks[0].strDrinkThumb;
                    var strInstructions = data.drinks[0].strInstructions
                    var strDrink = data.drinks[0].strDrink

                    // create ingredient array
                    var strIngredients = [];
                    for (var i = 1; i <= 15; i++) {
                        var ingredientName = data.drinks[0]["strIngredient"+i];
                        if (ingredientName !== null) {
                            strIngredients.push(ingredientName);
                        }
                    }

                    // return JSON object
                    returnValue = {
                        "status": "success",
                        "strDrink": strDrink,
                        "strDrinkThumb": strDrinkThumb,
                        "strInstructions": strInstructions,
                        "strIngredients": strIngredients                   
                    }
                }
                else {  
                // multiple drinks returned
                    var drinkList = [];
                    data.drinks.map((drink) => {
                        var drinkName = drink.strDrink;
                        var drinkId = drink.strId;
                        drinkList.push({"drinkId": drinkId, "drinkName": drinkName}); 
                    });
                    
                    // append buttonListHTML to modal
                    //console.log("buttonListHTML",buttonListHTML);
                    returnValue = {
                        "status": "success",
                        "drinksList": drinkList                  
                    };
                    return returnValue;
                    // show modal

                 }
             } else {
                // no drinks returned

                returnValue = {
                     "status": "error",
                     "errorMessage": "We couldn't find that Cocktail!"                  
                };
             }
             return returnValue;
        })
        .catch((error) => {
             returnValue = {
                 "status": "error",
                 "errorMessage": error                 
             };
             return returnValue;
        });
       
        
    }

    // call this function from the click listener for each ingredient 
    function getIngredientData(ingredient){

        // https://spoonacular.com/food-api/
        var apiKey = "8745aeb27da04cd69ab054ceafed0495";
        var url=`https://api.spoonacular.com/food/ingredients/search?query=${ingredient}&apiKey=${apiKey}`
        return fetch(url)
        .then(response => response.json())
        .then((data) => {
            returnValue = data;
            return returnValue;
        })
        .catch((error) => {
             returnValue = {
                 "status": "error",
                 "errorMessage": error                 
             };
             return returnValue;
        });

    
    }
    
    // Example Usage
    //getCocktail("Margarita").then(response => console.log(response));
    //getIngredientData("brown sugar").then(response => console.log(response));
});
