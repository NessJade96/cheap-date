$(function() {
    /* -----------------------------------------------------------------------------------------------------------
									FUNCTIONS
	----------------------------------------------------------------------------------------------------------- */

    function sortBySupplier( a, b ){
        if (a["2"] < b["2"]){
            return -1;
        }
        if ( a["2"] > b["2"]){
            return 1;
        }
        return 0;
    }

    function getStoredIngredients(){
        // get the current stored ingredients from local
        var storedIngredients = JSON.parse(
            localStorage.getItem("storedIngredients")
        );

        // if nothing is stored in local, create array, else print the cart items
        if (storedIngredients === null) {
            storedIngredients = [];
        }
        return storedIngredients;
    }

    function printCartToScreen() {
        
        var storedIngredients = getStoredIngredients();

        if (storedIngredients.length === 0) {

            // hide buttons
            $("#empty").hide();
            $("#print").hide();
            
            // update page text
            $("#pageText").text(`There are no items in your cart!`);
        }
        else {
            // update page text
            $("#pageText").text(`You can print this page to make your shopping easier! `);

            // show buttons
            $("#empty").show();
            $("#print").show();

            var html = ``;

            // we'll add up the total price as we loop
            var totalPrice = 0;
            var subPrice = 0;

            storedIngredients.sort(sortBySupplier);

            var oldSupplier = "";
            // loop through ingredients 
            storedIngredients.map((ingredient,index) => {
                if (ingredient[0] != "getIngredientPrice response error") {

                    // get supplier name from the image tag, regex ads a space before a capital letter
                    var newSupplier = ingredient[2].replace("<img src=\"./assets/images/","").replace(".png\">","").replace(/([A-Z])/g, " $1").trim();

                    // write sub total if supplier has changed, except on the first loop
                    if (oldSupplier !== newSupplier && oldSupplier !== "") {
                        html += `<tr class="totalTr" id="${oldSupplier.replaceAll(" ","")}-subTotalPrice"><td class="noPrint"></td><td class="subTotalLabel">SUB TOTAL:</td><td id="${oldSupplier.replaceAll(" ","")}-subTotalPrice" class="subTotalPrice">$${subPrice.toFixed(2)}</td><td></td></tr>`;
                        totalPrice = totalPrice + subPrice;
                        subPrice = 0;     
                    } 

                    // calc total price
                    if (ingredient[3] !== "Free!" && ingredient[3] !== null && ingredient[3] !== "" && ingredient[3] !== "undefined" && ingredient[3] !== undefined) {
                        subPrice += parseFloat(ingredient[3].substring(1));
                    }

                    // if this is a new supplier, print their name
                    if (newSupplier !== oldSupplier){
                        html += `<tr class="supplierTr" id="${newSupplier.replaceAll(" ","")}-header"><td class="supplierTd">${newSupplier}</td><td></td><td></td><td></td></tr>`;
                    }       
                    
                    // add table row to string
                    html += `
                        <tr id="itemTr-${index}" class="${newSupplier}">
                            <td class="itemName">${ingredient[1]}</td>
                            <td class="noPrint">${ingredient[2]}</td>
                            <td class="${newSupplier}-price">${ingredient[3]}</td>
                            <td ><i id="removeItem-${index}-${newSupplier.replaceAll(" ","")}" class="bi bi-bag-x removeItem noPrint"></i></td>
                        </tr>
                    `; 
                        
                    oldSupplier = newSupplier;
                }
            });
            
            // print sub total for the last supplier
            html += `<tr class="totalTr" id="${oldSupplier.replaceAll(" ","")}-subTotalPriceTr"><td class="noPrint"></td><td class="subTotalLabel">SUB TOTAL:</td><td id="${oldSupplier.replaceAll(" ","")}-subTotalPrice" class="subTotalPrice">$${subPrice.toFixed(2)}</td><td></td></tr>`;
            totalPrice = totalPrice + subPrice;

            // print string to screen
            $("#ingredientsTable").append(html);

            // append totalprice
            $("#ingredientsTable").append(`<tr class="totalTr"><td class="noPrint"></td><td class="overallTotalLabel">TOTAL:</td><td class="overallTotalPrice" id="overallTotalPriceTd">$${totalPrice.toFixed(2)}</td><td></td></tr></table>`);
        }
    }

	/* -----------------------------------------------------------------------------------------------------------
									CLICK HANDLERS
	----------------------------------------------------------------------------------------------------------- */

    $("#empty").on("click", (e) => {

        // empty ingredientsTable
        $("#ingredientsTable").empty();

        // append empty message
        $("#pageText").text(`There are no items in your cart!`);

        // hide buttons
        $("#empty").hide();
        $("#print").hide();

        // save a blank storedIngredients array to local as a string
		localStorage.setItem(
			"storedIngredients",
			JSON.stringify([])
		);

        printCartToScreen();
    });

    $("#print").on("click", (e) => {
        window.print();
    });

    $("#ingredientsDivCart").on("click", (e) => {
        
        var itemClickToChange = e.target.id.split("-");
        var itemClickToDo = itemClickToChange[0];
        var itemClickId = itemClickToChange[1];
        var itemClickSupplier = itemClickToChange[2];

        console.log(itemClickToDo);
        switch (itemClickToDo) {
            case "removeItem":
                // remove item from local storage
                // get the current stored ingredients
                var storedIngredients = getStoredIngredients();
            console.log(storedIngredients);
                // remove the element at index from the storedIngredients array
                storedIngredients.splice(itemClickId,1);
            console.log(storedIngredients);
                // save the new storedIngredients array to local as a string
                localStorage.setItem(
                    "storedIngredients",
                    JSON.stringify(storedIngredients)
                );

                // remove the row of the item
                $("#itemTr-"+itemClickId).remove();
                
                
                // recalc the sub total for that supplier

                if ($("."+itemClickSupplier+"-price").length > 0) {
                    var newSubPrice = 0;
                    $("."+itemClickSupplier+"-price").each((index,thisTd) => {                    
                        newSubPrice += parseFloat(thisTd.textContent.substring(1));
                    });
                    // write the new sub price
                    $("#"+itemClickSupplier+"-subTotalPrice").text("$"+newSubPrice.toFixed(2));
                }
                else {

                    // delete thh header row and sub total row for that supplier
                    $("#"+itemClickSupplier+"-header").remove();
                    $("#"+itemClickSupplier+"-subTotalPrice").remove();

                }
                
                // If everything hasn't been deleted
                if ($("#ingredientsTable tr").length > 1) {                
                    
                    // recalc the total price
                    var newTotalPrice = 0;
                    $(".subTotalPrice").each((index,thisTd) => {                    
                        newTotalPrice += parseFloat(thisTd.textContent.substring(1));
                    });

                    // write the new total price
                    $("#overallTotalPriceTd").text("$"+newTotalPrice.toFixed(2));
                }
                else {
                    // fake click the empty button
                    $("#empty").click();
                }
                break;
            default:
                break;
        }
    });

	/* -----------------------------------------------------------------------------------------------------------
									RUNS ON PAGE LOAD
	----------------------------------------------------------------------------------------------------------- */
    
    // add a table to screen
    $("#ingredientsDivCart").html(`<table id="ingredientsTable"></table>`);

    printCartToScreen();
    
});