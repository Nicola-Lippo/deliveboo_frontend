<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import AppCart from "../components/AppCart.vue";

const route = useRoute();
const restaurant = ref(null);
const loading = ref(true);
const error = ref(null);
const isCartVisible = ref(true);
const cart = ref({ items: [] });
const quantities = ref({});
const totalItemsInCart = ref(0);

const api = {
  baseUrl: "http://127.0.0.1:8000",
  endPoints: {
    restaurantDetails: "/api/restaurants",
  },
};

const getImageUrl = (path) => {
  return `${api.baseUrl}/storage${path}`;
};

const fetchRestaurantDetails = async () => {
  const slug = route.params.slug;
  try {
    loading.value = true;
    const url = `${api.baseUrl}${api.endPoints.restaurantDetails}/${slug}`;
    const response = await axios.get(url);
    restaurant.value = response.data.data;
    restaurant.value.dishes.forEach((dish) => {
      quantities.value[dish.id] = 1;
    });
  } catch (err) {
    console.error("Errore nel caricamento dei dettagli del ristorante:", err);
    error.value =
      "Si è verificato un errore nel caricamento dei dettagli del ristorante.";
  } finally {
    loading.value = false;
  }
};

const loadCart = () => {
  const savedCart = sessionStorage.getItem("cart");
  if (savedCart) {
    cart.value = JSON.parse(savedCart);
    updateTotalItems();
  }
};

const addToCart = (dish) => {
  if (restaurant.value) {
    const cartItem = {
      id: dish.id,
      name: dish.name,
      price: Number(dish.price),
      quantity: quantities.value[dish.id],
      restaurantId: restaurant.value.id,
      restaurantName: restaurant.value.name,
    };

    window.dispatchEvent(
      new CustomEvent("add-to-cart", {
        detail: cartItem,
        bubbles: true,
        composed: true,
      })
    );
    loadCart();
    quantities.value[dish.id] = 1;
  }
};

const toggleCart = () => {
  isCartVisible.value = !isCartVisible.value;
};

const incrementQuantity = (dishId) => {
  quantities.value[dishId]++;
};

const decrementQuantity = (dishId) => {
  if (quantities.value[dishId] > 1) {
    quantities.value[dishId]--;
  }
};

const updateTotalItems = () => {
  totalItemsInCart.value = cart.value.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
};

const updateCartTotal = (event) => {
  totalItemsInCart.value = event.detail.total;
};

onMounted(() => {
  fetchRestaurantDetails();
  loadCart();
  window.addEventListener("add-to-cart", loadCart);
  window.addEventListener("update-cart-total", updateCartTotal);
});

onUnmounted(() => {
  window.removeEventListener("add-to-cart", loadCart);
  window.removeEventListener("update-cart-total", updateCartTotal);
});
</script>

<template>
  <div class="restaurant-details-container">
    <div class="restaurant-content" :class="{ 'cart-visible': isCartVisible }">
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Caricamento dettagli ristorante...</p>
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <template v-else-if="restaurant">
        <div class="restaurant-header">
          <img
            :src="getImageUrl(restaurant.image)"
            :alt="restaurant.name"
            class="restaurant-image"
          />
          <div class="restaurant-info">
            <h2 class="restaurant-name">{{ restaurant.name }}</h2>
            <p class="restaurant-address">
              {{ restaurant.address }}, {{ restaurant.city }}
            </p>
          </div>
        </div>

        <h3 class="menu-title">Menu</h3>
        <div class="menu-grid">
          <div
            v-for="dish in restaurant.dishes"
            :key="dish.id"
            class="dish-card"
          >
            <img
              :src="getImageUrl(dish.image)"
              :alt="dish.name"
              class="dish-image"
            />
            <div class="dish-info">
              <h5 class="dish-name">{{ dish.name }}</h5>
              <p class="dish-description">{{ dish.description }}</p>
              <p class="dish-price">€{{ Number(dish.price).toFixed(2) }}</p>
              <div class="dish-actions">
                <div class="quantity-control">
                  <button
                    @click="decrementQuantity(dish.id)"
                    class="quantity-btn"
                  >
                  <i class="fa-solid fa-minus"></i>
                  </button>
                  <span class="quantity">{{ quantities[dish.id] }}</span>
                  <button
                    @click="incrementQuantity(dish.id)"
                    class="quantity-btn"
                  >
                  <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
                <button @click="addToCart(dish)" class="add-to-cart-btn">
                  <!-- Aggiungi
                  {{
                    quantities[dish.id] > 1 ? quantities[dish.id] + " al" : "al"
                  }}
                  carrello -->
                  <i class="fa-solid fa-cart-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="no-details-message">
        Nessun dettaglio disponibile per questo ristorante.
      </div>
    </div>

    <transition name="slide">
      <div v-show="isCartVisible" class="cart-sidebar">
        <AppCart
          @update-total-items="updateTotalItems"
          :isCheckoutPage="false"
        />
      </div>
    </transition>

    <button
      @click="toggleCart"
      class="toggle-cart-btn"
      :class="{ 'cart-hidden': !isCartVisible }"
    >
      {{ isCartVisible ? "Nascondi carrello" : "Mostra carrello" }}
      <span v-if="totalItemsInCart > 0" class="cart-badge">
        {{ totalItemsInCart }}
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "../scss/partials/variables" as *;
.restaurant-details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  position: relative;
}

.restaurant-content {
  transition: margin-right 0.3s ease;
}

.restaurant-content.cart-visible {
  margin-right: 300px;
}

.loading-spinner,
.error-message,
.no-details-message {
  text-align: center;
  padding: 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid $main-color;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.restaurant-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.restaurant-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
}

.restaurant-name {
  font-size: 2rem;
  color: $main-color;
  margin-bottom: 0.5rem;
}

.restaurant-address {
  font-size: 1rem;
  color: #666;
}

.menu-title {
  font-size: 1.5rem;
  color: $main-color;
  margin-bottom: 1rem;
  text-align: center;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.dish-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.dish-card:hover {
  transform: translateY(-5px);
}

.dish-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.dish-info {
  padding: 1rem;
}

.dish-name {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.dish-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.dish-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: $main-color;
  margin-bottom: 0.5rem;
}

.dish-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity-control {
  display: flex;
  align-items: center;
}

.quantity-btn {
  background-color: $main-color;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.quantity-btn:hover {
  background-color: #00a699;
}

.quantity {
  margin: 0 0.5rem;
}

.add-to-cart-btn {
  background-color: $main-color;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-to-cart-btn:hover {
  background-color: #00a699;
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
}

.toggle-cart-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: $main-color;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1001;
  transition: opacity 0.3s, background-color 0.3s;
}

.toggle-cart-btn:hover {
  background-color: $main-color;
}

.toggle-cart-btn.cart-hidden {
  opacity: 0.7;
}

.cart-badge {
  background-color: #ff5a5f;
  color: white;
  border-radius: 50%;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .restaurant-content.cart-visible {
    margin-right: 0;
  }

  .cart-sidebar {
    width: 100%;
  }
}
</style>
