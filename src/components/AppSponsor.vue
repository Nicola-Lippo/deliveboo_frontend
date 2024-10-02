<script setup>
import { ref } from "vue";

const sponsors = ref([
  {
    image: "/img/deliveboo_3.jpg",
    title: "Diventa nostro partner",
    description:
      "Espandi la tua attività e raggiungi nuovi clienti unendoti alla nostra piattaforma.",
  },
  {
    image: "/img/deliveboo_2.jpg",
    title: "Consegna con noi",
    description:
      "Unisciti alla nostra flotta di rider e guadagna con flessibilità.",
  },
  {
    image: "/img/deliveboo_1.jpg",
    title: "Deliveroo for Work",
    description:
      "Soluzioni di catering e consegna per aziende di tutte le dimensioni.",
  },
]);
</script>

<template>
  <section class="sponsor-section">
    <div class="sponsor-container">
      <div class="sponsor-grid">
        <div
          v-for="(sponsor, index) in sponsors"
          :key="index"
          class="sponsor-card"
        >
          <img
            :src="sponsor.image"
            :alt="sponsor.title"
            class="sponsor-image"
          />
          <div class="sponsor-content">
            <h3 class="sponsor-title">{{ sponsor.title }}</h3>
            <p class="sponsor-description">{{ sponsor.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "../scss/partials/variables" as *;

.sponsor-section {
  padding: 4rem 0;
  background-color: #f9f9f9;
}

.sponsor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.sponsor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.sponsor-card {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.sponsor-card:hover {
  transform: translateY(-5px);
}

.sponsor-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.sponsor-content {
  padding: 1.5rem;
}

.sponsor-title {
  font-size: 1.5rem;
  color: $main-color;
  margin-bottom: 0.5rem;
}

.sponsor-description {
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .sponsor-grid {
    grid-template-columns: 1fr;
  }
}
</style>
