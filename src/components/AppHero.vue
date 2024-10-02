<template>
  <section class="hero" role="banner" aria-label="Benvenuto su DeliveBoo">
    <div class="hero-content">
      <h1 class="hero-title"><span class="highlight">Delive</span>Boo</h1>
      <p class="hero-subtitle">I migliori ristoranti consegnano a domicilio</p>
      <div class="hero-features">
        <div class="feature">
          <i class="fas fa-utensils"></i>
          <span>Ampia scelta</span>
        </div>
        <div class="feature">
          <i class="fas fa-clock"></i>
          <span>Consegna veloce</span>
        </div>
        <div class="feature">
          <i class="fas fa-star"></i>
          <span>Top qualità</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "AppHero",
};
</script>

<style lang="scss" scoped>
@use "../scss/partials/variables" as *;

$hero-text-color: #ffffff;
$hero-overlay-color: rgba(0, 0, 0, 0.5);
$highlight-color: $main-color;

@mixin text-shadow($size) {
  text-shadow: 0 0 $size rgba(0, 0, 0, 0.5);
}

.hero {
  background-image: linear-gradient($hero-overlay-color, $hero-overlay-color),
    url("/img/hero-img.jpg");
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: $hero-text-color;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle,
      transparent 20%,
      $hero-overlay-color 80%
    );
    z-index: 1;
  }
}

.hero-content {
  max-width: 800px;
  padding: 2rem;
  animation: fadeIn 1s ease-out;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 4.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  @include text-shadow(4px);
  letter-spacing: 2px;

  .highlight {
    color: $highlight-color;
  }
}

.hero-subtitle {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  @include text-shadow(2px);
  font-weight: 300;
  letter-spacing: 1px;
}

.hero-features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  i {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: $highlight-color;
  }

  span {
    font-size: 1rem;
    font-weight: 500;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }

  .hero-subtitle {
    font-size: 1.4rem;
  }

  .hero-features {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }
}
</style>
