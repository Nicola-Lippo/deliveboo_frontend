<script>
export default {
  name: "AppFooter",
};
</script>

<template>
  <footer class="bg-dark text-light py-5">
    <div class="container">
      <div class="row row-cols-1 row-cols-md-4 g-4">
        <div class="col d-flex">
          <div class="card bg-secondary flex-fill">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">Scopri DeliveBoo</h5>
              <ul class="list-unstyled flex-grow-1">
                <li><a href="#" class="text-light">Investitori</a></li>
                <li><a href="#" class="text-light">Chi siamo</a></li>
                <li><a href="#" class="text-light">Ristoranti</a></li>
                <li><a href="#" class="text-light">Altro</a></li>
                <li><a href="#" class="text-light">Pressroom</a></li>
                <li><a href="#" class="text-light">Programmazione</a></li>
                <li><a href="#" class="text-light">Design</a></li>
                <li><a href="#" class="text-light">Lavora con noi</a></li>
                <li>
                  <a href="#" class="text-light">Diventa nostro partner</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col d-flex">
          <div class="card bg-secondary flex-fill">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">Note legali</h5>
              <ul class="list-unstyled flex-grow-1">
                <li><a href="#" class="text-light">Termini & Condizioni</a></li>
                <li>
                  <a href="#" class="text-light">Informativa sulla privacy</a>
                </li>
                <li><a href="#" class="text-light">Cookies</a></li>
                <li>
                  <a href="#" class="text-light">Classificazione dei partner</a>
                </li>
                <li>
                  <a href="#" class="text-light"
                    >Richieste da parte delle Autorità Pubbliche</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col d-flex">
          <div class="card bg-secondary flex-fill">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">Aiuto</h5>
              <ul class="list-unstyled flex-grow-1">
                <li><a href="#" class="text-light">Contatti</a></li>
                <li><a href="#" class="text-light">FAQ</a></li>
                <li><a href="#" class="text-light">Tipi di cucina</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col d-flex">
          <div class="card bg-secondary flex-fill">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">Porta DeliveBoo con te</h5>
              <div
                class="flex-grow-1 d-flex flex-column justify-content-center"
              >
                <a href="#" class="d-block mb-2">
                  <!-- <img src="/api/placeholder/135/40" alt="App Store" class="img-fluid"> -->
                </a>
                <a href="#" class="d-block">
                  <!-- <img src="/api/placeholder/135/40" alt="Google Play" class="img-fluid"> -->
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-md-6">
          <div class="d-flex">
            <a href="#" class="me-3"
              ><i class="bi bi-facebook text-light"></i
            ></a>
            <a href="#" class="me-3"
              ><i class="bi bi-twitter text-light"></i
            ></a>
            <a href="#" class="me-3"
              ><i class="bi bi-instagram text-light"></i
            ></a>
          </div>
        </div>
        <div class="col-md-6 text-md-end">
          <small>&copy; 2024 DeliveBoo</small>
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
footer {
  font-size: 0.9rem;
}
footer h5 {
  font-size: 1rem;
  font-weight: bold;
}
footer a:hover {
  text-decoration: underline;
}
card-h {
  height: 5rem;
}
</style>
