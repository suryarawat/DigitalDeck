<template>
  <main-menu />
</template>
<!-- Adding a comment to trigger CI -->
<script>
import MainMenu from "./components/MainMenu.vue";
export default {
  name: "app",
  components: {
    MainMenu,
  },
};
</script>

<style>
@import "./assets/base.css";
</style>
