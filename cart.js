```javascript
// ========================================
// CART
// ========================================

let cart = JSON.parse(localStorage.getItem("restaurantCart")) || [];


// ========================================
// SAVE CART
// ========================================

function saveCart() {

    localStorage.setItem(
        "restaurantCart",
        JSON.stringify(cart)
    );

}


// ========================================
// ADD TO CART
// ========================================

function addToCart(itemId) {

    const item = allMenuItems.find(function (food) {

        return food.id === itemId;

    });


    if (!item) {

        alert("Food item not found.");

        return;

    }


    const existingItem = cart.find(function (cartItem) {

        return cartItem.id === itemId;

    });


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            id: item.id,

            name: item.name,

            price: Number(item.price),

            image_url: item.image_url,

            quantity: 1

        });

    }


    saveCart();

    displayCart();

    alert(item.name + " added to cart!");

}



// ========================================
// DISPLAY CART
// ========================================

function displayCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");


    if (!cartItems || !cartTotal) {

        return;

    }


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="text-muted text-center">
                Your cart is empty.
            </p>
        `;

        cartTotal.textContent = "0.00";

        return;

    }


    cartItems.innerHTML = "";


    let total = 0;


    cart.forEach(function (item, index) {

        const itemTotal =
            item.price * item.quantity;


        total += itemTotal;


        const cartItem =
            document.createElement("div");


        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="d-flex justify-content-between">

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <p class="mb-1 text-muted">
                        $${item.price.toFixed(2)}
                    </p>

                </div>

                <button
                    class="btn btn-sm btn-danger"
                    onclick="removeFromCart(${index})"
                >
                    Remove
                </button>

            </div>


            <div class="d-flex align-items-center gap-2 mt-2">

                <button
                    class="btn btn-sm btn-outline-dark"
                    onclick="decreaseQuantity(${index})"
                >
                    -
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    class="btn btn-sm btn-outline-dark"
                    onclick="increaseQuantity(${index})"
                >
                    +
                </button>

                <strong class="ms-auto">
                    $${itemTotal.toFixed(2)}
                </strong>

            </div>

        `;


        cartItems.appendChild(cartItem);

    });


    cartTotal.textContent =
        total.toFixed(2);

}



// ========================================
// INCREASE QUANTITY
// ========================================

function increaseQuantity(index) {

    cart[index].quantity += 1;

    saveCart();

    displayCart();

}



// ========================================
// DECREASE QUANTITY
// ========================================

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

    } else {

        cart.splice(index, 1);

    }


    saveCart();

    displayCart();

}



// ========================================
// REMOVE ITEM
// ========================================

function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

    displayCart();

}



// ========================================
// CLEAR CART
// ========================================

function clearCart() {

    cart = [];

    saveCart();

    displayCart();

}



// ========================================
// START CART
// ========================================

displayCart();
```
