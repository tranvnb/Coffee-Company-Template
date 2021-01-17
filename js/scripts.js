    //object for storing items in cart
    var itemInCart = { "0": { "value": 1 } };
    // declare a list of products
    var allItems = {
        0: {
            title: 'BLACK COFFEE (BOTTLE)',
            price: 6.00,
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        1: {
            title: 'MILK COFFEE (BOTTLE)',
            price: 8.00,
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        2: {
            title: 'COFFEE BEAN (DARK ROAST)',
            price: 12.00,
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        3: {
            title: 'COFFEE BEAN',
            price: 12.00,
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        4: {
            title: 'BLACK COFFEE (CAPSULES)',
            price: 20.00,
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        5: {
            title: 'MILK COFFEE (CAPSULES)',
            price: 22.00,
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        6: {
            title: 'CAPPUCCINO',
            price: 5.00,
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        7: {
            title: 'ESPRESSO',
            price: 4.00,
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        8: {
            title: 'GROUND COFFEE AND FILTER',
            price: 15.00,
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        9: {
            title: 'GROUND COFFEE (INSTANT FILTER)',
            price: 15.00,
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        }

    }

	/**
	* This function open contact page at current tab
	*/
    function GoToContactPage() {
        window.open("contact.html", "_self");
    }

	/**	
	* This function open home page at current tab
	*/
    function GoToHomePage() {
        window.open("index.html", "_self");
    }

    //This function will open home page and then move to the menu section
    function GoToMainMenu() {
        window.open("index.html#move-to-main-menu", "_self");
    }

    /**
     * re-load all item are added to cart
     */
    function reloadCartItems() {
        if (typeof(Storage) !== "undefined") {
            if (localStorage.getItem("cart-item")) {
                itemInCart = JSON.parse(localStorage.getItem("cart-item"));
            }
        } else {
            alert("Sorry, your browser does not support web storage...");
        }
    }

    // Save all current items in cart to local storage
    function saveCartItems() {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("cart-item", JSON.stringify(itemInCart));
        } else {
            alert("Sorry, your browser does not support web storage...");
        }
    }

	/**
	* This function is called whenever the whole html tags are loaded completedly.
	* Its purpose is to save/reload cart items, move to certain sections/anchors in page, initialize menu items, and add some event handlers
	*/
    function registerAllHandlers() {

        reloadCartItems();

        //If current page is home/menu page
        if (document.getElementById("menu") != undefined) {
            initializeMenuItems();
            //check if user want to go directly to menu (user clicked on sub-menu)
            var hash = window.location.hash.substr(1);
            if (hash == "move-to-main-menu") {
                setTimeout(function() { scrollToMainMenu(); }, 2000);
            }
            //Update the cart item number
            document.getElementById("cart-total-item").innerHTML = Object.keys(itemInCart).length;
            //Show up the videos
            setTimeout(function() { document.getElementById("animation-intro").classList.add("show-up"); }, 500);

        }
        //if current page is cart page
        if (document.getElementById("product-listing") != undefined) {
            initializeCartItems();
            setTimeout(function() { updateFinalCart(); }, 2000);
        }

        //if current page is contact page
        if (document.getElementsByClassName("contact-page") != undefined) {
            //show greeting message on contact page
            setTimeout(function() { document.getElementById("animation-intro").classList.add("show-up"); }, 500);
        }

		        
		//This line to calculate viewport position and to show floating menu;
        window.addEventListener("scroll", showFloatingMenu);
    }

    function removeAllHanlers() {
        //If current page is home/menu page
        if (document.getElementById("menu") != undefined || document.getElementById("product-listing") != undefined) {
            //save cart item before move to other page			
            saveCartItems();
        }
		//This line is to remove the handler function from the scroll event
        window.removeEventListener("scroll", showFloatingMenu);
    }

    // scroll to menu item if currently page is home page
    function scrollToMainMenu() {
        document.getElementById("main-menu").scrollIntoView({ behavior: 'smooth' })
    }


    function addItemToCart(id) {
		//Each item has its own class name which is combined by 'menu-item-with-id-' and its Id.
        document.getElementsByClassName("menu-item-with-id-" + id)[0].style.display = "block";
        itemInCart[id] = { value: 1 };
        //Animate number
		//Update the number item in cart icon (which is on the right edge of home page)
        document.getElementById("cart-total-item").innerHTML = Object.keys(itemInCart).length;
		//Active the animation by adding css class
        document.getElementById("cart-total-item").classList.add("animated-number");
		//Remove the animation class after a short time
        setTimeout(function() { document.getElementById("cart-total-item").classList.remove("animated-number"); }, 500)
    }

    function removeItemFromCart(id) {
		//Active the fade out animation of item in list base on its css class name decided by 'menu-item-with-id-' and its Id
        document.getElementsByClassName("menu-item-with-id-" + id)[0].style.display = "none";
		//Delete the item in cart
        delete itemInCart[id];
        //Animate number
		//Update the number on cart icon
        document.getElementById("cart-total-item").innerHTML = Object.keys(itemInCart).length;
		//Active the zoom up number animation
        document.getElementById("cart-total-item").classList.add("animated-number");
		//Remove the animation class in order to be activated again later
        setTimeout(function() { document.getElementById("cart-total-item").classList.remove("animated-number"); }, 500)
    }
    /**
     * This in on Cart page
     *  */

	//Remove item from cart by its Id which is combined by 'item-in-cart-id-' and its Id
    function cart_removeItemFromCart(id) {
        document.getElementById("item-in-cart-id-" + id).style.opacity = '0';
        delete itemInCart[id];
		//after item are fade out from list, actually it still exists on html document, so we have to remove it completedly
        setTimeout(function() {
            document.getElementById("item-in-cart-id-" + id).remove();
        }, 1000);
    }

    // calculate the summarized cost of a particular item
    function recalculateProductId(id) {
		//Get the number of each product based on item Id
        var quant = parseInt(document.getElementById("quant-product-" + id).value);
        if (quant != undefined) {
            //re-calculate price
            itemInCart[id].value = quant;
            var total = quant * allItems[id].price;
			//Update the total cost of item based on its price and amount
            document.getElementById("total-product-id-" + id).innerHTML = total.toFixed(2);
        }
    }

    // calculate the final total cost of all items in cart
    function updateFinalCart() {
        var subtotal = 0;
        var total = 0;
		//Summarize all cost of each items
        Object.keys(itemInCart).forEach(id => {
            subtotal += allItems[id].price * itemInCart[id].value;
        });
		//Add shipping fee ( which is a fixed number )
        total += subtotal + 10; //Shipping fee
		//Update the overal cost
        document.getElementById("final-subtotal-price").innerHTML = subtotal.toFixed(2);
        document.getElementById("final-total-price").innerHTML = total.toFixed(2);
		//Move the viewport to the overal cost
        document.getElementById("final-total-price").scrollIntoView({ behavior: 'smooth' })
    }

    /**
     * 
     * End of Cart page
     */


    /**
     * This is on Home page
     */

    //  smoothly show menu item if the top one are out of viewport
    function showFloatingMenu() {
        var bannerPosition = document.getElementById("myHeader").clientHeight - 62;
		//show the floating menu when the big banner is out of view port 
        if (document.body.scrollTop > bannerPosition || document.documentElement.scrollTop > bannerPosition) {
            document.getElementById("floating-menu").classList.add("show-up");
            document.getElementById("top-menu").style.display = "none";
        } else {
			//Hide the floating menu if the big banner, which has the top navigator, is shown 
            document.getElementById("floating-menu").classList.remove("show-up");
            document.getElementById("top-menu").style.display = "block";
        }
    }

    // Create html code based on allItems list and append this code to home page at menu item section
    function initializeMenuItems() {
        var str = "";
        var isShow = "none";

        for (let id = 0; id < Object.keys(allItems).length; id += 2) {
            isShow = "none";
            if (Object.keys(itemInCart).indexOf(id + '') != -1) { isShow = 'block'; }

            str += '<div class="row">' +
                '<div class="col">' +
                '<div class="menu-item">' +
                '<div class="menu-item-img">' +
                '<img src="assets/menu-items-' + id + '.jpg" alt="item" onclick="addItemToCart(' + id + ');" />' +
                '<div class="menu-item-action menu-item-with-id-' + id + '" onclick="removeItemFromCart(' + id + ')" style="display:' + isShow + '">' +
                '<span>Added</span>' +
                '</div>' +
                '</div>' +
                '<div class="menu-item-content">' +
                '<div class="menu-item-desc">' +
                '<div class="menu-item-name">' + allItems[id].title + '</div>' +
                '<div class="dash">&nbsp;</div>' +
                '<div class="menu-item-price">&dollar;' + allItems[id].price.toFixed(2) + '</div>' +
                '</div>' +
                '<div class="menu-item-explain">' + allItems[id].desc + '</div>' +
                '</div>' +
                '</div>' +
                '</div>';


            if (id + 1 < Object.keys(allItems).length) {
                isShow = "none";
                if (Object.keys(itemInCart).indexOf((id + 1) + '') != -1) { isShow = "block"; }
                str += '<div class="col">' +
                    '<div class="menu-item">' +
                    '<div class="menu-item-img">' +
                    '<img src="assets/menu-items-' + (id + 1) + '.jpg" alt="item" onclick="addItemToCart(' + (id + 1) + ');" />' +
                    '<div class="menu-item-action menu-item-with-id-' + (id + 1) + '" onclick="removeItemFromCart(' + (id + 1) + ')" style="display:' + isShow + '">' +
                    '<span>Added</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="menu-item-content">' +
                    '<div class="menu-item-desc">' +
                    '<div class="menu-item-name">' + allItems[id + 1].title + '</div>' +
                    '<div class="dash">&nbsp;</div>' +
                    '<div class="menu-item-price">&dollar;' + allItems[id + 1].price.toFixed(2) + '</div>' +
                    '</div>' +
                    '<div class="menu-item-explain">' + allItems[id + 1].desc + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    //Closed div of row
                    '</div>';
            } else {
                str += '<div class="col"></div>';
            }

        }

        if (Object.keys(allItems).length % 2 == 0 && Object.keys(allItems).length > 1) {
            str += '</div>'
        }

        document.getElementById("menu").innerHTML = str;

    }

    // create html code and render list of items in cart on cart page
    function initializeCartItems() {
        var str = '';
        Object.keys(itemInCart).forEach(id => {
            str += '<tr id="item-in-cart-id-' + id + '">' +
                '<td>' +
                '<i class="fa fa-times" onclick="cart_removeItemFromCart(' + id + ')"></i>' +
                '</td>' +
                '<td>' +
                '<div class="product-thumbnail">' +
                '<img src="assets/menu-items-' + id + '.jpg" alt="product1">' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<span class="product-name">' + allItems[id].title + '</span>' +
                '</td>' +
                '<td>' +
                '&dollar;' + allItems[id].price.toFixed(2) +
                '</td>' +
                '<td>' +
                '<div class="quantity">' +
                '<input type="number" min="0" id="quant-product-' + id + '" value="' + itemInCart[id].value + '" onchange="recalculateProductId(' + id + ');">' +
                '</div>' +
                '</td>' +
                '<td>' +
                '&dollar;<span id="total-product-id-' + id + '">' + (allItems[id].price * itemInCart[id].value).toFixed(2) + '</span>'
            '</td>' +
            '</tr>';
        });

        document.getElementById("product-listing").insertAdjacentHTML('beforeend', str);
    }

    /**
     * End of Home page
     */

    // This in on contact page

    // After user click send feedback, a thank you message will be showed.
    function SendFeedback() {
        document.getElementsByClassName("contact-control")[0].innerHTML = "<div>Thank for your feedback and wish you have a wonderful drink.</div>"
        document.getElementsByClassName("contact-control")[0].classList.add("received-feedback");
    }