$(function() {
    
    // get the current stored ingredients from local
    var storedIngredients = JSON.parse(
        localStorage.getItem("storedIngredients")
    );

    // if nothing is stored in local, create array
    if (storedIngredients === null) {
        storedIngredients = [];
    }
    //console.log("storedIngredients",storedIngredients);

    $("#ingredientsDiv").html(`<table id="ingredientsTable"></table>`);
    var html = ``;

    // we'll add up the total price as we loop
    var totalPrice = 0;
    var subPrice = 0;


    function sortBySupplier( a, b ){
        if (a["2"] < b["2"]){
            return -1;
        }
        if ( a["2"] > b["2"]){
            return 1;
        }
        return 0;
    }

    storedIngredients.sort(sortBySupplier);
   
    var oldSupplier = "";
    // loop through ingredients 
    storedIngredients.map((ingredient,index) => {
        
        var newSupplier = ingredient[2];

         
        // calc total price
        
      
        subPrice += parseFloat(ingredient[3].substring(1))
        console.log("subPrice",subPrice);
            
        
        

        if (oldSupplier !== newSupplier && oldSupplier !== "") {
            html += `<tr class="totalTr"><td></td><td class="subTotalLabel">SUB TOTAL:</td><td class="subTotalPrice">$${subPrice.toFixed(2)}</td></tr>`;
            totalPrice = totalPrice + subPrice;
            subPrice = 0;
            
        }        // add table row to string
        html += `
            <tr>
                <td class="itemName">${ingredient[1]}</td>
                <td>${ingredient[2]}</td>
                <td>${ingredient[3]}</td>
            </tr>
        `;        
        if (index === storedIngredients.length-1) {
            html += `<tr class="totalTr"><td></td><td class="subTotalLabel">SUB TOTAL:</td><td class="subTotalPrice">$${subPrice.toFixed(2)}</td></tr>`;
            totalPrice = totalPrice + subPrice;
            subPrice = 0;
            
        } 
        oldSupplier = newSupplier;
    });


    // print string to screen
    $("#ingredientsTable").append(html);

    // append totalprice
    $("#ingredientsTable").append(`<tr class="totalTr"><td></td><td class="overallTotalLabel">TOTAL:</td><td class="overallTotalPrice">$${totalPrice.toFixed(2)}</td></tr></table>`);

});