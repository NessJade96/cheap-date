$(function(){

    // call this function with the value from the search text input on click listener
    function getCocktails(cocktailAlcoholType){

        var apiKey = "1";
        var returnValue = {};
        var url = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/filter.php?i=${cocktailAlcoholType}`;
        return fetch(url)
        .then (response => response.json())
        .then((data) => {
            returnValue = {
                "status": "success",
                "data": data                 
            };
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
 
    function getRecipe(drinkId){

        var apiKey = "1";
        var url = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/lookup.php?i=${parseInt(drinkId)}`;
        return fetch(url)
        .then(response => response.json())
        .then((data) => {
            returnValue = {
                "status": "success",
                "data": data                 
            };
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
    getCocktails("Gin").then(response => console.log(response));
    getRecipe("11007").then(response => console.log(response));
//https://spoonacular.com/food-api/

});
