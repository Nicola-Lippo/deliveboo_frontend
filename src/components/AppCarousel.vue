<script>
import Carousel from "./Carousel.vue";
export default {
  name: "AppHomePage",
  data() {
    return {
      images: [
        "https://cdn.logojoy.com/wp-content/uploads/2018/05/30151550/1317.png",
        "https://cdn.logojoy.com/wp-content/uploads/2018/05/30151557/1516.png",
        "https://cdn.logojoy.com/wp-content/uploads/2018/05/30151524/822.png",
        "https://cdn.logojoy.com/wp-content/uploads/2018/05/15150136/2120.png",
        "https://cdn.logojoy.com/wp-content/uploads/2018/05/30151559/16_big1.png",
        "https://cdn.logojoy.com/wp-content/uploads/2018/05/30151554/1417.png",

      ],
      images2: [
        "https://cdn.logojoy.com/wp-content/uploads/2018/05/30151603/1715.png",
        "https://cdn.logojoy.com/wp-content/uploads/2018/05/30151511/427.png",
        "https://cdn.logojoy.com/wp-content/uploads/2018/05/30151606/1816.png",
        "https://cdn.logojoy.com/wp-content/uploads/2018/05/30151609/1916.png",
        "https://cdn.logojoy.com/wp-content/uploads/2018/05/15150147/3129.png",
        "https://cdn.logojoy.com/wp-content/uploads/2018/05/15150201/4122.png",

      ],
    };
  },
  components: {
    Carousel,
  },
};
</script>

<template>
  <Carousel :images="images" />
  <Carousel :images="images2" />
</template>

<style></style>
