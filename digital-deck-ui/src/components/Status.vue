<template>
  <div class="total">
    <div v-if="$store.getters.getGameState === 0">Current total: {{ total }}</div>
    <div v-else>{{ winnersList }}</div>
    <button
      v-if="$store.getters.getGameState === 0"
      class="button"
      :class="{ disabled: !isCurrentTurn }"
      :disabled="!isCurrentTurn"
      @click="endTurn"
    >
      Stand
    </button>
    <button
      v-if="$store.getters.getGameState === 0"
      class="button"
      :class="{ disabled: !isFirstMove || !isCurrentTurn }"
      :disabled="!isFirstMove || !isCurrentTurn"
      @click="onSurrenderClick"
    >
      Surrender
    </button>
    <button
      v-if="$store.getters.getGameState === 1 && this.$store.getters.getPlayerId === 0"
      class="button"
      @click="onResetClick"
    >
      Play Again
    </button>
  </div>
</template>

<script>
import CardValue from "./CardValue.js";

export default {
  name: "status",
  created() {
    this.$socket.on("setTurn", ( { playerId } ) => {
      if(playerId === this.$store.getters.getPlayerId)
        this.$store.commit("setCurrentTurn", true);
    });

    this.$socket.on("gameEnded", ({ table, winners }) => {
      this.$store.commit("setTableCards", table);
      this.$store.commit("setWinners", winners);
      this.$store.commit("setGameState", 1);
    });

    this.$socket.on("gameResetted", () => {
      this.$store.dispatch("retrieveSession", {
        sessionId: this.$store.getters.getSessionId
      });
      this.$store.commit("setGameState", 0);
    });
  },

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

      aces.forEach(() => {
        total += total <= 10 ? 11 : 1;
      });

      if (cards.length === 2 && total === 21 && this.isCurrentTurn) {
        total = "BLACKJACK!";
        this.endTurn();
      } else if (total > 21) {
        total = "BUST!";
        this.endTurn();
      }

      return total;
    },

    isCurrentTurn() {
      return this.$store.getters.isCurrentTurn;
    },

    isFirstMove() {
      return this.$store.getters.getPlayerCards.length === 2;
    },

    winnersList() {
      return this.$store.getters.getWinners.length === 0 ? "Dealer wins" : "Winners: " + this.$store.getters.getWinners;
    }
  },
  methods: {
    onSurrenderClick() {
      this.$store.dispatch("surrender").then(() => {
        this.endTurn();
      });
    },

    onResetClick() {
      this.$store.commit("setGameState", 0);
      this.$store.dispatch("distributeCards", {
        sessionId: this.$store.getters.getSessionId,
        doClear: true
      }).then(() => {
          this.$store.dispatch("initBlackjack").then(() => {
            this.$socket.emit("resetGame", {
              sessionId: this.$store.getters.getSessionId
            });
          });
      });
    },

    endTurn() {
      this.$store.commit("setCurrentTurn", false);
      this.$socket.emit("endTurn", {
        sessionId: this.$store.getters.getSessionId,
        playerId: this.$store.getters.getPlayerId
      });

      if (this.$store.getters.getPlayerId >= this.$store.getters.getPlayersInfo.length - 1) {
        this.$store.dispatch("dealersTurn").then(() => {
          this.$store.commit("setGameState", 1);
          this.$socket.emit("endGame", {
            sessionId: this.$store.getters.getSessionId,
            table: { cards: this.$store.getters.getTableCards },
            winners: this.$store.getters.getWinners
          });
        });
      }
    }
  },
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