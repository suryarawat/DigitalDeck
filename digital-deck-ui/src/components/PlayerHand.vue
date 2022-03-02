<template>
  <div id="player-area">
    <div
      v-for="(card, index) in this.$store.getters.getPlayerCards"
      :key="card"
      v-bind:id="'card' + index"
      v-bind:style="
        'position: absolute; transform: translate(' +
        index * (getWindowWidth() / this.$store.getters.getPlayerCards.length) +
        'px' +
        ', 0px);'
      "
    >
      <img :src="cardImage(card)" />
    </div>
  </div>
</template>

<script>
import CardDeckImageEnum from "./CardDeckImageEnum.js";

export default {
  name: "player-hand",

  methods: {
    cardImage(card) {
      return card > 0
        ? CardDeckImageEnum.FRONT[card - 1]
        : CardDeckImageEnum.BACK.ONE;
    },

    getWindowWidth() {
      return 1355;
    },
  },
};
</script>