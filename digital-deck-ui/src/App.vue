<template>
  <main-menu />
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
import io from "socket.io-client";

export default {
  name: "app",
  components: {
    MainMenu,
  },
  data: () => {
    return {
      socket: null
    };
  },
  created() {
    this.socket = io("http://localhost:5000");
  },
  mounted() {
    this.socket.on("hello-world", () => {
      console.log("Hello World!");
    });
  }
};
</script>

<style>
@import "./assets/base.css";
</style>
