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

                // get supplier name from the image tag, regex ads a space before a capital letter
                var newSupplier = ingredient[2].replace("<img src=\"./assets/images/","").replace(".png\">","").replace(/([A-Z])/g, " $1");

                // write sub total if supplier has changed, except on the first loop
                if (oldSupplier !== newSupplier && oldSupplier !== "") {
                    html += `<tr class="totalTr"><td></td><td class="subTotalLabel">SUB TOTAL:</td><td class="subTotalPrice">$${subPrice.toFixed(2)}</td><td></td></tr>`;
                    totalPrice = totalPrice + subPrice;
                    subPrice = 0;     
                } 

                // calc total price
                if (ingredient[3] !== null && ingredient[3] !== "" && ingredient[3] !== "undefined" && ingredient[3] !== undefined) {
                    subPrice += parseFloat(ingredient[3].substring(1));
                }

                // if this is a new supplier, print their name
                if (newSupplier !== oldSupplier){
                    html += `<tr class="supplierTr"><td class="supplierTd">${newSupplier}</td><td></td><td></td><td></td></tr>`;
                }       
                
                // add table row to string
                html += `
                    <tr>
                        <td class="itemName">${ingredient[1]}</td>
                        <td>${ingredient[2]}</td>
                        <td>${ingredient[3]}</td>
                        <td class="removeItem" id="removeItem-${index}"><i class="bi bi-bag-x"></i></td>
                    </tr>
                `; 
                       
                oldSupplier = newSupplier;
            });
            
            // print sub total for the last supplier
            html += `<tr class="totalTr"><td></td><td class="subTotalLabel">SUB TOTAL:</td><td class="subTotalPrice">$${subPrice.toFixed(2)}</td><td></td></tr>`;
            totalPrice = totalPrice + subPrice;

            // print string to screen
            $("#ingredientsTable").append(html);

            // append totalprice
            $("#ingredientsTable").append(`<tr class="totalTr"><td></td><td class="overallTotalLabel">TOTAL:</td><td class="overallTotalPrice">$${totalPrice.toFixed(2)}</td><td></td></tr></table>`);
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

    $(".removeItem").on("click", (e) => {
        var itemIndexToRemove = e.target.id.replace("removeItem-","");
        console.log("itemIndexToRemove",itemIndexToRemove);
        // get the current stored ingredients
        var storedIngredients = getStoredIngredients();

        // remove the elemt at index from the storedIngredients array
        storedIngredients.splice(itemIndexToRemove,1);

        // save the new storedIngredients array to local as a string
		localStorage.setItem(
			"storedIngredients",
			JSON.stringify([])
		);
        printCartToScreen();
    });

	/* -----------------------------------------------------------------------------------------------------------
									RUNS ON PAGE LOAD
	----------------------------------------------------------------------------------------------------------- */
    
    // add a table to screen
    $("#ingredientsDivCart").html(`<table id="ingredientsTable"></table>`);

    printCartToScreen();
    
});