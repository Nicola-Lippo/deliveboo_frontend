import { createRouter, createWebHistory } from "vue-router";

import AppHomePage from "./pages/AppHomePage.vue";
import AppCheckout from "./pages/AppCheckoutPage.vue";
import RestaurantDetails from "./pages/RestaurantDetails.vue";

import axios from "axios";
import AppConfirmPage from "./pages/AppConfirmPage.vue";

// Funzione per caricare gli slug dall'API e aggiungere le route dinamiche
async function addDynamicRoutes() {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/restaurants");
    const slugs = response.slug;

    // slugs.forEach((slug) => {
    //   router.addRoute({
    //     path: `/${slug}`,
    //     name: `Slug-${slug}`,
    //     component: () => import("./views/DynamicPage.vue"),
    //     props: { slug },
    //   });
    // });

    // Forza un re-render del router
    router.go(router.currentRoute);
  } catch (error) {
    console.error("Errore nel caricamento degli slug:", error);
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: AppHomePage,
    },

    {
      path: "/checkout",
      name: "checkout",
      component: AppCheckout,
    },
    {
      path: "/confirm",
      name: "confirm",
      component: AppConfirmPage,
    },

    {
      path: "/restaurant/:slug",
      name: "RestaurantDetails",
      component: RestaurantDetails,
      props: true,
    },
    // Rotta catch-all per 404
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("./pages/NotFound.vue"),
    },
  ],
});

export { router };
