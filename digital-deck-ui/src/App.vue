<template>
  <main-menu />
</template>

<script>
import MainMenu from "./components/MainMenu.vue";

export default {
  name: "app",
  components: {
    MainMenu,
  },
  mounted() {
    this.$socket.on("hello-world", () => {
      console.log("Hello World!");
    });
  }
};
</script>

<style>
@import "./assets/base.css";
</style>
