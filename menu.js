```javascript
// ========================================
// MENU VARIABLES
// ========================================

let allMenuItems = [];


// ========================================
// LOAD MENU
// ========================================

async function loadMenu() {

    const menuGrid = document.getElementById("menuGrid");

    // Agar menuGrid page par nahi hai
    if (!menuGrid) {
        return;
    }

    menuGrid.innerHTML = `
        <div class="col-12 text-center">
            <p>Loading menu...</p>
        </div>
    `;


    try {

        const { data, error } = await supabaseClient
            .from("menu_items")
            .select("*")
            .eq("available", true)
            .order("created_at", {
                ascending: false
            });


        if (error) {
            throw error;
        }


        allMenuItems = data || [];

        displayMenu(allMenuItems);


    } catch (error) {

        console.error(error);

        menuGrid.innerHTML = `
            <div class="col-12">
                <div class="error-message">
                    Unable to load menu.
                    ${error.message}
                </div>
            </div>
        `;

    }

}



// ========================================
// DISPLAY MENU
// ========================================

function displayMenu(items) {

    const menuGrid = document.getElementById("menuGrid");

    if (!menuGrid) {
        return;
    }


    // No food found
    if (items.length === 0) {

        menuGrid.innerHTML = `
            <div class="col-12 text-center">
                <p>No food items found.</p>
            </div>
        `;

        return;
    }


    menuGrid.innerHTML = "";


    items.forEach(function (item) {

        const image =
            item.image_url ||
            "https://via.placeholder.com/600x400?text=Food";


        const card = document.createElement("div");

        card.className = "col-md-6 col-lg-4 mb-4";


        card.innerHTML = `
            <div class="card menu-card shadow-sm">

                <img
                    src="${image}"
                    class="card-img-top"
                    alt="${item.name}"
                >

                <div class="card-body">

                    <span class="badge bg-secondary mb-2">
                        ${item.category || "Food"}
                    </span>

                    <h5 class="card-title">
                        ${item.name}
                    </h5>

                    <p class="card-text text-muted">
                        ${item.description || ""}
                    </p>

                    <div class="d-flex justify-content-between align-items-center">

                        <strong>
                            $${Number(item.price).toFixed(2)}
                        </strong>

                        <button
                            class="btn btn-dark"
                            onclick="addToCart(${item.id})"
                        >
                            Add to Cart
                        </button>

                    </div>

                </div>

            </div>
        `;


        menuGrid.appendChild(card);

    });

}



// ========================================
// SEARCH MENU
// ========================================

const searchInput =
    document.getElementById("searchInput");


if (searchInput) {

    searchInput.addEventListener("input", function () {

        const searchText =
            searchInput.value.toLowerCase().trim();


        const filteredItems =
            allMenuItems.filter(function (item) {

                return (
                    item.name.toLowerCase().includes(searchText) ||
                    (item.description || "")
                        .toLowerCase()
                        .includes(searchText)
                );

            });


        displayMenu(filteredItems);

    });

}



// ========================================
// CATEGORY FILTER
// ========================================

const categoryButtons =
    document.querySelectorAll(".category-btn");


categoryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const category =
            button.getAttribute("data-category");


        if (category === "all") {

            displayMenu(allMenuItems);

            return;

        }


        const filteredItems =
            allMenuItems.filter(function (item) {

                return item.category === category;

            });


        displayMenu(filteredItems);

    });

});



// ========================================
// START MENU
// ========================================

loadMenu();
```
