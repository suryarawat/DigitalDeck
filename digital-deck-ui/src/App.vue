<template>
  <main-menu />
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
import io from "socket.io-client";

export let api_url =  "http://localhost:5000";
if ( process.env.NODE_ENV === 'production'){
    api_url = 'http://10.16.15.162';
}

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
    this.socket = io(api_url);
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
