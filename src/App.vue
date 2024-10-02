<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import AppHomePage from './pages/AppHomePage.vue';


export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    AppHomePage,
  }
}
</script>

<template>
  <AppHeader />
  <main>
    <router-view></router-view>
  </main>
  <AppFooter />
</template>

<style></style>
