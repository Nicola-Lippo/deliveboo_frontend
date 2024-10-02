<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div class="card" style="width: auto">
        <div class="card-header text-center">Dati Cliente</div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item my-2">
            <div class="row mb-3">
              <label for="name" class="col-sm-2 col-form-label"
                >Nome e Cognome:</label
              >
              <div class="col-sm-10">
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  required
                  @blur="validateName"
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="Es: Mario Rossi"
                />
                <div v-if="errors.name" class="invalid-feedback">
                  {{ errors.name }}
                </div>
              </div>
            </div>
          </li>
          <li class="list-group-item my-2">
            <div class="row mb-3">
              <label for="email" class="col-sm-2 col-form-label">Email:</label>
              <div class="col-sm-10">
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  @blur="validateEmail"
                  :class="{ 'is-invalid': errors.email }"
                  placeholder="Es: mario.rossi@example.com"
                />
                <div v-if="errors.email" class="invalid-feedback">
                  {{ errors.email }}
                </div>
              </div>
            </div>
          </li>
          <li class="list-group-item my-2">
            <div class="row mb-3">
              <label for="address" class="col-sm-2 col-form-label"
                >Indirizzo:</label
              >
              <div class="col-sm-10">
                <input
                  id="address"
                  v-model="address"
                  type="text"
                  required
                  @blur="validateAddress"
                  :class="{ 'is-invalid': errors.address }"
                  placeholder="Es: Via Roma 123"
                />
                <div v-if="errors.address" class="invalid-feedback">
                  {{ errors.address }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div ref="dropinContainer"></div>
      <button
        class="action-btn my-5"
        type="submit"
        :disabled="!isFormValid || !isPaymentMethodReady"
      >
        Paga
      </button>
    </form>
  </div>
</template>

<script>
import dropin from "braintree-web-drop-in";
import axios from "axios";

export default {
  name: "AppPayment",
  data() {
    return {
      dropinInstance: null,
      isPaymentMethodReady: false,
      isLoading: true,
      error: null,
      cseKey: "sandbox_nddp4k74_cyss7gspwctv5d4t",
      name: "",
      email: "",
      address: "",
      errors: {
        name: "",
        email: "",
        address: "",
      },
    };
  },

  computed: {
    isFormValid() {
      return (
        this.name &&
        this.email &&
        this.address &&
        !this.errors.name &&
        !this.errors.email &&
        !this.errors.address
      );
    },
  },

  async created() {
    await this.initializeAxios();
  },

  mounted() {
    this.$nextTick(() => {
      this.initializeBraintreeWithRetry();
    });
  },

  methods: {
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },

    async initializeAxios() {
      axios.defaults.withCredentials = true;
      axios.defaults.baseURL = "http://localhost:8000";

      try {
        // Recupera il token CSRF
        await axios.get("/sanctum/csrf-cookie");
        console.log("CSRF cookie impostato con successo");
      } catch (error) {
        console.error("Errore nell'ottenere il CSRF cookie:", error);
      }
    },

    async initializeBraintreeWithRetry(retries = 5) {
      for (let i = 0; i < retries; i++) {
        try {
          await this.initializeBraintree();
          return;
        } catch (error) {
          console.error(`Tentativo ${i + 1} fallito:`, error);
          if (i === retries - 1) {
            this.error = `Non è stato possibile caricare il form di pagamento dopo ${retries} tentativi.`;
            this.isLoading = false;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }
    },

    async initializeBraintree() {
      this.isLoading = true;
      console.log("Inizializzazione di Braintree con CSE Key:", this.cseKey);

      if (!this.$refs.dropinContainer) {
        throw new Error("Container per Braintree non trovato nei refs");
      }

      console.log("Container ref:", this.$refs.dropinContainer);

      try {
        this.dropinInstance = await dropin.create({
          authorization: this.cseKey,
          container: this.$refs.dropinContainer,
          card: {
            overrides: {
              styles: {
                // Puoi personalizzare lo stile qui
              },
            },
          },
        });

        console.log("Braintree inizializzato con successo");
        this.dropinInstance.on("paymentMethodRequestable", () => {
          this.isPaymentMethodReady = true;
        });

        this.dropinInstance.on("noPaymentMethodRequestable", () => {
          this.isPaymentMethodReady = false;
        });

        this.isLoading = false;
      } catch (error) {
        console.error("Errore durante l'inizializzazione di Braintree:", error);
        throw error;
      }
    },

    async sendPaymentToBackend(nonce) {
      try {
        axios.defaults.withCredentials = true;
        const token = this.getCookie("XSRF-TOKEN");
        if (token) {
          axios.defaults.headers.common["X-XSRF-TOKEN"] =
            decodeURIComponent(token);
        } else {
          console.warn("CSRF token not found in cookie");
        }

        const response = await axios.post("/api/process-payment", {
          paymentMethodNonce: nonce,
          name: this.name,
          email: this.email,
          address: this.address,
          cart: JSON.parse(sessionStorage.getItem("cart")),
        });

        sessionStorage.setItem("currentOrderAddress", this.address);
        sessionStorage.setItem("currentOrderId", response.data.order_id);
        console.log("ID dell'ordine:", response.data.order_id);

        return response.data;
      } catch (error) {
        console.error("Errore nell'invio dei dati al backend:", error);
        throw error;
      }
    },

    validateName() {
      const nameParts = this.name.trim().split(/\s+/);
      if (nameParts.length < 2) {
        this.errors.name = "Inserisci sia il nome che il cognome";
      } else if (nameParts[0].length < 2 || nameParts[1].length < 2) {
        this.errors.name =
          "Sia il nome che il cognome devono avere almeno 2 caratteri";
      } else if (/\d/.test(this.name)) {
        this.errors.name = "Il nome non può contenere numeri";
      } else if (/[^a-zA-Z\s]/.test(this.name)) {
        this.errors.name = "Il nome non può contenere caratteri speciali";
      } else {
        this.errors.name = "";
      }
    },

    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email) {
        this.errors.email = "L'email è obbligatoria";
      } else if (!emailRegex.test(this.email)) {
        this.errors.email = "Inserisci un indirizzo email valido";
      } else {
        this.errors.email = "";
      }
    },

    validateAddress() {
      const lastSpaceIndex = this.address.lastIndexOf(" ");
      if (lastSpaceIndex === -1) {
        this.errors.address = "Inserisci sia la via che il numero civico";
        return;
      }

      const streetName = this.address.slice(0, lastSpaceIndex).trim();
      const streetNumber = this.address.slice(lastSpaceIndex + 1).trim();

      if (streetName.length < 3) {
        this.errors.address = "Il nome della via deve avere almeno 3 caratteri";
      } else if (/[^a-zA-Z\s]/.test(streetName)) {
        this.errors.address =
          "Il nome della via non può contenere caratteri speciali o numeri";
      } else if (!/^\d+[a-zA-Z]?$/.test(streetNumber)) {
        this.errors.address =
          "Inserisci un numero civico valido (numero seguito opzionalmente da una lettera)";
      } else {
        this.errors.address = "";
      }
    },

    validateForm() {
      this.validateName();
      this.validateEmail();
      this.validateAddress();
      return this.isFormValid;
    },

    async onSubmit() {
      if (!this.validateForm()) {
        console.log("Form non valido, impossibile procedere con il pagamento");
        return;
      }

      if (!this.dropinInstance) {
        this.error = "Istanza Braintree non inizializzata";
        return;
      }

      try {
        const { nonce } = await this.dropinInstance.requestPaymentMethod();
        console.log("Nonce di pagamento:", nonce);

        const response = await this.sendPaymentToBackend(nonce);

        if (response.success) {
          console.log("Pagamento avvenuto con successo");
          // Qui potresti voler reindirizzare l'utente o mostrare un messaggio di successo
          // Nel componente o nella pagina di checkout, dopo che il pagamento è stato processato con successo
          //window.dispatchEvent(new Event("order-completed"));
          // Reindirizzamento alla pagina di successo
          this.$router.push("/confirm");
        } else {
          this.error =
            response.message ||
            "Si è verificato un errore durante il pagamento.";
        }
      } catch (error) {
        console.error("Errore nella richiesta del metodo di pagamento:", error);
        this.error =
          error.response?.data?.message ||
          "Si è verificato un errore durante il pagamento.";
      }
    },
  },

  beforeUnmount() {
    if (this.dropinInstance) {
      this.dropinInstance.teardown();
    }
  },
};
</script>

<style scoped lang="scss">
@use "../scss/partials/variables" as *;

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
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

.action-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.invalid-feedback {
  color: red;
  font-size: 0.875em;
  margin-top: 0.25rem;
}

.is-invalid {
  border-color: red;
}
</style>
