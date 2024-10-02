<script>
export default {
  name: "AppHeader",
};
</script>

<template>
    <header class="deliveroo-header">
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <router-link :to="{ name: 'home' }" class="nav-link active navbar-brand" aria-current="page"><img src="/img/logo.png" alt="Deliveroo logo" height="100"></router-link>
        
        <div class="navbar-nav ms-auto">
          <a href="http://127.0.0.1:8000/login" class="nav-item nav-link text-white d-flex align-items-center me-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Collabora con noi
          </a>
          <!-- <a href="#" class="btn btn-light text-primary fw-bold me-3">Registrati o accedi</a>
          <a href="#" class="nav-item nav-link text-white d-flex align-items-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Account
          </a> -->
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped lang="scss">
@use "../scss/partials/variables" as *;

.main-color {
  color: $main-color;
}
.deliveroo-header {
  background: linear-gradient(to right, white 50%, #00ccbc 50%);
  position: relative;
  overflow: hidden;
}
.deliveroo-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 48%;
  width: 100px;
  height: 100%;
  background: #00ccbc;
  transform: skew(-20deg);
  z-index: 1;
}
.navbar {
  position: relative;
  z-index: 2;
}
.navbar-nav .nav-link, .btn-light {
  font-size: 14px;
}
.btn-light {
  background-color: white;
  color: #00ccbc !important;
  border: none;
}
</style>
