const searchApi = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const detailsApi = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal-list");
const cartItems = document.getElementById("cart-items");
const modal = document.getElementById("meal-modal");
const closeModal = document.getElementById("close-modal");
const modalDetails = document.getElementById("modal-details");

searchBtn.addEventListener("click", searchMeals);
closeModal.addEventListener("click", () => modal.classList.add("hidden"));

let cart = [];

async function searchMeals() {
    const query = searchBar.value.trim();
    if (!query) return alert("Please enter a meal name!");

    const response = await fetch(searchApi + query);
    const data = await response.json();

    displayMeals(data.meals || []);
}

function displayMeals(meals) {
    mealList.innerHTML = "";

    if (meals.length === 0) {
        mealList.innerHTML = `<p class="text-center text-gray-700">No meals found. Try another search.</p>`;
        return;
    }

    meals.forEach(meal => {
        const mealCard = document.createElement("div");
        mealCard.className = "bg-white rounded-lg shadow-md overflow-hidden";

        mealCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-40 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-bold text-gray-800">${meal.strMeal}</h3>
                <div class="flex justify-between mt-4">
                    <button class="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition" 
                        onclick="addToCart('${meal.idMeal}', '${meal.strMeal}')">Add to Cart</button>
                    <button class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition" 
                        onclick="showDetails('${meal.idMeal}')">Show Details</button>
                </div>
            </div>
        `;

        mealList.appendChild(mealCard);
    });
}

function addToCart(id, name) {
    if (cart.find(item => item.id === id)) {
        alert("This meal is already in your cart!");
        return;
    }

    cart.push({ id, name });
    updateCart();
}

function updateCart() {
    cartItems.innerHTML = "";
    cart.forEach(item => {
        const cartItem = document.createElement("li");
        cartItem.className = "flex justify-between items-center bg-gray-100 p-2 rounded-md";

        cartItem.innerHTML = `
            <span>${item.name}</span>
            <button class="text-red-600 hover:text-red-800" onclick="removeFromCart('${item.id}')">Remove</button>
        `;

        cartItems.appendChild(cartItem);
    });
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}


async function showDetails(id) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    const meal = data.meals[0];
    if (!meal) return alert("No meal found!");
    if (meal.strTags === null) meal.strTags = "tags not available";
    document.getElementById("meal-title").textContent = meal.strMeal;
    document.getElementById("meal-image").src = meal.strMealThumb;
    document.getElementById("meal-category").textContent = `Category: ${meal.strCategory}`;
    document.getElementById("meal-area").textContent = `Cuisine: ${meal.strArea}`;
    document.getElementById("meal-tags").textContent = `Tags: ${meal.strTags}`;
    document.getElementById("meal-instructions").textContent = meal.strInstructions;

    document.getElementById("meal-instructions").textContent = meal.strInstructions.substring(0, 200) + "...";

    // Show modal
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
});

window.addEventListener("click", (event) => {   
    if (event.target === modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
});
