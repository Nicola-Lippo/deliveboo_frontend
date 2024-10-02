<script>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  name: "AppSearch",
  setup() {
    const router = useRouter();
    const api = ref({
      baseUrl: "http://127.0.0.1:8000",
      endPoints: {
        restaurantsList: "/api/restaurants",
        typesList: "/api/types",
      },
    });

    const availableTypes = ref([]);
    const selectedTypes = ref([]);
    const restaurants = ref([]);
    const searched = ref(false);
    const loading = ref(true);

    const getImageUrl = (path) => {
      return `${api.value.baseUrl}/storage${path}`;
    };

    const loadTypes = async () => {
      try {
        const url = api.value.baseUrl + api.value.endPoints.typesList;
        console.log("Caricamento tipi da URL:", url);
        const response = await axios.get(url);
        availableTypes.value = response.data.data;
        console.log("Tipi caricati:", availableTypes.value);
        loading.value = false;
      } catch (error) {
        console.error("Errore nel caricamento dei tipi di cucina:", error);
        loading.value = false;
      }
    };

    const searchRestaurants = async () => {
      if (selectedTypes.value.length === 0) return;
      try {
        searched.value = true;
        const url = api.value.baseUrl + api.value.endPoints.restaurantsList;
        console.log("Ricerca ristoranti da URL:", url);
        console.log("Tipi selezionati:", selectedTypes.value);
        const response = await axios.get(url, {
          params: {
            types: selectedTypes.value.join(","),
          },
        });
        restaurants.value = response.data.data;
        console.log("Ristoranti trovati:", restaurants.value);
      } catch (error) {
        console.error("Errore nella ricerca dei ristoranti:", error);
      }
    };

    const goToRestaurantPage = (restaurantSlug) => {
      router.push({
        name: "RestaurantDetails",
        params: { slug: restaurantSlug },
      });
    };

    onMounted(() => {
      console.log("Componente montato");
      loadTypes();
    });

    watch(availableTypes, (newValue) => {
      console.log("availableTypes aggiornato:", newValue);
    });

    return {
      availableTypes,
      selectedTypes,
      restaurants,
      searched,
      loading,
      searchRestaurants,
      goToRestaurantPage,
      getImageUrl,
    };
  },
  // methods:{
  //   getImageUrl(path) {
  //     return `${api.baseUrl}${path}`;
  //   },
  // }
};
</script>

<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">Cerca Ristoranti per Tipo</h2>
    <div v-if="loading" class="text-center p-4 bg-light rounded">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Caricamento...</span>
      </div>
      <p>Caricamento tipi di cucina...</p>
    </div>
    <div v-else class="bg-white rounded shadow p-4">
      <div
        v-if="availableTypes.length === 0"
        class="alert alert-danger text-center"
        role="alert"
      >
        Nessun tipo di cucina disponibile. Controlla la connessione al server.
      </div>
      <div v-else class="mb-4">
        <div
          class="form-check form-check-inline"
          v-for="type in availableTypes"
          :key="type.id"
        >
          <input
            class="form-check-input"
            type="checkbox"
            :id="type.id"
            :value="type.name"
            v-model="selectedTypes"
          />
          <label class="form-check-label" :for="type.id">{{ type.name }}</label>
        </div>
      </div>
      <button
        @click="searchRestaurants"
        :disabled="selectedTypes.length === 0"
        class="btn btn-primary w-100 color"
      >
        Cerca Ristoranti
      </button>
      <div v-if="restaurants.length" class="mt-4">
        <h3 class="mb-3">Risultati:</h3>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div
            class="col"
            v-for="restaurant in restaurants"
            :key="restaurant.id"
          >
            <div
              class="card h-50 cursor-pointer zoom-in border-0"
              @click="goToRestaurantPage(restaurant.slug)"
              style="width: 18rem"
            >
              <img
                :src="getImageUrl(restaurant.image)"
                class="card-img-top restaurant-img"
                alt="..."
              />
              <div class="card-body">
                <h5 class="card-title">{{ restaurant.name }}</h5>
                <p class="card-text">{{ restaurant.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-else-if="searched" class="mt-4 text-center text-danger">
        Nessun ristorante trovato.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../scss/partials/variables" as *;

.cursor-pointer {
  cursor: pointer;
}
.restaurant-img {
  height: 300px;
  object-fit: cover;
}
.color {
  background-color: $main-color;
}

.zoom-in:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease-in-out;
}
</style>
