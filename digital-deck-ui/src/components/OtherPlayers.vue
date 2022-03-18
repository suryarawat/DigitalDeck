<template>
  <div>
    <div class="container">
      <div
        v-for="index in this.$store.getters.getNumPlayers - 1"
        :key="index"
        class="cards"
        
      >
      </div>
    </div>
  </div>
</template>

<script>
import CardDeckImageEnum from "./CardDeckImageEnum.js";

export default {
  name: "other-players",

  methods: {
    cardImage() {
      CardDeckImageEnum.BACK.DEFAULT;
    },
    getWindowWidth() {
      return window.innerWidth - 100;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
}

.cards{
    background-image: url(https://i.imgur.com/RO3DOEa.jpg);
    height: 14em;
    width: 10em;
    background-size: contain;
    overflow: none;
    background-repeat: no-repeat;
}
</style>