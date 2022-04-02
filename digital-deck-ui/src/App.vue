<template>
  <main-menu />
</template>

<script>
import MainMenu from "./components/MainMenu.vue";

export let api_url =  "http://localhost:5000";
if ( process.env.NODE_ENV === 'production'){
    api_url = 'http://34.132.36.123:5000';
}

export default {
  name: "app",
  components: {
    MainMenu,
  },
  mounted() {
    this.$socket.on("hello-world", () => {
      console.log("Hello World!");
    });
    this.$socket.on("PlayerJoined", () => {
      console.log("a player has joined");
    });
  }
};
</script>

<style>
@import "./assets/base.css";
</style>
