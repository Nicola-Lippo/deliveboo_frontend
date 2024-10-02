<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  isCheckoutPage: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update-total-items"]);

const route = useRoute();
const router = useRouter();
const cart = ref({ restaurantId: null, restaurantName: "", items: [] });

const loadCart = () => {
  const savedCart = sessionStorage.getItem("cart");
  if (savedCart) {
    cart.value = JSON.parse(savedCart);
  }
};

const saveCart = () => {
  sessionStorage.setItem("cart", JSON.stringify(cart.value));
};

const totalItemsInCart = computed(() => {
  return cart.value.items.reduce((total, item) => total + item.quantity, 0);
});

const updateTotalItems = () => {
  emit("update-total-items");
  window.dispatchEvent(
    new CustomEvent("update-cart-total", {
      detail: { total: totalItemsInCart.value },
      bubbles: true,
      composed: true,
    })
  );
};

const addToCart = (event) => {
  const item = event.detail;
  if (
    cart.value.restaurantId &&
    cart.value.restaurantId !== item.restaurantId
  ) {
    alert("Non puoi ordinare da ristoranti diversi. Svuota prima il carrello.");
    return;
  }

  if (!cart.value.restaurantId) {
    cart.value.restaurantId = item.restaurantId;
    cart.value.restaurantName = item.restaurantName;
  }

  const existingItem = cart.value.items.find((i) => i.id === item.id);
  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.value.items.push({
      ...item,
      quantity: item.quantity,
      price: Number(item.price),
    });
  }
  saveCart();
  updateTotalItems();
};

const removeItem = (item) => {
  const index = cart.value.items.findIndex((i) => i.id === item.id);
  if (index > -1) {
    cart.value.items.splice(index, 1);
  }
  if (cart.value.items.length === 0) {
    cart.value.restaurantId = null;
    cart.value.restaurantName = "";
  }
  saveCart();
  updateTotalItems();
};

const increaseQuantity = (item) => {
  item.quantity++;
  saveCart();
  updateTotalItems();
};

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    removeItem(item);
  }
  saveCart();
  updateTotalItems();
};

const clearCart = () => {
  cart.value = { restaurantId: null, restaurantName: "", items: [] };
  saveCart();
  updateTotalItems();
};

// Nuovo metodo per gestire il successo dell'ordine
const handleOrderSuccess = () => {
  clearCart();
  // Puoi mostrare un messaggio di successo o reindirizzare l'utente
  alert("Ordine completato con successo! Il carrello è stato svuotato.");
  router.push({ name: "home" }); // Reindirizza alla home page o dove preferisci
};

const cartTotal = computed(() => {
  return cart.value.items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );
});

const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const handleButtonClick = () => {
  if (props.isCheckoutPage) {
    const restaurantSlug = route.query.restaurantSlug;
    if (restaurantSlug) {
      router.push({
        name: "RestaurantDetails",
        params: { slug: restaurantSlug },
      });
    } else {
      console.error("Slug del ristorante non trovato nei parametri della query");
    }
  } else {
    router.push({
      name: "checkout",
      query: { restaurantSlug: route.params.slug },
    });
  }
};

onMounted(() => {
  loadCart();
  window.addEventListener("add-to-cart", addToCart);
  // Aggiungi un listener per l'evento di ordine completato
  window.addEventListener("order-completed", handleOrderSuccess);
  updateTotalItems();
});

onUnmounted(() => {
  window.removeEventListener("add-to-cart", addToCart);
  // Rimuovi il listener quando il componente viene smontato
  window.removeEventListener("order-completed", handleOrderSuccess);
});

watch(totalItemsInCart, () => {
  updateTotalItems();
});
</script>

<template>
  <div class="cart-container">
    <h2 class="cart-title">Il tuo carrello</h2>

    <div v-if="!cart.items.length" class="cart-empty">
      Il tuo carrello è vuoto.
    </div>

    <div v-else class="cart-content">
      <div class="cart-restaurant">Ordine da: {{ cart.restaurantName }}</div>
      <ul class="cart-items">
        <li v-for="item in cart.items" :key="item.id" class="cart-item">
          <div class="item-details">
            <h5 class="item-name">{{ item.name }}</h5>
            <p class="item-price">€{{ formatPrice(item.price) }}</p>
          </div>
          <div class="item-actions">
            <button @click="decreaseQuantity(item)" class="quantity-btn">
              <i class="fa-solid fa-minus"></i>
            </button>
            <span class="item-quantity">{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)" class="quantity-btn">
              <i class="fa-solid fa-plus"></i>
            </button>
            <button @click="removeItem(item)" class="remove-btn mx-2">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </li>
      </ul>

      <div class="cart-summary">
        <h4 class="cart-total">Totale: €{{ formatPrice(cartTotal) }}</h4>
        <button @click="clearCart" class="clear-btn">Svuota carrello</button>
      </div>

      <button @click="handleButtonClick" class="action-btn">
        {{ isCheckoutPage ? "Torna al ristorante" : "Procedi all'ordine" }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../scss/partials/variables" as *;

.cart-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.cart-title {
  font-size: 1.5rem;
  color: #00ccbc;
  margin-bottom: 1rem;
}

.cart-empty {
  text-align: center;
  color: #666;
  padding: 2rem 0;
}

.cart-restaurant {
  font-weight: bold;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.cart-items {
  list-style-type: none;
  padding: 0;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.item-name {
  font-size: 1rem;
  margin: 0;
}

.item-price {
  color: $main-color;
  font-weight: bold;
  margin: 0.25rem 0 0;
}

.item-actions {
  display: flex;
  align-items: center;
}

.quantity-btn {
  background-color: $main-color;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.quantity-btn:hover {
  background-color: #00a699;
}

.item-quantity {
  margin: 0 0.5rem;
}

.remove-btn {
  background-color: #ff5a5f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-btn:hover {
  background-color: #ff3b3f;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #eee;
}

.cart-total {
  font-size: 1.25rem;
  color: $main-color;
}

.clear-btn {
  background-color: #ffc043;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clear-btn:hover {
  background-color: #fdb022;
}

.action-btn {
  display: block;
  width: 100%;
  background-color: $main-color;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.action-btn:hover {
  background-color: #00a699;
}
</style>
