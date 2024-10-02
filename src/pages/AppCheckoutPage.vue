<script>
import { useRoute } from "vue-router";
import AppCart from "../components/AppCart.vue";
import AppPayment from "../components/AppPayment.vue";

export default {
  name: "AppCheckoutPage",
  components: {
    AppCart,
    AppPayment,
  },
  setup() {
    const route = useRoute();
    const restaurantSlug = route.query.restaurantSlug;

    return {
      restaurantSlug,
    };
  },
};
</script>

<template>
  <div class="container">
    <div class="my-3 text-center">
      <h1>Checkout</h1>
    </div>
    <AppCart :isCheckoutPage="true" />

    <AppPayment />
  </div>
</template>

<style></style>
