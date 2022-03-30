<template>
  <div class="total">
    <div>Current total: {{ total }}</div>
    <button
      v-if="$store.getters.getGameState === 0"
      class="button"
      :class="{ 'disabled' : !isCurrentTurn }"
      :disabled="!isCurrentTurn"
      @click="onStandClick">
      Stand
    </button>
    <button
      v-if="$store.getters.getGameState === 0"
      class="button"
      :class="{ 'disabled' : !isFirstMove || !isCurrentTurn }"
      :disabled="!isFirstMove || !isCurrentTurn"
      @click="onSurrenderClick">
      Surrender
    </button>
    <button
      v-if="$store.getters.getGameState === 1 && this.$store.getters.getPlayerId === 0"
      class="button"
      @click="onResetClick">
      Play Again
    </button>
  </div>
</template>

<script>
import CardValue from './CardValue.js';

export default {
  name: "status",
  computed: {
    total() {
      const cards = this.$store.getters.getPlayerCards;
      const aces = cards.filter((card) => {
        const cardId = (card - 1) % 52;
        return cardId === 0 || cardId === 13 || cardId === 26 || cardId === 39;
      });
      const noAces = cards.filter((card) => !aces.includes(card));

      let total = 0;

      noAces.forEach((card) => {
          total += CardValue[(card - 1) % 52];
      });

      aces.forEach((card) => {
          total += total <= 10 ? 11 : 1;
      });

      if (cards.length === 2 && total === 21) {
        total = "BLACKJACK!";
        this.$store.commit("setCurrentTurn", false);
      } else if (total > 21) {
        total = "BUST!";
        this.$store.commit("setCurrentTurn", false);
      }

      return total;
    },

    isCurrentTurn() {
      return this.$store.getters.isCurrentTurn;
    },

    isFirstMove() {
      return this.$store.getters.getPlayerCards.length === 2;
    }
  },
  methods: {
    onSurrenderClick() {
      this.$store.commit("setCurrentTurn", false);
      this.$store.dispatch("surrender");
    },

    onStandClick() {
      this.$store.commit("setCurrentTurn", false);
      this.$store.dispatch("stand");
    },

    onResetClick() {
      this.$store.commit("setGameState", 0);
      this.$store.dispatch("resetGame");
    }
  }
};
</script>

<style scoped>
@import "../assets/mainMenuStyles.css";

.disabled {
  background-color: gray;
  cursor: default;
}

.disabled:hover {
  background-color: gray;
}

.total {
  padding-top: 30%;
  font-size: 20px;
}
</style>