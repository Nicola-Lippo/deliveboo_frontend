<template>
  <div class="merch-block">
    <div class="merch-content m-5">
      <h2 class="merch-title">{{ title }}</h2>
      <p class="merch-description">{{ description }}</p>
      <button class="merch-cta">Ordina ora</button>
      <p class="merch-terms">
        {{ terms }}
        <a :href="termsLink" class="terms-link">Termini e condizioni qui.</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MerchBlock",
  props: {
    title: {
      type: String,
      default: "Menù in offerta: sconti fino al 25%",
    },
    description: {
      type: String,
      default:
        "Perfetti per dare più gusto alla tua settimana, ordinare i piatti più amati da tutta la famiglia e fare una pausa dai fornelli.",
    },
    terms: {
      type: String,
      default:
        "Si applicano spese di consegna e di servizio. Offerta soggetta a disponibilità, solo per ristoranti aderenti all'iniziativa. Si applicano termini e condizioni, consultabili qui.",
    },
    termsLink: {
      type: String,
      default: "/legal",
    },
  },
};
</script>

<style scoped lang="scss">
@use "../scss/partials/variables" as *;
.merch-block {
  position: relative;
  width: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.merch-block::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(/img/sfondo.jpg);
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  z-index: -1;
}

.merch-content {
  background: rgba(0, 0, 0, 0.6);
  padding: 2rem;
  border-radius: 10px;
  max-width: 90%;
  width: 600px;
  text-align: center;
  color: #fff;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

.merch-title {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.merch-description {
  font-size: clamp(1rem, 3vw, 1.125rem);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.merch-cta {
  background-color: $main-color;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: clamp(0.9rem, 2.5vw, 1.125rem);
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.merch-cta:hover {
  background-color: $main-color;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 105, 0, 0.3);
}

.merch-terms {
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  opacity: 0.8;
  max-width: 100%;
  margin: 1rem auto 0;
}

.terms-link {
  color: $main-color;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.terms-link:hover {
  color: $main-color;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .merch-block {
    min-height: 300px;
  }

  .merch-content {
    padding: 1.5rem;
  }
}
</style>
