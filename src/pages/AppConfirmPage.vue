<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div v-if="isLoading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Caricamento...</span>
          </div>
        </div>
        <div v-else-if="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>
        <div v-else-if="order" class="card">
          <div class="card-body">
            <div class="text-center mb-4">
              <div
                class="bg-success text-white rounded-circle d-inline-flex justify-content-center align-items-center"
                style="width: 50px; height: 50px"
              >
                <span class="h4 mb-0">✓</span>
              </div>
              <h2 class="mt-3 mb-0">Ordine Confermato!</h2>
              <p class="text-muted">Grazie per il tuo ordine #{{ order.id }}</p>
            </div>

            <div class="mb-4">
              <h3 class="h5 mb-3">Dettagli dell'ordine</h3>
              <h4 class="h6 mb-2">{{ order.restaurantName }}</h4>
              <ul class="list-group mb-3">
                <li
                  v-for="(item, index) in order.items"
                  :key="index"
                  class="list-group-item d-flex justify-content-between lh-sm"
                >
                  <div>
                    <h6 class="my-0">{{ item.name }}</h6>
                    <small class="text-muted"
                      >Quantità: {{ item.quantity }}</small
                    >
                  </div>
                  <span class="text-muted"
                    >€{{ (item.price * item.quantity).toFixed(2) }}</span
                  >
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <strong>Totale</strong>
                  <strong>€{{ order.total }}</strong>
                </li>
              </ul>
            </div>

            <div class="mb-4">
              <h3 class="h5 mb-3">Indirizzo di consegna</h3>
              <p class="mb-0">{{ order.deliveryAddress }}</p>
            </div>

            <div class="mb-4">
              <h3 class="h5 mb-3">Tempo stimato di consegna</h3>
              <p class="mb-0">{{ order.estimatedDeliveryTime }}</p>
            </div>

            <div class="alert alert-info" role="alert">
              <i class="bi bi-info-circle me-2"></i>
              Puoi seguire lo stato della tua consegna nell'app.
            </div>
          </div>
        </div>
        <div v-else class="alert alert-warning" role="alert">
          Nessun dato dell'ordine disponibile.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  name: "OrderConfirmation",
  setup() {
    const order = ref(null);
    const isLoading = ref(true);
    const error = ref(null);
    // Recupera l'ID dell'ordine dal sessionStorage
    const orderId = sessionStorage.getItem("currentOrderId");
    const orderAddress = sessionStorage.getItem("currentOrderAddress");

    const calculateTotal = (items) => {
      if (!Array.isArray(items)) {
        console.error("Gli items non sono un array:", items);
        return "0.00";
      }
      return items
        .reduce((acc, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 0;
          return acc + price * quantity;
        }, 0)
        .toFixed(2);
    };

    const loadOrderData = () => {
      isLoading.value = true;
      error.value = null;

      setTimeout(() => {
        try {
          let cartData = JSON.parse(sessionStorage.getItem("cart") || "{}");

          if (
            !cartData ||
            typeof cartData !== "object" ||
            !Array.isArray(cartData.items)
          ) {
            throw new Error("Dati del carrello non validi o mancanti");
          }

          if (cartData.items.length === 0) {
            throw new Error("Il carrello è vuoto");
          }

          order.value = {
            id: "ORD-" + orderId,
            restaurantId: cartData.restaurantId,
            restaurantName: cartData.restaurantName,
            items: cartData.items,
            total: calculateTotal(cartData.items),
            deliveryAddress: orderAddress,
            estimatedDeliveryTime: "30-45 minuti",
          };
        } catch (e) {
          error.value =
            "Errore nel caricamento dei dati dell'ordine: " + e.message;
          console.error("Errore completo:", e);
        } finally {
          isLoading.value = false;
        }
      }, 1000);
    };

    onMounted(() => {
      loadOrderData();
    });

    return {
      order,
      isLoading,
      error,
    };
  },
};
</script>
