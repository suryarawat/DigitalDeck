<template>
  <div class="table-area">
    <div
      v-for="(card, index) in this.$store.getters.getTableCards"
      :key="card"
      :id="'tablecard' + index"
      :style="
        'position: absolute; transform: translate(' +
        index * (getWindowWidth() / this.$store.getters.getTableCards.length) +
        'px' +
        ', 0px);'
      "
      v-on:click="flipCard(card)"
    >
      <img :src="cardImage(card)" style="height: 239px; width: 155px"/>
    </div>
  </div>
</template>

<script>
import CardDeckImageEnum from "./CardDeckImageEnum.js";

export default {
  name: "table-area",
  mounted() {
    this.$socket.on("cardPlayed", ({ table, player }) => {
      this.$store.commit("setTableCards", table);
    });
  },
  methods: {
    cardImage(card) {
      return card > 0
        ? CardDeckImageEnum.FRONT[(card - 1) % 52]
        : CardDeckImageEnum.BACK.DEFAULT;
    },

    flipCard(card) {
      if (this.$store.getters.getGamemode != 1)
        this.$store.commit('flipCard', card);
    },

    getWindowWidth() {
      return window.innerWidth - 100;
    },
  },
};
</script>

<style scoped>
.table-area {
  height: 100%;
}
</style>