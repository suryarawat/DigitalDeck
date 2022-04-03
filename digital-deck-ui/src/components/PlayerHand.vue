<template>
  <div>
    <div
      v-for="(card, index) in this.$store.getters.getPlayerCards"
      class="player-hand"
      :key="card"
      :id="'card' + index"
      @click="playCard(card, index)"
      :style="
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
        ? CardDeckImageEnum.FRONT[(card - 1) % 52]
        : CardDeckImageEnum.BACK.DEFAULT;
    },

    playCard(card, index) {
      this.$store.dispatch("playCards", {
        card: card,
        index: index,
      }).then(() => {
        this.$socket.emit("playCard", {
          sessionId: this.$store.getters.getSessionId,
          cardsOnTable: this.$store.getters.getTableCards,
          player: { // for player card display synchronization
            id: this.$store.getters.getPlayerId,
            numCards: this.$store.getters.getPlayerCards.length
          }
        });
      });
    },

    getWindowWidth() {
      return window.innerWidth * 0.7;
    },
  },
};
</script>

<style scoped>
.player-hand {
  cursor: pointer;
}
</style>